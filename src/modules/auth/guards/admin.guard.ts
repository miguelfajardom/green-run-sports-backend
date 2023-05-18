import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { UserStatusEnum } from "src/enums/user-status.enum";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRole = 'admin';
    const user = context.switchToHttp().getRequest().user;
    const userRole = user.role;

    if (userRole !== requiredRole) {
      throw new HttpException('You are not authorized to access this resource. Only administrators are allowed', HttpStatus.UNAUTHORIZED);
    }

    if (user.user_state !== UserStatusEnum.ACTIVE) {
      throw new HttpException('You are not authorized to access this resource. Only active administrators are allowed.', HttpStatus.UNAUTHORIZED);
    }

    return true;
  }
}