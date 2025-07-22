import express, { type Request, Response } from 'express';
import { registerRoutes } from './routes';
import dotenv from 'dotenv';
import type { VercelRequest, VercelResponse } from '@vercel/node';


dotenv.config();

const app = express();
app.use(express.json());

let routesRegistered = false;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!routesRegistered) {
    await registerRoutes(app);
    routesRegistered = true;
  }
  return app(req, res);
}

// Load environment variables
// dotenv.config();

// Create express instance
// const app = express();
// app.use(express.json());

// Initialize the express app and routes
// export default async function handler(req: Request, res: Response) {
//   try {
//     // Register routes
//     await registerRoutes(app);
    
//     // Handle the request
//     return new Promise((resolve, reject) => {
//       app(req, res, (err: any) => {
//         if (err) {
//           console.error('Serverless function error:', err);
//           reject(err);
//           return;
//         }
//         resolve(undefined);
//       });
//     });
//   } catch (error) {
//     console.error('Serverless function error:', error);
//     const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    
//     return res.status(500).json({ 
//       error: 'Internal Server Error',
//       message: process.env.NODE_ENV === 'development' ? errorMessage : undefined
//     });
//   }
// }

// export default async function handler(
//   req: VercelRequest,
//   res: VercelResponse
// ) {
//   try {
//     await registerRoutes(app);
//     return app(req, res);
//   } catch (error) {
//     console.error('Serverless function error:', error);
//     return res.status(500).json({ 
//       error: 'Internal Server Error',
//       message: process.env.NODE_ENV === 'development' ? 
//         error instanceof Error ? error.message : 'Unknown error' 
//         : undefined
//     });
//   }
// }