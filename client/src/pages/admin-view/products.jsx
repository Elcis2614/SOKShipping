// client/src/pages/admin-view/products.jsx 

import ProductImageUpload from '@/components/admin-view/image-upload';
import AdminProductTile from '@/components/admin-view/product-tile';
import CommonForm from '@/components/common/form';
import { Button } from '@/components/ui/button';
import {Loader} from '@/components/ui/loader';
import { SheetHeader } from '@/components/ui/sheet';
import { Sheet } from '@/components/ui/sheet';
import { SheetTitle } from '@/components/ui/sheet';
import { SheetContent } from '@/components/ui/sheet';
import { addProductFormElements } from '@/config';
import { addNewProduct, uploadImagesToCloud } from '@/store/admin/products-slice';
import { editProduct } from '@/store/admin/products-slice';
import { fetchAllProducts } from '@/store/admin/products-slice';
import React, { useEffect, useState } from 'react'
import { Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';

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
  const [isLoading, setIsLoading] = useState(false);
  const { productList } = useSelector(state => state.AdminProducts);
  const dispatch = useDispatch();

  function closing(message){
    setIsLoading(false);
    setOpenCreateProductsDialog(false);
    toast(message);
    setFormData(initialFormData);
    setImageFiles([]);
  }
  function onSubmit(imageFiles, id="") {
    setIsLoading(true);
    if(currentEditedId !== null){
      dispatch(editProduct({
        id: currentEditedId,
        formData: formData})).then((res) => {
          closing("Product Updated")
      })
    }
    else{
      dispatch(uploadImagesToCloud(imageFiles)).then(
        (res) =>{
          if(res)
          {
            const urls = res?.payload ? res.payload.map((item) => 
            item?.data?.secure_url) 
            : [];

            return dispatch(addNewProduct(
              {
                images: urls,
                ...formData
              }))
          }
        }
      ).then((res) => {
        closing("Product Created");
        dispatch(fetchAllProducts());
      }).catch((err) => {
        console.error(err);
      });
    }
          
  }
  

  function isFormValid() {
    const isValid = Object.keys(formData)
      .map((key) => formData[key] !== "")
      .every((item) => item);
    return isValid;
  }

  useEffect(() => {
    dispatch(fetchAllProducts())
  }, [dispatch])

  useEffect(() => {
    if(currentEditedId){
      setImageFiles(formData?.imageFiles || [])
    }
  }, [formData])
  return (
    <Fragment>
      <ToastContainer
        pauseOnHover
        autoClose={2000}
        hideProgressBar={true}
      />
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={() => {setOpenCreateProductsDialog(true)}}
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
              />)) : null
        }

      </div>
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);  // to reset the input values
          setFormData(initialFormData);
          setImageFiles([])
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
          {isLoading && <Loader editText={currentEditedId ? "Editing Product..." : "Adding Product..."}/> }       
          <ProductImageUpload
            imageFiles={imageFiles}
            setImageFiles={setImageFiles}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
            formData={formData}
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

export default AdminProducts;
