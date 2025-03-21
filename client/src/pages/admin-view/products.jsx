// client/src/pages/admin-view/products.jsx 

import ProductImageUpload from '@/components/admin-view/image-upload';
import AdminProductTile from '@/components/admin-view/product-tile';
import CommonForm from '@/components/common/form';
import { Button } from '@/components/ui/button'
import { SheetHeader } from '@/components/ui/sheet';
import { Sheet } from '@/components/ui/sheet';
import { SheetTitle } from '@/components/ui/sheet';
import { SheetContent } from '@/components/ui/sheet';
import { addProductFormElements } from '@/config';
import { useToast } from '@/hooks/use-toast';
import { addNewProduct, uploadImagesToCloud } from '@/store/admin/products-slice';
import { deleteProduct } from '@/store/admin/products-slice';
import { editProduct } from '@/store/admin/products-slice';
import { fetchAllProducts } from '@/store/admin/products-slice';
import { Item } from '@radix-ui/react-select';
import { data } from 'autoprefixer';
import { Hand } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux';

const initialFormData = {
  title: '',
  description: '',
  category: '',
  price: "",
  salePrice: '',
  totalStock: '',
  tags: [],
}

function AdminProducts() {

  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploadedImageUrl, setUploadedImageUrl] = useState('');
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

  const { productList } = useSelector(state => state.AdminProducts);
  const dispatch = useDispatch();
  const { toast } = useToast()

  function onSubmit(imageFiles) {
    dispatch(uploadImagesToCloud(imageFiles)).then(
      (res) =>{
        if(res)
        {
          // const urls = res?.payload ? res.payload.map((item) => 
          // item?.data?.secure_url) 
          // : [];
          const urls = res.payload;
          return dispatch(addNewProduct(
            {
              images: urls,
              ...formData
            }))
        }
      }
    ).then((res) => {
      console.log("Product created", res.payload);
    }).catch((err) => {
      console.error(err);
    });
    
  }

  function handleDelete(getCurrentProductId) {
    dispatch(deleteProduct(getCurrentProductId)).then(data => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
      }
    })
  }

  function isFormValid() {
    const isValid = Object.keys(formData)
      .map((key) => formData[key] !== "")
      .every((item) => item);
    console.log("The form is ", isValid);
    return isValid;
  }

  useEffect(() => {
    dispatch(fetchAllProducts())
  }, [dispatch])

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => setOpenCreateProductsDialog(true)}
        >
          Add New Products
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {
          productList && productList.length > 0 ?
            productList.map(productItem => (
              <AdminProductTile
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                key={productItem._id}
                handleDelete={handleDelete}
              />)) : null
        }

      </div>
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);  // to reset the input values
          setFormData(initialFormData);
        }} >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle >
              {
                currentEditedId !== null ?
                  "Edit Product" : "Add New Product"
              }

            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFiles={imageFiles}
            setImageFiles={setImageFiles}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <div className="py-6">
            <CommonForm
              onSubmit={(event) => { event.preventDefault(); onSubmit(imageFiles)}}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              formControls={addProductFormElements}
              isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </Fragment>
  )
}

export default AdminProducts
