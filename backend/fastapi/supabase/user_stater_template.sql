-- Create the user_profile table
create table public.user_profile (
  -- Primary key with UUID, directly references auth.users
  id uuid references auth.users on delete cascade not null primary key,

  -- User details
  username text unique,
  sensor_id text unique,

  -- Water-related details
  currect_water_level_in_bottle integer default 0,
  bottle_weight integer default 0,
  is_bottle_on_dock boolean default false,
  daily_goal integer default 0,
  todays_water_intake_in_ml integer default 0,

  -- Time details
  wakeup_time time,
  sleep_time time,

  -- User profile attributes
  age integer,
  weight float,
  height float,
  gender text check (gender in ('Male', 'Female', 'Other')),

  -- Timestamps
  updated_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security (RLS)
alter table public.user_profile
  enable row level security;

-- Policy: Public profiles are viewable by everyone
create policy "Public user profiles are viewable by everyone." 
  on public.user_profile
  for select 
  using (true);

-- Policy: Users can insert their own profile
create policy "Users can insert their own user_profile."
  on public.user_profile
  for insert 
  with check ((select auth.uid()) = id);

-- Policy: Users can update their own profile
create policy "Users can update their own user_profile."
  on public.user_profile
  for update 
  using ((select auth.uid()) = id);

-- Function to insert into user_profile when a new user is created in auth.users
create function public.handle_new_user_profile()
returns trigger
set search_path = ''
as $$
begin
  insert into public.user_profile (id)
  values (new.id);
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to call the function after a new user is inserted in auth.users
create trigger hydrateme_user_created_user_profile
  after insert on auth.users
  for each row execute procedure public.handle_new_user_profile();
