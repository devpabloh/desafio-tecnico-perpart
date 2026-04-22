import { Body, Controller, Post } from '@nestjs/common';
import { z } from 'zod';
import { AuthenticateService } from '../services/authenticate.service';
import { ZodValidationPipe } from 'src/@shared/pipes/zod-validation.pipe';

export const authenticateSchema = z.object({
  email: z.email(),
  password: z.string(),
});

export type AuthenticateDto = z.infer<typeof authenticateSchema>;

@Controller('auth')
export class AuthController {
  constructor(private authenticateService: AuthenticateService) {}

  @Post('login')
  async login(
    @Body(new ZodValidationPipe(authenticateSchema))
    body: AuthenticateDto,
  ) {
    return this.authenticateService.execute(body);
  }
}
