// client/src/pages/shopping-view/home.jsx 

import ShoppingProductTile from '@/components/shopping-view/product-tile'
import { Button } from '@/components/ui/button'
import { CardContent } from '@/components/ui/card'
import { Card } from '@/components/ui/card'
import { fetchAllFilteredProducts } from '@/store/shop/products-slice'
import { ChevronLeftIcon, ChevronRightIcon, ShirtIcon, Watch, Camera, CloudLightning, BabyIcon, Footprints, Thermometer, Airplay } from 'lucide-react'
import  { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SiAdidas, SiNike, SiPuma, SiZara } from "react-icons/si";


import { useNavigate } from 'react-router-dom'
import { getFeatureImages } from '@/store/common-slice'

{/** home categories with Icons section */}
const categoriesWithIcon = [
    {id: "men", label: "Men" , icon : ShirtIcon},
    {id: "women", label: "Women", icon : CloudLightning },
    {id: "watch", label: "Watch", icon : Watch },
    {id: "kids", label: "Kids", icon : BabyIcon },
    {id: "accessories", label: "Accessories", icon : Camera },
    {id: "footwear", label: "Footwear", icon : Footprints },
  
  ];
  
  {/** home Brands with Icons section */}
const brandWithIcon = [
    {id: "nike", label: "Nike", icon : SiNike },
    {id: "adidas", label: "Adidas", icon : SiAdidas  },
    {id: "puma", label: "Puma", icon : SiPuma  },
    {id: "levi", label: "Levi's", icon : Airplay  },
    {id: "zara", label: "Zara", icon : SiZara  },
    {id: "h&m", label: "H&M", icon : Thermometer  },
  ]

function ShoppingHome() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const { productList, isLoading } = useSelector((state)=> state.shopProducts);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    //added from adminDashboard
    const {featureImageList } = useSelector((state) => state.commonFeature);
    
    useEffect(() => {
      dispatch(getFeatureImages())
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

    
    useEffect(()=>{
        dispatch(fetchAllFilteredProducts({
            filterParams : {}, 
            sortParams : 'price-lowtohigh'
            }))
        }, [dispatch]);
    
    {/** this will help to navigor /shop/listing?category=women when category/brand icon is clicked */}
    function handleNavigateToListingPage(getCurrentItem, section){
        sessionStorage.removeItem('filters');
        const currentFilter = {
            [section] : [getCurrentItem.id]
        }
        sessionStorage.setItem("filters", JSON.stringify(currentFilter));
        navigate(`/shop/listing`)
    }
          
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero Carousel Section */}
            {featureImageList?.length > 0 &&
              <div className="relative w-full h-[300px] md:h-[400px] lg:h-[600px] overflow-hidden">
                  {/* Loading State */}
                  {!featureImageList?.length && (
                      <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                  )}

                  {/* Carousel Images */}
                  {featureImageList?.length > 0 && (
                      <>
                          {featureImageList.map((slide, index) => (
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
                                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                              </div>
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
            {/** home categories section */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">
                        Shop by category
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {
                            categoriesWithIcon.map((categoryItem)=> 
                            <Card 
                              key={categoryItem.id}
                              onClick={()=>handleNavigateToListingPage(categoryItem, 'category')} 
                              className="cursor-pointer hover:shadow-lg transition-shadow">
                                <CardContent className="flex flex-col items-center justify-center p-6">
                                    <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                                    <span className="font-bold">{categoryItem.label}</span>
                                </CardContent>
                            </Card>
                            )
                        }
                    </div>
                </div>
            </section>
            
            {/** home brands section */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">
                        Shop by Brand
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        { brandWithIcon.map((brandItem)=> 
                            <Card
                              key={brandItem.id}
                              className="cursor-pointer hover:shadow-lg transition-shadow">
                                <CardContent  
                                  onClick={()=>handleNavigateToListingPage(brandItem, 'brand')} 
                                  className="flex flex-col items-center justify-center p-6"
                                  >
                                    <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
                                    <span className="font-bold">{brandItem.label}</span>
                                </CardContent>
                            </Card>
                            )
                        }
                    </div>
                </div>
            </section>
            
             {/** home Products section */}
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">
                        Feature Products
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                        {
                            productList && productList.length > 0 ?
                            productList.map((productItem)=> (
                                <ShoppingProductTile 
                                  key={productItem._id}
                                  product={productItem}
                                />
                                )
                            ) : null
                        }
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ShoppingHome
