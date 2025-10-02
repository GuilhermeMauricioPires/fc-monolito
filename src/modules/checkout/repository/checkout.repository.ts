import Order from "../domain/order.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import { ClientModel } from "./client.model";
import { OrderModel } from "./order.model";
import CheckoutProductModel from "./checkout.product.model";
import Client from "../domain/client.entity";
import Product from "../domain/product.entity";
import Id from "../../@shared/domain/value-object/id.value-object";

export default class CheckoutRepository implements CheckoutGateway
{
    async getClient(id: string): Promise<Client> {
        const client = await ClientModel.findOne({
            where: {
            id: id,
            },
        });

        if(!client) {
            return null;
        }
        
        return new Client({
            id: new Id(client.id),
            name: client.name,
            email: client.email,
            address: client.address,
            createdAt: client.createdAt
        });
    }
    async addClient(client: Client): Promise<void> {
        await ClientModel.create({
            id: client.id.id,
            name: client.name,
            email: client.email,
            address: client.address,
            createdAt: client.createdAt
        })
    }
    addProduct(product: Product): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async addOrder(order: Order): Promise<void> {
        try{
        await OrderModel.create({
            id: order.id.id,
            client_id: order.client.id.id,
            client: {
                id: order.client.id.id,
                name: order.client.name,
                email: order.client.email,
                address: order.client.address,
                createdAt: order.client.createdAt
            },
            products: order.products.map((product) => ({
                id: product.id.id,
                name: product.name,
                description: product.description,
                salesPrice: product.salesPrice,
                order_id: order.id.id,
                createdAt: product.createdAt
            })),
            status: order.status,
            createdAt: order.createdAt
        }, {
            include: [CheckoutProductModel]
        })
    }catch(err){
        console.log(err);
        throw err;
    }
    }
    
}