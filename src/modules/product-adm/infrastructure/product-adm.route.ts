import express, {Request, Response} from 'express'
import ProductAdmFacadeFactory from '../factory/facade.factory';

export const productAdmRouter = express.Router();

productAdmRouter.post('/', async(req: Request, res: Response) => {
    const productAdmFacade = ProductAdmFacadeFactory.create();
    try{
        const productDto = {
            name: req.body.name,
            description: req.body.description,
            purchasePrice: req.body.purchasePrice,
            stock: req.body.stock
        }
        await productAdmFacade.addProduct(productDto);
        res.status(201).send();
    }catch(err){
        res.status(500).send(err);
    }
})

