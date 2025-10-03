import { app } from "../../@shared/infrastructure/api/express";
import request from 'supertest';
import { ProductModel as ProductAdmModel } from "../../product-adm/repository/product.model";
import ProductStoreCatalogModel from "../../store-catalog/repository/product.model";
import { Umzug } from "umzug";
import { migrator } from "../../@shared/infrastructure/db/conf-migrations/migrator";
import { Sequelize } from "sequelize-typescript";
import { ClientModel } from "../repository/client.model";
import { OrderModel } from "../repository/order.model";
import CheckoutProductModel from "../repository/checkout.product.model";
import TransactionModel from "../../payment/repository/transaction.model";
import InvoiceModel from "../../invoice/repository/invoice.model";
import InvoiceItemsModel from "../../invoice/repository/invoiceItems.model";

describe("E2E test checkout", () => {
    let sequelize: Sequelize;
    let migration: Umzug<any>;
    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
        });
        
        migration = migrator(sequelize)
        const pending = await migration.pending();
        console.log('📌 Migrations pendentes:', pending.map(m => m.name));
        await migration.up()
        await sequelize.addModels([ProductAdmModel, ProductStoreCatalogModel, ClientModel, OrderModel, CheckoutProductModel, TransactionModel, InvoiceModel, InvoiceItemsModel]);
    });

    afterEach(async () => {
        if (!migration || !sequelize) {
            return 
        }
        migration = migrator(sequelize)
        await migration.down()
        await sequelize.close();
    });

    it("should place an order", async () => {
        const clientProps = {
            id: "1",
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
        await request(app)
            .post("/client")
            .send(clientProps);

        const product1Props = {
            id: "1",
            name: "produto um",
            description: "descricao um",
            purchasePrice: 100,
            stock: 10
        };
        await request(app)
            .post("/product")
            .send(product1Props);
        const product2Props = {
            id: "2",
            name: "produto dois",
            description: "descricao dois",
            purchasePrice: 200,
            stock: 20
        };
        await request(app)
            .post("/product")
            .send(product2Props);

        const placeOrderProps = {
            clientId: clientProps.id,
            products: [
                {productId: product1Props.id},
                {productId: product2Props.id}
            ]
        }
        const response = await request(app)
                    .post("/checkout")
                    .send(placeOrderProps);
        expect(response.status).toBe(201);
    })

})