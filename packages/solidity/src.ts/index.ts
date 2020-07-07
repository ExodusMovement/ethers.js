"use strict";

import { BigNumber } from "@ethersproject/bignumber";
import { arrayify, concat, hexlify, zeroPad } from "@ethersproject/bytes";
import { keccak256 as hashKeccak256 } from "@ethersproject/keccak256";
import { sha256 as hashSha256 } from "@ethersproject/sha2";

const regexBytes = new RegExp("^bytes([0-9]+)$");
const regexNumber = new RegExp("^(u?int)([0-9]*)$");
const regexArray = new RegExp("^(.*)\\[([0-9]*)\\]$");

const Zeros = "0000000000000000000000000000000000000000000000000000000000000000";

enum UnicodeNormalizationForm {
    current  = "",
    NFC      = "NFC",
    NFD      = "NFD",
    NFKC     = "NFKC",
    NFKD     = "NFKD"
};

function toUtf8Bytes(str: string, form: any = UnicodeNormalizationForm.current): Uint8Array {

    if (form != UnicodeNormalizationForm.current) {
        throw new Error('Normalization is not supported')
    }

    let result = [];
    for (let i = 0; i < str.length; i++) {
        const c = str.charCodeAt(i);

        if (c < 0x80) {
            result.push(c);

        } else if (c < 0x800) {
            result.push((c >> 6) | 0xc0);
            result.push((c & 0x3f) | 0x80);

        } else if ((c & 0xfc00) == 0xd800) {
            i++;
            const c2 = str.charCodeAt(i);

            if (i >= str.length || (c2 & 0xfc00) !== 0xdc00) {
                throw new Error("invalid utf-8 string");
            }

            // Surrogate Pair
            const pair = 0x10000 + ((c & 0x03ff) << 10) + (c2 & 0x03ff);
            result.push((pair >> 18) | 0xf0);
            result.push(((pair >> 12) & 0x3f) | 0x80);
            result.push(((pair >> 6) & 0x3f) | 0x80);
            result.push((pair & 0x3f) | 0x80);

        } else {
            result.push((c >> 12) | 0xe0);
            result.push(((c >> 6) & 0x3f) | 0x80);
            result.push((c & 0x3f) | 0x80);
        }
    }

    return arrayify(result);
};

function _pack(type: string, value: any, isArray?: boolean): Uint8Array {
    switch(type) {
        case "address":
            if (isArray) { return zeroPad(value, 32); }
            return arrayify(value);
        case "string":
            return toUtf8Bytes(value);
        case "bytes":
            return arrayify(value);
        case "bool":
            value = (value ? "0x01": "0x00");
            if (isArray) { return zeroPad(value, 32); }
            return arrayify(value);
    }

    let match =  type.match(regexNumber);
    if (match) {
        //let signed = (match[1] === "int")
        let size = parseInt(match[2] || "256")
        if ((size % 8 != 0) || size === 0 || size > 256) {
            throw new Error("invalid number type - " + type);
        }

        if (isArray) { size = 256; }

        value = BigNumber.from(value).toTwos(size);

        return zeroPad(value, size / 8);
    }

    match = type.match(regexBytes);
    if (match) {
        const size = parseInt(match[1]);
        if (String(size) != match[1] || size === 0 || size > 32) {
            throw new Error("invalid number type - " + type);
        }
        if (arrayify(value).byteLength !== size) { throw new Error("invalid value for " + type); }
        if (isArray) { return arrayify((value + Zeros).substring(0, 66)); }
        return value;
    }

    match = type.match(regexArray);
    if (match && Array.isArray(value)) {
        const baseType = match[1];
        const count = parseInt(match[2] || String(value.length));
        if (count != value.length) { throw new Error("invalid value for " + type); }
        const result: Array<Uint8Array> = [];
        value.forEach(function(value) {
            result.push(_pack(baseType, value, true));
        });
        return concat(result);
    }

    throw new Error("unknown type - " + type);
}

// @TODO: Array Enum

export function pack(types: Array<string>, values: Array<any>) {
    if (types.length != values.length) { throw new Error("type/value count mismatch"); }
    const tight: Array<Uint8Array> = [];
    types.forEach(function(type, index) {
        tight.push(_pack(type, values[index]));
    });
    return hexlify(concat(tight));
}

export function keccak256(types: Array<string>, values: Array<any>) {
    return hashKeccak256(pack(types, values));
}

export function sha256(types: Array<string>, values: Array<any>) {
    return hashSha256(pack(types, values));
}
