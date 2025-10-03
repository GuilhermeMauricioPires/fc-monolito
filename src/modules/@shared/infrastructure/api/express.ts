import express, {Express} from 'express'
import { Sequelize } from 'sequelize-typescript';
import { ProductModel } from '../../../product-adm/repository/product.model';
import { productAdmRouter } from '../../../product-adm/infrastructure/product-adm.route';
import { clientAdmRouter } from '../../../client-adm/infrastructure/client-adm.route';
import { ClientModel } from '../../../client-adm/repository/client.model';
import { checkoutRouter } from '../../../checkout/infrastructure/checkout.route';

export const app: Express = express();
app.use(express.json());
app.use("/product", productAdmRouter)
app.use("/client", clientAdmRouter)
app.use("/checkout", checkoutRouter)

export let sequelize: Sequelize;

async function setupDb() {
    sequelize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false
    });
    await sequelize.addModels([ProductModel, ClientModel]);
    await sequelize.sync();
}
setupDb();