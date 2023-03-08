import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";
import api from "./services/api";

// persist store
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";

// reducers
const reducer = combineReducers({
  user: userSlice,
  [api.reducerPath]: api.reducer,
});

const persistConfig = {
  key: "root",
  storage,
  blackList: [api.reducerPath],
};

// persiste store
const persistedReducer = persistReducer(persistConfig, reducer);

// create store
const store = configureStore({
  reducer: persistedReducer,
  middleware: [thunk, api.middleware],
});

export default store;
