// server/routes/shop/order-routes.js 

import express from 'express';
import { 
    createOrder, 
    capturePayment,
    getAllOrdersByUser,
    getOrderDetails
    } from '../../controllers/shop/order-controller.js';

const router = express.Router();

router.post('/create', async (req, res, next) => {
    try {
        await createOrder(req, res);
    } catch (error) {
        next(error);
    }
});

router.post('/capture', async (req, res, next) => {
    try {
        await capturePayment(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/list/:userId', async (req, res, next) => {
    try {
        await getAllOrdersByUser(req, res);
    } catch (error) {
        next(error);
    }
});

router.get('/details/:id', async (req, res, next) => {
    try {
        await getOrderDetails(req, res);
    } catch (error) {
        next(error);
    }
});

export default router;