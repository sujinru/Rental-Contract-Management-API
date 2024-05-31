const { Router } = require("express");
const router = Router();

router.use("/auth", require('./auth').router);
router.use("/contract", require('./contracts'));
router.use("/manage", require('./manage'));


module.exports = router;