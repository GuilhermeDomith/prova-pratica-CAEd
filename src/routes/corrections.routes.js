const router = require('express').Router();
const correctionsController = require('../controllers/corrections.controller');

router.get('/proxima', correctionsController.getNext);
router.post('/:id', correctionsController.correct);

router.post('/reservadas/:id', correctionsController.reserve);
router.get('/reservadas', correctionsController.getAllReserved);

router.post('/defeituosas/:id', correctionsController.markAsBrocked);

module.exports = router;

