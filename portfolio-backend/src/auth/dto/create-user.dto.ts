export class CreateUserDto {
    username: string;
    fullName: string;
    birthDate: string;
    password?: string;
    passwordHash?: string;
    profilePicture?: string;
  }
  