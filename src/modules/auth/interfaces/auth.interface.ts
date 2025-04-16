export interface ITokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface IAuthPayload {
  id: number;
  role_id: number;
}

export interface IGetPermissionFromRolePayload {
  role_id: number;
}

export enum TokenType {
  ACCESS_TOKEN = 'AccessToken',
  REFRESH_TOKEN = 'RefreshToken',
}
