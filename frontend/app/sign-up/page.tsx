'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

export default function SignUpPage() {
  const [formData, setFormData] = useState({
    name: '',
    fatherName: '',
    dob: '',
    motherName: '',
    phone: '',
    email: '',
    password: '',
    occupation: '',
    maritalStatus: '',
    gender: '',
    address: '',
    district: '',
    state: '',
    pincode: '',
  });
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      // 1. Call Backend API for Registration
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
      const response = await fetch(`${apiUrl}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          profileData: formData
        })
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Registration failed via server.');
      }

      // Set the session if returned so user is logged in
      if (result.data?.session) {
        await supabase.auth.setSession({
          access_token: result.data.session.access_token,
          refresh_token: result.data.session.refresh_token
        });
      }

      const userId = result.data?.user?.id;

      // 2. Upload Image (Now authenticated)
      if (imageFile && userId) {
        try {
          const fileExt = imageFile.name.split('.').pop();
          const fileName = `${userId}-${Math.random()}.${fileExt}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('profiles')
            .upload(fileName, imageFile);
            
          if (!uploadError && uploadData) {
            const { data: publicUrlData } = supabase.storage.from('profiles').getPublicUrl(fileName);
            // Update the profile with the photo URL via our backend
            await fetch(`${apiUrl}/members/profile/me`, {
              method: 'PUT',
              headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${result.data?.session?.access_token || ''}`
              },
              body: JSON.stringify({ profile_photo: publicUrlData.publicUrl })
            });
          }
        } catch (uploadEx) {
          console.error("Image upload skipped or failed:", uploadEx);
        }
      }

      setSuccessMsg('Registration successful! Please check your email to verify your account.');
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-6 bg-background py-12">
      <div className="w-full max-w-4xl space-y-8 bg-card border border-border p-8 rounded-3xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold font-heading text-foreground">Join PrajapatiParivar</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Please fill out all the details below to create your account
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Column 1 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name *</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required
                  className="w-full px-4 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter your full name" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Father's / Husband's Name *</label>
                <input type="text" name="fatherName" value={formData.fatherName} onChange={handleChange} required
                  className="w-full px-4 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter father/husband's name" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Mother's Name (Optional)</label>
                <input type="text" name="motherName" value={formData.motherName} onChange={handleChange}
                  className="w-full px-4 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter mother's name" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date of Birth *</label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} required
                  className="w-full px-4 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Gender *</label>
                <select name="gender" value={formData.gender} onChange={handleChange} required
                  className="w-full px-4 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="" disabled>Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phone Number *</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required
                  className="w-full px-4 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter phone number" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Occupation *</label>
                <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} required
                  className="w-full px-4 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder="E.g. Student, Business, Job" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Marital Status *</label>
                <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange} required
                  className="w-full px-4 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
                  <option value="" disabled>Select Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                  <option value="Divorced">Divorced</option>
                  <option value="Widowed">Widowed</option>
                </select>
              </div>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Email Address *</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required
                  className="w-full px-4 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Enter your email" />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Password *</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} required
                  className="w-full px-4 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Create a password" />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Profile Image *</label>
                <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)} required
                  className="w-full px-4 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" />
              </div>

              <div className="pt-2">
                <h3 className="font-semibold text-md mb-2 border-b border-border pb-1">Address Details</h3>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Street Address *</label>
                <input type="text" name="address" value={formData.address} onChange={handleChange} required
                  className="w-full px-4 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder="House no, Street area" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">District *</label>
                  <input type="text" name="district" value={formData.district} onChange={handleChange} required
                    className="w-full px-4 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder="District" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">State *</label>
                  <select name="state" value={formData.state} onChange={handleChange} required
                    className="w-full px-4 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer">
                    <option value="" disabled>Select State</option>
                    {INDIAN_STATES.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Pincode *</label>
                <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} required
                  className="w-full px-4 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary" placeholder="Postal / Pincode" />
              </div>
            </div>

          </div>

          {error && <p className="text-red-500 text-sm font-medium text-center bg-red-500/10 py-3 rounded-xl">{error}</p>}
          {successMsg && <p className="text-green-600 text-sm font-medium text-center bg-green-500/10 py-3 rounded-xl">{successMsg}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 mt-6 rounded-full bg-primary text-primary-foreground font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50 shadow-md"
          >
            {loading ? 'Processing...' : 'Complete Registration'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/sign-in" className="text-primary font-bold hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
