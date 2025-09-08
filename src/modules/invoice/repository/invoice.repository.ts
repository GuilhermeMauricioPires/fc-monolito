import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice.entity";
import InvoiceItems from "../domain/invoiceItems.entity";
import InvoiceGateway from "../gateway/invoice.gateway";
import InvoiceModel from "./invoice.model";
import InvoiceItemsModel from "./invoiceItems.model";

export default class InvoiceRepository implements InvoiceGateway {
    async find(id: string): Promise<Invoice> {
        const invoice = await InvoiceModel.findOne({where: {id}, rejectOnEmpty: false, include: [{model: InvoiceItemsModel}]});
        
        if (!invoice) {
            throw new Error(`Invoice with id ${id} not found`);
        }

        const items = invoice.invoiceItems.map((invoiceItem) => (
            new InvoiceItems({
                id: new Id(invoiceItem.id), 
                name: invoiceItem.name, 
                price: invoiceItem.price})
        ));
        return new Invoice({
            id: new Id(invoice.id),
            name: invoice.name,
            document: invoice.document,
            address: new Address(
                invoice.street,
                invoice.number,
                invoice.complement,
                invoice.city,
                invoice.state,
                invoice.zipCode
            ),
            items: items,
            createdAt: invoice.createdAt,
            updatedAt: invoice.updatedAt
        })
    }
    async generate(invoice: Invoice): Promise<void> {        
        await InvoiceModel.create({
                id: invoice.id.id,
                name: invoice.name,
                document: invoice.document,
                street: invoice.address.street,
                number: invoice.address.number,
                complement: invoice.address.complement,
                city: invoice.address.city,
                state: invoice.address.state,
                zipCode: invoice.address.zipCode,
                invoiceItems: invoice.items.map((item) => ({
                    id: item.id.id,
                    name: item.name,
                    price: item.price,
                    invoice_id: invoice.id.id
                })),
                createdAt: invoice.createdAt,
                updatedAt: invoice.updatedAt
        }, {
            include: [InvoiceItemsModel]
        });
    }
}