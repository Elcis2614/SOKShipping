// client/src/components/admin-view/product-tile.jsx 

import React from 'react'
import { Button } from '../ui/button'
import { CardFooter } from '../ui/card'
import { CardContent } from '../ui/card'
import { Card } from '../ui/card'

function AdminProductTile({
    product,
    setFormData,
    setOpenCreateProductsDialog,
    setCurrentEditedId,
    handleDelete
  }) {
    console.log(product);
    return (
        <Card className="w-full max-w-sm mx-auto">
        <div>
            <div className="relative">
                <img
                    src={product?.image}
                    alt={product?.title}
                    className="w-full h-[300px] object-cover rounded-t-lg"
                />
            
            </div>
            
            <CardContent>
                {/* Debug: Displaying the title */}
                <h2 className="text-xl font-bold mb-2 mt-2">
                        {product?.title ? product.title : "No Title Available"}
                    </h2>
                <div className="flex justify-between items-center mb-2">
                    <span className={`${product?.salePrice > 0 ? "line-through" : ""} 
                    text-lg font-sembold text-primary`}>
                    ${product?.price}
                    </span>
                    {
                        product?.salePrice > 0 ? <span className="text-lg font-bold">${product?.salePrice}</span> : null
                    }
                </div>
            </CardContent>
            
            <CardFooter className="flex justify-between items-center">
                <Button onClick={() => {
                    setOpenCreateProductsDialog(true)
                    setCurrentEditedId(product?._id)
                    setFormData(product);
                }}>Edit</Button>
                <Button 
                    onClick={()=> handleDelete(product?._id)}
                    >
                    Delete
                </Button>
            </CardFooter>
        </div>
            
        </Card>
    )
}

export default AdminProductTile;
