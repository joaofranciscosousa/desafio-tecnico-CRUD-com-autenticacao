import { describe, vi, expect, it } from "vitest";
import { createPagination } from "..";

describe("createPagination() createPagination method", () => {
  describe("Happy paths", () => {
    it("should return correct pagination for typical values", () => {
      const mockPage = 2;
      const mockPerPage = 10;
      const mockCount = 35;

      const result = createPagination(mockPage, mockPerPage, mockCount);

      expect(result).toEqual({
        current: mockPage,
        per_page: mockPerPage,
        pages: 4,
        count: mockCount,
      });
    });

    it("should return 1 page when count is less than per_page", () => {
      const mockPage = 1;
      const mockPerPage = 10;
      const mockCount = 5;

      const result = createPagination(mockPage, mockPerPage, mockCount);

      expect(result.pages).toBe(1);
      expect(result.current).toBe(mockPage);
      expect(result.per_page).toBe(mockPerPage);
      expect(result.count).toBe(mockCount);
    });
  });

  // Edge Case Tests
  describe("Edge cases", () => {
    it("should return 0 pages when count is 0", () => {
      const mockPage = 1;
      const mockPerPage = 10;
      const mockCount = 0;

      const result = createPagination(mockPage, mockPerPage, mockCount);

      expect(result.pages).toBe(0);
      expect(result.count).toBe(mockCount);
    });

    it("should return Infinity pages when per_page is 0", () => {
      const mockPage = 1;
      const mockPerPage = 0;
      const mockCount = 10;

      const result = createPagination(mockPage, mockPerPage, mockCount);

      expect(result.pages).toBe(Infinity);
    });

    it("should handle negative count gracefully", () => {
      const mockPage = 1;
      const mockPerPage = 5;
      const mockCount = -10;

      const result = createPagination(mockPage, mockPerPage, mockCount);

      expect(result.pages).toBe(-2);
    });

    it("should handle negative per_page gracefully", () => {
      const mockPage = 1;
      const mockPerPage = -5;
      const mockCount = 10;

      const result = createPagination(mockPage, mockPerPage, mockCount);

      expect(result.pages).toBe(-2);
    });

    it("should handle negative page number", () => {
      const mockPage = -3;
      const mockPerPage = 10;
      const mockCount = 50;

      const result = createPagination(mockPage, mockPerPage, mockCount);

      expect(result.current).toBe(mockPage);
      expect(result.pages).toBe(5);
    });

    it("should handle large numbers correctly", () => {
      const mockPage = 1;
      const mockPerPage = 1000;
      const mockCount = 1_000_000;

      const result = createPagination(mockPage, mockPerPage, mockCount);

      expect(result.pages).toBe(1000);
    });
  });
});
