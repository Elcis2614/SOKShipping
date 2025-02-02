// client/src/components/shopping-view/address.jsx 

import { addressFormControls } from '@/config'
import { useToast } from '@/hooks/use-toast'
import { addNewAddress, deleteAddress, editaAddress, fetchAllAddresses } from '@/store/shop/address-slice'
import  { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import CommonForm from '../common/form'
import { CardContent } from '../ui/card'
import { CardTitle } from '../ui/card'
import { CardHeader } from '../ui/card'
import { Card } from '../ui/card'
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
    const [ currentEditedId, setCurrentEditedId ] = useState(null);
    const dispatch = useDispatch();
    const {user} = useSelector((state )=> state.auth);
    const { addressList } = useSelector((state)=> state.shopAddress);
    const {toast} = useToast()
    
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
                dispatch(fetchAllAddresses())
                setCurrentEditedId(null)
                setFormData(initialAddressFormData)
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
    }, [dispatch]);
    
    console.log('addressList: ', addressList)
    
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
    
    function handleEditAddress(getCuurentAddress){ handleEditAddress
        setCurrentEditedId(getCuurentAddress?._id)
        setFormData({  // to fill the form
            ...formData,
            address : getCuurentAddress?.address,
            city : getCuurentAddress?.city,
            phone: getCuurentAddress?.phone,
            pincode : getCuurentAddress?.pincode,
            notes : getCuurentAddress?.notes
            
        })
    }
    
    return (
        <Card className='bg-white shadow-lg rounded-lg p-6 max-w-full mx-auto my-4'>
        {/* Grid layout for displaying addresses */}
        <div className='col-span-full'>
            <p></p>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6'>
                {addressList && addressList.length > 0 ? (
                addressList.map((singleAddressItem) => (
                    <div key={singleAddressItem._id} className="h-full">
                        <AddressCard
                            selectedId={selectedId}
                            handleDeleteAddress={handleDeleteAddress}
                            addressInfo={singleAddressItem}
                            handleEditAddress={handleEditAddress}
                            setCurrentSelectedAddress={setCurrentSelectedAddress}
                        />
                    </div>
                ))
            ) : (
                <div className="col-span-full">
                    <p className="text-gray-500 text-center py-4"></p>
                </div>
            )}
        </div>

       {/* Add New Address Form Section */}
       <div className="border-t border-gray-200">
            <CardHeader className="p-6">
                <CardTitle className="text-xl font-bold text-gray-900">
                    Enter your info
                </CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-0">
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
           
        </Card>
    )
}

export default Address;
