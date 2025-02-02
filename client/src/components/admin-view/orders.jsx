// client/src/components/admin-view/orders.jsx 

import { getAllOrdersForAdmin, getOrderDetailsForAdmin, resetOrderDetails } from '@/store/admin/order-slice';
import { Loader2Icon } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { CardTitle } from '../ui/card';
import { CardHeader } from '../ui/card';
import { Card } from '../ui/card';
import { CardContent } from '../ui/card';
import { DialogTrigger } from '../ui/dialog';
import { DialogContent } from '../ui/dialog';
import { Dialog } from "../ui/dialog";
import { TableBody } from '../ui/table';
import { TableHead } from '../ui/table';
import { TableCell } from '../ui/table';
import { TableRow } from '../ui/table';
import { TableHeader } from '../ui/table';
import { Table } from '../ui/table';
import AdminOrderDetailsView from './order-details';

function AdminOrdersView() {
    const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
    const {orderList, orderDetails, isLoading, error } = useSelector((state) => state.adminOrder);
    const dispatch = useDispatch();
    
    function handleFetchOrderDetails(getId){
        dispatch(getOrderDetailsForAdmin(getId))
    }
    
    console.log(orderDetails, 'order Details');
    useEffect(()=>{
        if(orderDetails !== null) setOpenDetailsDialog(true)
    },[orderDetails])

    useEffect(() => {  
        dispatch(getAllOrdersForAdmin())
    }, [dispatch]);
    
    console.log(orderList, 'orderList');
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>All Order history</CardTitle>
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
                                        <Badge className={`py-1 px-3 ${orderItem?.orderStatus === 'confirmed' ? 'bg-green-500' 
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
                                                <Button 
                                                    onClick={() => handleFetchOrderDetails(orderItem._id)}
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
                                                    <AdminOrderDetailsView orderDetails={orderDetails} />
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
    );
}

export default AdminOrdersView;
