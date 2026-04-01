-- License Key System Database Schema

-- Users/Licenses table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255),
    license_key UUID UNIQUE DEFAULT gen_random_uuid(),
    plan VARCHAR(20) CHECK (plan IN ('daily', 'weekly', 'monthly', 'yearly')),
    expires_at TIMESTAMP WITH TIME ZONE,
    active BOOLEAN DEFAULT true,
    stripe_customer_id VARCHAR(255),
    stripe_session_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_users_license_key ON users(license_key);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_stripe_customer_id ON users(stripe_customer_id);
CREATE INDEX IF NOT EXISTS idx_users_expires_at ON users(expires_at);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Migration: Add password_hash column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'password_hash') THEN
        ALTER TABLE users ADD COLUMN password_hash VARCHAR(255);
    END IF;
END $$;

-- Migration: Allow yearly plan
DO $$
BEGIN
    ALTER TABLE users DROP CONSTRAINT IF EXISTS users_plan_check;
    ALTER TABLE users ADD CONSTRAINT users_plan_check CHECK (plan IN ('daily', 'weekly', 'monthly', 'yearly'));
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

-- Migration: Make plan and expires_at nullable for users who signed up but haven't purchased
DO $$
BEGIN
    ALTER TABLE users ALTER COLUMN plan DROP NOT NULL;
    ALTER TABLE users ALTER COLUMN expires_at DROP NOT NULL;
    ALTER TABLE users ALTER COLUMN license_key DROP NOT NULL;
EXCEPTION WHEN OTHERS THEN
    NULL;
END $$;

-- Migration: Add stripe_subscription_id column
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'stripe_subscription_id') THEN
        ALTER TABLE users ADD COLUMN stripe_subscription_id VARCHAR(255);
    END IF;
END $$;
