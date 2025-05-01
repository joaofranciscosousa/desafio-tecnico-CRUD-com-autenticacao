import { expect, vi, describe, it, beforeEach } from "vitest";
import request from "supertest";
import createAppServer from "../../../utils/tests/createAppServer";
import ClientsController from "../../ClientsController";
import { AppDataSource } from "../../../data-source";
import { Repository } from "typeorm";
import { Clients } from "../../../entities/Clients";

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
    name: "name",
    email: "email@gmail.com",
    phone: "35912345678",
    born_date: new Date().toISOString(),
  };

  const mockSave = vi.fn().mockResolvedValue(mockClient);
  const clientsRepositoryMock = {
    save: mockSave,
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
        // Act
        const response = await request(app).post(NAMESPACE).send({
          name: "name",
          email: "email@gmail.com",
          phone: "35912345678",
          born_date: new Date().toISOString(),
        });

        // Assert
        expect(response.statusCode).toBe(201);
        expect(response.body).toEqual(mockClient);
        expect(mockSave).toHaveBeenCalledTimes(1);
      });
    });

    describe("Edge Cases", () => {
      it("should return 422 if there are validation errors", async () => {
        // Act
        const response = await request(app).post(NAMESPACE).send({
          name: "name",
          // email: "email@gmail.com",
          phone: "35912345678",
          born_date: new Date().toISOString(),
        });

        // Assert
        expect(response.statusCode).toBe(422);
        expect(response.body[0].attribute).toBe("email");
        expect(response.body[0].message).toBe("O campo E-mail é inválido");
        expect(response.body[1].attribute).toBe("email");
        expect(response.body[1].message).toBe(
          "O campo E-mail deve ser do tipo string"
        );
        expect(response.body[2].attribute).toBe("email");
        expect(response.body[2].message).toBe("O campo E-mail é obrigatório");
        expect(mockSave).not.toHaveBeenCalled();
      });
    });
  });
});
