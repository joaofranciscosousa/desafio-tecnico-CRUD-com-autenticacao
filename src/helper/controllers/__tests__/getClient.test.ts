import { beforeEach, describe, expect, it, vi } from "vitest";
import { Clients } from "../../../entities/Clients";
import clientsController from "../clientsController";
import { AppDataSource } from "../../../data-source";
import { Repository } from "typeorm";

vi.mock("typeorm");

describe("getClient() getClient method", () => {
  const mockClient: any = {
    name: "name",
    email: "email@gmail.com",
    phone: "35912345678",
    born_date: new Date().toISOString(),
  };

  const mockFindOne = vi.fn().mockResolvedValue(mockClient);
  const clientsRepositoryMock = {
    findOne: mockFindOne,
  };

  vi.spyOn(AppDataSource, "getRepository").mockReturnValue(
    clientsRepositoryMock as unknown as Repository<Clients>
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Happy Paths
  describe("Happy paths", () => {
    it("should return the client when a valid id is provided and client exists", async () => {
      const result = await clientsController.getClient(1);

      expect(result).toEqual(mockClient);
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(mockFindOne).toHaveBeenCalledTimes(1);
    });
  });

  // Edge Cases
  describe("Edge cases", () => {
    it("should throw an error with status 404 and correct message if client is not found", async () => {
      mockFindOne.mockResolvedValueOnce(undefined);
      await expect(clientsController.getClient(999)).rejects.toEqual({
        message: "Usuário não encontrado.",
        status: 404,
      });
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: 999 },
      });
    });

    it("should handle id as a negative number", async () => {
      mockFindOne.mockResolvedValueOnce(undefined);
      await expect(clientsController.getClient(-5)).rejects.toEqual({
        message: "Usuário não encontrado.",
        status: 404,
      });
      expect(mockFindOne).toHaveBeenCalledWith({
        where: { id: -5 },
      });
    });
  });
});
