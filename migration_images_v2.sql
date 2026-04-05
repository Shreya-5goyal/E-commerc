-- SQL Migration Script: Production-Grade Image Upgrade
-- Targeted at existing Gusto database

-- 1. Add High-Resolution Main Image URL Column to products table
-- Using VARCHAR(2048) for long cloud-hosted URLs (S3 / Cloudinary)
ALTER TABLE product ADD COLUMN IF NOT EXISTS image_url VARCHAR(2048);

-- 2. Migrate existing 'image' data to 'image_url' (if any filename was stored)
-- UPDATE product SET image_url = image WHERE image_url IS NULL AND image IS NOT NULL;

-- 3. Create Gallery Table for Multiple Images per Product
CREATE TABLE IF NOT EXISTS product_image (
    image_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    url VARCHAR(2048) NOT NULL,
    product_id BIGINT,
    CONSTRAINT fk_product_image_product FOREIGN KEY (product_id) REFERENCES product(product_id) ON DELETE CASCADE
);
