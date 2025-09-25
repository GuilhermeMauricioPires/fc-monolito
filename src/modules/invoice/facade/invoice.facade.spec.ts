import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "../repository/invoice.model";
import InvoiceItemsModel from "../repository/invoiceItems.model";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";

describe("InvoinceFacade test", () => {
    let sequelize: Sequelize;
    
      beforeEach(async () => {
        sequelize = new Sequelize({
          dialect: "sqlite",
          storage: ":memory:",
          logging: false,
          sync: { force: true },
        });
    
        await sequelize.addModels([InvoiceModel, InvoiceItemsModel]);
        await sequelize.sync();
      });
    
      afterEach(async () => {
        await sequelize.close();
      });

      it("should generate a invoice", async () => {
        const invoiceFacade = InvoiceFacadeFactory.create();
        const input = {
                name: "Guilherme",
                document: "01234567890",
                street: "Rua 1",
                number: "1",
                complement: "Casa 1",
                city: "Cidade 1",
                state: "Estado 1",
                zipCode: "1111111",
                items: [
                    {
                        id: "1",
                        name: "Item 1",
                        price: 10
                    },
                    {
                        id: "2",
                        name: "Item 2",
                        price: 20
                    }
                ]
            }

        const result = await invoiceFacade.generateInvoice(input);

        expect(result.id).toBeDefined();
        expect(result.name).toBe(input.name);
        expect(result.document).toBe(input.document);
        expect(result.street).toBe(input.street);
        expect(result.number).toBe(input.number);
        expect(result.complement).toBe(input.complement);
        expect(result.city).toBe(input.city);
        expect(result.state).toBe(input.state);
        expect(result.zipCode).toBe(input.zipCode);
        expect(result.items[0].id).toBe(input.items[0].id);
        expect(result.items[0].name).toBe(input.items[0].name);
        expect(result.items[0].price).toBe(input.items[0].price);
        expect(result.items[1].id).toBe(input.items[1].id);
        expect(result.items[1].name).toBe(input.items[1].name);
        expect(result.items[1].price).toBe(input.items[1].price);
        expect(result.total).toBe(30);
    });

    it("should find a invoice", async () => {
      const invoiceFacade = InvoiceFacadeFactory.create();
      const input = {
                name: "Guilherme",
                document: "01234567890",
                street: "Rua 1",
                number: "1",
                complement: "Casa 1",
                city: "Cidade 1",
                state: "Estado 1",
                zipCode: "1111111",
                items: [
                    {
                        id: "1",
                        name: "Item 1",
                        price: 10
                    },
                    {
                        id: "2",
                        name: "Item 2",
                        price: 20
                    }
                ]
            }

        const result = await invoiceFacade.generateInvoice(input);
        const invoice = await invoiceFacade.findInvoice({id: result.id});
        expect(invoice).toBeDefined();
        expect(invoice.name).toBe(input.name);
        expect(invoice.document).toBe(input.document);
        expect(invoice.address.street).toBe(input.street);
        expect(invoice.address.number).toBe(input.number);
        expect(invoice.address.complement).toBe(input.complement);
        expect(invoice.address.city).toBe(input.city);
        expect(invoice.address.state).toBe(input.state);
        expect(invoice.address.zipCode).toBe(input.zipCode);
        expect(invoice.items[0].id).toBe(input.items[0].id);
        expect(invoice.items[0].name).toBe(input.items[0].name);
        expect(invoice.items[0].price).toBe(input.items[0].price);
        expect(invoice.items[1].id).toBe(input.items[1].id);
        expect(invoice.items[1].name).toBe(input.items[1].name);
        expect(invoice.items[1].price).toBe(input.items[1].price);
        expect(invoice.total).toBe(30);
    })
})
