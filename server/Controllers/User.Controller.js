import * as service from "./Auth.Controller.js";

export const register = async (req, res, next) => {
  try {
    const result = await service.registerUser(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const verify = async (req, res, next) => {
  try {
    const result = await service.verifyUserOTP(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const result = await service.loginUser(req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
};