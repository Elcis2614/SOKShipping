-- Get or create active cart for user
CREATE OR REPLACE FUNCTION get_or_create_user_cart(p_user_id UUID)
RETURNS UUID AS $$
DECLARE
  cart_id UUID;
BEGIN
  -- Try to get existing active cart
  SELECT id INTO cart_id 
  FROM carts 
  WHERE user_id = p_user_id AND status = 'active'
  LIMIT 1;
  
  -- Create new cart if none exists
  IF cart_id IS NULL THEN
    INSERT INTO carts (user_id, expires_at)
    VALUES (p_user_id, CURRENT_TIMESTAMP + INTERVAL '30 days')
    RETURNING id INTO cart_id;
  END IF;
  
  RETURN cart_id;
END;
$$ LANGUAGE plpgsql;

-- Get or create cart for guest session
CREATE OR REPLACE FUNCTION get_or_create_session_cart(p_session_id VARCHAR)
RETURNS UUID AS $$
DECLARE
  cart_id UUID;
BEGIN
  SELECT id INTO cart_id 
  FROM carts 
  WHERE session_id = p_session_id AND status = 'active'
  LIMIT 1;
  
  IF cart_id IS NULL THEN
    INSERT INTO carts (session_id, expires_at)
    VALUES (p_session_id, CURRENT_TIMESTAMP + INTERVAL '7 days')
    RETURNING id INTO cart_id;
  END IF;
  
  RETURN cart_id;
END;
$$ LANGUAGE plpgsql;

-- Add item to cart (upsert)
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
  WHERE cart_id = p_cart_id 
    AND product_id = p_product_id 
    AND (product_variant_id = p_variant_id OR (product_variant_id IS NULL AND p_variant_id IS NULL));
  
  current_cart_qty := COALESCE(current_cart_qty, 0);
  
  -- Check if total quantity would exceed stock
  IF (current_cart_qty + p_quantity) > current_stock THEN
    RETURN QUERY SELECT false, 'Insufficient stock available';
    RETURN;
  END IF;
  
  -- Insert or update cart item
  INSERT INTO cart_items (cart_id, product_id, product_variant_id, quantity, unit_price)
  SELECT p_cart_id, p_product_id, p_variant_id, p_quantity, 
         COALESCE(p.sale_price, p.price)
  FROM products p 
  WHERE p.id = p_product_id
  ON CONFLICT (cart_id, product_id, product_variant_id) 
  DO UPDATE SET 
    quantity = cart_items.quantity + p_quantity,
    updated_at = CURRENT_TIMESTAMP;
  
  -- Update cart timestamp
  UPDATE carts SET updated_at = CURRENT_TIMESTAMP WHERE id = p_cart_id;
  
  RETURN QUERY SELECT true, 'Item added to cart successfully';
END;
$$ LANGUAGE plpgsql;