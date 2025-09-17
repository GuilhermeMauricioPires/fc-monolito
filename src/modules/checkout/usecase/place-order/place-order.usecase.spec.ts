import { PlaceOrderInputDto } from "./place-order.dto";
import PlaceOrderUseCase from "./place-order.usecase";

describe("Place order use case unit test", () => {

    describe("execute method", () => {

        it("Should throw an error when client not found", async () => {
            const mockClientFacade = {
                //find: jest.fn().mockRejectedValue(new Error("Client not found")),
                find: jest.fn().mockResolvedValue(null),
                add: jest.fn()
            };

            //@ts-expect-error
            const placeOrderUseCase = new PlaceOrderUseCase(mockClientFacade);
            const input: PlaceOrderInputDto = {clientId: "1", products: []};
            await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
                new Error("Client not found")
            );
            expect(mockClientFacade.find).toBeCalled();
            expect(mockClientFacade.find).toBeCalledWith({id: input.clientId});
        });

    });

    describe("validate method", () => {

        it("should throw an error when products are not valid", async () => {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(true),
                add: jest.fn()
            };

            //@ts-expect-error
            const placeOrderUseCase = new PlaceOrderUseCase(mockClientFacade);
            const input: PlaceOrderInputDto = {clientId: "1", products: []};
            await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
                new Error("No products selected")
            );
        })

        it("should throw an error when product is out of stock", async () => {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(true),
                add: jest.fn()
            };

            const mockProductFacade = {
                addProduct: jest.fn(),
                checkStock: jest.fn(( {productId}: {productId: string} ) =>
                        Promise.resolve({
                        productId,
                        stock: productId === "1" ? 0 : 1
                    })
                )
            }

            //@ts-expect-error
            const placeOrderUseCase = new PlaceOrderUseCase(mockClientFacade, mockProductFacade);
            let input: PlaceOrderInputDto = {
                clientId: "1", 
                products: [{productId: "1"}]
            };
            await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
                new Error(`Product 1 is not available in stock`)
            );
            expect(mockProductFacade.checkStock).toBeCalledTimes(1);
            expect(mockProductFacade.checkStock).toBeCalledWith({productId: input.products[0].productId});

            input = {
                clientId: "1", 
                products: [{productId: "0"}, {productId: "1"}]
            };
            await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
                new Error(`Product 1 is not available in stock`)
            );
            expect(mockProductFacade.checkStock).toBeCalledTimes(3);

            input = {
                clientId: "1", 
                products: [{productId: "0"}, {productId: "2"}, {productId: "1"}]
            };
            await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
                new Error(`Product 1 is not available in stock`)
            );
            expect(mockProductFacade.checkStock).toBeCalledTimes(6);
        })

    })

    describe("getProduct method", () => {

        it("should throw an error when product not found", async () =>{
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(true),
                add: jest.fn()
            };

            const mockProductFacade = {
                addProduct: jest.fn(),
                checkStock: jest.fn(( {productId}: {productId: string} ) =>
                        Promise.resolve({
                        productId,
                        stock: productId === "1" ? 0 : 1
                    })
                )
            }
            const mockCatalogFacade = {
                find: jest.fn().mockResolvedValue(null),
                findAll: jest.fn()
            };
            
            const placeOrderUseCase = new PlaceOrderUseCase(mockClientFacade, mockProductFacade, mockCatalogFacade);
            const input: PlaceOrderInputDto = {
                clientId: "1", 
                products: [{productId: "0"}]
            };
            await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
                new Error(`Product 0 not found`)
            );
        })
        
    })

});