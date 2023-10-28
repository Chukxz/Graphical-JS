// const person = {
//     name: 'Rabi Siddique',
//     age: 25,
//     city: "Gujranwala"
// };

// const ent = Object.entries(person)

// const frment = Object.fromEntries(ent)

// console.log(ent)

// console.log(frment)

// const [keya, valuea] = ent[0]

// console.log(keya)
// console.log(valuea)


// for (const [key, value] of ent) {
//     console.log(`${key}:${value}`);
// }

const A = [2, 3, 9, 51, 73, 2]

const Ap = [
    [2, 3],
    [9, 51],
    [73, 2]
]


const B = [0, 28, 83, 57, 19, 96, 45, 76]

const Bp = [
    [0, 28, 83, 57],
    [19, 96, 45, 76],
]


const C = [0, 28, 83, 57, 19, 96, 45, 76, 56, 97, 25, 97, 25, 98, 27, 42]

const Cp = [
    [0, 28, 83, 57],
    [19, 96, 45, 76],
    [56, 97, 25, 97],
    [25, 98, 27, 42]
]


function createArrayFromList(param) {
    var arr = new Array(param[0] || 0),
        i = param[0];

    if (param.length > 1) {
        var args = Array.prototype.slice.call(param, 1);
        while (i--) {
            arr[param[0] - 1 - i] = createArrayFromArgs.apply(this, args);
        }
    }
    return arr;
}

function createArrayFromArgs(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while (i--) {
            arr[length - 1 - i] = createArrayFromArgs.apply(this, args);
        }
    }
    return arr;
}

function matMult(matA, matB, shapeA, shapeB) {
    const matC = [];

    for (let i = 0; i < shapeA[0]; i++) {
        for (let j = 0; j < shapeB[1]; j++) {
            var sum = 0;
            for (let k = 0; k < shapeB[0]; k++) {
                sum += matA[(i * shapeA[1]) + k] * matB[(k * shapeB[1]) + j];
            }
            matC.push(sum);
        }
    }
    return matC;
}


function scaMult(scalarVal, matIn, leaveLast = false) {
    const matInlen = matIn.length;
    const matOut = [];
    for (let i = 0; i < matInlen; i++) {
        if (i === matInlen - 1 && leaveLast === true) {
            // Do nothing...don't multiply the last matrix value by the scalar value
            // useful when perspective divide is going on.
        } else {
            matOut.push(matIn[i] * scalarVal);
        }
    }
    return matOut;
}

function addSub(matA, matB) {
    const matC = [];
    const matAlen = matA.length;
    const matBlen = matB.length;
    if (matAlen === matBlen) {
        for (let i = 0; i < matAlen; i++) {
            matC.push(matA[i] + matB[i]);
        }
    }
    return matC;
}

function traposeMat(matIn, shapeMat) {
    const shpA = shapeMat[0];
    const shpB = shapeMat[1];
    const matOut = [];

    for (let i = 0; i < shpB; i++) {
        for (let j = 0; j < shpA; j++) {
            matOut.push(matIn[(j * shpB) + i]);
        }
    }

    return matOut;
}

function identityMat(val) {
    const num = val ** 2;
    const matOut = [];

    for (let i = 0; i < num; i++) {
        if (i % val === 0) {
            matOut.push(1);
        } else matOut.push(0);
    }

    return matOut;
}

// function getRes(matIn, shape, a, b) {
//     //Checks if it is a matrix
//     var resMat = createArrayFromArgs(shape - 1, shape - 1)
//     if (a < shape && b < shape) {
//         for (let i in matIn) {
//             for (let j in matIn) {
//                 if (Number(i) !== a && Number(j) !== b) {
//                     var x = i,
//                         y = j;

//                     if (i > a) {
//                         x = i - 1;
//                     }

//                     if (j > b) {
//                         y = j - 1;
//                     }
//                     resMat[x][y] = matIn[i][j];
//                 }
//             }
//         }
//         return resMat;
//     } else return [];
// }




function getRest(matIn, shape, a, b) {
    const matOut = [];

    for (let i = 0; i < shape; i++) {
        for (let j = 0; j < shape; j++) {
            if (i !== a && j !== b) {
                matOut.push(matIn[(i * shape) + j]);
            }
        }
    }

    return matOut;
}

function getCofSgn(shapeMat) {

    const shpA = shapeMat[0];
    const shpB = shapeMat[1];
    const matOut = [];


    for (let i = 0; i < shpA; i++) {
        for (let j = 0; j < shpB; j++) {
            if ((i + j) % 2 === 0) {
                matOut.push(1);
            } else matOut.push(-1);
        }
    }

    return matOut;
}

function getDet(matIn, shape) {
    if (shape >= 0) {
        const matOut = [];

        // If it is a 1x1 matrix, return the matrix
        if (shape === 1) {
            return matIn;
        }
        // If it is a 2x2 matrix, return the determinant
        if (shape === 2) {
            return ((matIn[0] * matIn[3]) - (matIn[1] * matIn[2]));
        }
        // If it an nxn matrix, where n > 2, recursively compute the determinant,
        //using the first row of the matrix
        else {
            var res = 0;
            const tmp = [];

            for (let i = 0; i < shape; i++) {
                tmp.push(matIn[i]);
            }

            const cofMatSgn = getCofSgn([1, shape]);

            var a = 0;
            const cofLen = cofMatSgn.length

            for (let i = 0; i < cofLen; i++) {
                var ret = getRest(matIn, shape, a, i);

                res += (cofMatSgn[i] * tmp[i] * getDet(ret, shape - 1));
            }

            return res;
        }
    }
}

function getMinor(matIn, shape) {
    const matOut = [];

    for (let i = 0; i < shape; i++) {
        for (let j = 0; j < shape; j++) {
            matOut.push(getDet(getRest(matIn, shape, i, j), shape - 1))
        }
    }

    return matOut;
}


function getCof(matIn, shape) {
    const cofMatSgn = getCofSgn([shape, shape]);
    const minorMat = getMinor(matIn, shape);
    const matOut = [];
    const len = shape ** 2;


    for (let i = 0; i < len; i++) {
        matOut.push(cofMatSgn[i] * minorMat[i]);
    }

    return matOut;
}


class TransfMat {
    constructor() {
        this.mode = "deg";
    }
    runmode(angle) {
        if (this.mode === "deg") {
            return (Math.PI / 180) * angle;
        } else if (this.mode === "rad") {
            return angle;
        } else if (this.mode === 'grad') {
            return (Math.PI / 200) * angle;
        }
    }

    rotMat2d(angle) {
        angle = this.runmode(angle);
        return [
            [Math.cos(angle), -Math.sin(angle), 0],
            [Math.sin(angle), Math.cos(angle, 0), 0]
        ];
    }

    // Pitch
    rotX(ang) {
        const angle = this.runmode(ang);
        return [1, 0, 0, 0, 0, Math.cos(angle), -Math.sin(angle) * this.handedness, 0, 0, Math.sin(angle) * this.handedness, Math.cos(angle), 0, 0, 0, 0, 1];
    }

    // Yaw
    rotY(ang) {
        const angle = this.runmode(ang)
        return [Math.cos(angle), 0, Math.sin(angle) * this.handedness, 0, 0, 1, 0, 0, -Math.sin(angle) * this.handedness, 0, Math.cos(angle), 0, 0, 0, 0, 1];
    }

    //Roll
    rotZ(ang) {
        const angle = this.runmode(ang)
        return [Math.cos(angle), -Math.sin(angle) * this.handedness, 0, 0, Math.sin(angle) * this.handedness, Math.cos(angle), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    }

    rt3d(x, y, z) {
        return this.matMult(this.rotZ(z), this.matMult(this.rotY(y), this.rotX(x), [4, 4], [4, 4]), [4, 4], [4, 4]);
    };

    trl3d(x, y, z) {
        return [1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1];
    }

    scl3dim(x, y, z) {
        return [x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1];
    }

    matMult(matA, matB, shapeA, shapeB) {
        const matC = [];

        for (let i = 0; i < shapeA[0]; i++) {
            for (let j = 0; j < shapeB[1]; j++) {
                var sum = 0;
                for (let k = 0; k < shapeB[0]; k++) {
                    sum += matA[(i * shapeA[1]) + k] * matB[(k * shapeB[1]) + j];
                }
                matC.push(sum);
            }
        }
        return matC;
    }
}

const tra = new TransfMat();

console.log(C)
const start = Date.now();
const val = 4;
// const num = (5) + ((3 * 3 * 2) + (3 * 3 * 1)) * 1e5;
const num = 1e6;
for (let i = 0; i < num; i++) {
    tra.matMult(C, tra.matMult(tra.trl3d(10, 3, 32), tra.matMult(tra.rt3d(34, 9, 23), tra.scl3dim(3, 3, 2), [4, 4], [4, 4]), [4, 4], [4, 4]), [4, 4], [4, 4]);
}
const end = Date.now();
const res = tra.matMult(C, tra.matMult(tra.trl3d(10, 3, 32), tra.matMult(tra.rt3d(34, 9, 23), tra.scl3dim(3, 3, 2), [4, 4], [4, 4]), [4, 4], [4, 4]), [4, 4], [4, 4])
const final = Date.now();
console.log(res);
const last = Date.now();

console.log(`Time taken to run loop of ${num} element(s): ${(end-start)/1000}second(s)`);
console.log(`Time taken to run: ${(final-end)/1000}second(s)`);
console.log(`Time taken to print: ${(last-final)/1000}second(s)`);