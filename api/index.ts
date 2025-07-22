import { app } from '../server/index';
import { registerRoutes } from '../server/routes';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize the express app and routes
export default async function handler(req: any, res: any) {
  try {
    const server = await registerRoutes(app);
    return app(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    
    // Type guard for the error
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
}