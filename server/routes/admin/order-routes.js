// server/routes/admin/order-routes.js 

import express from 'express';

import { 
    getAllOrdersOfAllUsers,
    getOrderDetailsForAdmin,
    updateOrderStatus
    
    } from '../../controllers/admin/order-controller.js';

const router = express.Router();

// router.get('/list/:userId', getAllOrdersByUser,);

router.get('/get', async (req, res, next) => {
    try {
        await getAllOrdersOfAllUsers(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/details/:id', async (req, res, next) => {
    try {
        await getOrderDetailsForAdmin(req, res);
    } catch (error) {
        next(error);
    }
});

router.put('/update/:id', async (req, res, next) => {
    try {
        await updateOrderStatus(req, res);
    } catch (error) {
        next(error);
    }
});


export default router;