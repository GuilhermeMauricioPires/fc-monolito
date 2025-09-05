import { Sequelize } from "sequelize-typescript";
import InvoiceModel from "./invoice.model";
import InvoiceItemsModel from "./invoiceItems.model";
import InvoiceRepository from "./invoice.repository";
import InvoiceItems from "../domain/invoiceItems.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice.entity";
import Address from "../../@shared/domain/value-object/address";

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
      })
})