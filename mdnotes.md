## Higher order functions

Higher order functions are functions that operate on other funcions,
either because they take them as argment or return them as a value.

For instance we could write a function to replicate (sort of) the `unless`
operator that you have in ruby. 

```
function unless(condition, action) {
	if(!condition) action();
}
```

Then we can call this function with passing another function as the
second parameter

```
unless(1 === 1, () => console.log("the condition is false"));
// undefined
```

```
unless(1 === 0, () => console.log("the condition is false"));
// the condition is false
```

###### Rewriting the filter function

Using higher order functions we can rewrite the filter function

```
function filter(array, condition) {
	let filtered = [];
	for(let element of array) {
		if(condition(element)) {
			filtered.push(element);
		}
	}
	return filtered;
}

let numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

let even = filter(numbers, (n) => n % 2 == 0);
console.log(even);
// [2, 4, 6, 8, 10]
```


###### Rewriting the map function

```
function map(array, transform) {
	let mapped = [];
	for(let element of array) {
		mapped.push(transform(element));
	}
	return mapped;
}

let fruit = ['apple', 'banana', 'cherry'];

let upcaseFruit = map(fruit, (str) => str.toUpperCase());
console.log(upcaseFruit);
// ['APPLE', 'BANANA', 'CHERRY']
```

###### Rewriting the reduce function

Reduce is a function that allows you to compute all the elements
of an array into a single value given the array, a combine operation
(for instance, sum or multiply) and a start value

```
function reduce(array, combine, start) {
	let current = start;
	for(let element of array) {
		current = combine(current, element); 
	}
	return current;
}

console.log(reduce([1, 3, 5, 9], (a, b) => a + b, 0));
// 18
```

The built-in `reduce` method works the same way but, if the array
has at least one element, you can leave out the start argument:

```
console.log([1, 3, 5, 9].reduce((a, b) => a + b));
// 18
```

###### Rewriting the `flatten` method

```
function flatten(array) {
	return array.reduce((a, b) => a.concat(b));
}

console.log(flatten([[1, 3], [5, 9], [3, 1], [9, 5]]));
// [1, 3, 5, 9, 3, 1, 9, 5]
```

###### Writing my own loop

```
function loop(value, condition, update, action) {
	do {
		action(value);
		value = update(value);
	} while(condition(value));
}

loop(3, n => n > 0, n => n - 1, console.log);
// → 3
// → 2
// → 1
```


#### Object oriented javascript

###### Encapsulation

One of the main ideas of object oriented programming is to
divide the program into smaller pieces. Different pieces can 
be grouped into interfaces, sets of functions that provide
the functionality at a more abstract level.

These pieces of functionality can generally be public or
private. In JavaScript there is no such distinction yet
but usually developers put an underscore `_` at the start
of property names to indicate that those properties are
private.


###### Methods

A method is a property of an object that holds a function
as a value:

```
let cat = {};
cat.purr = function() {
	console.log('purr purr purr');
};

cat.purr();
// 'purr purr purr'
```

Inside an object method body, the binding `this` automatically
points to the object that the method was called on:

```
function sayName() {
	console.log(`my name is ${this.name}`);
};

let cat = { name: 'Rocco' , sayName };

cat.sayName();
// my name is Rocco
```

`this` is an extra parameter that is passed implicitly. You can pass
it explicitly by using `call` on the method:

```
let otherCat = { name: 'Tom' };
sayName.call(otherCat);
// my name is Tom
```

###### Prototypes

In addition to their set of properties, most objects also have a `prototype`.
When you call an object with a property it does not have, the prototype will
be searched for that property and then the prototype's prototype and so on.

`Object.getPrototypeOf` returns the prototype of any object. For instance,

```
let empty = {};
console.log(Object.getPrototypeOf(empty) === Object.prototype);
// true
```

`Object.prototype` is the 'root' of the prototype hierarchy and does not
have a prototype of its own.

```
Object.getPrototypeOf(Object.prototype);
// null
```

Many objects do not have `Object.prototype` as a prototype directly: for
example, functions are based on `Function.prototype` and arrays on
`Array.prototype`. These prototypes will then derive from `Object.prototype`
which will still provide some basic properties, such as `toString`.

We can use `Object.create` to create an object from a specific prototype.

```
let protoCat = {
	speak() {
		console.log(`I am a cat and I '${this.call}'`);
	}
}

let purringCat = Object.create(protoCat);
purringCat.call = 'PURR';
purringCat.speak();
// I am a cat and I 'PURR'
```

###### Classes

Prototypes can be seen as something similar to the concept of `Classes` in
other languages where the `Class` is the blueprint that defines what methods
and properties every `instance` of that class should have.

As we have seen, prototypes are useful to store properties that are shared
between all instances of the same class but we will also have to make sure
that all instances have the properties they need (in our case a `call`).
Previously in Javascript, we would have to use a `constructor` method.

```
function makeCat(call) {
	let cat = Object.create(protoCat);
	cat.call = call;
	return cat;
}
```

You can also write this in an easier way: if you put the keyword `new` in front
of a function call, the function is treated as a constructor. A constructor
is a just a function and, by convention, the name is capitalised so that it can
be distringuished easily from other functions.

```
function Cat(call) {
	this.call = call;
}

Cat.prototype.speak = function() {
	console.log(`I am a cat and I '${this.call}'`);
}

let purringCat = new Cat('PURR');

console.log(Object.getPrototypeOf(purringCat) === Cat.prototype)
// true
```
Automatically, every function has a `prototype`


###### Class Notation

Since 2015, we can use class notation which is more similar to other languages
that use object oriented programming.

```
class Cat {
	constructor(call) {
		this.call = call;
	}
	
	speak() {
		console.log(`I am a cat and I '${this.call}'`);
	}
}

let purringCat = new Cat('PURR');
console.log(Object.getPrototypeOf(purringCat) === Cat.prototype)
// true
```
Just like in the OOP languages, you can override a property in a derived object.


###### Maps

If we want to represent a data structure of key value pairs, we could use a plain
object, such as:

```
let pokemonPowers = {
	'Pikachu': 'Electricity',
	'Charmander': 'Fire'
}

console.log(`Pikachu's power is ${pokemonPowers['Pikachu']} based`);
// Pikachu's power is Electricity based
console.log("Do we know Charmander's power?", 'Charmander' in pokemonPowers);
// Do we know Charmander's power? true
console.log("Do we know toString's power?", 'toString' in pokemonPowers);
// Do we know toString's power? true
```

You can see how using a plain object can become dangerous.

So we can use the `Map` class that was created exactly for this purpose.

```
let pokemonPowers = new Map();
pokemonPowers.set('Pikachu', 'Electricity');
pokemonPowers.set('Charmander', 'Fire');

console.log(`Pikachu's power is ${pokemonPowers.get('Pikachu')} based`);
// Pikachu's power is Electricity based
console.log("Do we know Bulbasaur's power?", pokemonPowers.has('Bulbasaur'));
// Do we know Bulbasaur's power? false
```

###### Symbols 

Property names are usually strings but tehy can also be _symbols_. Symbols can
be created with the `Symbol` function. Symbols are a new type of primitive
introduced in ECMAScript 6.  

Another good thing about symbols is that they are unique - you cannot create the
same symbol twice - which means that they can be used as unique properties for
objects or as constants.

###### The Iterator interface

Any object that you give to a `for`/`of` loop is expected to be `iterable`. That
means that these objects have a method named with the `Symbol.iterator` symbol.

This method returns the interface `iterator`, which in turns has a method `next`,
which returns an object with two properties `value` (holding the actual value of
the next element) and `done` (boolean that is true when there are no more elements
to loop through).


###### Strict mode

Strict mode - enabled by `"use strict";` at the top of a file - lets you:
	- get an error message when you inadvertently create a global variable (forget to
	use `let` when defining a variable)
	- the `this` binding will hold the value `undefined` in functions that are not called
	as methods (instead of the global scope object)


###### Modules and CommonJS

CommonJS is the most used approach to deal with modules in Javascript, it is used in Node.js.

The main concept on CommonJS is a function called `require`. When you call `require` passing
the name of the module as a parameter, this module is loaded and wrapped in a function (so
moduels get their scope automatically). For the methods from the eternal module to be available,
they need to be put in an `exports`.

Here is a very minimal and simplified definition of `require`:

```
require.cache = Object.create(null);

function require(name) {
	if(!(name in require.cache)) {
		let code = readFile(name);
		let module = {exports: {}};
		require.cache[name] = module;
		let wrapper = Function("require, exports, module", code);
		wrapper(require, module.exports, module);
	}
	return require.cache[name].exports;
}
```

notes:
`readFile` is just a made up function that returns the content of the file in a string format.
`require` keeps a cache of modules that has already loaded.
The wrapper function makes sure that `require`, `exports` and `module` are available when you
require the module in another file.
The `name` is interpreted as relative to the current file location when it starts with `./` or
`../`. Otherwise, Node.js will look for an NPM package with the same name.


###### ECMASCript or ES modules

From 2015, Javascript introduced its own way of importing modules. You are still dealing with
interfaces that provide bits of functionality but the syntax and other details are different.
You use an `import` function to access dipendencies:

```
import ordinal from "ordinal";
import {days, months} from "date-names";
```

They also use the `exports` keyword with the same meaning.

An ES module's interface is not a single value but a set of named bindings. When there is a default
binding, that's what you get unless you add braces around the binding name. You can rename a
binding using the `as` keyword.

Also, ES module imports happen before a module's script starts running so import declarations
may not be made inside functions or blocks.
These are still in the adoption phase and many projects still use CommonJS.
