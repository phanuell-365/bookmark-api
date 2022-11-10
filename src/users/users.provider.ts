import { USER_REPOSITORY } from './const';
import { User } from './entities';

export const usersProvider = [
  {
    provide: USER_REPOSITORY,
    useValue: User,
  },
];
