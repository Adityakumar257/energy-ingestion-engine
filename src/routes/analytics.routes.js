const router = require("express").Router();
const { performanceController } = require("../controllers/analytics.controller");

router.get("/performance/:vehicleId", performanceController);

module.exports = router;
