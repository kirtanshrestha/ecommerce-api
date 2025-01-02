import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) { }
  canActivate(
    context: ExecutionContext,
  ): boolean {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;

    if (!authHeader)
      return false;

    const token = authHeader.split(' ')[1];

    try {
      const user = this.jwtService.verify(token);
      req.user = user;
      return true;
    } catch (err) {
      return false;
    }
  }
}
