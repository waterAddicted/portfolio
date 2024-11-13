import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from 'src/auth/user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { writeFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService, private userService: UserService) {}

  async validateUser(userName: string, pass: string): Promise<any> {
    const user = await this.userService.findByUserName(userName);
    if (user && (await bcrypt.compare(pass, user.passwordHash))) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { userName: user.userName, sub: user.id };
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async register(userDetails: CreateUserDto) {
    const passwordHash = await bcrypt.hash(userDetails.password, 10);
    const { password: _, profilePicture, birthDate, ...userParams } = userDetails;
  
    let profilePictureUrl = null;
  
    if (profilePicture) {
      const fileName = `${userParams.username}-${Date.now()}.png`;
      const filePath = join(__dirname, '..', '..', 'uploads', fileName);
      const base64Data = profilePicture.replace(/^data:image\/\w+;base64,/, '');
      writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
  
      profilePictureUrl = `/uploads/${fileName}`;
    }
  
    const formattedBirthDate = new Date(birthDate);
  
    return this.userService.register({
      ...userParams,
      passwordHash,
      profilePictureUrl, 
      birthDate: formattedBirthDate, 
    });
  }

  async getUserById(id: string) {
    return this.userService.findById(id);
  }
}
