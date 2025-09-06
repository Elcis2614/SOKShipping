CREATE OR REPLACE FUNCTION get_cart_details(p_cart_id UUID)
RETURNS TABLE(
  item_id UUID,
  product_id UUID,
  product_title VARCHAR,
  quantity INTEGER,
  unit_price DECIMAL,
  total_price DECIMAL,
  product_image TEXT,
  in_stock BOOLEAN,
  max_quantity INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    ci.id as item_id,
    ci.product_id,
    p.title as product_title,
    ci.quantity,
    ci.unit_price,
    ci.total_price,
    pi.image_url as product_image,
    (p.total_stock >= ci.quantity) as in_stock,
    p.total_stock as max_quantity
  FROM cart_items ci
  JOIN products p ON ci.product_id = p._id
  LEFT JOIN product_images pi ON p._id = pi.product_id AND pi.is_primary = true
  WHERE ci.cart_id = p_cart_id
  ORDER BY ci.added_at;
END;
$$ LANGUAGE plpgsql;

