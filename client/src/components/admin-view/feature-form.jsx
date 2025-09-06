import ProductImageUpload from '@/components/admin-view/image-upload';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { addFeatureImage, getFeatureImages } from '@/store/common-slice';
import { Loader2, Subtitles } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import CommonForm from '../common/form';
import { addFeatureFormElements } from '@/config';
const initialFormData = {
    title: '',
    Subtitle: ''
  }
async function handleUploadFeatureImage(uploadedImageUrl, setImageFile, setUploadedImageUrl) {
    const { toast } = useToast();
    const dispatch = useDispatch();
    if (!uploadedImageUrl) {
        toast({
            title: "Please upload an image first",
            variant: "destructive",
        });
        return;
    }

    try {
        const resultAction = await dispatch(addFeatureImage(uploadedImageUrl));
        if (addFeatureImage.fulfilled.match(resultAction)) {
            dispatch(getFeatureImages());
            toast({
                title: "Image uploaded successfully",
            });
            setImageFile(null);
            setUploadedImageUrl('');
        } else {
            throw new Error(resultAction.error.message);
        }
    } catch (error) {
        toast({
            title: "Failed to upload image",
            description: error.message,
            variant: "destructive",
        });
    }

}

export const FeatureForm = function(){
    const [imageFile, setImageFile] = useState([]);
    const [uploadedImageUrl, setUploadedImageUrl] = useState('');
    const [imageLoadingState, setImageLoadingState] = useState(false);
    const { isLoading } = useSelector((state) => state.commonFeature);
    const [formData, setFormData] = useState(initialFormData)

    return(
    <Card className="mb-8">
        <CardContent className="pt-6">
            <ProductImageUpload
                imageFiles={imageFile}
                setImageFiles={setImageFile}
                uploadedImageUrl={uploadedImageUrl}
                setUploadedImageUrl={setUploadedImageUrl}
                setImageLoadingState={setImageLoadingState}
                imageLoadingState={imageLoadingState}
                isCustomStyling={true}
                isEditMode={false}
                isMultiple={false}
            />
            <CommonForm
              onSubmit={() => {}}
              formData={formData}
              setFormData={setFormData}
              formControls={addFeatureFormElements}
              isBtnDisabled={true}
            />
            <Button
                onClick={() => {handleUploadFeatureImage(uploadedImageUrl, setImageFile, setUploadedImageUrl)}}
                className="w-full mt-4"
                disabled={isLoading || imageFile.length==0}
            >
                {isLoading ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Uploading...
                    </>
                ) : (
                    'Upload Feature Image'
                )}
            </Button>
        </CardContent>
    </Card>)
}