import { app, sequelize } from "../../@shared/infrastructure/api/express";
import request from 'supertest';

describe("E2E test client-adm", () => {

    beforeEach(async () => {
        await sequelize.sync({force: true});
    })

    afterAll(async () => {
        await sequelize.close();
    })

    it("should create a client", async () => {
        const clientProps = {
            name: "cliente um",
            email: "cliente.um@gmail.com",
            document: "01234567890",
            address: {
                street: "rua um",
                number: "1",
                complement: "casa um",
                city: "cidade um",
                state: "estado um",
                zipcode: "11111111"
            }
        };
        const response = await request(app)
            .post("/client")
            .send(clientProps);
        expect(response.status).toBe(201);
    })

})