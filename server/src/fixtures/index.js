import connection from '../config/sequelize.js';
import tokenUtils from '../utils/token.js';
import lodash from 'lodash';
import { faker } from '@faker-js/faker';
import db from "../models/index.js";

import usersFixture from './user.js';
import {uuidv4} from "uuidv7";

const { createToken } = tokenUtils();
const { sample } = lodash;

const loadUsers = async () => {
  const UserModel  = (await import('../models/User.js')).default(connection);

  try {
    const userPromises = usersFixture.map((user) => {
      user.token = createToken({
        id: user.id,
        userName: user.userName,
        email: user.email,
        role: user.role,
      });
      return UserModel.create(user);
    });

    await Promise.all(userPromises);

    const additionalUser = [];
    const nbUsers = 12;

    for (let i = 0; i < nbUsers; i++) {
      const userName = faker.internet.userName();
      const newUser = {
        id: uuidv4(),
        userName: userName,
        email: `${userName}@mail.fr`,
        password: 'MotDePasse123!',
        role: 'user',
        isVerified: true,
        loginAttempts: 0,
        token: `exampleToken${i + 1}`,
        isActive: true,
      };

      additionalUser.push(UserModel.create(newUser));
    }

    await Promise.all(additionalUser);

    console.log("Les utilisateurs ont été chargés avec succès.");
  } catch (err) {
    console.error("Erreur lors du chargement des utilisateurs :", err);
  }
};

const loadParties = async () => {
  const UserModel  = (await import('../models/User.js')).default(connection);
  const PartyModel = (await import('../models/Party.js')).default(connection);

  try {
    const users = await UserModel.findAll();

    const nbParties = 10;
    const parties = [];

    for (let i = 0; i < nbParties; i++) {
      let user1, user2;

      do {
        user1 = sample(users);
        user2 = sample(users);
      } while (user1.id === user2.id);

      const symbolUser1 = sample(['X', 'O']);
      const symbolUser2 = symbolUser1 === 'X' ? 'O' : 'X';

      const newParty = {
        id: uuidv4(),
        is_private: false,
        code: null,
        user1Id: user1.id,
        user2Id: user2.id,
        status: 'finished',
        symbolUser1: symbolUser1,
        symbolUser2: symbolUser2,
        winnerId: sample([user1.id, user2.id]),
        createdAt: faker.date.recent(),
      };

      parties.push(db.Party.create(newParty));
    }

    await Promise.all(parties);

    console.log("Les parties ont été chargées avec succès.");
  } catch (err) {
    console.error("Erreur lors du chargement des parties :", err);
  }
};


const main = async () => {
  try {
    await loadUsers();
    await loadParties();
  } catch (error) {
    console.error(error);
  } finally {
    await connection.close();
  }
};

main();
