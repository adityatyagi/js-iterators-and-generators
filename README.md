# CONSOLE-LOG-MY-FOOD

A test app developed while pursuing a course from PluralSight on JavaScript Generators and Iterators.  

1. The app runs from command line.  
2. Prompt the user what they ate?  
3. Show how many calories are in that food.  
4. Saves the log to the fake database.  
5. Logs the food items eaten today by a particular user, along with the total calorie count.  
6. Show a message to the user if their calorie amount/intake goes above a certain value.  



Using Node's [Readline module](https://nodejs.org/api/readline.html#readline_readline) for IO operations.  

To create fake DB, we use [json-server](https://www.npmjs.com/package/json-server). It is important to install json-server globally with `npm i -g json-server`.  

To run db - `npm run launch-db`  

To make API calls, we are using [axios](https://www.npmjs.com/package/axios). Axios is a Promise based HTTP Client that we'll use to make API calls to our fake DB (JSON SERVER).  






# NOTES ON JS ITERATORS & GENERATORS  

`#! /usr/bin/env node` ---> This is a indication to the computer that the file has to run with node. This has to be the 1st line on the file.

`chmod +x ./index.js` ---> To make file an executable. Run the following command from a bash.  

# ITERATORS

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

The `return()` and `throw()` methods which are optional on Iterators, are already there on the Generator Functions.  

IMPORTANT: Number of `next()` calls is not equal to number of `yield` statements. To run the first `yield`, we need 2 `next()` calls. The first one to start the generator and the second one for the yield.  

Therefore, there will be always 1 extra `next` call to start the generator.  

## YIELD DELEGATION
Yield delegation allows a host generator function to control the iteration of a different generator function.  

[CodePen for Yield delegation](https://codepen.io/adityatyagi/pen/gOabJmb?editors=0012);  

## HANDLING EXCEPTIONS/ERRORS IN GENERATOR FUNCTIONS & EARLY COMPLETION

Generator functions include `return()` and `throw()`.  

We use `return()` or `throw()` to abort the iterator before it would have normally completed.  

`iterator.return()`: ends a generator functon's execution. For example, you have reached a pause point in the generator function which gives you a value and tells you not to continue to remaining pause points.  

`iterator.throw()`: will end a generator function's execution while also throwing an exception that can be handled by the generator. This is useful when you are using the iterator provided by the generator in a separate context.  


Once a error is thrown by an Generator function iterator, using the `throw()`, the Generator function completes and if `next()` is called on the iterator again, other `yield` (if present) are not called and the Generator function returns `done:true`.  

We can also throw an error from inside the `try` block, apart from throwing it from the `catch` block and outside using an iterator.  

[CodePen for Error Handling](https://codepen.io/pen/?editors=0012)  

# CANCELABLE ASYNC FLOWS (CAF)  

It is a library created by Kyle Simpson for making it easier to work with Async actions in Generator Functions by making them feel and look like normal async functions. 

[CAF](https://github.com/getify/CAF)  : Makes Generator Functions work like async functions.  

One of the biggest problems with async functions is not being able to externally cancel the async request. Like we can do it with the Generator Functions using iterator.return() or iterator.next() to control the function. This type of external control doesn't exist for async functions.  

CAF works by wrapping a Generator Function in a CAF function - `CAF(<Generator_Function(signal)>)`;  
This will return a promise when called.  

Whatever value you return in the Generator Function, is the value the Promise will resolve with.  

These functions can be cancelled by using the CAF Cancel Token: `const token = new CAF.cancelToken()`.  
A cancel token has a signal object available which you must supply to the Generator function as its first argument.  
That signal listens for an external ABORT call. When this ABORT is called, it will cancel the generator function.  

![image](https://user-images.githubusercontent.com/18363595/79056283-3c6b4380-7c72-11ea-9aba-65a406fc1d97.png)  

## TOKEN CANCELLATION

`CAF.delay()`: A promisified setTimeout() that can be cancelled.  

`CAF.timeout()`: Abort a token after a specified time.  

Used to cancel a promise if it is taking too long to resolve.  

**How to use?**  
Instead of `const token = CAF.cancelToken()`, use `const token = CAF.timeout(300, 'This is taking too long')`  

Inside the CAF function, `yield CAF.delay(signal, 400);`



