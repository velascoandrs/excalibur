import {getConnection, ObjectType} from 'typeorm';
import {ConsultaFindFullInterface} from './interfaces/consulta.findFull.interface';
import {InternalServerErrorException} from '@nestjs/common';
import {buscarRegistros} from './funciones-busqueda/buscar-registros.funcion';

export async function findFull<T = ObjectType<{}>>(
    entidad: ObjectType<{}> | T,
    query: ConsultaFindFullInterface,
    conexion: string = 'default',
) {
    const consulta = getConnection(conexion).createQueryBuilder(entidad as ObjectType<{}>, 'entidadBase');
    try {
        return await buscarRegistros(consulta, query) as [T[], number];
    } catch (error) {
        console.error(
            {
                error,
                mensaje: 'Error en generar la consulta',
                data: {
                    query,
                },
            },
        );
        throw new InternalServerErrorException(
            {
                mensaje: 'Error en generar la consulta',
            },
        );
    }
}