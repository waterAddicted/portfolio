import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { join } from 'path';

const mockAuthService = () => ({
  validateUser: jest.fn(),
  login: jest.fn(),
  register: jest.fn(),
  getUserById: jest.fn(),
});

describe('AuthController', () => {
  let controller: AuthController;
  let service: ReturnType<typeof mockAuthService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useFactory: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get(AuthService);
  });

  it('should login a user and return accessToken and userId', async () => {
    const user = { id: 1, username: 'testuser' };
    service.validateUser.mockResolvedValue(user);
    service.login.mockResolvedValue('accessToken');

    const result = await controller.login({ username: 'testuser', password: 'password' });

    expect(result).toEqual({
      accessToken: 'accessToken',
      userId: user.id,
    });
  });

  it('should throw an error if login fails', async () => {
    service.validateUser.mockResolvedValue(null);

    await expect(controller.login({ username: 'invalid', password: 'password' })).rejects.toThrow(
      new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED),
    );
  });

  it('should register a new user', async () => {
    const createUserDto = { username: 'testuser', fullName: 'Test User', birthDate: '1995-05-15', password: 'password' };
    service.register.mockResolvedValue('user');

    expect(await controller.register(createUserDto)).toEqual('user');
  });

  it('should return the profile picture of a user', async () => {
    const user = { profilePictureUrl: 'uploads/profile.png' };
    const mockResponse = {
      sendFile: jest.fn(),
    } as unknown as Response;

    service.getUserById.mockResolvedValue(user);

    await controller.getProfilePicture('1', mockResponse);
    expect(mockResponse.sendFile).toHaveBeenCalledWith(
      join(__dirname, '..', '..', 'uploads/profile.png'),
    );
  });

  it('should throw an error if profile picture not found', async () => {
    service.getUserById.mockResolvedValue(null);

    await expect(controller.getProfilePicture('1', {} as Response)).rejects.toThrow(
      new HttpException('Profile picture not found', HttpStatus.NOT_FOUND),
    );
  });
});
