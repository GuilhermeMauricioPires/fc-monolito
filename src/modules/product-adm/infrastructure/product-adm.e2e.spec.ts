import { app, sequilize } from "../../@shared/infrastructure/api/express";
import request from 'supertest';

describe("E2E test product-adm", () => {

    beforeEach(async () => {
        await sequilize.sync({force: true});
    })

    afterAll(async () => {
        await sequilize.close();
    })

    it("should create a product", async () => {
        const productProps = {
                name: "produto um",
                description: "descricao um",
                purchasePrice: 100,
                stock: 10
            };
        const response = await request(app)
            .post("/product")
            .send(productProps);
        expect(response.status).toBe(201);
    });

})