// client/src/components/shopping-view/address-card.jsx 

import PropTypes from 'prop-types';
import { Button } from '../ui/button';
import { CardFooter, CardContent, Card } from '../ui/card';
import { Check } from 'lucide-react';

function AddressCard({
    addressInfo,
    handleDeleteAddress,
    handleEditAddress,
    setCurrentSelectedAddress,
    selectedId
}) {
    const isSelected = selectedId?._id === addressInfo?._id;

    const handleCardClick = (e) => {
        if (e.target.tagName.toLowerCase() !== 'button' && setCurrentSelectedAddress) {
            setCurrentSelectedAddress(addressInfo);
        }
    };

    return (
        <Card
            onClick={handleCardClick}
            className={`relative flex flex-col min-h-[280px] max-h-full transition-all duration-200 mb-4 ${
                setCurrentSelectedAddress ? 'cursor-pointer hover:shadow-md' : ''
            } ${
                isSelected 
                    ? 'border-2 border-primary shadow-md ring-2 ring-primary/20'
                    : 'border border-gray-200 hover:border-gray-300'
            }`}
        >
            {/* Selection Indicator */}
            {isSelected && (
                <div className="absolute -top-2 -right-2 bg-primary rounded-full p-1 z-10">
                    <Check className="h-4 w-4 text-white" />
                </div>
            )}

            {/* Main Content */}
            <CardContent className="flex-1 p-4 overflow-y-auto">
                <div className="space-y-3">
                    {/* Address Section */}
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-gray-500">Address</span>
                        <span className="text-base break-words">{addressInfo?.address}</span>
                    </div>

                    {/* City & Pincode Grid */}
                  
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-gray-500">City</span>
                            <span className="text-base break-words">{addressInfo?.city}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-gray-500">Pincode</span>
                            <span className="text-base">{addressInfo?.pincode}</span>
                        </div>
                   

                    {/* Phone Number */}
                    <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-gray-500">Phone</span>
                        <span className="text-base">{addressInfo?.phone}</span>
                    </div>

                    {/* Optional Notes */}
                    {addressInfo?.notes && (
                        <div className="flex flex-col gap-1">
                            <span className="text-sm font-medium text-gray-500">Notes</span>
                            <span className="text-base text-gray-600 break-words">{addressInfo.notes}</span>
                        </div>
                    )}
                </div>
            </CardContent>

            {/* Footer with Buttons - Fixed at bottom */}
            <CardFooter className="flex justify-between gap-2 p-4 border-t bg-white mt-auto">
                <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleEditAddress(addressInfo);
                    }}
                >
                    Edit
                </Button>
                <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteAddress(addressInfo);
                    }}
                >
                    Delete
                </Button>
            </CardFooter>
        </Card>
    );
}

AddressCard.propTypes = {
    addressInfo: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        address: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        pincode: PropTypes.string.isRequired,
        phone: PropTypes.string.isRequired,
        notes: PropTypes.string
    }).isRequired,
    handleDeleteAddress: PropTypes.func.isRequired,
    handleEditAddress: PropTypes.func.isRequired,
    setCurrentSelectedAddress: PropTypes.func,
    selectedId: PropTypes.shape({
        _id: PropTypes.string
    })
};

export default AddressCard;