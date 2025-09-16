import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import ClientAdmFacadeInterface from "../../../client-adm/facade/client-adm.facade.interface";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {
    
    private _clientFacade: ClientAdmFacadeInterface;

    constructor(clientFacade: ClientAdmFacadeInterface) {
        this._clientFacade = clientFacade;
    }
    
    async execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {

        const client = await this._clientFacade.find({id: input.clientId})
        if(!client){
            throw new Error("Client not found");
        }

        await this.validateProducts(input);
        //buscar cliente. Caso não encontre -> client not found
        //validar produtos
        //recuperar os produtos

        //criar objeto client
        //criar objeto order (client, products)

        //processar payment -> paymentFacede.process (orderId, amount)

        //caso pagamento aprovado, gerar invoice
        //  mudar status da order para approved
        //retornar dto

        throw new Error("Method not implemented.");
    }

    private async validateProducts(input: PlaceOrderInputDto): Promise<void> {

        if(input.products.length === 0) {
            throw new Error("No products selected");
        }
        
    }
}