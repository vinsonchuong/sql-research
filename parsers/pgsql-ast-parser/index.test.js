import test from 'ava'
import {format} from 'sql-formatter'
import {parseFirst, toSql} from 'pgsql-ast-parser'
import sql from './sql.js'

test('building SELECT statements', (t) => {
  t.is(
    sql({
      action: 'select',
      table: 'articles',
    }),
    format('SELECT * FROM articles'),
  )

  t.is(
    sql({
      action: 'select',
      table: 'articles',
      columns: ['c1', 'c2'],
    }),
    format('SELECT c1, c2 FROM articles'),
  )

  t.is(
    sql({
      action: 'select',
      table: 'articles',
      columns: ['c1', 'c2', 'c3', 'c4'],
      where: {
        c1: 'foo',
        c2: 1,
        c3: null,
        c4: true,
      },
    }),
    format(`
      SELECT c1, c2, c3, c4
      FROM articles
      WHERE ((((c1 = ('foo'))
        AND (c2 = (1)))
        AND (c3 IS NULL))
        AND (c4 = (true)))
    `),
  )

  t.is(
    sql({
      action: 'select',
      table: 'articles',
      columns: ['c1', 'c2', 'c3', 'c4'],
      order: {
        c1: 'ASC',
        c2: 'DESC',
      },
    }),
    format(`
      SELECT c1, c2, c3, c4
      FROM articles
      ORDER BY c1 ASC, c2 DESC
    `),
  )

  // Example
  // console.log(
  //   sql({
  //     action: 'select',
  //     table: 'articles',
  //     columns: ['c1', 'c2'],
  //     where: {
  //       c1: 'foo',
  //       c2: 1,
  //       c3: null,
  //     },
  //     order: {
  //       c1: 'ASC',
  //       c2: 'DESC',
  //     },
  //   }),
  // )

  // Example
  // const ast = parseFirst(
  //   `SELECT * FROM articles WHERE account_id = 1 AND user_id = 'foo' AND c2 IS NULL AND c3 = TRUE`,
  // )
  // console.log(toSql.statement(ast))
  // console.log(JSON.stringify(ast, null, 2))
  // {
  //   "type": "select",
  //   "columns": [
  //     {
  //       "expr": {
  //         "type": "ref",
  //         "name": "*"
  //       }
  //     }
  //   ],
  //   "from": [
  //     {
  //       "type": "table",
  //       "name": {
  //         "name": "articles"
  //       }
  //     }
  //   ],
  //   "where": {
  //     "type": "binary",
  //     "left": {
  //       "type": "binary",
  //       "left": {
  //         "type": "ref",
  //         "name": "account_id"
  //       },
  //       "right": {
  //         "type": "parameter",
  //         "name": "$1"
  //       },
  //       "op": "="
  //     },
  //     "right": {
  //       "type": "binary",
  //       "left": {
  //         "type": "ref",
  //         "name": "user_id"
  //       },
  //       "right": {
  //         "type": "parameter",
  //         "name": "$2"
  //       },
  //       "op": "="
  //     },
  //     "op": "AND"
  //   },
  //   "orderBy": [
  //     {
  //       "by": {
  //         "type": "ref",
  //         "name": "created_at"
  //       },
  //       "order": "DESC"
  //     }
  //   ],
  // }
})
