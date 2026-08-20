import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import type { Json } from '@/integrations/supabase/types';

type SiteContent = {
  id: string; section_key: string; content: Json;
};

type SectionForm = Record<string, string>;

const sectionDefaults: Record<string, SectionForm> = {
  hero: { headline: '', subheadline: '', cta_text: '', cta_link: '', bg_image: '' },
  services: { title: '', description: '' },
  testimonials: { title: '' },
  cta: { heading: '', description: '', button_text: '', button_link: '' },
};

const AdminContent = () => {
  const [forms, setForms] = useState<Record<string, SectionForm>>(sectionDefaults);
  const queryClient = useQueryClient();

  const { data: contents = [], isLoading } = useQuery({
    queryKey: ['admin-content'],
    queryFn: async () => {
      const { data, error } = await supabase.from('site_content').select('*');
      if (error) throw error;
      return data as SiteContent[];
    },
  });

  useEffect(() => {
    if (contents.length > 0) {
      const newForms = { ...sectionDefaults };
      contents.forEach(c => {
        if (newForms[c.section_key] && typeof c.content === 'object' && c.content !== null) {
          newForms[c.section_key] = { ...newForms[c.section_key], ...(c.content as SectionForm) };
        }
      });
      setForms(newForms);
    }
  }, [contents]);

  const saveMutation = useMutation({
    mutationFn: async (sectionKey: string) => {
      const existing = contents.find(c => c.section_key === sectionKey);
      if (existing) {
        const { error } = await supabase.from('site_content')
          .update({ content: forms[sectionKey] as unknown as Json })
          .eq('id', existing.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('site_content')
          .insert({ section_key: sectionKey, content: forms[sectionKey] as unknown as Json });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-content'] });
      toast.success('Content saved!');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const updateField = (section: string, field: string, value: string) => {
    setForms(prev => ({ ...prev, [section]: { ...prev[section], [field]: value } }));
  };

  const renderFields = (section: string, fields: { key: string; label: string; type?: 'textarea' }[]) => (
    <div className="space-y-4">
      {fields.map(f => (
        <div key={f.key} className="space-y-2">
          <Label>{f.label}</Label>
          {f.type === 'textarea' ? (
            <Textarea value={forms[section]?.[f.key] || ''} onChange={e => updateField(section, f.key, e.target.value)} rows={3} />
          ) : (
            <Input value={forms[section]?.[f.key] || ''} onChange={e => updateField(section, f.key, e.target.value)} />
          )}
        </div>
      ))}
      <Button onClick={() => saveMutation.mutate(section)} disabled={saveMutation.isPending}>
        {saveMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
        Save Changes
      </Button>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Content Management</h1>
          <p className="text-sm text-muted-foreground">Edit homepage sections and site content</p>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /></div>
        ) : (
          <Tabs defaultValue="hero">
            <TabsList className="mb-4">
              <TabsTrigger value="hero">Hero Section</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
              <TabsTrigger value="testimonials">Testimonials</TabsTrigger>
              <TabsTrigger value="cta">CTA Section</TabsTrigger>
            </TabsList>

            <TabsContent value="hero">
              <Card className="border-border/60">
                <CardHeader><CardTitle className="text-lg">Hero Section</CardTitle></CardHeader>
                <CardContent>
                  {renderFields('hero', [
                    { key: 'headline', label: 'Headline' },
                    { key: 'subheadline', label: 'Subheadline', type: 'textarea' },
                    { key: 'cta_text', label: 'CTA Button Text' },
                    { key: 'cta_link', label: 'CTA Button Link' },
                    { key: 'bg_image', label: 'Background Image URL' },
                  ])}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="services">
              <Card className="border-border/60">
                <CardHeader><CardTitle className="text-lg">Services Section</CardTitle></CardHeader>
                <CardContent>
                  {renderFields('services', [
                    { key: 'title', label: 'Section Title' },
                    { key: 'description', label: 'Section Description', type: 'textarea' },
                  ])}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="testimonials">
              <Card className="border-border/60">
                <CardHeader><CardTitle className="text-lg">Testimonials Section</CardTitle></CardHeader>
                <CardContent>
                  {renderFields('testimonials', [
                    { key: 'title', label: 'Section Title' },
                  ])}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cta">
              <Card className="border-border/60">
                <CardHeader><CardTitle className="text-lg">CTA Section</CardTitle></CardHeader>
                <CardContent>
                  {renderFields('cta', [
                    { key: 'heading', label: 'Heading' },
                    { key: 'description', label: 'Description', type: 'textarea' },
                    { key: 'button_text', label: 'Button Text' },
                    { key: 'button_link', label: 'Button Link' },
                  ])}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminContent;
