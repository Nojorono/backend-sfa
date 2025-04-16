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
      return {
        accessToken,
        refreshToken,
        user,
      };
    } catch (e) {
      throw e;
    }
  }
}
