import { Controller, Post, Get, Body, Param, Res, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Response } from 'express';
import { join } from 'path';
import { existsSync } from 'fs';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() body: { username: string; password: string }) {
    const user = await this.authService.validateUser(body.username, body.password);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const accessToken = await this.authService.login(user);
    return {
      accessToken,
      userId: user.id, 
    };
  }

  @Post('register')
  async register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }

  @Get('profile-picture/:id')
  async getProfilePicture(@Param('id') id: string, @Res() res: Response) {
    try {
      const user = await this.authService.getUserById(id);

      if (!user || !user.profilePictureUrl) {
        throw new HttpException('Profile picture not found', HttpStatus.NOT_FOUND);
      }

      const filePath = join(__dirname, '..', '..', user.profilePictureUrl);
      if (!existsSync(filePath)) {
        throw new HttpException('Profile picture not found', HttpStatus.NOT_FOUND);
      }

      return res.sendFile(filePath);
    } catch (error) {
      throw new HttpException('Error while retrieving profile picture', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
