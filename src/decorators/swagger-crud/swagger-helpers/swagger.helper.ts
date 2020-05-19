import {armarApiBodyCustomizado, armarApiQueryCustomizado} from '../utils/armar-api-body-customizado';
import {BaseConfig, Prototipo} from '../interfaces';
import {DECORATORS} from '@nestjs/swagger/dist/constants';
import {BODY_METADATA_POR_DEFECTO, OPCIONES_QUERY_POR_DEFECTO} from '../constantes';
import {isUndefined, negate, pickBy} from 'lodash';
import {ApiQueryOptions} from '@nestjs/swagger';

export class SwaggerHelper {
    static buildApiBody(configuracion: any, nombreMetodo: string, target: Prototipo) {
        const params = armarApiBodyCustomizado(configuracion.apiBody);
        console.log('params', params);
        console.log('metodo', target.prototype[nombreMetodo]);
        const parametros = Reflect.getMetadata(DECORATORS.API_PARAMETERS, target.prototype[nombreMetodo]) || [];
        console.log('parametros', params);
        Reflect.defineMetadata(
            DECORATORS.API_PARAMETERS,
            [
                ...parametros,
                {
                    ...BODY_METADATA_POR_DEFECTO,
                    ...pickBy(params, negate(isUndefined))
                }
            ],
            target.prototype[nombreMetodo]
        );
    }
    static buildApiQuery(configuracion: BaseConfig, nombreMetodo: string, target: Prototipo) {
        const params = armarApiQueryCustomizado(configuracion.apiQuery as ApiQueryOptions);
        const parametros = Reflect.getMetadata(DECORATORS.API_PARAMETERS, target.prototype[nombreMetodo]) || [];
        Reflect.defineMetadata(
            DECORATORS.API_PARAMETERS,
            [
                ...parametros,
                {
                    ...OPCIONES_QUERY_POR_DEFECTO,
                    ...pickBy(params, negate(isUndefined))
                }
            ],
            target.prototype[nombreMetodo]
        );
    }
}