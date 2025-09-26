import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import { PlaceOrderInputDto } from "./place-order.dto";
import PlaceOrderUseCase from "./place-order.usecase";

describe("Place order use case unit test", () => {

    describe("execute method", () => {

        it("Should throw an error when client not found", async () => {
            const mockClientFacade = {
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
            
            //@ts-expect-error
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

    describe("place an order", () => {

        const clientProps = {
            id: new Id("1"),
            name: "Guilherme",
            email: "guilherme@teste.com",
            document: "01234567890",
            address: new Address(
                "Rua 1",
                "1",
                "Casa 1",
                "Cidade 1",
                "Estado 1",
                "11111111",
            )
        };

        const mockClientFacade = {
            find: jest.fn().mockResolvedValue(clientProps),
            add: jest.fn()
        };
        

        const mockProductFacade = {
            addProduct: jest.fn(),
            checkStock: jest.fn(( {productId}: {productId: string} ) =>
                Promise.resolve({
                    productId,
                    stock: 1
                })
            )
        }

        const mockCatalogFacade = {
            find: jest.fn(( {id}: {id: string} ) =>
                Promise.resolve({
                    id: `${id}`,
                    name: `Product ${id}`,
                    description: `Product ${id} description`,
                    salesPrice: 10
                })
            ),
            findAll: jest.fn()
        };

        const mockPaymentFacade = {
            process: jest.fn()
        }

        const mockCheckoutRepository = {
            addOrder: jest.fn()
        }

        const mockInvoiceFacede = {
            findInvoice: jest.fn(),
            generateInvoice: jest.fn().mockResolvedValue({id: "1i"}),
        }
        
        const placeOrderUseCase = new PlaceOrderUseCase(
            mockClientFacade, 
            mockProductFacade, 
            mockCatalogFacade,
            mockCheckoutRepository,
            mockInvoiceFacede,
            mockPaymentFacade
        );

        it("should not be approved", async () => {
            mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
                transactionId: "1t",
                orderId: "1o",
                amount: 20,
                status: "error",
                createdAt: new Date(),
                updatedAt: new Date()
            })

            const input: PlaceOrderInputDto = {
                clientId: "1", 
                products: [{productId: "0"}, {productId: "1"}]
            };

            let output = await placeOrderUseCase.execute(input);

            expect(output.invoiceId).toBeNull();
            expect(output.total).toBe(20);
            expect(output.products).toStrictEqual([
                {productId: "0"},
                {productId: "1"}
            ]);
            expect(mockClientFacade.find).toBeCalledTimes(1);
            expect(mockClientFacade.find).toBeCalledWith({id: "1"});
            expect(mockProductFacade.checkStock).toBeCalledTimes(2);
            expect(mockCatalogFacade.find).toBeCalledTimes(2);
            expect(mockCheckoutRepository.addOrder).toBeCalledTimes(1);
            expect(mockPaymentFacade.process).toBeCalledTimes(1);
            expect(mockPaymentFacade.process).toBeCalledWith({
                orderId: output.id,
                amount: 20
            });
            expect(mockInvoiceFacede.generateInvoice).toBeCalledTimes(0);
        })

        it("should be approved", async () => {
            mockPaymentFacade.process = mockPaymentFacade.process.mockReturnValue({
                transactionId: "1t",
                orderId: "1o",
                amount: 20,
                status: "approved",
                createdAt: new Date(),
                updatedAt: new Date()
            })

            const input: PlaceOrderInputDto = {
                clientId: "1", 
                products: [{productId: "0"}, {productId: "1"}]
            };

            let output = await placeOrderUseCase.execute(input);

            expect(output.invoiceId).toBe("1i");
            expect(output.total).toBe(20);
            expect(output.products).toStrictEqual([
                {productId: "0"},
                {productId: "1"}
            ]);
            expect(mockClientFacade.find).toBeCalledTimes(1);
            expect(mockClientFacade.find).toBeCalledWith({id: "1"});
            expect(mockProductFacade.checkStock).toBeCalledTimes(2);
            expect(mockCatalogFacade.find).toBeCalledTimes(2);
            expect(mockCheckoutRepository.addOrder).toBeCalledTimes(1);
            expect(mockPaymentFacade.process).toBeCalledTimes(1);
            expect(mockPaymentFacade.process).toBeCalledWith({
                orderId: output.id,
                amount: 20
            });
            expect(mockInvoiceFacede.generateInvoice).toBeCalledTimes(1);
            expect(mockInvoiceFacede.generateInvoice).toBeCalledWith({
                name: clientProps.name,
                document: clientProps.document,
                street: clientProps.address.street,
                number: clientProps.address.number,
                complement: clientProps.address.complement,
                city: clientProps.address.city,
                state: clientProps.address.state,
                zipCode: clientProps.address.zipCode,
                items: [
                    {
                        id: '0',
                        name: 'Product 0',
                        price: 10
                    },
                    {
                        id: '1',
                        name: 'Product 1',
                        price: 10
                    }
                ]
            });
        })
    })
});