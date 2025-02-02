
// server/controllers/shop/search-controller.js
import Product from '../../models/Product.js';
import * as db from '../../db/index.js'

export const searchProducts = async (req, res) => {
  try {
    //const keyword = req.params.keyword?.trim();
    // const keyword = req.params.keyword;

    // if (!keyword) {
    //   return res.status(200).json({
    //     success: true,
    //     data: []
    //   });
    // }

    

   // Create a more flexible search pattern
   const searchPattern = req.params.keyword || "";
   console.log('Searching with keyword:', searchPattern);

   // Expanded search criteria
  //  const products = await Product.find({
  //    $or: [
  //      { title: { $regex: searchPattern } },
  //      { description: { $regex: searchPattern } },
  //      { brand: { $regex: searchPattern } },
  //      { category: { $regex: searchPattern } }
  //    ]
  //  }).lean();
  const query = 'SELECT * FROM search_products($1)'
  const products = await db.query(query, [searchPattern]);


    // Transform the products to ensure proper image URLs
    // const transformedProducts = products.map(product => ({
    //   ...product,
    //   image: product.image?.replace('http://', 'https://') || '',
    //   price: Number(product.price),
    //   salePrice: product.salePrice ? Number(product.salePrice) : null,
    //   totalStock: Number(product.totalStock || 0)
    // }));

    //console.log(`Search results for "${searchPattern}":`, products);
    
    // Log sample of matches for debugging
    //if (transformedProducts.length > 0) {
    //  console.log('Sample matches:', transformedProducts.slice(0, 2).map(p => ({
    //    title: p.title,
    //    description: p.description,
    //    brand: p.brand,
    //    category: p.category
    //  })));
    //}

    return res.status(200).json({
      success: true,
      data: products,
      searchMetadata: {
        searchPattern,
        totalResults: products.length,
        fields: ['title', 'description', 'brand', 'category']
      }
    });
    
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error searching products',
      error: error.message
    });
  }
};