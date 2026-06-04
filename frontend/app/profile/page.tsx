'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/lib/supabase';
import { User, Settings, CheckCircle, Save, AlertTriangle, Clock, XCircle, Plus, Phone, Calendar, Trash2 } from 'lucide-react';
import { MemberProfile, UserRole, Complaint } from '@/types';

const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry'
];

// Zod schema for member profile
const memberSchema = z.object({
  fullName: z.string().min(3, { message: 'Name must be at least 3 characters' }),
  fatherName: z.string().min(3, { message: "Father/Husband's name is required" }),
  motherName: z.string().optional(),
  gender: z.enum(['male', 'female', 'other']),
  maritalStatus: z.string().nonempty({ message: 'Marital Status is required' }),
  dob: z.string().nonempty({ message: 'Please enter Date of Birth' }),
  mobile: z.string().min(10, { message: 'Phone must be at least 10 digits' }),
  address: z.string().nonempty({ message: 'Address is required' }),
  state: z.string().nonempty({ message: 'State is required' }),
  district: z.string().nonempty({ message: 'District is required' }),
  profession: z.string().nonempty({ message: 'Profession is required' }),
  bio: z.string().max(300, { message: 'Bio cannot exceed 300 characters' }).optional(),
  profilePhoto: z.string().optional()
});

type MemberFormValues = z.infer<typeof memberSchema>;

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string>('guest');
  const [memberSuccess, setMemberSuccess] = useState(false);
  const [profileTab, setProfileTab] = useState<'dashboard' | 'profile' | 'complaints'>('dashboard');
  const [myComplaints, setMyComplaints] = useState<Complaint[]>([]);
  const [complaintsLoading, setComplaintsLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  const memberForm = useForm<MemberFormValues>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      fullName: '',
      fatherName: '',
      motherName: '',
      gender: 'male',
      maritalStatus: '',
      dob: '',
      mobile: '',
      address: '',
      state: '',
      district: '',
      profession: '',
      bio: '',
      profilePhoto: ''
    }
  });
  
  // Watch form values for reactive dashboard updates
  const formWatch = memberForm.watch();

  useEffect(() => {
    async function loadData(currentSession: any) {
      if (!currentSession) {
        router.push('/sign-in?redirect=/profile');
        return;
      }
      
      setUser(currentSession.user);

      try {
        // Fetch User Role
        const { data: roleData } = await supabase
          .from('user_roles')
          .select('role')
          .eq('id', currentSession.user.id)
          .single();

        if (roleData) {
          setRole(roleData.role);
        }

        // Fetch Member Profile
        const { data: mProfile } = await supabase
          .from('member_profiles')
          .select('*')
          .eq('id', currentSession.user.id)
          .single();

        if (mProfile) {
          setProfilePhoto(mProfile.profile_photo);
          memberForm.reset({
            fullName: mProfile.full_name || '',
            fatherName: mProfile.father_husband_name || '',
            motherName: mProfile.mother_name || '',
            gender: mProfile.gender || 'male',
            maritalStatus: mProfile.marital_status || '',
            dob: mProfile.dob || '',
            mobile: mProfile.mobile || '',
            address: mProfile.address || '',
            state: mProfile.state || '',
            district: mProfile.district || '',
            profession: mProfile.profession || '',
            bio: mProfile.bio || '',
            profilePhoto: mProfile.profile_photo || ''
          });
        }

        loadMyComplaints(currentSession.user.id);

      } catch (err) {
        console.warn('Error fetching profile:', err);
      } finally {
        setLoading(false);
      }
    }

    // 1. Check current session immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        loadData(session);
      } else {
        router.push('/sign-in?redirect=/profile');
      }
    });

    // 2. Listen for auth changes to catch session if loaded late
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        loadData(session);
      } else {
        router.push('/sign-in?redirect=/profile');
      }
    });

    return () => subscription.unsubscribe();
  }, [router, memberForm]);

  async function loadMyComplaints(userId: string) {
    setComplaintsLoading(true);
    try {
      const { data, error } = await supabase
        .from('complaints')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (!error && data) {
        setMyComplaints(data as Complaint[]);
      }
    } catch (err) {
      console.error('Error fetching my complaints:', err);
    } finally {
      setComplaintsLoading(false);
    }
  }

  const onMemberSubmit = async (data: MemberFormValues) => {
    if (!user) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await fetch(`${apiUrl}/members/profile/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token || ''}`
        },
        body: JSON.stringify({
          full_name: data.fullName,
          father_husband_name: data.fatherName,
          mother_name: data.motherName || null,
          gender: data.gender,
          marital_status: data.maritalStatus,
          dob: data.dob,
          mobile: data.mobile,
          address: data.address,
          state: data.state,
          district: data.district,
          profession: data.profession,
          bio: data.bio || '',
          profile_photo: data.profilePhoto || null
        })
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setMemberSuccess(true);
        setTimeout(() => setMemberSuccess(false), 3000);
      } else {
        alert('Could not update profile: ' + (result.message || 'Unknown error'));
      }
    } catch (err: any) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    if (confirm("Are you absolutely sure you want to delete your account? This action cannot be undone.")) {
      setDeleteLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        const { data: { session } } = await supabase.auth.getSession();
        
        const response = await fetch(`${apiUrl}/members/profile/me`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${session?.access_token || ''}`
          }
        });

        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || 'Failed to delete via server');
        }

        await supabase.auth.signOut();
        router.push('/');
      } catch (err: any) {
        alert('Failed to delete account: ' + err.message);
        setDeleteLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex-grow flex items-center justify-center py-20 text-sm text-muted-foreground animate-pulse">
        Loading profile configuration...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow w-full">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 space-y-3">
          <div className="bg-card border border-border rounded-2xl p-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary overflow-hidden border-2 border-primary/20 shrink-0">
                {profilePhoto ? (
                  <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-xl">{user?.email?.[0].toUpperCase()}</span>
                )}
              </div>
              <div className="truncate text-xs">
                <span className="font-semibold block truncate text-foreground text-sm">{formWatch.fullName || 'User'}</span>
                <span className="text-[10px] text-muted-foreground truncate block">{user?.email}</span>
                <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary font-bold text-[9px] rounded-full uppercase tracking-wider">{role}</span>
              </div>
            </div>
            
            <button 
              onClick={() => {
                supabase.auth.signOut();
                router.push('/');
              }}
              className="w-full text-center py-2 text-xs font-bold bg-secondary/50 hover:bg-secondary rounded-xl transition-colors"
            >
              Sign Out
            </button>
          </div>

          <div className="bg-card border border-border rounded-2xl p-2.5 space-y-1">
            <button
              onClick={() => setProfileTab('dashboard')}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl text-left cursor-pointer transition-colors ${
                profileTab === 'dashboard' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-primary hover:bg-secondary/40'
              }`}
            >
              <User className="w-4 h-4" />
              Dashboard
            </button>

            <button
              onClick={() => setProfileTab('profile')}
              className={`w-full flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl text-left cursor-pointer transition-colors ${
                profileTab === 'profile' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-primary hover:bg-secondary/40'
              }`}
            >
              <Settings className="w-4 h-4" />
              Account Settings
            </button>

            <button
              onClick={() => setProfileTab('complaints')}
              className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm font-semibold rounded-xl text-left cursor-pointer transition-colors ${
                profileTab === 'complaints' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-primary hover:bg-secondary/40'
              }`}
            >
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                My Appeals
              </span>
              {myComplaints.length > 0 && (
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${profileTab === 'complaints' ? 'bg-white text-primary' : 'bg-primary text-white'}`}>
                  {myComplaints.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Content area */}
        <div className="lg:col-span-3">
          
          {/* Dashboard Tab */}
          {profileTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm">
                <h2 className="font-heading font-bold text-2xl sm:text-3xl text-foreground mb-2">
                  Welcome, {formWatch.fullName || 'Member'}!
                </h2>
                <p className="text-sm text-muted-foreground mb-8">
                  Here is a quick overview of your account and activities.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                  <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] uppercase font-bold text-primary tracking-wider mb-1">Account Role</span>
                    <span className="text-lg font-bold text-foreground capitalize">{role}</span>
                  </div>
                  <div className="bg-secondary/50 border border-border rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Total Appeals</span>
                    <span className="text-lg font-bold text-foreground">{myComplaints.length}</span>
                  </div>
                  <div className="bg-secondary/50 border border-border rounded-2xl p-4 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider mb-1">Profile Status</span>
                    <span className="text-lg font-bold text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Active
                    </span>
                  </div>
                </div>

                <div className="bg-background border border-border rounded-2xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg">Your Information</h3>
                    <button 
                      onClick={() => setProfileTab('profile')}
                      className="px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 font-bold text-xs rounded-xl transition-colors"
                    >
                      Edit Profile
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm">
                    <div>
                      <span className="text-muted-foreground text-xs block mb-0.5">Email</span>
                      <span className="font-medium text-foreground">{user?.email || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs block mb-0.5">Phone</span>
                      <span className="font-medium text-foreground">{formWatch.mobile || 'Not provided'}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs block mb-0.5">Location</span>
                      <span className="font-medium text-foreground">
                        {formWatch.district ? `${formWatch.district}, ${formWatch.state}` : 'Not provided'}
                      </span>
                    </div>
                    <div>
                      <span className="text-muted-foreground text-xs block mb-0.5">Profession</span>
                      <span className="font-medium text-foreground">{formWatch.profession || 'Not provided'}</span>
                    </div>
                  </div>
                  
                  {formWatch.bio && (
                    <div className="mt-4 pt-4 border-t border-border">
                      <span className="text-muted-foreground text-xs block mb-1">Bio</span>
                      <p className="text-sm text-foreground italic">{formWatch.bio}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Profile Form Tab */}
          {profileTab === 'profile' && (
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div>
                <h2 className="font-heading font-bold text-xl sm:text-2xl text-foreground">Account Settings</h2>
                <p className="text-xs text-muted-foreground">Manage your profile information, profile photo, and account settings below.</p>
              </div>

              <div className="flex items-center gap-6 pb-6 border-b border-border">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary overflow-hidden border-4 border-background shadow-lg shrink-0">
                  {profilePhoto ? (
                    <img src={profilePhoto} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-4xl">{user?.email?.[0].toUpperCase()}</span>
                  )}
                </div>
                <div className="flex-grow">
                  <h3 className="font-bold text-lg mb-1">{memberForm.getValues('fullName') || 'Your Profile Photo'}</h3>
                  <p className="text-xs text-muted-foreground mb-3">Provide a valid image URL to update your profile photo.</p>
                  <input
                    type="url"
                    {...memberForm.register('profilePhoto')}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full max-w-sm bg-background border border-input rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary text-xs"
                    onChange={(e) => setProfilePhoto(e.target.value)}
                  />
                </div>
              </div>

              {memberSuccess && (
                <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 text-emerald-600 dark:text-emerald-300 text-xs p-3.5 rounded-xl flex items-center gap-2 font-medium">
                  <CheckCircle className="w-4 h-4 shrink-0" />
                  Member directory profile updated successfully!
                </div>
              )}

              <form onSubmit={memberForm.handleSubmit(onMemberSubmit)} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block font-bold">Full Name *</label>
                    <input
                      type="text"
                      {...memberForm.register('fullName')}
                      className="w-full bg-background border border-input rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    />
                    {memberForm.formState.errors.fullName && (
                      <span className="text-[10px] text-destructive block">{memberForm.formState.errors.fullName.message}</span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-bold">Father/Husband's Name *</label>
                    <input
                      type="text"
                      {...memberForm.register('fatherName')}
                      className="w-full bg-background border border-input rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    />
                    {memberForm.formState.errors.fatherName && (
                      <span className="text-[10px] text-destructive block">{memberForm.formState.errors.fatherName.message}</span>
                    )}
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="block font-bold">Mother's Name (Optional)</label>
                    <input
                      type="text"
                      {...memberForm.register('motherName')}
                      className="w-full bg-background border border-input rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-bold">Date of Birth *</label>
                    <input
                      type="date"
                      {...memberForm.register('dob')}
                      className="w-full bg-background border border-input rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary text-foreground cursor-pointer"
                    />
                    {memberForm.formState.errors.dob && (
                      <span className="text-[10px] text-destructive block">{memberForm.formState.errors.dob.message}</span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-bold">Gender *</label>
                    <select
                      {...memberForm.register('gender')}
                      className="w-full bg-background border border-input rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary text-foreground cursor-pointer"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-bold">Marital Status *</label>
                    <select
                      {...memberForm.register('maritalStatus')}
                      className="w-full bg-background border border-input rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary text-foreground cursor-pointer"
                    >
                      <option value="" disabled>Select Status</option>
                      <option value="Single">Single</option>
                      <option value="Married">Married</option>
                      <option value="Divorced">Divorced</option>
                      <option value="Widowed">Widowed</option>
                    </select>
                    {memberForm.formState.errors.maritalStatus && (
                      <span className="text-[10px] text-destructive block">{memberForm.formState.errors.maritalStatus.message}</span>
                    )}
                  </div>
                  
                  <div className="space-y-1.5">
                    <label className="block font-bold">Mobile Number *</label>
                    <input
                      type="text"
                      {...memberForm.register('mobile')}
                      className="w-full bg-background border border-input rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    />
                    {memberForm.formState.errors.mobile && (
                      <span className="text-[10px] text-destructive block">{memberForm.formState.errors.mobile.message}</span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-bold">Occupation / Profession *</label>
                    <input
                      type="text"
                      {...memberForm.register('profession')}
                      className="w-full bg-background border border-input rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    />
                    {memberForm.formState.errors.profession && (
                      <span className="text-[10px] text-destructive block">{memberForm.formState.errors.profession.message}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-border pt-4 mt-2">
                  <div className="space-y-1.5 col-span-1 sm:col-span-3">
                    <label className="block font-bold">Complete Address *</label>
                    <input
                      type="text"
                      {...memberForm.register('address')}
                      className="w-full bg-background border border-input rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                      placeholder="Street, Area, Pincode"
                    />
                    {memberForm.formState.errors.address && (
                      <span className="text-[10px] text-destructive block">{memberForm.formState.errors.address.message}</span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-bold">District *</label>
                    <input
                      type="text"
                      {...memberForm.register('district')}
                      className="w-full bg-background border border-input rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    />
                    {memberForm.formState.errors.district && (
                      <span className="text-[10px] text-destructive block">{memberForm.formState.errors.district.message}</span>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="block font-bold">State *</label>
                    <select
                      {...memberForm.register('state')}
                      className="w-full bg-background border border-input rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary text-foreground cursor-pointer"
                    >
                      <option value="" disabled>Select State</option>
                      {INDIAN_STATES.map((state) => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                    {memberForm.formState.errors.state && (
                      <span className="text-[10px] text-destructive block">{memberForm.formState.errors.state.message}</span>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5 pt-2">
                  <label className="block font-bold">Short Bio (Optional)</label>
                  <textarea
                    {...memberForm.register('bio')}
                    rows={3}
                    className="w-full bg-background border border-input rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  />
                  {memberForm.formState.errors.bio && (
                    <span className="text-[10px] text-destructive block">{memberForm.formState.errors.bio.message}</span>
                  )}
                </div>

                <div className="pt-4 border-t border-border flex justify-between items-center">
                  <button
                    type="button"
                    onClick={handleDeleteAccount}
                    disabled={deleteLoading}
                    className="px-4 py-2 rounded-xl text-destructive font-bold hover:bg-destructive/10 transition-colors flex items-center gap-1.5 disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    {deleteLoading ? 'Deleting...' : 'Delete Account'}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/95 shadow transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          )}
          
          {profileTab === 'complaints' && (
            <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-heading font-bold text-xl sm:text-2xl text-foreground">My Submitted Appeals</h2>
                  <p className="text-xs text-muted-foreground">Track status and resolutions of your filed complaints & needs.</p>
                </div>
                
                <Link
                  href="/complaints"
                  className="px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl font-bold transition-all text-xs cursor-pointer shadow-sm inline-flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> File New Appeal
                </Link>
              </div>

              {complaintsLoading ? (
                <div className="space-y-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="bg-secondary/40 border border-border rounded-2xl p-5 h-28 animate-pulse"></div>
                  ))}
                </div>
              ) : myComplaints.length === 0 ? (
                <div className="text-center py-12 text-xs text-muted-foreground space-y-3">
                  <AlertTriangle className="w-10 h-10 text-muted-foreground mx-auto opacity-30" />
                  <p>You have not submitted any complaints or community needs yet.</p>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  {myComplaints.map((c) => (
                    <div
                      key={c.id}
                      className="border border-border rounded-2xl p-5 bg-secondary/20 flex flex-col justify-between space-y-4 hover:border-primary/30 transition-colors"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {c.type === 'complaint' ? (
                            <span className="px-2 py-0.5 bg-rose-500/10 text-rose-600 dark:text-rose-400 font-bold rounded uppercase text-[9px]">
                              Complaint
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold rounded uppercase text-[9px]">
                              Need
                            </span>
                          )}
                          
                          {c.status === 'pending' && (
                            <span className="px-2 py-0.5 bg-stone-500/10 text-stone-600 dark:text-stone-400 font-bold rounded uppercase text-[9px] flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Pending Review
                            </span>
                          )}
                          {c.status === 'approved' && (
                            <span className="px-2 py-0.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold rounded uppercase text-[9px] flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Published
                            </span>
                          )}
                          {c.status === 'resolved' && (
                            <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold rounded uppercase text-[9px] flex items-center gap-1">
                              <CheckCircle className="w-3 h-3" /> Resolved
                            </span>
                          )}
                          {c.status === 'rejected' && (
                            <span className="px-2 py-0.5 bg-red-500/10 text-red-600 dark:text-red-400 font-bold rounded uppercase text-[9px] flex items-center gap-1">
                              <XCircle className="w-3 h-3" /> Rejected
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-primary" />
                          {new Date(c.created_at).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric'
                          })}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <h4 className="font-extrabold text-sm sm:text-base text-foreground">{c.title}</h4>
                        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">{c.description}</p>
                      </div>

                      {c.is_anonymous && (
                        <p className="text-[10px] text-amber-600 font-semibold italic">
                          * Submitted anonymously to the public listings.
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
