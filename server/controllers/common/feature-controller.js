import Feature from '../../models/Feature.js'
import {getFeatureImages as getFeatures}  from '../../db/index.js'
const addFeatureImage = async(req, res) => {
    try {
        const { image } = req.body;
        
        if (!image) {
            return res.status(400).json({
                success: false,
                message: 'Image URL is required'
            });
        }
        
        const newFeature = new Feature({
            image
        });
        
        const savedFeature = await newFeature.save();
        
        res.status(201).json({
            success: true,
            message: 'Feature image added successfully',
            data: savedFeature
        });
        
    } catch (error) {
            //console.error('Error in adding Feature:', error);
            res.status(500).json({
                success : false, 
                message: 'An error occurred!',
                error: error.message
            });
    }
}

const getFeatureImages = async (req, res) => {
    try {
        const features = await getFeatures();
        
        res.status(200).json({
            success: true,
            data: features
        });

    } catch (error) {
        console.error('Error in getting Feature:', error);
        res.status(500).json({
            success : false,
            message: 'An error occurred!',
            error: error.message
        });
    }
}

const deleteFeatureImage = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedFeature = await Feature.findByIdAndDelete(id);

        if (!deletedFeature) {
            return res.status(404).json({
                success: false,
                message: 'Feature image not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Feature image deleted successfully',
            data: deletedFeature
        });

    } catch (error) {
        //console.error('Error in deleting Feature:', error);
        res.status(500).json({
            success : false,
            message: 'An error occurred!',
            error: error.message
        });
    }
}

export {
    addFeatureImage,
    getFeatureImages,
    deleteFeatureImage
};
