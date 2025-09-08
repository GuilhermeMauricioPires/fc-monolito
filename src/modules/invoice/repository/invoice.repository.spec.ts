import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";
import InvoiceItemsModel from "./invoiceItems.model";
import InvoiceRepository from "./invoice.repository";
import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import InvoiceItems from "../domain/invoiceItems.entity";
import Invoice from "../domain/invoice.entity";

describe("InvoiceRepository test", () => {
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

      it("should find a invoice", async () => {
        const invoiceRepository = new InvoiceRepository();

        await InvoiceModel.create({
            id: "1",
            name: "Guilherme",
            document: "01234567890",
            street: "Rua 1",
            number: "1",
            complement: "Casa 1",
            city: "Cidade 1",
            state: "Estado 1",
            zipCode: "1111111",
            invoiceItems: [
                {
                    id: "1",
                    name: "Item 1",
                    price: 10,
                    invoice_id: "1"
                },
                {
                    id: "2",
                    name: "Item 2",
                    price: 20,
                    invoice_id: "1"
                }
            ],
            createdAt: new Date(),
            updatedAt: new Date()
        }, {
            include: [InvoiceItemsModel]
        });

        const invoiceModel = await invoiceRepository.find("1");
        expect(invoiceModel.id.id).toEqual("1");
        expect(invoiceModel.name).toEqual("Guilherme");
        expect(invoiceModel.document).toEqual("01234567890");
        expect(invoiceModel.address.street).toEqual("Rua 1");
        expect(invoiceModel.address.number).toEqual("1");
        expect(invoiceModel.address.complement).toEqual("Casa 1");
        expect(invoiceModel.address.city).toEqual("Cidade 1");
        expect(invoiceModel.address.state).toEqual("Estado 1");
        expect(invoiceModel.address.zipCode).toEqual("1111111");
        expect(invoiceModel.items[0].id.id).toEqual("1");
        expect(invoiceModel.items[0].name).toEqual("Item 1");
        expect(invoiceModel.items[0].price).toEqual(10);
        expect(invoiceModel.items[1].id.id).toEqual("2");
        expect(invoiceModel.items[1].name).toEqual("Item 2");
        expect(invoiceModel.items[1].price).toEqual(20);
      });

      it("should generate a invoice", async () => {
        
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
        
        const props = {
              id: new Id("1"),
              name: "Guilherme",
              document: "01234567890",
              address: new Address(
                  "Rua 1",
                  "1",
                  "Casa 1",
                  "Cidade 1",
                  "Estado 1",
                  "1111111",
              ),
              items: [item1, item2]
          };
          const invoice = new Invoice(props);
          const repository = new InvoiceRepository();
          await repository.generate(invoice);

          const invoiceDb = await InvoiceModel.findOne({
            where: {id: props.id.id}, rejectOnEmpty: false, include: [{model: InvoiceItemsModel}]
          });
          expect(invoiceDb.id).toBe(invoice.id.id);
          expect(invoiceDb.name).toBe(invoice.name);
          expect(invoiceDb.document).toBe(invoice.document);
          expect(invoiceDb.street).toBe(invoice.address.street);
          expect(invoiceDb.number).toBe(invoice.address.number);
          expect(invoiceDb.complement).toBe(invoice.address.complement);
          expect(invoiceDb.city).toBe(invoice.address.city);
          expect(invoiceDb.state).toBe(invoice.address.state);
          expect(invoiceDb.zipCode).toBe(invoice.address.zipCode);
          expect(invoiceDb.invoiceItems[0].id).toBe(invoice.items[0].id.id);
          expect(invoiceDb.invoiceItems[0].name).toBe(invoice.items[0].name);
          expect(invoiceDb.invoiceItems[0].price).toBe(invoice.items[0].price);
          expect(invoiceDb.invoiceItems[1].id).toBe(invoice.items[1].id.id);
          expect(invoiceDb.invoiceItems[1].name).toBe(invoice.items[1].name);
          expect(invoiceDb.invoiceItems[1].price).toBe(invoice.items[1].price);
      });
})