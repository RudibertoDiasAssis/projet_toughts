const express = require('express');
const router = express.Router();
const ToughtController = require('../controllers/ToughtController');


//import middware helpers

const checkAuth = require('../helpers/auth').checkAuth

router.get('/add',checkAuth, ToughtController.createTought);
router.post('/add',checkAuth, ToughtController.createToughtSave);
router.get('/dashbord',checkAuth, ToughtController.dashbord);
router.post('/remove', checkAuth, ToughtController.removeToughts);
router.get('/', ToughtController.showToughts);

module.exports = router;
