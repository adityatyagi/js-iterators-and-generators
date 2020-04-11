# CONSOLE-LOG-MY-FOOD

A test app developed while pursuing a course from PluralSight on JavaScript Generators and Iterators.  

1. The app runs from command line.  
2. Prompt the user what they ate?  
3. Show how many calories are in that food.  

Using Node's [Readline module](https://nodejs.org/api/readline.html#readline_readline) for IO operations.  

To create fake DB, we use [json-server](https://www.npmjs.com/package/json-server). It is important to install json-server globally with `npm i -g json-server`.  

To run db - `npm run launch-db`  

To make API calls, we are using [axios](https://www.npmjs.com/package/axios). Axios is a Promise based HTTP Client that we'll use to make API calls to our fake DB (JSON SERVER).  






# NOTES ON JS ITERATORS & GENERATORS  

`#! /usr/bin/env node` ---> This is a indication to the computer that the file has to run with node. This has to be the 1st line on the file.

`chmod +x ./index.js` ---> To make file an executable. Run the following command from a bash.  

**What is an iterable?**  
1. For a object to be an iterable, it has to implement the `@@iterator` method. Means, the object must have a property with `Symbol.iterator ` key
2. There are many built-in iterators like Arrays, Strings, Maps, Sets  
3. Symbol.iterator is a Well-Known Symbol in JS.  
4. for...of loop works only with iterable objects. It loops over the values of the iterable object.  
5. for...in loop is different than for...of loop. The for...in loop loops over the enumerable properties of an object. For example, it will iterate over the keys of any object.  

```javascript
var arr = [1,2,3,4];

// As array is an iterable, it will have Symbol.iterator() method
var it = arr[Symbol.iterator]();
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next());
console.log(it.next()); // done will be true here
```

Same will be the case for `Maps`  

```javascript
var map = new Map();
map.set('key1', 'value1');
map.set('key2', 'value2');

var mapIterator = map[Symbol.iterator]();
console.log(mapIterator.next());
console.log(mapIterator.next());
console.log(mapIterator.next()); // done will be false here
```

The for...of loop uses the `key` and `value` variables from the Symbol.iterator() method.  

`console.log(mapIterator.next().value);` is being used in:

```javascript
for(const [key, value] of map){
  console.log(`${key} has the value of ${value}`);
}
```  

We can run the same example with other Iterable objects like Sets.  

## CUSTOM ITERATORS

Custom iterators can be used when you want to filter data and iterate over only the filter data in future. We use the `Symbol.iterator()` method to create a custom iterator with next() and returning an object with `value` and `done`.  

The `next()` methods will always return and follow the Iterator Result Interface -> `{value: any, done: boolean}`;

The `done` key will have the value of `false` till the time there are objects to iterate. Once we iterate over all the objects, our custom iterator will return `done = false`;

## ITERATING OVER FUNCTIONS

We can iterate over function and pause in-between too.

## return() and throw() - OPTIONAL METHODS
These are the optional methods that are available on the Iterator Interface.  
The official docs have:  
1. next(): required  
2. return(): optional  
3. throw(): optional  

next() will have `done` and `value`. And value = undefined if value is absent.  

Most of the built-in iterators do not have `return()` or `throw()`. Arrays, Maps, Strings, Sets - nobody have these optional methods.  
We can though add these to CUSTOM ITERATORS. 

Both of these optional methods are used to exit the iteration process.  

Using the `throw()` method, you can throw an Error, but it is not required. But if you not throw an Exception, you do need to return an Iterable result object, with `done:true`.  

# GENERATORS

Functions that produces an iterator is called a GENERATOR.  

**Generator Function**  
A function that can be paused and resumed at a later time, while having the ability to pass values to and from the function at each pause point. Generator functions can run to completion but they dont have to.  

Normal function in JS run to their completions. Generator Functions are different. They can keep running throught the app. This is different than infinite loop.  

```javascript
// Generator function syntax
function* gen() {...}

function * gen(){...}

function *gen(){...}

const obj = {
  *gen(params){...}
}
```

A generator function must have a `*` before the function name. The position of the `*` doesnt matter.  

Note: Executing the generator function alone does not execute the containing code. Its like watching a TV which is turned off. Calling the function just means that you have been given the remote control for the TV. You've been given the control. Executing the generator function returns an iterator or the controller (TV Controller).  

```javascript
function *timeStampGenerator(){
  console.log(Date.now());
}

timeStampGenerator(); // will not log timestamp
```

To run it, call `.next()` just like you'll press the power button on the TV controller.  

```javascript
function *timeStampGenerator(){
  console.log(Date.now());
}

const iterator = timeStampGenerator();
iterator.next(); // will log timestamp
```
## PAUSE THE FUNCTION - YIELD KEYWORD
The `yield` keyword signals the pause point of a generator function. It tells the generator function to stop and wait. Nothing will execute until the `next()` call happens.  

Possible YIELD actions:  
1. Send the value to the iterator  
2. Receive the value from the iterator  

Yiled Expression Placement:  
```javascript

var y = yield 3;

const arr = [yield 1, yield 2, yield 3];

if(yield 4 === 8){...}
```

The best article on [ES6 Generators](https://davidwalsh.name/es6-generators)  

[My CodePen](https://codepen.io/adityatyagi/pen/zYvxmee?editors=0012)  

[Infinitely running function](https://codepen.io/adityatyagi/pen/NWGPeNm?editors=0012)

