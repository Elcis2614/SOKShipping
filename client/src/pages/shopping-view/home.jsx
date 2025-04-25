// client/src/pages/shopping-view/home.jsx 

import ShoppingProductTile from '@/components/shopping-view/product-tile'
import { CardContent } from '@/components/ui/card'
import { Card } from '@/components/ui/card'
import { fetchAllFilteredProducts } from '@/store/shop/products-slice'
import {  ShirtIcon, Watch, Camera, CloudLightning, BabyIcon, Footprints, Thermometer, Airplay } from 'lucide-react'
import  {  useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { SiAdidas, SiNike, SiPuma, SiZara } from "react-icons/si";
import { HomeFeatures } from '@/components/shopping-view/home-feature'

import { useNavigate } from 'react-router-dom'


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
    const { productList, isLoading } = useSelector((state)=> state.shopProducts);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    
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
            <HomeFeatures/>
            {/** home categories section */}
            <section className="py-12 bg-gray-50">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-center mb-8">
                        Shop by category
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 ">
                        {
                            categoriesWithIcon.map((categoryItem)=> 
                            <Card 
                              key={categoryItem.id}
                              onClick={()=>handleNavigateToListingPage(categoryItem, 'category')} 
                              className="cursor-pointer hover:shadow-lg transition-shadow ">
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
