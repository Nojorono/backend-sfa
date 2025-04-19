import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import {
  IAuthPayload,
  IGetPermissionFromRolePayload,
  ITokenResponse,
  TokenType,
} from '../interfaces/auth.interface';
import { UserService } from '../../user/services/user.service';
import { UserLoginDto } from '../dtos/auth.login.dto';
import { HelperHashService } from './helper.hash.service';
import { IAuthService } from '../interfaces/auth.service.interface';
import { AuthResponseDto } from '../dtos/auth.response.dto';
import { Permissions } from '@prisma/client';
import { PrismaService } from 'src/common/services/prisma.service';
import { RedisService } from 'src/common/services/redis.service';

@Injectable()
export class AuthService implements IAuthService {
  private readonly accessTokenSecret: string;
  private readonly refreshTokenSecret: string;
  private readonly accessTokenExp: string;
  private readonly refreshTokenExp: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly helperHashService: HelperHashService,
    private readonly prismaService: PrismaService,
    private readonly redisService: RedisService,
  ) {
    this.accessTokenSecret = this.configService.get<string>(
      'auth.accessToken.secret',
    );
    this.refreshTokenSecret = this.configService.get<string>(
      'auth.refreshToken.secret',
    );
    this.accessTokenExp = this.configService.get<string>(
      'auth.accessToken.expirationTime',
    );
    this.refreshTokenExp = this.configService.get<string>(
      'auth.refreshToken.expirationTime',
    );
  }

  private readonly SESSION_PREFIX = 'session:';
  private readonly USER_PREFIX = 'user:';

  async getPermissionsFromRole({
    role_id,
  }: IGetPermissionFromRolePayload): Promise<Permissions[]> {
    return this.prismaService.permissions.findMany({
      where: {
        role_id,
      },
    });
  }

  async verifyToken(accessToken: string): Promise<IAuthPayload> {
    try {
      const data = await this.jwtService.verifyAsync(accessToken, {
        secret: this.accessTokenSecret,
      });
      return data;
    } catch (e) {
      throw e;
    }
  }

  async generateTokens(user: IAuthPayload): Promise<ITokenResponse> {
    try {
      const accessTokenPromise = this.jwtService.signAsync(
        {
          id: user.id,
          role_id: user.role_id,
          dateNow: new Date().toISOString(),
          tokenType: TokenType.ACCESS_TOKEN,
        },
        {
          secret: this.accessTokenSecret,
          expiresIn: this.accessTokenExp,
        },
      );
      const refreshTokenPromise = this.jwtService.signAsync(
        {
          id: user.id,
          role_id: user.role_id,
          dateNow: new Date().toISOString(),
          tokenType: TokenType.REFRESH_TOKEN,
        },
        {
          secret: this.refreshTokenSecret,
          expiresIn: this.refreshTokenExp,
        },
      );
      const [accessToken, refreshToken] = await Promise.all([
        accessTokenPromise,
        refreshTokenPromise,
      ]);
      return {
        accessToken,
        refreshToken,
      };
    } catch (e) {
      throw e;
    }
  }

  async login(data: UserLoginDto): Promise<AuthResponseDto> {
    try {
      const { email, password } = data;
      const user = await this.userService.getUserByEmail(email);
      if (!user) {
        throw new NotFoundException('userNotFound');
      }
      const match = this.helperHashService.match(user.password, password);
      if (!match) {
        throw new NotFoundException('invalidPassword');
      }
      const { accessToken, refreshToken } = await this.generateTokens({
        id: user.id,
        role_id: user.role_id,
      });
      const sessionKey = `${this.SESSION_PREFIX}${accessToken}`;
      const userKey = `${this.USER_PREFIX}${user.id}`;

      const sessionData = {
        userId: user.id,
        token: accessToken,
        deviceInfo: data.device_info,
        ipAddress: data.ip_address,
        createdAt: new Date().toISOString(),
      };

      const currentToken = await this.redisService.get(userKey);
      if (currentToken) {
        await this.redisService.del(`${this.SESSION_PREFIX}${currentToken}`);
      }
      await this.redisService.set(sessionKey, sessionData, 30 * 60); // 30 minutes
      await this.redisService.set(userKey, accessToken, 30 * 60); // 30 minutes

      await this.prismaService.users.update({
        where: { id: user.id },
        data: {
          last_login: new Date(),
        },
      });

      const roleWithMenus = await this.prismaService.roles.findUnique({
        where: { id: user.role_id },
        include: {
          permissions: {
            include: {
              menu: true,
            },
          },
        },
      });

      const menus = roleWithMenus.permissions.map((perm) => perm.menu);

      return {
        accessToken,
        refreshToken,
        user,
        menus,
      };
    } catch (e) {
      throw e;
    }
  }

  async validateToken(accessToken: string): Promise<any | null> {
    const sessionKey = `${this.SESSION_PREFIX}${accessToken}`;
    const sessionData = await this.redisService.get(sessionKey);

    if (!sessionData) {
      return null;
    }

    const parsedData = JSON.parse(sessionData);
    const userKey = `${this.USER_PREFIX}${parsedData.userId}`;

    // Verify that this token is the current active token for this user
    const currentToken = await this.redisService.get(userKey);
    if (currentToken !== accessToken) {
      // This token is not the current active token
      return null;
    }

    return parsedData;
  }
}
