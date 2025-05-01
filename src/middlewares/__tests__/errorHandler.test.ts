import { NextFunction, Request, Response } from "express";
import errorHandler from "../errorHandler";
import { beforeEach, describe, expect, it, vi } from "vitest";

describe("errorHandler() errorHandler method", () => {
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

  describe("Happy Paths", () => {
    it("should handle an error with a status and message", () => {
      // Arrange
      const mockErrors = { status: 400, message: "Bad Request" };

      // Act
      errorHandler(mockErrors, req as Request, res as Response, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith({ message: "Bad Request" });
    });

    it("should handle an error with extraData", () => {
      // Arrange
      const mockErrors = {
        status: 404,
        message: "Not Found",
        extraData: { resource: "User" },
      };

      // Act
      errorHandler(mockErrors, req as Request, res as Response, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        message: "Not Found",
        resource: "User",
      });
    });
  });

  // Edge Case Tests
  describe("Edge Cases", () => {
    // Arrange
    it("should handle an error without a status, defaulting to 500", () => {
      const mockErrors = { message: "Unknown Error" };

      // Act
      errorHandler(mockErrors, req as Request, res as Response, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: "Unknown Error" });
    });

    it("should handle a non-object error, treating it as a message", () => {
      // Arrange
      const mockErrors = "String error";

      // Act
      errorHandler(mockErrors, req as Request, res as Response, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: "String error" });
    });

    it("should handle an error with undefined extraData", () => {
      // Arrange
      const mockErrors = {
        status: 500,
        message: "Server Error",
        extraData: undefined,
      };

      // Act
      errorHandler(mockErrors, req as Request, res as Response, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({ message: "Server Error" });
    });
  });
});
