import { useState, useEffect } from "react";
import { CalendarClock, X, ChevronRight, ChevronLeft, Check, User, Mail, Phone, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { format, addDays, isAfter, isBefore, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";

type Step = "date" | "time" | "form" | "confirm";

const BookingWidget = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("date");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedMeetingType, setSelectedMeetingType] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const queryClient = useQueryClient();

  // Fetch meeting types
  const { data: meetingTypes = [] } = useQuery({
    queryKey: ["meeting-types"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("meeting_types")
        .select("*")
        .eq("is_active", true)
        .order("sort_order");
      if (error) throw error;
      return data;
    },
  });

  // Auto-select first meeting type
  useEffect(() => {
    if (meetingTypes.length > 0 && !selectedMeetingType) {
      setSelectedMeetingType(meetingTypes[0].id);
    }
  }, [meetingTypes, selectedMeetingType]);

  // Use hardcoded 24/7 slots - no need to fetch booking settings
  const slotInterval = 60; // 1-hour slots

  // Fetch existing bookings for selected date
  const { data: existingBookings = [] } = useQuery({
    queryKey: ["bookings-for-date", selectedDate?.toISOString()],
    queryFn: async () => {
      if (!selectedDate) return [];
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const { data, error } = await supabase
        .from("bookings")
        .select("booking_time, status")
        .eq("booking_date", dateStr)
        .in("status", ["pending", "confirmed"]);
      if (error) throw error;
      return data;
    },
    enabled: !!selectedDate,
  });

  // Generate 24/7 time slots (1-hour intervals)
  const getTimeSlots = () => {
    const slots: string[] = [];
    for (let h = 0; h < 24; h++) {
      slots.push(`${h.toString().padStart(2, "0")}:00`);
    }
    return slots;
  };

  const bookedTimes = new Set(
    existingBookings.map((b) => (b.booking_time as string).substring(0, 5))
  );

  const timeSlots = getTimeSlots();

  // Disable past dates only (all days of week are available)
  const isDateDisabled = (date: Date) => {
    if (isBefore(date, startOfDay(new Date()))) return true;
    if (isAfter(date, addDays(new Date(), 60))) return true;
    return false;
  };

  // Submit booking
  const bookMutation = useMutation({
    mutationFn: async () => {
      if (!selectedDate || !selectedTime || !selectedMeetingType) throw new Error("Missing data");

      // Check conflict
      const dateStr = format(selectedDate, "yyyy-MM-dd");
      const { data: conflict } = await supabase
        .from("bookings")
        .select("id")
        .eq("booking_date", dateStr)
        .eq("booking_time", selectedTime + ":00")
        .in("status", ["pending", "confirmed"])
        .limit(1);

      if (conflict && conflict.length > 0) {
        throw new Error("This timeslot is no longer available. Please choose another time.");
      }

      const { error } = await supabase.from("bookings").insert({
        meeting_type_id: selectedMeetingType,
        client_name: formData.name,
        client_email: formData.email,
        client_phone: formData.phone || null,
        booking_date: dateStr,
        booking_time: selectedTime + ":00",
      });
      if (error) throw error;

      // Send notification email
      try {
        const meetingType = meetingTypes.find((mt) => mt.id === selectedMeetingType);
        await supabase.functions.invoke("send-booking-email", {
          body: {
            type: "new_booking",
            clientName: formData.name,
            clientEmail: formData.email,
            clientPhone: formData.phone,
            meetingType: meetingType?.name || "Meeting",
            bookingDate: dateStr,
            bookingTime: selectedTime,
          },
        });
      } catch (e) {
        console.error("Email notification failed:", e);
      }
    },
    onSuccess: () => {
      setStep("confirm");
      queryClient.invalidateQueries({ queryKey: ["bookings-for-date"] });
    },
    onError: (error) => {
      toast({ title: "Booking Failed", description: error.message, variant: "destructive" });
    },
  });

  const resetWidget = () => {
    setStep("date");
    setSelectedDate(undefined);
    setSelectedTime(null);
    setSelectedMeetingType(null);
    setFormData({ name: "", email: "", phone: "" });
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(resetWidget, 300);
  };

  const selectedMeetingTypeObj = meetingTypes.find((mt) => mt.id === selectedMeetingType);

  const formatTime12 = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    return `${h === 0 ? 12 : h > 12 ? h - 12 : h}:${m.toString().padStart(2, "0")} ${ampm}`;
  };

  return (
    <>
      {/* Floating Icon */}
      <motion.button
        onClick={() => setOpen(true)}
        className="fixed right-6 bottom-6 z-50 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Book a Meeting"
      >
        <CalendarClock className="w-6 h-6" />
      </motion.button>

      {/* Overlay + Panel */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
              onClick={handleClose}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 z-50 w-full sm:max-w-md bg-background shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <div>
                  <h2 className="text-lg font-bold text-foreground">Book a Meeting</h2>
                  <p className="text-sm text-muted-foreground">Schedule a session with our team</p>
                </div>
                <button onClick={handleClose} className="p-2 rounded-full hover:bg-muted transition-colors">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Steps indicator */}
              {step !== "confirm" && (
                <div className="flex items-center gap-2 px-6 py-3 border-b border-border">
                  {(["date", "time", "form"] as Step[]).map((s, i) => (
                    <div key={s} className="flex items-center gap-2">
                      <div
                        className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors",
                          step === s
                            ? "bg-primary text-primary-foreground"
                            : (["date", "time", "form"].indexOf(step) > i)
                            ? "bg-primary/20 text-primary"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {["date", "time", "form"].indexOf(step) > i ? (
                          <Check className="w-3.5 h-3.5" />
                        ) : (
                          i + 1
                        )}
                      </div>
                      {i < 2 && <div className="w-8 h-0.5 bg-border" />}
                    </div>
                  ))}
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-h-0 overflow-y-auto px-4 sm:px-6 py-4">
                <AnimatePresence mode="wait">
                  {step === "date" && (
                    <motion.div
                      key="date"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div>
                        <h3 className="text-base font-semibold text-foreground mb-2">Pick a Date</h3>
                        <Calendar
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          disabled={isDateDisabled}
                          className="rounded-lg border border-border pointer-events-auto mx-auto"
                        />
                      </div>
                    </motion.div>
                  )}

                  {step === "time" && (
                    <motion.div
                      key="time"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <h3 className="text-base font-semibold text-foreground mb-1">
                        Available Slots — {selectedDate && format(selectedDate, "EEEE, MMM d")}
                      </h3>
                      {selectedMeetingTypeObj && (
                        <p className="text-xs text-muted-foreground mb-4">
                          {selectedMeetingTypeObj.name} • {selectedMeetingTypeObj.duration_minutes} min
                        </p>
                      )}
                      {timeSlots.length === 0 ? (
                        <p className="text-center text-muted-foreground py-8">No slots available for this date.</p>
                      ) : (
                        <div className="grid grid-cols-3 gap-2">
                          {timeSlots.map((t) => {
                            const taken = bookedTimes.has(t);
                            return (
                              <button
                                key={t}
                                disabled={taken}
                                onClick={() => setSelectedTime(t)}
                                className={cn(
                                  "py-2.5 px-2 rounded-lg text-sm font-medium transition-all border",
                                  taken
                                    ? "bg-muted text-muted-foreground/50 border-border cursor-not-allowed line-through"
                                    : selectedTime === t
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "border-border hover:border-primary/40 text-foreground"
                                )}
                              >
                                {formatTime12(t)}
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {step === "form" && (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20 text-sm">
                        <p className="font-semibold text-foreground">{selectedMeetingTypeObj?.name}</p>
                        <p className="text-muted-foreground">
                          {selectedDate && format(selectedDate, "EEEE, MMMM d, yyyy")} at{" "}
                          {selectedTime && formatTime12(selectedTime)}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <Label htmlFor="bk-name" className="text-sm font-medium">Full Name *</Label>
                          <div className="relative mt-1">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="bk-name"
                              value={formData.name}
                              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                              placeholder="John Doe"
                              className="pl-9"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="bk-email" className="text-sm font-medium">Email Address *</Label>
                          <div className="relative mt-1">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="bk-email"
                              type="email"
                              value={formData.email}
                              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                              placeholder="john@example.com"
                              className="pl-9"
                              required
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="bk-phone" className="text-sm font-medium">Phone Number (optional)</Label>
                          <div className="relative mt-1">
                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input
                              id="bk-phone"
                              type="tel"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              placeholder="+1 (555) 123-4567"
                              className="pl-9"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === "confirm" && (
                    <motion.div
                      key="confirm"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center justify-center py-12 text-center"
                    >
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                        <Check className="w-8 h-8 text-green-600" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-2">Booking Submitted!</h3>
                      <p className="text-sm text-muted-foreground max-w-xs">
                        Your meeting has been scheduled for{" "}
                        <strong>{selectedDate && format(selectedDate, "MMMM d, yyyy")}</strong> at{" "}
                        <strong>{selectedTime && formatTime12(selectedTime)}</strong>.
                        We'll send you a confirmation email once the meeting time is verified.
                      </p>
                      <Button className="mt-6" onClick={handleClose}>
                        Done
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Footer Navigation */}
              {step !== "confirm" && (
                <div className="px-6 py-4 border-t border-border flex items-center justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (step === "time") setStep("date");
                      else if (step === "form") setStep("time");
                    }}
                    disabled={step === "date"}
                    className="gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" /> Back
                  </Button>

                  {step === "date" && (
                    <Button
                      size="sm"
                      onClick={() => setStep("time")}
                      disabled={!selectedDate}
                      className="gap-1"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                  {step === "time" && (
                    <Button
                      size="sm"
                      onClick={() => setStep("form")}
                      disabled={!selectedTime}
                      className="gap-1"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </Button>
                  )}
                  {step === "form" && (
                    <Button
                      size="sm"
                      onClick={() => bookMutation.mutate()}
                      disabled={!formData.name || !formData.email || bookMutation.isPending}
                      className="gap-1"
                    >
                      {bookMutation.isPending ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Booking...</>
                      ) : (
                        <>Confirm Booking <Check className="w-4 h-4" /></>
                      )}
                    </Button>
                  )}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default BookingWidget;
