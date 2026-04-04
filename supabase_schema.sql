create extension if not exists "pgcrypto";

create table if not exists workers (
    id uuid primary key,
    name text not null,
    phone text not null unique,
    platform text not null,
    city text not null,
    upi_id text not null,
    risk_score double precision not null default 0.0 check (risk_score >= 0 and risk_score <= 1),
    license text,
    created_at timestamptz not null default timezone('utc'::text, now())
);

create table if not exists policies (
    id uuid primary key default gen_random_uuid(),
    worker_id uuid not null references workers(id) on delete cascade,
    weekly_premium double precision not null check (weekly_premium > 0),
    coverage_amount double precision not null check (coverage_amount > 0),
    weekly_payout double precision not null check (weekly_payout > 0),
    status text not null default 'active' check (status in ('active', 'expired', 'cancelled')),
    created_at timestamptz not null default timezone('utc'::text, now()),
    valid_until timestamptz
);

create table if not exists claims (
    id uuid primary key default gen_random_uuid(),
    policy_id uuid not null references policies(id) on delete cascade,
    worker_id uuid not null references workers(id) on delete cascade,
    trigger_type text not null,
    payout_amount double precision not null check (payout_amount > 0),
    status text not null default 'pending' check (status in ('pending', 'processed', 'failed')),
    created_at timestamptz not null default timezone('utc'::text, now())
);

create index if not exists idx_policies_worker_id on policies(worker_id);
create index if not exists idx_claims_worker_id on claims(worker_id);
create index if not exists idx_claims_policy_id on claims(policy_id);

alter table workers enable row level security;
alter table policies enable row level security;
alter table claims enable row level security;

create policy "workers_select_own" on workers
for select using (auth.uid() = id);

create policy "workers_insert_own" on workers
for insert with check (auth.uid() = id);

create policy "workers_update_own" on workers
for update using (auth.uid() = id);

create policy "policies_select_own" on policies
for select using (auth.uid() = worker_id);

create policy "policies_insert_own" on policies
for insert with check (auth.uid() = worker_id);

create policy "claims_select_own" on claims
for select using (auth.uid() = worker_id);

create policy "claims_insert_own" on claims
for insert with check (auth.uid() = worker_id);
