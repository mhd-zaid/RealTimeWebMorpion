import { v4 as uuidv4 } from 'uuid';

const usersFixture = [
  {
    id: uuidv4(),
    userName: 'ZaidMouhamad',
    email: 'zad@mail.fr',
    password: 'MotDePasse123!',
    role: 'user',
    isVerified: true,
    loginAttempts: 0,
    token: 'exampleToken4',
    isActive: true,
  },
  {
    id: uuidv4(),
    userName: 'JugurthaZekhnine',
    email: 'jug@mail.fr',
    password: 'MotDePasse123!',
    role: 'user',
    isVerified: true,
    loginAttempts: 0,
    token: 'exampleToken5',
    isActive: true,
  },
  {
    id: uuidv4(),
    userName: 'DanielManea',
    email: 'dan@mail.fr',
    password: 'MotDePasse123!',
    role: 'user',
    isVerified: true,
    loginAttempts: 0,
    token: 'exampleToken6',
    isActive: true,
  },
  {
    id: uuidv4(),
    userName: 'MakanKamissoko',
    email: 'mak@mail.fr',
    password: 'MotDePasse123!',
    role: 'user',
    isVerified: true,
    loginAttempts: 0,
    token: 'exampleToken7',
    isActive: true,
  },
];

export default usersFixture;
