const router = require('express').Router();

router.get('/', (req, res) => res.send("Server running!"));
router.use('/correcoes', require('./corrections.routes'));

module.exports = router;
