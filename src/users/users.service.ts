import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { User, UserDocument } from "./schemas/user.schema";
import { isValidObjectId, Model } from "mongoose";
import * as bcrypt from "bcrypt";
import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const createdUser = new this.userModel({
        ...createUserDto,
        password: hashedPassword,
      });
      return await createdUser.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new ConflictException("User with given email already exists");
      }
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException("Please provide a valid `id`");
    }
    const user = await this.userModel.findById(id).exec();
    if (user === null) {
      throw new NotFoundException(`User with id ${id} does not exist`);
    }
    return user;
  }

  async findByUsername(name: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ name }).exec();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument | null> {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    if (!isValidObjectId(id)) {
      throw new BadRequestException("Please provide a valid `id`");
    }
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string): Promise<UserDocument | null> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException("Please provide a valid `id`");
    }
    const user = await this.userModel.findById(id).exec();
    if (user === null) {
      throw new NotFoundException(`User with id ${id} does not exist`);
    }
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
