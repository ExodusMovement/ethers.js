-----

Documentation: [html](https://docs-beta.ethers.io/)

-----


BigNumber
=========


Explain about BigNumber here...


### Importing



```
/////
// CommonJS:

// From the Umbrella ethers package...
const { BigNumber } = require("ethers");

// From the bignumber pacakge...
const { BigNumber } = require("@ethersproject/bignumber");


/////
// ES6 and TypeScript:

// From the Umbrella ethers package...
import { BigNumber } from "ethers";

// From the bignumber pacakge...
import { BigNumber } from "@ethersproject/bignumber";
```



Types
-----



### BigNumberish


Many functions and methods in this library take in values which
can be non-ambiguously and safely converted to a BigNumber. These
values can be sepcified as:


#### ***string***

A [hexstring](../bytes) or a decimal string, either of which may
be negative.




#### ***BytesLike***

A [BytesLike](../bytes) Object, such as an Array or Uint8Array.




#### ***BigNumber***

An existing BigNumber instance.




#### ***number***

A number that is within the safe range for JavaScript numbers.




#### ***BigInt***

A JavaScript [BigInt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt)
object, on environments that support BigInt.




Creating Instances
------------------


The constructor of BigNumber cannot be called directly. Instead, Use the static `BigNumber.from`.


#### *BigNumber* . **from** ( aBigNumberish )  **=>** *[BigNumber](./)*

Returns an instance of a **BigNumber** for *aBigNumberish*.




### Examples:



```javascript
// From a decimal string...
BigNumber.from("42")
// { BigNumber: "42" }

// From a hexstring...
BigNumber.from("0x2a")
// { BigNumber: "42" }

// From a negative hexstring...
BigNumber.from("-0x2a")
// { BigNumber: "-42" }

// From an Array (or Uint8Array)...
BigNumber.from([ 42 ])
// { BigNumber: "42" }

// From an existing BigNumber...
let one1 = constants.One;
let one2 = BigNumber.from(one1)

one2
// { BigNumber: "1" }

// ...which returns the same instance
one1 === one2
// true

// From a (safe) number...
BigNumber.from(42)
// { BigNumber: "42" }

// From a ES2015 BigInt... (only on platforms with BigInt support)
BigNumber.from(42n)
// { BigNumber: "42" }

// Numbers outside the safe range fail:
BigNumber.from(Number.MAX_SAFE_INTEGER);
// Error: overflow (fault="overflow", operation="BigNumber.from", value=9007199254740991, version=bignumber/5.0.0-beta.129)
```



Methods
-------


The BigNumber class is immutable, so no operations can change the value
it represents.


### Math Operations



#### *bignumber* . **add** ( otherValue )  **=>** *[BigNumber](./)*

Returns a BigNumber with the value of *bignumber* **+** *otherValue*.




#### *bignumber* . **sub** ( otherValue )  **=>** *[BigNumber](./)*

Returns a BigNumber with the value of *bignumber* **&ndash;** *otherValue*.




#### *bignumber* . **mul** ( otherValue )  **=>** *[BigNumber](./)*

Returns a BigNumber with the value of *bignumber* **&times;** *otherValue*.




#### *bignumber* . **div** ( divisor )  **=>** *[BigNumber](./)*

Returns a BigNumber with the value of *bignumber* **&#247;** *divisor*.




#### *bignumber* . **mod** ( divisor )  **=>** *[BigNumber](./)*

Returns a BigNumber with the value of the **remainder** of *bignumber* &#247; *divisor*.




#### *bignumber* . **pow** ( exponent )  **=>** *[BigNumber](./)*

Returns a BigNumber with the value of *bignumber* to the power of *exponent*.




#### *bignumber* . **abs** (  )  **=>** *[BigNumber](./)*

Returns a BigNumber with the absolute value of *bignumber*.




#### *bignumber* . **maskn** ( bitcount )  **=>** *[BigNumber](./)*

Returns a BigNumber with the value of *bignumber* with bits beyond
the *bitcount* least significant bits set to zero.




### Two's Compliment


[Two's Complicment](https://en.wikipedia.org/wiki/Two%27s_complement)
is a method used to encode and decode fixed-width values which can be
positive or negative, without requiring a separate sign bit. Most users
will not need to interact with these.


#### *bignumber* . **fromTwos** ( bitwidth )  **=>** *[BigNumber](./)*

Returns a BigNumber with the value of *bignumber* converted from twos-compliment with *bitwidth*.




#### *bignumber* . **toTwos** ( bitwidth )  **=>** *[BigNumber](./)*

Returns a BigNumber with the value of *bignumber* converted to twos-compliment with *bitwidth*.




### Comparison and Equivalence



#### *bignumber* . **eq** ( otherValue )  **=>** *boolean*

Returns true if and only if the value of *bignumber* is equal to *otherValue*.




#### *bignumber* . **lt** ( otherValue )  **=>** *boolean*

Returns true if and only if the value of *bignumber* **<** *otherValue*.




#### *bignumber* . **lte** ( otherValue )  **=>** *boolean*

Returns true if and only if the value of *bignumber* **&le;** *otherValue*.




#### *bignumber* . **gt** ( otherValue )  **=>** *boolean*

Returns true if and only if the value of *bignumber* **>** *otherValue*.




#### *bignumber* . **gte** ( otherValue )  **=>** *boolean*

Returns true if and only if the value of *bignumber* **&ge;** *otherValue*.




#### *bignumber* . **isZero** (  )  **=>** *boolean*

Returns true if and only if the value of *bignumber* is zero.




### Conversion



#### *bignumber* . **toNumber** (  )  **=>** *number*

Returns the value of *bignumber* as a JavaScript value.

This will **throw an error**
if the value is greater than or equal to *Number.MAX_SAFE_INTEGER* or less than or
equal to *Number.MIN_SAFE_INTEGER*.




#### *bignumber* . **toString** (  )  **=>** *string*

Returns the value of *bignumber* as a base-10 string.




#### *bignumber* . **toHexString** (  )  **=>** *string*

Returns the value of *bignumber* as a base-16, `0x`-prefixed [hexstring](../bytes).




### Inspection



#### *BigNumnber* . **isBigNumber** ( object )  **=>** *boolean*

Returns true if and only if the *object* is a BigNumber object.




### Examples



```javascript
let a = BigNumber.from(42);
let b = BigNumber.from("91");

  a.mul(b);
  // { BigNumber: "3822" }
```



Notes
-----


A few short notes on numbers...


### Why can't I just use numbers?


The first problem many encounter when dealing with Ethereum is
the concept of numbers. Most common currencies are broken down
with very little granularity. For example, there are only 100
cents in a single dollar. However, there are 10^18 **wei** in a
single **ether**.

JavaScript uses [IEEE 754 double-precision binary floating point](https://en.wikipedia.org/wiki/Double-precision_floating-point_format)
numbers to represent numeric values. As a result, there are *holes*
in the integer set after 9,007,199,254,740,991; which is
problematic for *Ethereum* because that is only around 0.009
ether (in wei), which means any value over that will begin to
experience rounding errors.

To demonstrate how this may be an issue in your code, consider:


```javascript
(Number.MAX_SAFE_INTEGER + 2 - 2) == (Number.MAX_SAFE_INTEGER)
// false
```


To remedy this, all numbers (which can be large) are stored
and manipulated as [Big Numbers](./).

The functions [parseEther( etherString )](http://linkto) and
[formatEther( wei )](http://linkto) can be used to convert
between string representations, which are displayed to or entered
by the user and Big Number representations which can have
mathematical operations handled safely.



-----
**Content Hash:** 269c8464ff80c77316617cbfa4e9a195d742f829a23911fecf0bba16961f81ae