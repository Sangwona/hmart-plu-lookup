-- Create produce_items table (simplified)
CREATE TABLE produce_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  plu_code TEXT NOT NULL UNIQUE,
  description TEXT
);

-- Insert initial data
INSERT INTO produce_items (name, plu_code, description) VALUES
('Banana', '4011', ''),
('Granny Smith Apple', '4017', ''),
('Organic Banana', '4012', ''),
('Onion', '4082', 'white'),
('Tomato', '4063', 'vine'),
('Cilantro', '4889', ''),
('Carrot', '4090', '');
('Orange', '1232', '');
('Strawberry', '4123', ''),
