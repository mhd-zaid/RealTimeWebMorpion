import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';
import connection from '../config/sequelize.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const db = {};

try {
  const files = await fs.readdir(__dirname);

  for (const file of files) {
    if (file === 'index.js') continue;

    const modulePath = pathToFileURL(join(__dirname, file)).toString();
    const model = (await import(modulePath)).default(connection);
    db[model.name] = model;
  }

  for (const model in db) {
    if (model === connection) continue;
    if (db[model].associate) {
      db[model].associate(db);
    }
    if (db[model].addHooks) {
      db[model].addHooks(db);
    }
  }

  db.connection = connection;
} catch (error) {
  console.error('Error reading or importing files:', error);
}

export default db;
