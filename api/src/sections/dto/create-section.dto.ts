import { IsHexColor, IsNotEmpty, IsString } from 'class-validator';

export class CreateSectionDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsHexColor()
  bg_color!: string;
}
