// server/controllers/auth/auth-controller.js 
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as db from '../../db/index.js';

// Cookie options based on environment 
export const getCookieOptions = () => {
    const isProduction = process.env.NODE_ENV === 'production';
    return {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        path: '/',
        expires: new Date(Date.now() + 7200000) // 2 hours
    };
};

// register
export const registerUser = async(req, res) => {
    const {userName, email, password } = req.body;
    try {
        const mUser = await db.isValidUser(email);
        if(mUser) {
            return res.json({
                success: false,
                message: "User Already exists with the same email! Please try again"
            });
        }
        const hashPassword = await bcrypt.hash(password, 12);
        const [fname, lname] = userName.split(' ');
        await db.createUser({fname, lname, email, password:hashPassword});
        res.status(200).json({
            success: true,
            message: "Registration Successful",
        });
    } catch(e) {
        console.error('Registration error:', e);
        res.status(500).json({
            success: false,
            message: "Some error occurred",
        });
    }
};

// login
export const loginUser = async(req, res) => {
    const { email, password } = req.body;
    try { 
        //const mUser = await fetch().then((res) => res.json());
        const mUser = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if(!mUser) {
            return res.json({
                success: false, 
                message: "Wrong Credentials"
            });
        }
        const isRealPassWord = await bcrypt.compare(password, mUser[0].password);
        // const checkPasswordMatch = true;
        // if (!checkPasswordMatch) {
        //     return res.json({
        //         success: false,
        //         message: "Wrong Credentials, please try again",
        //     });
        // }
        
        const user = {
            id: mUser[0]?._id, 
            role: mUser[0]?.role, 
            email: mUser[0]?.email,
            userName: mUser[0]?.fname,
        };
        console.log("Connected user : ", user);
        const token = jwt.sign(user, 'CLIENT_SECRET_KEY', { expiresIn: '120m' });
        
        res.cookie('token', token, getCookieOptions()).json({
            success: true,
            message: 'Logged in successfully',
            user: {...user},
            token: token
        });
    } catch(e) {
        console.error('Login error:', e);
        res.status(500).json({
            success: false,
            message: "Some error occurred",
        });
    }
};

// logout
export const logoutUser = (req, res) => {
    try {
        res.clearCookie('token', getCookieOptions()).json({
            success: true,
            message: 'Logged out successfully!'
        });
    } catch(e) {
        //console.error('Logout error:', e);
        res.status(500).json({
            success: false,
            message: "Error during logout"
        });
    }
};

// // middleware
// const authMiddleware = async(req, res, next) => {
//     const token = req.cookies.token;

//     if (!token) {
//         return res.status(401).json({
//             success: false,
//             message: 'Unauthorized user! Token is missing'
//         });
//     }

//     try {
//         const decoded = jwt.verify(token, 'CLIENT_SECRET_KEY');
//         req.user = decoded;
//         next();
//     } catch (error) {
//         if (error.name === 'TokenExpiredError') {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Session expired! Please log in again.'
//             });
//         }
//         return res.status(401).json({
//             success: false,
//             message: 'Unauthorized user! Invalid token'
//         });
//     }
// };
// middleware

export const authMiddleware = async(req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];    // we're call the check auth from our App.jsx

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized user! Token is missing'
        });
    }

    try {
        const decoded = jwt.verify(token, 'CLIENT_SECRET_KEY');
        req.user = decoded;
        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Session expired! Please log in again.'
            });
        }
        return res.status(401).json({
            success: false,
            message: 'Unauthorized user! Invalid token'
        });
    }
};