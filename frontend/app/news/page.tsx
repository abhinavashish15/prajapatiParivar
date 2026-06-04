'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Tag, ChevronRight, Newspaper, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { News } from '@/types';

// Mock news fallback
const fallbackNews: News[] = [
  {
    id: 'n1',
    title: 'National Clay Artist Exhibition Announced for August 2026',
    content: 'We are proud to announce the national-level exhibition to showcase the heritage of clay craftsmanship. Outstanding artists from the community will showcase terracotta models, designer pots, and modern eco-friendly ceramics in Delhi. Registration is open for participants now. Cash prizes and recognition awards will be given by national dignitaries.',
    category: 'Announcements',
    image_url: 'https://images.unsplash.com/photo-1565192647048-f997ded87958?q=80&w=800',
    is_featured: true,
    status: 'published',
    author_id: null,
    published_at: '2026-05-28T10:00:00Z',
    created_at: '',
    updated_at: ''
  },
  {
    id: 'n2',
    title: 'Prajapati Samaj Honors High School Merit Scholars',
    content: 'During last week\'s regional meeting, over 45 students from the Prajapati community who scored above 95% in their board examinations were felicitated with medals and laptops. The education trust also announced sponsorships for higher studies.',
    category: 'News',
    image_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800',
    is_featured: false,
    status: 'published',
    author_id: null,
    published_at: '2026-05-25T11:30:00Z',
    created_at: '',
    updated_at: ''
  },
  {
    id: 'n3',
    title: 'New Matrimony Module Launched on PrajapatiParivar.in',
    content: 'We have successfully launched our new, secure matrimony directory on the community portal. Members can now create biodata profiles, adjust privacy rules (private, member-only, public), and search verified bride and groom profiles. Registrations are free.',
    category: 'Updates',
    image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800',
    is_featured: false,
    status: 'published',
    author_id: null,
    published_at: '2026-05-29T09:00:00Z',
    created_at: '',
    updated_at: ''
  },
  {
    id: 'n4',
    title: 'Notice: Annual General Meeting Scheduled for December',
    content: 'The annual general meeting of Prajapati Kalyan Samiti will be held on December 20, 2026, at Jaipur. The meeting agenda includes annual budgeting, trust updates, election of district coordinators, and future development projects.',
    category: 'Notices',
    image_url: null,
    is_featured: false,
    status: 'published',
    author_id: null,
    published_at: '2026-05-20T10:00:00Z',
    created_at: '',
    updated_at: ''
  }
];

export default function NewsPage() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    async function loadNews() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('news')
          .select('*')
          .eq('status', 'published')
          .order('published_at', { ascending: false });

        if (!error && data && data.length > 0) {
          setNews(data as News[]);
        } else {
          setNews(fallbackNews);
        }
      } catch {
        setNews(fallbackNews);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  // Filter categories
  const categories = ['All', 'Announcements', 'News', 'Updates', 'Notices'];

  const filteredNews = news.filter((item) => {
    return selectedCategory === 'All' || item.category === selectedCategory;
  });

  // Extract featured news
  const featuredItem = news.find((item) => item.is_featured);
  const secondaryNews = filteredNews.filter((item) => item.id !== featuredItem?.id);

  return (
    <div className="flex flex-col w-full pb-20 clay-pattern">
      {/* Header */}
      <section className="bg-gradient-to-r from-orange-600 to-amber-700 text-white py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading">
            News & Announcements
          </h1>
          <p className="text-sm text-orange-100 max-w-lg mx-auto">
            Stay updated with current community alerts, scholarship declarations, and regional notifications.
          </p>
        </div>
      </section>

      {/* Category selector */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 w-full relative z-10">
        <div className="bg-card border border-border rounded-2xl p-3.5 shadow-lg flex flex-wrap gap-2 justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-primary text-white shadow-sm'
                  : 'text-muted-foreground hover:text-primary hover:bg-secondary/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Featured News Focus */}
      {selectedCategory === 'All' && featuredItem && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
          <div className="bg-card border border-border rounded-3xl overflow-hidden shadow-md flex flex-col lg:flex-row gap-8 p-6 lg:p-8">
            {featuredItem.image_url && (
              <div className="w-full lg:w-[45%] aspect-video lg:aspect-square shrink-0 rounded-2xl overflow-hidden border border-border bg-stone-100">
                <img src={featuredItem.image_url} alt={featuredItem.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-grow flex flex-col justify-between space-y-4">
              <div className="space-y-3.5">
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/15 text-primary rounded-full text-xs font-bold uppercase tracking-wider">
                  Featured Announcement
                </span>
                
                <h2 className="font-heading font-bold text-xl sm:text-3xl text-foreground hover:text-primary transition-colors">
                  {featuredItem.title}
                </h2>
                
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {featuredItem.content}
                </p>
              </div>

              <div className="flex items-center justify-between border-t border-border pt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-primary" />
                  {isMounted && featuredItem.published_at && new Date(featuredItem.published_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
                <span className="flex items-center gap-1 font-bold text-primary">
                  {featuredItem.category}
                </span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Secondary News list */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 w-full">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 h-40 animate-pulse"></div>
            ))}
          </div>
        ) : (selectedCategory === 'All' ? secondaryNews : filteredNews).length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-3xl space-y-2">
            <Newspaper className="w-12 h-12 text-muted-foreground mx-auto opacity-35" />
            <h3 className="font-heading font-bold text-lg text-foreground">No News Items</h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              There are no announcements listed under this category at this time.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(selectedCategory === 'All' ? secondaryNews : filteredNews).map((item) => (
              <div
                key={item.id}
                className="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {item.image_url && (
                    <div className="aspect-video w-full rounded-xl overflow-hidden border border-border bg-stone-100">
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 bg-secondary text-secondary-foreground font-bold rounded text-[10px] uppercase">
                      {item.category}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      {isMounted && item.published_at && new Date(item.published_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-base text-foreground hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                    {item.content}
                  </p>
                </div>

                <div className="border-t border-border/60 pt-3 flex justify-end">
                  <span className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5 cursor-pointer">
                    Read Announcement <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
