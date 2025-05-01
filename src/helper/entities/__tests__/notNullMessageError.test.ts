import { describe, expect, it } from "vitest";
import H from "../index";

describe("notNullMessageError() notNullMessageError method", () => {
  describe("Happy Paths", () => {
    it("should return a formatted error message for a typical field name", () => {
      const fieldName = "username";
      const expectedMessage = "O campo username é obrigatório";
      expect(H.notNullMessageError(fieldName)).toBe(expectedMessage);
    });
  });

  describe("Edge Cases", () => {
    it("should return a formatted error message for an empty string field name", () => {
      const fieldName = "";
      const expectedMessage = "O campo  é obrigatório";
      expect(H.notNullMessageError(fieldName)).toBe(expectedMessage);
    });

    it("should return a formatted error message for a field name with only spaces", () => {
      const fieldName = "     ";
      const expectedMessage = "O campo  é obrigatório";
      expect(H.notNullMessageError(fieldName)).toBe(expectedMessage);
    });

    it("should handle special characters in the field name", () => {
      const fieldName = "@#$%^&*";
      const expectedMessage = "O campo @#$%^&* é obrigatório";
      expect(H.notNullMessageError(fieldName)).toBe(expectedMessage);
    });

    it("should handle numeric field names correctly", () => {
      const fieldName = "12345";
      const expectedMessage = "O campo 12345 é obrigatório";
      expect(H.notNullMessageError(fieldName)).toBe(expectedMessage);
    });

    it("should handle mixed alphanumeric field names correctly", () => {
      const fieldName = "user123";
      const expectedMessage = "O campo user123 é obrigatório";
      expect(H.notNullMessageError(fieldName)).toBe(expectedMessage);
    });
  });
});
