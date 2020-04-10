const router = require('express').Router();
const correctionsController = require('../controllers/corrections.controller');

router.get('/proxima', correctionsController.getNextCorrection);
router.post('/:id', correctionsController.correct);
router.post('/reservadas/:id', correctionsController.reserve);
router.get('/reservadas', correctionsController.getAllReserved);

module.exports = router;

