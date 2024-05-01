import connection from '../config/sequelize.js';
import tokenUtils from '../utils/token.js';

// Fixtures
import usersFixture from './user.js';

const { createToken } = tokenUtils();

const loadUsers = async () => {
  const model = (await import('../models/User.js')).default(connection);

  try {
    await Promise.all(
      usersFixture.map((user) => {
        if (!user.id) {
          throw new Error("L'utilisateur doit avoir un ID");
        }

        user.token = createToken({
          id: user.id,
          userName: user.userName,
          email: user.email,
          role: user.role,
        });
        return model.create(user);
      })
    );
    console.log("Les utilisateurs ont été chargés");
  } catch (err) {
    console.error("Erreur lors du chargement des utilisateurs:", err);
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
