# dotenv-parser
A fast, zero-permission Dotenv parser.

This module doesn't load any file, it only parses their content.

## Usage
Import `dotenv-parser`:
```
// From Denopkg
import { dotEnvParser } from "https://denopkg.com/ymonb1291/dotenv-parser/mod.ts";
// From Github
import { dotEnvParser } from "https://raw.githubusercontent.com/ymonb1291/dotenv-parser/main/mod.ts";
```
Read your `.env` file and decode its content into a string, or just declare a string variable with `KEY=VALUE` pairs. For example:
```
const config = `
  SERVER_HOST=localhost
  SERVER_PORT=3000
  SERVER_HTTPS=true
`;
```
Parse the configuration:
```
const res = dotEnvParser(config);
console.log(res);
//  Output:
//    { SERVER_HOST: "localhost", SERVER_PORT: "3000", SERVER_HTTPS: "true" }
```
By default, all values are of type `string`. If you wish to automatically convert numbers and booleans to their respective types, you need to specify the `infer` parameter to `true`:
```
const res = dotEnvParser(config, true);
console.log(res);
//  Output:
//    { SERVER_HOST: "localhost", SERVER_PORT: 3000, SERVER_HTTPS: true }
```
# dotEnvParser
The parser has the following signature
```
function dotEnvParser<false>(raw: string): Data;
function dotEnvParser<false>(raw: string, infer: false): Data;
function dotEnvParser<true>(raw: string, infer: true): TypedData;
```
## Data interface
`Data` describes the object returned when the infer parameter is `false` or `undefined`. It describes a plain object where all values are of type `string`.
```
interface Data {
  [key: string]: string;
}
```
## TypedData interface
`TypedData` describes the object returned when the infer parameter is `true`. It describes a plain object where the values can be of type `string`, `number` or `boolean`.
```
interface TypedData {
  [key: string]: string | number | boolean;
}
```
# Parsing rules
*Coming soon* 

# Contributions
PRs are welcome!