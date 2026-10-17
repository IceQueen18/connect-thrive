CREATE TYPE public.app_role AS ENUM ('admin','organization','business');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT, INSERT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.has_any_role(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id)
$$;

CREATE POLICY "Users read own roles" ON public.user_roles FOR SELECT TO authenticated
  USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Users pick one non-admin role" ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND role IN ('organization','business') AND NOT public.has_any_role(auth.uid()));

-- Organization assessments
CREATE TABLE public.org_assessments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id uuid NOT NULL,
  org_name text NOT NULL,
  title text NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  readiness_score int NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'published',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.org_assessments TO authenticated;
GRANT ALL ON public.org_assessments TO service_role;
ALTER TABLE public.org_assessments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner manages assessments" ON public.org_assessments FOR ALL TO authenticated
  USING (owner_id = auth.uid()) WITH CHECK (owner_id = auth.uid() AND public.has_role(auth.uid(),'organization'));
CREATE POLICY "Signed-in users read published needs" ON public.org_assessments FOR SELECT TO authenticated
  USING (status <> 'draft');
CREATE POLICY "Admins manage assessments" ON public.org_assessments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.is_assessment_owner(_aid uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.org_assessments WHERE id = _aid AND owner_id = auth.uid())
$$;

-- Business proposals (business assessments). Inserted only by the server so the score can't be faked.
CREATE TABLE public.proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES public.org_assessments(id) ON DELETE CASCADE,
  business_id uuid NOT NULL,
  business_name text NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}'::jsonb,
  match_score int NOT NULL DEFAULT 0,
  score_breakdown jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'submitted',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (assessment_id, business_id)
);
GRANT SELECT, UPDATE ON public.proposals TO authenticated;
GRANT ALL ON public.proposals TO service_role;
ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Business reads own proposals" ON public.proposals FOR SELECT TO authenticated
  USING (business_id = auth.uid());
CREATE POLICY "Org owner reads proposals" ON public.proposals FOR SELECT TO authenticated
  USING (public.is_assessment_owner(assessment_id));
CREATE POLICY "Org owner updates proposal status" ON public.proposals FOR UPDATE TO authenticated
  USING (public.is_assessment_owner(assessment_id)) WITH CHECK (public.is_assessment_owner(assessment_id));
CREATE POLICY "Admins manage proposals" ON public.proposals FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin')) WITH CHECK (public.has_role(auth.uid(),'admin'));

-- Projects: handoff workspace after selection
CREATE TABLE public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL UNIQUE REFERENCES public.org_assessments(id) ON DELETE CASCADE,
  proposal_id uuid NOT NULL REFERENCES public.proposals(id) ON DELETE CASCADE,
  org_owner_id uuid NOT NULL,
  business_id uuid NOT NULL,
  implementation_doc text NOT NULL DEFAULT '',
  checklist jsonb NOT NULL DEFAULT '[]'::jsonb,
  knowledge_base text NOT NULL DEFAULT '',
  org_confirmed_at timestamptz,
  business_confirmed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.projects TO authenticated;
GRANT ALL ON public.projects TO service_role;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Participants read projects" ON public.projects FOR SELECT TO authenticated
  USING (org_owner_id = auth.uid() OR business_id = auth.uid() OR public.has_role(auth.uid(),'admin'));
CREATE POLICY "Org owner creates project" ON public.projects FOR INSERT TO authenticated
  WITH CHECK (org_owner_id = auth.uid() AND public.is_assessment_owner(assessment_id));
CREATE POLICY "Participants update projects" ON public.projects FOR UPDATE TO authenticated
  USING (org_owner_id = auth.uid() OR business_id = auth.uid())
  WITH CHECK (org_owner_id = auth.uid() OR business_id = auth.uid());

-- Each side may only set its own confirmation; any content change clears both confirmations.
CREATE OR REPLACE FUNCTION public.guard_project_update()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  NEW.org_owner_id := OLD.org_owner_id;
  NEW.business_id := OLD.business_id;
  NEW.assessment_id := OLD.assessment_id;
  NEW.proposal_id := OLD.proposal_id;
  IF auth.uid() IS NOT NULL AND auth.uid() <> OLD.org_owner_id THEN
    NEW.org_confirmed_at := OLD.org_confirmed_at;
  END IF;
  IF auth.uid() IS NOT NULL AND auth.uid() <> OLD.business_id THEN
    NEW.business_confirmed_at := OLD.business_confirmed_at;
  END IF;
  IF NEW.implementation_doc IS DISTINCT FROM OLD.implementation_doc
     OR NEW.checklist IS DISTINCT FROM OLD.checklist
     OR NEW.knowledge_base IS DISTINCT FROM OLD.knowledge_base THEN
    NEW.org_confirmed_at := NULL;
    NEW.business_confirmed_at := NULL;
  END IF;
  NEW.updated_at := now();
  IF NEW.org_confirmed_at IS NOT NULL AND NEW.business_confirmed_at IS NOT NULL THEN
    UPDATE public.org_assessments SET status = 'completed', updated_at = now() WHERE id = NEW.assessment_id;
  ELSE
    UPDATE public.org_assessments SET status = 'in_progress', updated_at = now() WHERE id = NEW.assessment_id AND status = 'completed';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER projects_guard BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.guard_project_update();