import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PermissionType, Roles } from '@prisma/client';
import { PrismaService } from 'src/common/services/prisma.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Roles[]>('role', [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    const method = request.method;

    const userPermissions = await this.prismaService.permissions.findMany({
      where: {
        role: user.role,
      },
    });

    const hasPermission = (permissionType: PermissionType) => {
      return userPermissions.some(
        (permission) => permission.permission_type === permissionType,
      );
    };

    let permissionGranted = false;

    switch (method) {
      case 'GET':
        permissionGranted =
          hasPermission(PermissionType.View) ||
          hasPermission(PermissionType.Manage);
        break;
      case 'POST':
      case 'PUT':
        permissionGranted =
          hasPermission(PermissionType.Create) ||
          hasPermission(PermissionType.Update) ||
          hasPermission(PermissionType.Manage);
        break;
      case 'DELETE':
        permissionGranted =
          hasPermission(PermissionType.Delete) ||
          hasPermission(PermissionType.Manage);
        break;
      default:
        throw new ForbiddenException('notHaveEnoughPermissions');
    }

    if (!permissionGranted) {
      throw new ForbiddenException('notHaveEnoughPermissions');
    }

    return true;
  }
}
