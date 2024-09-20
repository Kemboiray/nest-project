import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "./users.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UsersGuard } from "./users.guard";
import { User } from "./schemas/user.schema";
import { Document } from "mongoose";

type UserDocument = User & Document;

describe("UsersController", () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser: UserDocument = {
    _id: "66e5d9a8d3b4a7819f7a7960",
    email: "test@example.com",
    name: "John Doe",
    password: "hashedPassword",
  } as UserDocument;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            verifyAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            getOrThrow: jest.fn(),
          },
        },
        UsersGuard,
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  describe("findAll", () => {
    it("should return an array of users", async () => {
      const result = [mockUser];
      jest.spyOn(service, "findAll").mockResolvedValue(result);

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe("findOne", () => {
    it("should return a single user", async () => {
      jest.spyOn(service, "findOne").mockResolvedValue(mockUser);

      expect(await controller.findOne("66e5d9a8d3b4a7819f7a7960")).toBe(
        mockUser,
      );
      expect(service.findOne).toHaveBeenCalledWith("66e5d9a8d3b4a7819f7a7960");
    });
  });

  describe("update", () => {
    it("should update a user", async () => {
      const updateUserDto: UpdateUserDto = { name: "Jane Doe" };
      const updatedUser = null;
      jest.spyOn(service, "update").mockResolvedValue(updatedUser);

      expect(
        await controller.update("66e5d9a8d3b4a7819f7a7960", updateUserDto),
      ).toBe(updatedUser);
      expect(service.update).toHaveBeenCalledWith(
        "66e5d9a8d3b4a7819f7a7960",
        updateUserDto,
      );
    });
  });

  describe("remove", () => {
    it("should remove a user", async () => {
      const result = null;
      jest.spyOn(service, "remove").mockResolvedValue(result);

      expect(await controller.remove("66e5d9a8d3b4a7819f7a7960")).toBe(result);
      expect(service.remove).toHaveBeenCalledWith("66e5d9a8d3b4a7819f7a7960");
    });
  });
});
