import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  CalendarIcon, CheckCircle, XCircle, RefreshCw, Search,
  Mail, Clock, Filter, Loader2
} from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  confirmed: "bg-green-100 text-green-800 border-green-200",
  rescheduled: "bg-blue-100 text-blue-800 border-blue-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

const AdminBookings = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [rescheduleDialog, setRescheduleDialog] = useState<any>(null);
  const [rescheduleDate, setRescheduleDate] = useState<Date | undefined>();
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["admin-bookings", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("bookings")
        .select("*, meeting_types(name, duration_minutes)")
        .order("booking_date", { ascending: false });
      if (statusFilter !== "all") query = query.eq("status", statusFilter);
      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const filteredBookings = bookings.filter((b: any) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      b.client_name?.toLowerCase().includes(q) ||
      b.client_email?.toLowerCase().includes(q) ||
      (b.meeting_types as any)?.name?.toLowerCase().includes(q)
    );
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status, notes }: { id: string; status: string; notes?: string }) => {
      const update: any = { status, updated_at: new Date().toISOString() };
      if (notes !== undefined) update.admin_notes = notes;
      const { error } = await supabase.from("bookings").update(update).eq("id", id);
      if (error) throw error;

      // Send email on confirm
      if (status === "confirmed") {
        const booking = bookings.find((b: any) => b.id === id);
        if (booking) {
          try {
            await supabase.functions.invoke("send-booking-email", {
              body: {
                type: "booking_confirmed",
                clientName: booking.client_name,
                clientEmail: booking.client_email,
                meetingType: (booking.meeting_types as any)?.name || "Meeting",
                bookingDate: booking.booking_date,
                bookingTime: (booking.booking_time as string).substring(0, 5),
              },
            });
          } catch (e) {
            console.error("Confirmation email failed:", e);
          }
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      toast({ title: "Booking Updated" });
    },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const reschedule = useMutation({
    mutationFn: async () => {
      if (!rescheduleDialog || !rescheduleDate || !rescheduleTime) return;
      const { error } = await supabase.from("bookings").update({
        booking_date: format(rescheduleDate, "yyyy-MM-dd"),
        booking_time: rescheduleTime + ":00",
        status: "rescheduled",
        admin_notes: adminNotes,
        updated_at: new Date().toISOString(),
      }).eq("id", rescheduleDialog.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
      setRescheduleDialog(null);
      toast({ title: "Meeting Rescheduled" });
    },
    onError: (e) => toast({ title: "Error", description: e.message, variant: "destructive" }),
  });

  const formatTime12 = (t: string) => {
    const [h, m] = t.substring(0, 5).split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    return `${h === 0 ? 12 : h > 12 ? h - 12 : h}:${m.toString().padStart(2, "0")} ${ampm}`;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Bookings</h1>
            <p className="text-sm text-muted-foreground">Manage meeting requests</p>
          </div>
          <Badge variant="outline" className="text-sm">
            {bookings.filter((b: any) => b.status === "pending").length} Pending
          </Badge>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or type..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="rescheduled">Rescheduled</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="border border-border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>Meeting Type</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No bookings found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((b: any) => (
                    <TableRow key={b.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium text-foreground">{b.client_name}</p>
                          <p className="text-xs text-muted-foreground">{b.client_email}</p>
                          {b.client_phone && (
                            <p className="text-xs text-muted-foreground">{b.client_phone}</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-muted-foreground" />
                          <span className="text-sm">{(b.meeting_types as any)?.name || "—"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm font-medium">{format(new Date(b.booking_date), "MMM d, yyyy")}</p>
                        <p className="text-xs text-muted-foreground">{formatTime12(b.booking_time)}</p>
                      </TableCell>
                      <TableCell>
                        <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold border", statusColors[b.status] || "")}>
                          {b.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          {b.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                                onClick={() => updateStatus.mutate({ id: b.id, status: "confirmed" })}
                              >
                                <CheckCircle className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-8 text-destructive hover:bg-destructive/10"
                                onClick={() => updateStatus.mutate({ id: b.id, status: "cancelled" })}
                              >
                                <XCircle className="w-4 h-4" />
                              </Button>
                            </>
                          )}
                          {(b.status === "pending" || b.status === "confirmed") && (
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-8"
                              onClick={() => {
                                setRescheduleDialog(b);
                                setRescheduleDate(new Date(b.booking_date));
                                setRescheduleTime((b.booking_time as string).substring(0, 5));
                                setAdminNotes(b.admin_notes || "");
                              }}
                            >
                              <RefreshCw className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Reschedule Dialog */}
      <Dialog open={!!rescheduleDialog} onOpenChange={(o) => !o && setRescheduleDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reschedule Meeting</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label>New Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start mt-1", !rescheduleDate && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {rescheduleDate ? format(rescheduleDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={rescheduleDate}
                    onSelect={setRescheduleDate}
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <Label>New Time (HH:MM, 24h)</Label>
              <Input
                value={rescheduleTime}
                onChange={(e) => setRescheduleTime(e.target.value)}
                placeholder="14:00"
                className="mt-1"
              />
            </div>
            <div>
              <Label>Admin Notes</Label>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Reason for rescheduling..."
                className="mt-1"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRescheduleDialog(null)}>Cancel</Button>
            <Button onClick={() => reschedule.mutate()} disabled={reschedule.isPending}>
              {reschedule.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              Reschedule
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminBookings;
