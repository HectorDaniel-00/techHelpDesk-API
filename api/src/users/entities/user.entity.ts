import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Role } from 'src/constants/role.enum';

@Entity({ name: 'user' })
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, length: 100 })
  name: string;

  @Column({ unique: true, nullable: false, length: 100 })
  email: string;

  @Column({ nullable: false, type: 'text' })
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.CLIENT })
  role: Role;
}
