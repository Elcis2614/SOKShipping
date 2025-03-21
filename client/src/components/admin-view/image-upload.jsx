// client/src/components/admin-view/image-upload.jsx 

import axios from 'axios';
import { FileIcon, UploadCloudIcon, XIcon } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react'
import { Button } from '../ui/button';
import { Input } from '../ui/input'
import { Label } from '../ui/label';
import { Skeleton } from '../ui/skeleton';

function ProductImageUpload(
    {
        imageFiles,
        imageLoadingState,
        setImageFiles,
        uploadedImageUrl,
        setUploadedImageUrl,
        setImageLoadingState,
        isEditMode,
        isCustomStyling = false
    }) {
    const inputRef = useRef(null)
    
    function handleImageFileChange(event) {
        const selectedFiles = Array.from(event.target.files);
        if (selectedFiles) setImageFiles(selectedFiles);
    }

    function handleDrop(event) {
        event.preventDefault();
    }

    function handleDragOver(event) {
        event.preventDefault()
        const droppedFile = event.dataTransfer.files?.[0];
        if (droppedFile) setImageFiles(droppedFile)
    }

    function handleRemoveImage(key) {
        if(imageFiles){
            const newImageFile = imageFiles.filter((file, indx) => indx !== key)
            setImageFiles(newImageFile);
        }
    }

    return (
        <div className={`w-full mt-4 ${isCustomStyling ? '' : 'max-w-md mx-auto'}`}>
            <Label className="text-lg font-semibold md-2 block">Upload</Label>
            <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`${isEditMode ? "opacity-60" : ""
                    }
                    border-2 border-dashed rounded-lg p-4`}
            >
                <Input
                    id="image-upload"
                    type="file"
                    className="hidden"
                    onChange={handleImageFileChange}
                    disabled={isEditMode}
                    multiple />
                {
                    imageFiles?.length==0 ? (
                        <Label
                            htmlFor="image-upload"
                            className={`${isEditMode ? 'cursor-not-allowed' : ""} flex flex-col items-center justify-center h-32 cursor-pointer`} >
                            <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
                            <span>Drag & drop or click to upload images</span>

                        </Label>) : (
                        imageLoadingState ?
                            <Skeleton className='h-10 bg-gray-100' /> :
                            imageFiles?.map((item, index) => (
                                <>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <FileIcon className="w-8 text-primary mr-2 h-8" />
                                        </div>
                                        <p className="text-sm font-medium">{item.name}</p>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-muted-foreground hover:text-foreground color-red"
                                            onClick={() => {handleRemoveImage(index)}}
                                        >
                                            <XIcon className="w-4 h-4" />
                                            <span className="sr-only" >Remove File</span>
                                        </Button>
                                    </div>
                                </>
                            ))
                    )
                }
            </div>
        </div>
    )
}

export default ProductImageUpload;
