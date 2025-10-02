import Client from "../domain/client.entity";
import Order from "../domain/order.entity";
import Product from "../domain/product.entity";

export default interface CheckoutGateway {
    addOrder(order: Order): Promise<void>
    addClient(client: Client): Promise<void>
    addProduct(product: Product): Promise<void>
    getClient(id: string): Promise<Client>
}