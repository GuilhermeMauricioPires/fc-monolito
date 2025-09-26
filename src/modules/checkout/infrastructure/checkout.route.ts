import express, {Request, Response} from 'express'
import CheckoutFacadeFactory from '../factory/checkout.facade.factory';

export const checkoutRouter = express.Router();

checkoutRouter.post('/', async(req: Request, res: Response) => {
    const checkoutFacade = CheckoutFacadeFactory.create();
    try{
        const checkoutDto = {
            clientId: req.body.clientId,
            products: req.body.products.map((productId: { productId: string; }) => {
                productId
            })
        }
        // await checkoutFacade.
    } catch(err){
        res.status(500).send(err);
    }
})