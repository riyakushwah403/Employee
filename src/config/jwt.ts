import { ConfigService } from '@nestjs/config';

export function JWTConfig(configService: ConfigService) {
  const jwtSecret = configService.get('JWT_SECRET');
  console.log(jwtSecret);

  return {
    secret: jwtSecret,
  };
}
