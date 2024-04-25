import { UserDTO } from '@shared/model/userDTO';
import { User } from './interface';

export const admin: User = {
  id: 1,
  name: 'Hello, User',
  email: 'user@techvg.com',
  avatar: './assets/images/avatar.png',
};

export const guest: UserDTO = {
  id: 0,
  firstName: 'unknown',
  email: 'unknown',
  avatar: './assets/images/avatar.png',
  roles: ['']
};
