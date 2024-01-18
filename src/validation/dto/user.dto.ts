import { IsEmail, IsString} from "class-validator";
import { Schema } from "mongoose";


export class CreateUserBody {
  @IsString()
  public firstName?: string;
  @IsString()
  public lastName?: string;
  @IsString()
  public username?: string;
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
