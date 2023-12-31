import { type NextFunction, type Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import {
  type UserCredentialsRequest,
  type UserCredentialsStructure,
} from "../../types.js";
import User from "../../../database/models/User.js";

import CustomError from "../../CustomError/CustomError.js";
import { loginUser } from "./userControllers.js";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Given a loginUser controller", () => {
  const mockToken = "user-token";

  const req: Pick<UserCredentialsRequest, "body"> = {
    body: {
      username: "admin",
      password: "admin",
      email: "any@gmail.com",
    },
  };

  const res: Pick<Response, "status" | "json"> = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  const next = jest.fn();

  jwt.sign = jest.fn().mockReturnValue(mockToken);

  describe("When it receive a request with a valid credentials and a response", () => {
    const mockUser: UserCredentialsStructure = {
      _id: new Types.ObjectId().toString(),
      username: "admin",
      password: "admin",
      email: "any@gmail.com",
    };

    User.findOne = jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(mockUser),
    });

    bcrypt.compare = jest.fn().mockResolvedValue(true);

    test("Then it should call the response's method status code with 200", async () => {
      const expectedStatusCode = 200;

      await loginUser(
        req as UserCredentialsRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
    });

    test("Then it should call the response's method json with the token", async () => {
      await loginUser(
        req as UserCredentialsRequest,
        res as Response,
        next as NextFunction
      );

      expect(res.json).toHaveBeenCalledWith({ token: mockToken });
    });
  });

  describe("When it receive a request with a not valid credentials and a response", () => {
    test("Then it should call the received next function with a 401 'Wrong Credentials' error", async () => {
      const error = new CustomError(401, "Wrong Credentials");

      User.findOne = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(undefined),
      });

      bcrypt.compare = jest.fn().mockResolvedValue(false);

      await loginUser(
        req as UserCredentialsRequest,
        res as Response,
        next as NextFunction
      );

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
