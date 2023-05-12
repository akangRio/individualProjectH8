const axios = require("axios");
const querystring = require("querystring");
const { User, Token, Player } = require("../models/index");
const { generateToken, verifyToken } = require("../helpers/jwt");
const { passValidator } = require("../helpers/bcrypt");
// const redirecturi = "https://final-56b4c.web.app/callback";
const redirecturi = "http://localhost:5173/callback";

class Controller {
  static async spotify(req, res, next) {
    try {
      console.log("here");
    } catch (err) {}
  }

  static async spotifyToken(req, res, next) {
    try {
      const client_id = process.env.CLIENT_ID;
      const client_secret = process.env.CLIENT_SECRET;

      const data = await axios.post(
        "https://accounts.spotify.com/api/token",
        {
          grant_type: "client_credentials",
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
              "Basic " +
              new Buffer.from(client_id + ":" + client_secret).toString(
                "base64"
              ),
          },
        }
      );
      const token = data.data;
      console.log(token, "1");
      const { access_token } = token;
      console.log(access_token);

      const strings = req.body.word;
      if (!strings) {
        throw { name: "Not Found" };
      }
      console.log(strings);

      const convert = strings.replaceAll(" ", "+");

      const search = await axios.get(
        `https://api.spotify.com/v1/search?q=${convert}&type=track&limit=10`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + access_token,
          },
        }
      );

      console.log(search.data);
      const searchedTracks = search.data.tracks.items;
      res.status(200).json(searchedTracks);
    } catch (err) {
      console.log(err);
      next(err);
    }
  }

  static async spotifyLogin(req, res, next) {
    try {
      console.log("YY");
    } catch (err) {
      console.log(err);
    }
  }

  static async spotifyAuthorization(req, res, next) {
    try {
      const { code } = req.body || null;
      let redirect_uri = redirecturi;
      console.log(code, "XXXX");
      const client_id = process.env.CLIENT_ID;
      const client_secret = process.env.CLIENT_SECRET;

      const loginSpotify = await axios.post(
        "https://accounts.spotify.com/api/token",
        {
          code: code,
          redirect_uri: redirect_uri,
          grant_type: "authorization_code",
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
              "Basic " +
              new Buffer.from(client_id + ":" + client_secret).toString(
                "base64"
              ),
          },
        }
      );
      console.log(loginSpotify.data);
      //http GET https://api.spotify.com/v1/meq

      const userData = await axios.get("https://api.spotify.com/v1/me", {
        headers: {
          Authorization: "Bearer " + loginSpotify.data.access_token,
        },
      });
      console.log(userData.data);
      console.log(userData.data.email);
      console.log(userData.data.display_name);

      const [user, created] = await User.findOrCreate({
        where: { email: userData.data.email },
        defaults: {
          email: userData.data.email,
          password: userData.data.display_name,
          role: "spotify",
        },
      });

      if (user) {
        await Token.update(
          { key: loginSpotify.data.access_token },
          { where: { userId: user.id } }
        );
      } else {
        const token = await Token.create({
          userId: user.id ? user.id : created.id,
          key: loginSpotify.data.access_token,
        });
      }

      const access_token = generateToken({
        id: user.id ? user.id : created.id,
        email: user.email ? user.email : created.id,
      });

      // const qr = await axios.post(
      //   `https://api.qr-code-generator.com/v1/create?access-token=${process.env.QR_APIKEY}`,
      //   {
      //     frame_name: "no-frame",
      //     qr_code_text: `${loginSpotify.data.uri}`,
      //     image_format: "SVG",
      //     qr_code_logo: "scan-me-square",
      //   }
      // );

      res.status(201).json({
        access_token: access_token,
        email: userData.data.email,
      });
    } catch (err) {
      console.log(err, "PPPP");
      next(err);
    }
  }

  static async spotifyRefresh(req, res, next) {
    try {
      let refresh_token = req.query.refresh_token;
      const refreshing = await axios.post(
        "https://accounts.spotify.com/api/token",
        {
          grant_type: "refresh_token",
          refresh_token: refresh_token,
        },
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization:
              "Basic " +
              new Buffer.from(client_id + ":" + client_secret).toString(
                "base64"
              ),
          },
        }
      );
    } catch (err) {
      next(err);
    }
  }

  static async spotifySearch(req, res, next) {
    try {
      const { payload } = req.identity;
      const { id } = payload;
      const { key } = await Token.findOne({ where: { userId: id } });
      const strings = req.body.word;
      if (!strings) {
        throw { name: "Not Found" };
      }
      console.log(strings);

      const convert = strings.replaceAll(" ", "+");
      const search = await axios.get(
        `https://api.spotify.com/v1/search?q=${convert}&type=track&limit=5`,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
            Authorization: "Bearer " + key,
          },
        }
      );

      console.log(search.data);
      const searchedTracks = search.data.tracks.items;
      res.status(200).json(searchedTracks);
    } catch (err) {
      next(err);
    }
  }

  static async userlogin(req, res, next) {
    try {
      console.log(req.body);
      const { email, password } = req.body;
      const select = await User.findOne({ where: { email: email } });
      if (!select) {
        throw { name: "Not Found" };
      }

      if (passValidator(password, select.password)) {
        const access_token = generateToken({
          id: select.id,
          email: select.email,
        });

        res.status(200).json({
          access_token: access_token,
          email: email,
        });
      }
    } catch (err) {
      next(err);
    }
  }

  static async userregister(req, res, next) {
    try {
      const { email, password } = req.body;
      const create = await User.create({ email, password });
      res.status(201).json({
        message: "sucessfully registered",
      });
    } catch (err) {
      next(err);
    }
  }

  static async saveuri(req, res, next) {
    try {
      const { uri } = req.body;
      console.log(uri);

      const saveURI = await Player.create({
        userId: req.identity.id,
        uri: uri,
      });
      console.log(saveURI);

      res.status(201).json({
        message: "succesfully add a Player",
      });
    } catch (err) {
      next(err);
    }
  }

  static async players(req, res, next) {
    try {
      console.log("here");
      const payload = req.identity;
      console.log(req.identity);
      const { id } = payload;
      console.log(id);
      const plays = await Player.findAndCountAll({
        where: {
          userId: id,
        },
        order: [["id", "DESC"]],
        limit: 4,
      });
      console.log(plays);

      res.status(200).json({
        players: plays.rows,
      });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = Controller;
