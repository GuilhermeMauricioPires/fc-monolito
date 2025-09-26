import { app, sequilize } from "../../@shared/infrastructure/api/express";
import request from 'supertest';

describe("E2E test checkout", () => {

    beforeEach(async () => {
        await sequilize.sync({force: true});
    })

    afterAll(async () => {
        await sequilize.close();
    })

    it("should place an order", async () => {
        const placeOrderProps = {
            clientId: "1",
            products: [
                {productId: "1"},
                {productId: "2"}
            ]
        }
        const response = await request(app)
                    .post("/checkout")
                    .send(placeOrderProps);
                expect(response.status).toBe(201);
    })

})