CREATE TABLE public.products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  price numeric(10,2) NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT '$',
  period text NOT NULL DEFAULT '/ month',
  image_key text,
  perks text[] NOT NULL DEFAULT '{}',
  badge text,
  active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.products TO service_role;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY service_role_all_products ON public.products FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TABLE public.site_settings (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.site_settings TO service_role;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY service_role_all_settings ON public.site_settings FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE TABLE public.carts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  total numeric(10,2) NOT NULL DEFAULT 0,
  channel text,
  status text NOT NULL DEFAULT 'sent',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.carts TO service_role;
ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
CREATE POLICY service_role_all_carts ON public.carts FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = now(); RETURN NEW; END; $$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON public.products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON public.carts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.site_settings (key, value) VALUES
  ('whatsapp', ''),
  ('telegram', ''),
  ('instagram', '');

INSERT INTO public.products (title, description, price, period, image_key, perks, badge, sort_order) VALUES
  ('Streaming Pro', '4K streaming subscription, instant delivery to your inbox.', 4.99, '/ month', 'project-1', ARRAY['4K + HDR','Works worldwide','Instant activation'], 'Popular', 1),
  ('Music Unlimited', 'Ad-free music on every device with offline downloads.', 3.49, '/ month', 'project-2', ARRAY['Ad-free','Offline mode','Up to 6 devices'], 'Best value', 2),
  ('AI Assistant Plus', 'Premium AI access with priority speed and higher limits.', 9.99, '/ month', 'project-3', ARRAY['Priority speed','Higher limits','Early features'], 'Enterprise', 3),
  ('Gaming Pass', 'Access a growing library of premium games and online multiplayer.', 7.99, '/ month', 'project-1', ARRAY['100+ titles','Online multiplayer','New releases'], 'Gaming', 4),
  ('VPN Shield', 'Fast, secure VPN with no logs and global server coverage.', 2.99, '/ month', 'project-2', ARRAY['No logs','50+ locations','Unlimited bandwidth'], 'Secure', 5),
  ('Creative Cloud', 'Full suite of design, video and photo editing tools.', 14.99, '/ month', 'project-3', ARRAY['20+ apps','100GB cloud','Premium fonts'], 'Creative', 6);