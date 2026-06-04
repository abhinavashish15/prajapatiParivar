'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, Briefcase, GraduationCap, UserCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { MemberProfile } from '@/types';


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

export default function DirectoryPage() {
  const [members, setMembers] = useState<MemberProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');

  useEffect(() => {
    async function loadMembers() {
      setLoading(true);
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        const response = await fetch(`${apiUrl}/members?limit=1000`);
        const result = await response.json();
        
        if (response.ok && result.success && result.data?.members) {
          setMembers(result.data.members as MemberProfile[]);
        } else {
          setMembers([]);
        }
      } catch (err) {
        console.error('Failed to load members:', err);
      } finally {
        setLoading(false);
      }
    }
    loadMembers();
  }, []);

  // Filter members based on search and filters
  const filteredMembers = members.filter((member) => {
    const searchLower = (searchQuery || '').toLowerCase();
    const matchesSearch =
      (member.full_name || '').toLowerCase().includes(searchLower) ||
      (member.profession || '').toLowerCase().includes(searchLower) ||
      (member.bio || '').toLowerCase().includes(searchLower);
    const matchesState = selectedState === '' || (member.state || '').toLowerCase() === selectedState.toLowerCase();
    const matchesDistrict = selectedDistrict === '' || (member.district || '').toLowerCase() === selectedDistrict.toLowerCase();

    return matchesSearch && matchesState && matchesDistrict;
  });

  // Extract unique districts present in database for the selected state
  // Convert to Title Case to prevent duplicates like 'darbhanga' and 'Darbhanga'
  const uniqueDistrictsRaw = members
    .filter((m) => selectedState === '' || (m.state || '').toLowerCase() === selectedState.toLowerCase())
    .map((m) => m.district)
    .filter(Boolean) as string[];
    
  const uniqueDistricts = Array.from(
    new Set(
      uniqueDistrictsRaw.map(d => 
        d.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      )
    )
  );

  return (
    <div className="flex flex-col w-full pb-20 clay-pattern">
      {/* Page Header */}
      <section className="bg-gradient-to-r from-orange-600 to-amber-700 text-white py-12 px-4 text-center">
        <div className="max-w-4xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-5xl font-extrabold font-heading">
            Community Member Directory
          </h1>
          <p className="text-sm text-orange-100 max-w-lg mx-auto">
            Discover, network, and grow together with verified Prajapati Samaj members across India.
          </p>
        </div>
      </section>

      {/* Filter and Search Interface */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 w-full relative z-10">
        <div className="bg-card border border-border rounded-2xl p-5 shadow-lg grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Box */}
          <div className="relative md:col-span-2">
            <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search by Name, Profession, or Bio..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-background border border-input rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>

          {/* State Dropdown */}
          <div>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedDistrict(''); // Reset district filter
              }}
              className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground cursor-pointer"
            >
              <option value="">All States</option>
              {INDIAN_STATES.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          {/* District Dropdown */}
          <div>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-background border border-input rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground cursor-pointer"
              disabled={selectedState === '' && uniqueDistricts.length === 0}
            >
              <option value="">All Districts</option>
              {uniqueDistricts.map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Members Grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-2xl p-6 space-y-4 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-secondary"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-secondary rounded w-3/4"></div>
                    <div className="h-3 bg-secondary rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2 pt-2">
                  <div className="h-3 bg-secondary rounded"></div>
                  <div className="h-3 bg-secondary rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredMembers.length === 0 ? (
          <div className="text-center py-16 bg-card border border-border rounded-3xl space-y-3">
            <div className="text-4xl text-muted-foreground">🔍</div>
            <h3 className="font-heading font-bold text-lg text-foreground">No Members Found</h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              We couldn't find any members matching your criteria in the database.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="bg-card border border-border rounded-2xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group"
              >
                {/* Status Tag */}
                {member.role === 'super_admin' || member.role === 'admin' ? (
                  <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full uppercase tracking-wider">
                    <UserCheck className="w-3.5 h-3.5" />
                    {member.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                  </div>
                ) : (
                  <>
                    {member.status === 'approved' && (
                      <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded-full">
                        <UserCheck className="w-3.5 h-3.5" />
                        Verified
                      </div>
                    )}
                    {member.status === 'pending' && (
                      <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/30 px-2 py-0.5 rounded-full">
                        Pending
                      </div>
                    )}
                    {member.status === 'rejected' && (
                      <div className="absolute top-4 right-4 flex items-center gap-1 text-[10px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/30 px-2 py-0.5 rounded-full">
                        Rejected
                      </div>
                    )}
                  </>
                )}

                <div className="space-y-4">
                  {/* Photo & Basic Details */}
                  <div className="flex items-center gap-4">
                    <img
                      src={member.profile_photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300'}
                      alt={member.full_name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-primary/20 bg-stone-100 shrink-0"
                    />
                    <div className="space-y-0.5">
                      <h3 className="font-heading font-bold text-base text-foreground group-hover:text-primary transition-colors">
                        {member.full_name}
                      </h3>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                        {member.city ? `${member.city}, ` : ''}{member.district ? `${member.district}, ` : ''}{member.state}
                      </span>
                    </div>
                  </div>

                  {/* Employment & Education Grid */}
                  <div className="space-y-2 pt-2 border-t border-border/60">
                    {member.profession && (
                      <div className="flex items-start gap-2 text-xs">
                        <Briefcase className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">
                          <strong className="text-foreground">Profession:</strong> {member.profession}
                        </span>
                      </div>
                    )}
                    {member.education && (
                      <div className="flex items-start gap-2 text-xs">
                        <GraduationCap className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">
                          <strong className="text-foreground">Education:</strong> {member.education}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bio */}
                  {member.bio && (
                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 bg-secondary/30 p-2.5 rounded-xl border border-border/40">
                      "{member.bio}"
                    </p>
                  )}
                </div>

                {/* Contact Action */}
                <div className="pt-4 mt-4 border-t border-border/60 space-y-1.5 text-xs text-muted-foreground">
                  <div className="flex justify-between items-center gap-2 flex-wrap">
                    <span>Email:</span>
                    <span className="font-medium text-foreground break-all">{member.email}</span>
                  </div>
                  
                  {member.mobile && (
                    <div className="flex justify-between items-center gap-2 flex-wrap">
                      <span>Mobile:</span>
                      <span className="font-medium text-foreground">{member.mobile}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
