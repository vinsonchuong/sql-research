#!/usr/bin/env node
import {parseFirst} from 'pgsql-ast-parser'
import getStdin from 'get-stdin'

const stdin = await getStdin()
const ast = parseFirst(stdin)
console.log(JSON.stringify(ast, null, 2))
