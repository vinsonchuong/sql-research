import test from 'ava'
import NodeSQL from 'node-sql-parser'

test('building queries', (t) => {
  const parser = new NodeSQL.Parser()

  const ast = parser.astify(
    `SELECT a, b, c, d FROM article WHERE a = 1 AND b = '2' AND c = true AND d IS NULL`,
  )
  console.log(ast)

  console.log(parser.sqlify(ast))

  t.pass()
})
