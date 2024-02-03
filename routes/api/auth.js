const express = require("express");

const services = require("../../services/authService");
const schemas = require("../../schemas/users");
const validateBody = require("../../middlewares/validateBody");
const authorize = require("../../middlewares/authorize");

const router = express.Router();

router.post("/signup", validateBody(schemas.logAndRegSchema), services.signup);

router.post("/login", validateBody(schemas.logAndRegSchema), services.login);

router.post("/logout", authorize, services.logout);

router.get("/current", authorize, services.current);

module.exports = router;
