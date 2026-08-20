import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, DollarSign, MessageSquare, Link2, TrendingUp, Users } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const AdminDashboard = () => {
  const { data: blogCount = 0 } = useQuery({
    queryKey: ['admin-stats-blog'],
    queryFn: async () => {
      const { count } = await supabase.from('blog_posts').select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: pricingCount = 0 } = useQuery({
    queryKey: ['admin-stats-pricing'],
    queryFn: async () => {
      const { count } = await supabase.from('pricing_packages').select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: queryCount = 0 } = useQuery({
    queryKey: ['admin-stats-queries'],
    queryFn: async () => {
      const { count } = await supabase.from('form_queries').select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: linkCount = 0 } = useQuery({
    queryKey: ['admin-stats-links'],
    queryFn: async () => {
      const { count } = await supabase.from('managed_links').select('*', { count: 'exact', head: true });
      return count || 0;
    },
  });

  const { data: recentQueries = [] } = useQuery({
    queryKey: ['admin-recent-queries'],
    queryFn: async () => {
      const { data } = await supabase.from('form_queries').select('name, subject, created_at, status').order('created_at', { ascending: false }).limit(5);
      return data || [];
    },
  });

  const stats = [
    { title: 'Blog Posts', value: blogCount, icon: FileText, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Pricing Packages', value: pricingCount, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-500/10' },
    { title: 'Form Queries', value: queryCount, icon: MessageSquare, color: 'text-orange-500', bg: 'bg-orange-500/10' },
    { title: 'Managed Links', value: linkCount, icon: Link2, color: 'text-purple-500', bg: 'bg-purple-500/10' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome to the Zap Technologies Admin Panel</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-border/60">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.title}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-primary" />
                Recent Queries
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentQueries.length === 0 ? (
                <p className="text-sm text-muted-foreground">No form submissions yet.</p>
              ) : (
                <div className="space-y-3">
                  {recentQueries.map((q: any, i: number) => (
                    <div key={i} className="flex items-center justify-between text-sm border-b border-border/40 pb-2 last:border-0">
                      <div>
                        <p className="font-medium text-foreground">{q.name}</p>
                        <p className="text-muted-foreground text-xs">{q.subject || 'No subject'}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">{new Date(q.created_at).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">Use the sidebar to navigate to different management sections. All changes are saved to the database in real-time.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
