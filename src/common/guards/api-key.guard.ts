import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    const apiKey = request.headers['x-admin-api-key'];
    const validApiKey = this.configService.get<string>('ADMIN_API_KEY');

    if (!validApiKey) {
      // If env var is not set, block everything for safety
      return false;
    }

    if (apiKey !== validApiKey) {
      throw new UnauthorizedException('Invalid Admin API Key');
    }

    return true;
  }
}
