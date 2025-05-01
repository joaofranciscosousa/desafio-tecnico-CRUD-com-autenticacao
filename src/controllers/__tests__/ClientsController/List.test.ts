import { expect, vi, describe, it, beforeEach } from "vitest";
import request from "supertest";
import createAppServer from "../../../utils/tests/createAppServer";
import ClientsController from "../../ClientsController";
import { AppDataSource } from "../../../data-source";
import { Repository } from "typeorm";
import { Clients } from "../../../entities/Clients";
import { createPagination } from "../../../helper/pagination";

// Mocks
vi.mock("typeorm");

vi.mock("../../../middlewares/tokenAuthorization", () => ({
  __esModule: true,
  default: vi.fn((req, res, next) => next()),
}));

describe("Controller ClientsController", () => {
  const NAMESPACE = "/clients";

  // Arrange
  const mockClient: any = [
    [
      {
        id: 1,
        name: "name",
        email: "email@gmail.com",
        phone: "35912345678",
        born_date: new Date().toISOString(),
      },
    ],
    1,
  ];

  const mockFindAndCount = vi.fn().mockResolvedValue(mockClient);
  const clientsRepositoryMock = {
    findAndCount: mockFindAndCount,
  };

  vi.spyOn(AppDataSource, "getRepository").mockReturnValue(
    clientsRepositoryMock as unknown as Repository<Clients>
  );

  const app = createAppServer([ClientsController]);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /clients", () => {
    describe("Happy path", () => {
      it("should create a client successfully", async () => {
        // Act
        const page = 1;
        const per_page = 10;
        const response = await request(app)
          .get(NAMESPACE)
          .send()
          .query({ page, per_page });

        // Assert
        expect(response.statusCode).toBe(200);
        expect(response.body.data).toEqual(mockClient[0]);
        expect(response.body.pagination).toEqual(
          createPagination(page, per_page, mockClient[1])
        );
        expect(mockFindAndCount).toHaveBeenCalledTimes(1);
      });
    });
  });
});
