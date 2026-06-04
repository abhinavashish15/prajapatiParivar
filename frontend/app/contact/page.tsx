'use client';

import { Mail, Phone, MapPin, CheckCircle, Send, Globe, Share2 } from 'lucide-react';

export default function ContactPage() {

  return (
    <div className="flex flex-col w-full pb-20 clay-pattern">
      {/* Header */}
      <section className="bg-gradient-to-r from-orange-600 to-amber-700 text-white py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading">
            Contact Support Desk
          </h1>
          <p className="text-sm text-orange-100 max-w-lg mx-auto">
            Have queries about matrimony registration, member directories, or community notices? Send us a message.
          </p>
        </div>
      </section>

      {/* Main Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          
          {/* Info Panel (Col 2) */}
          <div className="lg:col-span-2 space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold font-heading text-foreground">Get In Touch</h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Our support team is available during weekdays to address any technical questions, help approve pending matrimony bio-data, and register community organizations.
              </p>
            </div>

            {/* Office details */}
            <div className="space-y-5">
              
              {/* Address */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="text-sm">
                  <h4 className="font-bold text-foreground">Central Office</h4>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    Darbhanga Bihar 847405
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div className="text-sm">
                  <h4 className="font-bold text-foreground">Phone & Mobile</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Helpdesk / WhatsApp: +91 6376506645
                  </p>
                </div>
              </div>

              {/* Email */}
              <div className="flex gap-4 items-start">
                <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 text-primary flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-sm">
                  <h4 className="font-bold text-foreground">Email Contact</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    abhinavashissh@gmail.com
                  </p>
                </div>
              </div>

            </div>

            {/* Social Links */}
            <div className="pt-6 border-t border-border space-y-3">
              <h4 className="font-bold text-sm font-heading">Follow Samaj Activities</h4>
              <div className="flex gap-3">
                <a href="#" className="p-2.5 rounded-full border border-border hover:bg-secondary/40 text-stone-500 hover:text-primary transition-colors" aria-label="Facebook">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                  </svg>
                </a>
                <a href="#" className="p-2.5 rounded-full border border-border hover:bg-secondary/40 text-stone-500 hover:text-primary transition-colors" aria-label="Youtube">
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
                    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
                  </svg>
                </a>
                <a href="#" className="p-2.5 rounded-full border border-border hover:bg-secondary/40 text-stone-500 hover:text-primary transition-colors" aria-label="Website">
                  <Globe className="w-5 h-5" />
                </a>
              </div>
            </div>

          </div>

          {/* Direct Email Panel (Col 3) */}
          <div className="lg:col-span-3 bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col justify-center items-center text-center space-y-6">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary mx-auto">
              <Mail className="w-10 h-10" />
            </div>
            <h3 className="font-heading font-bold text-2xl text-foreground">Reach Out To Us</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We'd love to hear from you. For any inquiries, support requests, or feedback, please drop us an email directly at:
            </p>
            <a 
              href="mailto:abhinavashissh@gmail.com" 
              className="inline-flex items-center gap-2 px-6 py-4 bg-primary text-primary-foreground font-bold text-lg rounded-2xl hover:bg-primary/90 transition-transform hover:scale-105 shadow-md"
            >
              <Send className="w-5 h-5" />
              abhinavashissh@gmail.com
            </a>
          </div>

        </div>
      </section>
    </div>
  );
}
