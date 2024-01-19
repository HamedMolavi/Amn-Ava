import { IsEmail, IsString, MinLength } from "class-validator";
import { Schema } from "mongoose";
import { PasswordValidator } from "../password";
import { UserPasswordRequirements } from "../../types/interfaces/user.interface";


export class CreateUserBody {
  @IsString()
  @MinLength(3)
  public firstName?: string;
  @IsString()
  @MinLength(3)
  public lastName?: string;
  @IsString()
  @MinLength(3)
  public username?: string;
  @PasswordValidator(UserPasswordRequirements, { message: "password should be strong!" })
  @IsString()
  public password?: string;
  @IsEmail()
  @IsString()
  public email?: string;
};

export class UpdateUserBody {
  @IsString()
  public firstName?: string;
  @IsString()
  public lastName?: string;
  @IsString()
  public username?: string;
  @IsString()
  public email?: string;
};
