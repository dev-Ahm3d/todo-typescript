import supertest from "supertest";
import app from "..";
const request = supertest(app)

describe("test basic ednpoint server", () => {
    it("Get the / endpoint", async () => {
        const response = await request.get("/")
        expect(response.statusCode).toEqual(200)
    })
})