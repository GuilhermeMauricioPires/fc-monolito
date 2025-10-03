import { Sequelize } from "sequelize-typescript"
import { OrderModel } from "./order.model"
import { ClientModel } from "./client.model"
import CheckoutProductModel from "./checkout.product.model"
import Order from "../domain/order.entity"
import Id from "../../@shared/domain/value-object/id.value-object"
import Client from "../domain/client.entity"
import Product from "../domain/product.entity"
import CheckoutRepository from "./checkout.repository"

describe("Checkout repository test", () => {

    let sequelize: Sequelize
    
    beforeEach(async () => {
    sequelize = new Sequelize({
        dialect: 'sqlite',
        storage: ':memory:',
        logging: false,
        sync: { force: true }
    })

    sequelize.addModels([OrderModel, ClientModel, CheckoutProductModel])
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })

    it("should add an order", async() => {
        const clientProps = new Client({
            id: new Id("1"),
            name: "Guilherme",
            email: "guilherme@teste.com",
            address: "Rua 1",
            createdAt: new Date()
        })
        const productProps = [
            new Product({
                id: new Id("1"),
                name: "product um",
                description: "descricao um",
                salesPrice: 10
            }),
            new Product({
                id: new Id("2"),
                name: "product dois",
                description: "descricao dois",
                salesPrice: 20
            })
        ]
        const order = new Order({
            id: new Id("1"),
            client: clientProps,
            products: productProps,
        })

        await ClientModel.create({
            id: clientProps.id.id,
            name: clientProps.name,
            email: clientProps.email,
            address: clientProps.address,
            createdAt: clientProps.createdAt
        })

        const repository = new CheckoutRepository();
        await repository.addOrder(order);

        const orderDb = await OrderModel.findOne({
            where: {id: order.id.id}, include: [ClientModel, CheckoutProductModel]
        })

        expect(orderDb.id).toBe(order.id.id);
    })

})