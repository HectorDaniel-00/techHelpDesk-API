import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto';
import { UsersRepository } from './entities/user.repository';
import * as bcrypt from 'bcrypt';
import { Role } from 'src/constants/role.enum';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  private readonly saltRounds = 10;
  constructor(private readonly userRepository: UsersRepository) {}

  async create(body: CreateUserDto): Promise<object | null> {
    const { password } = body;
    const exist = await this.userRepository.findOneByEmail(body.email);
    if (exist) {
      throw new ConflictException(
        `El email ${body.email} ya existe, por favor ingresar uno diferente`,
      );
    }
    let hashedPassword: string;
    try {
      const salt = await bcrypt.genSalt(this.saltRounds);
      hashedPassword = await bcrypt.hash(password, salt);
    } catch (err) {
      this.logger.error('Password hashing failed', err);
      throw new InternalServerErrorException('Failed to process password');
    }

    const newUser = { ...body, password: hashedPassword };

    await this.userRepository.create(newUser);
    return {
      message: 'Usuario creado con exito',
      name: body.name,
      email: body.email,
      role: Role.CLIENT,
    };
    return null;
  }

  async findAll(): Promise<Object[]> {
    const exist = await this.userRepository.findAll();
    if (exist.length <= 0) {
      throw new NotFoundException('Lista de usuarios vacia');
    }
    return exist.map((user) => ({
      message: 'Lista de usuarios encontrada con exito',
      ...user,
    }));
  }

  async findOne(id: number): Promise<object> {
    if (!id) {
      throw new BadRequestException(
        'El campo requerido esta incompleto o incorrecto',
      );
    }

    const exist = await this.userRepository.findOne(id);
    if (!exist) {
      throw new NotFoundException(
        `Error el usuario con el id ${id} no existe, vuelva a intentarlo con otro id`,
      );
    }
    return exist;
  }

  async update(id: number, body: UpdateUserDto): Promise<Object | null> {
    if (!id) {
      throw new BadRequestException(
        'El campo requerido (id) esta incompleto, por favor verifique e intente nuevamente',
      );
    }
    const existId = await this.userRepository.findOne(id);
    if (!existId) {
      throw new NotFoundException(
        `El usuario con el id ${id} no existe, por favor cambie el dato ingresado y vuelta a intentarlo`,
      );
    }
    let hashedPassword = existId.password;
    try {
      if (body.password) {
        const salt = await bcrypt.genSalt();
        hashedPassword = await bcrypt.hash(body.password, salt);
      }
    } catch (err) {
      this.logger.error('Password hashing failed', err);
      throw new InternalServerErrorException('Failed to process password');
    }

    const updateUser = {
      name: body.name ?? existId.name,
      email: body.email ?? existId.email,
      password: hashedPassword,
    };

    const result = await this.userRepository.update(id, updateUser);
    return result;
  }

  async remove(id: number) {
    if (!id) {
      throw new BadRequestException('Campo requerido esta vacio');
    }
    const existId = await this.userRepository.findOne(id);
    if (!existId) {
      throw new NotFoundException(
        `El usuario con el id ${id} no existe, cambia el valor y vuelve a intentarlo`,
      );
    }
    const remove = await this.userRepository.delete(id);
    return remove;
  }
}
