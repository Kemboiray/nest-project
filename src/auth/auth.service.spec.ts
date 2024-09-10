import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { UsersService } from "../users/users.service";
import { JwtService } from "@nestjs/jwt";
// import { ConfigService } from "@nestjs/config";

// Create mock services
const mockUsersService = {
  // TODO: Add any methods from UsersService
  findByEmail: jest.fn(),
};

const mockJwtService = {
  // TODO: Add methods from JwtService
  sign: jest.fn(),
};

// const mockConfigService = {
//   get: jest.fn(),
// };

describe("AuthService", () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        // {
        //   provide: ConfigService,
        //   useValue: mockConfigService,
        // },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  // Add more tests here
});
