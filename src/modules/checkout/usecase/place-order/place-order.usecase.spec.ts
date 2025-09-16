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

            const placeOrderUseCase = new PlaceOrderUseCase(mockClientFacade);
            const input: PlaceOrderInputDto = {clientId: "1", products: []};
            await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
                new Error("Client not found")
            );
            expect(mockClientFacade.find).toBeCalled();
            expect(mockClientFacade.find).toBeCalledWith({id: input.clientId});
        });

        it("should throw an error when products are not valid", async () => {
            const mockClientFacade = {
                find: jest.fn().mockResolvedValue(true),
                add: jest.fn()
            };

            const placeOrderUseCase = new PlaceOrderUseCase(mockClientFacade);
            const input: PlaceOrderInputDto = {clientId: "1", products: []};
            await expect(placeOrderUseCase.execute(input)).rejects.toThrow(
                new Error("No products selected")
            );
        })

    });

});