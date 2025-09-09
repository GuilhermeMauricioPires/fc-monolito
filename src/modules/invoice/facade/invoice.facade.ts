import UseCaseInterface from "../../@shared/usecase/use-case.interface";
import InvoiceFacadeInterface, { FindInvoiceFacadeInputDTO, FindInvoiceFacadeOutputDTO, GenerateInvoiceFacadeInputDto, GenerateInvoiceFacadeOutputDto } from "./invoice.facade.interface";

export interface UseCasesProps {
    findUseCase: UseCaseInterface,
    generateUseCase: UseCaseInterface
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
    
    private _findUseCase: UseCaseInterface;
    private _generateUseCase: UseCaseInterface;
    
    constructor(useCasesProps: UseCasesProps){
        this._findUseCase = useCasesProps.findUseCase;
        this._generateUseCase = useCasesProps.generateUseCase;
    }

    findInvoice(input: FindInvoiceFacadeInputDTO): Promise<FindInvoiceFacadeOutputDTO> {
        return this._findUseCase.execute(input);
    }
    generateInvoice(input: GenerateInvoiceFacadeInputDto): Promise<GenerateInvoiceFacadeOutputDto> {
        return this._generateUseCase.execute(input);
    }

}