import { Sequelize } from "sequelize-typescript";
import { OrderModel } from "../repository/order.model";
import { ClientModel } from "../repository/client.model";
import ProductModel from "../repository/product.model";
import CheckoutFacadeFactory from "../factory/checkout.facade.factory";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";

describe("InvoinceFacade test", () => {
    let sequelize: Sequelize;
    
    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([OrderModel, ClientModel, ProductModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create instance placeOrdeUseCase", async () => {
        const checkoutFacade = CheckoutFacadeFactory.create();
        expect(checkoutFacade).toBeInstanceOf(PlaceOrderUseCase);
    })

})