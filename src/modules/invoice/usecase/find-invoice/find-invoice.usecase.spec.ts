import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice.entity";
import InvoiceItems from "../../domain/invoiceItems.entity";
import FindInvoiceUseCase from "./find-invoice.usecase";

const item1 = new InvoiceItems({
    id: new Id("1"),
    name: "Item 1",
    price: 10
});

const item2 = new InvoiceItems({
    id: new Id("2"),
    name: "Item 2",
    price: 20
});

const invoice = new Invoice({
    id: new Id("1"),
    name: "Guilherme",
    document: "01234567890",
    address: new Address(
        "Rua 1",
        "1",
        "Casa 1",
        "Cidade 1",
        "Estado 1",
        "1111111"
    ),
    items: [item1, item2]
})

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    generate: jest.fn()
  }
}

describe("Find Invoice use case unit test", () => {

    it("should find a invoice", async () => {
        const repository = MockRepository();
        const usecase = new FindInvoiceUseCase(repository);

        const input = {
           id: "1"     
        }

        const result = await usecase.execute(input);

        expect(repository.find).toHaveBeenCalled();
        expect(result.id).toEqual(input.id);
        expect(result.name).toEqual(invoice.name);
        expect(result.document).toEqual(invoice.document);
        expect(result.address).toEqual(invoice.address);
        expect(result.items[0].id).toEqual(invoice.items[0].id.id);
        expect(result.items[0].name).toEqual(invoice.items[0].name);
        expect(result.items[0].price).toEqual(invoice.items[0].price);
        expect(result.items[1].id).toEqual(invoice.items[1].id.id);
        expect(result.items[1].name).toEqual(invoice.items[1].name);
        expect(result.items[1].price).toEqual(invoice.items[1].price);
        expect(result.total).toEqual(invoice.total);
        expect(result.createdAt).toEqual(invoice.createdAt);
    })

})