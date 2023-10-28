//It is recomeended to use backtracking to avoid unneccesary computations especially when generating the permutations of large input sets

class noBactrack {
    getPermutations(arr, permutationSize) {
        if (permutationSize === 1) {
            return arr.map(item => [item]);
        }

        const permutations = [];

        arr.forEach((item, index) => {
            const rest = arr.slice(0, index).concat(arr.slice(index + 1));

            const innerPermutations = this.getPermutations(rest, permutationSize - 1);

            const currentElementPermutations = innerPermutations.map(p => [item, ...p]);

            permutations.push(...currentElementPermutations);
        });

        return permutations
    }


    getCombinations(arr, combinationSize) {
        if (combinationSize === 1) {
            return arr.map(item => [item]);
        }

        if (combinationSize === arr.length) {
            return [arr]
        }

        const combinations = [];

        arr.forEach((item, index) => {
            const rest = arr.slice(index + 1);

            const innerCombinations = this.getCombinations(rest, combinationSize - 1);

            const currentElementCombinations = innerCombinations.map(c => [item, ...c])

            combinations.push(...currentElementCombinations);
        });

        return combinations
    }
}

class backTrack {
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

        return permutations
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
                currentCombination.pop()
            }
        }

        backtrack(0, []);

        return combinations
    }
}

const nbac = new noBactrack()
const bac = new backTrack()




// console.log(nbac.getCombinations([0, 1, 2, 3], 3))
// console.log(bac.getCombinations([0, 1, 2, 3], 3))

// console.log(nbac.getPermutations([0, 1, 2, 3], 3))
// console.log(bac.getPermutations([0, 1, 2, 3], 3))


// const p = [
//     [0, 0],
//     [4, 0],
//     [2, 3],
//     [1, 2]
// ]

// console.log(p.reduce((acc, [x, y]) => acc.concat(x, y), []))

// class Sample {
//     constructor() {
//         this._p = 3
//     }
// }

// let x = new Sample

// console.log(x._p)

arr = bac.getCombinations([0, 1, 2, 3, 4], 3).slice(1)
console.log(arr)

function trim(arr, trimParam) {
    var retArr = []
    for (let j of arr) {
        var found = false
        for (let m of j) {
            if (m === trimParam) {
                found = true
            }
        }
        if (found === true) {
            retArr.push(j)
        }
    }
    return retArr
}

var pre = bac.getCombinations([0, 1, 2, 3], 3)

console.log(pre)
console.log(trim(pre, 3))

function finalTrim(arr) {
    var retArr = []
    for (let j of arr) {
        var found = true
        for (let m of j) {
            if (m === 0 || m === 1 || m === 2) {
                found = false
            }
        }
        if (found === true) {
            retArr.push([j[0] - 3, j[1] - 3, j[2] - 3])
        }
    }
    return retArr
}