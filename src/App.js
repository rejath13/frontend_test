import React, { useEffect } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

//import { FirebaseProvider } from "./contexts/FirebaseContext";
import { JWTProvider } from "./contexts/JWTContext";
//import { Auth0Provider } from "./contexts/Auth0Context";

import routes, { renderRoutes } from "./routes";
import { BASENAME } from "./config/constant";
import loginCheck from "./middleware/loginCheck";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { CONFIG } from "./config/constant";

const App = () => {
  useEffect(() => {
    if (!loginCheck()) {
      window.location.href = "/";
    }
  }, []);

  return (
    <React.Fragment>
      <Router basename={BASENAME}>
        <GoogleOAuthProvider clientId={CONFIG.mailAuth.client_id}>
          <JWTProvider>{renderRoutes(routes)}</JWTProvider>
        </GoogleOAuthProvider>
        ;
      </Router>
    </React.Fragment>
  );
};

export default App;
