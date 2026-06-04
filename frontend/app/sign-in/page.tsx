'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
      const response = await fetch(`${apiUrl}/auth/signin`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Login failed via server.');
      }

      // Set the session if returned so user is logged in natively
      if (result.data?.session) {
        await supabase.auth.setSession({
          access_token: result.data.session.access_token,
          refresh_token: result.data.session.refresh_token
        });
      }

      router.push('/');
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-6 bg-background">
      <div className="w-full max-w-md space-y-8 bg-card border border-border p-8 rounded-3xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold font-heading text-foreground">Welcome Back</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-border rounded-xl bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              placeholder="Enter your password"
            />
          </div>

          {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 mt-4 rounded-full bg-primary text-primary-foreground font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/sign-up" className="text-primary font-semibold hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
