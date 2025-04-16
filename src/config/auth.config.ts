// src/config/auth.config.ts
import { registerAs } from '@nestjs/config';

export default registerAs(
  'auth',
  (): Record<string, any> => ({
    accessToken: {
      secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      expirationTime: process.env.ACCESS_TOKEN_EXPIRED,
    },
    refreshToken: {
      secret: process.env.REFRESH_TOKEN_SECRET_KEY,
      expirationTime: process.env.REFRESH_TOKEN_EXPIRED,
    },
  }),
);
