import { beforeEach, describe, expect, it, vi } from "vitest";
import { Users } from "../../../entities/User";
import userController from "../userController";
import { AppDataSource } from "../../../data-source";
import { Repository } from "typeorm";

vi.mock("typeorm");

describe("getUser() getUser method", () => {
  const mockUser: any = {
    name: "name",
    email: "email@gmail.com",
    password: "hash",
    type: "admin",
  };

  const mockFindOne = vi.fn().mockResolvedValue(mockUser);
  const usersRepositoryMock = {
    findOne: mockFindOne,
  };

  vi.spyOn(AppDataSource, "getRepository").mockReturnValue(
    usersRepositoryMock as unknown as Repository<Users>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Happy Paths
  describe("Happy paths", () => {
    it("should return the user when a valid id is provided and user exists", async () => {
      const result = await userController.getUser("email@gmail.com");

      expect(result).toEqual(mockUser);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { email: "email@gmail.com" },
      });
      expect(mockFindOne).toHaveBeenCalledTimes(1);
    });
  });

  // Edge Cases
  describe("Edge cases", () => {
    it("should throw an error with status 404 and correct message if user is not found", async () => {
      mockFindOne.mockResolvedValueOnce(undefined);
      await expect(userController.getUser("email2@gmail.com")).rejects.toEqual({
        message: "Usuário não encontrado.",
        status: 404,
      });
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { email: "email2@gmail.com" },
      });
    });
  });
});
