import { ConsoleLogger, Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';

interface UserPayload {
  id: string;
}

declare module 'express' {
  export interface Request {
    user?: UserPayload;
  }
}

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  private logger = new ConsoleLogger(JwtMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    this.logger.log(`Incoming Request: ${req.method} ${req.url}`);
    this.logger.log(`Headers: ${JSON.stringify(req.headers)}`);
    this.logger.log(`Body: ${JSON.stringify(req.body)}`);

    const authHeader = req.headers['authorization'];
    const BEARER_PREFIX = 'Bearer ';

    if (!authHeader || !authHeader.startsWith(BEARER_PREFIX)) {
      this.logger.warn('No token provided');
      throw new UnauthorizedException('No token provided');
    }

    const token = authHeader.substring(BEARER_PREFIX.length);
    const JWT_SECRET = process.env.SUPABASE_JWT_TOKEN || 'default-secret';

    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { sub: string };
      req.user = { id: decoded.sub };
      this.logger.log(`User Authenticated: ${decoded.sub}`);
      next();
    } catch (error) {
      this.logger.error('Invalid or expired token', error.message);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
