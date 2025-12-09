import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto, RegisterAuthDto, PayloadAuthDto } from './dto';
import { JwtService } from '@nestjs/jwt';
import { UsersRepository } from 'src/users/entities/user.repository';
/**
 * Service responsible for handling authentication-related operations,
 * including user registration, login, and profile retrieval.
 */
@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  private readonly saltRounds = 10;

  constructor(
    private readonly usersRepo: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Registers a new user.
   * - Validates that the email is not already taken.
   * - Hashes the password securely.
   * - Persists the user via UsersService.
   *
   * @throws ConflictException when the email already exists.
   * @throws InternalServerErrorException for unexpected failures.
   */
  async register(body: RegisterAuthDto): Promise<object> {
    // Prevent duplicate registrations.
    const existingUser = await this.usersRepo.findOneByEmail(body.email);
    if (existingUser) {
      this.logger.warn(
        `Attempted registration with existing email: ${body.email}`,
      );
      throw new ConflictException(
        `User with email '${body.email}' already exists. Please use another email.`,
      );
    }

    // Hash the password; any error is treated as a server error.
    let hashedPassword: string;
    try {
      const salt = await bcrypt.genSalt(this.saltRounds);
      hashedPassword = await bcrypt.hash(body.password, salt);
    } catch (err) {
      this.logger.error('Password hashing failed', err);
      throw new InternalServerErrorException('Failed to process password');
    }

    const newUser = {
      name: body.name,
      email: body.email,
      password: hashedPassword,
    };
    await this.usersRepo.create(newUser);

    const { password, ...rest } = newUser;
    return {
      message: 'User successfully registered.',
      ...rest,
    };
  }

  /**
   * Authenticates a user and returns a JWT token.
   *
   * @throws UnauthorizedException for invalid credentials.
   * @throws InternalServerErrorException for token generation failures.
   */
  async login(body: LoginAuthDto): Promise<object> {
    const { email, password } = body;

    const user = await this.usersRepo.findOneByEmail(email);
    if (!user) {
      this.logger.warn(`Login failed – email not found: ${email}`);
      throw new UnauthorizedException('Invalid email or password');
    }

    let passwordValid: boolean;
    try {
      passwordValid = await bcrypt.compare(password, user.password);
    } catch (err) {
      this.logger.error('Password comparison failed', err);
      throw new InternalServerErrorException('Failed to verify credentials');
    }

    if (!passwordValid) {
      this.logger.warn(`Login failed – wrong password for email: ${email}`);
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload: PayloadAuthDto = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    let accessToken: string;
    try {
      accessToken = await this.jwtService.signAsync(payload);
    } catch (err) {
      this.logger.error('JWT signing failed', err);
      throw new InternalServerErrorException('Failed to generate token');
    }
    return {
      message: 'Login successful',
      email: user.email,
      name: user.name,
      accessToken: accessToken,
    };
  }
}
