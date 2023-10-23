function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
  var desc = {};
  Object.keys(descriptor).forEach(function (key) {
    desc[key] = descriptor[key];
  });
  desc.enumerable = !!desc.enumerable;
  desc.configurable = !!desc.configurable;
  if ('value' in desc || desc.initializer) {
    desc.writable = true;
  }
  desc = decorators.slice().reverse().reduce(function (desc, decorator) {
    return decorator(target, property, desc) || desc;
  }, desc);
  if (context && desc.initializer !== void 0) {
    desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
    desc.initializer = undefined;
  }
  if (desc.initializer === void 0) {
    Object.defineProperty(target, property, desc);
    desc = null;
  }
  return desc;
}


var PromiseIndexBrand;
(function (PromiseIndexBrand) {
  PromiseIndexBrand[PromiseIndexBrand["_"] = -1] = "_";
})(PromiseIndexBrand || (PromiseIndexBrand = {}));
const TYPE_KEY = "typeInfo";
var TypeBrand;
(function (TypeBrand) {
  TypeBrand["BIGINT"] = "bigint";
  TypeBrand["DATE"] = "date";
})(TypeBrand || (TypeBrand = {}));
const ERR_INCONSISTENT_STATE = "The collection is an inconsistent state. Did previous smart contract execution terminate unexpectedly?";
const ERR_INDEX_OUT_OF_BOUNDS = "Index out of bounds";

function assert(expression, message) {
  if (!expression) {
    throw new Error("assertion failed: " + message);
  }
}
function getValueWithOptions(value, options = {
  deserializer: deserialize
}) {
  if (value === null) {
    return options?.defaultValue ?? null;
  }
  const deserialized = deserialize(value);
  if (deserialized === undefined || deserialized === null) {
    return options?.defaultValue ?? null;
  }
  if (options?.reconstructor) {
    return options.reconstructor(deserialized);
  }
  return deserialized;
}
function serializeValueWithOptions(value, {
  serializer
} = {
  serializer: serialize
}) {
  return serializer(value);
}
function serialize(valueToSerialize) {
  return encode(JSON.stringify(valueToSerialize, function (key, value) {
    if (typeof value === "bigint") {
      return {
        value: value.toString(),
        [TYPE_KEY]: TypeBrand.BIGINT
      };
    }
    if (typeof this[key] === "object" && this[key] !== null && this[key] instanceof Date) {
      return {
        value: this[key].toISOString(),
        [TYPE_KEY]: TypeBrand.DATE
      };
    }
    return value;
  }));
}
function deserialize(valueToDeserialize) {
  return JSON.parse(decode(valueToDeserialize), (_, value) => {
    if (value !== null && typeof value === "object" && Object.keys(value).length === 2 && Object.keys(value).every(key => ["value", TYPE_KEY].includes(key))) {
      switch (value[TYPE_KEY]) {
        case TypeBrand.BIGINT:
          return BigInt(value["value"]);
        case TypeBrand.DATE:
          return new Date(value["value"]);
      }
    }
    return value;
  });
}

function bytes(s) {
  return env.latin1_string_to_uint8array(s);
}

function str(a) {
  return env.uint8array_to_latin1_string(a);
}

function encode(s) {
  return env.utf8_string_to_uint8array(s);
}

function decode(a) {
  return env.uint8array_to_utf8_string(a);
}


function assertNumber(n) {
  if (!Number.isSafeInteger(n)) throw new Error(`Wrong integer: ${n}`);
}
function chain(...args) {
  const wrap = (a, b) => c => a(b(c));
  const encode = Array.from(args).reverse().reduce((acc, i) => acc ? wrap(acc, i.encode) : i.encode, undefined);
  const decode = args.reduce((acc, i) => acc ? wrap(acc, i.decode) : i.decode, undefined);
  return {
    encode,
    decode
  };
}
function alphabet(alphabet) {
  return {
    encode: digits => {
      if (!Array.isArray(digits) || digits.length && typeof digits[0] !== 'number') throw new Error('alphabet.encode input should be an array of numbers');
      return digits.map(i => {
        assertNumber(i);
        if (i < 0 || i >= alphabet.length) throw new Error(`Digit index outside alphabet: ${i} (alphabet: ${alphabet.length})`);
        return alphabet[i];
      });
    },
    decode: input => {
      if (!Array.isArray(input) || input.length && typeof input[0] !== 'string') throw new Error('alphabet.decode input should be array of strings');
      return input.map(letter => {
        if (typeof letter !== 'string') throw new Error(`alphabet.decode: not string element=${letter}`);
        const index = alphabet.indexOf(letter);
        if (index === -1) throw new Error(`Unknown letter: "${letter}". Allowed: ${alphabet}`);
        return index;
      });
    }
  };
}
function join(separator = '') {
  if (typeof separator !== 'string') throw new Error('join separator should be string');
  return {
    encode: from => {
      if (!Array.isArray(from) || from.length && typeof from[0] !== 'string') throw new Error('join.encode input should be array of strings');
      for (let i of from) if (typeof i !== 'string') throw new Error(`join.encode: non-string input=${i}`);
      return from.join(separator);
    },
    decode: to => {
      if (typeof to !== 'string') throw new Error('join.decode input should be string');
      return to.split(separator);
    }
  };
}
function padding(bits, chr = '=') {
  assertNumber(bits);
  if (typeof chr !== 'string') throw new Error('padding chr should be string');
  return {
    encode(data) {
      if (!Array.isArray(data) || data.length && typeof data[0] !== 'string') throw new Error('padding.encode input should be array of strings');
      for (let i of data) if (typeof i !== 'string') throw new Error(`padding.encode: non-string input=${i}`);
      while (data.length * bits % 8) data.push(chr);
      return data;
    },
    decode(input) {
      if (!Array.isArray(input) || input.length && typeof input[0] !== 'string') throw new Error('padding.encode input should be array of strings');
      for (let i of input) if (typeof i !== 'string') throw new Error(`padding.decode: non-string input=${i}`);
      let end = input.length;
      if (end * bits % 8) throw new Error('Invalid padding: string should have whole number of bytes');
      for (; end > 0 && input[end - 1] === chr; end--) {
        if (!((end - 1) * bits % 8)) throw new Error('Invalid padding: string has too much padding');
      }
      return input.slice(0, end);
    }
  };
}
function normalize(fn) {
  if (typeof fn !== 'function') throw new Error('normalize fn should be function');
  return {
    encode: from => from,
    decode: to => fn(to)
  };
}
function convertRadix(data, from, to) {
  if (from < 2) throw new Error(`convertRadix: wrong from=${from}, base cannot be less than 2`);
  if (to < 2) throw new Error(`convertRadix: wrong to=${to}, base cannot be less than 2`);
  if (!Array.isArray(data)) throw new Error('convertRadix: data should be array');
  if (!data.length) return [];
  let pos = 0;
  const res = [];
  const digits = Array.from(data);
  digits.forEach(d => {
    assertNumber(d);
    if (d < 0 || d >= from) throw new Error(`Wrong integer: ${d}`);
  });
  while (true) {
    let carry = 0;
    let done = true;
    for (let i = pos; i < digits.length; i++) {
      const digit = digits[i];
      const digitBase = from * carry + digit;
      if (!Number.isSafeInteger(digitBase) || from * carry / from !== carry || digitBase - digit !== from * carry) {
        throw new Error('convertRadix: carry overflow');
      }
      carry = digitBase % to;
      digits[i] = Math.floor(digitBase / to);
      if (!Number.isSafeInteger(digits[i]) || digits[i] * to + carry !== digitBase) throw new Error('convertRadix: carry overflow');
      if (!done) continue;else if (!digits[i]) pos = i;else done = false;
    }
    res.push(carry);
    if (done) break;
  }
  for (let i = 0; i < data.length - 1 && data[i] === 0; i++) res.push(0);
  return res.reverse();
}
const gcd = (a, b) => !b ? a : gcd(b, a % b);
const radix2carry = (from, to) => from + (to - gcd(from, to));
function convertRadix2(data, from, to, padding) {
  if (!Array.isArray(data)) throw new Error('convertRadix2: data should be array');
  if (from <= 0 || from > 32) throw new Error(`convertRadix2: wrong from=${from}`);
  if (to <= 0 || to > 32) throw new Error(`convertRadix2: wrong to=${to}`);
  if (radix2carry(from, to) > 32) {
    throw new Error(`convertRadix2: carry overflow from=${from} to=${to} carryBits=${radix2carry(from, to)}`);
  }
  let carry = 0;
  let pos = 0;
  const mask = 2 ** to - 1;
  const res = [];
  for (const n of data) {
    assertNumber(n);
    if (n >= 2 ** from) throw new Error(`convertRadix2: invalid data word=${n} from=${from}`);
    carry = carry << from | n;
    if (pos + from > 32) throw new Error(`convertRadix2: carry overflow pos=${pos} from=${from}`);
    pos += from;
    for (; pos >= to; pos -= to) res.push((carry >> pos - to & mask) >>> 0);
    carry &= 2 ** pos - 1;
  }
  carry = carry << to - pos & mask;
  if (!padding && pos >= from) throw new Error('Excess padding');
  if (!padding && carry) throw new Error(`Non-zero padding: ${carry}`);
  if (padding && pos > 0) res.push(carry >>> 0);
  return res;
}
function radix(num) {
  assertNumber(num);
  return {
    encode: bytes => {
      if (!(bytes instanceof Uint8Array)) throw new Error('radix.encode input should be Uint8Array');
      return convertRadix(Array.from(bytes), 2 ** 8, num);
    },
    decode: digits => {
      if (!Array.isArray(digits) || digits.length && typeof digits[0] !== 'number') throw new Error('radix.decode input should be array of strings');
      return Uint8Array.from(convertRadix(digits, num, 2 ** 8));
    }
  };
}
function radix2(bits, revPadding = false) {
  assertNumber(bits);
  if (bits <= 0 || bits > 32) throw new Error('radix2: bits should be in (0..32]');
  if (radix2carry(8, bits) > 32 || radix2carry(bits, 8) > 32) throw new Error('radix2: carry overflow');
  return {
    encode: bytes => {
      if (!(bytes instanceof Uint8Array)) throw new Error('radix2.encode input should be Uint8Array');
      return convertRadix2(Array.from(bytes), 8, bits, !revPadding);
    },
    decode: digits => {
      if (!Array.isArray(digits) || digits.length && typeof digits[0] !== 'number') throw new Error('radix2.decode input should be array of strings');
      return Uint8Array.from(convertRadix2(digits, bits, 8, revPadding));
    }
  };
}
function unsafeWrapper(fn) {
  if (typeof fn !== 'function') throw new Error('unsafeWrapper fn should be function');
  return function (...args) {
    try {
      return fn.apply(null, args);
    } catch (e) {}
  };
}
const base16 = chain(radix2(4), alphabet('0123456789ABCDEF'), join(''));
const base32 = chain(radix2(5), alphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'), padding(5), join(''));
chain(radix2(5), alphabet('0123456789ABCDEFGHIJKLMNOPQRSTUV'), padding(5), join(''));
chain(radix2(5), alphabet('0123456789ABCDEFGHJKMNPQRSTVWXYZ'), join(''), normalize(s => s.toUpperCase().replace(/O/g, '0').replace(/[IL]/g, '1')));
const base64 = chain(radix2(6), alphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'), padding(6), join(''));
const base64url = chain(radix2(6), alphabet('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_'), padding(6), join(''));
const genBase58 = abc => chain(radix(58), alphabet(abc), join(''));
const base58 = genBase58('123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz');
genBase58('123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ');
genBase58('rpshnaf39wBUDNEGHJKLM4PQRST7VWXYZ2bcdeCg65jkm8oFqi1tuvAxyz');
const XMR_BLOCK_LEN = [0, 2, 3, 5, 6, 7, 9, 10, 11];
const base58xmr = {
  encode(data) {
    let res = '';
    for (let i = 0; i < data.length; i += 8) {
      const block = data.subarray(i, i + 8);
      res += base58.encode(block).padStart(XMR_BLOCK_LEN[block.length], '1');
    }
    return res;
  },
  decode(str) {
    let res = [];
    for (let i = 0; i < str.length; i += 11) {
      const slice = str.slice(i, i + 11);
      const blockLen = XMR_BLOCK_LEN.indexOf(slice.length);
      const block = base58.decode(slice);
      for (let j = 0; j < block.length - blockLen; j++) {
        if (block[j] !== 0) throw new Error('base58xmr: wrong padding');
      }
      res = res.concat(Array.from(block.slice(block.length - blockLen)));
    }
    return Uint8Array.from(res);
  }
};
const BECH_ALPHABET = chain(alphabet('qpzry9x8gf2tvdw0s3jn54khce6mua7l'), join(''));
const POLYMOD_GENERATORS = [0x3b6a57b2, 0x26508e6d, 0x1ea119fa, 0x3d4233dd, 0x2a1462b3];
function bech32Polymod(pre) {
  const b = pre >> 25;
  let chk = (pre & 0x1ffffff) << 5;
  for (let i = 0; i < POLYMOD_GENERATORS.length; i++) {
    if ((b >> i & 1) === 1) chk ^= POLYMOD_GENERATORS[i];
  }
  return chk;
}
function bechChecksum(prefix, words, encodingConst = 1) {
  const len = prefix.length;
  let chk = 1;
  for (let i = 0; i < len; i++) {
    const c = prefix.charCodeAt(i);
    if (c < 33 || c > 126) throw new Error(`Invalid prefix (${prefix})`);
    chk = bech32Polymod(chk) ^ c >> 5;
  }
  chk = bech32Polymod(chk);
  for (let i = 0; i < len; i++) chk = bech32Polymod(chk) ^ prefix.charCodeAt(i) & 0x1f;
  for (let v of words) chk = bech32Polymod(chk) ^ v;
  for (let i = 0; i < 6; i++) chk = bech32Polymod(chk);
  chk ^= encodingConst;
  return BECH_ALPHABET.encode(convertRadix2([chk % 2 ** 30], 30, 5, false));
}
function genBech32(encoding) {
  const ENCODING_CONST = encoding === 'bech32' ? 1 : 0x2bc830a3;
  const _words = radix2(5);
  const fromWords = _words.decode;
  const toWords = _words.encode;
  const fromWordsUnsafe = unsafeWrapper(fromWords);
  function encode(prefix, words, limit = 90) {
    if (typeof prefix !== 'string') throw new Error(`bech32.encode prefix should be string, not ${typeof prefix}`);
    if (!Array.isArray(words) || words.length && typeof words[0] !== 'number') throw new Error(`bech32.encode words should be array of numbers, not ${typeof words}`);
    const actualLength = prefix.length + 7 + words.length;
    if (limit !== false && actualLength > limit) throw new TypeError(`Length ${actualLength} exceeds limit ${limit}`);
    prefix = prefix.toLowerCase();
    return `${prefix}1${BECH_ALPHABET.encode(words)}${bechChecksum(prefix, words, ENCODING_CONST)}`;
  }
  function decode(str, limit = 90) {
    if (typeof str !== 'string') throw new Error(`bech32.decode input should be string, not ${typeof str}`);
    if (str.length < 8 || limit !== false && str.length > limit) throw new TypeError(`Wrong string length: ${str.length} (${str}). Expected (8..${limit})`);
    const lowered = str.toLowerCase();
    if (str !== lowered && str !== str.toUpperCase()) throw new Error(`String must be lowercase or uppercase`);
    str = lowered;
    const sepIndex = str.lastIndexOf('1');
    if (sepIndex === 0 || sepIndex === -1) throw new Error(`Letter "1" must be present between prefix and data only`);
    const prefix = str.slice(0, sepIndex);
    const _words = str.slice(sepIndex + 1);
    if (_words.length < 6) throw new Error('Data must be at least 6 characters long');
    const words = BECH_ALPHABET.decode(_words).slice(0, -6);
    const sum = bechChecksum(prefix, words, ENCODING_CONST);
    if (!_words.endsWith(sum)) throw new Error(`Invalid checksum in ${str}: expected "${sum}"`);
    return {
      prefix,
      words
    };
  }
  const decodeUnsafe = unsafeWrapper(decode);
  function decodeToBytes(str) {
    const {
      prefix,
      words
    } = decode(str, false);
    return {
      prefix,
      words,
      bytes: fromWords(words)
    };
  }
  return {
    encode,
    decode,
    decodeToBytes,
    decodeUnsafe,
    fromWords,
    fromWordsUnsafe,
    toWords
  };
}
genBech32('bech32');
genBech32('bech32m');
const utf8 = {
  encode: data => new TextDecoder().decode(data),
  decode: str => new TextEncoder().encode(str)
};
const hex = chain(radix2(4), alphabet('0123456789abcdef'), join(''), normalize(s => {
  if (typeof s !== 'string' || s.length % 2) throw new TypeError(`hex.decode: expected string, got ${typeof s} with length ${s.length}`);
  return s.toLowerCase();
}));
const CODERS = {
  utf8,
  hex,
  base16,
  base32,
  base64,
  base64url,
  base58,
  base58xmr
};
`Invalid encoding type. Available types: ${Object.keys(CODERS).join(', ')}`;

var CurveType;
(function (CurveType) {
  CurveType[CurveType["ED25519"] = 0] = "ED25519";
  CurveType[CurveType["SECP256K1"] = 1] = "SECP256K1";
})(CurveType || (CurveType = {}));
var DataLength;
(function (DataLength) {
  DataLength[DataLength["ED25519"] = 32] = "ED25519";
  DataLength[DataLength["SECP256K1"] = 64] = "SECP256K1";
})(DataLength || (DataLength = {}));

/**
 * A Promise result in near can be one of:
 * - NotReady = 0 - the promise you are specifying is still not ready, not yet failed nor successful.
 * - Successful = 1 - the promise has been successfully executed and you can retrieve the resulting value.
 * - Failed = 2 - the promise execution has failed.
 */
var PromiseResult;
(function (PromiseResult) {
  PromiseResult[PromiseResult["NotReady"] = 0] = "NotReady";
  PromiseResult[PromiseResult["Successful"] = 1] = "Successful";
  PromiseResult[PromiseResult["Failed"] = 2] = "Failed";
})(PromiseResult || (PromiseResult = {}));
/**
 * A promise error can either be due to the promise failing or not yet being ready.
 */
var PromiseError;
(function (PromiseError) {
  PromiseError[PromiseError["Failed"] = 0] = "Failed";
  PromiseError[PromiseError["NotReady"] = 1] = "NotReady";
})(PromiseError || (PromiseError = {}));

const U64_MAX = 2n ** 64n - 1n;
const EVICTED_REGISTER = U64_MAX - 1n;
/**
 * Logs parameters in the NEAR WASM virtual machine.
 *
 * @param params - Parameters to log.
 */
function log(...params) {
  env.log(params.reduce((accumulated, parameter, index) => {
    // Stringify undefined
    const param = parameter === undefined ? "undefined" : parameter;
    // Convert Objects to strings and convert to string
    const stringified = typeof param === "object" ? JSON.stringify(param) : `${param}`;
    if (index === 0) {
      return stringified;
    }
    return `${accumulated} ${stringified}`;
  }, ""));
}
/**
 * Returns the account ID of the account that called the function.
 * Can only be called in a call or initialize function.
 */
function predecessorAccountId() {
  env.predecessor_account_id(0);
  return str(env.read_register(0));
}
/**
 * Returns the account ID of the current contract - the contract that is being executed.
 */
function currentAccountId() {
  env.current_account_id(0);
  return str(env.read_register(0));
}
/**
 * Returns the amount of NEAR attached to this function call.
 * Can only be called in payable functions.
 */
function attachedDeposit() {
  return env.attached_deposit();
}
/**
 * Reads the value from NEAR storage that is stored under the provided key.
 *
 * @param key - The key to read from storage.
 */
function storageReadRaw(key) {
  const returnValue = env.storage_read(key, 0);
  if (returnValue !== 1n) {
    return null;
  }
  return env.read_register(0);
}

function storageRead(key) {
  const ret = storageReadRaw(encode(key));
  if (ret !== null) {
    return decode(ret);
  }
  return null;
}

function storageHasKeyRaw(key) {
  return env.storage_has_key(key) === 1n;
}

function storageHasKey(key) {
  return storageHasKeyRaw(encode(key));
}

function storageGetEvictedRaw() {
  return env.read_register(EVICTED_REGISTER);
}

function storageWriteRaw(key, value) {
  return env.storage_write(key, value, EVICTED_REGISTER) === 1n;
}

function storageRemoveRaw(key) {
  return env.storage_remove(key, EVICTED_REGISTER) === 1n;
}

function storageRemove(key) {
  return storageRemoveRaw(encode(key));
}

function inputRaw() {
  env.input(0);
  return env.read_register(0);
}

function input() {
  return decode(inputRaw());
}


class LookupMap {
  
  constructor(keyPrefix) {
    this.keyPrefix = keyPrefix;
  }
  
  containsKey(key) {
    const storageKey = this.keyPrefix + key;
    return storageHasKey(storageKey);
  }
  
  get(key, options) {
    const storageKey = this.keyPrefix + key;
    const value = storageReadRaw(encode(storageKey));
    return getValueWithOptions(value, options);
  }
  
  remove(key, options) {
    const storageKey = this.keyPrefix + key;
    if (!storageRemove(storageKey)) {
      return options?.defaultValue ?? null;
    }
    const value = storageGetEvictedRaw();
    return getValueWithOptions(value, options);
  }
 
  set(key, newValue, options) {
    const storageKey = this.keyPrefix + key;
    const storageValue = serializeValueWithOptions(newValue, options);
    if (!storageWriteRaw(encode(storageKey), storageValue)) {
      return options?.defaultValue ?? null;
    }
    const value = storageGetEvictedRaw();
    return getValueWithOptions(value, options);
  }
 
  extend(keyValuePairs, options) {
    for (const [key, value] of keyValuePairs) {
      this.set(key, value, options);
    }
  }
 
  serialize(options) {
    return serializeValueWithOptions(this, options);
  }
 
  static reconstruct(data) {
    return new LookupMap(data.keyPrefix);
  }
}

function indexToKey(prefix, index) {
  const data = new Uint32Array([index]);
  const array = new Uint8Array(data.buffer);
  const key = str(array);
  return prefix + key;
}

class Vector {

  constructor(prefix, length = 0) {
    this.prefix = prefix;
    this.length = length;
  }
  
  isEmpty() {
    return this.length === 0;
  }
  
  get(index, options) {
    if (index >= this.length) {
      return options?.defaultValue ?? null;
    }
    const storageKey = indexToKey(this.prefix, index);
    const value = storageReadRaw(bytes(storageKey));
    return getValueWithOptions(value, options);
  }

  swapRemove(index, options) {
    assert(index < this.length, ERR_INDEX_OUT_OF_BOUNDS);
    if (index + 1 === this.length) {
      return this.pop(options);
    }
    const key = indexToKey(this.prefix, index);
    const last = this.pop(options);
    assert(storageWriteRaw(bytes(key), serializeValueWithOptions(last, options)), ERR_INCONSISTENT_STATE);
    const value = storageGetEvictedRaw();
    return getValueWithOptions(value, options);
  }
 
  push(element, options) {
    const key = indexToKey(this.prefix, this.length);
    this.length += 1;
    storageWriteRaw(bytes(key), serializeValueWithOptions(element, options));
  }
 
  pop(options) {
    if (this.isEmpty()) {
      return options?.defaultValue ?? null;
    }
    const lastIndex = this.length - 1;
    const lastKey = indexToKey(this.prefix, lastIndex);
    this.length -= 1;
    assert(storageRemoveRaw(bytes(lastKey)), ERR_INCONSISTENT_STATE);
    const value = storageGetEvictedRaw();
    return getValueWithOptions(value, options);
  }
  
  replace(index, element, options) {
    assert(index < this.length, ERR_INDEX_OUT_OF_BOUNDS);
    const key = indexToKey(this.prefix, index);
    assert(storageWriteRaw(bytes(key), serializeValueWithOptions(element, options)), ERR_INCONSISTENT_STATE);
    const value = storageGetEvictedRaw();
    return getValueWithOptions(value, options);
  }
 
  extend(elements) {
    for (const element of elements) {
      this.push(element);
    }
  }
  [Symbol.iterator]() {
    return new VectorIterator(this);
  }
  
  createIteratorWithOptions(options) {
    return {
      [Symbol.iterator]: () => new VectorIterator(this, options)
    };
  }
  
  toArray(options) {
    const array = [];
    const iterator = options ? this.createIteratorWithOptions(options) : this;
    for (const value of iterator) {
      array.push(value);
    }
    return array;
  }
 
  clear() {
    for (let index = 0; index < this.length; index++) {
      const key = indexToKey(this.prefix, index);
      storageRemoveRaw(bytes(key));
    }
    this.length = 0;
  }
 
  serialize(options) {
    return serializeValueWithOptions(this, options);
  }
 
  static reconstruct(data) {
    const vector = new Vector(data.prefix, data.length);
    return vector;
  }
}

class VectorIterator {
 
  constructor(vector, options) {
    this.vector = vector;
    this.options = options;
    this.current = 0;
  }
  next() {
    if (this.current >= this.vector.length) {
      return {
        value: null,
        done: true
      };
    }
    const value = this.vector.get(this.current, this.options);
    this.current += 1;
    return {
      value,
      done: false
    };
  }
}


class UnorderedMap {
 
  constructor(prefix) {
    this.prefix = prefix;
    this._keys = new Vector(`${prefix}u`); 
    this.values = new LookupMap(`${prefix}m`);
  }
 
  get length() {
    return this._keys.length;
  }
  
  isEmpty() {
    return this._keys.isEmpty();
  }
 
  get(key, options) {
    const valueAndIndex = this.values.get(key);
    if (valueAndIndex === null) {
      return options?.defaultValue ?? null;
    }
    const [value] = valueAndIndex;
    return getValueWithOptions(encode(value), options);
  }

  set(key, value, options) {
    const valueAndIndex = this.values.get(key);
    const serialized = serializeValueWithOptions(value, options);
    if (valueAndIndex === null) {
      const newElementIndex = this.length;
      this._keys.push(key);
      this.values.set(key, [decode(serialized), newElementIndex]);
      return null;
    }
    const [oldValue, oldIndex] = valueAndIndex;
    this.values.set(key, [decode(serialized), oldIndex]);
    return getValueWithOptions(encode(oldValue), options);
  }
  
  remove(key, options) {
    const oldValueAndIndex = this.values.remove(key);
    if (oldValueAndIndex === null) {
      return options?.defaultValue ?? null;
    }
    const [value, index] = oldValueAndIndex;
    assert(this._keys.swapRemove(index) !== null, ERR_INCONSISTENT_STATE);
   
    if (!this._keys.isEmpty() && index !== this._keys.length) {
      
      const swappedKey = this._keys.get(index);
      const swappedValueAndIndex = this.values.get(swappedKey);
      assert(swappedValueAndIndex !== null, ERR_INCONSISTENT_STATE);
      this.values.set(swappedKey, [swappedValueAndIndex[0], index]);
    }
    return getValueWithOptions(encode(value), options);
  }
  
  clear() {
    for (const key of this._keys) {
     
    }
    this._keys.clear();
  }
  [Symbol.iterator]() {
    return new UnorderedMapIterator(this);
  }
  
  createIteratorWithOptions(options) {
    return {
      [Symbol.iterator]: () => new UnorderedMapIterator(this, options)
    };
  }
 
  toArray(options) {
    const array = [];
    const iterator = options ? this.createIteratorWithOptions(options) : this;
    for (const value of iterator) {
      array.push(value);
    }
    return array;
  }
 
  extend(keyValuePairs) {
    for (const [key, value] of keyValuePairs) {
      this.set(key, value);
    }
  }
 
  serialize(options) {
    return serializeValueWithOptions(this, options);
  }
 
  static reconstruct(data) {
    const map = new UnorderedMap(data.prefix);
   
    map._keys = new Vector(`${data.prefix}u`);
    map._keys.length = data._keys.length;
   
    map.values = new LookupMap(`${data.prefix}m`);
    return map;
  }
  keys({
    start,
    limit
  }) {
    const ret = [];
    if (start === undefined) {
      start = 0;
    }
    if (limit == undefined) {
      limit = this.length - start;
    }
    for (let i = start; i < start + limit; i++) {
      ret.push(this._keys.get(i));
    }
    return ret;
  }
}

class UnorderedMapIterator {
 
  constructor(unorderedMap, options) {
    this.options = options;
    this.keys = new VectorIterator(unorderedMap._keys);
    this.map = unorderedMap.values;
  }
  next() {
    const key = this.keys.next();
    if (key.done) {
      return {
        value: [key.value, null],
        done: key.done
      };
    }
    const valueAndIndex = this.map.get(key.value);
    assert(valueAndIndex !== null, ERR_INCONSISTENT_STATE);
    return {
      done: key.done,
      value: [key.value, getValueWithOptions(encode(valueAndIndex[0]), this.options)]
    };
  }
}

function serializeIndex(index) {
  const data = new Uint32Array([index]);
  const array = new Uint8Array(data.buffer);
  return array;
}
function deserializeIndex(rawIndex) {
  const [data] = new Uint32Array(rawIndex.buffer);
  return data;
}

class UnorderedSet {
  
  constructor(prefix) {
    this.prefix = prefix;
    this.elementIndexPrefix = `${prefix}i`;
    this._elements = new Vector(`${prefix}e`);
  }
 
  get length() {
    return this._elements.length;
  }
  
  isEmpty() {
    return this._elements.isEmpty();
  }
  
  contains(element, options) {
    const indexLookup = this.elementIndexPrefix + serializeValueWithOptions(element, options);
    return storageHasKey(indexLookup);
  }

  set(element, options) {
    const indexLookup = this.elementIndexPrefix + serializeValueWithOptions(element, options);
    if (storageRead(indexLookup)) {
      return false;
    }
    const nextIndex = this.length;
    const nextIndexRaw = serializeIndex(nextIndex);
    storageWriteRaw(encode(indexLookup), nextIndexRaw);
    this._elements.push(element, options);
    return true;
  }
  
  remove(element, options) {
    const indexLookup = this.elementIndexPrefix + serializeValueWithOptions(element, options);
    const indexRaw = storageReadRaw(encode(indexLookup));
    if (!indexRaw) {
      return false;
    }
    
    if (this.length === 1) {
      storageRemove(indexLookup);
      const index = deserializeIndex(indexRaw);
      this._elements.swapRemove(index);
      return true;
    }
   
    const lastElement = this._elements.get(this.length - 1, options);
    assert(!!lastElement, ERR_INCONSISTENT_STATE);
    storageRemove(indexLookup);
    
    if (lastElement !== element) {
      const lastLookupElement = this.elementIndexPrefix + serializeValueWithOptions(lastElement, options);
      storageWriteRaw(encode(lastLookupElement), indexRaw);
    }
    const index = deserializeIndex(indexRaw);
    this._elements.swapRemove(index);
    return true;
  }
  
  clear(options) {
    for (const element of this._elements) {
      const indexLookup = this.elementIndexPrefix + serializeValueWithOptions(element, options);
      storageRemove(indexLookup);
    }
    this._elements.clear();
  }
  [Symbol.iterator]() {
    return this._elements[Symbol.iterator]();
  }
  
  createIteratorWithOptions(options) {
    return {
      [Symbol.iterator]: () => new VectorIterator(this._elements, options)
    };
  }
 
  toArray(options) {
    const array = [];
    const iterator = options ? this.createIteratorWithOptions(options) : this;
    for (const value of iterator) {
      array.push(value);
    }
    return array;
  }
  
  extend(elements) {
    for (const element of elements) {
      this.set(element);
    }
  }
  
  serialize(options) {
    return serializeValueWithOptions(this, options);
  }
  
  static reconstruct(data) {
    const set = new UnorderedSet(data.prefix);
   
    const elementsPrefix = data.prefix + "e";
    set._elements = new Vector(elementsPrefix);
    set._elements.length = data._elements.length;
    return set;
  }
  elements({
    options,
    start,
    limit
  }) {
    const ret = [];
    if (start === undefined) {
      start = 0;
    }
    if (limit == undefined) {
      limit = this.length - start;
    }
    for (let i = start; i < start + limit; i++) {
      ret.push(this._elements.get(i, options));
    }
    return ret;
  }
}


function view(_empty) {
  
  return function (_target, _key, _descriptor
  
  ) {};
}
function call({
  privateFunction = false,
  payableFunction = false
}) {
 
  return function (_target, _key, descriptor) {
    const originalMethod = descriptor.value;
   
    descriptor.value = function (...args) {
      if (privateFunction && predecessorAccountId() !== currentAccountId()) {
        throw new Error("Function is private");
      }
      if (!payableFunction && attachedDeposit() > 0n) {
        throw new Error("Function is not payable");
      }
      return originalMethod.apply(this, args);
    };
  };
}
function NearBindgen({
  requireInit = false,
  serializer = serialize,
  deserializer = deserialize
}) {
 
  return target => {
    return class extends target {
      static _create() {
        return new target();
      }
      static _getState() {
        const rawState = storageReadRaw(bytes("STATE"));
        return rawState ? this._deserialize(rawState) : null;
      }
      static _saveToStorage(objectToSave) {
        storageWriteRaw(bytes("STATE"), this._serialize(objectToSave));
      }
      static _getArgs() {
        return JSON.parse(input() || "{}");
      }
      static _serialize(value, forReturn = false) {
        if (forReturn) {
          return encode(JSON.stringify(value, (_, value) => typeof value === "bigint" ? `${value}` : value));
        }
        return serializer(value);
      }
      static _deserialize(value) {
        return deserializer(value);
      }
      static _reconstruct(classObject, plainObject) {
        for (const item in classObject) {
          const reconstructor = classObject[item].constructor?.reconstruct;
          classObject[item] = reconstructor ? reconstructor(plainObject[item]) : plainObject[item];
        }
        return classObject;
      }
      static _requireInit() {
        return requireInit;
      }
    };
  };
}

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _class, _class2;
let VotingContract = (_dec = NearBindgen({}), _dec2 = view(), _dec3 = view(), _dec4 = view(), _dec5 = view(), _dec6 = view(), _dec7 = view(), _dec8 = call({}), _dec9 = call({}), _dec10 = call({}), _dec11 = call({}), _dec12 = call({}), _dec13 = call({}), _dec(_class = (_class2 = class VotingContract {

  candidatePair = new UnorderedMap("candidate_pair");
  
  promptSet = new UnorderedSet("promptArray");
  voteArray = new UnorderedMap("voteArray");
  userParticipation = new UnorderedMap("user Participation ");

 

  getUrl({
    prompt,
    name
  }) {
    log(prompt);
    let candidateUrlArray = this.candidatePair.get(prompt);
    return candidateUrlArray[candidateUrlArray.indexOf(name) + 1];
  }
  didParticipate({
    prompt,
    user
  }) {
    let promptUserList = this.userParticipation.get(prompt, {
      defaultValue: []
    });
    log(promptUserList);
    return promptUserList.includes(user);
  }
  participateArray({
    prompt
  }) {
    return this.userParticipation.get(prompt);
  }
  getAllPrompts() {
    return this.promptSet.toArray();
  }
  getVotes({
    prompt
  }) {
    return this.voteArray.get(prompt, {
      defaultValue: []
    });
  }
  getCandidatePair({
    prompt
  }) {
    let candidateUrlArray = this.candidatePair.get(prompt, {
      defaultValue: ["n/a,n/a"]
    });
    return [candidateUrlArray[0], candidateUrlArray[2]];
  }
  addCandidatePair({
    prompt,
    name1,
    name2,
    url1,
    url2
  }) {
    this.candidatePair.set(prompt, [name1, url1, name2, url2]);
  }
  initializeVotes({
    prompt
  }) {
    this.voteArray.set(prompt, [0, 0]);
  }
  addToPromptArray({
    prompt
  }) {
    this.promptSet.set(prompt);
  }
  clearPromptArray() {
    this.promptSet.clear();
    this.candidatePair.clear();
    this.userParticipation.clear();
    this.voteArray.clear();
    log("clearing polls");
  }
  addVote({
    prompt,
    index
  }) {
    let currentVotes = this.voteArray.get(prompt, {
      defaultValue: [0, 0]
    });
    currentVotes[index] = currentVotes[index] + 1;
    this.voteArray.set(prompt, currentVotes);
  }
  recordUser({
    prompt,
    user
  }) {
    let currentArray = this.userParticipation.get(prompt, {
      defaultValue: []
    });
    currentArray.includes(user) ? null : currentArray.push(user);
    this.userParticipation.set(prompt, currentArray);
  }
}, (_applyDecoratedDescriptor(_class2.prototype, "getUrl", [_dec2], Object.getOwnPropertyDescriptor(_class2.prototype, "getUrl"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "didParticipate", [_dec3], Object.getOwnPropertyDescriptor(_class2.prototype, "didParticipate"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "participateArray", [_dec4], Object.getOwnPropertyDescriptor(_class2.prototype, "participateArray"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getAllPrompts", [_dec5], Object.getOwnPropertyDescriptor(_class2.prototype, "getAllPrompts"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getVotes", [_dec6], Object.getOwnPropertyDescriptor(_class2.prototype, "getVotes"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "getCandidatePair", [_dec7], Object.getOwnPropertyDescriptor(_class2.prototype, "getCandidatePair"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "addCandidatePair", [_dec8], Object.getOwnPropertyDescriptor(_class2.prototype, "addCandidatePair"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "initializeVotes", [_dec9], Object.getOwnPropertyDescriptor(_class2.prototype, "initializeVotes"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "addToPromptArray", [_dec10], Object.getOwnPropertyDescriptor(_class2.prototype, "addToPromptArray"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "clearPromptArray", [_dec11], Object.getOwnPropertyDescriptor(_class2.prototype, "clearPromptArray"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "addVote", [_dec12], Object.getOwnPropertyDescriptor(_class2.prototype, "addVote"), _class2.prototype), _applyDecoratedDescriptor(_class2.prototype, "recordUser", [_dec13], Object.getOwnPropertyDescriptor(_class2.prototype, "recordUser"), _class2.prototype)), _class2)) || _class);
function recordUser() {
  const _state = VotingContract._getState();
  if (!_state && VotingContract._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = VotingContract._create();
  if (_state) {
    VotingContract._reconstruct(_contract, _state);
  }
  const _args = VotingContract._getArgs();
  const _result = _contract.recordUser(_args);
  VotingContract._saveToStorage(_contract);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(VotingContract._serialize(_result, true));
}
function addVote() {
  const _state = VotingContract._getState();
  if (!_state && VotingContract._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = VotingContract._create();
  if (_state) {
    VotingContract._reconstruct(_contract, _state);
  }
  const _args = VotingContract._getArgs();
  const _result = _contract.addVote(_args);
  VotingContract._saveToStorage(_contract);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(VotingContract._serialize(_result, true));
}
function clearPromptArray() {
  const _state = VotingContract._getState();
  if (!_state && VotingContract._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = VotingContract._create();
  if (_state) {
    VotingContract._reconstruct(_contract, _state);
  }
  const _args = VotingContract._getArgs();
  const _result = _contract.clearPromptArray(_args);
  VotingContract._saveToStorage(_contract);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(VotingContract._serialize(_result, true));
}
function addToPromptArray() {
  const _state = VotingContract._getState();
  if (!_state && VotingContract._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = VotingContract._create();
  if (_state) {
    VotingContract._reconstruct(_contract, _state);
  }
  const _args = VotingContract._getArgs();
  const _result = _contract.addToPromptArray(_args);
  VotingContract._saveToStorage(_contract);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(VotingContract._serialize(_result, true));
}
function initializeVotes() {
  const _state = VotingContract._getState();
  if (!_state && VotingContract._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = VotingContract._create();
  if (_state) {
    VotingContract._reconstruct(_contract, _state);
  }
  const _args = VotingContract._getArgs();
  const _result = _contract.initializeVotes(_args);
  VotingContract._saveToStorage(_contract);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(VotingContract._serialize(_result, true));
}
function addCandidatePair() {
  const _state = VotingContract._getState();
  if (!_state && VotingContract._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = VotingContract._create();
  if (_state) {
    VotingContract._reconstruct(_contract, _state);
  }
  const _args = VotingContract._getArgs();
  const _result = _contract.addCandidatePair(_args);
  VotingContract._saveToStorage(_contract);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(VotingContract._serialize(_result, true));
}
function getCandidatePair() {
  const _state = VotingContract._getState();
  if (!_state && VotingContract._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = VotingContract._create();
  if (_state) {
    VotingContract._reconstruct(_contract, _state);
  }
  const _args = VotingContract._getArgs();
  const _result = _contract.getCandidatePair(_args);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(VotingContract._serialize(_result, true));
}
function getVotes() {
  const _state = VotingContract._getState();
  if (!_state && VotingContract._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = VotingContract._create();
  if (_state) {
    VotingContract._reconstruct(_contract, _state);
  }
  const _args = VotingContract._getArgs();
  const _result = _contract.getVotes(_args);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(VotingContract._serialize(_result, true));
}
function getAllPrompts() {
  const _state = VotingContract._getState();
  if (!_state && VotingContract._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = VotingContract._create();
  if (_state) {
    VotingContract._reconstruct(_contract, _state);
  }
  const _args = VotingContract._getArgs();
  const _result = _contract.getAllPrompts(_args);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(VotingContract._serialize(_result, true));
}
function participateArray() {
  const _state = VotingContract._getState();
  if (!_state && VotingContract._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = VotingContract._create();
  if (_state) {
    VotingContract._reconstruct(_contract, _state);
  }
  const _args = VotingContract._getArgs();
  const _result = _contract.participateArray(_args);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(VotingContract._serialize(_result, true));
}
function didParticipate() {
  const _state = VotingContract._getState();
  if (!_state && VotingContract._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = VotingContract._create();
  if (_state) {
    VotingContract._reconstruct(_contract, _state);
  }
  const _args = VotingContract._getArgs();
  const _result = _contract.didParticipate(_args);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(VotingContract._serialize(_result, true));
}
function getUrl() {
  const _state = VotingContract._getState();
  if (!_state && VotingContract._requireInit()) {
    throw new Error("Contract must be initialized");
  }
  const _contract = VotingContract._create();
  if (_state) {
    VotingContract._reconstruct(_contract, _state);
  }
  const _args = VotingContract._getArgs();
  const _result = _contract.getUrl(_args);
  if (_result !== undefined) if (_result && _result.constructor && _result.constructor.name === "NearPromise") _result.onReturn();else env.value_return(VotingContract._serialize(_result, true));
}

export { addCandidatePair, addToPromptArray, addVote, clearPromptArray, didParticipate, getAllPrompts, getCandidatePair, getUrl, getVotes, initializeVotes, participateArray, recordUser };
