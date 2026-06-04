-- PrajapatiParivar.in Database Seed Data
-- Populate tables with sample data for development and demonstration

-------------------------------------------------------------------------------
-- 1. SEED GALLERY ALBUMS & ITEMS
-------------------------------------------------------------------------------
insert into public.gallery_albums (id, title, description, cover_image) values
('a1111111-1111-1111-1111-111111111111', 'Pottery Heritage & Craftsmanship', 'Showcasing the traditional pottery, clay structures, and ancient terracotta craft of the Prajapati community.', 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800'),
('a2222222-2222-2222-2222-222222222222', 'Community Milan 2025', 'Highlights from our annual community gathering in Jaipur, celebrating achievements and cultural performances.', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800'),
('a3333333-3333-3333-3333-333333333333', 'Youth Skill Development Seminar', 'Empowering the next generation with technology, entrepreneurship, and career counseling workshops.', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800');

insert into public.gallery (id, album_id, type, url, caption) values
(gen_random_uuid(), 'a1111111-1111-1111-1111-111111111111', 'photo', 'https://images.unsplash.com/photo-1565192647048-f997ded87958?q=80&w=800', 'Traditional pottery wheel crafting clay pots'),
(gen_random_uuid(), 'a1111111-1111-1111-1111-111111111111', 'photo', 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=800', 'Terracotta lamps dried in the sun'),
(gen_random_uuid(), 'a1111111-1111-1111-1111-111111111111', 'photo', 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800', 'Intricate clay design patterns'),
(gen_random_uuid(), 'a2222222-2222-2222-2222-222222222222', 'photo', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800', 'Inauguration lamp lighting ceremony by elders'),
(gen_random_uuid(), 'a2222222-2222-2222-2222-222222222222', 'photo', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800', 'Cultural fold dance performance by youth'),
(gen_random_uuid(), 'a3333333-3333-3333-3333-333333333333', 'photo', 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=800', 'Keynote address during the Career Seminar'),
(gen_random_uuid(), 'a3333333-3333-3333-3333-333333333333', 'photo', 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=800', 'Interactive Q&A and coding sandbox session');

-------------------------------------------------------------------------------
-- 2. SEED NEWS & ANNOUNCEMENTS
-------------------------------------------------------------------------------
insert into public.news (id, title, content, category, image_url, is_featured, status, published_at) values
(gen_random_uuid(), 'National Clay Artist Exhibition Announced for August 2026', 'We are proud to announce the national-level exhibition to showcase the heritage of clay craftsmanship. Outstanding artists from the community will showcase terracotta models, designer pots, and modern eco-friendly ceramics in Delhi. Registration is open for participants now.', 'Announcements', 'https://images.unsplash.com/photo-1565192647048-f997ded87958?q=80&w=800', true, 'published', now() - interval '2 days'),
(gen_random_uuid(), 'Prajapati Samaj Honors High School Merit Scholars', 'During last week''s regional meeting, over 45 students from the Prajapati community who scored above 95% in their board examinations were felicitated with medals and laptops. The education trust also announced sponsorships for higher studies.', 'News', 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?q=80&w=800', false, 'published', now() - interval '5 days'),
(gen_random_uuid(), 'Annual Directory Verification Drive Commenced', 'We request all members to update their state, city, and professional profiles in the member directory to maintain a verified community database.', 'Updates', 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca?q=80&w=800', false, 'published', now() - interval '1 day'),
(gen_random_uuid(), 'Notice: Annual General Meeting Scheduled for December', 'The annual general meeting of Prajapati Kalyan Samiti will be held on December 20, 2026, at Jaipur. The meeting agenda includes annual budgeting, trust updates, election of district coordinators, and future development projects.', 'Notices', null, false, 'published', now() - interval '10 days');

-------------------------------------------------------------------------------
-- 3. SEED EVENTS
-------------------------------------------------------------------------------
insert into public.events (id, title, description, date, location, image_url, capacity, status) values
('e1111111-1111-1111-1111-111111111111', 'Annual General Meeting 2026', 'The annual general meeting of Prajapati Kalyan Samiti will be held at Mansarovar, Jaipur. The meeting agenda includes annual budgeting, trust updates, election of district coordinators, and future development projects.', now() + interval '15 days', 'Community Hall, Sector 5, Mansarovar, Jaipur, Rajasthan', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800', 300, 'published'),
('e2222222-2222-2222-2222-222222222222', 'Clay Pottery Modernization Workshop', 'Learn advanced kiln baking technologies, mechanical wheel operations, and online marketing channels to grow your pottery and home decor business.', now() + interval '30 days', 'Craft Development Center, Morbi, Gujarat', 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=800', 100, 'published'),
('e3333333-3333-3333-3333-333333333333', 'National Youth Career Guidance Seminar', 'Expert panels covering UPSC preparations, Software Engineering pathways, and start-up funding. Open for college students and recent graduates.', now() - interval '15 days', 'Vigyan Bhawan, New Delhi', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800', 500, 'completed');

-------------------------------------------------------------------------------
-- 4. SEED TESTIMONIALS
-------------------------------------------------------------------------------
insert into public.testimonials (id, name, content, rating, status) values
(gen_random_uuid(), 'Rajesh Prajapati', 'PrajapatiParivar.in has connected our family back to our roots. The directory is incredibly useful for finding community members across states.', 5, 'approved'),
(gen_random_uuid(), 'Sunita Prajapati', 'Updating our family details in the member directory was so easy. The support team answered all our questions instantly.', 5, 'approved'),
(gen_random_uuid(), 'Mahendra Kumar', 'The pottery workshop organized by the community helped me expand my export business. Grateful for this active platform!', 4, 'approved');

-------------------------------------------------------------------------------
-- 5. SEED MOCK AUTH USERS & PROFILES
-- We insert into auth.users first, then let the trigger auto-insert into public.user_roles and member_profiles
-- We will simulate inserting into auth.users (Note: triggers might run, so we handle conflict)
-------------------------------------------------------------------------------

-- First, let's register some UUIDs in auth.users
-- Note: In target environments, these UUIDs are managed by Supabase Auth,
-- but seeding them here allows us to link member_profiles and matrimony_profiles.
insert into auth.users (id, email, raw_user_meta_data, aud, role) values
('u1111111-1111-1111-1111-111111111111', 'sanjay@prajapatiparivar.in', '{"full_name": "Sanjay Prajapati"}'::jsonb, 'authenticated', 'authenticated'),
('u2222222-2222-2222-2222-222222222222', 'amit.potter@gmail.com', '{"full_name": "Amit Prajapati"}'::jsonb, 'authenticated', 'authenticated'),
('u3333333-3333-3333-3333-333333333333', 'priya.prajapati@gmail.com', '{"full_name": "Priya Prajapati"}'::jsonb, 'authenticated', 'authenticated'),
('u4444444-4444-4444-4444-444444444444', 'anil.delhi@yahoo.com', '{"full_name": "Anil Kumar Prajapati"}'::jsonb, 'authenticated', 'authenticated')
on conflict (id) do nothing;

-- The trigger `on_auth_user_created` will automatically have created:
-- 1. Sanjay as super_admin (first user in DB)
-- 2. Amit, Priya, and Anil as guest / pending members.
-- Let's manually promote some of them and approve their member profiles for testing directory.

update public.user_roles set role = 'admin'::user_role where id = 'u2222222-2222-2222-2222-222222222222';
update public.user_roles set role = 'member'::user_role where id = 'u3333333-3333-3333-3333-333333333333';
update public.user_roles set role = 'member'::user_role where id = 'u4444444-4444-4444-4444-444444444444';

-- Update their member profiles with address, bio, and approved status
update public.member_profiles set
    gender = 'male',
    dob = '1985-05-15',
    mobile = '+919876543210',
    state = 'Rajasthan',
    district = 'Jaipur',
    city = 'Jaipur',
    profession = 'Social Worker & Business Owner',
    education = 'MBA, Rajasthan University',
    bio = 'Dedicated to the upliftment of the Prajapati community. Active organizer of educational drives.',
    status = 'approved'::profile_status
where id = 'u1111111-1111-1111-1111-111111111111';

update public.member_profiles set
    gender = 'male',
    dob = '1992-09-20',
    mobile = '+919822334455',
    state = 'Gujarat',
    district = 'Morbi',
    city = 'Morbi',
    profession = 'Ceramics Business Owner',
    education = 'B.Tech Ceramic Engineering',
    bio = 'Managing an eco-friendly terracotta design house. Enthusiastic about blending craft with modern engineering.',
    status = 'approved'::profile_status
where id = 'u2222222-2222-2222-2222-222222222222';

update public.member_profiles set
    gender = 'female',
    dob = '1995-12-05',
    mobile = '+917788990011',
    state = 'Delhi',
    district = 'New Delhi',
    city = 'Rohini',
    profession = 'Software Engineer',
    education = 'B.Tech in Computer Science, DTU',
    bio = 'Tech enthusiast, coder, and advocate for community education resources.',
    status = 'approved'::profile_status
where id = 'u3333333-3333-3333-3333-333333333333';

update public.member_profiles set
    gender = 'male',
    dob = '1990-03-25',
    mobile = '+919988776655',
    state = 'Uttar Pradesh',
    district = 'Lucknow',
    city = 'Lucknow',
    profession = 'Government Officer',
    education = 'MA Public Administration',
    bio = 'Serving the public sector. Keen on providing career guidance to Prajapati youth.',
    status = 'approved'::profile_status
where id = 'u4444444-4444-4444-4444-444444444444';


-------------------------------------------------------------------------------
-- 6. SEED COMPLAINTS & NEEDS
-------------------------------------------------------------------------------
insert into public.complaints (id, user_id, title, description, type, status, is_anonymous, contact_name, contact_mobile, verified_by, verified_at) values
('c1111111-1111-1111-1111-111111111111', 'u3333333-3333-3333-3333-333333333333', 'Need Financial Support for Higher Education', 'I am pursuing my final year in B.Tech Computer Science and need support of Rs. 25,000 to clear the final semester tuition fees. My family income is affected by recession. Any help or loan from community scholarship fund would be highly appreciated.', 'need', 'approved', false, 'Priya Prajapati', '+917788990011', 'u2222222-2222-2222-2222-222222222222', now() - interval '1 day'),
('c2222222-2222-2222-2222-222222222222', 'u4444444-4444-4444-4444-444444444444', 'Encroachment of Pottery Artisans Land in District Outskirts', 'Local builders are illegally encroaching on the traditional clay-fetching and baking fields used by 20+ Prajapati families for generations. We have submitted a petition to the local administration, but need legal assistance and community support to escalate this to the district magistrate.', 'complaint', 'approved', false, 'Anil Kumar Prajapati', '+919988776655', 'u2222222-2222-2222-2222-222222222222', now() - interval '2 days'),
('c3333333-3333-3333-3333-333333333333', 'u1111111-1111-1111-1111-111111111111', 'Medical Emergency Assistance Needed', 'An elderly community member in Jaipur is hospitalized with severe heart complications and requires immediate bypass surgery. Total cost is estimated around 3 Lakhs. Family has raised 1.5 Lakhs. Requesting community contributions.', 'need', 'approved', true, 'Anonymous Member', '+919876543210', 'u2222222-2222-2222-2222-222222222222', now()),
('c4444444-4444-4444-4444-444444444444', 'u3333333-3333-3333-3333-333333333333', 'Fake Profile reporting in Directory', 'A duplicate profile using a fake name and photo has been created in our city directory. The profile is spamming members for money. Please investigate and delete this record.', 'complaint', 'pending', false, 'Priya Prajapati', '+917788990011', null, null);




