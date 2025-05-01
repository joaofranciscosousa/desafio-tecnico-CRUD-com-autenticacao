import { ValidationError } from "class-validator";
import { NextFunction, Request, Response } from "express";
import typeormValidationError from "../typeormValidationError";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("TypeormValidationError() TypeormValidationError method", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: vi.fn().mockReturnThis(),
      send: vi.fn(),
    };
    next = vi.fn();
  });

  describe("Happy paths", () => {
    it("should format and send validation errors when errors are present", () => {
      // Arrange
      const mockErrors = new ValidationError();
      mockErrors.target = {
        type: "amin",
        // name: "Nome completo",
        email: "ssss@gmail.com",
        password: "hash",
      };
      mockErrors.property = "name";
      mockErrors.children = [];
      mockErrors.constraints = {
        isString: "O campo Nome deve ser do tipo string",
        isNotEmpty: "O campo Nome não pode ser vazio",
      };

      // Act
      typeormValidationError(
        [mockErrors],
        req as Request,
        res as Response,
        next
      );

      // Assert
      expect(res.status).toHaveBeenCalledWith(422);
      expect(res.send).toHaveBeenCalledWith([
        { attribute: "name", message: "O campo Nome deve ser do tipo string" },
        { attribute: "name", message: "O campo Nome não pode ser vazio" },
      ]);
    });
  });

  describe("Edge cases", () => {
    it("should call next function when error is not an array", () => {
      // Arrange
      const mockErrors = {} as any;

      // Act
      typeormValidationError(mockErrors, req as Request, res as Response, next);

      // Assert
      expect(next).toHaveBeenCalledWith(mockErrors);
    });
  });
});
