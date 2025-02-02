// client/src/pages/shopping-view/search.jsx

import {useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { getSearchResults, clearSearchResults } from '@/store/shop/search-slice';
import {  fetchCartItems } from '@/store/shop/cart-slice';
import ShoppingProductTile from "@/components/shopping-view/product-tile";

function SearchProduct() {
  const dispatch = useDispatch();
  
  // States
  const [keyword, setKeyword] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // Selectors
  const { searchResults, isLoading, error } = useSelector(state => state.shopSearch);
  const { user } = useSelector(state => state.auth);

  // Effects
  useEffect(() => {
    const keywordFromUrl = searchParams.get('keyword');
    if (keywordFromUrl) {
      setKeyword(keywordFromUrl);
      dispatch(getSearchResults(keywordFromUrl));
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCartItems(user.id));
    }
  }, [user?.id, dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearSearchResults());
    };
  }, [dispatch]);

  return (
    <div className='container mx-auto md:px-6 px-4 py-8'>
      <div className='flex flex-col items-center gap-4 mb-8'>
        <h1 className="text-2xl font-bold">Search Products</h1>
        {/* <div className='w-full max-w-2xl'>
          <Input
            value={keyword}
            name='keyword'
            onChange={handleSearchInput}
            className='w-full border border-gray-300 rounded-md py-6 px-6 focus:outline-none focus:border-blue-500'
            type="text"
            placeholder="Search products (minimum 2 characters)..."
            disabled={isLoading}
          />
        </div> */}
      </div>

      {isLoading && (
        <div className="text-center py-4">
          <div className="animate-pulse">Searching...</div>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center mb-4 p-4 bg-red-50 rounded">
          {error}
        </div>
      )}

      {!isLoading && keyword.trim().length >= 2 && (
        <div className="text-center mb-4 text-gray-600">
          Found {searchResults?.length || 0} result{searchResults?.length !== 1 ? 's' : ''} 
          for `{keyword}`
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 cursor-pointer">
        {searchResults && searchResults.length > 0 ? (
          searchResults.map((productItem) => (
            <ShoppingProductTile
              key={productItem._id}
              product={productItem}
            />
          ))
        ) : (
          !isLoading && keyword.trim().length >= 2 && (
            <div className="col-span-full text-center text-gray-500 py-8">
              No products found matching `{keyword}`
            </div>
          )
        )}
      </div>
    </div>
  );
}

export default SearchProduct;