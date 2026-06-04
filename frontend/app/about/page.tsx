import Link from 'next/link';
import { Award, Compass, Heart, History, Users } from 'lucide-react';

export default function AboutPage() {
  const traditions = [
    {
      title: 'Ancient Roots',
      description: 'The Prajapati Samaj trace their origin to Lord Brahma (Prajapati - the creator of the universe). In ancient scriptures, the art of pottery is described as one of the first human industries, bringing shape and purpose to raw earth.',
      icon: History
    },
    {
      title: 'Terracotta & Pottery Legacy',
      description: 'Our traditional pottery craft represents a deep connection to nature. The potters wheel represents the spinning earth, while water, clay, wind, and fire combine to create vessels that sustain life and store grain, milk, and water.',
      icon: Award
    },
    {
      title: 'Social & Cultural Unity',
      description: 'Beyond art, the community is known for its humility, hard work, and support of local agriculture. Today, the community has expanded into software engineering, civil services, entrepreneurship, and medical sciences.',
      icon: Users
    }
  ];

  return (
    <div className="flex flex-col w-full pb-20 clay-pattern">
      
      {/* 1. Header Banner */}
      <section className="bg-gradient-to-r from-orange-600 to-amber-700 text-white py-16 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-4xl sm:text-5xl font-extrabold font-heading">
            Our History & Cultural Heritage
          </h1>
          <p className="text-sm sm:text-base text-orange-100 max-w-xl mx-auto">
            Honoring the lineage of the creators, clay artisans, and leaders of the Prajapati Samaj.
          </p>
        </div>
      </section>

      {/* 2. Main Narrative & Pottery Legacy */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="text-xs font-bold text-primary uppercase tracking-widest">Heritage</div>
          <h2 className="text-3xl font-bold font-heading text-foreground">
            The Legend of Prajapati Craft
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The name <strong>Prajapati</strong> translates to "Lord of Creatures" or "Protector of Life". Our legacy is rooted in the creation of clay structures. In the ancient Indian society, the potter (Kumhar) was considered a central figure in village life. From the auspicious earthenware pots (Ghatas) used in wedding ceremonies, to the clay cups (Kulhars) representing eco-friendly drinking vessels, our community has sustained nature-aligned living.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            As time progressed, the community adapted. Today, we celebrate both the traditional potters preserving these manual wheels, and our younger generations setting up business houses, corporate engineering teams, and service agencies.
          </p>
          
          <div className="pt-2">
            <Link href="/gallery" className="px-6 py-2.5 rounded-full bg-primary text-white text-xs font-bold hover:bg-primary/95 transition-all shadow inline-block">
              View Heritage Gallery
            </Link>
          </div>
        </div>

        {/* Pottery Wheel SVG Detail Graphic */}
        <div className="bg-card border border-border rounded-3xl p-8 flex flex-col justify-center items-center text-center shadow-sm relative overflow-hidden">
          <svg className="w-56 h-56 text-primary/10 absolute -left-12 -bottom-12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 21c-4.4 0-8-3.6-8-8 0-2.8 1.4-4.8 3-6h10c1.6 1.2 3 3.2 3 6 0 4.4-3.6 8-8 8z" />
          </svg>
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 border border-primary/20 animate-spin-slow">
            {/* Spinning Potters Wheel Graphic */}
            <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10" />
              <circle cx="12" cy="12" r="4" />
              <line x1="12" y1="2" x2="12" y2="22" />
              <line x1="2" y1="12" x2="22" y2="12" />
            </svg>
          </div>
          <h3 className="font-heading font-bold text-xl text-secondary-foreground mb-2">The Wheel of Creation</h3>
          <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
            "Just as the potter shapes raw clay upon the spinning wheel, we shape our lives and destiny through hard work, integrity, and unity."
          </p>
        </div>
      </section>

      {/* 3. History Cards */}
      <section className="bg-secondary/40 border-y border-border py-16 px-4">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <h2 className="text-3xl font-bold font-heading">Our Three Core Pillars</h2>
            <p className="text-xs text-muted-foreground">The values that carry our community forward through centuries.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {traditions.map((pillar, idx) => {
              const Icon = pillar.icon;
              return (
                <div key={idx} className="bg-card border border-border rounded-2xl p-6 space-y-4 shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary border border-primary/20">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-foreground">{pillar.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{pillar.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Mission & Vision */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="bg-card border border-border rounded-3xl p-8 space-y-4 shadow-sm">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950/40 rounded-xl flex items-center justify-center text-primary">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-2xl text-foreground">Our Mission</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              To build a secure, connected, and supportive digital ecosystem for all Prajapati members. We strive to provide accessible education programs, verified matrimonial matching, digital job boards, and regional community meetups to help our families grow together.
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-card border border-border rounded-3xl p-8 space-y-4 shadow-sm">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950/40 rounded-xl flex items-center justify-center text-primary">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="font-heading font-bold text-2xl text-foreground">Our Vision</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              To transform the Prajapati Samaj into a digitally literate, economically empowered, and socially unified force. We envision a future where our cultural art forms are globally recognized and our youth are leading in technology and administration.
            </p>
          </div>
        </div>
      </section>

      {/* 5. Achievements Timeline */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-border">
        <div className="text-center max-w-xl mx-auto space-y-2 mb-12">
          <h2 className="text-3xl font-bold font-heading">Key Achievements</h2>
          <p className="text-xs text-muted-foreground">Milestones achieved by the Prajapati Kalyan Trust in recent years.</p>
        </div>

        <div className="space-y-8 relative before:absolute before:inset-0 before:left-4 md:before:left-1/2 before:w-0.5 before:bg-border">
          
          {/* Achievement 1 */}
          <div className="relative flex flex-col md:flex-row md:justify-between items-start md:items-center">
            <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-primary border-2 border-background transform -translate-x-1.5 md:-translate-x-2"></div>
            <div className="w-full md:w-[45%] pl-8 md:pl-0 md:text-right space-y-1">
              <span className="inline-block px-2.5 py-0.5 bg-secondary text-secondary-foreground rounded-full text-xs font-bold">2023</span>
              <h3 className="font-bold text-sm sm:text-base">Launch of Prajapati Education Trust</h3>
              <p className="text-xs text-muted-foreground">Secured ₹50 Lakhs in funding to sponsor higher education for outstanding students in the community.</p>
            </div>
            <div className="w-0 md:w-[45%]"></div>
          </div>

          {/* Achievement 2 */}
          <div className="relative flex flex-col md:flex-row md:justify-between items-start md:items-center">
            <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-primary border-2 border-background transform -translate-x-1.5 md:-translate-x-2"></div>
            <div className="w-0 md:w-[45%]"></div>
            <div className="w-full md:w-[45%] pl-8 space-y-1">
              <span className="inline-block px-2.5 py-0.5 bg-secondary text-secondary-foreground rounded-full text-xs font-bold">2024</span>
              <h3 className="font-bold text-sm sm:text-base">Morbi Ceramic Skill Development Center</h3>
              <p className="text-xs text-muted-foreground">Opened a physical workspace to train 200+ artisans annually in advanced gas kilns and design marketing.</p>
            </div>
          </div>

          {/* Achievement 3 */}
          <div className="relative flex flex-col md:flex-row md:justify-between items-start md:items-center">
            <div className="absolute left-4 md:left-1/2 w-4 h-4 rounded-full bg-primary border-2 border-background transform -translate-x-1.5 md:-translate-x-2"></div>
            <div className="w-full md:w-[45%] pl-8 md:pl-0 md:text-right space-y-1">
              <span className="inline-block px-2.5 py-0.5 bg-secondary text-secondary-foreground rounded-full text-xs font-bold">2025</span>
              <h3 className="font-bold text-sm sm:text-base">Community Center Construction</h3>
              <p className="text-xs text-muted-foreground">Inaugurated a full-capacity community community hall in Jaipur to host weddings, gatherings, and seminars.</p>
            </div>
            <div className="w-0 md:w-[45%]"></div>
          </div>

        </div>
      </section>

    </div>
  );
}
