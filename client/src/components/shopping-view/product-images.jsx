import { useEffect, useState } from "react";

const ImagesView = ({images, title})=>{
    const [focusedImage, setFocusedImage] = useState();
    const handleClick =(index) => {
        if(index !== focusedImage){
            setFocusedImage(images[index])
        }
        console.log("Clisk on ", index)
    };
    useEffect(() => {
        try{
            setFocusedImage(images[0])
        } catch(error){
            console.error("Could not set the image for the product", error);
        }
    }, [images])
    return(
        <div className="flex gap-1 w-full lg:w-1/2">
            <div className="flex flex-col hidden lg:block">
                {
                    images?.map((image, index) => (
                        <div className={`w-24 rounded-lg mx-auto cursor-pointer border-4 
                                        ${image == focusedImage ? "border-blue-600" : " border-transparent"}`}
                             onClick={() => {handleClick(index)}}>
                            <img
                                className="w-full aspect-square rounded-sm object-cover" 
                                src={image}
                                alt={title}/>
                        </div>
                    ))
                }
            </div>
            <div className="relative rounded-lg">
                <img
                src={focusedImage}
                alt={title || "Product Image"}
                width={600}
                height={600}
                className="aspect-square w-full object-cover rounded-lg "
                />
            </div>
        </div>
    )
}
export default ImagesView;