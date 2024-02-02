import {Sequelize} from "sequelize";

const sequelize = new Sequelize(process.env.POSTGRES_URI, {
    logging: false, // Désactive les logs Sequelize
});

export default sequelize;
