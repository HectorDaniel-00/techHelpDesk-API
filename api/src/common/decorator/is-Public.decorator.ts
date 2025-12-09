import { SetMetadata } from '@nestjs/common';
import { IS_PUBLIC_KEY } from 'src/constants/key/decorator-public';

export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
