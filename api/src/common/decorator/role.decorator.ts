import { SetMetadata } from '@nestjs/common';
import { ROLE_KEY } from 'src/constants/key/decorator-role';
import { Role } from '../enum/role.enum';

export const Roles = (...roles: Role[]) => SetMetadata(ROLE_KEY, roles);
