import Order from "../domain/order.entity";
import CheckoutGateway from "../gateway/checkout.gateway";
import { ClientModel } from "./client.model";
import { OrderModel } from "./order.model";
import CheckoutProductModel from "./checkout.product.model";

export default class CheckoutRepository implements CheckoutGateway
{
    async addOrder(order: Order): Promise<void> {
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
            include: [ClientModel, CheckoutProductModel]
        })
    }
    
}