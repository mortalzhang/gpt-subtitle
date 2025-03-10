import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { RegisterDto } from "./dto/register.dto";
import { UsersService } from "@/users/users.service";
import { JwtService } from "@nestjs/jwt";
import { getRepositoryToken } from "@nestjs/typeorm";
import { RegularUser, OAuthUser } from "@/users/users.entity";
import { RefreshToken } from "@/users/refresh-token.entity";
import { mockAccessToken, mockRegularUser } from "./testConstants";

describe("AuthController", () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        UsersService,
        JwtService,
        {
          provide: getRepositoryToken(RegularUser), // Replace 'VideoFileEntity' with your actual entity name
          useValue: {}, // Mock the repository methods you need
        },
        {
          provide: getRepositoryToken(OAuthUser), // Replace 'VideoFileEntity' with your actual entity name
          useValue: {}, // Mock the repository methods you need
        },
        {
          provide: getRepositoryToken(RefreshToken), // Replace 'VideoFileEntity' with your actual entity name
          useValue: {}, // Mock the repository methods you need
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe("signIn", () => {
    it("should return a token", async () => {
      const signInDto: RegisterDto = {
        username: "testuser",
        password: "testpassword",
      };
      jest
        .spyOn(authService, "signIn")
        .mockImplementation(async () => mockAccessToken);

      expect(await controller.signIn(signInDto)).toBe(mockAccessToken);
    });
  });

  describe("register", () => {
    it("should return a user", async () => {
      const registerDto: RegisterDto = {
        username: "testuser",
        password: "testpassword",
      };

      jest
        .spyOn(authService, "register")
        .mockImplementation(async () => Promise.resolve(mockRegularUser));

      expect(await controller.register(registerDto)).toBe(mockRegularUser);
    });
  });

  // describe("getProfile", () => {
  //   it("should return the authenticated user", () => {
  //     const user = { id: 1, username: "testuser" };
  //     expect(controller.getProfile({ user })).toBe(user);
  //   });
  // });
  describe("refreshToken", () => {
    it("should refresh access token", async () => {
      const token = "testtoken";
      jest
        .spyOn(authService, "refreshToken")
        .mockImplementation(async () => ({ access_token: mockAccessToken }));

      expect(await controller.refreshToken({ token })).toStrictEqual({
        access_token: mockAccessToken,
      });
    });
  });
});
