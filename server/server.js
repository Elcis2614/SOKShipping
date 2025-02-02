// server/server.js 

import dotenv from 'dotenv';

import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();  // will read all env. created
// Enhanced CORS configuration
const allowedOrigins = [
    'https://e-commerce-instashop-3.onrender.com',    // Production frontend
    'http://localhost:5173'                           // Local development
];
//#region Import routes
import authRouter from './routes/auth/auth-routes.js';
import adminProductsRouter from './routes/admin/products-routes.js';
import adminOrdersRouter from './routes/admin/order-routes.js';
import shopProductsRouter from './routes/shop/products-routes.js';
import shopCartRouter from './routes/shop/cart-routes.js';
import shopAddressRouter from './routes/shop/address-routes.js';
import shopOrderRouter from './routes/shop/order-routes.js';  
import shopSearchRouter from './routes/shop/search-routes.js';  
import shopReviewRouter from './routes/shop/review-routes.js'; 
import commonFeatureRouter from './routes/common/feature-routes.js';
import executeDbScript from './db/seed.js';
//#endregion

/*region Validate environment variables
const requiredEnvVars = ['MONGODB_URI'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        console.error(`Error: Environment variable ${envVar} is required but not set`);
        process.exit(1);
    }
}
//#endregion*/

// create a database connection -> u can also create a separate file for this and then  import  use that file here
// MongoDB connection with retry logic
// const connectDB = async (retryCount = 5) => {
//     try {
//         console.log('Attempting to connect to MongoDB...');
//         const conn = await mongoose.connect(process.env.MONGODB_URI, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });
//         console.log(`MongoDB Connected: ${conn.connection.host}`);
//     } catch (error) {
//         console.error(`Error connecting to MongoDB: ${error.message}`);
//         if (retryCount > 0) {
//             console.log(`Retrying connection... (${retryCount} attempts remaining)`);
//             setTimeout(() => connectDB(retryCount - 1), 5000);
//         } else {
//             console.error('Failed to connect to MongoDB after multiple attempts');
//             process.exit(1);
//         }
//     }
// };



const app = express();
const PORT = process.env.PORT || 5001;


// IMPORTANT: Handle Stripe webhook endpoint before any other middleware
// This must come before other body parsers
// Special handling for Stripe webhook
app.post(
    '/api/shop/order/webhook/stripe',
    express.raw({ type: 'application/json' }),
    (req, res, next) => {
        if (req.originalUrl === '/api/shop/order/webhook/stripe') {
            next();
        } else {
            express.json()(req, res, next);
        }
    }
);

// Increase the timeout for webhook processing
// app.post('/api/shop/order/webhook/stripe', (req, res, next) => {
//     // Set a longer timeout for webhook processing
//     req.setTimeout(30000); // 30 seconds
//     next();
// });

app.post(
    '/api/shop/order/webhook/stripe',
    express.raw({ type: 'application/json' }), // Raw body for Stripe
    (req, res, next) => {
        req.rawBody = req.body; // Store raw body for validation
        next();
    }
);



// CORS configuration
app.use(cors({
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.log('Blocked origin:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Cache-Control',
        'Expires',
        'Pragma'
    ]
  }));
  
// Basic health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'healthy',
        environment: process.env.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

//  Modified debug middleware to skip webhook requests
app.use((req, res, next) => {
    if (req.originalUrl === '/api/shop/order/webhook/stripe') {
        next(); // Skip logging for webhook requests
    } else {
    next();
    }
  });
  
// Move this middleware before routes
app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
    }
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept, Origin');
    next();
});

// Middleware

//Add this middleware before any routes
app.use('/api/shop/order/webhook/stripe', 
    express.raw({ type: 'application/json' }),
    (req, res, next) => {
        // Store raw body for webhook verification
        const chunks = [];
        req.on('data', chunk => chunks.push(chunk));
        req.on('end', () => {
            req.rawBody = Buffer.concat(chunks);
            next();
        });
    }
);

// Make sure this comes AFTER the webhook route
app.use(cookieParser());
app.use(express.json());

//#region Routes
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrdersRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);  
app.use("/api/shop/search", shopSearchRouter);  
app.use("/api/shop/review", shopReviewRouter);  
app.use('/api/common/feature', commonFeatureRouter);
//#endregion



// Error handling middleware updated for better logging
app.use((err, req, res, next) => {
    console.error('Error:', {
        message: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method,
        origin: req.headers.origin
    });
    
    res.status(err.status || 500).json({ 
        message: 'Internal Server Error', 
        error: process.env.NODE_ENV === 'development' ? err.message : 'An error occurred'
    });
});

const connectDB =  async () => {
    const key = process.env.EXECUTE_DB_SCRIPT || 'false';
    if(key.toLocaleLowerCase() === 'true'){
       await executeDbScript();
    }
}

connectDB();
// Start server with improved logging
app.listen(PORT, '0.0.0.0', () => {
    /*console.log(`
    Server Information:
    ------------------
    Port: ${PORT}
    Environment: ${process.env.NODE_ENV}
    Allowed Origins: ${allowedOrigins.join(', ')}
    MongoDB: Connected
    ------------------
            `);*/
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Promise Rejection:', err);
    // Don't exit the process in production, but log the error
    if (process.env?.NODE_ENV === 'development') {
        process.exit(1);
    }
});