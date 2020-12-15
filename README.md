# dotenv-parser
![GitHub Workflow Status](https://img.shields.io/github/workflow/status/ymonb1291/dotenv-parser/ci?label=ci)
![GitHub release (latest by date including pre-releases)](https://img.shields.io/github/v/release/ymonb1291/dotenv-parser?include_prereleases)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/ymonb1291/dotenv-parser)
[![deno doc](https://doc.deno.land/badge.svg)](https://doc.deno.land/https/deno.land/x/dotenv-parser/mod.ts)
![GitHub](https://img.shields.io/github/license/ymonb1291/dotenv-parser)

[![nest badge](https://nest.land/badge.svg)](https://nest.land/package/dotenv-parser)

A fast, zero-permission parser for '.env' files with support for multiline variables.

# Usage
## Import
Import `dotenv-parser` from one of the following registries:
```
// From Deno.land
import { dotEnvParser } from "https://deno.land/x/dotenv_parser@v1.0.2/mod.ts";

// From Nest.land
import { dotEnvParser } from "https://x.nest.land/dotenv-parser@v1.0.2/mod.ts";

// From Denopkg
import { dotEnvParser } from "https://denopkg.com/ymonb1291/dotenv-parser@v1.0.2/mod.ts";

// From Github
import { dotEnvParser } from "https://raw.githubusercontent.com/ymonb1291/dotenv-parser/v1.0.2/mod.ts";
```

## Read the `.env` file
`dotenv-parser` doesn't ship with a way to read files. You must decode your `.env` file on your own.

For example:
```
const decoder = new TextDecoder("utf-8");
const raw = Deno.readFileSync(".env");
const data = decoder.decode(raw);
console.log(dotEnvParser(data));
```
For the purpose of this documentation, we'll simply declare a string variable that contains the configuration.

For example:
```
const config = `
  SERVER_HOST=localhost
  SERVER_PORT=3000
  SERVER_HTTPS=true
`;
```

## Parsing
The `dotEnvParser` function looks for `KEY=VALUE` pairs in a string and returns them as an object where all keys and values are of type `string`:
```
const res = dotEnvParser(config);
console.log(res);
//  Output:
//    { SERVER_HOST: "localhost", SERVER_PORT: "3000", SERVER_HTTPS: "true" }
```
`DotEnvParser` can also try accept a second `boolean` parameter. When true, the parser will try to infer the type of the value. Numbers and booleans will then be converted to their respective type:
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
The parser supports key/value pairs formatted as `KEY=VALUE`. The following rules apply:
* Empty lines are skipped
* Lines beginning with `#` are treated as comments and are skipped
* `KEY=VALUE` becomes `{KEY="VALUE"}`
  * Single quoted values can also be used: `KEY='VALUE'` also becomes `{KEY="VALUE"}`
  * Double quoted values can also be used: `KEY="VALUE"` also becomes `{KEY="VALUE"}`
* Keys can contain upper case letters `A-Z`, lower case letters `a-z` and underscore character `_`. Numbers `0-9` are also valid when not in first position. For example:
  * `_Key0=VALUE` is valid and becomes `{_Key0="VALUE"}`
  * `0Key_=VALUE` is not valid
* Empty values are treated as empty string. `EMPTY=` becomes `{EMPTY=""}`
* Single and double quoted values keep their surrounding spaces. Non quoted values do not.
  * `KEY= VALUE ` becomes `{KEY="VALUE"}`
  * `KEY=" VALUE "` becomes `{KEY=" VALUE "}`
* Inner quotes are maintained. `JSON={"KEY": "VALUE"}` becomes `{JSON="{\"KEY\": \"VALUE\"}"}`
* Multiline values are accepted with and without quotes. For example:
  ```
  SAY_HELLO=Hello
  World!
  ```
  becomes `{SAY_HELLO: "Hello\nWorld!"}`
* Multiline values can contain `=` if escaped
  ```
  CALC=1+1
  \\=2
  ```
  becomes `{CALC: "1+1\n=2"}`
* Multiline values can contain `#` if escaped
  ```
  HASH=Hello
  \\#World
  ```
  becomes `{HASH: "Hello\n#World"}`

# Contributions
PRs are welcome!