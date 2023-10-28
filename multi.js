class Animal {
    constructor() {
        Object.assign(this, new Shark())
        Object.assign(this, new Clock())
    }
}

class Shark {
    // only what's in constructor will be on the object, hence the weird this.bite = this.bite
    constructor() {
        this.color = "black";
        this.bite = this.bite;
    }
    bite() { console.log("bite"); }
    eat() { console.log('eat'); }
}

class Clock {
    constructor() { this.tick = this.tick; }
    tick() { console.log("tick"); }
}

let animal = new Animal();
animal.bite();
console.log(animal.color);
animal.tick();

function Classes(bases) {
    class Bases {
        constructor() {
            bases.forEach(base => Object.assign(this, new base()));
        }
    }

    bases.forEach(base => {
        Object.getOwnPropertyNames(base.prototype)
            .filter(prop => prop != 'constructor')
            .forEach(prop => Bases.prototype[prop] = base.prototype[prop]);
    })
    return Bases;
}

class Nose {
    constructor() {
        this.booger = 'ready';
    }

    pick() {
        console.log('pick your nose');
    }
}

class Ear {
    constructor() {
        this.wax = 'ready';
    }

    dig() {
        console.log('dig in your ear')
    }
}

// class Butt { // left as an exercise to the reader}

class Gross extends Classes([Nose, Ear]) {
    constructor() {
        super();
        this.gross = true;
    }
}



// test it

var grossMan = new Gross()
console.log(`booger is ${grossMan.booger}`);
console.log(`was is ${grossMan.wax}`);
grossMan.pick(); // eww!
grossMan.dig(); //yuck!


// const x = new Set([2, 659, 98, 0, 19, 38, 1]);
// console.log(x);
// const y = x.size;
// const z = [...x];

// for (let i = 0; i < y; i++) {
//     console.log(z[i]);
// }

class BackTrack {
    getPermutations(arr, permutationSize) {
        const permutations = [];

        function backtrack(currentPerm) {
            if (currentPerm.length === permutationSize) {
                permutations.push(currentPerm.slice());

                return;
            }

            arr.forEach((item) => {
                if (currentPerm.includes(item)) return;
                currentPerm.push(item);
                backtrack(currentPerm);
                currentPerm.pop();
            });
        }

        backtrack([]);

        return permutations;
    }

    getCombinations(arr, combinationSize) {
        const combinations = [];

        function backtrack(startIndex, currentCombination) {
            if (currentCombination.length === combinationSize) {
                combinations.push(currentCombination.slice());
                return;
            }

            for (let i = startIndex; i < arr.length; i++) {
                currentCombination.push(arr[i]);
                backtrack(i + 1, currentCombination);
                currentCombination.pop();
            }
        }

        backtrack(0, []);

        return combinations;
    }
}

let bac = new BackTrack()

console.log(bac.getCombinations([0, 1, 2, 3], 3))

var x = new Uint8Array(12)

x.fill(10)

x = x.map((value, index, array) => {
    const mod4 = index % 4;
    if (mod4 < 3) { return value = 0 } else return value = 255;
});

var arr = [2, 42];

class ar {
    constructor(arrr) {
        this.arra = arrr;
        this.len = arrr.length;
    }
    one(num) {
        console.log("one")
        for (let i = 0; i < this.len; i++) this.arra[i] = this.arra[i] * num;
        return this
    }

    two(num) {
        console.log("twobvc3")
        for (let i = 0; i < this.len; i++) this.arra[i] = this.arra[i] + num;
        return this
    }
}

let a = new ar([3, 5, 2]);

console.log(a.one(4).two(3))