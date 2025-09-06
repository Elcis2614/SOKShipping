import Feature from '../../models/Feature.js'
import { countFeatures, getFeatureImages as getFeatures, insertFeature, findFeatureById, deleteFeaute } from '../../db/index.js'
import { getSignature, destroyImages } from '../../helpers/cloudinary.js'

const getFeatureSignature = async (req, res) => {
    try {
        const featureCount = await countFeatures();
        if (featureCount == process.env.MAX_FEATURES) {
            res.status(405).json({
                success: false,
                message: "You have maxed out the number of features"
            })
        }
        else {
            const signature = await getSignature();
            return res.status(201).json({
                success: true,
                message: 'Image feature signature created',
                data: signature

            })
        }
    } catch (error) {
        console.error('Error in getting Feature signature :', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred!',
            error: "could not get Feature signature"
        });
    }
}
const addFeatureImage = async (req, res) => {
    try {
        const { title, subtitle, image } = req.body;

        if (!image) {
            return res.status(400).json({
                success: false,
                message: 'Image URL is required'
            });
        }

        const savedFeature = await insertFeature({ image, title, subtitle });

        res.status(201).json({
            success: true,
            message: 'Feature image added successfully',
            data: savedFeature
        });

    } catch (error) {
        console.error('Error in adding Feature:', error);
        res.status(500).json({
            success: false,
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
            success: false,
            message: 'An error occurred!',
            error: error.message
        });
    }
}

const deleteFeatureImage = async (req, res) => {
    try {
        const { id } = req.params;
        const featureToDelete = await findFeatureById(id);
        if (!featureToDelete) {
            return res.status(404).json({
                success: false,
                message: 'Feature not found'
            });
        }
        await destroyImages([featureToDelete]);
        await deleteFeaute({id});
        res.status(200).json({
            success: true,
            message: 'Feature image deleted successfully',
            data: featureToDelete
        });

    } catch (error) {
        console.error('Error in deleting Feature:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred!',
            error: "Error occured while deleting the feature"
        });
    }
}

export {
    addFeatureImage,
    getFeatureImages,
    deleteFeatureImage,
    getFeatureSignature
};
