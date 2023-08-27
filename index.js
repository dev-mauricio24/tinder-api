import 'dotenv/config';
import app from "./src/app.js";
import { sequelize } from './src/database/db.js';

const port = 3000 || process.env.PORT;

(async() => {
 
  try {
    await sequelize.sync({force: true});
    app.listen(port, () => console.log(`Server is running on port ${port}`));

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
})();