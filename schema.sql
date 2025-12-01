-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Habits Table
create table habits (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  icon text,
  color text,
  frequency text[], -- e.g. ['Mon', 'Tue'] or ['Daily']
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Habit Logs Table
create table habit_logs (
  id uuid default uuid_generate_v4() primary key,
  habit_id uuid references habits(id) on delete cascade not null,
  date date not null,
  completed boolean default false,
  note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(habit_id, date)
);

-- Projects Table
create table projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Tasks Table
create table tasks (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  project_id uuid references projects(id) on delete set null,
  title text not null,
  description text,
  priority text check (priority in ('Urgent & Important', 'Urgent', 'Important', 'Normal')),
  status text check (status in ('todo', 'doing', 'done')) default 'todo',
  due_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Goals Table
create table goals (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  title text not null,
  description text,
  term text check (term in ('Short', 'Mid', 'Long')),
  target_value numeric,
  current_value numeric default 0,
  unit text,
  deadline date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Categories Table (for Finances)
create table categories (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  name text not null,
  type text check (type in ('income', 'expense')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Transactions Table
create table transactions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users not null,
  category_id uuid references categories(id) on delete set null,
  amount numeric not null,
  date date not null,
  note text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS)
alter table habits enable row level security;
alter table habit_logs enable row level security;
alter table projects enable row level security;
alter table tasks enable row level security;
alter table goals enable row level security;
alter table categories enable row level security;
alter table transactions enable row level security;

-- Policies
create policy "Users can view their own habits" on habits for select using (auth.uid() = user_id);
create policy "Users can insert their own habits" on habits for insert with check (auth.uid() = user_id);
create policy "Users can update their own habits" on habits for update using (auth.uid() = user_id);
create policy "Users can delete their own habits" on habits for delete using (auth.uid() = user_id);

create policy "Users can view their own habit logs" on habit_logs for select using (exists (select 1 from habits where habits.id = habit_logs.habit_id and habits.user_id = auth.uid()));
create policy "Users can insert their own habit logs" on habit_logs for insert with check (exists (select 1 from habits where habits.id = habit_logs.habit_id and habits.user_id = auth.uid()));
create policy "Users can update their own habit logs" on habit_logs for update using (exists (select 1 from habits where habits.id = habit_logs.habit_id and habits.user_id = auth.uid()));
create policy "Users can delete their own habit logs" on habit_logs for delete using (exists (select 1 from habits where habits.id = habit_logs.habit_id and habits.user_id = auth.uid()));

create policy "Users can view their own projects" on projects for select using (auth.uid() = user_id);
create policy "Users can insert their own projects" on projects for insert with check (auth.uid() = user_id);
create policy "Users can update their own projects" on projects for update using (auth.uid() = user_id);
create policy "Users can delete their own projects" on projects for delete using (auth.uid() = user_id);

create policy "Users can view their own tasks" on tasks for select using (auth.uid() = user_id);
create policy "Users can insert their own tasks" on tasks for insert with check (auth.uid() = user_id);
create policy "Users can update their own tasks" on tasks for update using (auth.uid() = user_id);
create policy "Users can delete their own tasks" on tasks for delete using (auth.uid() = user_id);

create policy "Users can view their own goals" on goals for select using (auth.uid() = user_id);
create policy "Users can insert their own goals" on goals for insert with check (auth.uid() = user_id);
create policy "Users can update their own goals" on goals for update using (auth.uid() = user_id);
create policy "Users can delete their own goals" on goals for delete using (auth.uid() = user_id);

create policy "Users can view their own categories" on categories for select using (auth.uid() = user_id);
create policy "Users can insert their own categories" on categories for insert with check (auth.uid() = user_id);
create policy "Users can update their own categories" on categories for update using (auth.uid() = user_id);
create policy "Users can delete their own categories" on categories for delete using (auth.uid() = user_id);

create policy "Users can view their own transactions" on transactions for select using (auth.uid() = user_id);
create policy "Users can insert their own transactions" on transactions for insert with check (auth.uid() = user_id);
create policy "Users can update their own transactions" on transactions for update using (auth.uid() = user_id);
create policy "Users can delete their own transactions" on transactions for delete using (auth.uid() = user_id);
