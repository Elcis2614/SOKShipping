// client/src/components/admin-view/product-tile.jsx 

import React, { useState } from 'react'
import { deleteProduct } from '@/store/admin/products-slice';
import { fetchAllProducts } from '@/store/admin/products-slice';
import { toast } from 'react-toastify';
import { Button } from '../ui/button'
import { CardFooter } from '../ui/card'
import { CardContent } from '../ui/card'
import { Card } from '../ui/card'
import { 
    Sheet,
    SheetTrigger} from '../ui/sheet'
import { AlertDialog } from '../ui/alert_dialog'
import { useDispatch} from 'react-redux';

function AdminProductTile({
    product,
    setFormData,
    setOpenCreateProductsDialog,
    setCurrentEditedId,
}) {
    const dispatch = useDispatch();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    async function handleDelete(productId) {
    setIsLoading(true);
    if(productId){
        await dispatch(deleteProduct(productId)).then(data => {
        if (data?.payload?.success) {
            toast("Product Deleted");
            setIsDialogOpen(false);
            dispatch(fetchAllProducts());
        }
        });
    }
    setIsLoading(false);
    }

    return (
        <Card className="w-full max-w-sm mx-auto">
            <div>
                <div className="relative">
                    <img
                        src={product?.images[0]}
                        alt={product?.title}
                        className="w-full h-[300px] object-cover rounded-t-lg"
                    />

                </div>

                <CardContent>
                    {/* Debug: Displaying the title */}
                    <h2 className="text-xl font-bold mb-2 mt-2">
                        {product?.title ? product.title : "No Title Available"}
                    </h2>

                    {
                        product?.salePrice !== product?.price ?
                            <div className="flex justify-between items-center mb-2">
                                <span className={"line-through text-lg font-semibold text-primary"}>
                                    ${product?.price}
                                </span>
                                <span className="text-lg font-bold">
                                    ${product?.salePrice}
                                </span>
                            </div> :
                            <div className="flex justify-end items-center mb-2">
                                <span className={"text-lg font-bold"}>
                                    ${product?.price}
                                </span>
                            </div>
                    }
                </CardContent>

                <CardFooter className="flex justify-between items-center">
                    <Button disabled={isLoading} onClick={() => {
                        setOpenCreateProductsDialog(true)
                        setCurrentEditedId(product?._id)
                        setFormData(product);
                    }}>Edit</Button>
                    <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}   >
                        <SheetTrigger>
                            <Button disabled={isLoading}>
                                Delete
                            </Button>
                        </SheetTrigger>
                        <AlertDialog 
                            title={"Delete Product"}
                            handleCLick={() => {handleDelete(product?._id)}}
                            isLoading={isLoading}
                        />
                    </Sheet>
                </CardFooter>
            </div>

        </Card>
    )
}


export default AdminProductTile;
