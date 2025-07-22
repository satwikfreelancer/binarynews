import express, { type Request, Response } from 'express';
import { registerRoutes } from '../server/routes';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create express instance
const app = express();
app.use(express.json());

// Initialize the express app and routes
export default async function handler(req: Request, res: Response) {
  try {
    // Register routes
    await registerRoutes(app);
    
    // Handle the request
    return new Promise((resolve, reject) => {
      app(req, res, (err: any) => {
        if (err) {
          console.error('Serverless function error:', err);
          reject(err);
          return;
        }
        resolve(undefined);
      });
    });
  } catch (error) {
    console.error('Serverless function error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
    return res.status(500).json({ 
      error: 'Internal Server Error',
      message: process.env.NODE_ENV === 'development' ? errorMessage : undefined
    });
  }
}