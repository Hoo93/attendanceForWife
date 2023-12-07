import { IsString } from "class-validator";

export class SigninDto {

  @IsString()
  id:string;

  @IsString()
  password:string
}