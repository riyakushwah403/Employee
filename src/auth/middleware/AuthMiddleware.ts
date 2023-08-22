import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';
import { TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    console.log('Middle ware Run Successful>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
    if (!token) {
      throw new UnauthorizedException('Access denied. Token is missing.');
    }
    try {
      const decoded = this.jwtService.verify(token);
      req['user'] = decoded;
      console.log('User is authenticated.');
      next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new UnauthorizedException('Access denied. Token has expired.');
      } 
       else {
        throw new UnauthorizedException('Access denied.');
      }
    }
  }

}