const express = require("express");
const Controller = require("../controller/controller");
const router = express.Router();

router.get("/", Controller.spotify);
router.get("/spot", Controller.spotifyToken);
router.get("/login", Controller.spotifyLogin);
router.get("/callback", Controller.spotifyAuthorization);
router.get("/refreshToken", Controller.spotifyRefresh);
module.exports = router;
