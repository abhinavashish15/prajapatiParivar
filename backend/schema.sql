-- PrajapatiParivar.in Database Schema
-- Compatible with Supabase PostgreSQL

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create custom types / enums
create type user_role as enum ('super_admin', 'admin', 'member', 'guest');
create type profile_status as enum ('pending', 'approved', 'rejected');
create type event_status as enum ('draft', 'published', 'cancelled', 'completed');
create type news_status as enum ('draft', 'published');
create type attendance_status as enum ('registered', 'attended', 'absent');
create type gallery_type as enum ('photo', 'video');
create type complaint_status as enum ('pending', 'approved', 'rejected', 'resolved');

-------------------------------------------------------------------------------
-- 1. USER ROLES TABLE
-------------------------------------------------------------------------------
create table public.user_roles (
    id uuid references auth.users on delete cascade primary key,
    role user_role default 'guest'::user_role not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-------------------------------------------------------------------------------
-- 2. MEMBER PROFILES TABLE
-------------------------------------------------------------------------------
create table public.member_profiles (
    id uuid references auth.users on delete cascade primary key,
    full_name text not null,
    father_husband_name text,
    mother_name text,
    profile_photo text,
    gender text check (gender in ('male', 'female', 'other')),
    dob date,
    mobile text,
    email text not null,
    address text,
    state text,
    district text,
    city text,
    profession text,
    marital_status text,
    education text,
    bio text,
    status profile_status default 'pending'::profile_status not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);



-------------------------------------------------------------------------------
-- 5. EVENTS TABLE
-------------------------------------------------------------------------------
create table public.events (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    description text not null,
    date timestamp with time zone not null,
    location text not null,
    image_url text,
    capacity integer,
    status event_status default 'draft'::event_status not null,
    created_by uuid references auth.users on delete set null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-------------------------------------------------------------------------------
-- 6. EVENT REGISTRATIONS TABLE
-------------------------------------------------------------------------------
create table public.event_registrations (
    id uuid default gen_random_uuid() primary key,
    event_id uuid references public.events on delete cascade not null,
    user_id uuid references auth.users on delete cascade not null,
    registration_date timestamp with time zone default timezone('utc'::text, now()) not null,
    attendance_status attendance_status default 'registered'::attendance_status not null,
    ticket_count integer default 1 not null,
    details jsonb default '{}'::jsonb not null,
    constraint unique_event_user unique (event_id, user_id)
);

-------------------------------------------------------------------------------
-- 7. NEWS TABLE
-------------------------------------------------------------------------------
create table public.news (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    content text not null,
    category text not null,
    image_url text,
    is_featured boolean default false not null,
    status news_status default 'draft'::news_status not null,
    author_id uuid references auth.users on delete set null,
    published_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-------------------------------------------------------------------------------
-- 8. GALLERY ALBUMS TABLE
-------------------------------------------------------------------------------
create table public.gallery_albums (
    id uuid default gen_random_uuid() primary key,
    title text not null,
    description text,
    cover_image text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-------------------------------------------------------------------------------
-- 9. GALLERY ITEMS TABLE
-------------------------------------------------------------------------------
create table public.gallery (
    id uuid default gen_random_uuid() primary key,
    album_id uuid references public.gallery_albums on delete cascade not null,
    type gallery_type default 'photo'::gallery_type not null,
    url text not null,
    caption text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-------------------------------------------------------------------------------
-- 10. TESTIMONIALS TABLE
-------------------------------------------------------------------------------
create table public.testimonials (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users on delete set null,
    name text not null,
    content text not null,
    rating integer check (rating >= 1 and rating <= 5) not null,
    status profile_status default 'pending'::profile_status not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-------------------------------------------------------------------------------
-- 11. GENERAL CONTACT MESSAGES TABLE (For Contact Form)
-------------------------------------------------------------------------------
create table public.contact_messages (
    id uuid default gen_random_uuid() primary key,
    name text not null,
    email text not null,
    mobile text,
    subject text,
    message text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-------------------------------------------------------------------------------
-- 12. COMPLAINTS & NEEDS TABLE
-------------------------------------------------------------------------------
create table public.complaints (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users on delete cascade,
    title text not null,
    description text not null,
    type text check (type in ('complaint', 'need')) not null,
    status complaint_status default 'pending'::complaint_status not null,
    is_anonymous boolean default false not null,
    contact_name text,
    contact_mobile text,
    attachment_url text,
    verified_by uuid references auth.users on delete set null,
    verified_at timestamp with time zone,
    resolved_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-------------------------------------------------------------------------------
-- INDEXES FOR PERFORMANCE
-------------------------------------------------------------------------------
create index idx_member_profiles_status on public.member_profiles (status);
create index idx_member_profiles_location on public.member_profiles (state, district, city);
create index idx_events_date on public.events (date);
create index idx_news_published on public.news (status, published_at desc);
create index idx_complaints_status on public.complaints (status);
create index idx_complaints_type on public.complaints (type);
create index idx_complaints_user on public.complaints (user_id);

-------------------------------------------------------------------------------
-- HELPER FUNCTIONS FOR SECURITY & ROLES
-------------------------------------------------------------------------------

-- Check if user is Admin or Super Admin
create or replace function public.is_admin(user_id uuid)
returns boolean security definer as $$
begin
    return exists (
        select 1 from public.user_roles
        where id = user_id and role in ('admin'::user_role, 'super_admin'::user_role)
    );
end;
$$ language plpgsql;

-- Check if user is Super Admin
create or replace function public.is_super_admin(user_id uuid)
returns boolean security definer as $$
begin
    return exists (
        select 1 from public.user_roles
        where id = user_id and role = 'super_admin'::user_role
    );
end;
$$ language plpgsql;

-- Check if user is Approved Member
create or replace function public.is_approved_member(user_id uuid)
returns boolean security definer as $$
begin
    return exists (
        select 1 from public.member_profiles
        where id = user_id and status = 'approved'::profile_status
    );
end;
$$ language plpgsql;

-------------------------------------------------------------------------------
-- AUTOMATED USER CREATION TRIGGER
-- Triggers when a new user signs up via Supabase Auth
-------------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger security definer as $$
declare
    is_first bool;
    assigned_role user_role;
begin
    -- The first user to sign up becomes the super_admin automatically
    select not exists (select 1 from public.user_roles) into is_first;
    
    if is_first then
        assigned_role := 'super_admin'::user_role;
    else
        assigned_role := 'guest'::user_role;
    end if;
 
    -- Insert into user_roles
    insert into public.user_roles (id, role)
    values (new.id, assigned_role);
 
    -- Note: We skip inserting into member_profiles here because our Express backend 
    -- controller explicitly handles creating and updating the profile!
 
    return new;
end;
$$ language plpgsql;

create or replace trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user();

-------------------------------------------------------------------------------
-- ROW LEVEL SECURITY (RLS) POLICIES
-------------------------------------------------------------------------------

-- Enable RLS on all tables
alter table public.user_roles enable row level security;
alter table public.member_profiles enable row level security;
alter table public.events enable row level security;
alter table public.event_registrations enable row level security;
alter table public.news enable row level security;
alter table public.gallery_albums enable row level security;
alter table public.gallery enable row level security;
alter table public.testimonials enable row level security;
alter table public.contact_messages enable row level security;
alter table public.complaints enable row level security;

-- 1. USER ROLES
create policy "Allow all authenticated users to read roles" on public.user_roles
    for select to authenticated using (true);

create policy "Allow super_admins to manage roles" on public.user_roles
    for all using (public.is_super_admin(auth.uid()));

-- 2. MEMBER PROFILES
create policy "Allow anyone to read approved member profiles" on public.member_profiles
    for select using (status = 'approved'::profile_status);

create policy "Allow users to view their own profile regardless of status" on public.member_profiles
    for select using (auth.uid() = id);

create policy "Allow users to update their own profile" on public.member_profiles
    for update using (auth.uid() = id);

create policy "Allow admins to manage all member profiles" on public.member_profiles
    for all using (public.is_admin(auth.uid()));



-- 5. EVENTS
create policy "Allow anyone to view published events" on public.events
    for select using (status = 'published'::event_status);

create policy "Allow admins/creators to view all events" on public.events
    for select using (public.is_admin(auth.uid()) or auth.uid() = created_by);

create policy "Allow admins to manage events" on public.events
    for all using (public.is_admin(auth.uid()));

-- 6. EVENT REGISTRATIONS
create policy "Allow users to see their own registrations" on public.event_registrations
    for select using (auth.uid() = user_id);

create policy "Allow admins to see all registrations" on public.event_registrations
    for select using (public.is_admin(auth.uid()));

create policy "Allow users to register for events" on public.event_registrations
    for insert to authenticated with check (auth.uid() = user_id);

create policy "Allow users to cancel registrations" on public.event_registrations
    for delete using (auth.uid() = user_id);

create policy "Allow admins to manage registrations" on public.event_registrations
    for all using (public.is_admin(auth.uid()));

-- 7. NEWS
create policy "Allow anyone to view published news" on public.news
    for select using (status = 'published'::news_status);

create policy "Allow admins to view all news" on public.news
    for select using (public.is_admin(auth.uid()));

create policy "Allow admins to manage news" on public.news
    for all using (public.is_admin(auth.uid()));

-- 8. GALLERY ALBUMS
create policy "Allow anyone to view gallery albums" on public.gallery_albums
    for select using (true);

create policy "Allow admins to manage gallery albums" on public.gallery_albums
    for all using (public.is_admin(auth.uid()));

-- 9. GALLERY ITEMS
create policy "Allow anyone to view gallery items" on public.gallery
    for select using (true);

create policy "Allow admins to manage gallery items" on public.gallery
    for all using (public.is_admin(auth.uid()));

-- 10. TESTIMONIALS
create policy "Allow anyone to view approved testimonials" on public.testimonials
    for select using (status = 'approved'::profile_status);

create policy "Allow authenticated users to submit testimonials" on public.testimonials
    for insert to authenticated with check (auth.uid() = user_id);

create policy "Allow admins to manage testimonials" on public.testimonials
    for all using (public.is_admin(auth.uid()));

-- 11. GENERAL CONTACT MESSAGES
create policy "Allow anyone to submit contact form messages" on public.contact_messages
    for insert with check (true);

create policy "Allow admins to manage contact messages" on public.contact_messages
    for all using (public.is_admin(auth.uid()));

-- 12. COMPLAINTS & NEEDS POLICIES
create policy "Allow anyone to read approved or resolved complaints" on public.complaints
    for select using (status in ('approved'::complaint_status, 'resolved'::complaint_status));

create policy "Allow authenticated users to insert complaints" on public.complaints
    for insert to authenticated with check (auth.uid() = user_id);

create policy "Allow users to view their own submitted complaints" on public.complaints
    for select using (auth.uid() = user_id);

create policy "Allow users to update/delete their own pending complaints" on public.complaints
    for update using (auth.uid() = user_id and status = 'pending'::complaint_status);

create policy "Allow admins to manage all complaints" on public.complaints
    for all using (public.is_admin(auth.uid()));
