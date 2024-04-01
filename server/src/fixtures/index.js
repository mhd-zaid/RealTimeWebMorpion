import connection from '../config/sequelize.js';
// Fixtures
import db from '../models/index.js';
import usersFixture from './user.js';

const loadUsers = async () => {
  const model = (await import('../models/User.js')).default(connection);
  try {
    await Promise.all(
      usersFixture.map(user => model.create(user)),
    );
    console.log('Users loaded');
  } catch (err) {
    console.error(err);
  }

}

const getUsersByUsername = async userName => {
  const model = (await import('../models/User.js')).default(connection);
  try {
    const user = await model.findOne({ where: { userName: userName } });
    return user;
  }catch (err) {
    console.error(err);
  }
};

const main = async () => {
  try {
    await loadUsers();
  } catch (error) {
    console.error(error);
  } finally {
    connection.close();
  }
};

main();
