const router = require("express").Router();
const { ingestController, ingestBatchController } = require("../controllers/ingest.controller");
const { validate } = require("../middlewares/validate.middleware");
const { ingestSchema, ingestBatchSchema } = require("../validators/telemetry.validator");

router.post("/", validate(ingestSchema), ingestController);
router.post("/batch", validate(ingestBatchSchema), ingestBatchController);

module.exports = router;
