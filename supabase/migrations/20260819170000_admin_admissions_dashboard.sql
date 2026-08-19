-- Admin admissions dashboard additions. Safe to run after a partial admissions setup.

CREATE TABLE IF NOT EXISTS public.programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  name text NOT NULL,
  category text NOT NULL DEFAULT 'Technology',
  description text NOT NULL DEFAULT '',
  skills text[] NOT NULL DEFAULT '{}',
  duration text NOT NULL DEFAULT '3 Months',
  sort_order int NOT NULL DEFAULT 0,
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.programs TO anon, authenticated;
GRANT ALL ON public.programs TO service_role;
DROP POLICY IF EXISTS "programs public read" ON public.programs;
CREATE POLICY "programs public read" ON public.programs FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS public.joining_months (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month text NOT NULL UNIQUE,
  month_index int NOT NULL,
  active boolean NOT NULL DEFAULT false,
  available_seats int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.joining_months ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.joining_months TO anon, authenticated;
GRANT ALL ON public.joining_months TO service_role;
DROP POLICY IF EXISTS "months public read" ON public.joining_months;
CREATE POLICY "months public read" ON public.joining_months FOR SELECT TO anon, authenticated USING (true);

INSERT INTO public.programs (slug, name, category, description, skills, sort_order)
VALUES
  ('full-stack-web-development', 'Full Stack Web Development', 'Technology', 'Build complete web applications across frontend and backend.', '{HTML/CSS,JavaScript,React,Node.js,Databases}', 1),
  ('artificial-intelligence-machine-learning', 'Artificial Intelligence & Machine Learning', 'Technology', 'Work with Python, ML fundamentals and applied AI projects.', '{Python,"Machine Learning","Model Building"}', 2),
  ('data-science', 'Data Science', 'Data', 'Turn raw data into insights using statistics and Python.', '{Python,Statistics,Pandas,Visualization}', 3),
  ('devops', 'DevOps', 'Technology', 'Learn build, deployment and automation practices.', '{Linux,Git,"CI/CD",Docker}', 4),
  ('software-testing', 'Software Testing', 'Technology', 'Manual and automation testing fundamentals.', '{"Test Cases",Selenium,"Bug Reporting"}', 5),
  ('python-with-power-bi', 'Python with Power BI', 'Data', 'Combine Python with business intelligence dashboards.', '{Python,"Power BI",DAX}', 6),
  ('data-analytics', 'Data Analytics', 'Data', 'Analyse and present data for business decisions.', '{Excel,SQL,"Power BI",Reporting}', 7),
  ('cyber-security', 'Cyber Security', 'Technology', 'Security fundamentals and practical defensive skills.', '{Networking,"Ethical Hacking","Security Tools"}', 8),
  ('embedded-systems', 'Embedded Systems', 'Core / Engineering', 'Microcontroller programming and hardware interfacing.', '{C,Microcontrollers,Sensors}', 9),
  ('digital-marketing', 'Digital Marketing', 'Business', 'Practical digital campaigns, SEO and social media.', '{SEO,"Social Media",Analytics,Ads}', 10),
  ('business-growth-specialist', 'Business Growth Specialist', 'Business', 'Growth strategy, sales and market research skills.', '{"Market Research",Sales,Strategy}', 11),
  ('human-resource-management', 'Human Resource Management', 'Management', 'Recruitment, HR operations and people practices.', '{Recruitment,"HR Operations",Payroll}', 12),
  ('ar-vr', 'Augmented Reality / Virtual Reality', 'Technology', 'Build immersive AR/VR experiences.', '{Unity,3D,"AR/VR SDKs"}', 13),
  ('cloud-computing', 'Cloud Computing', 'Technology', 'Cloud fundamentals, deployment and services.', '{Cloud,Linux,Deployment,Networking}', 14),
  ('ui-ux', 'UI/UX', 'Design', 'Design usable, attractive digital product interfaces.', '{Figma,Wireframing,Prototyping,"User Research"}', 15),
  ('finance-tally', 'Finance & Tally', 'Business', 'Accounting fundamentals with Tally practice.', '{Accounting,Tally,GST}', 16),
  ('medical-coding', 'Medical Coding', 'Healthcare', 'Clinical documentation and medical coding standards.', '{"ICD Coding",Terminology,Compliance}', 17),
  ('data-structures-algorithms', 'Data Structures & Algorithms', 'Technology', 'Strengthen problem solving for technical interviews.', '{Arrays,Trees,Graphs,"Problem Solving"}', 18),
  ('python-programming', 'Python Programming Language', 'Technology', 'Core Python programming from basics to projects.', '{Python,OOP,Scripting}', 19),
  ('autocad', 'AutoCAD', 'Core / Engineering', '2D/3D drafting and design fundamentals.', '{Drafting,"2D Design","3D Modelling"}', 20),
  ('iot-robotics', 'IoT & Robotics', 'Core / Engineering', 'Connected devices, sensors and robotics basics.', '{IoT,Sensors,Arduino,Automation}', 21),
  ('business-analyst', 'Business Analyst', 'Business', 'Requirements, analysis and stakeholder communication.', '{Requirements,SQL,Documentation}', 22),
  ('vlsi', 'VLSI', 'Core / Engineering', 'Digital design and VLSI design flow fundamentals.', '{Verilog,"Digital Design",Simulation}', 23),
  ('clinical-trials-research', 'Clinical Trials & Research', 'Healthcare', 'Clinical research processes and regulatory basics.', '{"Clinical Research",Regulatory,Documentation}', 24),
  ('other', 'Other', 'Technology', 'Not listed? Tell us the domain you want to learn.', '{Custom}', 25)
ON CONFLICT (slug) DO NOTHING;

ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS application_id text;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS whatsapp text;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS date_of_birth date;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS college text;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS degree text;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS department text;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS current_year text;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS graduation_year text;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS domain text;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS custom_domain text;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS preferred_mode text;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS joining_month text;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS preferred_session text;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS source text;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS status text DEFAULT 'New';
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS notes text;
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();
ALTER TABLE public.admissions ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

UPDATE public.admissions
SET application_id = 'ORV-' || to_char(coalesce(created_at, now()), 'YYYY') || '-' || lpad(row_number::text, 5, '0')
FROM (
  SELECT id, row_number() OVER (ORDER BY created_at NULLS LAST, id) FROM public.admissions
) existing
WHERE public.admissions.id = existing.id AND public.admissions.application_id IS NULL;

UPDATE public.admissions SET status = 'New' WHERE status IS NULL OR status = '';
UPDATE public.admissions SET status = 'Approved' WHERE status = 'Application Approved';
ALTER TABLE public.admissions ALTER COLUMN application_id SET NOT NULL;
ALTER TABLE public.admissions ALTER COLUMN full_name SET NOT NULL;
ALTER TABLE public.admissions ALTER COLUMN email SET NOT NULL;
ALTER TABLE public.admissions ALTER COLUMN phone SET NOT NULL;
ALTER TABLE public.admissions ALTER COLUMN college SET NOT NULL;
ALTER TABLE public.admissions ALTER COLUMN domain SET NOT NULL;
ALTER TABLE public.admissions ALTER COLUMN status SET NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS admissions_application_id_idx ON public.admissions(application_id);
CREATE INDEX IF NOT EXISTS admissions_domain_idx ON public.admissions(domain);
CREATE INDEX IF NOT EXISTS admissions_status_idx ON public.admissions(status);

CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  role text NOT NULL DEFAULT 'admin' CHECK (role = 'admin'),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.admin_users TO authenticated;
GRANT ALL ON public.admin_users TO service_role;
DROP POLICY IF EXISTS "admins read own access" ON public.admin_users;
CREATE POLICY "admins read own access" ON public.admin_users FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.is_active_admin(candidate uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = candidate AND active = true AND role = 'admin'
  );
$$;
GRANT EXECUTE ON FUNCTION public.is_active_admin(uuid) TO authenticated;

DROP POLICY IF EXISTS "programs admin write" ON public.programs;
CREATE POLICY "programs admin write" ON public.programs FOR ALL TO authenticated
  USING (public.is_active_admin(auth.uid())) WITH CHECK (public.is_active_admin(auth.uid()));
DROP POLICY IF EXISTS "months admin write" ON public.joining_months;
CREATE POLICY "months admin write" ON public.joining_months FOR ALL TO authenticated
  USING (public.is_active_admin(auth.uid())) WITH CHECK (public.is_active_admin(auth.uid()));

DROP POLICY IF EXISTS "admissions admin read" ON public.admissions;
CREATE POLICY "admissions admin read" ON public.admissions FOR SELECT TO authenticated
  USING (public.is_active_admin(auth.uid()));
DROP POLICY IF EXISTS "admissions admin update" ON public.admissions;
CREATE POLICY "admissions admin update" ON public.admissions FOR UPDATE TO authenticated
  USING (public.is_active_admin(auth.uid())) WITH CHECK (public.is_active_admin(auth.uid()));

CREATE TABLE IF NOT EXISTS public.admin_activity_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id uuid NOT NULL REFERENCES public.admin_users(user_id) ON DELETE CASCADE,
  action text NOT NULL,
  application_id uuid REFERENCES public.admissions(id) ON DELETE SET NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.admin_activity_logs ENABLE ROW LEVEL SECURITY;
GRANT SELECT, INSERT ON public.admin_activity_logs TO authenticated;
GRANT ALL ON public.admin_activity_logs TO service_role;
DROP POLICY IF EXISTS "admins read audit logs" ON public.admin_activity_logs;
CREATE POLICY "admins read audit logs" ON public.admin_activity_logs FOR SELECT TO authenticated
  USING (public.is_active_admin(auth.uid()));
DROP POLICY IF EXISTS "admins write audit logs" ON public.admin_activity_logs;
CREATE POLICY "admins write audit logs" ON public.admin_activity_logs FOR INSERT TO authenticated
  WITH CHECK (public.is_active_admin(auth.uid()) AND admin_user_id = auth.uid());

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  event text NOT NULL,
  label text,
  path text,
  visitor_id text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
GRANT INSERT ON public.analytics_events TO anon, authenticated;
GRANT SELECT ON public.analytics_events TO authenticated;
GRANT ALL ON public.analytics_events TO service_role;
DROP POLICY IF EXISTS "public can record aggregate analytics" ON public.analytics_events;
CREATE POLICY "public can record aggregate analytics" ON public.analytics_events FOR INSERT TO anon, authenticated
  WITH CHECK (char_length(event) <= 80 AND char_length(coalesce(label, '')) <= 160);
DROP POLICY IF EXISTS "admins read aggregate analytics" ON public.analytics_events;
CREATE POLICY "admins read aggregate analytics" ON public.analytics_events FOR SELECT TO authenticated
  USING (public.is_active_admin(auth.uid()));
CREATE INDEX IF NOT EXISTS analytics_events_created_idx ON public.analytics_events(created_at DESC);

CREATE OR REPLACE FUNCTION public.record_analytics_event(event_name text, event_label text DEFAULT NULL, event_path text DEFAULT NULL, event_visitor_id text DEFAULT NULL)
RETURNS void LANGUAGE sql SECURITY DEFINER SET search_path = public AS $$
  INSERT INTO public.analytics_events(event, label, path, visitor_id)
  VALUES (left(event_name, 80), left(event_label, 160), left(event_path, 300), left(event_visitor_id, 120));
$$;
REVOKE ALL ON FUNCTION public.record_analytics_event(text, text, text, text) FROM public;
GRANT EXECUTE ON FUNCTION public.record_analytics_event(text, text, text, text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.log_admin_activity(action_name text, admission_id uuid DEFAULT NULL, log_details jsonb DEFAULT '{}'::jsonb)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.is_active_admin(auth.uid()) THEN
    INSERT INTO public.admin_activity_logs(admin_user_id, action, application_id, details)
    VALUES (auth.uid(), action_name, admission_id, log_details);
  END IF;
END;
$$;
GRANT EXECUTE ON FUNCTION public.log_admin_activity(text, uuid, jsonb) TO authenticated;

CREATE OR REPLACE FUNCTION public.get_admin_analytics()
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  result jsonb;
BEGIN
  IF NOT public.is_active_admin(auth.uid()) THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;
  SELECT jsonb_build_object(
    'total_visitors', count(DISTINCT visitor_id) FILTER (WHERE event = 'page_view'),
    'page_views', count(*) FILTER (WHERE event = 'page_view'),
    'form_starts', count(*) FILTER (WHERE event = 'admission_form_started'),
    'enroll_clicks', count(*) FILTER (WHERE event = 'enroll_clicked'),
    'program_views', count(*) FILTER (WHERE event = 'program_viewed'),
    'pages', coalesce((SELECT jsonb_agg(jsonb_build_object('path', path, 'count', total) ORDER BY total DESC)
      FROM (SELECT path, count(*) AS total FROM public.analytics_events WHERE event = 'page_view' GROUP BY path) page_totals), '[]'::jsonb),
    'sources', coalesce((SELECT jsonb_agg(jsonb_build_object('source', source, 'count', total) ORDER BY total DESC)
      FROM (SELECT coalesce(source, 'Unknown') AS source, count(*) AS total FROM public.admissions GROUP BY source) source_totals), '[]'::jsonb)
  ) INTO result
  FROM public.analytics_events;
  RETURN coalesce(result, '{}'::jsonb);
END;
$$;
GRANT EXECUTE ON FUNCTION public.get_admin_analytics() TO authenticated;

INSERT INTO public.joining_months (month, month_index, active, available_seats)
SELECT month, month_index, active, available_seats
FROM (VALUES
  ('January', 1, false, 0), ('February', 2, false, 0), ('March', 3, false, 0),
  ('April', 4, false, 0), ('May', 5, false, 0), ('June', 6, false, 0),
  ('July', 7, false, 0), ('August', 8, false, 0), ('September', 9, false, 0),
  ('October', 10, false, 0), ('November', 11, false, 0), ('December', 12, false, 0)
) defaults(month, month_index, active, available_seats)
WHERE NOT EXISTS (SELECT 1 FROM public.joining_months);

CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text,
  email text,
  subject text,
  message text,
  source text DEFAULT 'website',
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
DROP POLICY IF EXISTS "leads admin read" ON public.leads;
CREATE POLICY "leads admin read" ON public.leads FOR SELECT TO authenticated
  USING (public.is_active_admin(auth.uid()));

CREATE OR REPLACE FUNCTION public.submit_lead(payload jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF coalesce(trim(payload->>'name'), '') = '' OR coalesce(trim(payload->>'message'), '') = '' THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Missing required fields.');
  END IF;
  INSERT INTO public.leads (name, phone, email, subject, message, source)
  VALUES (trim(payload->>'name'), payload->>'phone', lower(trim(coalesce(payload->>'email', ''))),
          payload->>'subject', trim(payload->>'message'), coalesce(payload->>'source', 'website'));
  RETURN jsonb_build_object('ok', true);
END;
$$;
REVOKE ALL ON FUNCTION public.submit_lead(jsonb) FROM public;
GRANT EXECUTE ON FUNCTION public.submit_lead(jsonb) TO anon, authenticated, service_role;

CREATE TABLE IF NOT EXISTS public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name text NOT NULL,
  program text,
  excerpt text NOT NULL,
  linkedin_url text,
  published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.testimonials TO anon, authenticated;
GRANT ALL ON public.testimonials TO service_role;
DROP POLICY IF EXISTS "testimonials public read" ON public.testimonials;
CREATE POLICY "testimonials public read" ON public.testimonials FOR SELECT TO anon, authenticated USING (published = true);

CREATE TABLE IF NOT EXISTS public.site_config (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
GRANT SELECT ON public.site_config TO anon, authenticated;
GRANT ALL ON public.site_config TO service_role;
DROP POLICY IF EXISTS "config public read" ON public.site_config;
CREATE POLICY "config public read" ON public.site_config FOR SELECT TO anon, authenticated USING (true);