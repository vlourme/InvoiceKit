import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { hash } from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findOne(email: string): Promise<User | undefined> {
    return this.userRepository.findOne({
      where: {
        email: email,
      },
    });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Check for existing email
    if (await this.findOne(createUserDto.email)) {
      throw new HttpException('email already used', 403);
    }

    // Hash password
    const hashedPassword = await hash(createUserDto.password, 11);

    // Save
    return this.userRepository.save({
      ...createUserDto,
      password: hashedPassword,
    });
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateResult> {
    return this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number): Promise<DeleteResult> {
    return this.userRepository.delete(id);
  }
}
