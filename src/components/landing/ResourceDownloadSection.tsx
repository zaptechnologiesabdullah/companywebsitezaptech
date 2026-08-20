import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, ExternalLink, TrendingUp, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type Resource = {
  id: string; title: string; description: string | null;
  file_url: string | null; resource_type: string; category: string | null;
  download_count: number; sort_order: number | null;
};

const ResourceDownloadSection = ({ landingPageId }: { landingPageId: string }) => {
  const { data: resources = [], isLoading } = useQuery({
    queryKey: ['landing-resources', landingPageId],
    queryFn: async () => {
      const { data, error } = await supabase.from('resources')
        .select('*').eq('landing_page_id', landingPageId).eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      return data as Resource[];
    },
  });

  const maxDownloads = Math.max(...resources.map(r => r.download_count), 0);

  const handleDownload = async (resource: Resource) => {
    if (!resource.file_url) return;
    try {
      await supabase.rpc('increment_download_count', { resource_id: resource.id });
    } catch (e) { /* silent */ }
    window.open(resource.file_url, '_blank');
    toast.success(`Downloading "${resource.title}"`);
  };

  if (isLoading) {
    return <div className="flex justify-center py-8"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  if (resources.length === 0) return null;

  const categories = [...new Set(resources.filter(r => r.category).map(r => r.category!))];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">📥 Download Resources</h2>
        <p className="text-muted-foreground mt-2">Access all available resources below</p>
      </div>

      {categories.length > 1 && (
        <div className="flex flex-wrap gap-2 justify-center">
          {categories.map(cat => (
            <Badge key={cat} variant="secondary">{cat}</Badge>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {resources.map(resource => {
          const isPopular = maxDownloads > 0 && resource.download_count >= maxDownloads * 0.7;
          return (
            <Card key={resource.id} className={`border-border/60 transition-shadow hover:shadow-md ${isPopular ? 'ring-2 ring-primary/20' : ''}`}>
              <CardContent className="p-5 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{resource.title}</h3>
                      {isPopular && (
                        <Badge variant="default" className="text-xs flex items-center gap-1">
                          <TrendingUp className="h-3 w-3" /> Popular
                        </Badge>
                      )}
                    </div>
                    {resource.description && (
                      <p className="text-sm text-muted-foreground">{resource.description}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {resource.category && <Badge variant="outline" className="text-xs">{resource.category}</Badge>}
                    {resource.resource_type === 'premium' && <Badge variant="secondary" className="text-xs">Premium</Badge>}
                    <span className="text-xs text-muted-foreground">{resource.download_count} downloads</span>
                  </div>
                  <Button size="sm" onClick={() => handleDownload(resource)} disabled={!resource.file_url}>
                    {resource.file_url?.startsWith('http') && !resource.file_url?.includes('supabase')
                      ? <><ExternalLink className="h-3.5 w-3.5 mr-1" /> Open</>
                      : <><Download className="h-3.5 w-3.5 mr-1" /> Download</>
                    }
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ResourceDownloadSection;
