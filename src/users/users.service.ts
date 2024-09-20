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
        throw new ConflictException(
          `${createUserDto.email} is associated with an existing account`,
        );
      }
      throw error;
    }
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument | null> {
    await this.findOne(id);
    const email = updateUserDto.email;
    if (email) {
      let userByEmail;
      try {
        userByEmail = await this.findByEmail(email);
        if (userByEmail.id !== id) {
          throw new ConflictException(
            `${email} is associated with another existing account`,
          );
        }
      } catch (error) {
        if (!(error instanceof NotFoundException)) {
          throw error;
        }
      }
    }
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
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
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<UserDocument> {
    const user = await this.userModel.findOne({ email: email }).exec();
    if (user === null) {
      throw new NotFoundException(`No user with email ${email}`);
    }
    return user;
  }

  async remove(id: string): Promise<UserDocument | null> {
    await this.findOne(id);
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
