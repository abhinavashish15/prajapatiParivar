export type UserRole = 'super_admin' | 'admin' | 'member' | 'guest';
export type ProfileStatus = 'pending' | 'approved' | 'rejected';
export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';
export type NewsStatus = 'draft' | 'published';
export type AttendanceStatus = 'registered' | 'attended' | 'absent';
export type GalleryType = 'photo' | 'video';

export interface UserRoleRecord {
  id: string;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface MemberProfile {
  id: string;
  full_name: string;
  father_husband_name?: string | null;
  mother_name?: string | null;
  profile_photo: string | null;
  gender: 'male' | 'female' | 'other' | null;
  dob: string | null;
  mobile: string | null;
  email: string;
  address?: string | null;
  state: string | null;
  district: string | null;
  city: string | null;
  profession: string | null;
  marital_status?: string | null;
  education: string | null;
  bio: string | null;
  status: ProfileStatus;
  created_at: string;
  updated_at: string;
}



export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image_url: string | null;
  capacity: number | null;
  status: EventStatus;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  registrations_count?: number;
}

export interface EventRegistration {
  id: string;
  event_id: string;
  user_id: string;
  registration_date: string;
  attendance_status: AttendanceStatus;
  ticket_count: number;
  details: any;
  event?: Event;
  user_profile?: MemberProfile;
}

export interface News {
  id: string;
  title: string;
  content: string;
  category: string;
  image_url: string | null;
  is_featured: boolean;
  status: NewsStatus;
  author_id: string | null;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  description: string | null;
  cover_image: string | null;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  album_id: string;
  type: GalleryType;
  url: string;
  caption: string | null;
  created_at: string;
}

export interface Testimonial {
  id: string;
  user_id: string | null;
  name: string;
  content: string;
  rating: number;
  status: ProfileStatus;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  mobile: string | null;
  subject: string | null;
  message: string;
  created_at: string;
}

export type ComplaintStatus = 'pending' | 'approved' | 'rejected' | 'resolved';

export interface Complaint {
  id: string;
  user_id: string | null;
  title: string;
  description: string;
  type: 'complaint' | 'need';
  status: ComplaintStatus;
  is_anonymous: boolean;
  contact_name: string | null;
  contact_mobile: string | null;
  attachment_url: string | null;
  verified_by: string | null;
  verified_at: string | null;
  resolved_at: string | null;
  created_at: string;
  updated_at: string;
}