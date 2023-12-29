import { IsEmail, IsString, IsDefined, MinLength, IsBoolean, IsOptional, IsArray } from "class-validator";
import mongoose from "mongoose";


export class CreatePersonnelBody {
  @IsString()
  public firstName?: string;
  @IsString()
  public lastName?: string;
  @IsString()
  public nationalCode?: string;
  @IsEmail()
  @IsString()
  public email?: string;
  @IsString()
  public phoneNumber?: string;
};