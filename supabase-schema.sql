-- ============================================
-- SCHEMA DE BASE DE DATOS PARA IDDEASS CHAT
-- ============================================

-- ============================================
-- TABLA: profiles
-- ============================================
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade not null primary key,
  full_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

-- ============================================
-- POLITICAS DE SEGURIDAD PARA PROFILES
-- ============================================

create policy "Users can view own profile"
  on public.profiles for select
  using ( auth.uid() = id );

create policy "Users can insert own profile"
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile"
  on public.profiles for update
  using ( auth.uid() = id );

-- ============================================
-- FUNCION: Crear perfil automaticamente
-- ============================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name'
  );
  return new;
end;
$$;

-- ============================================
-- TRIGGER: Crear perfil al registrar usuario
-- ============================================
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ============================================
-- FUNCION: Actualizar timestamp updated_at
-- ============================================
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- ============================================
-- TRIGGER: Actualizar updated_at en profiles
-- ============================================
drop trigger if exists on_profile_updated on public.profiles;
create trigger on_profile_updated
  before update on public.profiles
  for each row execute procedure public.handle_updated_at();

-- ============================================
-- TABLA: chat_sessions
-- ============================================
create table if not exists public.chat_sessions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  agent_id text not null,
  session_id text not null,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.chat_sessions enable row level security;

-- ============================================
-- POLITICAS DE SEGURIDAD PARA CHAT_SESSIONS
-- ============================================

create policy "Users can view own sessions"
  on public.chat_sessions for select
  using ( auth.uid() = user_id );

create policy "Users can insert own sessions"
  on public.chat_sessions for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own sessions"
  on public.chat_sessions for update
  using ( auth.uid() = user_id );

create policy "Users can delete own sessions"
  on public.chat_sessions for delete
  using ( auth.uid() = user_id );

-- Indices para mejorar rendimiento
create index if not exists chat_sessions_user_id_idx on public.chat_sessions(user_id);
create index if not exists chat_sessions_created_at_idx on public.chat_sessions(created_at desc);

-- ============================================
-- TABLA: user_preferences
-- ============================================
create table if not exists public.user_preferences (
  user_id uuid references auth.users on delete cascade primary key,
  theme text default 'system' check (theme in ('light', 'dark', 'system')),
  language text default 'es',
  notifications_enabled boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.user_preferences enable row level security;

-- ============================================
-- POLITICAS DE SEGURIDAD PARA USER_PREFERENCES
-- ============================================

create policy "Users can view own preferences"
  on public.user_preferences for select
  using ( auth.uid() = user_id );

create policy "Users can insert own preferences"
  on public.user_preferences for insert
  with check ( auth.uid() = user_id );

create policy "Users can update own preferences"
  on public.user_preferences for update
  using ( auth.uid() = user_id );

-- ============================================
-- FIN DEL SCHEMA
-- ============================================
