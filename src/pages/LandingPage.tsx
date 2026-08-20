import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Upload, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import ResourceDownloadSection from '@/components/landing/ResourceDownloadSection';
import FAQSection from '@/components/landing/FAQSection';
import SocialShareButtons from '@/components/landing/SocialShareButtons';

type LandingPage = {
  id: string; title: string; slug: string; page_type: string;
  is_visible: boolean; meta_title: string | null; meta_description: string | null;
};

type Section = {
  id: string; section_type: string; title: string | null;
  content: Record<string, string> | null; sort_order: number | null;
};

type FormField = {
  id: string; field_label: string; field_type: string;
  is_required: boolean; options: string[] | null; sort_order: number | null;
};

const LandingPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [files, setFiles] = useState<Record<string, File>>({});
  const [submitted, setSubmitted] = useState(false);

  const { data: page, isLoading: pageLoading } = useQuery({
    queryKey: ['landing-page', slug],
    queryFn: async () => {
      const { data, error } = await supabase.from('landing_pages')
        .select('*').eq('slug', slug!).eq('is_visible', true).single();
      if (error) throw error;
      return data as LandingPage;
    },
    enabled: !!slug,
  });

  const { data: sections = [] } = useQuery({
    queryKey: ['landing-sections', page?.id],
    enabled: !!page?.id,
    queryFn: async () => {
      const { data, error } = await supabase.from('landing_page_sections')
        .select('*').eq('landing_page_id', page!.id).order('sort_order');
      if (error) throw error;
      return data as Section[];
    },
  });

  const { data: formFields = [] } = useQuery({
    queryKey: ['landing-form-fields', page?.id],
    enabled: !!page?.id,
    queryFn: async () => {
      const { data, error } = await supabase.from('landing_page_form_fields')
        .select('*').eq('landing_page_id', page!.id).order('sort_order');
      if (error) throw error;
      return data as FormField[];
    },
  });

  useEffect(() => {
    if (page) {
      document.title = page.meta_title || page.title;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc && page.meta_description) {
        metaDesc.setAttribute('content', page.meta_description);
      }
    }
  }, [page]);

  const submitMutation = useMutation({
    mutationFn: async () => {
      const attachmentUrls: string[] = [];
      for (const [label, file] of Object.entries(files)) {
        const ext = file.name.split('.').pop();
        const path = `landing/${page!.id}/${Date.now()}-${label.replace(/\s+/g, '_')}.${ext}`;
        const { error } = await supabase.storage.from('form-attachments').upload(path, file);
        if (error) throw new Error(`Upload failed for ${label}: ${error.message}`);
        const { data: urlData } = supabase.storage.from('form-attachments').getPublicUrl(path);
        attachmentUrls.push(urlData.publicUrl);
        formData[label] = urlData.publicUrl;
      }

      const { error } = await supabase.from('landing_page_submissions').insert({
        landing_page_id: page!.id,
        form_data: formData,
        attachment_urls: attachmentUrls,
      });
      if (error) throw error;

      try {
        await supabase.functions.invoke('send-landing-submission-email', {
          body: {
            pageTitle: page!.title, pageType: page!.page_type,
            formData, attachmentUrls,
            landingPageId: page!.id,
          },
        });
      } catch (e) {
        console.error('Email notification failed:', e);
      }
    },
    onSuccess: () => {
      setSubmitted(true);
      toast.success('Submitted successfully!');
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    for (const field of formFields) {
      if (field.is_required && field.field_type !== 'file' && !formData[field.field_label]?.trim()) {
        toast.error(`${field.field_label} is required`);
        return;
      }
      if (field.is_required && field.field_type === 'file' && !files[field.field_label]) {
        toast.error(`${field.field_label} is required`);
        return;
      }
    }
    submitMutation.mutate();
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!page) {
    navigate('/404', { replace: true });
    return null;
  }

  const isResourcePage = page.page_type === 'resource';
  const faqSections = sections.filter(s => s.section_type === 'faq');
  const contentSections = sections.filter(s => s.section_type !== 'faq');

  const ctaLabel = page.page_type === 'job' ? 'Apply Now'
    : page.page_type === 'course_request' ? 'Request Course'
    : page.page_type === 'services' ? 'Get in Touch'
    : isResourcePage ? 'Get Access'
    : 'Submit';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-primary/5 py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-4">{page.title}</h1>
            {page.meta_description && (
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{page.meta_description}</p>
            )}
            {isResourcePage && !submitted && (
              <Button size="lg" className="mt-6" onClick={() => document.getElementById('resource-form')?.scrollIntoView({ behavior: 'smooth' })}>
                Get Free Resources
              </Button>
            )}
          </div>
        </section>

        <div className="container mx-auto px-4 py-12 space-y-10 max-w-4xl">
          {/* Content Sections */}
          {contentSections.map(section => (
            <div key={section.id}>
              {section.section_type === 'heading' && (
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">{section.title}</h2>
              )}
              {section.section_type === 'text' && (
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {section.content?.body}
                </p>
              )}
              {section.section_type === 'rich_text' && (
                <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: section.content?.body || '' }} />
              )}
              {section.section_type === 'image' && section.content?.url && (
                <img src={section.content.url} alt={section.content.alt || ''}
                  className="w-full rounded-xl object-cover max-h-[500px]" loading="lazy" />
              )}
            </div>
          ))}

          {/* Form */}
          {formFields.length > 0 && (
            <Card id="resource-form" className="border-border/60 shadow-lg">
              <CardContent className="p-6 md:p-8">
                {submitted ? (
                  <div className="text-center py-8 space-y-4">
                    <CheckCircle className="h-16 w-16 text-primary mx-auto" />
                    <h3 className="text-2xl font-bold text-foreground">Thank You!</h3>
                    <p className="text-muted-foreground">
                      {isResourcePage
                        ? 'Your access is ready! Download the resources below.'
                        : 'Your submission has been received. We\'ll get back to you soon.'}
                    </p>
                    {!isResourcePage && (
                      <Button variant="outline" onClick={() => { setSubmitted(false); setFormData({}); setFiles({}); }}>
                        Submit Another
                      </Button>
                    )}
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <h3 className="text-xl font-bold text-foreground">{ctaLabel}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {formFields.map(field => (
                        <div key={field.id} className={field.field_type === 'textarea' || field.field_type === 'file' ? 'md:col-span-2' : ''}>
                          <Label className="mb-1.5 block">
                            {field.field_label}
                            {field.is_required && <span className="text-destructive ml-1">*</span>}
                          </Label>
                          {field.field_type === 'text' && (
                            <Input value={formData[field.field_label] || ''} onChange={e => setFormData({ ...formData, [field.field_label]: e.target.value })}
                              placeholder={field.field_label} required={field.is_required} />
                          )}
                          {field.field_type === 'email' && (
                            <Input type="email" value={formData[field.field_label] || ''} onChange={e => setFormData({ ...formData, [field.field_label]: e.target.value })}
                              placeholder={field.field_label} required={field.is_required} />
                          )}
                          {field.field_type === 'phone' && (
                            <Input type="tel" value={formData[field.field_label] || ''} onChange={e => setFormData({ ...formData, [field.field_label]: e.target.value })}
                              placeholder={field.field_label} required={field.is_required} />
                          )}
                          {field.field_type === 'textarea' && (
                            <Textarea value={formData[field.field_label] || ''} onChange={e => setFormData({ ...formData, [field.field_label]: e.target.value })}
                              placeholder={field.field_label} rows={4} required={field.is_required} />
                          )}
                          {field.field_type === 'select' && (
                            <Select value={formData[field.field_label] || ''} onValueChange={v => setFormData({ ...formData, [field.field_label]: v })}>
                              <SelectTrigger><SelectValue placeholder={`Select ${field.field_label}`} /></SelectTrigger>
                              <SelectContent>
                                {(field.options || []).map(opt => <SelectItem key={String(opt)} value={String(opt)}>{String(opt)}</SelectItem>)}
                              </SelectContent>
                            </Select>
                          )}
                          {field.field_type === 'file' && (
                            <div className="flex items-center gap-3">
                              <label className="flex items-center gap-2 px-4 py-2 border border-input rounded-md cursor-pointer hover:bg-muted transition-colors text-sm">
                                <Upload className="h-4 w-4" />
                                {files[field.field_label] ? files[field.field_label].name : 'Choose file'}
                                <input type="file" className="hidden" onChange={e => {
                                  if (e.target.files?.[0]) setFiles({ ...files, [field.field_label]: e.target.files[0] });
                                }} />
                              </label>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <Button type="submit" size="lg" className="w-full md:w-auto" disabled={submitMutation.isPending}>
                      {submitMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                      {ctaLabel}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          )}

          {/* Resource Downloads (shown after submission for resource pages) */}
          {isResourcePage && submitted && page.id && (
            <ResourceDownloadSection landingPageId={page.id} />
          )}

          {/* Social Share */}
          {isResourcePage && (
            <SocialShareButtons url={window.location.href} title={page.title} />
          )}

          {/* FAQ Sections */}
          {faqSections.map(section => {
            const items = Array.isArray((section.content as any)?.items)
              ? (section.content as any).items as { question: string; answer: string }[]
              : [];
            return <FAQSection key={section.id} title={section.title || 'Frequently Asked Questions'} items={items} />;
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
