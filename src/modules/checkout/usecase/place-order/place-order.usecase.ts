import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import InvoiceFacadeInterface from "../../../invoice/facade/invoice.facade.interface";
import PaymentFacadeInterface from "../../../payment/facade/facade.interface";
import ProductAdmFacadeInterface from "../../../product-adm/facade/product-adm.facade.interface";
import StoreCatalogFacadeInterface from "../../../store-catalog/facade/store-catalog.facade.interface";
import Client from "../../domain/client.entity";
import Order from "../../domain/order.entity";
import Product from "../../domain/product.entity";
import CheckoutGateway from "../../gateway/checkout.gateway";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {
    
    private _clientFacade: ClientAdmFacadeInterface;
    private _productFacade: ProductAdmFacadeInterface;
    private _catalogFacade: StoreCatalogFacadeInterface;
    private _checkoutRepository: CheckoutGateway;
    private _invoiceFacade: InvoiceFacadeInterface;
    private _paymentFacade: PaymentFacadeInterface;

    constructor(
        clientFacade: ClientAdmFacadeInterface,
        productFacade: ProductAdmFacadeInterface,
        catalogFacade: StoreCatalogFacadeInterface,
        checkoutRepository: CheckoutGateway,
        invoiceFacade: InvoiceFacadeInterface,
        paymentoFacade: PaymentFacadeInterface
    ) {
        this._clientFacade = clientFacade;
        this._productFacade = productFacade;
        this._catalogFacade = catalogFacade;
        this._checkoutRepository = checkoutRepository;
        this._invoiceFacade = invoiceFacade;
        this._paymentFacade = paymentoFacade;
    }
    
    async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {
        //buscar cliente. Caso não encontre -> client not found
        const client = await this._clientFacade.find({id: input.clientId})
        if(!client){
            throw new Error("Client not found");
        }

        //validar produtos
        await this.validateProducts(input);
        
        //recuperar os produtos
        const products = await Promise.all(
            input.products.map((p) => this.getProducts(p.productId))
        );
    
        //criar objeto client
        const clientPlaceOrder = new Client({
            id: new Id(client.id),
            name: client.name,
            email: client.email,
            address: client.address.street
        })
        //criar objeto order (client, products)
        const orderPlace = new Order({
            client: clientPlaceOrder,
            products 
        })

        //processar payment -> paymentFacede.process (orderId, amount)
        const payment = await this._paymentFacade.process({
            orderId: orderPlace.id.id,
            amount: orderPlace.total
        })

        console.log(payment);
        //caso pagamento aprovado, gerar invoice
        const invoice = 
            payment.status === 'approved' ?
                await this._invoiceFacade.generateInvoice({
                    name: client.name,
                    document: client.document,
                    street: client.address.street,
                    number: client.address.number,
                    complement: client.address.complement,
                    city: client.address.city,
                    state: client.address.state,
                    zipCode: client.address.zipCode,
                    items: products.map((p) => {
                        return {
                            id: p.id.id,
                            name: p.name,
                            price: p.salesPrice
                        }
                    })
                }) : null;

        //  mudar status da order para approved
        payment.status === "approved" && orderPlace.approved();
        this._checkoutRepository.addOrder(orderPlace);
        
        //retornar dto
        return {
            id: orderPlace.id.id,
            invoiceId: payment.status === "approved" ? invoice.id : null,
            status: orderPlace.status,
            total: orderPlace.total,
            products: products.map((p) => {
                return {
                    productId: p.id.id
                }
            })
        }
    }

    private async validateProducts(input: PlaceOrderInputDto): Promise<void> {
        if(input.products.length === 0) {
            throw new Error("No products selected");
        }

        for(const p of input.products) {
            const product = await this._productFacade.checkStock({ productId: p.productId });

            if(product.stock === 0){
                throw new Error(`Product ${product.productId} is not available in stock`);
            }
        }
    }

    private async getProducts(productId: string): Promise<Product> {
        const product = await this._catalogFacade.find({id: productId});
        if(!product){
            throw new Error(`Product ${productId} not found`);
        }
        return new Product({
            id: new Id(product.id),
            name: product.name,
            description: product.description,
            salesPrice: product.salesPrice
        });
    }
}