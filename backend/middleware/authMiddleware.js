import { verifyToken } from '../utils/jwt.js'; 
  
export function authMiddleware(req, res, next) { 
    try { 
        // Get token from header 
        const authHeader = req.headers.authorization; 
        if (!authHeader) { 
            return res.status(401).json({ error: 'No token provided' }); 
        }
        // Extract token (format: "Bearer <token>") 
        const token = authHeader.split(' ')[1]; 
        if (!token) { 
            return res.status(401).json({ error: 'Invalid token format' }); 
        } 
        // Verify token 
        const decoded = verifyToken(token);
        req.user = decoded;
        
        // Continue to next handler 
        next(); 
    } catch (error) { 
        console.error('Auth error:', error.message); 
        return res.status(401).json({ error: 'Unauthorized' });
    }
}