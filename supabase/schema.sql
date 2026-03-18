-- ============================================
-- NEXTOKEN CAPITAL — SUPABASE DATABASE SCHEMA
-- Run this in your Supabase SQL editor
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── USERS ───────────────────────────────────
CREATE TABLE public.users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  account_type TEXT NOT NULL DEFAULT 'investor', -- investor | issuer | institution
  kyc_status TEXT NOT NULL DEFAULT 'pending', -- pending | submitted | approved | rejected
  kyc_submitted_at TIMESTAMPTZ,
  kyc_approved_at TIMESTAMPTZ,
  wallet_address TEXT,
  balance_eur NUMERIC(20,2) DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── SESSIONS ────────────────────────────────
CREATE TABLE public.sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  token TEXT UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── KYC DOCUMENTS ───────────────────────────
CREATE TABLE public.kyc_documents (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  full_name TEXT,
  date_of_birth DATE,
  nationality TEXT,
  tax_id TEXT,
  investor_type TEXT,
  source_of_funds TEXT,
  id_document_url TEXT,
  proof_of_address_url TEXT,
  selfie_url TEXT,
  status TEXT DEFAULT 'submitted',
  reviewer_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ASSETS (Tokenized Real World Assets) ────
CREATE TABLE public.assets (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  issuer_id UUID REFERENCES public.users(id),
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  asset_type TEXT NOT NULL, -- real_estate | equity | commodity | infrastructure | bond
  description TEXT,
  total_value NUMERIC(20,2),
  token_supply BIGINT,
  token_price NUMERIC(20,8),
  token_standard TEXT DEFAULT 'ERC-3643',
  blockchain TEXT DEFAULT 'Polygon',
  contract_address TEXT,
  min_investment NUMERIC(20,2),
  expected_return NUMERIC(5,2),
  status TEXT DEFAULT 'pending', -- pending | review | active | closed | paused
  is_listed BOOLEAN DEFAULT FALSE,
  fundraising_deadline TIMESTAMPTZ,
  raised_amount NUMERIC(20,2) DEFAULT 0,
  investor_count INT DEFAULT 0,
  documents JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── BONDS ───────────────────────────────────
CREATE TABLE public.bonds (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  issuer_id UUID REFERENCES public.users(id),
  asset_id UUID REFERENCES public.assets(id),
  name TEXT NOT NULL,
  symbol TEXT NOT NULL,
  bond_type TEXT NOT NULL, -- corporate | green | infrastructure | convertible | revenue
  total_issuance NUMERIC(20,2) NOT NULL,
  face_value NUMERIC(20,2) NOT NULL,
  coupon_rate NUMERIC(5,2) NOT NULL,
  coupon_frequency TEXT DEFAULT 'annual', -- annual | semi_annual | quarterly | monthly
  term_years INT NOT NULL,
  maturity_date DATE,
  min_investment NUMERIC(20,2),
  issuer_name TEXT,
  issuer_registration TEXT,
  issuer_jurisdiction TEXT,
  use_of_proceeds TEXT,
  raised_amount NUMERIC(20,2) DEFAULT 0,
  investor_count INT DEFAULT 0,
  status TEXT DEFAULT 'pending', -- pending | active | closed | matured
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── EQUITY / IPO ─────────────────────────────
CREATE TABLE public.equity_offerings (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  issuer_id UUID REFERENCES public.users(id),
  company_name TEXT NOT NULL,
  company_sector TEXT,
  stage TEXT, -- seed | series_a | series_b | ipo
  description TEXT,
  pre_money_valuation NUMERIC(20,2),
  equity_offered_pct NUMERIC(5,2),
  raise_target NUMERIC(20,2),
  token_supply BIGINT,
  token_price NUMERIC(20,8),
  token_rights TEXT,
  dividend_policy TEXT,
  min_investment NUMERIC(20,2),
  raised_amount NUMERIC(20,2) DEFAULT 0,
  investor_count INT DEFAULT 0,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ORDERS (Exchange) ───────────────────────
CREATE TABLE public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  asset_id UUID REFERENCES public.assets(id),
  order_type TEXT NOT NULL, -- buy | sell
  order_kind TEXT DEFAULT 'limit', -- limit | market
  price NUMERIC(20,8) NOT NULL,
  quantity NUMERIC(20,8) NOT NULL,
  filled_quantity NUMERIC(20,8) DEFAULT 0,
  remaining_quantity NUMERIC(20,8),
  total_value NUMERIC(20,2),
  fee NUMERIC(20,2),
  status TEXT DEFAULT 'open', -- open | partially_filled | filled | cancelled
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TRADES (Executed Orders) ─────────────────
CREATE TABLE public.trades (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  buy_order_id UUID REFERENCES public.orders(id),
  sell_order_id UUID REFERENCES public.orders(id),
  asset_id UUID REFERENCES public.assets(id),
  buyer_id UUID REFERENCES public.users(id),
  seller_id UUID REFERENCES public.users(id),
  price NUMERIC(20,8) NOT NULL,
  quantity NUMERIC(20,8) NOT NULL,
  total_value NUMERIC(20,2),
  buyer_fee NUMERIC(20,2),
  seller_fee NUMERIC(20,2),
  executed_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── INVESTMENTS (Holdings) ───────────────────
CREATE TABLE public.investments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  asset_id UUID REFERENCES public.assets(id),
  bond_id UUID REFERENCES public.bonds(id),
  equity_id UUID REFERENCES public.equity_offerings(id),
  investment_type TEXT NOT NULL, -- asset | bond | equity
  amount_invested NUMERIC(20,2) NOT NULL,
  tokens_held NUMERIC(20,8),
  average_price NUMERIC(20,8),
  current_value NUMERIC(20,2),
  pnl NUMERIC(20,2) DEFAULT 0,
  status TEXT DEFAULT 'active',
  invested_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── TRANSACTIONS (Wallet) ────────────────────
CREATE TABLE public.transactions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  transaction_type TEXT NOT NULL, -- deposit | withdrawal | buy | sell | fee | dividend
  amount NUMERIC(20,2) NOT NULL,
  currency TEXT DEFAULT 'EUR',
  reference_id UUID,
  description TEXT,
  status TEXT DEFAULT 'completed',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── MARKET PRICES (Live Prices) ─────────────
CREATE TABLE public.market_prices (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  asset_id UUID REFERENCES public.assets(id),
  price NUMERIC(20,8) NOT NULL,
  change_24h NUMERIC(5,2),
  volume_24h NUMERIC(20,2),
  high_24h NUMERIC(20,8),
  low_24h NUMERIC(20,8),
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── ADVISORY CLIENTS ─────────────────────────
CREATE TABLE public.advisory_clients (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  company_name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT NOT NULL,
  phone TEXT,
  service_type TEXT, -- tokenization | bond | ipo | strategy
  budget NUMERIC(20,2),
  description TEXT,
  status TEXT DEFAULT 'lead', -- lead | proposal | active | completed
  revenue NUMERIC(20,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─── SEED DATA ────────────────────────────────

-- Seed market assets
INSERT INTO public.assets (name, symbol, asset_type, description, total_value, token_supply, token_price, min_investment, expected_return, status, is_listed, raised_amount, investor_count)
VALUES
  ('NXT Platform Token', 'NXT', 'equity', 'Nextoken Capital platform utility and governance token', 12400000, 10000000, 1.248, 10, 0, 'active', true, 9200000, 847),
  ('Baltic Green Bond 2027', 'BALT-GREEN-27', 'bond', 'Green infrastructure bond from Baltic Energy UAB', 5000000, 50000, 98.40, 500, 6.4, 'active', true, 3600000, 284),
  ('EU Infrastructure Bond', 'EU-INFRA-29', 'bond', 'Corporate bond for EU infrastructure projects', 20000000, 200000, 101.20, 1000, 5.1, 'active', true, 9000000, 312),
  ('RE Token Lithuania', 'RE-TOKEN-LT', 'real_estate', 'Tokenized commercial real estate in Vilnius', 2450000, 10000, 245.00, 500, 7.8, 'active', true, 1800000, 156),
  ('SME Convertible Note I', 'SME-CNV-26', 'bond', 'Convertible note from Vilnius Tech UAB', 1000000, 10000, 100.00, 250, 8.2, 'active', true, 940000, 94),
  ('Renewable Energy Bond 2030', 'RE-ENERGY-30', 'bond', 'Green bond for renewable energy projects', 20000000, 200000, 99.80, 2000, 4.8, 'active', true, 5600000, 228),
  ('Vilnius FinTech UAB', 'VFT-EQUITY', 'equity', 'Series A equity offering for Vilnius FinTech', 12000000, 640000, 18.75, 100, 0, 'active', true, 1360000, 187),
  ('Baltic Solar OÜ', 'BSL-SEED', 'equity', 'Seed round for Baltic solar energy company', 3000000, 166666, 3.00, 50, 0, 'active', true, 200000, 43);

-- Seed bond data
INSERT INTO public.bonds (name, symbol, bond_type, total_issuance, face_value, coupon_rate, coupon_frequency, term_years, maturity_date, min_investment, issuer_name, raised_amount, investor_count, status)
VALUES
  ('Baltic Green Bond 2027', 'BALT-GREEN-27', 'green', 5000000, 1000, 6.4, 'annual', 3, '2027-12-31', 500, 'Baltic Energy UAB', 3600000, 284, 'active'),
  ('EU Infrastructure Bond', 'EU-INFRA-29', 'corporate', 20000000, 1000, 5.1, 'semi_annual', 5, '2029-06-30', 1000, 'EuroInfra SA', 9000000, 312, 'active'),
  ('SME Convertible Note I', 'SME-CNV-26', 'convertible', 1000000, 100, 8.2, 'quarterly', 2, '2026-03-31', 250, 'Vilnius Tech UAB', 940000, 94, 'active'),
  ('Renewable Energy Bond 2030', 'RE-ENERGY-30', 'green', 20000000, 1000, 4.8, 'annual', 7, '2030-01-31', 2000, 'CleanPower OÜ', 5600000, 228, 'active');

-- ─── RLS POLICIES ─────────────────────────────
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.investments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own data
CREATE POLICY "Users read own data" ON public.users FOR SELECT USING (true);
CREATE POLICY "Users update own data" ON public.users FOR UPDATE USING (auth.uid()::text = id::text);

-- Public read for assets, bonds, equity
CREATE POLICY "Public read assets" ON public.assets FOR SELECT USING (true);
CREATE POLICY "Public read bonds" ON public.bonds FOR SELECT USING (true);
CREATE POLICY "Public read equity" ON public.equity_offerings FOR SELECT USING (true);
CREATE POLICY "Public read prices" ON public.market_prices FOR SELECT USING (true);

-- Authenticated users can manage their own orders/investments
CREATE POLICY "Own orders" ON public.orders FOR ALL USING (true);
CREATE POLICY "Own investments" ON public.investments FOR ALL USING (true);
CREATE POLICY "Own transactions" ON public.transactions FOR ALL USING (true);
