import { Button } from '@/components/ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { getFeatureImages } from '@/store/common-slice'
import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

const Feature = ({ slide, index, currentSlide }) => {
    return (
        <div
            key={slide._id || index}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out
                                        ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
        >
            <img
                src={slide.image}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover object-center"
            />
            {/* Optional Gradient Overlay */}
            <div className="absolute inset-0 bg-black/60 md:bg-transparent md:bg-gradient-to-r md:from-black/70 md:to-transparent" />
            <div className='left-[5%] md:left-[10%] top-[30%] absolute text-white font-medium  bg-blur-md max-w-md text-start'>
                <p className='text-5xl text-[#F5EEDC] md:text-6xl mb-6 text-shadow-lg/30 '>{slide?.title}</p>
                <p className='text-sm  uppercase'>{slide?.subtitle}</p>
                <div className='mt-6'>
                    <Button
                        variant="secondary"
                        className="cursor-pointer w-[150px] mr-3"
                        >Premier</Button>
                    <Button
                        variant="ghost"
                        className="cursor-pointer w-[150px] border-[3px] border-[#DDA853]"
                        >Deuxieme</Button>
                </div>
            </div>
        </div>
    )
}
export const HomeFeatures = function () {
    const { featureImageList } = useSelector((state) => state.commonFeature);
    const [isAnimating, setIsAnimating] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(getFeatureImages()).then(() => { console.log("Executed", featureImageList) })
    }, [dispatch]);

    const handleNextSlide = useCallback(() => {
        if (isAnimating || !featureImageList?.length) return;
        setIsAnimating(true);
        setCurrentSlide((prev) => (prev + 1) % featureImageList.length);
        setTimeout(() => setIsAnimating(false), 1000);
    }, [featureImageList?.length, isAnimating]);

    const handlePrevSlide = useCallback(() => {
        if (isAnimating || !featureImageList?.length) return;
        setIsAnimating(true);
        setCurrentSlide((prev) => (prev - 1 + featureImageList.length) % featureImageList.length);
        setTimeout(() => setIsAnimating(false), 1000);
    }, [featureImageList?.length, isAnimating]);
    useEffect(() => {
        if (!featureImageList?.length) return;

        const timer = setInterval(handleNextSlide, 5000);
        return () => clearInterval(timer);
    }, [handleNextSlide, featureImageList]);

    return (
        <>
            {featureImageList?.length > 0 &&
                <div className="relative w-full h-[80vh] md:h-[400px] lg:h-[600px] overflow-hidden">
                    {/* Loading State */}
                    {!featureImageList?.length && (
                        <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                    )}

                    {/* Carousel Images */}
                    {featureImageList?.length > 0 && (
                        <>
                            {featureImageList.map((slide, index) => (
                                <Feature slide={slide} index={index} currentSlide={currentSlide} />
                            ))}

                            {/* Navigation Buttons */}
                            <div className="absolute inset-0 z-20 flex items-center justify-between px-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handlePrevSlide}
                                    disabled={isAnimating}
                                    className="transform -translate-y-1/2 bg-white/80 hover:bg-white/90 transition-all duration-200 shadow-lg"
                                >
                                    <ChevronLeftIcon className="w-4 h-4" />
                                    <span className="sr-only">Previous slide</span>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleNextSlide}
                                    disabled={isAnimating}
                                    className="transform -translate-y-1/2 bg-white/80 hover:bg-white/90 transition-all duration-200 shadow-lg"
                                >
                                    <ChevronRightIcon className="w-4 h-4" />
                                    <span className="sr-only">Next slide</span>
                                </Button>
                            </div>

                            {/* Slide Indicators */}
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
                                {featureImageList.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            if (!isAnimating) {
                                                setIsAnimating(true);
                                                setCurrentSlide(index);
                                                setTimeout(() => setIsAnimating(false), 1000);
                                            }
                                        }}
                                        className={`w-2 h-2 rounded-full transition-all duration-300 
                                            ${currentSlide === index
                                                ? 'bg-white w-4'
                                                : 'bg-white/50 hover:bg-white/70'}`}
                                        aria-label={`Go to slide ${index + 1}`}
                                    />
                                ))}
                            </div>
                        </>
                    )}

                </div>
            }
        </>)
}