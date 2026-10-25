import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { SCHEMAS } from './schemas';

/*
 * Validates API responses against their JSON Schema (contract), using Ajv.
 * `allErrors` reports every broken rule at once, not only the first one.
 */
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

/**
 * @param {string} contractName - a key of SCHEMAS, e.g. "user created"
 * @param {unknown} body - the response body
 * @returns {{ valid: boolean, errors: string }}
 */
export function validateContract(contractName, body) {
  const schema = SCHEMAS[contractName];
  if (!schema) {
    throw new Error(`Unknown contract "${contractName}". Use: ${Object.keys(SCHEMAS).join(', ')}.`);
  }

  const validate = ajv.compile(schema);
  const valid = validate(body);

  return { valid, errors: valid ? '' : ajv.errorsText(validate.errors) };
}
