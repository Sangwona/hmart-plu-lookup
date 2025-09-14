-- Create produce_items table (simplified)
CREATE TABLE produce_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  plu_code TEXT NOT NULL UNIQUE,
  icon TEXT
);

-- Insert initial data
INSERT INTO produce_items (name, plu_code, icon) VALUES
('Banana', '4011', '🍌'),
('Granny Smith Apple', '4017', '🍏'),
('Organic Banana', '94011', '🍌'),
('Onion', '4082', '🧅'),
('Tomato', '4063', '🍅'),
('Cilantro', '4889', '🌿'),
('Strawberry', '4123', '🍓'),
('Carrot', '4090', '🥕');
