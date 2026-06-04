'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, ChevronRight, Award, Users, BookOpen, MapPin, Sparkles, Star, Quote, ArrowRight, Image as ImageIcon, Newspaper } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { News, Event, MemberProfile, Testimonial, GalleryItem, Complaint } from '@/types';
import { useTranslation } from 'react-i18next';
import '@/lib/i18n-config';

export default function HomePage() {
  const { t, i18n } = useTranslation();
  const language = i18n.language?.startsWith('hi') ? 'hi' : 'en';
  const locale = language === 'hi' ? 'hi-IN' : 'en-IN';
  const [news, setNews] = useState<News[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    async function fetchData() {
      try {
        // Fetch News
        const { data: newsData } = await supabase
          .from('news')
          .select('*')
          .eq('is_published', true)
          .order('published_at', { ascending: false })
          .limit(3);
        
        if (newsData && newsData.length > 0) {
          setNews(newsData);
        }

        // Fetch Events
        const { data: eventsData } = await supabase
          .from('events')
          .select('*')
          .gte('date', new Date().toISOString())
          .order('date', { ascending: true })
          .limit(3);
        
        if (eventsData && eventsData.length > 0) {
          setEvents(eventsData);
        }

        // Fetch Featured Members from API to include role information
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        try {
          const membersRes = await fetch(`${apiUrl}/members?is_featured=true&limit=3`);
          const membersJson = await membersRes.json();
          if (membersRes.ok && membersJson.success && membersJson.data?.members) {
            setMembers(membersJson.data.members);
          }
        } catch (e) {
          console.error("Error fetching featured members for home page:", e);
        }

        // Fetch Testimonials
        const { data: testData } = await supabase
          .from('testimonials')
          .select('*')
          .eq('is_approved', true)
          .order('created_at', { ascending: false })
          .limit(3);
          
        if (testData && testData.length > 0) {
          setTestimonials(testData);
        }

        // Fetch verified Complaints
        const { data: complaintsData } = await supabase
          .from('complaints')
          .select('*')
          .eq('status', 'verified')
          .order('created_at', { ascending: false })
          .limit(3);
        
        if (complaintsData && complaintsData.length > 0) {
          setComplaints(complaintsData);
        }
      } catch (error) {
        console.error('Error fetching home data:', error);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. HERO SECTION */}
      {/* Background Video */}
      <section className="relative w-full min-h-[90vh] flex items-center justify-center overflow-hidden">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          className="absolute top-0 left-0 w-full h-full object-cover opacity-60 dark:opacity-40"
          style={{ zIndex: -1 }}
        >
          <source src="/pottery.mp4" type="video/mp4" />
        </video>
        {/* Dark overlay to ensure text remains readable */}
        <div className="absolute inset-0 bg-black/60 z-[-1]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20">
          
          <div className="space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 text-zinc-300 text-xs sm:text-sm font-semibold border border-white/10">
              <Sparkles className="w-4 h-4" />
              {t('home.heroTagline')}
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight font-heading leading-tight text-white">
              {t('home.heroTitle')} <span className="text-zinc-300">{t('home.heroCommunityTitle')}</span>
            </h1>
            <p className="text-lg text-zinc-300 max-w-xl mx-auto lg:mx-0">
              {t('home.heroSubtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <Link href="/sign-in" className="px-8 py-3 rounded-full bg-white text-zinc-950 font-bold hover:bg-zinc-100 shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2">
                {t('home.joinCommunity')}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link href="/directory" className="px-8 py-3 rounded-full bg-white/5 text-white font-bold border border-white/20 hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                {t('home.exploreDirectory')}
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto w-full">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all transform hover:-translate-y-1">
              <Users className="w-8 h-8 text-white mb-3" />
              <h3 className="text-xl font-bold text-white">{t('nav.directory')}</h3>
              <p className="text-xs text-zinc-400 mt-1">{t('directory.findConnect')}</p>
              <Link href="/directory" className="text-xs font-semibold text-zinc-300 flex items-center gap-1 mt-3 hover:underline">{t('common.view')} <ChevronRight className="w-3 h-3" /></Link>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all transform hover:-translate-y-1 sm:mt-6">
              <Newspaper className="w-8 h-8 text-white mb-3" />
              <h3 className="text-xl font-bold text-white">{t('nav.news')}</h3>
              <p className="text-xs text-zinc-400 mt-1">{t('news.getLatest')}</p>
              <Link href="/news" className="text-xs font-semibold text-zinc-300 flex items-center gap-1 mt-3 hover:underline">{t('news.readMore')} <ChevronRight className="w-3 h-3" /></Link>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all transform hover:-translate-y-1">
              <Calendar className="w-8 h-8 text-white mb-3" />
              <h3 className="text-xl font-bold text-white">{t('nav.events')}</h3>
              <p className="text-xs text-zinc-400 mt-1">{t('events.stayUpdated')}</p>
              <Link href="/events" className="text-xs font-semibold text-zinc-300 flex items-center gap-1 mt-3 hover:underline">{t('events.registerNow')} <ChevronRight className="w-3 h-3" /></Link>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all transform hover:-translate-y-1 sm:mt-6">
              <ImageIcon className="w-8 h-8 text-white mb-3" />
              <h3 className="text-xl font-bold text-white">{t('nav.gallery')}</h3>
              <p className="text-xs text-zinc-400 mt-1">{t('gallery.browsePhotos')}</p>
              <Link href="/gallery" className="text-xs font-semibold text-zinc-300 flex items-center gap-1 mt-3 hover:underline">{t('gallery.viewGallery')} <ChevronRight className="w-3 h-3" /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ABOUT/HERITAGE TEASER */}
      <section className="bg-secondary/30 border-y border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          <div className="space-y-6">
            <div className="bg-card border border-border p-8 rounded-3xl shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-8 -mt-8 transition-transform group-hover:scale-110" />
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary border border-primary/25">
                <Sparkles className="w-10 h-10" />
              </div>
              <h3 className="font-heading font-bold text-2xl text-secondary-foreground mt-4">{t('home.clayArt')}</h3>
              <p className="text-sm text-muted-foreground mt-2">
                {t('home.clayArtDesc')}
              </p>
              <Link href="/about" className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:underline mt-4">
                {t('home.exploreHeritage')} <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="space-y-6">
            <div className="text-xs font-bold text-primary uppercase tracking-wider">{t('home.ourPurpose')}</div>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-foreground">
              {t('home.connectingFamilies')}
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              {t('home.connectingDesc')}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex gap-3 items-start">
                <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{t('home.verifiedNetwork')}</h4>
                  <p className="text-xs text-muted-foreground">{t('home.verifiedNetworkDesc')}</p>
                </div>
              </div>
              <div className="flex gap-3 items-start">
                <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{t('home.profilePrivacy')}</h4>
                  <p className="text-xs text-muted-foreground">{t('home.profilePrivacyDesc')}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. NEWS & EVENTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Latest News */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold font-heading">{t('home.latestNews')}</h2>
              <Link href="/news" className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5">
                {t('home.viewAllNews')} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {news.map((item) => (
                <div key={item.id} className="bg-card border border-border rounded-2xl p-5 hover:border-primary/50 transition-colors flex flex-col sm:flex-row gap-4">
                  {item.image_url && (
                    <img src={item.image_url} alt={item.title} className="w-full sm:w-24 h-36 sm:h-24 object-cover rounded-xl shrink-0 bg-stone-100" />
                  )}
                  <div className="space-y-2">
                    <span className="inline-block px-2 py-0.5 bg-orange-100 dark:bg-orange-950/40 text-primary rounded-full text-[10px] font-bold uppercase">
                      {item.category}
                    </span>
                    <h3 className="font-bold text-sm sm:text-base text-foreground line-clamp-1 hover:text-primary transition-colors">
                      <Link href="/news">{item.title}</Link>
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{item.content}</p>
                    {item.published_at && (
                      <div className="text-[10px] text-muted-foreground pt-1">
                        {t('news.publishedOn')}: {isMounted ? new Date(item.published_at).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold font-heading">{t('home.upcomingEvents')}</h2>
              <Link href="/events" className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5">
                {t('home.viewAllEvents')} <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="space-y-4">
              {events.map((event) => (
                <div key={event.id} className="bg-card border border-border rounded-2xl p-5 hover:border-primary/50 transition-colors flex flex-col sm:flex-row gap-4">
                  {event.image_url && (
                    <img src={event.image_url} alt={event.title} className="w-full sm:w-28 h-28 object-cover rounded-xl shrink-0 bg-stone-100" />
                  )}
                  <div className="flex-1 space-y-2">
                    <h3 className="font-bold text-base text-foreground hover:text-primary transition-colors">
                      <Link href="/events">{event.title}</Link>
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">{event.description}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] text-muted-foreground pt-1">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        {isMounted && event.date ? new Date(event.date).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' }) : ''}
                      </span>
                      <span className="flex items-center gap-0.5 line-clamp-1">
                        <MapPin className="w-3.5 h-3.5 text-primary" />
                        {event.location.split(',')[1] || event.location}
                      </span>
                    </div>
                    <div className="pt-2">
                      <Link href="/events" className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline">
                        {t('events.registerNow')} <ChevronRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* 4. RECENT COMPLAINTS & NEEDS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-heading text-foreground">{t('home.recentComplaints')}</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">{t('home.recentComplaintsSubtitle')}</p>
          </div>
          <Link href="/complaints" className="text-xs font-semibold text-primary hover:underline flex items-center gap-0.5">
            {t('home.viewAllComplaints')} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {complaints.map((item) => (
            <div key={item.id} className="bg-card border border-border rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between h-48">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  {item.type === 'complaint' ? (
                    <span className="px-2.5 py-0.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold rounded uppercase text-[9px]">
                      {t('complaints.complaint')}
                    </span>
                  ) : (
                    <span className="px-2.5 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold rounded uppercase text-[9px]">
                      {t('complaints.need')}
                    </span>
                  )}
                  <span className="text-[10px] text-muted-foreground">
                    {isMounted && item.created_at ? new Date(item.created_at).toLocaleDateString(locale, { day: 'numeric', month: 'short' }) : ''}
                  </span>
                </div>
                <h3 className="font-bold text-sm sm:text-base text-foreground line-clamp-1 hover:text-primary transition-colors">
                  <Link href="/complaints">{item.title}</Link>
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">{item.description}</p>
              </div>
              <div className="border-t border-border pt-3 flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">
                  {t('home.by')} {item.is_anonymous ? t('home.anonymousMember') : (item.contact_name || t('home.member'))}
                </span>
                <Link href="/complaints" className="text-primary hover:underline font-bold">
                  {t('home.offerHelp')}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. FEATURED MEMBERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border">
        <div className="text-center max-w-xl mx-auto space-y-3 mb-10">
          <h2 className="text-3xl font-bold font-heading">{t('home.featuredMembers')}</h2>
          <p className="text-sm text-muted-foreground">{t('home.featuredMembersSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {members.map((member) => (
            <div key={member.id} className="bg-card border border-border rounded-2xl p-6 flex flex-col items-center text-center shadow-sm hover:shadow-md transition-shadow relative">
              <span className="absolute top-4 right-4 text-xs font-bold px-2 py-0.5 bg-orange-100 dark:bg-orange-950/40 text-primary rounded-full">
                {member.role === 'super_admin' ? 'Super Admin' : (member.role === 'admin' ? 'Admin' : member.state)}
              </span>
              <img
                src={member.profile_photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300'}
                alt={member.full_name}
                className="w-20 h-20 rounded-full object-cover border-2 border-primary bg-stone-100 mb-4"
              />
              <h3 className="font-bold text-base text-foreground">{member.full_name}</h3>
              <p className="text-xs text-primary font-medium mt-1">{member.profession}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{member.education}</p>
              <p className="text-xs text-muted-foreground mt-4 line-clamp-2 italic px-2">
                "{member.bio || (member.role === 'super_admin' ? 'Super Admin' : t('home.verifiedMember'))}"
              </p>
              <Link href="/directory" className="mt-5 text-xs font-semibold hover:underline text-primary">
                {t('directory.viewProfile')}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 6. TESTIMONIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-border">
        <div className="text-center max-w-xl mx-auto space-y-3 mb-10">
          <h2 className="text-3xl font-bold font-heading">{t('home.testimonials')}</h2>
          <p className="text-sm text-muted-foreground">{t('home.testimonialsSubtitle')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div className="flex gap-1 text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'fill-current' : 'opacity-30'}`} />
                  ))}
                </div>
                <p className="text-sm text-muted-foreground italic leading-relaxed">
                  "{testimonial.content}"
                </p>
              </div>
              <div className="flex items-center gap-2 mt-6 pt-4 border-t border-border">
                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                  {testimonial.name[0]}
                </div>
                <div className="text-xs">
                  <div className="font-bold text-foreground">{testimonial.name}</div>
                  <div className="text-[10px] text-muted-foreground">{t('home.verifiedMember')}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
