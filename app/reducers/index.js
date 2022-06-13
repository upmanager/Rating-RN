import { combineReducers } from "redux";
import app from "./app";
import auth from "./auth";
import user from "./user";

export default combineReducers({
  auth,
  app,
  user
});
