const express = require("express");

const services = require("../../services/authService");
const schemas = require("../../schemas/users");
const validateBody = require("../../middlewares/validateBody");
const authorize = require("../../middlewares/authorize");
const upload = require("../../middlewares/upload");

const router = express.Router();

router.post("/signup", validateBody(schemas.logAndRegSchema), services.signup);

router.post("/login", validateBody(schemas.logAndRegSchema), services.login);

router.post("/logout", authorize, services.logout);

router.get("/current", authorize, services.current);

router.patch(
  "/avatars",
  authorize,
  upload.single("avatar"),
  services.updateUserAvatar
);

router.get("/verify/:verificationToken", services.verifyEmailByToken);

router.post(
  "/verify",
  validateBody(schemas.emailVerifySchema),
  services.resendVerificationEmail
);

module.exports = router;
