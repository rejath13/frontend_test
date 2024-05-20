// googleMapSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  name: "",
  address: "",
  lat: null,
  lng: null,
};

const googleMapSlice = createSlice({
  name: "googleMap",
  initialState,
  reducers: {
    setGoogleMapLocation: (state, action) => {
      const { address, lat, lng } = action.payload;
      if (action.payload.name) {
        state.name = action.payload.name;
      }
      state.address = address;
      state.lat = lat;
      state.lng = lng;
    },
    resetGoogleMapLocation: (state, action) => {
      state.address = initialState.address;
      state.lat = initialState.lat;
      state.lng = initialState.lng;
    },
  },
});

// Reducer ====================================================/
export default googleMapSlice.reducer;

// Actions ====================================================/
export const { setGoogleMapLocation, resetGoogleMapLocation } =
  googleMapSlice.actions;

// Selectors ====================================================/
export const getGoogleMapLocation = (state) => state.googleMap;
