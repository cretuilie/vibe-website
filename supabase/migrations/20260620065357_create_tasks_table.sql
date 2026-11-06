create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  deadline date not null,
  status text not null default 'pending',
  notify_days_before int not null default 14,
  created_at timestamptz default now()
);
