CREATE OR REPLACE FUNCTION add_to_cart(
  p_cart_id UUID,
  p_product_id UUID,
  p_quantity INTEGER DEFAULT 1
)
RETURNS TABLE(success BOOLEAN, message TEXT) AS $$
DECLARE
  current_stock INTEGER;
  current_cart_qty INTEGER := 0;
BEGIN
  -- Check product stock
  SELECT total_stock INTO current_stock 
  FROM products 
  WHERE id = p_product_id AND is_active = true;
  
  IF current_stock IS NULL THEN
    RETURN QUERY SELECT false, 'Product not found or inactive';
    RETURN;
  END IF;
  
  -- Get current quantity in cart
  SELECT quantity INTO current_cart_qty
  FROM cart_items
  WHERE cart_id = p_cart_id;
  
  current_cart_qty := COALESCE(current_cart_qty, 0);
  
  -- Check if total quantity would exceed stock
  IF (current_cart_qty + p_quantity) > current_stock THEN
    RETURN QUERY SELECT false, 'Insufficient stock available';
    RETURN;
  END IF;
  
  -- Insert or update cart item
  INSERT INTO cart_items (cart_id, product_id, quantity, unit_price)
  SELECT p_cart_id, p_product_id, p_quantity, 
         COALESCE(p.sale_price, p.price)
  FROM products p 
  WHERE p.id = p_product_id
  ON CONFLICT (cart_id, product_id) 
  DO UPDATE SET 
    quantity = cart_items.quantity + p_quantity,
    updated_at = CURRENT_TIMESTAMP;
  
  -- Update cart timestamp
  UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = p_cart_id;
  
  RETURN QUERY SELECT true, 'Item added to cart successfully';
END;
$$ LANGUAGE plpgsql;
