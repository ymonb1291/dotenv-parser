import { dotEnvParser } from "./mod.ts";
import { assertEquals } from "https://deno.land/std@0.79.0/testing/asserts.ts";

const pairs: string = `
# Numeric keys are skipped
0=ZERO
# Keys starting with a number are skipped
0KEY=ZERO
# Keys can contain a number
KEY0=value0
# Keys can start with an underscore
_KEY=_value
# Keys can contain an underscore
KEY_=value_
# Keys can be in lower case
key=value
# Keys can be in upper case
KEY=VALUE
# Keys can be surrounded by several spaces on both sides
  KEY_WITH_SPACE  =VALUE_WITH_SPACE
# An empty value gives an empty string
EMPTY=
# An unquoted numeric value gives a string representing the number by default
# An unquoted numeric value gives a number when inference is enabled
# An unquoted numeric value gives a number when inference is disabled
NUMBER=1
# A quoted numeric value surrounded by spaces gives a string representing the number by default
# A quoted numeric value surrounded by spaces gives a number when inference is enabled
# A quoted numeric value surrounded by spaces gives a number when inference is disabled
QUOTED_NUMBER=" 1 "
# An unquoted true boolean value gives a string representing the boolean by default
# An unquoted true boolean value gives a boolean when inference is enabled
# An unquoted true boolean value gives a boolean when inference is disabled
BOOL_TRUE=true
# An unquoted true boolean value in upper case gives a string representing the boolean by default
# An unquoted true boolean value in upper case gives a boolean when inference is enabled
# An unquoted true boolean value in upper case gives a boolean when inference is disabled
BOOL_TRUE_UPPER=TRUE
# An unquoted false boolean value gives a string representing the boolean by default
# An unquoted false boolean value gives a boolean when inference is enabled
# An unquoted false boolean value gives a boolean when inference is disabled
BOOL_FALSE=false
# An unquoted false boolean value in upper case gives a string representing the boolean by default
# An unquoted false boolean value in upper case gives a boolean when inference is enabled
# An unquoted false boolean value in upper case gives a boolean when inference is disabled
BOOL_FALSE_UPPER=FALSE
# A value can contain a hashtag
HASH=#HASH
# A value can contain an equal character
EQUAL=1+1=2
# A string value can be unquoted and surrounding spaces are trimmed
UNQUOTED= unquoted value 
# A string value can be single quoted and surrounding spaces are not trimmed
SINGLE_QUOTED= ' single quoted value ' 
# A string value can be double quoted and surrounding spaces are not trimmed
DOUBLE_QUOTED= " double quoted value " 
# A single quoted string can contain escaped single-quotes
ESCAPED_SINGLE_QUOTED='a \\'b\\' c'
# A double quoted string can contain escaped double-quotes
ESCAPED_DOUBLE_QUOTED="a \\"b\\" c"

# Multiline unquoted values are accepted
UNQUOTED_MULTI=unquoted
multi

# Multiline single-quoted values are accepted
SINGLE_QUOTED_MULTI='single
quoted
multi'

# Multiline double-quoted values are accepted
DOUBLE_QUOTED_MULTI="double
quoted
multi"

# Escaped hashtags are not treated as comment in multiline values
HASH_MULTI=hash
\\#multi

# Escaped equal characters without key are not treated as a pair in multiline values
EQUAL_MULTI=equal
\\=multi

# Escaped equal characters with key are not treated as a pair in multiline values
KEY_EQUAL_MULTI=key
equal\\=multi
`;

const response = dotEnvParser(pairs);
const fresponse = dotEnvParser(pairs, false);
const tresponse = dotEnvParser(pairs, true);

Deno.test("Numeric keys are skipped", () => {
  const res = response.hasOwnProperty("0");
  assertEquals(res, false);
});

Deno.test("Numeric keys are skipped", () => {
  const res = response.hasOwnProperty("0KEY");
  assertEquals(res, false);
});

Deno.test("Keys can contain a number", () => {
  assertEquals(response["KEY0"], "value0");
});

Deno.test("Keys can start with an underscore", () => {
  assertEquals(response["_KEY"], "_value");
});

Deno.test("Keys can contain an underscore", () => {
  assertEquals(response["KEY_"], "value_");
});

Deno.test("Keys can be in lower case", () => {
  assertEquals(response["key"], "value");
});

Deno.test("Keys can be in upper case", () => {
  assertEquals(response["KEY"], "VALUE");
});

Deno.test("Keys can be surrounded by several spaces on both sides", () => {
  assertEquals(response["KEY_WITH_SPACE"], "VALUE_WITH_SPACE");
});

Deno.test("An empty value gives an empty string", () => {
  assertEquals(response["EMPTY"], "");
});

Deno.test("An unquoted numeric value gives a string representing the number by default", () => {
  assertEquals(response["NUMBER"], "1");
});

Deno.test("An unquoted numeric value gives a number when inference is enabled", () => {
  assertEquals(tresponse["NUMBER"], 1);
});

Deno.test("An unquoted numeric value gives a number when inference is disabled", () => {
  assertEquals(fresponse["NUMBER"], "1");
});

Deno.test("A quoted numeric value surrounded by spaces gives a string representing the number by default", () => {
  assertEquals(response["QUOTED_NUMBER"], " 1 ");
});

Deno.test("A quoted numeric value surrounded by spaces gives a number when inference is enabled", () => {
  assertEquals(tresponse["QUOTED_NUMBER"], 1);
});

Deno.test("A quoted numeric value surrounded by spaces gives a number when inference is disabled", () => {
  assertEquals(fresponse["QUOTED_NUMBER"], " 1 ");
});

Deno.test("An unquoted true boolean value gives a string representing the boolean by default", () => {
  assertEquals(response["BOOL_TRUE"], "true");
});

Deno.test("An unquoted true boolean value gives a boolean when inference is enabled", () => {
  assertEquals(tresponse["BOOL_TRUE"], true);
});

Deno.test("An unquoted true boolean value gives a boolean when inference is disabled", () => {
  assertEquals(fresponse["BOOL_TRUE"], "true");
});

Deno.test("An unquoted true boolean value in upper case gives a string representing the boolean by default", () => {
  assertEquals(response["BOOL_TRUE_UPPER"], "TRUE");
});

Deno.test("An unquoted true boolean value in upper case gives a boolean when inference is enabled", () => {
  assertEquals(tresponse["BOOL_TRUE_UPPER"], true);
});

Deno.test("An unquoted true boolean value in upper case gives a boolean when inference is disabled", () => {
  assertEquals(fresponse["BOOL_TRUE_UPPER"], "TRUE");
});

Deno.test("An unquoted false boolean value gives a string representing the boolean by default", () => {
  assertEquals(response["BOOL_FALSE"], "false");
});

Deno.test("An unquoted false boolean value gives a boolean when inference is enabled", () => {
  assertEquals(tresponse["BOOL_FALSE"], false);
});

Deno.test("An unquoted false boolean value gives a boolean when inference is disabled", () => {
  assertEquals(fresponse["BOOL_FALSE"], "false");
});

Deno.test("An unquoted false boolean value in upper case gives a string representing the boolean by default", () => {
  assertEquals(response["BOOL_FALSE_UPPER"], "FALSE");
});

Deno.test("An unquoted false boolean value in upper case gives a boolean when inference is enabled", () => {
  assertEquals(tresponse["BOOL_FALSE_UPPER"], false);
});

Deno.test("An unquoted false boolean value in upper case gives a boolean when inference is disabled", () => {
  assertEquals(fresponse["BOOL_FALSE_UPPER"], "FALSE");
});

Deno.test("A value can contain a hashtag", () => {
  assertEquals(response["HASH"], "#HASH");
});

Deno.test("A value can contain an equal character", () => {
  assertEquals(response["EQUAL"], "1+1=2");
});

Deno.test("A string value can be unquoted and surrounding spaces are trimmed", () => {
  assertEquals(response["UNQUOTED"], "unquoted value");
});

Deno.test("A string value can be single quoted and surrounding spaces are not trimmed", () => {
  assertEquals(response["SINGLE_QUOTED"], " single quoted value ");
});

Deno.test("A string value can be double quoted and surrounding spaces are not trimmed", () => {
  assertEquals(response["DOUBLE_QUOTED"], " double quoted value ");
});

Deno.test("A single quoted string can contain escaped single-quotes", () => {
  assertEquals(response["ESCAPED_SINGLE_QUOTED"], "a 'b' c");
});

Deno.test("A double quoted string can contain escaped double-quotes", () => {
  assertEquals(response["ESCAPED_DOUBLE_QUOTED"], 'a "b" c');
});

Deno.test("Multiline unquoted values are accepted", () => {
  assertEquals(response["UNQUOTED_MULTI"], "unquoted\nmulti");
});

Deno.test("Multiline single-quoted values are accepted", () => {
  assertEquals(response["SINGLE_QUOTED_MULTI"], "single\nquoted\nmulti");
});

Deno.test("Multiline double-quoted values are accepted", () => {
  assertEquals(response["DOUBLE_QUOTED_MULTI"], "double\nquoted\nmulti");
});

Deno.test("Escaped hashtags are not treated as comment in multiline values", () => {
  assertEquals(response["HASH_MULTI"], "hash\n#multi");
});

Deno.test("Escaped equal characters without key are not treated as a pair in multiline values", () => {
  assertEquals(response["EQUAL_MULTI"], "equal\n=multi");
});

Deno.test("Escaped equal characters with key are not treated as a pair in multiline values", () => {
  assertEquals(response["KEY_EQUAL_MULTI"], "key\nequal=multi");
});