import { expect, vi, describe, it, beforeEach } from "vitest";
import request from "supertest";
import createAppServer from "../../../utils/tests/createAppServer";
import ClientsController from "../../ClientsController";
import { AppDataSource } from "../../../data-source";
import { Repository } from "typeorm";
import { Clients } from "../../../entities/Clients";
import H from "../../../helper/controllers/clientsController";

// Mocks
vi.mock("typeorm");

vi.mock("../../../middlewares/tokenAuthorization", () => ({
  __esModule: true,
  default: vi.fn((req, res, next) => next()),
}));

describe("Controller ClientsController", () => {
  const NAMESPACE = "/clients";

  // Arrange
  const mockClient: any = {
    id: 3,
    name: "name",
    email: "email@gmail.com",
    phone: "35912345678",
    born_date: new Date().toISOString(),
  };

  const mockRemove = vi.fn().mockResolvedValue(mockClient);
  const clientsRepositoryMock = {
    remove: mockRemove,
  };

  vi.spyOn(AppDataSource, "getRepository").mockReturnValue(
    clientsRepositoryMock as unknown as Repository<Clients>
  );

  const app = createAppServer([ClientsController]);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /clients", () => {
    describe("Happy path", () => {
      it("should create a client successfully", async () => {
        const mockGetClient = vi
          .spyOn(H, "getClient")
          .mockImplementationOnce(() => {
            return mockClient;
          });

        // Act
        const response = await request(app).delete(NAMESPACE + "/3");

        // Assert
        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual("Usuário excluido com sucesso");
        expect(mockGetClient).toHaveBeenCalledTimes(1);
        expect(mockRemove).toHaveBeenCalledTimes(1);
      });
    });

    describe("Edge Cases", () => {
      it("should return 404 if no client was found", async () => {
        const mockGetClient = vi
          .spyOn(H, "getClient")
          .mockImplementationOnce(() =>
            Promise.reject({
              message: "Usuário não encontrado.",
              status: 404,
            })
          );

        // Act
        const response = await request(app).delete(NAMESPACE + "/3");

        // Assert
        expect(response.statusCode).toBe(404);
        expect(response.body.message).toEqual("Usuário não encontrado.");
        expect(mockGetClient).toHaveBeenCalledTimes(1);
        expect(mockRemove).not.toHaveBeenCalled();
      });
    });
  });
});
