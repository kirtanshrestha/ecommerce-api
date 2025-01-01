import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { User } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { AuthGuard } from '../../auth/auth.guard';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
    private userService: UserService,
  ) { }
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    const req = context.switchToHttp().getRequest();
    const user = req.user;

    const userFromDb: User = await this.userService.getUserByUsername(user.username);
    if (!userFromDb) {
      throw new ForbiddenException('User not found');
    } ``

    const hasRole = requiredRoles.some(role => userFromDb.roles.includes(role));
    if (!hasRole) {
      throw new ForbiddenException('Access denied');
    }

    return true;
  }
}
