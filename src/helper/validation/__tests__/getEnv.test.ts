import { beforeEach, describe, expect, it } from "vitest";
import { getEnv } from "../index";

describe("getEnv() getEnv method", () => {
  describe("Happy Paths", () => {
    beforeEach(() => {
      process.env.TEST_VAR = "testValue";
    });

    it("should return the correct environment variable value when it exists", () => {
      const result = getEnv("TEST_VAR");
      expect(result).toBe("testValue");
    });
  });

  describe("Edge Cases", () => {
    beforeEach(() => {
      delete process.env.NON_EXISTENT_VAR;
    });

    it("should throw an error when the environment variable does not exist", () => {
      expect(() => getEnv("NON_EXISTENT_VAR")).toThrow(
        "Environment variable 'NON_EXISTENT_VAR' not found"
      );
    });

    it("should throw an error when the environment variable is an empty string", () => {
      process.env.EMPTY_VAR = "";
      expect(() => getEnv("EMPTY_VAR")).toThrow(
        "Environment variable 'EMPTY_VAR' not found"
      );
    });
  });
});
