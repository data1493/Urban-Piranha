create table if not exists shop_orders (
  id text primary key,
  user_id text,
  email text not null,
  name text not null default '',
  stripe_session_id text unique,
  status text not null default 'paid',
  amount_cents integer not null,
  shipping_cents integer not null default 0,
  currency text not null default 'usd',
  lines_json text not null,
  shipping_json text,
  source text not null default 'urban-piranha',
  created_at timestamptz not null default now()
);
create index if not exists shop_orders_user_id_idx on shop_orders (user_id);
create index if not exists shop_orders_email_idx on shop_orders (email);

create table if not exists newsletter (
  email text primary key,
  source text not null default 'site',
  created_at timestamptz not null default now()
);

create table if not exists contact_messages (
  id serial primary key,
  user_id text,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);
