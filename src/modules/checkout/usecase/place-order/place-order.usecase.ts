import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import { PlaceOrderInputDto, PlaceOrderOutputDto } from "./place-order.dto";

export default class PlaceOrderUseCase implements UseCaseInterface {
    
    constructor() {}
    
    execute(input: PlaceOrderInputDto): Promise<PlaceOrderOutputDto> {

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
}