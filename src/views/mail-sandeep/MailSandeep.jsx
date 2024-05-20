import React, { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import Inbox from "./components/Inbox";
import Login from "./components/Login";
import Logout from "./components/Logout";
import { CONFIG } from "../../config/constant";
import jwtDecode from "jwt-decode";
import axios from "axios";

const clientId = CONFIG.mailAuth.client_id;

const MailSandeep = () => {
  const [accessToken, setAccessToken] = useState(null);

  async function exchangeTokens(identityToken) {
    const tokenEndpoint = "https://oauth2.googleapis.com/token";
    const clientId = CONFIG.mailAuth.client_id;
    const clientSecret = CONFIG.mailAuth.client_secret;

    try {
      // Make a token exchange request to Google's token endpoint
      const response = await axios.post(tokenEndpoint, {
        code: identityToken, // Assuming the identity token is the 'code' parameter
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: "YOUR_REDIRECT_URI",
        grant_type: "authorization_code",
      });

      // The response will contain an access token that can be used with the Gmail API
      const accessToken = response.data.access_token;
      console.log("Access Token:", accessToken);

      // You can now use 'accessToken' to make requests to the Gmail API
      // For example, use it as the 'Bearer' token in the Authorization header
      // when making requests to the Gmail API.
    } catch (error) {
      console.error(
        "Token exchange failed:",
        error.response ? error.response.data : error.message
      );
    }
  }
  return (
    <>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse);
          //   setAccessToken(credentialResponse.credential);
          exchangeTokens(credentialResponse.credential);
          //   console.log(
          //     "Access token: ",
          //     jwtDecode(credentialResponse.credential)
          //   );
          console.log("Successful login");
        }}
        onError={() => {
          console.log("Mail Google Authentication Login Failed");
        }}
      />
      <Inbox accessToken={accessToken} />
    </>
  );
};

export default MailSandeep;
