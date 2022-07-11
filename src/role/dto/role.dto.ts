import { IsLowercase, IsNotEmpty } from 'class-validator';

export class RoleDto {
  @IsNotEmpty()
  @IsLowercase()
  name: string;
}
