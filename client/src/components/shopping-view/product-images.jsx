import { useEffect, useState } from "react";

const ImagesView = ({ images = [] }) => {
    const [focusedImage, setFocusedImage] = useState(null);
    const [focusedIndex, setFocusedIndex] = useState(0);

    const handleClick = (index) => {
        if (index !== focusedIndex && images[index]) {
            setFocusedImage(images[index]);
            setFocusedIndex(index);
        }
        console.log("Click on index:", index);
    };

    const handleKeyNavigation = (event) => {
        if (!images.length) return;
        
        switch (event.key) {
            case 'ArrowLeft':
                event.preventDefault();
                const prevIndex = focusedIndex > 0 ? focusedIndex - 1 : images.length - 1;
                handleClick(prevIndex);
                break;
            case 'ArrowRight':
                event.preventDefault();
                const nextIndex = focusedIndex < images.length - 1 ? focusedIndex + 1 : 0;
                handleClick(nextIndex);
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        try {
            if (images && images.length > 0) {
                // Find primary image first
                const primaryImg = images.find((item) => item.is_primary === true);
                
                if (primaryImg) {
                    setFocusedImage(primaryImg);
                    const primaryIndex = images.findIndex(item => item.is_primary === true);
                    setFocusedIndex(primaryIndex);
                    console.log("Primary image set:", primaryImg);
                } else {
                    // Fallback to first image if no primary image
                    setFocusedImage(images[0]);
                    setFocusedIndex(0);
                    console.log("No primary image found, using first image:", images[0]);
                }
            } else {
                setFocusedImage(null);
                setFocusedIndex(0);
            }
        } catch (error) {
            console.error("Could not set the image for the product:", error);
        }
    }, [images]);

    // Handle empty images array
    if (!images || images.length === 0) {
        return (
            <div className="flex gap-1 w-full lg:w-1/2">
                <div className="relative rounded-lg bg-gray-200 aspect-square w-full flex items-center justify-center">
                    <span className="text-gray-500">No images available</span>
                </div>
            </div>
        );
    }

    // Single image case
    if (images.length === 1) {
        return (
            <div className="flex gap-1 w-full lg:w-1/2">
                <div className="relative rounded-lg">
                    <img
                        src={images[0]?.url}
                        alt={images[0]?.alt_text || "Product Image"}
                        className="aspect-square w-full object-cover rounded-lg"
                        onError={(e) => {
                            e.target.src = '/placeholder-image.jpg'; // Fallback image
                        }}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="flex gap-1 w-full lg:w-1/2" onKeyDown={handleKeyNavigation} tabIndex={0}>
            {/* Thumbnail navigation - hidden on mobile, visible on lg+ */}
            <div className="hidden lg:flex lg:flex-col gap-2 w-20">
                {images.map((item, index) => (
                    <button
                        key={item.id || index}
                        className={`w-full aspect-square rounded-lg cursor-pointer border-2 transition-all duration-200 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                  ${index === focusedIndex 
                                    ? "border-blue-600 ring-2 ring-blue-200" 
                                    : "border-gray-300"}`}
                        onClick={() => handleClick(index)}
                        aria-label={`View image ${index + 1}: ${item?.alt_text || 'Product image'}`}
                    >
                        <img
                            className="w-full h-full rounded-md object-cover"
                            src={item?.url}
                            alt={item?.alt_text || `Product image ${index + 1}`}
                            onError={(e) => {
                                e.target.src = '/placeholder-image.jpg'; // Fallback image
                            }}
                        />
                    </button>
                ))}
            </div>

            {/* Main image display */}
            <div className="relative rounded-lg flex-1">
                {focusedImage && (
                    <img
                        src={focusedImage.url}
                        alt={focusedImage.alt_text || "Product Image"}
                        className="aspect-square w-full object-cover rounded-lg"
                        onError={(e) => {
                            e.target.src = '/placeholder-image.jpg'; // Fallback image
                        }}
                    />
                )}
                
                {/* Image counter for mobile */}
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white px-2 py-1 rounded text-sm lg:hidden">
                    {focusedIndex + 1} / {images.length}
                </div>

                {/* Navigation arrows for mobile */}
                {images.length > 1 && (
                    <>
                        <button
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 lg:hidden focus:outline-none focus:ring-2 focus:ring-white"
                            onClick={() => {
                                const prevIndex = focusedIndex > 0 ? focusedIndex - 1 : images.length - 1;
                                handleClick(prevIndex);
                            }}
                            aria-label="Previous image"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>
                        
                        <button
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-70 lg:hidden focus:outline-none focus:ring-2 focus:ring-white"
                            onClick={() => {
                                const nextIndex = focusedIndex < images.length - 1 ? focusedIndex + 1 : 0;
                                handleClick(nextIndex);
                            }}
                            aria-label="Next image"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}
            </div>

            {/* Mobile thumbnail dots indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1 lg:hidden">
                {images.map((_, index) => (
                    <button
                        key={index}
                        className={`w-2 h-2 rounded-full transition-all duration-200 focus:outline-none
                                  ${index === focusedIndex 
                                    ? "bg-white" 
                                    : "bg-white bg-opacity-50"}`}
                        onClick={() => handleClick(index)}
                        aria-label={`Go to image ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default ImagesView;