CREATE OR REPLACE FUNCTION migrate_product_images()
RETURNS INTEGER AS $$
DECLARE
    product_record RECORD;
    image_url TEXT;
    image_index INTEGER;
    total_migrated INTEGER := 0;
BEGIN
    FOR product_record IN
        SELECT _id, title, images
        FROM products
        WHERE images IS NOT NULL
            AND  array_length(images, 1) > 0
    LOOP
        image_index := 0;

        FOREACH image_url IN ARRAY product_record.images
        LOOP
            IF image_url IS NOT NULL AND trim(image_url) != '' THEN
                INSERT INTO product_images (
                    product_id,
                    image_url,
                    alt_text,
                    display_order,
                    is_primary
                ) VALUES (
                    product_record._id,
                    trim(image_url),
                    product_record.title || ' - Image ' || (image_index + 1),
                    image_index,
                    image_index = 0
                )
                ON CONFLICT DO NOTHING;

                total_migrated := total_migrated + 1;
            END IF;

            image_index := image_index + 1;
        END LOOP;
    END LOOP;

    RETURN total_migrated;
END;
$$ LANGUAGE plpgsql;

SELECT migrate_product_images() as images_migrated;

CREATE UNIQUE INDEX IF NOT EXISTS idx_product_primary_image
ON product_images (product_id)
WHERE is_primaRy = true;