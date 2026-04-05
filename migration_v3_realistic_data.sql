-- GUSTO PRODUCTION DATA MIGRATION V3 (FINAL SCHEMA SYNC)
-- Clean, Production-Ready Seed Script

-- ── 1. ELECTRONICS ──
INSERT INTO product (product_name, brand, description, price, discount, special_price, quantity, image_url, category_id) VALUES
('iPhone 15 Pro', 'Apple', 'A17 Pro chip, Titanium design.', 134900, 5, 128155, 25, 'https://images.unsplash.com/photo-1695048133142-1a20484d251e', 1),
('MacBook Air M3', 'Apple', 'Think thin, think fast.', 114900, 8, 105708, 15, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8', 1),
('Sony WH-1000XM5', 'Sony', 'Experience the music.', 29990, 15, 25491, 50, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e', 1),
('Samsung S24 Ultra', 'Samsung', 'AI-powered mobile experience.', 129999, 10, 116999, 30, 'https://images.unsplash.com/photo-1707064975005-77b319aa536b', 1);

-- ── 2. FASHION ──
INSERT INTO product (product_name, brand, description, price, discount, special_price, quantity, image_url, category_id) VALUES
('Air Jordan 1 Low', 'Nike', 'Legendary basketball style.', 8995, 0, 8995, 120, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', 2),
('Adidas Ultraboost', 'Adidas', 'EPIC ENERGY. LIGHTEST EVER.', 18999, 30, 13299, 85, 'https://images.unsplash.com/photo-1587563871167-1ee9c731aefb', 2),
('Levi\'s 501 Original', 'Levi\'s', 'The blueprint for every jean.', 6599, 15, 5609, 200, 'https://images.unsplash.com/photo-1542272604-12cd17424036', 2);

-- ── 3. SPORTS ──
INSERT INTO product (product_name, brand, description, price, discount, special_price, quantity, image_url, category_id) VALUES
('Spalding NBA Ball', 'Spalding', 'Official NBA game ball.', 7999, 5, 7599, 45, 'https://images.unsplash.com/photo-1546519638-68e109498ffc', 4),
('Wilson Tennis Racket', 'Wilson', 'Precision and control strike.', 19999, 12, 17599, 20, 'https://images.unsplash.com/photo-1621570222718-d7b6892e8669', 4);

-- ── 4. BEAUTY ──
INSERT INTO product (product_name, brand, description, price, discount, special_price, quantity, image_url, category_id) VALUES
('Sauvage Elixir', 'Dior', 'A concentrated fragrance.', 14500, 5, 13775, 55, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30', 5);
