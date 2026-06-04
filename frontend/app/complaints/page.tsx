'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Complaint, ComplaintStatus } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  AlertTriangle, 
  HandHelping, 
  Search, 
  Plus, 
  X, 
  Calendar, 
  User, 
  Phone, 
  CheckCircle, 
  Filter, 
  Clock, 
  FileText, 
  MapPin,
  Sparkles
} from 'lucide-react';
import Link from 'next/link';

// Zod Schema for Complaint Submission
const complaintSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  type: z.enum(['complaint', 'need']),
  description: z.string().min(15, { message: 'Description must be at least 15 characters' }),
  isAnonymous: z.boolean(),
  contactName: z.string().min(2, { message: 'Contact name is required' }),
  contactMobile: z.string().min(10, { message: 'Enter a valid 10-digit mobile number' }),
  attachmentUrl: z.string().optional()
});

type ComplaintFormValues = z.infer<typeof complaintSchema>;

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [selectedType, setSelectedType] = useState<'all' | 'complaint' | 'need'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'approved' | 'resolved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  
  // Submission modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<ComplaintFormValues>({
    resolver: zodResolver(complaintSchema),
    defaultValues: {
      title: '',
      type: 'complaint',
      description: '',
      isAnonymous: false,
      contactName: '',
      contactMobile: '',
      attachmentUrl: ''
    }
  });

  // Load Session and Profile
  useEffect(() => {
    setIsMounted(true);
    async function fetchUserProfile(userId: string) {
      try {
        const { data } = await supabase
          .from('member_profiles')
          .select('*')
          .eq('id', userId)
          .single();
        if (data) {
          setUserProfile(data);
          form.setValue('contactName', data.full_name);
          if (data.mobile) {
            form.setValue('contactMobile', data.mobile);
          }
        }
      } catch (err) {
        console.error('Error fetching member profile:', err);
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setUserProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [form]);

  // Load verified complaints
  useEffect(() => {
    async function loadComplaints() {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('complaints')
          .select('*')
          .in('status', ['approved', 'resolved'])
          .order('created_at', { ascending: false });

        if (!error && data) {
          setComplaints(data as Complaint[]);
        }
      } catch (err) {
        console.error('Error loading complaints:', err);
      } finally {
        setLoading(false);
      }
    }
    loadComplaints();
  }, [submitSuccess]);

  // Form submission handler
  const onSubmit = async (values: ComplaintFormValues) => {
    if (!session) {
      setSubmitError('You must be logged in to submit a complaint or need.');
      return;
    }

    setSubmitting(true);
    setSubmitError(null);

    try {
      const { data, error } = await supabase
        .from('complaints')
        .insert({
          user_id: session.user.id,
          title: values.title,
          description: values.description,
          type: values.type,
          is_anonymous: values.isAnonymous,
          contact_name: values.contactName,
          contact_mobile: values.contactMobile,
          attachment_url: values.attachmentUrl || null,
          status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      setSubmitSuccess(true);
      form.reset({
        title: '',
        type: 'complaint',
        description: '',
        isAnonymous: false,
        contactName: userProfile?.full_name || '',
        contactMobile: userProfile?.mobile || '',
        attachmentUrl: ''
      });
      setTimeout(() => {
        setIsModalOpen(false);
        setSubmitSuccess(false);
      }, 3000);
    } catch (err: any) {
      console.error('Error submitting complaint:', err);
      setSubmitError(err.message || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filters logic
  const filteredComplaints = complaints.filter((item) => {
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    const matchesSearch = searchQuery === '' || 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesStatus && matchesSearch;
  });

  return (
    <div className="flex flex-col w-full pb-20 clay-pattern min-h-screen bg-stone-50 dark:bg-stone-950 text-foreground transition-all duration-300">
      {/* Premium Hero Banner */}
      <section className="bg-gradient-to-r from-orange-600 to-amber-700 dark:from-orange-950 dark:to-stone-900 text-white py-14 px-4 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(251,146,60,0.15),transparent)] pointer-events-none"></div>
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <span className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-orange-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" /> Community Support Desk
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading tracking-tight leading-tight">
            Complaints & Needs Forum
          </h1>
          <p className="text-sm sm:text-base text-orange-100 max-w-2xl mx-auto font-medium">
            A secure platform for the Prajapati Samaj. Submit complaints for grievance resolution or post community needs for cooperative assistance.
          </p>
        </div>
      </section>

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 w-full relative z-10 space-y-6">
        
        {/* Quick Stats & Submit Button Panel */}
        <div className="bg-card border border-border rounded-3xl p-4 sm:p-6 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-wrap gap-4 sm:gap-8 justify-center md:justify-start">
            <div className="text-center md:text-left">
              <div className="text-2xl sm:text-3xl font-extrabold font-heading text-primary">
                {complaints.filter(c => c.status === 'approved').length}
              </div>
              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Active Appeals</div>
            </div>
            <div className="h-10 w-px bg-border hidden sm:block"></div>
            <div className="text-center md:text-left">
              <div className="text-2xl sm:text-3xl font-extrabold font-heading text-emerald-600 dark:text-emerald-400">
                {complaints.filter(c => c.status === 'resolved').length}
              </div>
              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Needs Resolved</div>
            </div>
            <div className="h-10 w-px bg-border hidden sm:block"></div>
            <div className="text-center md:text-left">
              <div className="text-2xl sm:text-3xl font-extrabold font-heading text-stone-500">
                {complaints.length}
              </div>
              <div className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Total Filed</div>
            </div>
          </div>

          <div className="w-full md:w-auto">
            {session ? (
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/95 transition-all shadow-md cursor-pointer hover:shadow-lg hover:scale-[1.01]"
              >
                <Plus className="w-5 h-5" /> Submit Complaint or Need
              </button>
            ) : (
              <Link
                href="/sign-in?redirect=/complaints"
                className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl border border-primary text-primary bg-primary/5 hover:bg-primary/10 font-bold transition-all shadow-sm cursor-pointer"
              >
                Sign In to File Complaint
              </Link>
            )}
          </div>
        </div>

        {/* Filters and List */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          
          {/* Filters Sidebar */}
          <div className="lg:col-span-1 bg-card border border-border rounded-3xl p-5 shadow-md h-fit space-y-6">
            <h2 className="font-heading font-bold text-base flex items-center gap-2 text-foreground">
              <Filter className="w-4 h-4 text-primary" /> Filter Options
            </h2>
            
            {/* Search */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Search keywords</label>
              <div className="relative">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Title, description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-foreground"
                />
              </div>
            </div>

            {/* Type selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Appeal Type</label>
              <div className="flex flex-col gap-1.5">
                {[
                  { value: 'all', label: 'All Requests' },
                  { value: 'complaint', label: 'Complaints Only' },
                  { value: 'need', label: 'Needs Only' }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedType(opt.value as any)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                      selectedType === opt.value
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-muted-foreground hover:bg-secondary/40'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {selectedType === opt.value && <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>}
                  </button>
                ))}
              </div>
            </div>

            {/* Status selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Status</label>
              <div className="flex flex-col gap-1.5">
                {[
                  { value: 'all', label: 'All Active' },
                  { value: 'approved', label: 'Approved & Ongoing' },
                  { value: 'resolved', label: 'Fully Resolved' }
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setSelectedStatus(opt.value as any)}
                    className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center justify-between cursor-pointer ${
                      selectedStatus === opt.value
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'text-muted-foreground hover:bg-secondary/40'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {selectedStatus === opt.value && <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* List Area */}
          <div className="lg:col-span-3 space-y-4">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="bg-card border border-border rounded-3xl p-6 h-48 animate-pulse"></div>
                ))}
              </div>
            ) : filteredComplaints.length === 0 ? (
              <div className="text-center py-20 bg-card border border-border rounded-3xl space-y-4 shadow-sm">
                <FileText className="w-16 h-16 text-muted-foreground mx-auto opacity-30" />
                <h3 className="font-heading font-bold text-xl text-foreground">No Submissions Found</h3>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  There are no verified complaints or needs matching your filters at this moment.
                </p>
              </div>
            ) : (
              <div className="space-y-5">
                {filteredComplaints.map((item) => (
                  <div
                    key={item.id}
                    className="bg-card border border-border rounded-3xl p-6 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-5 relative overflow-hidden group"
                  >
                    {/* Top status & Type row */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {item.type === 'complaint' ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-full text-xs font-bold">
                            <AlertTriangle className="w-3.5 h-3.5" /> Complaint
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-xs font-bold">
                            <HandHelping className="w-3.5 h-3.5" /> Community Need
                          </span>
                        )}
                        
                        {item.status === 'resolved' ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full text-xs font-bold">
                            <CheckCircle className="w-3.5 h-3.5" /> Resolved
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-full text-xs font-bold">
                            <Clock className="w-3.5 h-3.5 animate-pulse" /> Active Appeal
                          </span>
                        )}
                      </div>

                      <span className="text-xs text-muted-foreground flex items-center gap-1 font-semibold">
                        <Calendar className="w-3.5 h-3.5 text-primary" />
                        {isMounted && item.created_at ? new Date(item.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        }) : ''}
                      </span>
                    </div>

                    {/* Main content body */}
                    <div className="space-y-2">
                      <h3 className="font-heading font-extrabold text-lg sm:text-xl text-foreground hover:text-primary transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    {/* Footer / Contact Details */}
                    <div className="border-t border-border/60 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-muted-foreground">
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <User className="w-4 h-4 text-primary shrink-0" />
                          <span className="font-semibold text-foreground">
                            {item.is_anonymous ? 'Anonymous Submitter' : (item.contact_name || 'Community Member')}
                          </span>
                        </div>
                        {!item.is_anonymous && item.contact_mobile && (
                          <div className="flex items-center gap-1.5">
                            <Phone className="w-4 h-4 text-primary shrink-0" />
                            <a href={`tel:${item.contact_mobile}`} className="hover:text-primary hover:underline transition-colors">
                              {item.contact_mobile}
                            </a>
                          </div>
                        )}
                      </div>
                      
                      {item.attachment_url && (
                        <a 
                          href={item.attachment_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-bold text-primary hover:underline cursor-pointer flex items-center gap-1 shrink-0"
                        >
                          View Document/Photo
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Submission Drawer / Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-card border border-border w-full max-w-lg rounded-3xl shadow-2xl p-6 relative overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border mb-4 shrink-0">
              <h2 className="font-heading font-extrabold text-xl text-foreground flex items-center gap-2">
                File a Complaint / Community Need
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body / Form Container */}
            <div className="flex-grow overflow-y-auto pr-1 space-y-4">
              {submitSuccess ? (
                <div className="text-center py-12 space-y-3">
                  <CheckCircle className="w-16 h-16 text-emerald-600 dark:text-emerald-400 mx-auto animate-bounce" />
                  <h3 className="font-heading font-bold text-xl text-foreground">Submitted Successfully!</h3>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                    Your request has been saved and queued for admin verification. It will be published as soon as an administrator approves it.
                  </p>
                </div>
              ) : (
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {submitError && (
                    <div className="p-3.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl text-xs font-semibold leading-relaxed">
                      {submitError}
                    </div>
                  )}

                  {/* Type */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Select Type</label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => form.setValue('type', 'complaint')}
                        className={`py-3 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                          form.watch('type') === 'complaint'
                            ? 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400 shadow-sm'
                            : 'border-border text-muted-foreground hover:bg-secondary/40'
                        }`}
                      >
                        <AlertTriangle className="w-4 h-4" /> Complaint
                      </button>
                      <button
                        type="button"
                        onClick={() => form.setValue('type', 'need')}
                        className={`py-3 px-4 rounded-xl border text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                          form.watch('type') === 'need'
                            ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400 shadow-sm'
                            : 'border-border text-muted-foreground hover:bg-secondary/40'
                        }`}
                      >
                        <HandHelping className="w-4 h-4" /> Community Need
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Appeal Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Need Financial Support / Reporting Encroachment..."
                      {...form.register('title')}
                      className="w-full px-3.5 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-foreground"
                    />
                    {form.formState.errors.title && (
                      <p className="text-xs text-rose-500 font-medium">{form.formState.errors.title.message}</p>
                    )}
                  </div>

                  {/* Description */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Detailed Description</label>
                    <textarea
                      rows={4}
                      placeholder="Detail the issue, the timeline, and what help is required from community members or admins..."
                      {...form.register('description')}
                      className="w-full px-3.5 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-foreground resize-none"
                    ></textarea>
                    {form.formState.errors.description && (
                      <p className="text-xs text-rose-500 font-medium">{form.formState.errors.description.message}</p>
                    )}
                  </div>

                  {/* Document Link */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Attachment Link (Optional)</label>
                    <input
                      type="text"
                      placeholder="Google Drive, Dropbox, or Photo url..."
                      {...form.register('attachmentUrl')}
                      className="w-full px-3.5 py-2.5 bg-secondary/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-foreground"
                    />
                  </div>

                  {/* Contact Information */}
                  <div className="p-4 bg-secondary/40 border border-border rounded-2xl space-y-3.5">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Contact Details</h4>
                      <label className="flex items-center gap-1.5 text-xs text-muted-foreground cursor-pointer select-none">
                        <input
                          type="checkbox"
                          {...form.register('isAnonymous')}
                          className="rounded border-border text-primary focus:ring-primary"
                        />
                        <span>Publish Anonymously</span>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Contact Name</label>
                        <input
                          type="text"
                          {...form.register('contactName')}
                          className="w-full px-3.5 py-2 bg-secondary/70 border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-foreground"
                        />
                        {form.formState.errors.contactName && (
                          <p className="text-[10px] text-rose-500">{form.formState.errors.contactName.message}</p>
                        )}
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Contact Mobile</label>
                        <input
                          type="text"
                          {...form.register('contactMobile')}
                          className="w-full px-3.5 py-2 bg-secondary/70 border border-border rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-foreground"
                        />
                        {form.formState.errors.contactMobile && (
                          <p className="text-[10px] text-rose-500">{form.formState.errors.contactMobile.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-bold hover:bg-primary/95 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Submitting...' : 'Submit Appeal'}
                    </button>
                  </div>
                </form>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
