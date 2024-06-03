const { Router } = require("express");
const router = Router();

router.use("/contract", require('./contracts'));
router.use("/user", require('./user'));


module.exports = router;