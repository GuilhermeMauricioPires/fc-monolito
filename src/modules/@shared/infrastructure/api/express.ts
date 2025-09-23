import express, {Express} from 'express'
import { Sequelize } from 'sequelize-typescript';
import { ProductModel } from '../../../product-adm/repository/product.model';
import { productAdmRouter } from '../../../product-adm/infrastructure/product-adm.route';
import { clientAdmRouter } from '../../../client-adm/infrastructure/client-adm.route';
import { ClientModel } from '../../../client-adm/repository/client.model';

export const app: Express = express();
app.use(express.json());
app.use("/product", productAdmRouter)
app.use("/client", clientAdmRouter)

export let sequilize: Sequelize;

async function setupDb() {
    sequilize = new Sequelize({
        dialect: "sqlite",
        storage: ":memory:",
        logging: false
    });
    await sequilize.addModels([ProductModel, ClientModel]);
    await sequilize.sync();
}
setupDb();