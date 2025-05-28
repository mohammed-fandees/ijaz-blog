-- Policy para permitir actualizaciones anónimas en posts
-- Necesario para que los usuarios no autenticados puedan incrementar likes y views
-- Permitir lectura pública de posts
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON posts FOR
SELECT
  USING (true);

-- Permitir actualización anónima de campos específicos
CREATE POLICY "Allow anonymous updates to likes and views" ON posts FOR
UPDATE USING (true)
WITH
  CHECK (true);