import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRole = 'user';
    const user = context.switchToHttp().getRequest().user;
    const userRole = user.role;

    if (userRole !== requiredRole) {
      throw new HttpException('You are not authorized to access this resource. Only users are allowed', HttpStatus.UNAUTHORIZED);
    }

    return true;
  }
}