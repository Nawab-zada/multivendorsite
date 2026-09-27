const express = require("express");
const protect = require("../middlewares/authMiddleware");
const {
	registerUser,
	loginUser,
	getCurrentUser,
} = require("../controllers/authController");
const validateMiddleware = require("../middlewares/validateMiddleware");
const { registerSchema, loginSchema } = require("../validators/authValidator");

const router = express.Router();

router.post("/register", validateMiddleware(registerSchema), registerUser);
router.post("/login", validateMiddleware(loginSchema), loginUser);
router.get("/me", protect, getCurrentUser);

module.exports = router;
