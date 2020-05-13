import {
  BadRequestException,
  Body,
  Delete,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ServicioPrincipal } from './servicio.principal';
import { RespuestaPrincipalInterface } from '../interfaces/respuesta.principal.interface';
import { validate } from 'class-validator';
import { FindManyOptions, Like, UpdateResult } from 'typeorm';

export class ControladorPrincipal<Entidad> {
  nombreClaseDtoEditar: any;
  nombreClaseDtoCrear: any;

  constructor(private readonly _principalService: ServicioPrincipal<Entidad>) {}

  @Post()
  async crear(
    @Body() nuevo: Entidad,
  ): Promise<Entidad> {
    const entidadoDto = new this.nombreClaseDtoCrear(nuevo);
    const erroresValidacion = await validate(entidadoDto);
    if (erroresValidacion.length > 0) {
      throw new BadRequestException(erroresValidacion);
    } else {
      try {
        const nuevoRegistro = await this._principalService.crear(nuevo);
        return nuevoRegistro as Entidad;
      } catch (e) {
        throw new BadRequestException(e);
      }
    }
  }

  @Put(':id')
  async editar(
    @Body() datosActualizar: Entidad,
    @Param('id') id: number,
  ): Promise<RespuestaPrincipalInterface<Entidad | UpdateResult | any>> {
    const idValido = !isNaN(Number(id));
    if (idValido) {
      const entidadoDto = new this.nombreClaseDtoEditar(datosActualizar);
      const erroresValidacion = await validate(entidadoDto);
      if (erroresValidacion.length > 0) {
        throw new BadRequestException(erroresValidacion);
      } else {
        try {
          const registroActualizadoActualizado = await this._principalService.editar(
            Number(id),
            datosActualizar,
          );
          return {
            data: registroActualizadoActualizado,
          };
        } catch (e) {
          throw new InternalServerErrorException(e);
        }
      }
    } else {
      throw new BadRequestException('id inválido!!');
    }
  }

  @Delete(':id')
  async eliminar(
    @Param('id') id: number,
  ): Promise<RespuestaPrincipalInterface<Entidad>> {
    const idValido = !isNaN(Number(id));
    if (idValido) {
      try {
        const registroBorrado = await this._principalService.borrar(Number(id));
        return {
          data: registroBorrado,
          error: false,
          statusCode: HttpStatus.ACCEPTED,
        };
      } catch (e) {
        throw new BadRequestException(e);
      }
    } else {
      throw new BadRequestException('id inválido!!');
    }
  }

  @Get(':id')
  async buscarPorId(
    @Param('id') id: number,
  ): Promise<Entidad> {
    const idValido = !isNaN(Number(id));
    if (idValido) {
      try {
        const registrosBuscados = await this._principalService.buscarPorId(
          Number(id),
        );
        return registrosBuscados as Entidad;
      } catch (e) {
        throw new BadRequestException(e);
      }
    } else {
      throw new BadRequestException('id inválido!!');
    }
  }

  @Get()
  async buscarTodos(
    @Query() criteriosBusqueda: any,
  ): Promise<[Entidad[], number]> {
    const mandaParametrosBusqueda = criteriosBusqueda !== undefined;
    try {
      let registros: [Entidad[], number];
      if (mandaParametrosBusqueda) {
        const query = generarQuery(criteriosBusqueda);
        console.log(query);
        registros = await this._principalService.listar(query);
      } else {
        registros = await this._principalService.listar({
          order: { id: 'DESC' },
        });
      }
      return [
        registros[0],
        registros[1],
      ];
    } catch (e) {
      throw new BadRequestException(e);
    }
  }
}

export function convertirStringArreglo(cadena: string) {
  const longitud = cadena.length;
  const posicionFinal = longitud - 1;
  const soloTexto = cadena.slice(1, posicionFinal);
  return soloTexto.split(',');
}

export function generarQuery(parametro: any) {
  const llaves = Object.keys(parametro);
  const query: FindManyOptions = {
    order: { id: 'DESC' },
    skip: 0,
    take: 5,
  };
  llaves.forEach((llave: string) => {
    switch (llave) {
      case 'where':
        const parametrosWhere = JSON.parse(parametro[llave]); // {nombre: {like: 'abc'}}
        const valoresParametroWhere = Object.values(parametrosWhere); // [{'like':'abc'}, ...]
        const llavesParametroWhere = Object.keys(parametrosWhere); // ['nombre',...]
        valoresParametroWhere.forEach((valor: any, index) => {
          if (typeof valor === 'object') {
            const llaves = Object.keys(valor);
            llaves.forEach(subLlave => {
              if (subLlave === 'like') {
                parametrosWhere[llavesParametroWhere[index]] = Like(
                  `%${valor.like}%`,
                );
              }
            });
          }
        });
        query.where = parametrosWhere;
        break;
      case 'relations':
        query.relations = convertirStringArreglo(parametro[llave]);
        break;
      case 'order':
        query.order = JSON.parse(parametro[llave]);
        break;
      case 'skip':
        query.skip = !isNaN(+parametro[llave]) ? +parametro[llave] : 0;
        break;
      case 'take':
        query.take = !isNaN(+parametro[llave]) ? +parametro[llave] : 0;
        break;
    }
  });
  return query;
}
