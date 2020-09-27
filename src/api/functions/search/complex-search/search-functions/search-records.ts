import {SelectQueryBuilder} from 'typeorm';
import {FindFullQuery} from '../../../../..';
import {generateQuery} from '../generators/generate-query';
import {OrderByInterface} from '../../../../..';
import {BASE_ENTITY_NAME} from '../constants/query-operators';

export async function searchRecords(
    selectQueryBuilder: SelectQueryBuilder<{}>,
    query: FindFullQuery,
): Promise<[{}[], number]> {
    const sqlQuery = await generateQuery(selectQueryBuilder, query.where);
    const hasSkip = !!query.skip;
    const hasTake = !!query.take;
    const hasOrderBy = !!query.orderBy;
    let queryResponse: SelectQueryBuilder<{}>;
    let skip: number | undefined = 0;
    let take: number | undefined = 10;
    let orderBy: OrderByInterface | undefined = {};
    orderBy[`${BASE_ENTITY_NAME}.id`] = 'DESC';
    if (hasOrderBy) {
        orderBy = query.orderBy;
    }
    if (hasSkip) {
        skip = query.skip;
    }
    if (hasTake) {
        take = query.take;
    }
    if (skip === 0 && take === 0) {
        queryResponse = await sqlQuery.orderBy(orderBy as OrderByInterface);
    } else {
        queryResponse = await sqlQuery.orderBy(orderBy as OrderByInterface).skip(skip).take(take);
    }
    queryResponse.skip(skip).take(take);
    // console.log(queryResponse.getSql());
    return queryResponse.getManyAndCount();
}
