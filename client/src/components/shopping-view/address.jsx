// client/src/components/shopping-view/address.jsx 

import { addressFormControls } from '@/config'
import { useToast } from '@/hooks/use-toast'
import { addNewAddress, deleteAddress, editaAddress, fetchAllAddresses } from '@/store/shop/address-slice'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CommonForm from '../common/form'
import { CardContent } from '../ui/card'
import { CardTitle } from '../ui/card'
import { CardHeader } from '../ui/card'
import { Card } from '../ui/card'
import { Button } from '../ui/button'
import { Plus, X } from 'lucide-react'
import AddressCard from './address-card'

const initialAddressFormData = {
    email: '',
    address : '',
    city : '',
    phone: '',
    pincode : '',
    notes : ''
}

function Address({setCurrentSelectedAddress, selectedId}) {
    const [formData, setFormData] = useState(initialAddressFormData);
    const [currentEditedId, setCurrentEditedId] = useState(null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const dispatch = useDispatch();
    const {user, isAuthenticated} = useSelector((state )=> state.auth);
    const { addressList } = useSelector((state)=> state.shopAddress);
    const {toast} = useToast()
    
    // Show form automatically if user has no addresses
    useEffect(() => {
        if (isAuthenticated && addressList && addressList.length === 0) {
            setShowAddressForm(true);
        }
        if(addressList.length >= 0){
            setShowAddressForm(false);
        }
    }, [addressList, isAuthenticated]);
    
    function handleManageAddress(event){
        event.preventDefault();
        
        if(addressList.length >= 3 && currentEditedId === null){
            setFormData(initialAddressFormData);
            toast({
                title : 'You can add Max 3 address',
                variant : 'destructive'
            })
            
            return;
        }
        
        currentEditedId !== null ? dispatch(editaAddress({
            userId : user?.id, addressId : currentEditedId, formData
        })).then( (data) => {
            if(data?.payload?.success){
                dispatch(fetchAllAddresses(user?.id))
                setCurrentEditedId(null)
                setFormData(initialAddressFormData)
                setShowAddressForm(false) // Hide form after successful edit
                toast({
                    title: 'Address Updated successfully'
                })
            }
        }) 
        :
        dispatch(
            addNewAddress({
                ...formData,
                userId : user?.id,
            })).then(data=>{
                console.log('data', data);
                if(data?.payload?.success){
                    dispatch(fetchAllAddresses(user?.id))
                    setFormData(initialAddressFormData)
                    setShowAddressForm(false) // Hide form after successful addition
                    toast({
                        title: 'Address added successfully'
                    })
                }
        })
    }
    
    function isFormValid(){
        return Object.keys(formData)
            .map( (key) => formData[key].trim() !== '')
            .every((item) => item);
    }
    
    useEffect(() => {
        dispatch(fetchAllAddresses(user?.id));
    }, [dispatch, user?.id]);
    
    function handleDeleteAddress(getCurrentAddress){
        console.log(getCurrentAddress);
        
        dispatch(deleteAddress({ userId: user?.id, addressId: getCurrentAddress._id })).then((data) => {
            if (data?.payload?.success) {
                dispatch(fetchAllAddresses(user?.id));
                toast({
                    title : 'Address deleted successfully',
                })
            }
        });
    }
    
    function handleEditAddress(getCurrentAddress){
        setCurrentEditedId(getCurrentAddress?._id)
        setFormData({
            ...formData,
            address : getCurrentAddress?.address,
            city : getCurrentAddress?.city,
            phone: getCurrentAddress?.phone,
            pincode : getCurrentAddress?.pincode,
            notes : getCurrentAddress?.notes
        })
        setShowAddressForm(true) // Show form when editing
    }
    
    function handleAddNewAddress() {
        if (addressList.length >= 3) {
            toast({
                title : 'You can add Max 3 addresses',
                variant : 'destructive'
            })
            return;
        }
        
        setCurrentEditedId(null);
        setFormData(initialAddressFormData);
        setShowAddressForm(true);
    }
    
    function handleCancelForm() {
        setShowAddressForm(false);
        setCurrentEditedId(null);
        setFormData(initialAddressFormData);
    }
    
    // Determine if we should show the "Add New Address" button
    const shouldShowAddButton = isAuthenticated && addressList && addressList.length > 0 && addressList.length < 3 && !showAddressForm;
    
    return (
        <Card className='bg-white shadow-lg rounded-lg p-6 max-w-full mx-auto my-4'>
            {/* Existing addresses grid */}
            {isAuthenticated && addressList && addressList.length > 0 && (
                <div className='mb-6'>
                    <div className='flex items-center justify-between mb-4'>
                        <h3 className="text-lg font-semibold text-gray-900">Your Addresses</h3>
                        {shouldShowAddButton && (
                            <Button 
                                onClick={handleAddNewAddress}
                                className="flex items-center gap-2"
                                variant="outline"
                            >
                                <Plus className="h-4 w-4" />
                                Add New Address
                            </Button>
                        )}
                    </div>
                    
                    <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4'>
                        {addressList.map((singleAddressItem) => (
                            <div key={singleAddressItem._id} className="h-full">
                                <AddressCard
                                    selectedId={selectedId}
                                    handleDeleteAddress={handleDeleteAddress}
                                    addressInfo={singleAddressItem}
                                    handleEditAddress={handleEditAddress}
                                    setCurrentSelectedAddress={setCurrentSelectedAddress}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Add New Address Form Section - Conditionally rendered */}
            {isAuthenticated && showAddressForm && (
                <div className="border-t pt-6">
                    <CardHeader className="p-0 pb-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-xl font-bold text-gray-900">
                                    {currentEditedId !== null ? 'Edit Address' : 'Add New Address'}
                                </CardTitle>
                                <div className='italic text-gray-600 mt-1'>
                                    Fill up the form to {currentEditedId !== null ? 'update your' : 'add a new'} address
                                </div>
                            </div>
                            {/* Show cancel button only if user has existing addresses */}
                            {addressList && addressList.length > 0 && (
                                <Button 
                                    onClick={handleCancelForm}
                                    variant="ghost" 
                                    size="sm"
                                    className="flex items-center gap-1"
                                >
                                    <X className="h-4 w-4" />
                                    Cancel
                                </Button>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <CommonForm
                            formControls={addressFormControls}
                            formData={formData}
                            setFormData={setFormData}
                            buttonText={currentEditedId !== null ? 'Update Address' : 'Add New Address'}
                            onSubmit={handleManageAddress}
                            isBtnDisabled={!isFormValid()}
                        />
                    </CardContent>
                </div>
            )}
            
            {/* Empty state when no addresses and form is hidden */}
            {isAuthenticated && addressList && addressList.length === 0 && !showAddressForm && (
                <div className="text-center py-8">
                    <div className="text-gray-500 mb-4">No addresses found</div>
                    <Button onClick={handleAddNewAddress} className="flex items-center gap-2 mx-auto">
                        <Plus className="h-4 w-4" />
                        Add Your First Address
                    </Button>
                </div>
            )}
            
            {/* Not authenticated state */}
            {!isAuthenticated && (
                <div className="text-center py-8">
                    <div className="text-gray-500">Please log in to manage your addresses</div>
                </div>
            )}
        </Card>
    )
}

export default Address;