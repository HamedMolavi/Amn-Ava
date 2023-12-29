import { IsString} from "class-validator";
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
  @IsString()
  public phoneNumber?: string;
};

export class UpdateUserBody {
  @IsString()
  public firstName?: string;
  @IsString()
  public lastName?: string;
  @IsString()
  public username?: string;
  @IsString()
  public password?: string;
  @IsString()
  public phoneNumber?: string;
};