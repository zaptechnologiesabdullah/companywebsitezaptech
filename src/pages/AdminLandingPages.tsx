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
  Plus, Pencil, Trash2, Search, FileText, Loader2, Eye, EyeOff,
  ArrowUp, ArrowDown, GripVertical, Download, ExternalLink, ChevronDown, ChevronUp, Upload, Image, BarChart3
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type LandingPage = {
  id: string; title: string; slug: string;
  page_type: 'job' | 'services' | 'course_request' | 'custom' | 'resource';
  is_visible: boolean; meta_title: string | null; meta_description: string | null;
  sort_order: number | null; created_at: string; updated_at: string;
};

type Section = {
  id: string; landing_page_id: string; section_type: 'heading' | 'text' | 'image' | 'rich_text' | 'faq';
  title: string | null; content: Record<string, any> | null; sort_order: number | null;
};

type FormField = {
  id: string; landing_page_id: string; field_label: string;
  field_type: 'text' | 'email' | 'phone' | 'textarea' | 'select' | 'file';
  is_required: boolean; options: string[] | null; sort_order: number | null;
};

type Submission = {
  id: string; landing_page_id: string; form_data: Record<string, unknown>;
  attachment_urls: unknown[] | null; created_at: string;
};

type Resource = {
  id: string; landing_page_id: string; title: string; description: string | null;
  file_url: string | null; resource_type: string; category: string | null;
  download_count: number; sort_order: number | null; is_active: boolean;
};

const PAGE_TYPES = [
  { value: 'job', label: 'Job' },
  { value: 'services', label: 'Services' },
  { value: 'course_request', label: 'Course Request' },
  { value: 'resource', label: 'Resource' },
  { value: 'custom', label: 'Custom' },
] as const;

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

const defaultPageForm = {
  title: '', slug: '', page_type: 'custom' as LandingPage['page_type'],
  is_visible: false, meta_title: '', meta_description: '',
};

const getDefaultFormFields = (type: string): Omit<FormField, 'id' | 'landing_page_id'>[] => {
  if (type === 'resource') {
    return [
      { field_label: 'Name', field_type: 'text' as const, is_required: false, options: [], sort_order: 0 },
      { field_label: 'Email', field_type: 'email' as const, is_required: true, options: [], sort_order: 1 },
      { field_label: 'WhatsApp Number', field_type: 'phone' as const, is_required: true, options: [], sort_order: 2 },
    ];
  }
  const base = [
    { field_label: 'Name', field_type: 'text' as const, is_required: true, options: [], sort_order: 0 },
    { field_label: 'Email', field_type: 'email' as const, is_required: true, options: [], sort_order: 1 },
    { field_label: 'WhatsApp Number', field_type: 'phone' as const, is_required: false, options: [], sort_order: 2 },
  ];
  if (type === 'job') {
    return [...base,
      { field_label: 'CV / Portfolio', field_type: 'file' as const, is_required: true, options: [], sort_order: 3 },
      { field_label: 'Additional Notes', field_type: 'textarea' as const, is_required: false, options: [], sort_order: 4 },
    ];
  }
  if (type === 'services') {
    return [...base,
      { field_label: 'Service Interested In', field_type: 'text' as const, is_required: true, options: [], sort_order: 3 },
      { field_label: 'Project Brief', field_type: 'file' as const, is_required: false, options: [], sort_order: 4 },
    ];
  }
  if (type === 'course_request') {
    return [...base,
      { field_label: 'Course Interested In', field_type: 'text' as const, is_required: true, options: [], sort_order: 3 },
      { field_label: 'Notes', field_type: 'textarea' as const, is_required: false, options: [], sort_order: 4 },
    ];
  }
  return base;
};

const AdminLandingPages = () => {
  const [search, setSearch] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(defaultPageForm);
  const [sections, setSections] = useState<Omit<Section, 'landing_page_id'>[]>([]);
  const [formFields, setFormFields] = useState<Omit<FormField, 'landing_page_id'>[]>([]);
  const [activeTab, setActiveTab] = useState('settings');
  const [viewingSubmissions, setViewingSubmissions] = useState<string | null>(null);
  const [expandedSubmission, setExpandedSubmission] = useState<string | null>(null);

  // Resource management state
  const [resources, setResources] = useState<Omit<Resource, 'landing_page_id'>[]>([]);
  const [resourceForm, setResourceForm] = useState({ title: '', description: '', file_url: '', resource_type: 'free', category: '', is_active: true });
  const [editingResourceId, setEditingResourceId] = useState<string | null>(null);

  const queryClient = useQueryClient();

  const { data: pages = [], isLoading } = useQuery({
    queryKey: ['admin-landing-pages'],
    queryFn: async () => {
      const { data, error } = await supabase.from('landing_pages').select('*').order('sort_order', { ascending: true });
      if (error) throw error;
      return data as LandingPage[];
    },
  });

  const { data: submissions = [] } = useQuery({
    queryKey: ['landing-submissions', viewingSubmissions],
    enabled: !!viewingSubmissions,
    queryFn: async () => {
      const { data, error } = await supabase.from('landing_page_submissions')
        .select('*').eq('landing_page_id', viewingSubmissions!).order('created_at', { ascending: false });
      if (error) throw error;
      return data as Submission[];
    },
  });

  // Load resources when editing a resource page
  const { data: dbResources = [] } = useQuery({
    queryKey: ['admin-resources', editingId],
    enabled: !!editingId && form.page_type === 'resource',
    queryFn: async () => {
      const { data, error } = await supabase.from('resources')
        .select('*').eq('landing_page_id', editingId!).order('sort_order');
      if (error) throw error;
      return data as Resource[];
    },
  });

  const toggleVisibility = useMutation({
    mutationFn: async ({ id, is_visible }: { id: string; is_visible: boolean }) => {
      const { error } = await supabase.from('landing_pages').update({ is_visible }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-landing-pages'] });
      toast.success('Visibility updated');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const slug = form.slug || form.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const payload = {
        title: form.title, slug,
        page_type: form.page_type as LandingPage['page_type'],
        is_visible: form.is_visible,
        meta_title: form.meta_title || null,
        meta_description: form.meta_description || null,
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

      // Save sections
      if (editingId) {
        await supabase.from('landing_page_sections').delete().eq('landing_page_id', editingId);
      }
      if (sections.length > 0) {
        const sectionPayload = sections.map((s, i) => ({
          landing_page_id: pageId!,
          section_type: s.section_type as Section['section_type'],
          title: s.title || null,
          content: (s.content || {}) as Record<string, string>,
          sort_order: i,
        }));
        const { error } = await supabase.from('landing_page_sections').insert(sectionPayload);
        if (error) throw error;
      }

      // Save form fields
      if (editingId) {
        await supabase.from('landing_page_form_fields').delete().eq('landing_page_id', editingId);
      }
      if (formFields.length > 0) {
        const fieldPayload = formFields.map((f, i) => ({
          landing_page_id: pageId!,
          field_label: f.field_label,
          field_type: f.field_type as FormField['field_type'],
          is_required: f.is_required,
          options: (f.options || []) as string[],
          sort_order: i,
        }));
        const { error } = await supabase.from('landing_page_form_fields').insert(fieldPayload);
        if (error) throw error;
      }

      // Save resources for resource pages
      if (form.page_type === 'resource' && pageId) {
        // Delete existing resources
        await supabase.from('resources').delete().eq('landing_page_id', pageId);
        if (resources.length > 0) {
          const resPayload = resources.map((r, i) => ({
            landing_page_id: pageId!,
            title: r.title,
            description: r.description || null,
            file_url: r.file_url || null,
            resource_type: r.resource_type,
            category: r.category || null,
            is_active: r.is_active,
            sort_order: i,
          }));
          const { error } = await supabase.from('resources').insert(resPayload);
          if (error) throw error;
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-landing-pages'] });
      queryClient.invalidateQueries({ queryKey: ['admin-resources'] });
      toast.success(editingId ? 'Page updated!' : 'Page created!');
      resetForm();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('landing_pages').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-landing-pages'] });
      toast.success('Page deleted!');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const resetForm = () => {
    setForm(defaultPageForm);
    setSections([]);
    setFormFields([]);
    setResources([]);
    setEditingId(null);
    setIsDialogOpen(false);
    setActiveTab('settings');
    setEditingResourceId(null);
    setResourceForm({ title: '', description: '', file_url: '', resource_type: 'free', category: '', is_active: true });
  };

  const openEdit = async (page: LandingPage) => {
    setForm({
      title: page.title, slug: page.slug, page_type: page.page_type,
      is_visible: page.is_visible,
      meta_title: page.meta_title || '', meta_description: page.meta_description || '',
    });
    setEditingId(page.id);

    const [sectionsRes, fieldsRes] = await Promise.all([
      supabase.from('landing_page_sections').select('*').eq('landing_page_id', page.id).order('sort_order'),
      supabase.from('landing_page_form_fields').select('*').eq('landing_page_id', page.id).order('sort_order'),
    ]);
    setSections((sectionsRes.data || []) as Section[]);
    setFormFields((fieldsRes.data || []) as FormField[]);

    if (page.page_type === 'resource') {
      const { data } = await supabase.from('resources').select('*').eq('landing_page_id', page.id).order('sort_order');
      setResources((data || []) as Resource[]);
    }

    setActiveTab('settings');
    setIsDialogOpen(true);
  };

  const openCreate = (type?: string) => {
    resetForm();
    if (type) {
      setForm(prev => ({ ...prev, page_type: type as typeof prev.page_type }));
      setFormFields(getDefaultFormFields(type) as FormField[]);
    }
    setIsDialogOpen(true);
  };

  // Section management
  const addSection = (type: Section['section_type']) => {
    const defaultContent = type === 'faq' ? { items: [{ question: '', answer: '' }] } : {};
    setSections(prev => [...prev, {
      id: crypto.randomUUID(), section_type: type, title: type === 'faq' ? 'Frequently Asked Questions' : '', content: defaultContent, sort_order: prev.length,
    }]);
  };

  const updateSection = (id: string, updates: Partial<Section>) => {
    setSections(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const removeSection = (id: string) => setSections(prev => prev.filter(s => s.id !== id));

  const moveSection = (idx: number, dir: -1 | 1) => {
    setSections(prev => {
      const arr = [...prev];
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= arr.length) return arr;
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return arr;
    });
  };

  // Form field management
  const addFormField = () => {
    setFormFields(prev => [...prev, {
      id: crypto.randomUUID(), field_label: '', field_type: 'text',
      is_required: false, options: [], sort_order: prev.length,
    } as FormField]);
  };

  const updateFormField = (id: string, updates: Partial<FormField>) => {
    setFormFields(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const removeFormField = (id: string) => setFormFields(prev => prev.filter(f => f.id !== id));

  const moveField = (idx: number, dir: -1 | 1) => {
    setFormFields(prev => {
      const arr = [...prev];
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= arr.length) return arr;
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return arr;
    });
  };

  // Resource management
  const addResource = () => {
    if (!resourceForm.title.trim()) { toast.error('Resource title required'); return; }
    const newResource: Omit<Resource, 'landing_page_id'> = {
      id: editingResourceId || crypto.randomUUID(),
      title: resourceForm.title,
      description: resourceForm.description || null,
      file_url: resourceForm.file_url || null,
      resource_type: resourceForm.resource_type,
      category: resourceForm.category || null,
      download_count: 0,
      sort_order: resources.length,
      is_active: resourceForm.is_active,
    };
    if (editingResourceId) {
      setResources(prev => prev.map(r => r.id === editingResourceId ? { ...r, ...newResource } : r));
    } else {
      setResources(prev => [...prev, newResource]);
    }
    setResourceForm({ title: '', description: '', file_url: '', resource_type: 'free', category: '', is_active: true });
    setEditingResourceId(null);
  };

  const editResource = (r: Omit<Resource, 'landing_page_id'>) => {
    setEditingResourceId(r.id);
    setResourceForm({
      title: r.title, description: r.description || '', file_url: r.file_url || '',
      resource_type: r.resource_type, category: r.category || '', is_active: r.is_active,
    });
  };

  const removeResource = (id: string) => setResources(prev => prev.filter(r => r.id !== id));

  const moveResource = (idx: number, dir: -1 | 1) => {
    setResources(prev => {
      const arr = [...prev];
      const newIdx = idx + dir;
      if (newIdx < 0 || newIdx >= arr.length) return arr;
      [arr[idx], arr[newIdx]] = [arr[newIdx], arr[idx]];
      return arr;
    });
  };

  // CSV Export
  const exportCSV = () => {
    if (submissions.length === 0) return;
    const allKeys = new Set<string>();
    submissions.forEach(s => Object.keys(s.form_data).forEach(k => allKeys.add(k)));
    const headers = ['Submitted At', ...Array.from(allKeys)];
    const rows = submissions.map(s => [
      new Date(s.created_at).toLocaleString(),
      ...Array.from(allKeys).map(k => String((s.form_data as Record<string, unknown>)[k] || '')),
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(c => `"${c.replace(/"/g, '""')}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `submissions-${Date.now()}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = pages.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
  const typeBadgeVariant = (type: string) => {
    switch (type) {
      case 'job': return 'default' as const;
      case 'services': return 'secondary' as const;
      case 'course_request': return 'outline' as const;
      case 'resource': return 'default' as const;
      default: return 'secondary' as const;
    }
  };

  const isResourcePage = form.page_type === 'resource';
  const tabCount = isResourcePage ? 5 : 3;

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Landing Pages</h1>
            <p className="text-sm text-muted-foreground">Create and manage dynamic landing pages</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => openCreate()} variant="outline"><Plus className="h-4 w-4 mr-2" />Blank Page</Button>
            <Select onValueChange={(v) => openCreate(v)}>
              <SelectTrigger className="w-[160px]"><SelectValue placeholder="From Template" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="job">Job Page</SelectItem>
                <SelectItem value="services">Services Page</SelectItem>
                <SelectItem value="course_request">Course Request</SelectItem>
                <SelectItem value="resource">Resource Page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Submissions Viewer */}
        {viewingSubmissions && (
          <Card className="border-border/60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Submissions — {pages.find(p => p.id === viewingSubmissions)?.title}
                </h2>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={exportCSV} disabled={submissions.length === 0}>
                    <Download className="h-4 w-4 mr-1" />CSV
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setViewingSubmissions(null)}>Close</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {submissions.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">No submissions yet.</p>
              ) : (
                <div className="space-y-2">
                  {submissions.map(sub => (
                    <Card key={sub.id} className="border-border/40">
                      <button
                        className="w-full p-4 text-left flex items-center justify-between"
                        onClick={() => setExpandedSubmission(expandedSubmission === sub.id ? null : sub.id)}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">{(sub.form_data as Record<string, string>).Name || (sub.form_data as Record<string, string>).name || 'Unknown'}</span>
                          <span className="text-xs text-muted-foreground">{new Date(sub.created_at).toLocaleString()}</span>
                        </div>
                        {expandedSubmission === sub.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </button>
                      {expandedSubmission === sub.id && (
                        <CardContent className="pt-0 border-t border-border/40">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3">
                            {Object.entries(sub.form_data).map(([key, val]) => (
                              <div key={key}>
                                <p className="text-xs font-semibold text-muted-foreground uppercase">{key}</p>
                                <p className="text-sm text-foreground break-all">{String(val)}</p>
                              </div>
                            ))}
                          </div>
                          {sub.attachment_urls && (sub.attachment_urls as string[]).length > 0 && (
                            <div className="mt-3 pt-3 border-t border-border/40">
                              <p className="text-xs font-semibold text-muted-foreground mb-1">ATTACHMENTS</p>
                              {(sub.attachment_urls as string[]).map((url, i) => (
                                <a key={i} href={url} target="_blank" rel="noopener" className="text-sm text-primary hover:underline flex items-center gap-1">
                                  <ExternalLink className="h-3 w-3" />{url.split('/').pop()}
                                </a>
                              ))}
                            </div>
                          )}
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
              <Input placeholder="Search pages..." value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-sm" />
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
                    <TableHead className="hidden md:table-cell">Type</TableHead>
                    <TableHead className="hidden md:table-cell">Slug</TableHead>
                    <TableHead>Visible</TableHead>
                    <TableHead className="w-[140px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <FileText className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No landing pages yet.</p>
                      </TableCell>
                    </TableRow>
                  ) : filtered.map(page => (
                    <TableRow key={page.id}>
                      <TableCell className="font-medium">{page.title}</TableCell>
                      <TableCell className="hidden md:table-cell">
                        <Badge variant={typeBadgeVariant(page.page_type)}>
                          {page.page_type.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-muted-foreground text-sm">/p/{page.slug}</TableCell>
                      <TableCell>
                        <Switch
                          checked={page.is_visible}
                          onCheckedChange={(v) => toggleVisibility.mutate({ id: page.id, is_visible: v })}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(page)} title="Edit">
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => {
                            setViewingSubmissions(page.id);
                            queryClient.invalidateQueries({ queryKey: ['landing-submissions', page.id] });
                          }} title="View Submissions">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => window.open(`/p/${page.slug}`, '_blank')} title="Preview">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(page.id)} className="text-destructive" title="Delete">
                            <Trash2 className="h-4 w-4" />
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

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={(open) => { if (!open) resetForm(); else setIsDialogOpen(true); }}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingId ? 'Edit' : 'Create'} Landing Page</DialogTitle>
            </DialogHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className={`w-full grid ${isResourcePage ? 'grid-cols-5' : 'grid-cols-3'}`}>
                <TabsTrigger value="settings">Settings</TabsTrigger>
                <TabsTrigger value="sections">Sections</TabsTrigger>
                <TabsTrigger value="form">Form</TabsTrigger>
                {isResourcePage && <TabsTrigger value="resources">Resources</TabsTrigger>}
                {isResourcePage && <TabsTrigger value="analytics">Analytics</TabsTrigger>}
              </TabsList>

              {/* Settings Tab */}
              <TabsContent value="settings" className="space-y-4 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Title *</Label>
                    <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Page title" required />
                  </div>
                  <div className="space-y-2">
                    <Label>Slug</Label>
                    <Input value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="auto-generated" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Page Type</Label>
                    <Select value={form.page_type} onValueChange={v => {
                      setForm({ ...form, page_type: v as typeof form.page_type });
                      if (!editingId && formFields.length === 0) {
                        setFormFields(getDefaultFormFields(v) as FormField[]);
                      }
                    }}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {PAGE_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end gap-2 pb-1">
                    <Switch id="visible" checked={form.is_visible} onCheckedChange={v => setForm({ ...form, is_visible: v })} />
                    <Label htmlFor="visible">Visible to public</Label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>SEO Title</Label>
                  <Input value={form.meta_title} onChange={e => setForm({ ...form, meta_title: e.target.value })} placeholder="SEO meta title" />
                </div>
                <div className="space-y-2">
                  <Label>SEO Description</Label>
                  <Textarea value={form.meta_description} onChange={e => setForm({ ...form, meta_description: e.target.value })} placeholder="SEO meta description" rows={2} />
                </div>
              </TabsContent>

              {/* Sections Tab */}
              <TabsContent value="sections" className="space-y-4 pt-4">
                <div className="flex flex-wrap gap-2">
                  {SECTION_TYPES.map(t => (
                    <Button key={t.value} variant="outline" size="sm" onClick={() => addSection(t.value)}>
                      <Plus className="h-3 w-3 mr-1" />{t.label}
                    </Button>
                  ))}
                </div>
                {sections.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-6">No sections added. Click above to add content blocks.</p>
                )}
                <div className="space-y-3">
                  {sections.map((section, idx) => (
                    <Card key={section.id} className="border-border/40">
                      <CardContent className="p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                            <Badge variant="outline">{section.section_type}</Badge>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={() => moveSection(idx, -1)} disabled={idx === 0}><ArrowUp className="h-3 w-3" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => moveSection(idx, 1)} disabled={idx === sections.length - 1}><ArrowDown className="h-3 w-3" /></Button>
                            <Button variant="ghost" size="icon" onClick={() => removeSection(section.id)} className="text-destructive"><Trash2 className="h-3 w-3" /></Button>
                          </div>
                        </div>
                        {section.section_type === 'heading' && (
                          <Input placeholder="Heading text" value={section.title || ''} onChange={e => updateSection(section.id, { title: e.target.value })} />
                        )}
                        {section.section_type === 'text' && (
                          <Textarea placeholder="Text content..." value={(section.content as Record<string, string>)?.body || ''} rows={3}
                            onChange={e => updateSection(section.id, { content: { body: e.target.value } })} />
                        )}
                        {section.section_type === 'rich_text' && (
                          <Textarea placeholder="Rich text content (HTML supported)..." value={(section.content as Record<string, string>)?.body || ''} rows={6}
                            onChange={e => updateSection(section.id, { content: { body: e.target.value } })} />
                        )}
                        {section.section_type === 'image' && (
                          <div className="space-y-3">
                            {(section.content as Record<string, string>)?.url && (
                              <img src={(section.content as Record<string, string>).url} alt={(section.content as Record<string, string>)?.alt || ''} className="h-24 w-auto rounded-md border border-border object-cover" />
                            )}
                            <div className="flex items-center gap-2">
                              <label className="flex items-center gap-2 px-4 py-2 border border-input rounded-md cursor-pointer hover:bg-muted transition-colors text-sm flex-shrink-0">
                                <Upload className="h-4 w-4" />
                                Upload Image
                                <input type="file" accept="image/*" className="hidden" onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (!file) return;
                                  const path = `landing-images/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
                                  toast.loading('Uploading image...');
                                  const { error } = await supabase.storage.from('form-attachments').upload(path, file);
                                  toast.dismiss();
                                  if (error) { toast.error('Upload failed: ' + error.message); return; }
                                  const { data: urlData } = supabase.storage.from('form-attachments').getPublicUrl(path);
                                  updateSection(section.id, { content: { ...section.content as Record<string, string>, url: urlData.publicUrl } });
                                  toast.success('Image uploaded!');
                                }} />
                              </label>
                              <span className="text-xs text-muted-foreground">or</span>
                              <Input placeholder="Paste image URL" value={(section.content as Record<string, string>)?.url || ''} className="flex-1"
                                onChange={e => updateSection(section.id, { content: { ...section.content as Record<string, string>, url: e.target.value } })} />
                            </div>
                            <Input placeholder="Alt text" value={(section.content as Record<string, string>)?.alt || ''}
                              onChange={e => updateSection(section.id, { content: { ...section.content as Record<string, string>, alt: e.target.value } })} />
                          </div>
                        )}
                        {section.section_type === 'faq' && (
                          <div className="space-y-3">
                            <Input placeholder="Section title" value={section.title || ''} onChange={e => updateSection(section.id, { title: e.target.value })} />
                            {((section.content as any)?.items || []).map((item: any, faqIdx: number) => (
                              <div key={faqIdx} className="border border-border/40 rounded-md p-3 space-y-2">
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">FAQ #{faqIdx + 1}</span>
                                  <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => {
                                    const items = [...((section.content as any)?.items || [])];
                                    items.splice(faqIdx, 1);
                                    updateSection(section.id, { content: { ...section.content, items } as any });
                                  }}><Trash2 className="h-3 w-3" /></Button>
                                </div>
                                <Input placeholder="Question" value={item.question || ''} onChange={e => {
                                  const items = [...((section.content as any)?.items || [])];
                                  items[faqIdx] = { ...items[faqIdx], question: e.target.value };
                                  updateSection(section.id, { content: { ...section.content, items } as any });
                                }} />
                                <Textarea placeholder="Answer" value={item.answer || ''} rows={2} onChange={e => {
                                  const items = [...((section.content as any)?.items || [])];
                                  items[faqIdx] = { ...items[faqIdx], answer: e.target.value };
                                  updateSection(section.id, { content: { ...section.content, items } as any });
                                }} />
                              </div>
                            ))}
                            <Button variant="outline" size="sm" onClick={() => {
                              const items = [...((section.content as any)?.items || []), { question: '', answer: '' }];
                              updateSection(section.id, { content: { ...section.content, items } as any });
                            }}><Plus className="h-3 w-3 mr-1" />Add FAQ Item</Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Form Builder Tab */}
              <TabsContent value="form" className="space-y-4 pt-4">
                <Button variant="outline" size="sm" onClick={addFormField}>
                  <Plus className="h-3 w-3 mr-1" />Add Field
                </Button>
                {formFields.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-6">No form fields. Add fields to create a submission form on this page.</p>
                )}
                <div className="space-y-3">
                  {formFields.map((field, idx) => (
                    <Card key={field.id} className="border-border/40">
                      <CardContent className="p-4">
                        <div className="flex flex-col sm:flex-row gap-3 items-start">
                          <div className="flex items-center gap-1 pt-1">
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveField(idx, -1)} disabled={idx === 0}><ArrowUp className="h-3 w-3" /></Button>
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => moveField(idx, 1)} disabled={idx === formFields.length - 1}><ArrowDown className="h-3 w-3" /></Button>
                          </div>
                          <Input placeholder="Field label" value={field.field_label} className="flex-1"
                            onChange={e => updateFormField(field.id, { field_label: e.target.value })} />
                          <Select value={field.field_type} onValueChange={v => updateFormField(field.id, { field_type: v as FormField['field_type'] })}>
                            <SelectTrigger className="w-[130px]"><SelectValue /></SelectTrigger>
                            <SelectContent>
                              {FIELD_TYPES.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                            </SelectContent>
                          </Select>
                          <div className="flex items-center gap-2">
                            <Switch checked={field.is_required} onCheckedChange={v => updateFormField(field.id, { is_required: v })} />
                            <span className="text-xs text-muted-foreground">Required</span>
                          </div>
                          <Button variant="ghost" size="icon" className="text-destructive h-8 w-8" onClick={() => removeFormField(field.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        {field.field_type === 'select' && (
                          <div className="mt-2 ml-14">
                            <Input placeholder="Options (comma separated)" value={(field.options || []).join(', ')}
                              onChange={e => updateFormField(field.id, { options: e.target.value.split(',').map(o => o.trim()).filter(Boolean) })} />
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Resources Tab (resource pages only) */}
              {isResourcePage && (
                <TabsContent value="resources" className="space-y-4 pt-4">
                  <Card className="border-border/40">
                    <CardContent className="p-4 space-y-3">
                      <h4 className="text-sm font-semibold">{editingResourceId ? 'Edit' : 'Add'} Resource</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs">Title *</Label>
                          <Input value={resourceForm.title} onChange={e => setResourceForm({ ...resourceForm, title: e.target.value })} placeholder="Resource title" />
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Category</Label>
                          <Input value={resourceForm.category} onChange={e => setResourceForm({ ...resourceForm, category: e.target.value })} placeholder="e.g. Guides, Templates" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-xs">Description</Label>
                        <Textarea value={resourceForm.description} onChange={e => setResourceForm({ ...resourceForm, description: e.target.value })} placeholder="Brief description" rows={2} />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                          <Label className="text-xs">File URL / Link</Label>
                          <div className="flex gap-2">
                            <Input value={resourceForm.file_url} onChange={e => setResourceForm({ ...resourceForm, file_url: e.target.value })} placeholder="URL or upload" className="flex-1" />
                            <label className="flex items-center gap-1 px-3 py-2 border border-input rounded-md cursor-pointer hover:bg-muted transition-colors text-xs flex-shrink-0">
                              <Upload className="h-3.5 w-3.5" /> Upload
                              <input type="file" className="hidden" onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const path = `resources/${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
                                toast.loading('Uploading...');
                                const { error } = await supabase.storage.from('form-attachments').upload(path, file);
                                toast.dismiss();
                                if (error) { toast.error('Upload failed'); return; }
                                const { data: urlData } = supabase.storage.from('form-attachments').getPublicUrl(path);
                                setResourceForm(prev => ({ ...prev, file_url: urlData.publicUrl }));
                                toast.success('Uploaded!');
                              }} />
                            </label>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-xs">Type</Label>
                          <Select value={resourceForm.resource_type} onValueChange={v => setResourceForm({ ...resourceForm, resource_type: v })}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="free">Free</SelectItem>
                              <SelectItem value="premium">Premium</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Switch checked={resourceForm.is_active} onCheckedChange={v => setResourceForm({ ...resourceForm, is_active: v })} />
                          <span className="text-xs text-muted-foreground">Active</span>
                        </div>
                        <div className="flex gap-2">
                          {editingResourceId && (
                            <Button variant="ghost" size="sm" onClick={() => {
                              setEditingResourceId(null);
                              setResourceForm({ title: '', description: '', file_url: '', resource_type: 'free', category: '', is_active: true });
                            }}>Cancel</Button>
                          )}
                          <Button size="sm" onClick={addResource}>{editingResourceId ? 'Update' : 'Add'} Resource</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {resources.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-6">No resources added yet.</p>
                  ) : (
                    <div className="space-y-2">
                      {resources.map((r, idx) => (
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
                              {r.description && <p className="text-xs text-muted-foreground truncate">{r.description}</p>}
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
              )}

              {/* Analytics Tab (resource pages only) */}
              {isResourcePage && (
                <TabsContent value="analytics" className="space-y-4 pt-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Card className="border-border/40">
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-foreground">{submissions.length || 0}</p>
                        <p className="text-xs text-muted-foreground">Total Submissions</p>
                      </CardContent>
                    </Card>
                    <Card className="border-border/40">
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-foreground">{resources.reduce((sum, r) => sum + r.download_count, 0)}</p>
                        <p className="text-xs text-muted-foreground">Total Downloads</p>
                      </CardContent>
                    </Card>
                    <Card className="border-border/40">
                      <CardContent className="p-4 text-center">
                        <p className="text-2xl font-bold text-foreground">{resources.length}</p>
                        <p className="text-xs text-muted-foreground">Resources</p>
                      </CardContent>
                    </Card>
                  </div>
                  {resources.length > 0 && (
                    <Card className="border-border/40">
                      <CardContent className="p-4">
                        <h4 className="text-sm font-semibold mb-4 flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Downloads by Resource</h4>
                        <ResponsiveContainer width="100%" height={250}>
                          <BarChart data={resources.map(r => ({ name: r.title.length > 20 ? r.title.slice(0, 20) + '…' : r.title, downloads: r.download_count }))}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                            <YAxis allowDecimals={false} />
                            <Tooltip />
                            <Bar dataKey="downloads" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>
              )}
            </Tabs>

            <div className="flex justify-end gap-2 pt-4 border-t border-border">
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
              <Button onClick={() => saveMutation.mutate()} disabled={saveMutation.isPending || !form.title}>
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

export default AdminLandingPages;
