
-- ROLES
CREATE TYPE public.app_role AS ENUM ('admin', 'staff');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own roles readable" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','staff'));
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- PROGRAMS
CREATE TABLE public.programs (
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
GRANT SELECT ON public.programs TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.programs TO authenticated;
GRANT ALL ON public.programs TO service_role;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "programs public read" ON public.programs FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "programs staff write" ON public.programs FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER programs_updated BEFORE UPDATE ON public.programs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- JOINING MONTHS
CREATE TABLE public.joining_months (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  month text NOT NULL UNIQUE,
  month_index int NOT NULL,
  active boolean NOT NULL DEFAULT false,
  available_seats int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.joining_months TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.joining_months TO authenticated;
GRANT ALL ON public.joining_months TO service_role;
ALTER TABLE public.joining_months ENABLE ROW LEVEL SECURITY;
CREATE POLICY "months public read" ON public.joining_months FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "months staff write" ON public.joining_months FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER months_updated BEFORE UPDATE ON public.joining_months FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ADMISSIONS
CREATE TABLE public.admissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id text NOT NULL UNIQUE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  whatsapp text,
  date_of_birth date,
  college text NOT NULL,
  degree text,
  department text,
  current_year text,
  graduation_year text,
  domain text NOT NULL,
  custom_domain text,
  preferred_mode text,
  joining_month text,
  preferred_session text,
  source text,
  status text NOT NULL DEFAULT 'New',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE ON public.admissions TO authenticated;
GRANT ALL ON public.admissions TO service_role;
ALTER TABLE public.admissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admissions staff read" ON public.admissions FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "admissions staff update" ON public.admissions FOR UPDATE TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER admissions_updated BEFORE UPDATE ON public.admissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE INDEX admissions_created_idx ON public.admissions (created_at DESC);

-- guarded public submission (no public read access to the table itself)
CREATE OR REPLACE FUNCTION public.submit_admission(payload jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_email text := lower(trim(payload->>'email'));
  v_phone text := regexp_replace(coalesce(payload->>'phone',''), '\D', '', 'g');
  v_domain text := trim(payload->>'domain');
  v_app_id text;
  v_existing public.admissions%ROWTYPE;
BEGIN
  IF v_email IS NULL OR v_email = '' OR v_phone = '' OR coalesce(v_domain,'') = ''
     OR coalesce(trim(payload->>'full_name'),'') = '' OR coalesce(trim(payload->>'college'),'') = '' THEN
    RETURN jsonb_build_object('ok', false, 'code', 'invalid', 'message', 'Missing required fields.');
  END IF;

  SELECT * INTO v_existing FROM public.admissions
   WHERE domain = v_domain
     AND (lower(email) = v_email OR regexp_replace(phone, '\D', '', 'g') = v_phone)
     AND created_at > now() - interval '30 days'
   LIMIT 1;

  IF FOUND THEN
    RETURN jsonb_build_object('ok', false, 'code', 'duplicate',
      'message', 'We already received an application using these details. Our admissions team will contact you.');
  END IF;

  v_app_id := 'ORV-' || to_char(now(), 'YYYY') || '-' || lpad((floor(random()*90000)+10000)::int::text, 5, '0');

  INSERT INTO public.admissions (
    application_id, full_name, email, phone, whatsapp, date_of_birth, college, degree, department,
    current_year, graduation_year, domain, custom_domain, preferred_mode, joining_month,
    preferred_session, source
  ) VALUES (
    v_app_id, trim(payload->>'full_name'), v_email, payload->>'phone', payload->>'whatsapp',
    NULLIF(payload->>'date_of_birth','')::date, trim(payload->>'college'), payload->>'degree',
    payload->>'department', payload->>'current_year', payload->>'graduation_year', v_domain,
    payload->>'custom_domain', payload->>'preferred_mode', payload->>'joining_month',
    payload->>'preferred_session', payload->>'source'
  );

  RETURN jsonb_build_object('ok', true, 'application_id', v_app_id);
END; $$;
REVOKE ALL ON FUNCTION public.submit_admission(jsonb) FROM public;
GRANT EXECUTE ON FUNCTION public.submit_admission(jsonb) TO anon, authenticated, service_role;

-- LEADS
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text,
  email text,
  subject text,
  message text,
  source text DEFAULT 'website',
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.leads TO authenticated;
GRANT ALL ON public.leads TO service_role;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
CREATE POLICY "leads staff read" ON public.leads FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));

CREATE OR REPLACE FUNCTION public.submit_lead(payload jsonb)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF coalesce(trim(payload->>'name'),'') = '' OR coalesce(trim(payload->>'message'),'') = '' THEN
    RETURN jsonb_build_object('ok', false, 'message', 'Missing required fields.');
  END IF;
  INSERT INTO public.leads (name, phone, email, subject, message, source)
  VALUES (trim(payload->>'name'), payload->>'phone', lower(trim(coalesce(payload->>'email',''))),
          payload->>'subject', trim(payload->>'message'), coalesce(payload->>'source','website'));
  RETURN jsonb_build_object('ok', true);
END; $$;
REVOKE ALL ON FUNCTION public.submit_lead(jsonb) FROM public;
GRANT EXECUTE ON FUNCTION public.submit_lead(jsonb) TO anon, authenticated, service_role;

-- TESTIMONIALS
CREATE TABLE public.testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name text NOT NULL,
  program text,
  excerpt text NOT NULL,
  linkedin_url text,
  published boolean NOT NULL DEFAULT true,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.testimonials TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.testimonials TO authenticated;
GRANT ALL ON public.testimonials TO service_role;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "testimonials public read" ON public.testimonials FOR SELECT TO anon, authenticated USING (published = true);
CREATE POLICY "testimonials staff all" ON public.testimonials FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

-- SITE CONFIG
CREATE TABLE public.site_config (
  key text PRIMARY KEY,
  value text NOT NULL DEFAULT '',
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.site_config TO anon;
GRANT SELECT, INSERT, UPDATE ON public.site_config TO authenticated;
GRANT ALL ON public.site_config TO service_role;
ALTER TABLE public.site_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY "config public read" ON public.site_config FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "config staff write" ON public.site_config FOR ALL TO authenticated
  USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

INSERT INTO public.site_config (key, value) VALUES
  ('contact_phone', '+91 9663472640'),
  ('contact_email', 'info@orvionar.in'),
  ('whatsapp_number', '919663472640'),
  ('linkedin_url', 'https://www.linkedin.com/company/orvionar'),
  ('lms_url', 'https://teachmint.com'),
  ('stipend_active', 'false'),
  ('stipend_text', 'Performance-based stipend: ₹12,000–₹15,000'),
  ('admission_deadline', ''),
  ('trust_note', 'Credentials and certifications may vary by program and eligibility. Verify applicable details with ORVIONAR before enrollment.');

INSERT INTO public.joining_months (month, month_index, active, available_seats) VALUES
  ('January',1,false,0),('February',2,false,0),('March',3,false,0),('April',4,false,0),
  ('May',5,false,0),('June',6,false,0),('July',7,false,0),('August',8,true,25),
  ('September',9,true,25),('October',10,true,25),('November',11,false,0),('December',12,false,0);

INSERT INTO public.programs (slug, name, category, description, skills, sort_order) VALUES
 ('full-stack-web-development','Full Stack Web Development','Technology','Build complete web applications across frontend and backend.','{HTML/CSS,JavaScript,React,Node.js,Databases}',1),
 ('artificial-intelligence-machine-learning','Artificial Intelligence & Machine Learning','Technology','Work with Python, ML fundamentals and applied AI projects.','{Python,"Machine Learning","Model Building","Data Preprocessing"}',2),
 ('data-science','Data Science','Data','Turn raw data into insights using statistics and Python.','{Python,Statistics,Pandas,Visualization}',3),
 ('devops','DevOps','Technology','Learn build, deployment and automation practices.','{Linux,Git,CI/CD,Docker}',4),
 ('software-testing','Software Testing','Technology','Manual and automation testing fundamentals.','{"Test Cases",Selenium,"Bug Reporting"}',5),
 ('python-with-power-bi','Python with Power BI','Data','Combine Python with business intelligence dashboards.','{Python,"Power BI",DAX,Dashboards}',6),
 ('data-analytics','Data Analytics','Data','Analyse and present data for business decisions.','{Excel,SQL,"Power BI",Reporting}',7),
 ('cyber-security','Cyber Security','Technology','Security fundamentals and practical defensive skills.','{Networking,"Ethical Hacking","Security Tools"}',8),
 ('embedded-systems','Embedded Systems','Core / Engineering','Microcontroller programming and hardware interfacing.','{C,Microcontrollers,Sensors}',9),
 ('digital-marketing','Digital Marketing','Business','Practical digital campaigns, SEO and social media.','{SEO,"Social Media",Analytics,Ads}',10),
 ('business-growth-specialist','Business Growth Specialist','Business','Growth strategy, sales and market research skills.','{"Market Research",Sales,Strategy}',11),
 ('human-resource-management','Human Resource Management','Management','Recruitment, HR operations and people practices.','{Recruitment,"HR Operations",Payroll}',12),
 ('ar-vr','Augmented Reality / Virtual Reality','Technology','Build immersive AR/VR experiences.','{Unity,3D,"AR/VR SDKs"}',13),
 ('cloud-computing','Cloud Computing','Technology','Cloud fundamentals, deployment and services.','{Cloud,Linux,Deployment,Networking}',14),
 ('ui-ux','UI/UX','Design','Design usable, attractive digital product interfaces.','{Figma,Wireframing,Prototyping,"User Research"}',15),
 ('finance-tally','Finance & Tally','Business','Accounting fundamentals with Tally practice.','{Accounting,Tally,GST}',16),
 ('medical-coding','Medical Coding','Healthcare','Clinical documentation and medical coding standards.','{"ICD Coding",Terminology,Compliance}',17),
 ('data-structures-algorithms','Data Structures & Algorithms','Technology','Strengthen problem solving for technical interviews.','{Arrays,Trees,Graphs,"Problem Solving"}',18),
 ('python-programming','Python Programming Language','Technology','Core Python programming from basics to projects.','{Python,OOP,Scripting}',19),
 ('autocad','AutoCAD','Core / Engineering','2D/3D drafting and design fundamentals.','{Drafting,"2D Design","3D Modelling"}',20),
 ('iot-robotics','IoT & Robotics','Core / Engineering','Connected devices, sensors and robotics basics.','{IoT,Sensors,Arduino,Automation}',21),
 ('business-analyst','Business Analyst','Business','Requirements, analysis and stakeholder communication.','{Requirements,SQL,Documentation}',22),
 ('vlsi','VLSI','Core / Engineering','Digital design and VLSI design flow fundamentals.','{Verilog,"Digital Design",Simulation}',23),
 ('clinical-trials-research','Clinical Trials & Research','Healthcare','Clinical research processes and regulatory basics.','{"Clinical Research",Regulatory,Documentation}',24),
 ('other','Other','Technology','Not listed? Tell us the domain you want to learn.','{Custom}',25);
