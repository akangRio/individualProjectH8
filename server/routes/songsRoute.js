const express = require("express");
const Controller = require("../controller/controller");
const { authentication } = require("../middleware/authentication");
const router = express.Router();

router.get("/", Controller.spotify);
router.post("/spot", Controller.spotifyToken);
router.get("/login", Controller.spotifyLogin);
router.post("/userlogin", Controller.userlogin);
router.post("/userregister", Controller.userregister);

router.post("/callback", Controller.spotifyAuthorization);

router.use(authentication);

router.get("/refreshToken", Controller.spotifyRefresh);
router.post("/search", Controller.spotifySearch);
router.post("/saveuri", Controller.saveuri);
router.get("/players", Controller.players);
module.exports = router;
