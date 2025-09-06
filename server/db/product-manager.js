import * as db from './index.js';

export const productService = {
    async getProducts(options = {}){
     const {
      category = null,
      brand = null,
      limit = 20,
      offset = 0,
      inStockOnly = true
    } = options;


    const query = `
      SELECT 
        p._id,
        p.title,
        p.price,
        p.sale_price as salePrice,
        p.total_stock as totalStock,
        p.is_featured,
        pi.image_url as primary_image,
        pi.alt_text as primary_image_alt,
        -- Calculate discount percentage
        CASE 
          WHEN p.sale_price IS NOT NULL AND p.sale_price < p.price THEN
            ROUND(((p.price - p.sale_price) / p.price * 100)::NUMERIC, 0)
          ELSE 0
        END as discount_percentage
      FROM products p
      LEFT JOIN product_images pi ON p._id = pi.product_id AND pi.is_primary = true
      WHERE p.is_active = true
        AND ($1::TEXT IS NULL OR p.category = $1)
        AND ($2::TEXT IS NULL OR p.brand = $2)
        AND ($5::BOOLEAN = false OR p.total_stock > 0)
      ORDER BY 
        p.is_featured DESC,
        p.created_at DESC
      LIMIT $3 OFFSET $4
    `;

    const result = await db.query(query, [category, brand, limit, offset, inStockOnly]);
    return result;
    },
    async getProductById(id){
        const qText = `
          SELECT p._id, p.title, p.description, p.category, p.brand, p.price, p.sale_price,
              p.total_stock, p.is_active, p.is_featured, p.created_at, p.updated_at,
              COALESCE(
                JSON_AGG(
                  JSON_BUILD_OBJECT(
                    'id', pi.id,
                    'url', pi.image_url,
                    'alt_text', pi.alt_text,
                    'is_primary', pi.is_primary,
                    'display_order', pi.display_order
                  )  ORDER BY pi.display_order, pi.is_primary DESC
                )  FILTER (WHERE pi.id is NOT NULL),
                  '[]'::json
              )  as images
          FROM products p
          LEFT JOIN product_images pi ON p._id = pi.product_id
          WHERE p._id=$1 AND p.is_active = true
          GROUP BY p._id;
        `;
        const result = await db.query(qText, [id]);
        //const product = await db.query(qText, [id]);
        return result;
    },
    async insertProduct({ images, title, description, category, price, salePrice, totalStock, tags }) {
    const queryTxt = `INSERT INTO products(title, description, category, price, "salePrice", images, tags)
    VALUES ($1,$2,$3,$4,$5,$6,$7)`;
    const result = await db.query(queryTxt, [title, description, category, price, salePrice, [...images], [...tags]]);
    return result;
},
    async updateProduct({ images, title, description, category, price, salePrice, totalStock, tags }, id){
    const queryTxt = 'UPDATE products set title=$1, description=$2, category=$3, price=$4, "salePrice"=$5, images=$6, tags=$7 WHERE _id=$8';
    const result = await db.query(queryTxt, [title, description, category, price, salePrice, [...images], [...tags], id]);
    return result;
},
    async deleteProductById(id){
    const queryTxt = 'DELETE FROM products where _id=$1';
    const result = await db.query(queryTxt, [id]);
    return result;
}
}