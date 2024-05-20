import { GoogleLogout } from "react-google-login";
import { CONFIG } from "../../../config/constant";

const clientId = CONFIG.auth0.client_id;

const Logout = () => {
  const onSuccess = (res) => {
    console.log("Log out successfull!");
  };

  return (
    <div id="signOutButton">
      <GoogleLogout
        clientId={clientId}
        buttonText="Logout"
        onLogoutSuccess={onSuccess}
      />
    </div>
  );
};

export default Logout;
