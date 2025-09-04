// client/src/components/shopping-view/address-card.jsx 

import PropTypes from 'prop-types';
import { Button } from '../ui/button';
import { CardFooter, CardContent, Card } from '../ui/card';
import { Check, Edit2, Trash2, MapPin, Globe } from 'lucide-react';
import { useState } from 'react';

function AddressCard({
    addressInfo,
    handleDeleteAddress,
    handleEditAddress,
    setCurrentSelectedAddress,
    selectedId
}) {
    const [isDeleting, setIsDeleting] = useState(false);
    const isSelected = selectedId?.address_id === addressInfo?.address_id;
    const isSelectable = !!setCurrentSelectedAddress;

    const handleCardClick = (e) => {
        if (e.target.tagName.toLowerCase() !== 'button' && 
            !e.target.closest('button') && 
            isSelectable) {
            setCurrentSelectedAddress(addressInfo);
        }
    };

    const handleDelete = async (e) => {
        e.stopPropagation();
        setIsDeleting(true);
        
        try {
            await handleDeleteAddress(addressInfo);
        } catch (error) {
            console.error('Error deleting address:', error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleEdit = (e) => {
        e.stopPropagation();
        handleEditAddress(addressInfo);
    };

    // Format location string
    const locationString = [
        addressInfo?.city,
        addressInfo?.state,
        addressInfo?.country
    ].filter(Boolean).join(', ');

    return (
        <Card
            onClick={handleCardClick}
            className={`
                relative flex flex-col h-40 transition-all duration-200 
                group hover:shadow-md
                ${isSelectable ? 'cursor-pointer' : ''} 
                ${isSelected 
                    ? 'border-2 border-primary shadow-md ring-1 ring-primary/20 bg-primary/5' 
                    : 'border border-gray-200 hover:border-primary/30'
                }
                ${isDeleting ? 'opacity-50 pointer-events-none' : ''}
            `}
            role={isSelectable ? "button" : undefined}
            tabIndex={isSelectable ? 0 : undefined}
            onKeyDown={isSelectable ? (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setCurrentSelectedAddress(addressInfo);
                }
            } : undefined}
            aria-label={isSelectable ? `Select address: ${addressInfo?.address_line1}` : undefined}
        >
            {/* Selection Indicator */}
            {isSelected && (
                <div className="absolute -top-1.5 -right-1.5 bg-primary rounded-full p-1 z-10 shadow-sm">
                    <Check className="h-3 w-3 text-white" />
                </div>
            )}

            {/* Selection Hint */}
            {isSelectable && !isSelected && (
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="w-4 h-4 border-2 border-gray-300 rounded-full bg-white"></div>
                </div>
            )}

            {/* Main Content */}
            <CardContent className="flex-1 p-3 min-h-0">
                <div className="space-y-2 h-full flex flex-col">
                    {/* Primary Address */}
                    <div className="flex items-start gap-2 flex-1">
                        <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <div className="flex-1 min-w-0 space-y-1">
                            <p className="text-sm font-medium text-gray-900 leading-tight break-words line-clamp-2">
                                {addressInfo?.address_line1}
                            </p>
                            <div className="flex items-center gap-1.5 text-xs text-gray-600">
                                <Globe className="h-3 w-3 flex-shrink-0" />
                                <span className="truncate">{locationString}</span>
                            </div>
                            {addressInfo?.postal_code && (
                                <span className="text-xs text-gray-500 font-mono">
                                    {addressInfo.postal_code}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>

            {/* Compact Footer */}
            <CardFooter className="flex gap-1.5 p-2 border-t bg-gray-50/30">
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 h-8 text-xs hover:bg-gray-100"
                    onClick={handleEdit}
                    disabled={isDeleting}
                >
                    <Edit2 className="h-3 w-3 mr-1" />
                    Edit
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className="flex-1 h-8 text-xs text-red-600 hover:bg-red-50"
                    onClick={handleDelete}
                    disabled={isDeleting}
                >
                    <Trash2 className="h-3 w-3 mr-1" />
                    {isDeleting ? 'Deleting...' : 'Delete'}
                </Button>
            </CardFooter>

            {/* Compact Loading overlay */}
            {isDeleting && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center rounded-lg">
                    <div className="flex items-center gap-2 text-gray-600">
                        <div className="w-3 h-3 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
                        <span className="text-xs">Deleting...</span>
                    </div>
                </div>
            )}
        </Card>
    );
}

AddressCard.propTypes = {
    addressInfo: PropTypes.shape({
        address_id: PropTypes.string.isRequired,
        address_line1: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        country: PropTypes.string.isRequired,
        postal_code: PropTypes.string,
        state: PropTypes.string
    }).isRequired,
    handleDeleteAddress: PropTypes.func.isRequired,
    handleEditAddress: PropTypes.func.isRequired,
    setCurrentSelectedAddress: PropTypes.func,
    selectedId: PropTypes.shape({
        address_id: PropTypes.string
    })
};

// Add CSS for line-clamp if not available in your Tailwind config
const styles = `
.line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
`;

// Inject styles if needed
if (typeof document !== 'undefined' && !document.getElementById('address-card-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'address-card-styles';
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
}

export default AddressCard;