-- Fix RLS policies for disciplina and turmas tables to allow authenticated users to read them

-- Enable RLS on disciplina table and add SELECT policy for authenticated users
ALTER TABLE public.disciplina ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read disciplinas"
ON public.disciplina
FOR SELECT
TO authenticated
USING (true);

-- Enable RLS on turmas table and add SELECT policy for authenticated users  
ALTER TABLE public.turmas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read turmas"
ON public.turmas
FOR SELECT
TO authenticated
USING (true);

-- Enable RLS on horarios table and add SELECT policy for authenticated users
ALTER TABLE public.horarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read horarios"
ON public.horarios
FOR SELECT
TO authenticated
USING (true);

-- Add policies for administrators to manage disciplinas
CREATE POLICY "Allow administrators to manage disciplinas"
ON public.disciplina
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.administrador a
    WHERE a.email = auth.jwt() ->> 'email'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.administrador a
    WHERE a.email = auth.jwt() ->> 'email'
  )
);

-- Add policies for administrators to manage turmas
CREATE POLICY "Allow administrators to manage turmas"
ON public.turmas
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.administrador a
    WHERE a.email = auth.jwt() ->> 'email'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.administrador a
    WHERE a.email = auth.jwt() ->> 'email'
  )
);

-- Add policies for administrators to manage horarios
CREATE POLICY "Allow administrators to manage horarios"
ON public.horarios
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.administrador a
    WHERE a.email = auth.jwt() ->> 'email'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.administrador a
    WHERE a.email = auth.jwt() ->> 'email'
  )
);