import {
  Inject,
  Injectable,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { USER_REPOSITORY } from './const';
import * as bcrypt from 'bcrypt';
import { User } from './entities';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USER_REPOSITORY) private readonly usersRepository: typeof User,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.usersRepository.findOne({
      where: {
        username: createUserDto.username,
        email: createUserDto.email,
      },
    });

    if (user) {
      throw new PreconditionFailedException('Username or email already exists');
    }

    const salt = await bcrypt.genSalt(10);

    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

    return await this.usersRepository.create({
      ...createUserDto,
    });
  }

  async findAll() {
    return await this.usersRepository.findAll();
  }

  async findOne(id: string) {
    return await this.usersRepository.findByPk(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findByPk(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let anotherUser: User;

    if (updateUserDto.username !== user.username) {
      anotherUser = await this.usersRepository.findOne({
        where: {
          username: updateUserDto.username,
        },
      });

      if (anotherUser) {
        throw new PreconditionFailedException(
          'User with the given username already exists',
        );
      }
    }

    if (updateUserDto.email !== user.email) {
      anotherUser = await this.usersRepository.findOne({
        where: {
          username: updateUserDto.username,
        },
      });

      if (anotherUser) {
        throw new PreconditionFailedException(
          'User with the given email already exists',
        );
      }
    }

    if (updateUserDto.password) {
      const salt = await bcrypt.genSalt(10);

      updateUserDto.password = await bcrypt.hash(updateUserDto.password, salt);
    }

    return user.update({
      ...updateUserDto,
    });
  }

  async remove(id: string) {
    const user = await this.usersRepository.findByPk(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user.destroy();
  }
}
