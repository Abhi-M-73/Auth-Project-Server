const express = require("express");
const { userRegister, userLogin, userLogout } = require("../controllers/user.controller");
const router = express.Router();


router.post("/register", userRegister);
router.post("/login", userLogin);
router.get("/logout", userLogout);

module.exports = router;
