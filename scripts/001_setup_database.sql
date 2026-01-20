-- Mist Giver Database Setup
-- Tables: profiles, user_roles, books, downloads, contact_messages

-- 1. Profiles table (references auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles RLS policies
CREATE POLICY "profiles_select_own" ON public.profiles 
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_insert_own" ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles 
  FOR UPDATE USING (auth.uid() = id);

-- 2. User Roles table
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- User roles RLS policies
CREATE POLICY "user_roles_select_own" ON public.user_roles 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "user_roles_insert_own" ON public.user_roles 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 3. Books table
CREATE TABLE IF NOT EXISTS public.books (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  category TEXT NOT NULL,
  description TEXT,
  book_url TEXT NOT NULL,
  cover_url TEXT,
  enabled BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

-- Books RLS policies - Everyone can view enabled books
CREATE POLICY "books_select_enabled" ON public.books 
  FOR SELECT USING (enabled = TRUE);

-- Admins can do everything with books (via security definer function)

-- 4. Downloads table
CREATE TABLE IF NOT EXISTS public.downloads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

-- Downloads RLS policies
CREATE POLICY "downloads_select_own" ON public.downloads 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "downloads_insert_own" ON public.downloads 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- 5. Contact Messages table
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Contact messages RLS - Anyone can insert
CREATE POLICY "contact_messages_insert" ON public.contact_messages 
  FOR INSERT WITH CHECK (TRUE);

-- 6. Function to check if user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  );
END;
$$;

-- 7. Admin policies for books (using security definer function)
CREATE POLICY "books_admin_select" ON public.books 
  FOR SELECT USING (public.is_admin());

CREATE POLICY "books_admin_insert" ON public.books 
  FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "books_admin_update" ON public.books 
  FOR UPDATE USING (public.is_admin());

CREATE POLICY "books_admin_delete" ON public.books 
  FOR DELETE USING (public.is_admin());

-- 8. Admin policies for viewing all profiles
CREATE POLICY "profiles_admin_select" ON public.profiles 
  FOR SELECT USING (public.is_admin());

-- 9. Admin policies for viewing all downloads
CREATE POLICY "downloads_admin_select" ON public.downloads 
  FOR SELECT USING (public.is_admin());

-- 10. Admin policies for viewing all user roles
CREATE POLICY "user_roles_admin_select" ON public.user_roles 
  FOR SELECT USING (public.is_admin());

-- 11. Admin policies for contact messages
CREATE POLICY "contact_messages_admin_select" ON public.contact_messages 
  FOR SELECT USING (public.is_admin());

CREATE POLICY "contact_messages_admin_update" ON public.contact_messages 
  FOR UPDATE USING (public.is_admin());

-- 12. Trigger to auto-create profile and user_role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, phone, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    COALESCE(NEW.raw_user_meta_data ->> 'phone', NULL),
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user')
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- 13. Function to update book timestamp
CREATE OR REPLACE FUNCTION public.update_book_timestamp()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS books_updated_at ON public.books;

CREATE TRIGGER books_updated_at
  BEFORE UPDATE ON public.books
  FOR EACH ROW
  EXECUTE FUNCTION public.update_book_timestamp();
