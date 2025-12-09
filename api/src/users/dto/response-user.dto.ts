import { Role } from 'src/common/enum/role.enum';

export class CreateUserResponseDto {
  message: string;
  name?: string;
  email?: string;
  role?: Role;
}
