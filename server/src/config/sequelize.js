import { Sequelize } from 'sequelize';

const connection = new Sequelize(process.env.POSTGRES_URI, {
    logging: false, // Désactive les logs Sequelize
});

export default connection;
