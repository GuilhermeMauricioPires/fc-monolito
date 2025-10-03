import { Sequelize } from "sequelize-typescript";
import { OrderModel } from "../repository/order.model";
import { ClientModel } from "../repository/client.model";
import CheckoutProductModel from "../repository/checkout.product.model";
import CheckoutFacadeFactory from "../factory/checkout.facade.factory";
import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";
import Address from "../../@shared/domain/value-object/address";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import { ClientModel as ClientAdmModel } from "../../client-adm/repository/client.model";
import { ProductModel as ProductAdmModel } from "../../product-adm/repository/product.model";
import ProductStoreCatalogModel from "../../store-catalog/repository/product.model";
import { Umzug } from "umzug";
import { migrator } from "../../@shared/infrastructure/db/conf-migrations/migrator";
import TransactionModel from "../../payment/repository/transaction.model";

describe("CheckoutFacade test", () => {
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
        await sequelize.addModels([OrderModel, ClientModel, CheckoutProductModel, ClientAdmModel, ProductAdmModel, ProductStoreCatalogModel, TransactionModel]);
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
        
        const facadeClient = ClientAdmFacadeFactory.create()
        
        const inputClient = {
            id: "1",
            name: "Guilherme",
            email: "guilherme@teste.com",
            document: "01234567890",
            address: new Address(
                "Rua 1",
                "1",
                "Casa 1",
                "Cidade 1",
                "Estado 1",
                "111111111"
            )
        }
    
        await facadeClient.add(inputClient)
        
        const productFacade = ProductAdmFacadeFactory.create();

        const inputProduct1 = {
            id: "1",
            name: "Product 1",
            description: "Product 1 description",
            purchasePrice: 10,
            stock: 10,
        };

        await productFacade.addProduct(inputProduct1);

        const inputProduct2 = {
            id: "2",
            name: "Product 2",
            description: "Product 2 description",
            purchasePrice: 20,
            stock: 5,
        };

        await productFacade.addProduct(inputProduct2);

        const checkoutFacade = CheckoutFacadeFactory.create();
        const input = {
            clientId: "1",
            products: [{productId: "1"}, {productId: "2"}]
        }
        const checkout = await checkoutFacade.place(input);
        expect(checkout).toBeDefined();
        expect(checkout.id).toBeDefined();
        expect(checkout.invoiceId).toBeDefined();
        expect(checkout.status).toBeDefined();
        expect(checkout.total).toBe(30);
        expect(checkout.products).toStrictEqual([
            {productId: inputProduct1.id},
            {productId: inputProduct2.id}
        ]);
    })

})