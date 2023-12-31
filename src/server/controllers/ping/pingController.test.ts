import { type Request, type Response } from "express";
import { pingController } from "./pingController.js";

describe("Given a pingController controller", () => {
  describe("When it receive a response", () => {
    const req = {};
    const res: Pick<Response, "status" | "json"> = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    test("Then it should invoke his status method with a 200", () => {
      const expectedStatusCode = 200;

      pingController(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(expectedStatusCode);
    });

    test("Then it should return a JSON response with the message 'Entered'", () => {
      const expectedMessage = "Entered";

      pingController(req as Request, res as Response);

      expect(res.json).toHaveBeenCalledWith({ message: expectedMessage });
    });
  });
});
