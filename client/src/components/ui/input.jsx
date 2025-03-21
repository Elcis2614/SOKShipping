import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "./button";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    (<input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props} />)
  );
})
Input.displayName = "Input"

const Tags = ({formData, setFormData ,...props}) => {
  const addTag = (event) => {
    if(event.key == "Enter")
    {
      setFormData({
        ...formData,
        tags: [...formData.tags, event.target.value]
      });
      event.target.value = "";
    }
  }
  const delTag = (idx) => {
    const values = formData.tags.filter((tag, index) => index !== idx);
    setFormData(
      {
        ...formData,
        tags: values
      }
    )
  }
  return(
    <div className="w-full relative">
      <div className="pr-2">
        <ul className="flex flex-wrap gap-1 ">
          {
            formData?.tags?.map((tag,index) => (
              <li className="flex gap-1 pl-1 border border-1 items-center rounded-sm bg-gray-100">
                <span>{tag}</span>
                <X className="h-4 w-4 cursor-pointer" onClick={() => {delTag(index)}}/>
              </li>
            ))
          }
        </ul> 
      </div>
      <div className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 h-10 ">
        <input 
          type="text"
          placeholder={props.placeholder}
          className="file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50"
          onKeyUp={addTag}
        />
      </div>
    </div>)
}

export { Input, Tags }
