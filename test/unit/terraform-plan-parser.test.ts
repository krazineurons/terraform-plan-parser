import { promisify } from 'util';
import test from 'ava';
import * as path from 'path';
import * as fs from 'fs';
import * as parser from '../../src';

const readFileAsync = promisify(fs.readFile);

function readExpected (dataFile: string): parser.ParseResult {
  const dataObj: any = require(path.join(__dirname,'data', dataFile + '.expected.json'));
  return dataObj as parser.ParseResult;
}

async function readActual (dataFile: string): Promise<parser.ParseResult> {
  const stdout = await readFileAsync(path.join(__dirname, 'data', dataFile + '.stdout.txt'),
    { encoding: 'utf8' });
  return parser.parseStdout(stdout);
}

async function runTest (dataName: string, t: any) {
  const actual = await readActual(dataName);
  const expected = readExpected(dataName);
  t.deepEqual(actual, expected);
}

test('should strip ansi color codes', async (t) => {
  return runTest('00-terraform-plan', t);
});

test('should parse terraform output - 01', async (t) => {
  return runTest('01-terraform-plan', t);
});

test('should parse terraform output and be fairly lenient - 02', async (t) => {
  return runTest('02-terraform-plan', t);
});

test('should parse terraform output and support all types of changes - 03', async (t) => {
  return runTest('03-terraform-plan', t);
});

test('should fail gracefully if no magic start string is found', async (t) => {
  return runTest('04-no-magic-start', t);
});

test('should fail gracefully if no magic end string is found', async (t) => {
  return runTest('05-no-magic-end', t);
});

test('should handle unexpected attribute value that is not delimited', async (t) => {
  return runTest('06-attribute-value-unexpected-delimiter', t);
});

test('should ignore invalid resource action line', async (t) => {
  return runTest('07-invalid-action-line', t);
});

test('should ignore attribute with missing name', async (t) => {
  return runTest('08-no-attribute-name', t);
});