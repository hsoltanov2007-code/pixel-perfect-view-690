CREATE TABLE public.operator_status (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  online BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT ON public.operator_status TO anon;
GRANT SELECT ON public.operator_status TO authenticated;
GRANT ALL ON public.operator_status TO service_role;

ALTER TABLE public.operator_status ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view operator status" ON public.operator_status FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "service_role can manage operator status" ON public.operator_status FOR ALL TO service_role USING (true) WITH CHECK (true);

INSERT INTO public.operator_status (online) VALUES (false);