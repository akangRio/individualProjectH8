const axios = require("axios");
const querystring = require("querystring");

class Controller {
  static async spotify(req, res, next) {
    try {
      console.log("here");
    } catch (err) {}
  }

  static async spotifyToken(req, res, next) {
    try {
      const client_id = "ccccac09d6a642e7b4d45b5ede1e7525";
      const client_secret = "d0fec30a049c4886a98cd0d827f90004";
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
    } catch (err) {
      console.log(err);
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
      let redirect_uri = "http://localhost:5173/callback";
      console.log("XX");
      const client_id = "ccccac09d6a642e7b4d45b5ede1e7525";
      const client_secret = "d0fec30a049c4886a98cd0d827f90004";
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
    } catch (err) {
      console.log(err);
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
      console.log(err);
    }
  }

  static async spotifySearch(req, res, next) {
    try {
      const strings = "semata karena mu";

      const convert = strings.replace(" ", "+");
      const search = await axios.get(
        `'https://api.spotify.com/v1/search?q=${convert}&type=track&include_external=audio'`
      );

      console.log(search);
    } catch (err) {
      console.log(err);
    }
  }
}

module.exports = Controller;
