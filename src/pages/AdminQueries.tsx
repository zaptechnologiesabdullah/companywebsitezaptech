import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Search, MessageSquare, Loader2, Eye, Send, Mail, Paperclip, ExternalLink } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

type FormQuery = {
  id: string; name: string; email: string; subject: string | null;
  message: string | null; status: 'new' | 'read' | 'resolved'; created_at: string;
  project_link?: string | null; attachment_url?: string | null;
};

const statusColors = { new: 'destructive', read: 'secondary', resolved: 'default' } as const;

const emailTemplates = [
  {
    name: 'Custom Email',
    subject: '',
    body: '',
  },
  {
    name: 'Thank You',
    subject: 'Thank You for Reaching Out',
    body: `Thank you for contacting Zap Technologies! We have received your inquiry and our team is currently reviewing it.\n\nWe will get back to you with a detailed response within 24-48 business hours.\n\nIf you have any urgent questions, feel free to reply to this email.\n\nBest regards,\nZap Technologies Team`,
  },
  {
    name: 'Quote Follow-up',
    subject: 'Your Project Quote is Ready',
    body: `Thank you for your interest in our services! We've reviewed your requirements and would love to discuss your project in more detail.\n\nWe've prepared a preliminary estimate based on the information you provided. Would you be available for a quick call this week to discuss the project scope, timeline, and pricing?\n\nPlease let us know your preferred time, and we'll set up a meeting.\n\nLooking forward to working with you!\n\nBest regards,\nZap Technologies Team`,
  },
  {
    name: 'Project Update',
    subject: 'Update on Your Project',
    body: `We wanted to give you a quick update on the progress of your project.\n\nOur team has been working diligently, and we're on track with the timeline we discussed. Here's a brief summary of what's been completed:\n\n• [Update 1]\n• [Update 2]\n• [Update 3]\n\nWe'll share more detailed progress in our next update. If you have any questions or feedback, don't hesitate to reach out.\n\nBest regards,\nZap Technologies Team`,
  },
  {
    name: 'Meeting Invitation',
    subject: 'Let\'s Schedule a Meeting',
    body: `We'd love to schedule a meeting with you to discuss your project requirements in detail.\n\nPlease let us know your availability for a 30-minute call this week. We're flexible and can accommodate most time zones.\n\nYou can also book a meeting directly through our calendar: [Insert Calendar Link]\n\nLooking forward to connecting!\n\nBest regards,\nZap Technologies Team`,
  },
];

const AdminQueries = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedQuery, setSelectedQuery] = useState<FormQuery | null>(null);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyTo, setReplyTo] = useState<FormQuery | null>(null);
  const [replySubject, setReplySubject] = useState('');
  const [replyBody, setReplyBody] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('Custom Email');
  const queryClient = useQueryClient();

  const { data: queries = [], isLoading } = useQuery({
    queryKey: ['admin-queries'],
    queryFn: async () => {
      const { data, error } = await supabase.from('form_queries').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      return data as FormQuery[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'new' | 'read' | 'resolved' }) => {
      const { error } = await supabase.from('form_queries').update({ status }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-queries'] });
      toast.success('Status updated!');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const sendReplyMutation = useMutation({
    mutationFn: async ({ recipientEmail, recipientName, subject, body }: {
      recipientEmail: string; recipientName: string; subject: string; body: string;
    }) => {
      const { data, error } = await supabase.functions.invoke('send-reply-email', {
        body: { recipientEmail, recipientName, subject, body },
      });
      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Failed to send email');
      return data;
    },
    onSuccess: () => {
      toast.success('Email sent successfully!');
      if (replyTo) {
        updateStatusMutation.mutate({ id: replyTo.id, status: 'resolved' });
      }
      setReplyOpen(false);
      setReplySubject('');
      setReplyBody('');
      setSelectedTemplate('Custom Email');
    },
    onError: (e: Error) => toast.error(`Failed to send: ${e.message}`),
  });

  const openReplyDialog = (query: FormQuery) => {
    setReplyTo(query);
    setReplySubject(`Re: ${query.subject || 'Your Inquiry'}`);
    setReplyBody('');
    setSelectedTemplate('Custom Email');
    setReplyOpen(true);
  };

  const handleTemplateChange = (templateName: string) => {
    setSelectedTemplate(templateName);
    const template = emailTemplates.find(t => t.name === templateName);
    if (template) {
      setReplySubject(template.subject || `Re: ${replyTo?.subject || 'Your Inquiry'}`);
      setReplyBody(template.body);
    }
  };

  const handleSendReply = () => {
    if (!replyTo || !replySubject.trim() || !replyBody.trim()) {
      toast.error('Please fill in subject and message');
      return;
    }
    sendReplyMutation.mutate({
      recipientEmail: replyTo.email,
      recipientName: replyTo.name,
      subject: replySubject,
      body: replyBody,
    });
  };

  const filtered = queries.filter(q => {
    const matchSearch = q.name.toLowerCase().includes(search.toLowerCase()) ||
      q.email.toLowerCase().includes(search.toLowerCase()) ||
      (q.subject || '').toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || q.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Form Queries</h1>
          <p className="text-sm text-muted-foreground">View and manage form submissions</p>
        </div>

        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <div className="flex items-center gap-2 flex-1">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search queries..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]"><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="new">New</SelectItem>
                  <SelectItem value="read">Read</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead className="hidden md:table-cell">Subject</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="hidden sm:table-cell">Date</TableHead>
                    <TableHead className="w-[120px] text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <MessageSquare className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No form submissions yet.</p>
                      </TableCell>
                    </TableRow>
                  ) : filtered.map(q => (
                    <TableRow key={q.id}>
                      <TableCell className="font-medium">{q.name}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{q.email}</TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{q.subject || '—'}</TableCell>
                      <TableCell>
                        <Badge variant={statusColors[q.status]}>{q.status}</Badge>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                        {new Date(q.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button variant="ghost" size="icon" onClick={() => {
                            setSelectedQuery(q);
                            if (q.status === 'new') updateStatusMutation.mutate({ id: q.id, status: 'read' });
                          }} title="View">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => openReplyDialog(q)} title="Reply via email">
                            <Mail className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* View Query Dialog */}
        <Dialog open={!!selectedQuery} onOpenChange={(open) => { if (!open) setSelectedQuery(null); }}>
          <DialogContent className="sm:max-w-[550px] max-h-[85vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Query from {selectedQuery?.name}</DialogTitle>
            </DialogHeader>
            {selectedQuery && (
              <div className="space-y-4 pt-2">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><span className="text-muted-foreground">Email:</span> <span className="font-medium">{selectedQuery.email}</span></div>
                  <div><span className="text-muted-foreground">Date:</span> <span className="font-medium">{new Date(selectedQuery.created_at).toLocaleString()}</span></div>
                </div>
                {selectedQuery.subject && (
                  <div className="text-sm"><span className="text-muted-foreground">Subject:</span> <span className="font-medium">{selectedQuery.subject}</span></div>
                )}
                <div className="bg-muted/50 rounded-lg p-4 text-sm whitespace-pre-wrap">{selectedQuery.message || 'No message'}</div>
                {selectedQuery.project_link && (
                  <div className="flex items-center gap-2 text-sm">
                    <ExternalLink className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-muted-foreground">Project Link:</span>
                    <a href={selectedQuery.project_link} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline truncate">{selectedQuery.project_link}</a>
                  </div>
                )}
                {selectedQuery.attachment_url && (
                  <div className="flex items-center gap-2 text-sm">
                    <Paperclip className="w-4 h-4 text-primary shrink-0" />
                    <span className="text-muted-foreground">Attachment:</span>
                    <a href={selectedQuery.attachment_url} target="_blank" rel="noopener noreferrer" className="font-medium text-primary hover:underline">View File</a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Select value={selectedQuery.status} onValueChange={(v) => {
                    updateStatusMutation.mutate({ id: selectedQuery.id, status: v as 'new' | 'read' | 'resolved' });
                    setSelectedQuery({ ...selectedQuery, status: v as 'new' | 'read' | 'resolved' });
                  }}>
                    <SelectTrigger className="w-[140px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="default" size="sm" onClick={() => {
                    setSelectedQuery(null);
                    openReplyDialog(selectedQuery);
                  }}>
                    <Mail className="h-4 w-4 mr-2" /> Reply
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Reply Email Dialog */}
        <Dialog open={replyOpen} onOpenChange={(open) => { if (!open) { setReplyOpen(false); } }}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Send className="h-5 w-5" /> Send Email to {replyTo?.name}
              </DialogTitle>
            </DialogHeader>
            {replyTo && (
              <div className="space-y-4 pt-2">
                {/* Recipient info */}
                <div className="bg-muted/50 rounded-lg p-3 text-sm">
                  <span className="text-muted-foreground">To:</span>{' '}
                  <span className="font-medium">{replyTo.name}</span>{' '}
                  <span className="text-muted-foreground">({replyTo.email})</span>
                </div>

                {/* Original message preview */}
                {replyTo.message && (
                  <div className="bg-muted/30 rounded-lg p-3 text-sm border border-border/50">
                    <p className="text-xs text-muted-foreground font-medium mb-1">Original Message:</p>
                    <p className="text-muted-foreground line-clamp-3">{replyTo.message}</p>
                  </div>
                )}

                {/* Template selector */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Email Template</Label>
                  <Select value={selectedTemplate} onValueChange={handleTemplateChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {emailTemplates.map(t => (
                        <SelectItem key={t.name} value={t.name}>{t.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Subject */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Subject</Label>
                  <Input
                    value={replySubject}
                    onChange={(e) => setReplySubject(e.target.value)}
                    placeholder="Email subject..."
                  />
                </div>

                {/* Body */}
                <div className="space-y-1.5">
                  <Label className="text-sm font-medium">Message</Label>
                  <Textarea
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    placeholder="Write your email message..."
                    className="min-h-[200px]"
                  />
                </div>

                {/* Send button */}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setReplyOpen(false)}>Cancel</Button>
                  <Button
                    onClick={handleSendReply}
                    disabled={sendReplyMutation.isPending || !replySubject.trim() || !replyBody.trim()}
                  >
                    {sendReplyMutation.isPending ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending...</>
                    ) : (
                      <><Send className="h-4 w-4 mr-2" /> Send Email</>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminQueries;
