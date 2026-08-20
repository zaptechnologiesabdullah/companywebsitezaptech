import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import {
  Plus, Pencil, Trash2, Search, FileText, Loader2,
  ArrowUp, ArrowDown, GripVertical, Download, ExternalLink, ChevronDown, ChevronUp, Upload, BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type LandingPage = {
  id: string; title: string; slug: string; page_type: string;
  is_visible: boolean; meta_title: string | null; meta_description: string | null;
  sort_order: number | null; created_at: string;
};

type Section = {
  id: string; landing_page_id: string; section_type: string;
  title: string | null; content: Record<string, any> | null; sort_order: number | null;
};

type FormField = {
  id: string; landing_page_id: string; field_label: string; field_type: string;
  is_required: boolean; options: string[] | null; sort_order: number | null;
};

type Submission = {
  id: string; form_data: Record<string, unknown>; attachment_urls: unknown[] | null; created_at: string;
};

type Resource = {
  id: string; landing_page_id: string; title: string; description: string | null;
  file_url: string | null; resource_type: string; category: string | null;
  download_count: number; sort_order: number | null; is_active: boolean;
};

// Dummy template data
const getDummyTemplate = () => ({
  page: {
    title: 'Get Free Resources Instantly!',
    slug: 'free-resources',
    meta_title: 'Free Resources - Download Guides & Templates',
    meta_description: 'Submit your details below and access our premium resources for free. Guides, templates, and tools to grow your skills.',
    is_visible: false,
  },
  sections: [
    { id: crypto.randomUUID(), section_type: 'heading', title: 'What We Do', content: {}, sort_order: 0 },
    { id: crypto.randomUUID(), section_type: 'text', title: null, content: { body: 'We provide valuable guides, templates, and downloadable tools to help you grow your skills. Our team curates high-quality resources covering web development, design, marketing, and business growth — all completely free.' }, sort_order: 1 },
    { id: crypto.randomUUID(), section_type: 'faq', title: 'Frequently Asked Questions', content: { items: [
      { question: 'Are these resources really free?', answer: 'Yes! All resources marked as "Free" can be downloaded at no cost after submitting your details.' },
      { question: 'How will I receive the resources?', answer: 'After submitting the form, download buttons will appear immediately on the page.' },
      { question: 'Can I share these resources?', answer: 'Yes, feel free to share the page link with others. They will need to submit their details to access downloads.' },
    ] }, sort_order: 2 },
  ],
  formFields: [
    { id: crypto.randomUUID(), field_label: 'Name', field_type: 'text', is_required: false, options: [], sort_order: 0 },
    { id: crypto.randomUUID(), field_label: 'Email', field_type: 'email', is_required: true, options: [], sort_order: 1 },
    { id: crypto.randomUUID(), field_label: 'WhatsApp Number', field_type: 'phone', is_required: true, options: [], sort_order: 2 },
  ],
  resources: [
    { id: crypto.randomUUID(), title: 'Web Development Starter Guide', description: 'A comprehensive guide for beginners covering HTML, CSS, and JavaScript basics.', file_url: '', resource_type: 'free', category: 'Guides', download_count: 0, sort_order: 0, is_active: true },
    { id: crypto.randomUUID(), title: 'Social Media Marketing Template', description: 'Ready-to-use templates for planning your social media content calendar.', file_url: '', resource_type: 'free', category: 'Templates', download_count: 0, sort_order: 1, is_active: true },
    { id: crypto.randomUUID(), title: 'Business Plan Template', description: 'Professional business plan template with financial projections and market analysis sections.', file_url: '', resource_type: 'free', category: 'Templates', download_count: 0, sort_order: 2, is_active: true },
    { id: crypto.randomUUID(), title: 'Advanced SEO Toolkit', description: 'Premium toolkit with advanced SEO strategies, keyword research worksheets, and audit checklists.', file_url: '', resource_type: 'premium', category: 'Tools', download_count: 0, sort_order: 3, is_active: true },
  ],
});

const SECTION_TYPES = [
  { value: 'heading', label: 'Heading' },
  { value: 'text', label: 'Text' },
  { value: 'image', label: 'Image' },
  { value: 'rich_text', label: 'Rich Text' },
  { value: 'faq', label: 'FAQ' },
] as const;

const FIELD_TYPES = [
  { value: 'text', label: 'Text' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'textarea', label: 'Textarea' },
  { value: 'select', label: 'Dropdown' },
  { value: 'file', label: 'File Upload' },
] as const;

const AdminResources = () => {
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('settings');
  const [viewingSubmissions, setViewingSubmissions] = useState<string | null>(null);
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null);

  // Form state
  const [pageForm, setPageForm] = useState({ title: '', slug: '', meta_title: '', meta_description: '', is_visible: false });
  const [sections, setSections] = useState<any[]>([]);
  const [formFields, setFormFields] = useState<any[]>([]);
  const [resources, setResources] = useState<any[]>([]);
  const [resourceForm, setResourceForm] = useState({ title: '', description: '', file_url: '', resource_type: 'free', category: '', is_active: true });
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // Only fetch resource-type pages
  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['admin-resource-pages'],
    queryFn: async () => {
      const { data, error } = await supabase.from('landing_pages').select('*').eq('page_type', 'resource').order('sort_order');
      if (error) throw error;
      return data as LandingPage[];
    },
  });

  const { data: submissions = [] } = useQuery({
    queryKey: ['resource-submissions', viewingSubmissions],
    enabled: !!viewingSubmissions,
    queryFn: async () => {
      const { data, error } = await supabase.from('landing_page_submissions')
        .select('*').eq('landing_page_id', viewingSubmissions!).order('created_at', { ascending: false });
      if (error) throw error;
      return data as Submission[];
    },
  });

  const toggleVisibility = useMutation({
    mutationFn: async ({ id, is_visible }: { id: string; is_visible: boolean }) => {
      const { error } = await supabase.from('landing_pages').update({ is_visible }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-resource-pages'] }); toast.success('Visibility updated'); },
    onError: (e: Error) => toast.error(e.message),
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const slug = pageForm.slug || pageForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const payload = {
        title: pageForm.title, slug, page_type: 'resource' as const,
        is_visible: pageForm.is_visible,
        meta_title: pageForm.meta_title || null,
        meta_description: pageForm.meta_description || null,
      };

      let pageId = editingId;
      if (editingId) {
        const { error } = await supabase.from('landing_pages').update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('landing_pages').insert(payload).select('id').single();
        if (error) throw error;
        pageId = data.id;
      }

      // Sections
      if (editingId) await supabase.from('landing_page_sections').delete().eq('landing_page_id', editingId);
      if (sections.length > 0) {
        const { error } = await supabase.from('landing_page_sections').insert(
          sections.map((s: any, i: number) => ({ landing_page_id: pageId!, section_type: s.section_type, title: s.title || null, content: s.content || {}, sort_order: i }))
        );
        if (error) throw error;
      }

      // Form fields
      if (editingId) await supabase.from('landing_page_form_fields').delete().eq('landing_page_id', editingId);
      if (formFields.length > 0) {
        const { error } = await supabase.from('landing_page_form_fields').insert(
          formFields.map((f: any, i: number) => ({ landing_page_id: pageId!, field_label: f.field_label, field_type: f.field_type, is_required: f.is_required, options: f.options || [], sort_order: i }))
        );
        if (error) throw error;
      }

      // Resources
      if (editingId) await supabase.from('resources').delete().eq('landing_page_id', editingId);
      if (resources.length > 0) {
        const { error } = await supabase.from('resources').insert(
          resources.map((r: any, i: number) => ({ landing_page_id: pageId!, title: r.title, description: r.description || null, file_url: r.file_url || null, resource_type: r.resource_type, category: r.category || null, is_active: r.is_active, sort_order: i }))
        );
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-resource-pages'] });
      toast.success(editingId ? 'Resource page updated!' : 'Resource page created!');
      resetForm();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('landing_pages').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-resource-pages'] }); toast.success('Deleted!'); },
    onError: (e: Error) => toast.error(e.message),
  });

  const resetForm = () => {
    setPageForm({ title: '', slug: '', meta_title: '', meta_description: '', is_visible: false });
    setSections([]); setFormFields([]); setResources([]);
    setEditingId(null); setIsDialogOpen(false); setActiveTab('settings');
    setEditingResourceId(null);
    setResourceForm({ title: '', description: '', file_url: '', resource_type: 'free', category: '', is_active: true });
  };

  const openCreate = () => {
    resetForm();
    const dummy = getDummyTemplate();
    setPageForm(dummy.page);
    setSections(dummy.sections);
    setFormFields(dummy.formFields);
    setResources(dummy.resources);
    setIsDialogOpen(true);
  };

  const openEdit = async (page: LandingPage) => {
    setPageForm({
      title: page.title, slug: page.slug, is_visible: page.is_visible,
      meta_title: page.meta_title || '', meta_description: page.meta_description || '',
    });
    setEditingId(page.id);
    const [sectionsRes, fieldsRes, resourcesRes] = await Promise.all([
      supabase.from('landing_page_sections').select('*').eq('landing_page_id', page.id).order('sort_order'),
      supabase.from('landing_page_form_fields').select('*').eq('landing_page_id', page.id).order('sort_order'),
      supabase.from('resources').select('*').eq('landing_page_id', page.id).order('sort_order'),
    ]);
    setSections(sectionsRes.data || []);
    setFormFields(fieldsRes.data || []);
    setResources(resourcesRes.data || []);
    setActiveTab('settings');
    setIsDialogOpen(true);
  };

  // Section helpers
  const addSection = (type: string) => {
    const content = type === 'faq' ? { items: [{ question: '', answer: '' }] } : {};
    setSections((prev: any[]) => [...prev, { id: crypto.randomUUID(), section_type: type, title: type === 'faq' ? 'Frequently Asked Questions' : '', content, sort_order: prev.length }]);
  };
  const updateSection = (id: string, updates: any) => setSections((prev: any[]) => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  const removeSection = (id: string) => setSections((prev: any[]) => prev.filter(s => s.id !== id));
  const moveSection = (idx: number, dir: -1 | 1) => setSections((prev: any[]) => { const a = [...prev]; const n = idx + dir; if (n < 0 || n >= a.length) return a; [a[idx], a[n]] = [a[n], a[idx]]; return a; });

  // Form field helpers
  const addFormField = () => setFormFields((prev: any[]) => [...prev, { id: crypto.randomUUID(), field_label: '', field_type: 'text', is_required: false, options: [], sort_order: prev.length }]);
  const updateFormField = (id: string, updates: any) => setFormFields((prev: any[]) => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  const removeFormField = (id: string) => setFormFields((prev: any[]) => prev.filter(f => f.id !== id));
  const moveField = (idx: number, dir: -1 | 1) => setFormFields((prev: any[]) => { const a = [...prev]; const n = idx + dir; if (n < 0 || n >= a.length) return a; [a[idx], a[n]] = [a[n], a[idx]]; return a; });

  // Resource helpers
  const addResource = () => {
    if (!resourceForm.title.trim()) { toast.error('Title required'); return; }
    const r = { id: editingResourceId || crypto.randomUUID(), ...resourceForm, description: resourceForm.description || null, file_url: resourceForm.file_url || null, category: resourceForm.category || null, download_count: 0, sort_order: resources.length };
    if (editingResourceId) setResources((prev: any[]) => prev.map(x => x.id === editingResourceId ? { ...x, ...r } : x));
    else setResources((prev: any[]) => [...prev, r]);
    setResourceForm({ title: '', description: '', file_url: '', resource_type: 'free', category: '', is_active: true });
    setEditingResourceId(null);
  };
  const editResource = (r: any) => { setEditingResourceId(r.id); setResourceForm({ title: r.title, description: r.description || '', file_url: r.file_url || '', resource_type: r.resource_type, category: r.category || '', is_active: r.is_active }); };
  const removeResource = (id: string) => setResources((prev: any[]) => prev.filter(r => r.id !== id));
  const moveResource = (idx: number, dir: -1 | 1) => setResources((prev: any[]) => { const a = [...prev]; const n = idx + dir; if (n < 0 || n >= a.length) return a; [a[idx], a[n]] = [a[n], a[idx]]; return a; });

  // CSV Export
  const exportCSV = () => {
    if (!submissions.length) return;
    const keys = new Set<string>();
    submissions.forEach(s => Object.keys(s.form_data).forEach(k => keys.add(k)));
    const headers = ['Submitted At', ...keys];
    const rows = submissions.map(s => [new Date(s.created_at).toLocaleString(), ...Array.from(keys).map(k => String((s.form_data as any)[k] || ''))]);
    const csv = [Array.from(headers).join(','), ...rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `resource-submissions-${Date.now()}.csv`; a.click();
  };

  const filtered = pages.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Resource Pages</h1>
            <p className="text-sm text-muted-foreground">Manage free downloadable resource landing pages</p>
          </div>
          <Button onClick={openCreate}><Plus className="h-4 w-4 mr-2" />Create Resource Page</Button>
        </div>

        {/* Submissions Viewer */}
        {viewingSubmissions && (
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Submissions — {pages.find(p => p.id === viewingSubmissions)?.title}</h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={exportCSV} disabled={!submissions.length}><Download className="h-4 w-4 mr-1" />CSV</Button>
                  <Button variant="ghost" size="sm" onClick={() => setViewingSubmissions(null)}>Close</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {!submissions.length ? (
                <p className="text-sm text-muted-foreground text-center py-8">No submissions yet.</p>
              ) : (
                <div className="space-y-2">
                  {submissions.map(sub => (
                    <Card key={sub.id} className="border-border/40">
                      <button className="w-full p-4 text-left flex items-center justify-between" onClick={() => setExpandedSubmission(expandedSubmission === sub.id ? null : sub.id)}>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">{(sub.form_data as any).Name || (sub.form_data as any).Email || 'Unknown'}</span>
                          <span className="text-xs text-muted-foreground">{new Date(sub.created_at).toLocaleString()}</span>
                        </div>
                        {expandedSubmission === sub.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                      {expandedSubmission === sub.id && (
                        <CardContent className="pt-0 border-t border-border/40">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                            {Object.entries(sub.form_data).map(([k, v]) => (
                              <div key={k}><p className="text-xs font-semibold text-muted-foreground uppercase">{k}</p><p className="text-sm text-foreground break-all">{String(v)}</p></div>
                            ))}
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Pages List */}
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search resource pages..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-sm" />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead className="hidden md:table-cell">Slug</TableHead>
                    <TableHead>Visible</TableHead>
                    <TableHead className="w-[160px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {!filtered.length ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-8">
                      <Download className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                      <p className="text-sm text-muted-foreground">No resource pages yet. Click "Create Resource Page" to get started.</p>
                    </TableCell></TableRow>
                  ) : filtered.map(page => (
                    <TableRow key={page.id}>
                      <TableCell className="font-medium">{page.title}</TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground text-sm">/p/{page.slug}</TableCell>
                      <TableCell><Switch checked={page.is_visible} onCheckedChange={v => toggleVisibility.mutate({ id: page.id, is_visible: v })} /></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(page)} title="Edit"><Pencil className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => { setViewingSubmissions(page.id); queryClient.invalidateQueries({ queryKey: ['resource-submissions', page.id] }); }} title="Submissions"><FileText className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => window.open(`/p/${page.slug}`, '_blank')} title="Preview"><ExternalLink className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(page.id)} className="text-destructive" title="Delete"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={open => { if (!open) resetForm(); else setIsDialogOpen(true); }}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>{editingId ? 'Edit' : 'Create'} Resource Page</DialogTitle></DialogHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="w-full grid grid-cols-5">
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="sections">Sections</TabsTrigger>
                <TabsTrigger value="form">Form</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              {/* Settings */}
              <TabsContent value="settings" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Title *</Label><Input value={pageForm.title} onChange={e => setPageForm({ ...pageForm, title: e.target.value })} placeholder="Page title" /></div>
                  <div className="space-y-2"><Label>Slug</Label><Input value={pageForm.slug} onChange={e => setPageForm({ ...pageForm, slug: e.target.value })} placeholder="auto-generated" /></div>
                </div>
                <div className="flex items-center gap-2">
                  <Switch id="vis" checked={pageForm.is_visible} onCheckedChange={v => setPageForm({ ...pageForm, is_visible: v })} />
                  <Label htmlFor="vis">Visible to public</Label>
                </div>
                <div className="space-y-2"><Label>SEO Title</Label><Input value={pageForm.meta_title} onChange={e => setPageForm({ ...pageForm, meta_title: e.target.value })} /></div>
                <div className="space-y-2"><Label>SEO Description</Label><Textarea value={pageForm.meta_description} onChange={e => setPageForm({ ...pageForm, meta_description: e.target.value })} rows={2} /></div>
              </TabsContent>

              {/* Sections */}
              <TabsContent value="sections" className="space-y-4 pt-4">
                <div className="flex flex-wrap gap-2">
                  {SECTION_TYPES.map(t => <Button key={t.value} variant="outline" size="sm" onClick={() => addSection(t.value)}><Plus className="h-3 w-3 mr-1" />{t.label}</Button>)}
                </div>
                {!sections.length && <p className="text-sm text-muted-foreground text-center py-6">No sections added.</p>}
                <div className="space-y-3">
                  {sections.map((section: any, idx: number) => (
                    <Card key={section.id} className="border-border/40">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2"><GripVertical className="h-4 w-4 text-muted-foreground" /><Badge variant="outline">{section.section_type}</Badge></div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={() => moveSection(idx, -1)} disabled={idx === 0}><ArrowUp className="h-3 w-3" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => moveSection(idx, 1)} disabled={idx === sections.length - 1}><ArrowDown className="h-3 w-3" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => removeSection(section.id)} className="text-destructive"><Trash2 className="h-3 w-3" /></Button>
                          </div>
                        </div>
                        {section.section_type === 'heading' && <Input placeholder="Heading text" value={section.title || ''} onChange={e => updateSection(section.id, { title: e.target.value })} />}
                        {section.section_type === 'text' && <Textarea placeholder="Text content..." value={section.content?.body || ''} rows={3} onChange={e => updateSection(section.id, { content: { body: e.target.value } })} />}
                        {section.section_type === 'rich_text' && <Textarea placeholder="HTML content..." value={section.content?.body || ''} rows={6} onChange={e => updateSection(section.id, { content: { body: e.target.value } })} />}
                        {section.section_type === 'image' && (
                          <div className="space-y-3">
                            {section.content?.url && <img src={section.content.url} alt={section.content?.alt || ''} className="h-24 w-auto rounded-md border border-border object-cover" />}
                            <div className="flex items-center gap-2">
                              <label className="flex items-center gap-2 px-4 py-2 border border-input rounded-md cursor-pointer hover:bg-muted transition-colors text-sm flex-shrink-0">
                                <Upload className="h-4 w-4" />Upload
                                <input type="file" accept="image/*" className="hidden" onChange={async e => {
                                  const file = e.target.files?.[0]; if (!file) return;
                                  const path = `landing-images/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
                                  toast.loading('Uploading...'); const { error } = await supabase.storage.from('form-attachments').upload(path, file); toast.dismiss();
                                  if (error) { toast.error('Failed'); return; }
                                  const { data: u } = supabase.storage.from('form-attachments').getPublicUrl(path);
                                  updateSection(section.id, { content: { ...section.content, url: u.publicUrl } }); toast.success('Uploaded!');
                                }} />
                              </label>
                              <Input placeholder="or paste URL" value={section.content?.url || ''} className="flex-1" onChange={e => updateSection(section.id, { content: { ...section.content, url: e.target.value } })} />
                            </div>
                            <Input placeholder="Alt text" value={section.content?.alt || ''} onChange={e => updateSection(section.id, { content: { ...section.content, alt: e.target.value } })} />
                          </div>
                        )}
                        {section.section_type === 'faq' && (
                          <div className="space-y-3">
                            <Input placeholder="Section title" value={section.title || ''} onChange={e => updateSection(section.id, { title: e.target.value })} />
                            {(section.content?.items || []).map((item: any, fi: number) => (
                              <div key={fi} className="border border-border/40 rounded-md p-3 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">FAQ #{fi + 1}</span>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => {
                                    const items = [...(section.content?.items || [])]; items.splice(fi, 1);
                                    updateSection(section.id, { content: { ...section.content, items } });
                                  }}><Trash2 className="h-3 w-3" /></Button>
                                </div>
                                <Input placeholder="Question" value={item.question || ''} onChange={e => {
                                  const items = [...(section.content?.items || [])]; items[fi] = { ...items[fi], question: e.target.value };
                                  updateSection(section.id, { content: { ...section.content, items } });
                                }} />
                                <Textarea placeholder="Answer" value={item.answer || ''} rows={2} onChange={e => {
                                  const items = [...(section.content?.items || [])]; items[fi] = { ...items[fi], answer: e.target.value };
                                  updateSection(section.id, { content: { ...section.content, items } });
                                }} />
                              </div>
                            ))}
                            <Button variant="outline" size="sm" onClick={() => updateSection(section.id, { content: { ...section.content, items: [...(section.content?.items || []), { question: '', answer: '' }] } })}><Plus className="h-3 w-3 mr-1" />Add FAQ</Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Form Builder */}
              <TabsContent value="form" className="space-y-4 pt-4">
                <Button variant="outline" size="sm" onClick={addFormField}><Plus className="h-3 w-3 mr-1" />Add Field</Button>
                {!formFields.length && <p className="text-sm text-muted-foreground text-center py-6">No form fields.</p>}
                <div className="space-y-3">
                  {formFields.map((field: any, idx: number) => (
                    <Card key={field.id} className="border-border/40">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-3 items-start">
                          <div className="flex items-center gap-1 pt-1">
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveField(idx, -1)} disabled={idx === 0}><ArrowUp className="h-3 w-3" /></Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveField(idx, 1)} disabled={idx === formFields.length - 1}><ArrowDown className="h-3 w-3" /></Button>
                          </div>
                          <Input placeholder="Field label" value={field.field_label} className="flex-1" onChange={e => updateFormField(field.id, { field_label: e.target.value })} />
                          <Select value={field.field_type} onValueChange={v => updateFormField(field.id, { field_type: v })}>
                            <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
                            <SelectContent>{FIELD_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}</SelectContent>
                          </Select>
                          <div className="flex items-center gap-2">
                            <Switch checked={field.is_required} onCheckedChange={v => updateFormField(field.id, { is_required: v })} />
                            <span className="text-xs text-muted-foreground">Required</span>
                          </div>
                          <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => removeFormField(field.id)}><Trash2 className="h-3 w-3" /></Button>
                        </div>
                        {field.field_type === 'select' && (
                          <div className="mt-2 ml-14"><Input placeholder="Options (comma separated)" value={(field.options || []).join(', ')} onChange={e => updateFormField(field.id, { options: e.target.value.split(',').map((o: string) => o.trim()).filter(Boolean) })} /></div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Resources */}
              <TabsContent value="resources" className="space-y-4 pt-4">
                <Card className="border-border/40">
                  <CardContent className="p-4 space-y-3">
                    <h4 className="text-sm font-semibold">{editingResourceId ? 'Edit' : 'Add'} Resource</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1.5"><Label className="text-xs">Title *</Label><Input value={resourceForm.title} onChange={e => setResourceForm({ ...resourceForm, title: e.target.value })} placeholder="Resource title" /></div>
                      <div className="space-y-1.5"><Label className="text-xs">Category</Label><Input value={resourceForm.category} onChange={e => setResourceForm({ ...resourceForm, category: e.target.value })} placeholder="e.g. Guides" /></div>
                    </div>
                    <div className="space-y-1.5"><Label className="text-xs">Description</Label><Textarea value={resourceForm.description} onChange={e => setResourceForm({ ...resourceForm, description: e.target.value })} rows={2} /></div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <Label className="text-xs">File URL / Link</Label>
                        <div className="flex gap-2">
                          <Input value={resourceForm.file_url} onChange={e => setResourceForm({ ...resourceForm, file_url: e.target.value })} placeholder="URL or upload" className="flex-1" />
                          <label className="flex items-center gap-1 px-3 py-2 border border-input rounded-md cursor-pointer hover:bg-muted transition-colors text-xs flex-shrink-0">
                            <Upload className="h-3.5 w-3.5" /> Upload
                            <input type="file" className="hidden" onChange={async e => {
                              const file = e.target.files?.[0]; if (!file) return;
                              const path = `resources/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
                              toast.loading('Uploading...'); const { error } = await supabase.storage.from('form-attachments').upload(path, file); toast.dismiss();
                              if (error) { toast.error('Failed'); return; }
                              const { data: u } = supabase.storage.from('form-attachments').getPublicUrl(path);
                              setResourceForm(prev => ({ ...prev, file_url: u.publicUrl })); toast.success('Uploaded!');
                            }} />
                          </label>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Type</Label>
                        <Select value={resourceForm.resource_type} onValueChange={v => setResourceForm({ ...resourceForm, resource_type: v })}>
                          <SelectTrigger><SelectValue /></SelectTrigger>
                          <SelectContent><SelectItem value="free">Free</SelectItem><SelectItem value="premium">Premium</SelectItem></SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2"><Switch checked={resourceForm.is_active} onCheckedChange={v => setResourceForm({ ...resourceForm, is_active: v })} /><span className="text-xs text-muted-foreground">Active</span></div>
                      <div className="flex gap-2">
                        {editingResourceId && <Button variant="ghost" size="sm" onClick={() => { setEditingResourceId(null); setResourceForm({ title: '', description: '', file_url: '', resource_type: 'free', category: '', is_active: true }); }}>Cancel</Button>}
                        <Button size="sm" onClick={addResource}>{editingResourceId ? 'Update' : 'Add'}</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {!resources.length ? <p className="text-sm text-muted-foreground text-center py-6">No resources added.</p> : (
                  <div className="space-y-2">
                    {resources.map((r: any, idx: number) => (
                      <Card key={r.id} className="border-border/40">
                        <CardContent className="p-3 flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveResource(idx, -1)} disabled={idx === 0}><ArrowUp className="h-3 w-3" /></Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveResource(idx, 1)} disabled={idx === resources.length - 1}><ArrowDown className="h-3 w-3" /></Button>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium truncate">{r.title}</span>
                              <Badge variant={r.resource_type === 'premium' ? 'secondary' : 'outline'} className="text-xs">{r.resource_type}</Badge>
                              {r.category && <Badge variant="outline" className="text-xs">{r.category}</Badge>}
                              {!r.is_active && <Badge variant="destructive" className="text-xs">Inactive</Badge>}
                            </div>
                          </div>
                          <span className="text-xs text-muted-foreground">{r.download_count} ↓</span>
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => editResource(r)}><Pencil className="h-3 w-3" /></Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive" onClick={() => removeResource(r.id)}><Trash2 className="h-3 w-3" /></Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Analytics */}
              <TabsContent value="analytics" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Card className="border-border/40"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">{submissions.length}</p><p className="text-xs text-muted-foreground">Total Submissions</p></CardContent></Card>
                  <Card className="border-border/40"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">{resources.reduce((s: number, r: any) => s + (r.download_count || 0), 0)}</p><p className="text-xs text-muted-foreground">Total Downloads</p></CardContent></Card>
                  <Card className="border-border/40"><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-foreground">{resources.length}</p><p className="text-xs text-muted-foreground">Resources</p></CardContent></Card>
                </div>
                {resources.length > 0 && (
                  <Card className="border-border/40">
                    <CardContent className="p-4">
                      <h4 className="text-sm font-semibold mb-4 flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Downloads by Resource</h4>
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={resources.map((r: any) => ({ name: r.title.length > 20 ? r.title.slice(0, 20) + '…' : r.title, downloads: r.download_count || 0 }))}>
                          <CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis allowDecimals={false} /><Tooltip />
                          <Bar dataKey="downloads" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
              <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !pageForm.title}>
                {saveMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingId ? 'Update' : 'Create'} Page
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminResources;
