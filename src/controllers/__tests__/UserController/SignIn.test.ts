import dotenv from "dotenv";
dotenv.config();
import { expect, vi, describe, it, beforeEach } from "vitest";
import request from "supertest";
import createAppServer from "../../../utils/tests/createAppServer";
import UsersController from "../../UsersController";
import H from "../../../helper/controllers/userController";
// Mocks
vi.mock("typeorm");

describe("Controller UsersController", () => {
  const NAMESPACE = "/users";

  const email = "email@gmail.com";
  const password = "123456";

  // Arrange
  const mockUser: any = {
    name: "name",
    email: email,
    password: "$2b$10$tyMbkZHHOg0xU/ao0MtMG.jz8v4x.GZV4cYQ0LHz1d1w.aJRelYVG",
    type: "admin",
  };

  const app = createAppServer([UsersController]);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /users/sign_in", () => {
    describe("Happy path", () => {
      it("should return a client by ID", async () => {
        const mockGetUser = vi
          .spyOn(H, "getUser")
          .mockImplementationOnce(() => {
            return mockUser;
          });

        // Act
        const response = await request(app)
          .post(NAMESPACE + "/sign_in")
          .send({ email, password });

        // Assert
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
          email: "email@gmail.com",
          name: "name",
          token: expect.any(String),
          type: "admin",
        });
        expect(mockGetUser).toHaveBeenCalledTimes(1);
      });
    });

    describe("Edge Cases", () => {
      it("should return 401 if password was wrong", async () => {
        const mockGetUser = vi
          .spyOn(H, "getUser")
          .mockImplementationOnce(() => {
            return mockUser;
          });

        // Act
        const response = await request(app)
          .post(NAMESPACE + "/sign_in")
          .send({ email, password: "wrong" });

        // Assert
        expect(response.statusCode).toBe(401);
        expect(response.body.message).toBe("Email ou senha não conferem.");
        expect(mockGetUser).toHaveBeenCalledTimes(1);
      });
    });
  });
});
