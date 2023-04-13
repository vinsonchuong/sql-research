import {toSql} from 'pgsql-ast-parser'
import {format} from 'sql-formatter'
import {lit, ref, uop, bop, bops} from './expressions.js'

/**
 * @typedef {{
 *   action: 'select',
 *   table: string,
 *   columns?: Array<string>,
 *   where?: Record<string, number | string | boolean | null>,
 *   order?: Record<string, 'ASC' | 'DESC'>
 * }} Statement
 *
 * @typedef {import('pgsql-ast-parser/syntax/ast.js').ExprBinary} ExprBinary
 */

/**
 * Construct a SQL statement
 *
 * @param {Statement} statement - A SQL statement in object form
 * @return {string} - A SQL statement string
 */
export default function sql(statement) {
  return format(
    toSql.statement({
      type: statement.action,
      columns: statement.columns
        ? statement.columns.map((column) => ({
            expr: ref(column),
          }))
        : [{expr: ref('*')}],
      from: [
        {
          type: 'table',
          name: {
            name: statement.table,
          },
        },
      ],
      where: statement.where
        ? bops(
            'AND',
            /** @type [ExprBinary, ExprBinary, ...Array<ExprBinary>] */
            (
              Object.keys(statement.where).map((column) => {
                const value = statement.where[column]

                return Object.is(value, null)
                  ? uop('IS NULL', ref(column))
                  : bop('=', ref(column), lit(value))
              })
            ),
          )
        : undefined,
      orderBy: statement.order
        ? Object.keys(statement.order).map((column) => ({
            order: statement.order[column],
            by: ref(column),
          }))
        : undefined,
    }),
  )
}
