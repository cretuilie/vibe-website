-- Creare tabel rezervari
CREATE TABLE rezervari (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nume TEXT NOT NULL,
  email TEXT NOT NULL,
  telefon TEXT NOT NULL,
  numar_persoane INTEGER NOT NULL DEFAULT 2,
  status TEXT NOT NULL DEFAULT 'in asteptare',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Activare Row Level Security
ALTER TABLE rezervari ENABLE ROW LEVEL SECURITY;

-- Politica: oricine poate adauga, citi, modifica, sterge
CREATE POLICY "Public access" ON rezervari
  FOR ALL
  USING (true)
  WITH CHECK (true);
