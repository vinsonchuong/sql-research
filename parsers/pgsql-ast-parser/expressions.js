/**
 * @typedef {import('pgsql-ast-parser/syntax/ast.js').BinaryOperator} BinaryOperator
 * @typedef {import('pgsql-ast-parser/syntax/ast.js').UnaryOperator} UnaryOperator
 * @typedef {import('pgsql-ast-parser/syntax/ast.js').Expr} Expr
 * @typedef {import('pgsql-ast-parser/syntax/ast.js').ExprRef} ExprRef
 * @typedef {import('pgsql-ast-parser/syntax/ast.js').ExprUnary} ExprUnary
 * @typedef {import('pgsql-ast-parser/syntax/ast.js').ExprBinary} ExprBinary
 * @typedef {import('pgsql-ast-parser/syntax/ast.js').ExprLiteral} ExprLiteral
 */

/**
 * Build an AST node for a literal
 *
 * @param {number | string | boolean | null} value - A Literal
 * @return {ExprLiteral} - A SQL literal
 */
export function lit(value) {
  if (Object.is(value, null)) {
    return {type: 'null'}
  }

  if (typeof value === 'string') {
    return {type: 'string', value}
  }

  if (typeof value === 'boolean') {
    return {type: 'boolean', value}
  }

  if (Number.isInteger(value)) {
    return {type: 'integer', value}
  }

  if (Number.isFinite(value)) {
    return {type: 'numeric', value}
  }
}

/**
 * Build an AST node for a reference
 *
 * @param {string} name - The name being referenced
 * @return {ExprRef} - A SQL reference
 */
export function ref(name) {
  return {
    type: 'ref',
    name,
  }
}

/**
 * Build AST nodes for a unary operator
 *
 * @param {UnaryOperator} operator - A SQL operator
 * @param {Expr} operand - A SQL operator
 * @return {ExprUnary} - A SQL statement string
 */
export function uop(operator, operand) {
  return {
    type: 'unary',
    op: operator,
    operand,
  }
}

/**
 * Build AST nodes for a binary operator
 *
 * @param {BinaryOperator} operator - A SQL operator
 * @param {Expr} left - A SQL operator
 * @param {Expr} right - A SQL operator
 * @return {ExprBinary} - A SQL statement string
 */
export function bop(operator, left, right) {
  return {
    type: 'binary',
    op: operator,
    left,
    right,
  }
}

/**
 * Build AST nodes for a binary operator with multiple terms
 *
 * @param {BinaryOperator} operator - A SQL operator
 * @param {[Expr, Expr, ...Array<Expr>]} expressions - A SQL operator
 * @return {ExprBinary} - A SQL statement string
 */
export function bops(operator, expressions) {
  let index = 0

  /** @type {ExprBinary} */
  let result = {
    type: 'binary',
    op: operator,
    left: expressions[index++],
    right: expressions[index++],
  }

  while (index < expressions.length) {
    result = {
      type: 'binary',
      op: operator,
      left: result,
      right: expressions[index++],
    }
  }

  return result
}
