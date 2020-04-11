#! /usr/bin/env node
const axios = require('axios');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: 'enter command > '
});

// prompt the user to enter a command, this command will be one of the commands in our switch statement
readline.prompt();

// to fetch the user input in prompt
readline.on('line', async (line) => {
    switch (line.trim()) {
        case 'list vegan foods': {
            // ------------------ GENERATOR STARTS --------------------
            // converting custom iterator to generator
            const { data } = await axios.get('http://localhost:3001/food');
            function* listVeganFoods() {
                let idx = 0;
                // filter all the foods which include "vegan" in their dietary preference
                // and the resulting array will be used to iterate over by the custom iterator
                const veganOnly = data.filter(foodItem => {
                    return foodItem.dietary_preferances.includes("vegan");
                });

                // run the loop till the time there are items in the veganOnly array
                while (veganOnly[idx]) {
                    yield veganOnly[idx]; // pause here and give out the food item
                    idx++; // increment the index
                }
            }

            // iterate through the custom iterable
            for (let value of listVeganFoods()) {
                console.log(value.name);
            }

            // when it is finished iterating, return to prompt
            readline.prompt();
            // ------------------ GENERATOR ENDS --------------------


            // ------------------ CUSTOM ITERATOR STARTS --------------------
            // fetch all the foods from the api
            // axios.get('http://localhost:3001/food').then(({ data }) => {

            //     // veganIterable is a working custom iterator
            //     let idx = 0;

            //     // filter all the foods which include "vegan" in their dietary preference
            //     // and the resulting array will be used to iterate over by the custom iterator
            //     const veganOnly = data.filter(foodItem => {
            //         return foodItem.dietary_preferances.includes("vegan");
            //     });

            //     const veganIterable = {

            //         // creating the veganIterable an iterable - should return an iterable itself
            //         [Symbol.iterator]() {
            //             return {
            //                 [Symbol.iterator]() { return this; },
            //                 next() {
            //                     const current = veganOnly[idx];
            //                     // increment idx on each next() call
            //                     idx++;

            //                     if (current) {
            //                         return { value: current, done: false }
            //                     } else {
            //                         return { value: current, done: true }
            //                     }
            //                 }
            //             }
            //         }
            //     }


            //     // iterate through the custom iterable
            //     for (let value of veganIterable) {
            //         console.log(value.name);
            //     }

            //     // when it is finished iterating, return to prompt
            //     readline.prompt();
            // })
            // ------------------ CUSTOM ITERATOR ENDS --------------------
        }
            break;
        case 'log':
            {
                const { data } = await axios.get(`http://localhost:3001/food`);
                const objectIterator = data[Symbol.iterator]();
                let actionIt;

                // --------------------- GENERATOR FUNCTION -----------------------
                function* actionGenerator() {
                    const food = yield;
                    const servingSize = yield askForServingSize();
                    yield displayCalories(servingSize, food);
                }
                // --------------------- GENERATOR FUNCTION -----------------------

                // --------------------- CUSTOM ITERATOR WITH return() and throw() -------------------------
                // custom iterator - actionIterator
                // const actionIterator = {
                //     [Symbol.iterator]() {
                //         let positions = [...this.actions];
                //         return {
                //             [Symbol.iterator]() { return this; },
                //             next(...args) {
                //                 // some of the next call can have arguments as well, therefore ->> ...args


                //                 // check if there are still functions to call
                //                 // on every next call, we'll take out 1 function out of the positions array and execute it
                //                 // we take it out so that with the next call, we dont accidently call the same function
                //                 if (positions.length > 0) {
                //                     const position = positions.shift(); // will take the 1st element (function) and return it

                //                     // position is the function to be called
                //                     // now the function can be accepting arguments
                //                     const result = position(...args);

                //                     return { value: result, done: false };
                //                 } else {
                //                     // when there are no more actions to execute
                //                     return { done: true };
                //                 }
                //             },
                //             return() {
                //                 positions = [];
                //                 return { done: true };
                //             },
                //             throw(error) {
                //                 console.log(error);
                //                 return { value: undefined, done: true };
                //             }
                //         }
                //     },
                //     actions: [askForServingSize, displayCalories]
                // };
                // --------------------- CUSTOM ITERATOR WITH return() and throw() -------------------------



                // we will get the "food" when we create the 
                function askForServingSize(food) {
                    readline.question('How many servings did you eat? (as a decimal: 1, 0.5, 1.25 etc...) ->>> ', (servingSizeByUser) => {

                        // giving optional methods to our custom iterator
                        // return() will break the iteration and will not go the next question
                        if (servingSizeByUser === 'nevermind' || servingSizeByUser === 'n') {
                            actionIt.return();
                        } else {
                            actionIt.next(servingSizeByUser);
                        }

                    })
                }

                // the amount of calories associated with the chosen food and the serving size as input by the user
                async function displayCalories(servingSize, food) {
                    const calories = food.calories;
                    console.log(`${food.name} with a serving size of ${servingSize} has a ${Number.parseFloat(calories * parseFloat(servingSize, 10)).toFixed()} calories`);

                    // log to the db
                    const { data } = await axios.get('http://localhost:3001/users/1');
                    const usersLog = data.log || [];
                    const putBody = {
                        ...data,
                        log: [
                            ...usersLog,
                            {
                                [Date.now()]: {
                                    food: food.name,
                                    servingSize,
                                    calories: Number.parseFloat(calories * parseFloat(servingSize, 10))
                                }
                            }
                        ]
                    }

                    // PUT request to DB to store the entry in db.json
                    await axios.put('http://localhost:3001/users/1', putBody, { headers: { 'Content-Type': 'application/json' } });

                    // as this is the last function in the series of function/actions that the actionIterable will be iterating through
                    // calling next() will set done:true as there will be no more actions to perform
                    actionIt.next();
                    readline.prompt();
                }



                // item will be the user's input
                // the 2nd arg to readline.question is the callback which takes the user's input
                readline.question(`What do you like to log today? `, async (item) => {
                    let position = objectIterator.next();

                    while (!position.done) {
                        const food = position.value.name;
                        if (food === item) {
                            // if user has entered the same item as in our db, show calories
                            console.log(`${item} has ${position.value.calories} calories`);

                            // --------------- INITIALIZE THE CUSTOM ITERATOR --------------------
                            // initialize the action iterator
                            // actionIt = actionIterator[Symbol.iterator]();

                            // passing the entire food item object
                            // this is the food object which we need in our actions
                            // the two actions (functions) will be called on this food item
                            // actionIt.next(position.value);
                            // --------------- INITIALIZE THE CUSTOM ITERATOR --------------------


                            // --------------- INITIALIZE THE GENERATOR --------------------
                            actionIt = actionGenerator();
                            actionIt.next(); // starts the generator
                            actionIt.next(position.value); // gives food item object to the 1st yield
                            // --------------- INITIALIZE THE GENERATOR --------------------
                        }
                        position = objectIterator.next();
                    }
                    // return to the readline once done with the question
                    readline.prompt();
                })
            }
            break;
    }
})

