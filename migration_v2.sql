-- ============================================================
-- Vertex Platform Enhancement Migration
-- Run this in the Supabase SQL Editor
-- ============================================================

-- 1. Fraud Detection Signals
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS fraud_signals (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    claim_id uuid REFERENCES claims(id) ON DELETE CASCADE,
    worker_id uuid NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
    signal_type text NOT NULL CHECK (signal_type IN ('velocity', 'amount_anomaly', 'gps_mismatch', 'pattern', 'device', 'weather_mismatch')),
    severity text NOT NULL DEFAULT 'low' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    fraud_score integer NOT NULL DEFAULT 0 CHECK (fraud_score >= 0 AND fraud_score <= 100),
    details jsonb DEFAULT '{}'::jsonb,
    status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'investigating', 'resolved', 'false_positive')),
    resolved_by text,
    resolved_at timestamptz,
    created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_fraud_signals_worker ON fraud_signals(worker_id);
CREATE INDEX IF NOT EXISTS idx_fraud_signals_claim ON fraud_signals(claim_id);
CREATE INDEX IF NOT EXISTS idx_fraud_signals_status ON fraud_signals(status);

-- 2. Automated Trigger Events
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS trigger_events (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    city text NOT NULL,
    trigger_type text NOT NULL CHECK (trigger_type IN ('weather', 'demand_surge', 'platform_outage', 'traffic_disruption', 'heatwave')),
    severity text NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    data jsonb DEFAULT '{}'::jsonb,
    affected_policies integer DEFAULT 0,
    auto_processed boolean DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_trigger_events_city ON trigger_events(city);
CREATE INDEX IF NOT EXISTS idx_trigger_events_type ON trigger_events(trigger_type);

-- 3. Notifications
-- -----------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES workers(id) ON DELETE CASCADE,
    type text NOT NULL CHECK (type IN ('claim_approved', 'claim_denied', 'fraud_alert', 'weather_warning', 'premium_change', 'policy_expiry', 'system')),
    title text NOT NULL,
    message text NOT NULL,
    data jsonb DEFAULT '{}'::jsonb,
    read boolean DEFAULT false,
    created_at timestamptz NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(user_id, read);

-- 4. Extend Claims Table
-- -----------------------------------------------------------
ALTER TABLE claims ADD COLUMN IF NOT EXISTS fraud_score integer DEFAULT 0;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS fraud_flags text[] DEFAULT '{}';
ALTER TABLE claims ADD COLUMN IF NOT EXISTS gps_verified boolean DEFAULT false;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS risk_level text;
ALTER TABLE claims ADD COLUMN IF NOT EXISTS disruption_type text;

-- 5. Row Level Security for new tables
-- -----------------------------------------------------------
ALTER TABLE fraud_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE trigger_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Fraud signals: workers see their own, admins see all (via service role)
CREATE POLICY "fraud_signals_select_own" ON fraud_signals
FOR SELECT USING (auth.uid() = worker_id);

-- Trigger events: everyone can read (public data)
CREATE POLICY "trigger_events_select_all" ON trigger_events
FOR SELECT USING (true);

-- Notifications: users see their own
CREATE POLICY "notifications_select_own" ON notifications
FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "notifications_update_own" ON notifications
FOR UPDATE USING (auth.uid() = user_id);

-- Allow backend service role to insert into all tables
CREATE POLICY "fraud_signals_insert_service" ON fraud_signals
FOR INSERT WITH CHECK (true);

CREATE POLICY "trigger_events_insert_service" ON trigger_events
FOR INSERT WITH CHECK (true);

CREATE POLICY "notifications_insert_service" ON notifications
FOR INSERT WITH CHECK (true);

-- 6. Allow backend to insert claims with new columns
-- -----------------------------------------------------------
-- (Claims already has insert policy from original schema)

SELECT 'Migration complete!' AS result;
