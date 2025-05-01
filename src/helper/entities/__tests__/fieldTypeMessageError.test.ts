import { describe, expect, it } from "vitest";
import H from "../index";

describe("fieldTypeMessageError() fieldTypeMessageError method", () => {
  describe("Happy Paths", () => {
    it("should return a correctly formatted error message for valid field and type", () => {
      const field = "nome";
      const type = "string";
      const expectedMessage = "O campo nome deve ser do tipo string";
      expect(H.fieldTypeMessageError(field, type)).toBe(expectedMessage);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty field and type strings gracefully", () => {
      const field = "";
      const type = "";
      const expectedMessage = "O campo  deve ser do tipo ";
      expect(H.fieldTypeMessageError(field, type)).toBe(expectedMessage);
    });

    it("should handle field and type strings with only spaces", () => {
      const field = "   ";
      const type = "   ";
      const expectedMessage = "O campo  deve ser do tipo ";
      expect(H.fieldTypeMessageError(field, type)).toBe(expectedMessage);
    });

    it("should handle special characters in field and type", () => {
      const field = "@field!";
      const type = "#*type%$";
      const expectedMessage = "O campo @field! deve ser do tipo #*type%$";
      expect(H.fieldTypeMessageError(field, type)).toBe(expectedMessage);
    });

    it("should handle numeric strings in field and type", () => {
      const field = "123";
      const type = "456";
      const expectedMessage = "O campo 123 deve ser do tipo 456";
      expect(H.fieldTypeMessageError(field, type)).toBe(expectedMessage);
    });
  });
});
