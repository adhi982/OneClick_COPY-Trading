import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { logger } from '../utils/logger';
import { User } from '../models/User';

export class AuthController {
   static async login(req: Request, res: Response) {
      try {
         const { walletAddress, signature } = req.body;

         if (!walletAddress || !signature) {
            return res.status(400).json({
               error: 'Wallet address and signature are required'
            });
         }

         // Verify wallet signature (simplified for demo)
         // In production, verify the signature against the wallet address

         // Check if user exists
         let user = await User.findByWalletAddress(walletAddress);

         if (!user) {
            // Create new user
            user = await User.create({
               walletAddress,
               createdAt: new Date(),
               isActive: true
            });
            logger.info(`New user created: ${walletAddress}`);
         }

         // Generate JWT token
         const token = jwt.sign(
            { userId: user.id, walletAddress: user.walletAddress },
            process.env.JWT_SECRET!,
            { expiresIn: '24h' }
         );

         res.json({
            success: true,
            token,
            user: {
               id: user.id,
               walletAddress: user.walletAddress,
               createdAt: user.createdAt
            }
         });

      } catch (error) {
         logger.error('Login error:', error);
         res.status(500).json({ error: 'Internal server error' });
      }
   }

   static async logout(req: Request, res: Response) {
      try {
         // In a real implementation, you might want to blacklist the token
         res.json({ success: true, message: 'Logged out successfully' });
      } catch (error) {
         logger.error('Logout error:', error);
         res.status(500).json({ error: 'Internal server error' });
      }
   }

   static async getProfile(req: Request, res: Response) {
      try {
         const userId = (req as any).user.userId;
         const user = await User.findById(userId);

         if (!user) {
            return res.status(404).json({ error: 'User not found' });
         }

         res.json({
            success: true,
            user: {
               id: user.id,
               walletAddress: user.walletAddress,
               createdAt: user.createdAt,
               totalValue: user.totalValue || 0,
               activePositions: user.activePositions || 0
            }
         });

      } catch (error) {
         logger.error('Get profile error:', error);
         res.status(500).json({ error: 'Internal server error' });
      }
   }

   static async updateProfile(req: Request, res: Response) {
      try {
         const userId = (req as any).user.userId;
         const { preferences } = req.body;

         const user = await User.updatePreferences(userId, preferences);

         res.json({
            success: true,
            user
         });

      } catch (error) {
         logger.error('Update profile error:', error);
         res.status(500).json({ error: 'Internal server error' });
      }
   }
}
