import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Search, Calendar, Clock, ArrowRight, ChevronLeft, Tag, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { categories } from "@/data/blogData";

type BlogPost = {
  id: string; title: string; slug: string; content: string | null; excerpt: string | null;
  category: string | null; featured_image: string | null; author_name: string | null;
  author_role: string | null; tags: string[] | null; published: boolean; featured: boolean;
  read_time: string | null; publish_date: string | null; created_at: string;
};

/* ─── individual post view ─── */
const BlogPostView = ({ post, allPosts, onBack, onSelect }: { post: BlogPost; allPosts: BlogPost[]; onBack: () => void; onSelect: (id: string) => void }) => {
  const related = allPosts.filter((p) => p.id !== post.id && p.category === post.category).slice(0, 3);
  const image = post.featured_image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80";

  return (
    <div className="pt-20 md:pt-24">
      <div className="container px-4 py-6">
        <button onClick={onBack} className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
          <ChevronLeft className="w-4 h-4" /> Back to Blog
        </button>
      </div>
      <div className="container px-4">
        <div className="rounded-2xl overflow-hidden aspect-[21/9] max-h-[420px]">
          <img src={image} alt={post.title} className="w-full h-full object-cover" />
        </div>
      </div>
      <article className="container px-4 py-10 max-w-3xl mx-auto">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {post.category && <Badge className="bg-primary/10 text-primary border-0">{post.category}</Badge>}
          {post.publish_date && <span className="flex items-center gap-1 text-xs text-muted-foreground"><Calendar className="w-3 h-3" />{new Date(post.publish_date).toLocaleDateString("en-US",{month:"long",day:"numeric",year:"numeric"})}</span>}
          {post.read_time && <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="w-3 h-3" />{post.read_time}</span>}
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4 leading-tight">{post.title}</h1>
        {post.author_name && (
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">{post.author_name.split(" ").map(n=>n[0]).join("")}</div>
            <div>
              <p className="text-sm font-semibold text-foreground">{post.author_name}</p>
              {post.author_role && <p className="text-xs text-muted-foreground">{post.author_role}</p>}
            </div>
          </div>
        )}
        <div className="flex items-center gap-2 mb-8 pb-8 border-b border-border">
          <span className="text-sm text-muted-foreground mr-2">Share:</span>
          {["LinkedIn","Twitter","Facebook"].map(s=>(
            <button key={s} className="h-8 w-8 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors text-xs font-bold">{s[0]}</button>
          ))}
        </div>
        <div className="prose prose-lg max-w-none text-foreground/85 leading-relaxed space-y-4">
          {(post.content || '').split("\n\n").map((block, i) => {
            if (block.startsWith("## ")) return <h2 key={i} className="text-xl font-bold text-foreground mt-8 mb-3">{block.replace("## ", "")}</h2>;
            if (block.startsWith("- ")) return <ul key={i} className="list-disc pl-5 space-y-1">{block.split("\n").map((li,j)=><li key={j}>{li.replace(/^- /,"")}</li>)}</ul>;
            return <p key={i}>{block}</p>;
          })}
        </div>
        {post.tags && Array.isArray(post.tags) && post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 mt-10 pt-8 border-t border-border">
            <Tag className="w-4 h-4 text-muted-foreground" />
            {post.tags.map(t=><Badge key={t} variant="outline" className="text-xs">{t}</Badge>)}
          </div>
        )}
      </article>
      {related.length > 0 && (
        <section className="bg-secondary py-16">
          <div className="container px-4">
            <h2 className="text-2xl font-bold text-foreground mb-8">Related Articles</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {related.map(p=><PostCard key={p.id} post={p} onSelect={onSelect} compact />)}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

/* ─── post card ─── */
const PostCard = ({ post, onSelect, compact = false }: { post: BlogPost; onSelect?: (id: string) => void; compact?: boolean }) => {
  const image = post.featured_image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80";
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="group bg-card rounded-2xl overflow-hidden border border-border hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onSelect?.(post.id)}
    >
      <div className={`overflow-hidden ${compact ? "aspect-[16/10]" : "aspect-video"}`}>
        <img src={image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          {post.category && <Badge className="bg-primary/10 text-primary border-0 text-[10px]">{post.category}</Badge>}
          {post.read_time && <span className="text-[11px] text-muted-foreground flex items-center gap-1"><Clock className="w-3 h-3" />{post.read_time}</span>}
        </div>
        <h3 className={`font-bold text-foreground group-hover:text-primary transition-colors leading-snug ${compact ? "text-base mb-2" : "text-lg mb-3"}`}>{post.title}</h3>
        {!compact && post.excerpt && <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{post.excerpt}</p>}
        <div className="flex items-center justify-between">
          {post.publish_date && <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(post.publish_date).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"})}</span>}
          <span className="text-xs font-semibold text-primary flex items-center gap-1 group-hover:gap-2 transition-all">Read More <ArrowRight className="w-3 h-3" /></span>
        </div>
      </div>
    </motion.article>
  );
};

/* ─── main blog page ─── */
const Blog = () => {
  const [selectedPost, setSelectedPost] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['public-blog-posts'],
    queryFn: async () => {
      const { data, error } = await supabase.from('blog_posts').select('*').eq('published', true).order('publish_date', { ascending: false });
      if (error) throw error;
      return (data || []) as BlogPost[];
    },
  });

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const matchSearch = !search || p.title.toLowerCase().includes(search.toLowerCase()) || (p.excerpt || '').toLowerCase().includes(search.toLowerCase()) || (Array.isArray(p.tags) && p.tags.some(t => t.toLowerCase().includes(search.toLowerCase())));
      return matchCat && matchSearch;
    });
  }, [activeCategory, search, posts]);

  const featuredPosts = posts.filter((p) => p.featured);
  const currentPost = posts.find((p) => p.id === selectedPost);

  if (currentPost) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <BlogPostView post={currentPost} allPosts={posts} onBack={() => setSelectedPost(null)} onSelect={(id) => { setSelectedPost(id); window.scrollTo(0, 0); }} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* ── Hero ── */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 bg-gradient-to-br from-primary via-primary/90 to-primary/70 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          {[...Array(5)].map((_, i) => (
            <motion.div key={i} className="absolute rounded-full bg-background" style={{ width: 80 + i * 60, height: 80 + i * 60, top: `${10 + i * 15}%`, left: `${60 + i * 8}%` }} animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }} transition={{ duration: 4 + i, repeat: Infinity }} />
          ))}
        </div>
        <div className="container px-4 relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Badge className="bg-background/20 text-primary-foreground border-0 mb-4">Our Blog</Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4">Tech Insights</h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto text-base sm:text-lg">
              Welcome to the Zap Technologies Blog! Here, we share the latest trends, tips, and insights about software development, IT solutions, and more.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Loading / Featured Posts ── */}
      {isLoading ? (
        <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
      ) : (
        <>
          {/* ── Featured Posts ── */}
          {featuredPosts.length > 0 && (
            <section className="py-16 bg-secondary">
              <div className="container px-4">
                <h2 className="text-2xl font-bold text-foreground mb-2">Editor's Picks</h2>
                <p className="text-muted-foreground mb-8">Hand-picked articles showcasing our expertise</p>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <motion.article
                    initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                    className="lg:col-span-2 group relative rounded-2xl overflow-hidden cursor-pointer min-h-[320px]"
                    onClick={() => setSelectedPost(featuredPosts[0].id)}
                  >
                    <img src={featuredPosts[0].featured_image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80"} alt={featuredPosts[0].title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                      <Badge className="bg-accent text-accent-foreground border-0 mb-3">Featured</Badge>
                      <h3 className="text-xl sm:text-2xl font-bold text-background mb-2">{featuredPosts[0].title}</h3>
                      <p className="text-background/70 text-sm line-clamp-2 mb-3 max-w-lg">{featuredPosts[0].excerpt}</p>
                      <span className="text-accent text-sm font-semibold flex items-center gap-1">Read Article <ArrowRight className="w-4 h-4" /></span>
                    </div>
                  </motion.article>
                  <div className="flex flex-col gap-6">
                    {featuredPosts.slice(1, 3).map((p) => (
                      <motion.article key={p.id} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                        className="group relative rounded-2xl overflow-hidden cursor-pointer min-h-[148px] flex-1"
                        onClick={() => setSelectedPost(p.id)}
                      >
                        <img src={p.featured_image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80"} alt={p.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/90 via-foreground/40 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                          <Badge className="bg-accent text-accent-foreground border-0 mb-2 text-[10px]">Featured</Badge>
                          <h3 className="text-base font-bold text-background leading-snug">{p.title}</h3>
                        </div>
                      </motion.article>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* ── Search + Categories ── */}
          <section className="py-16">
            <div className="container px-4">
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-8">
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input placeholder="Search articles..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-10">
                {categories.map((cat) => (
                  <button key={cat} onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${activeCategory === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-primary/10"}`}
                  >{cat}</button>
                ))}
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-6">{activeCategory === "All" ? "Latest Articles" : activeCategory}</h2>
              {filteredPosts.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground text-lg">No articles found. Try a different search or category.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.map((post) => <PostCard key={post.id} post={post} onSelect={setSelectedPost} />)}
                </div>
              )}
            </div>
          </section>
        </>
      )}

      {/* ── Newsletter CTA ── */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80">
        <div className="container px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">Stay Updated</h2>
            <p className="text-primary-foreground/80 max-w-xl mx-auto mb-8">Don't miss out on the latest tech trends. Subscribe to our newsletter!</p>
            {subscribed ? (
              <p className="text-accent font-semibold text-lg">🎉 Thanks for subscribing!</p>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); if (email) setSubscribed(true); }} className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto">
                <Input placeholder="Enter your email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="bg-background/10 border-background/20 text-primary-foreground placeholder:text-primary-foreground/50" required />
                <Button variant="cta" type="submit" className="rounded-full px-8 w-full sm:w-auto whitespace-nowrap">Subscribe</Button>
              </form>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="py-20">
        <div className="container px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Start Your Project?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-8">Let's turn your ideas into reality.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="cta" size="lg" className="rounded-full px-8" asChild><a href="/contact">Send Us a Message</a></Button>
            <Button variant="outline" size="lg" className="rounded-full px-8" asChild><a href="/hire">Hire a Developer</a></Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Blog;
