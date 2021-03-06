import {BaseMongoDTO, DtoMongoConfigInterface} from '../../..';
import {PrincipalAuthCrudValidation, PrincipalCrudController, AbstractMongoService} from '../../..';
import {AuthCrudGeneric} from '../auth/auth.crud.generic';


export abstract class ApiMongoController<T>  extends  PrincipalCrudController<T>{
    protected constructor(
        private readonly _mongoService: AbstractMongoService<T>,
        private readonly _mongoDtoConfig: DtoMongoConfigInterface  = {createDtoType: BaseMongoDTO, updateDtoType: BaseMongoDTO},
        private readonly _mongoAuthSecurityCrud: PrincipalAuthCrudValidation = new AuthCrudGeneric(),
    ) {
        super(
            _mongoService,
            _mongoDtoConfig,
            _mongoAuthSecurityCrud,
        );
    }

    protected validateId(id: any): boolean {
        return !!id;
    }
}
