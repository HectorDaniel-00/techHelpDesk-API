import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, CreateUserResponseDto, UpdateUserDto } from './dto';
import { UsersRepository } from './entities/user.repository';
import { UserEntity } from './entities/user.entity';
import { DeleteResult } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/common/enum/role.enum';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly saltRounds = 10;

  constructor(private readonly userRepository: UsersRepository) {}

  async create(createUserDto: CreateUserDto): Promise<CreateUserResponseDto> {
    const { password, email, name } = createUserDto;

    const existingUser = await this.userRepository.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException(
        `El email ${email} ya existe, por favor ingresar uno diferente`,
      );
    }

    let hashedPassword: string;
    try {
      const salt = await bcrypt.genSalt(this.saltRounds);
      hashedPassword = await bcrypt.hash(password, salt);
    } catch (err) {
      this.logger.error('Error al hashear la contraseña', err);
      throw new InternalServerErrorException('Error al procesar la contraseña');
    }

    const newUser = { ...createUserDto, password: hashedPassword };
    await this.userRepository.create(newUser);

    return {
      message: 'Usuario creado con éxito',
      name,
      email,
      role: Role.CLIENT,
    };
  }

  async findAll(): Promise<UserEntity[]> {
    const users = await this.userRepository.findAll();
    if (users.length === 0) {
      throw new NotFoundException('Lista de usuarios vacía');
    }
    return users;
  }

  async findOne(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne(id);
    if (!user) {
      throw new NotFoundException(
        `El usuario con el id ${id} no existe, vuelva a intentarlo con otro id`,
      );
    }
    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<CreateUserResponseDto | null> {
    const existingUser = await this.userRepository.findOne(id);
    if (!existingUser) {
      throw new NotFoundException(
        `El usuario con el id ${id} no existe, por favor cambie el dato ingresado y vuelva a intentarlo`,
      );
    }

    let hashedPassword = existingUser.password;
    try {
      if (updateUserDto.password) {
        const salt = await bcrypt.genSalt(this.saltRounds);
        hashedPassword = await bcrypt.hash(updateUserDto.password, salt);
      }
    } catch (err) {
      this.logger.error('Error al hashear la contraseña', err);
      throw new InternalServerErrorException('Error al procesar la contraseña');
    }

    const userToUpdate = {
      name: updateUserDto.name ?? existingUser.name,
      email: updateUserDto.email ?? existingUser.email,
      password: hashedPassword,
    };

    await this.userRepository.update(id, userToUpdate);
    const { password, ...rest } = userToUpdate;
    return {
      message: 'Actualizo usuario con exito',
      ...rest,
    };
  }

  async remove(id: number): Promise<CreateUserResponseDto> {
    const existingUser = await this.userRepository.findOne(id);
    if (!existingUser) {
      throw new NotFoundException(
        `El usuario con el id ${id} no existe, cambia el valor y vuelve a intentarlo`,
      );
    }
    await this.userRepository.delete(id);
    return {
      message: 'Usuario eliminado con exito',
      email: existingUser.email,
    };
  }
}
