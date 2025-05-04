// client/src/pages/admin-view/dashboard.jsx 

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { getFeatureImages, deleteFeatureImage } from '@/store/common-slice';
import { Loader2, Trash2, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FeatureForm } from '@/components/admin-view/feature-form';

function AdminDashboard() {
    const [deletingId, setDeletingId] = useState(null);
    const dispatch = useDispatch();
    const { toast } = useToast();
    const { isLoading, error, featureImageList } = useSelector((state) => state.commonFeature);

    useEffect(() => {
        dispatch(getFeatureImages());
    }, [dispatch]);
    useEffect(() => {
        console.log("features we got: ", featureImageList);
    }, [featureImageList])

    async function handleDeleteImage(imageId) {
        try {
            setDeletingId(imageId);
            const resultAction = await dispatch(deleteFeatureImage(imageId));
            if (deleteFeatureImage.fulfilled.match(resultAction)) {
                dispatch(getFeatureImages());
                toast({
                    title: "Image deleted successfully",
                });
            } else {
                throw new Error(resultAction.error.message);
            }
        } catch (error) {
            toast({
                title: "Failed to delete image",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Feature Images Management</h1>
            
            {/* Upload Section */}
            <FeatureForm/>

            {/* Feature Images Grid */}
            <div className="space-y-4">
                <h2 className="text-xl font-semibold mb-4">Current Feature Images</h2>
                {error && (
                    <div className="flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-md">
                        <XCircle className="h-5 w-5" />
                        <p className="text-sm">{error}</p>
                    </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {featureImageList && featureImageList.length > 0 ? (
                        featureImageList.map((featureImage, index) => (
                            <Card key={featureImage._id || index} className="overflow-hidden group">
                                <div className="relative aspect-video">
                                    <img
                                        className="w-full h-full object-cover"
                                        src={featureImage.image}
                                        alt={`Feature Image ${index + 1}`}
                                    />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            className="absolute bottom-4 right-4"
                                            onClick={() => handleDeleteImage(featureImage._id)}
                                            disabled={deletingId === featureImage._id}
                                        >
                                            {deletingId === featureImage._id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <>
                                                    <Trash2 className="h-4 w-4 mr-2" />
                                                    Delete
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            </Card>
                        ))
                    ) : (
                        <p className="text-gray-500 text-center col-span-full py-8">
                            No feature images uploaded yet
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;