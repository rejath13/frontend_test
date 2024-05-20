export const BASENAME = ""; // don't add '/' at end off BASENAME
export const BASE_URL = "/dashboard";
// export const BASE_URL = "/sandeep";
//export const BASE_TITLE = 'Locator Admin';

export const API_URL =
  "https://locatoralerts.com/control/react_api/public/index.php/";
export const DtoDApi_URL =
  "https://locatoralerts.com/control/react_api/public/index.php/dtod/";

// export const API_URL = 'https://mylocatorsoft.com/public/index.php/';
// export const DtoDApi_URL = 'https://mylocatorsoft.com/public/index.php/dtod/';

// https://locatoralerts.com/control/react_api/public/index.php/

export const CONFIG = {
  layout: "vertical", // vertical, horizontal
  subLayout: "", // null, layout-2, layout-2-2, layout-3, layout-4, layout-4-2, layout-6, layout-8
  collapseMenu: false, // mini-menu
  layoutType: "menu-dark", // menu-dark, menu-light, dark
  navIconColor: false,
  headerBackColor: "header-default", // header-default, header-blue, header-red, header-purple, header-lightblue, header-dark
  navBackColor: "navbar-default", // navbar-default, navbar-blue, navbar-red, navbar-purple, navbar-lightblue, navbar-dark
  navBrandColor: "brand-default", // brand-default, brand-blue, brand-red, brand-purple, brand-lightblue, brand-dark
  navBackImage: false, // false, navbar-image-1, navbar-image-2, navbar-image-3, navbar-image-4, navbar-image-5
  rtlLayout: false,
  navFixedLayout: true, // only for vertical layouts
  headerFixedLayout: false, // only for vertical layouts
  boxLayout: false,
  navDropdownIcon: "style1", // style1, style2, style3
  navListIcon: "style1", // style1, style2, style3, style4, style5, style6
  navActiveListColor: "active-default", // active-default, active-blue, active-red, active-purple, active-lightblue, active-dark
  navListTitleColor: "title-default", // title-default, title-blue, title-red, title-purple, title-lightblue, title-dark
  navListTitleHide: false,
  configBlock: true,
  layout6Background:
    "linear-gradient(to right, #A445B2 0%, #D41872 52%, #FF0066 100%)", // used only for pre-layout = layout-6
  layout6BackSize: "", // 'auto' - for background pattern, 'cover' - for background images & used only for pre-layout = layout-6
  jwt: {
    secret: "SECRET-KEY",
    timeout: "1 days",
  },
  firebase: {
    apiKey: "AIzaSyC9m6rMXs8PKHkJaT761AupFQdmcjQDwSY",
    authDomain: "gradient-able-react-hook.firebaseapp.com",
    projectId: "gradient-able-react-hook",
    storageBucket: "gradient-able-react-hook.appspot.com",
    messagingSenderId: "787384589233",
    appId: "1:787384589233:web:2b57c391ac41d2d1967b90",
    measurementId: "G-1D6ER7YWLL",
  },
  auth0: {
    client_id: "CkaKvwheIhIQkybjTEQwN7ikcdHObsPh",
    domain: "dev-w0-vxep3.us.auth0.com",
  },
  mailAuth: {
    client_id:
      "853239930991-tf2bf9rhtoav1v9rf9hkhjplic5emfqf.apps.googleusercontent.com",
    client_secret: "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",
  },
};

export const implementationType = [
  { label: "LOCATOR", value: "LOCATOR" },

  { label: "ASATEEL", value: "ASATEEL" },

  { label: "LOCATOR+ASATEEL", value: "LOCATOR+ASATEEL" },

  { label: "SECUREPATH", value: "SECUREPATH" },

  { label: "LOCATOR+SECUREPATH", value: "LOCATOR+SECUREPATH" },

  { label: "RASID", value: "RASID" },

  { label: "SERVICE", value: "SERVICE" },

  { label: "SHAHIN", value: "SHAHIN" },

  { label: "SECUREPATH PREMIUM", value: "SECUREPATH PREMIUM" },

  { label: "SECUREPATH PREMIUM+LOCATOR", value: "SECUREPATH PREMIUM+LOCATOR" },

  { label: "OTHER", value: "OTHER" },
];
