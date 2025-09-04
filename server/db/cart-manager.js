// Cart service functions for your application
  import * as db from './index.js';
export const cartService = {
  async getUserCart(userId) {
    const result = await db.query(
      'SELECT get_or_create_user_cart($1::UUID) as cart_id',
      [userId]
    );
    return result[0]?.cart_id;
  },

  async getSessionCart(sessionId) {
    const result = await db.query(
      'SELECT get_or_create_session_cart($1) as cart_id',
      [sessionId]
    );
    return result.rows[0].cart_id;
  },

  async addToCart(cartId, productId, quantity = 1) {
    const result = await db.query(
      'SELECT * FROM add_to_cart($1::UUID, $2::UUID, $3::INTEGER)',
      [cartId, productId, quantity]
    );
    return result;
  },

  async getCartDetails(cartId) {
    const result = await db.query(
      'SELECT * FROM get_cart_details($1)',
      [cartId]
    );
    return result;
  },

  async updateCartItemQuantity(cartId, productId, variantId, newQuantity) {
    if (newQuantity <= 0) {
      return this.removeFromCart(cartId, productId, variantId);
    }
    
    await db.query(`
      UPDATE cart_items 
      SET quantity = $4, updated_at = CURRENT_TIMESTAMP
      WHERE cart_id = $1 AND product_id = $2 
        AND (product_variant_id = $3 OR (product_variant_id IS NULL AND $3 IS NULL))
    `, [cartId, productId, variantId, newQuantity]);
  },

  async removeFromCart(cartId, productId, variantId = null) {
    await db.query(`
      DELETE FROM cart_items 
      WHERE cart_id = $1 AND product_id = $2 
        AND (product_variant_id = $3 OR (product_variant_id IS NULL AND $3 IS NULL))
    `, [cartId, productId, variantId]);
  },

  async clearCart(cartId) {
    await db.query('DELETE FROM cart_items WHERE cart_id = $1', [cartId]);
  },

  async mergeGuestCartToUser(sessionId, userId) {
    const result = await db.query(`
      WITH guest_cart AS (
        SELECT id FROM carts WHERE session_id = $1 AND status = 'active'
      ),
      user_cart AS (
        SELECT get_or_create_user_cart($2) as id
      )
      UPDATE cart_items 
      SET cart_id = (SELECT id FROM user_cart)
      WHERE cart_id = (SELECT id FROM guest_cart)
      ON CONFLICT (cart_id, product_id, product_variant_id) 
      DO UPDATE SET quantity = cart_items.quantity + EXCLUDED.quantity;
      
      DELETE FROM carts WHERE session_id = $1;
    `, [sessionId, userId]);
  }
};