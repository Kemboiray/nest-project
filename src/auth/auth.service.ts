import { Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "../users/users.service";
import * as bcrypt from "bcrypt";
import { LogInDto } from "./dto/login.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async logIn(logInDto: LogInDto): Promise<any> {
    const { email, password: pass } = logInDto;
    const user = await this.usersService.findByEmail(email);
    const passwordMatch = await bcrypt.compare(pass, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException("Invalid credentials");
    }
    const payload = { sub: user.id, name: user.name };
    return {
      token_type: "Bearer",
      expires_in: this.configService.getOrThrow("auth.jwtExpiry"),
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
