import { Sequelize } from "sequelize-typescript";
import { OrderModel } from "../repository/order.model";
import { ClientModel } from "../repository/client.model";
import ProductModel from "../repository/product.model";
import CheckoutFacadeFactory from "../factory/checkout.facade.factory";
import PlaceOrderUseCase from "../usecase/place-order/place-order.usecase";
import ClientAdmFacadeFactory from "../../client-adm/factory/client-adm.facade.factory";
import Address from "../../@shared/domain/value-object/address";
import ProductAdmFacadeFactory from "../../product-adm/factory/facade.factory";
import { ClientModel as ClientAdmModel } from "../../client-adm/repository/client.model";
import { ProductModel as ProductAdmModel } from "../../product-adm/repository/product.model";
import ProductStoreCatalogModel from "../../store-catalog/repository/product.model";

describe("InvoinceFacade test", () => {
    let sequelize: Sequelize;
    
    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        await sequelize.addModels([OrderModel, ClientModel, ProductModel, ClientAdmModel, ProductAdmModel, ProductStoreCatalogModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create instance placeOrdeUseCase", async () => {
        
        const facadeClient = ClientAdmFacadeFactory.create()
        
        const inputClient = {
            id: "1",
            name: "Lucian",
            email: "lucian@xpto.com",
            document: "1234-5678",
            address: new Address(
                "Rua 123",
                "99",
                "Casa Verde",
                "Criciúma",
                "SC",
                "88888-888"
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
        expect(checkoutFacade).toBeInstanceOf(PlaceOrderUseCase);
    })

})