import { API_URL } from "../config/constant";
const authToken = localStorage.getItem("authToken");
const loginCheck = async () => {
  try {
    const options = {
      method: "get",
      headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Xtoken: authToken,
      },
    };

    const url = `${API_URL}isLoggedIn`;

    const response = await fetch(url, options);

    const data = await response.json();

    return data.status;
  } catch {}
};
export default loginCheck;
