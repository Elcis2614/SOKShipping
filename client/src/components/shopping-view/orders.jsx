// client/src/components/shopping-view/orders.jsx 

import React, { useEffect, useState } from 'react'

import { CardTitle} from '../ui/card'
import { CardContent } from '../ui/card'
import { Card } from '../ui/card'
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"
import { CardHeader } from '../ui/card'
import { Button } from '../ui/button'
import { Dialog } from '../ui/dialog'
import { DialogTrigger } from '../ui/dialog'
import { DialogContent } from '../ui/dialog'
import ShoppingOrderDetailsView from './order-details'
import { useDispatch, useSelector } from 'react-redux'
import { getAllOrdersByUserId, getOrderDetails, resetOrderDetails } from '@/store/shop/order-slice'
import { Badge } from '../ui/badge'
import { Loader2Icon } from 'lucide-react'
  

function ShoppingOrders() {

    const [openDetailsDialog, setOpenDetailsDialog ] = useState(false);
    const dispatch = useDispatch();
    const {user} = useSelector((state)=> state.auth );
    const { orderList, orderDetails, isLoading, error } = useSelector((state) => state.shopOrder);
    
    
    useEffect(() => {
        console.log('User ID:', user?.id);
        if (user?.id) {
            dispatch(getAllOrdersByUserId(user.id));
        }
    }, [dispatch, user?.id]);  // Add user.id as a dependency
    

    useEffect(() => {
        console.log('orderDetails updated:', orderDetails);
    }, [ orderDetails]);
    
    
    useEffect(()=> {
        if(orderDetails !== null) setOpenDetailsDialog(true);  
    },[orderDetails])
    
    function handleFetchOrderDetails(getId) {
        dispatch(getOrderDetails(getId));
        setOpenDetailsDialog(true);  
    }
 
    
    return (
        <Card>
            <CardHeader>
                <CardTitle> Order history </CardTitle>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Order ID</TableHead>
                            <TableHead>Order Date</TableHead>
                            <TableHead>Order Status</TableHead>
                            <TableHead>Order Price</TableHead>
                            <TableHead>
                                <span className='sr-only'>Details</span>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {
                        orderList && orderList.length > 0 ? (
                            orderList.map(orderItem => (
                                <TableRow key={orderItem._id}>
                                    <TableCell>{orderItem?._id}</TableCell>
                                    <TableCell>{new Date(orderItem?.orderDate).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <Badge className={`py-1 px-3 ${
                                        orderItem?.orderStatus === 'confirmed' ? 'bg-green-500' 
                                        : orderItem?.orderStatus === 'rejected' ? 'bg-red-600'
                                        : 'bg-black'}`}>
                                            {orderItem?.orderStatus}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>${orderItem?.totalAmount}</TableCell>
                                    <TableCell>
                                        <Dialog 
                                            open={openDetailsDialog} 
                                            onOpenChange={(open) => {
                                                if (!open) {
                                                    setOpenDetailsDialog(false);
                                                    dispatch(resetOrderDetails());
                                                }}
                                            }
                                            >
                                            <DialogTrigger asChild>
                                                <Button onClick={() => handleFetchOrderDetails(orderItem._id)}
                                                >
                                                View Details
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                {isLoading && 
                                                    <div className="flex justify-center items-center h-full">
                                                        <Loader2Icon className="animate-spin h-8 w-8" />
                                                    </div>
                                                    }
                                                {error && <p>Error: {error}</p>}
                                                {!isLoading && !error && orderDetails &&
                                                    <ShoppingOrderDetailsView orderDetails={orderDetails} />
                                                }
                                            </DialogContent>
                                        </Dialog>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5}>No orders found.</TableCell>
                            </TableRow>
                        )}

                    </TableBody>
                    
                </Table>
            </CardContent>
        </Card>
    )
}

export default ShoppingOrders
