
import partyController from '../controllers/partyController.js';
import db from '../../src/models/index.js';
export default router => {
    router.get('/getPartiesUser',partyController(db).getPartiesUser);
    return router;
  };
  