const arr = new Uint16Array(3e9);


function apply1(ar) {
    for (i = 0; i < 3e9; i++) {
        ar[i] = Math.random() * 1000;
    }
}

function apply2(ar) {
    for (i = 0; i < 1e3; i++) {
        ar[(i * 3)] = Math.random() * 1000;
        ar[(i * 3) + 1] = Math.random() * 1000;
        ar[(i * 3) + 2] = Math.random() * 1000;
    }
}

function applies(ar) {
    for (j = 0; j < 1e3; j++) {
        for (i = 0; i < 1e3; i++) {
            const mult = (j * 1e3 * 3) + (i * 3);
            ar[mult] = i;
            ar[mult + 1] = j;
        }
    }
}

function time(func, desc) {
    const prev = Date.now();
    func(arr);
    const now = Date.now();
    console.log(`Time taken to ${desc} is ${(now-prev)/1000} seconds.`)
}

function isInsideCirc(point, circle) {
    const x = Math.abs(point[0] - circle[0]);
    const y = Math.abs(point[1] - circle[1]);
    const r = circle[2]

    if ((x ** 2 + y ** 2) <= r ** 2) {
        return true;
    } else return false
}

function test(ar) {
    const confirmed = [];
    for (j = 0; j < 1e3; j++) {
        for (i = 0; i < 1e3; i++) {
            const mult = (j * 1e3 * 3) + (i * 3);
            if (isInsideCirc([100, 100], [ar[mult], arr[mult + 1], 3])) {
                confirmed.push(...[mult, mult + 1]);
            }
        }
    }
    console.log(confirmed);
}

// console.log(arr)
// time(applies, "run apply2 on the array")
// console.log(arr)
// time(test, "run test")

class Quartenion {
    constructor() {
        this.X = [1, 0, 0];
        this.Y = [0, 1, 0];
        this.Z = [0, 0, 1];
        this.q_vector = [0, 0, 0]; // 3d vector
        this.q_quartenion = [0, 0, 0, 0]; // 4d quartenion
        this.q_inv_quartenion = [0, 0, 0, 0]; // 4d inverse quartenion
        this.normalize = true;
        this.translate = true;
        this.theta = 0;
        this.angle_unit = "deg";
    }

    angleUnit(angle) { // for sin, sinh, cos, cosh, tan and tanh
        var _angle = 0;

        if (this.angle_unit === "deg") _angle = (Math.PI / 180) * angle;
        else if (this.angle_unit === "rad") _angle = angle;
        else if (this.angle_unit === 'grad') _angle = (Math.PI / 200) * angle;

        return _angle;
    }

    revAngleUnit(angle) { // for sin, sinh, cos, cosh, tan and tanh
        var _angle = 0;

        if (this.angle_unit === "deg") _angle = (180 / Math.PI) * angle;
        else if (this.angle_unit === "rad") _angle = angle;
        else if (this.angle_unit === 'grad') _angle = (200 / Math.PI) * angle;

        return _angle;
    }


    vector(v1, v2, v3) { // recommeded if vector is not a unit vector i.e non-normalized
        // normalize flag to normalize vector (create a unit vector)
        if (this.normalize === false) this.q_vector = [v1, v2, v3];
        else {
            const inv_mag = Math.pow(v1 ** 2 + v2 ** 2 + v3, -0.5);
            this.q_vector = [v1 * inv_mag, v2 * inv_mag, v3 * inv_mag];
        }
    }

    quartenion() {
        // quartenion
        const [v1, v2, v3] = this.q_vector;
        const [a, b] = [Math.cos(this.theta * 0.5), Math.sin(this.theta * 0.5)];
        this.q_quartenion = [a, v1 * b, v2 * b, v3 * b];
    };

    inv_quartenion() {
        // inverse quartenion
        const [v1, v2, v3] = this.q_vector;
        const [a, b] = [Math.cos(this.theta * 0.5), Math.sin(this.theta * 0.5)];
        this.q_inv_quartenion = [a, -v1 * b, -v2 * b, -v3 * b];
    };

    q_mult(w1, x1, y1, z1, w2, x2, y2, z2) {
        // quartenion _ quartenion multiplication
        return [(w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2), (w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2), (w1 * y2 + y1 * w2 + z1 * x2 - x1 * z2), (w1 * z2 + z1 * w2 + x1 * y2 - y1 * x2)];
    }

    q_v_invq_mult(x, y, z, sx, sy, sz, tx, ty, tz) {
        // quartenion _ vector _ inverse quartenion multiplication for point and vector rotation
        // with additional translating (for points) and scaling (for point and vectors) capabilities
        var [rx, ry, rz] = this.q_mult(...this.q_quartenion, ...this.q_mult(0, sx * x, sy * y, sz * z, ...this.q_inv_quartenion)).splice(1);
        if (this.translate === false) return [rx, ry, rz];
        else return [rx + tx, ry + ty, rz + tz];
    }

    q_rot(_angle = 0, _vector = [0, 0, 1], _point = [0, 0, 0], _scale = [1, 1, 1], _translate = [0, 0, 0]) { // default values
        const [x, y, z] = _point;
        const [sx, sy, sz] = _scale;
        const [tx, ty, tz] = _translate;
        this.theta = this.angleUnit(_angle);
        this.vector(..._vector);
        this.quartenion();
        this.inv_quartenion();
        return this.q_v_invq_mult(x, y, z, sx, sy, sz, tx, ty, tz);
    }
}


// qt.angle(90);
// qt.vector(...[0, 1, 0], false);
// qt.quartenion();
// qt.inv_quartenion();

// const p = [0, 1, 0];

// console.log(p)


// console.log(qt.q_v_invq_mult(...qt.q_quartenion, ...p, ...qt.q_inv_quartenion))
// console.log(qt.q_v_invq_mult(...qt.q_inv_quartenion, ...p, ...qt.q_quartenion))


// console.log(qt.status());

// C/C++ Code for Quake III Fast Inverse Square Root Approximation Algorithm 
// float Fast_InvSqrt(float number)
// {
//   long i;
//   float x2,y;
//   const float threehalfs = 1.5f;

//   x2 = number * 0.5f;
//   y = number;
//   i = *(long*)&y;
//   i = 0x5f3759df - (i >> 1);
//   y = *(float*)&i;
//   y = y * (threehalfs - ( x2 * y * y ));
//   //y = y * (threehalfs - ( x2 * y * y ));

//   return y;
// }



// float Standard_InvSqrt3(float number)
// {
//   float squareRoot = sqrt(number);
//   return 1.0f/squareRoot;
// }

// const num = new Float32Array([1.2]);
// n = num[0];
// console.log(n)
// const n = 1e6;
// console.log(n)
// const pre = Date.now();
// const a = [100, 0, 0, 4, 1, 1, 3, 3, 5];
// for (let i = 0; i < n; i++) {
//     qt.q_v_invq_mult(...a);
// }
// const nows = Date.now();
// console.log(`Time taken is ${(nows-pre)/1000} seconds`);

function update_Vec_Pos(vec_or_pos, tx, ty, tz) {
    var [i, j, k] = vec_or_pos;
    const [x, y, z] = [i + tx, j + ty, k + tz];
    return [x, y, z];
}

// console.log(update_Vec_Pos([23, 3, -10], 1, -23, 98))

//;

//    const c = qt.q_mult(...qt.q_mult(...qt.q_quartenion, 0, ...a), ...qt.q_inv_quartenion);


function st_invSqrt(number) {
    return 1 / (Math.sqrt(number));
}

function st_invSqrt2(number) {
    return 1 / (Math.pow(number, 0.5));
}


function simpleQuickSort(ar = []) {
    const len = ar.length;
    if (len <= 1) return ar;
    else {
        const pivot = ar[0];
        left = [];
        right = [];
        for (i = 0; i < len; i++) {
            if (ar[i] < pivot) {
                left.push(ar[i]);
            } else if (ar[i] > pivot) {
                right.push(ar[i]);
            }
        }
        return [...simpleQuickSort(left), pivot, ...simpleQuickSort(right)];
    }
}

const mode = 'deg';


function shearMat(angle) { // still under scrutiny will not work with the matrix operation functions unless modified!!!
    angle = runmode(angle)
    return [1, Math.tan(angle), Math.tan(angle), 1, ];
}


function runmode(angle) {
    if (mode === "deg") {
        return (Math.PI / 180) * angle;
    } else if (mode === "rad") {
        return angle;
    } else if (mode === 'grad') {
        return (Math.PI / 200) * angle;
    }
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

// const ang = 45;

// const a = matMult([0, 0], shearMat(ang), [1, 2], [2, 2])
// const b = matMult([1, 0], shearMat(ang), [1, 2], [2, 2])
// const c = matMult([1, 1], shearMat(ang), [1, 2], [2, 2])
// const d = matMult([0, 1], shearMat(ang), [1, 2], [2, 2])

// console.log(a, b, c, d);


class Matrix extends Quartenion {
    constructor() {
        super();
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

    scaMult(scalarVal, matIn, leaveLast = false) {
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

    addSub(matA, matB, neg = false) {
        const matC = [];
        const matAlen = matA.length;
        const matBlen = matB.length;
        var sgn = 1;

        if (neg === true) {
            sgn = -1;
        }

        if (matAlen === matBlen) {
            for (let i = 0; i < matAlen; i++) {
                matC.push(matA[i] + sgn * matB[i]);
            }
        }

        return matC;
    }

    transposeMat(matIn, shapeMat) {
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

    identityMat(val) {
        const num = val ** 2;
        const matOut = [];

        for (let i = 0; i < num; i++) {
            if (i % val === 0) {
                matOut.push(1);
            } else matOut.push(0);
        }

        return matOut;
    }

    getRest(matIn, shapeNum, row, column) {
        const matOut = [];

        for (let i = 0; i < shapeNum; i++) {
            for (let j = 0; j < shapeNum; j++) {
                if (i !== row && j !== column) {
                    matOut.push(matIn[(i * shapeNum) + j]);
                }
            }
        }

        return matOut;
    }

    getDet(matIn, shapeNum) {
        if (shapeNum >= 0) {
            // If it is a 1x1 matrix, return the matrix
            if (shapeNum === 1) {
                return matIn;
            }
            // If it is a 2x2 matrix, return the determinant
            if (shapeNum === 2) {
                return ((matIn[0] * matIn[3]) - (matIn[1] * matIn[2]));
            }
            // If it an nxn matrix, where n > 2, recursively compute the determinant,
            //using the first row of the matrix
            else {
                var res = 0;
                const tmp = [];

                for (let i = 0; i < shapeNum; i++) {
                    tmp.push(matIn[i]);
                }

                const cofMatSgn = this.getCofSgn([1, shapeNum]);

                var a = 0;
                const cofLen = cofMatSgn.length;

                for (let i = 0; i < cofLen; i++) {
                    var ret = this.getRest(matIn, shapeNum, a, i);

                    res += (cofMatSgn[i] * tmp[i] * this.getDet(ret, shapeNum - 1));
                }

                return res;
            }
        }
    }

    getMinor(matIn, shapeNum) {
        const matOut = [];

        for (let i = 0; i < shapeNum; i++) {
            for (let j = 0; j < shapeNum; j++) {
                matOut.push(this.getDet(this.getRest(matIn, shapeNum, i, j), shapeNum - 1))
            }
        }

        return matOut;
    }

    getCofSgn(shapeMat) {
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

    getCof(matIn, shapeNum) {
        const cofMatSgn = this.getCofSgn([shapeNum, shapeNum]);
        const minorMat = this.getMinor(matIn, shapeNum);
        const matOut = [];
        const len = shapeNum ** 2;

        for (let i = 0; i < len; i++) {
            matOut.push(cofMatSgn[i] * minorMat[i]);
        }

        return matOut;
    }

    getAdj(matIn, shapeNum) {
        return this.transposeMat(this.getCof(matIn, shapeNum), [shapeNum, shapeNum]);
    }

    getInvMat(matIn, shapeNum) {
        return this.scaMult(1 / (this.getDet(matIn, shapeNum)), this.getAdj(matIn, shapeNum));
    }
}

class VecOp extends Matrix {
    constructor() {
        super();
        this.theta = 0;
        this.angle_unit = 'deg';
    }

    angleUnit(angle) { // for sin, sinh, cos, cosh, tan and tanh
        var _angle = 0;

        if (this.angle_unit === "deg") _angle = (Math.PI / 180) * angle;
        else if (this.angle_unit === "rad") _angle = angle;
        else if (this.angle_unit === 'grad') _angle = (Math.PI / 200) * angle;

        return _angle;
    }

    revAngleUnit(angle) { // for sin, sinh, cos, cosh, tan and tanh
        var _angle = 0;

        if (this.angle_unit === "deg") _angle = (180 / Math.PI) * angle;
        else if (this.angle_unit === "rad") _angle = angle;
        else if (this.angle_unit === 'grad') _angle = (200 / Math.PI) * angle;

        return _angle;
    }

    mag(vec) {
        const v_len = vec.length;
        var magnitude = 0;

        for (let i = 0; i < v_len; i++) {
            magnitude += vec[i] ** 2
        }

        return Math.sqrt(magnitude);
    }

    normalizeVec(vec) {
        const len = Math.round(vec.length);
        const magnitude = this.mag(vec);
        const ret_vec = [];

        for (let i = 0; i < len; i++) {
            ret_vec[i] = vec[i] / magnitude;
        }

        return ret_vec;
    }

    dotProduct(vecA_or_magA, vecB_or_magB, angle = undefined) {
        // Can be:
        //          1. two vectors without an angle (angle is undefined and vectors are 2d vectors or higher).
        //          2. two magnitudes (magnitude of two vectors) with an angle (angle is a number).

        // Use vectors if you know the components e.g [x,y] values for 2d vectors, [x,y,z] values for 3d vectors and so on.
        // Use magnitudes and an angle if you know the magnitudes of the vectors and the angle between the two vectors.

        if (typeof angle === "number") { // Magnitude use.
            const toRad = this.angleUnit(angle);
            return vecA_or_magA * vecB_or_magB * Math.cos(toRad);
        }

        if (typeof angle !== "undefined") { // Vector use.
            return;
        }

        const vec_a_len = vecA_or_magA.length;
        const vec_b_len = vecB_or_magB.length;

        //verify first that both vectors are of the same size and both are 2d or higher.
        if (vec_a_len === vec_b_len && vec_b_len >= 2) {
            var dot_product = 0;

            for (let i = 0; i < vec_a_len; i++) {
                dot_product += vecA_or_magA[i] * vecB_or_magB[i];
            }
            return dot_product;
        }
    }

    getDotProductAngle(vecA, vecB) { // get the angle between two vectors.
        const dot_product = this.dotProduct(vecA, vecB);
        const cosAng = Math.acos(dot_product / (this.mag(vecA) * this.mag(vecB)));

        return this.revAngleUnit(cosAng);
    }

    getCrossProductByMatrix(vecs, vecs_len) {
        var cross_product = [];
        const proper_vec_len = vecs_len + 1; // All the vectors should be the same dimension with n + 1, where n is the number of vectors.
        var matrix_array_top_row = [];

        for (let i = 0; i < proper_vec_len; i++) {
            matrix_array_top_row[i] = 0 // Actually the number 0 is just a placeholder as we don't need any numbers here but we put 0 to make it a number array.
        }

        var same_shape = 0; // If this variable is still equal to zero by the end of subsequent computations,
        // it means that all the vectors are of dimenstion n + 1
        var other_rows_array = [];

        for (let i = 0; i < vecs_len; i++) {
            const vec_len = vecs[i].length;
            if (vec_len !== proper_vec_len) same_shape++; // If a vector is not the same dimension with n + 1,
            // increment the same_shape variable to capture this error.
            else other_rows_array.push(...vecs[i]); // Else if the vector is the same dimension with n + 1, push the vector to a matrix array.
        }

        if (same_shape === 0) { // All the vectors are the same dimension of n + 1.
            const matrix_array = [...matrix_array_top_row, ...other_rows_array];
            const storeCofSgn = this.getCofSgn([proper_vec_len, 1]);

            for (let i = 0; i < proper_vec_len; i++) {
                const rest_matrix_array = this.getRest(matrix_array, proper_vec_len, 0, i);
                cross_product[i] = storeCofSgn[i] * this.getDet(rest_matrix_array, vecs_len);
            }
        }

        return cross_product;
    }
    crossProduct(vecs_or_mags, angle = undefined, unitVec = undefined) {
        var cross_product = [];
        const vecs_or_mags_len = vecs_or_mags.length;
        // Can be:
        //          1. two vectors without an angle (angle is undefined and vectors are 3d vectors or higher).
        //          2. two magnitudes (magnitude of two vectors) with an angle (angle is a number).

        // Use vectors if you know the components e.g [x,y,z] values for 3d vectors, [w,x,y,z] values for 4d vectors and so on.
        // Use magnitudes and an angle if you know the magnitudes of the vectors and the angle between the two vectors.
        if (typeof angle === "undefined") { // Vector use.
            cross_product = [...this.getCrossProductByMatrix(vecs_or_mags, vecs_or_mags_len)];
        }

        if (typeof angle === "number") { // Magnitude use.
            var magnitude = 1 // initial magnitude place holder
            const toRad = this.angleUnit(angle);

            for (let i = 0; i < vecs_or_mags_len; i++) {
                magnitude *= vecs_or_mags[i];
            }

            if (typeof unitVec === "undefined") cross_product = magnitude * Math.sin(toRad);
            else if (typeof unitVec === "object") cross_product = this.scaMult(magnitude * Math.sin(toRad), unitVec);
        }

        return cross_product;
    }


    getCrossProductAngle(vecs) { // get the angle between the vectors (makes sense in 3d, but feels kinda weird for higher dimensions but sorta feels like it works...???)
        var cross_product_angle = undefined;
        const vecs_len = vecs.length;
        const proper_vec_len = vecs_len + 1; // All the vectors should be the same dimension with n + 1, where n is the number of vectors.
        var same_shape = 0; // If this variable is still equal to zero by the end of subsequent computations,
        // it means that all the vectors are of dimenstion n + 1
        const cross_product_mag = this.mag(this.crossProduct(vecs));
        var vecs_m = 1;

        for (let i = 0; i < vecs_len; i++) {
            const vec_len = vecs[i].length;
            if (vec_len !== proper_vec_len) same_shape++; // If a vector is not the same dimension with n + 1,
            // increment the same_shape variable to capture this error.
            else vecs_m *= this.mag(vecs[i]);
        }

        if (same_shape === 0) {
            const sinAng = Math.asin(cross_product_mag / vecs_m);
            const fromRad = this.revAngleUnit(sinAng);
            cross_product_angle = fromRad;
        }

        return cross_product_angle;
    }

    getCrossPUnitVec(vecs) {
        var cross_product_unit_vec = [];

        const cross_product = this.crossProduct(vecs);
        const cross_product_mag = this.mag(cross_product);
        cross_product_unit_vec = this.scaMult(1 / cross_product_mag, cross_product);

        return cross_product_unit_vec;
    }
}

const v = new VecOp()

const vec1 = [3, 5, 2];

const vec2 = [9, 3, 2];

const vec3 = [4, 2, 9];

const n = 1e6;

// j

38.157568056677825

6.164414002968976

9.695359714832659

39.67612567144567

    [0.10482848367219183, 0.3144854510165755, -0.9434563530497264]

// |axb| = |a|^2*|b|^2 - (a.b)^2

//v.mag(v.crossProduct([vec1, vec2])) ** 2 === (v.mag(vec1) ** 2) * (v.mag(vec2) ** 2) - (v.dotProduct(vec1, vec2) ** 2)


// N.x = r*sin(heading) = cos(elevation) * sin(heading)
// N.y = sin(elevation)
// N.z = r* cos(heading) = cos(elevation ) * cos(heading)


const Target = [0, 0, 0];
const [cx, cy, cz] = [0, 0, 1];
const Camera = [cx, cy, cz];
const up = [0, 1, 0];
Target[2] = -Target[2]; //reverse point for right to left hand coordinate system
Camera[2] = -Camera[2]; //reverse camera for right to left hand coordinate system
const diff = v.addSub(Target, Camera, true);
var N = v.normalizeVec(diff);
var U = v.normalizeVec(v.crossProduct([up, N]));
var V = v.crossProduct([N, U]);

U = v.q_rot(90, U, U, [1, 1, 1]);
V = v.q_rot(90, U, V, [1, 1, 1]);
N = v.q_rot(90, U, N, [1, 1, 1]);



console.log("camera", Camera, "\ntarget", Target, "\ndifference:", diff, "\nup:", up, "\nU:", U, "\nV:", V, "\nN:", N);


const camMatrix = [];
camMatrix.push(...U, -cx, ...V, -cy, ...N, cz, ...[0, 0, 0, 1]);
console.log("camera transform matrix: ", camMatrix);
const invCamMatrix = v.getInvMat(camMatrix, 4);
console.log("inverse camera transform matrix: ", invCamMatrix);

T = [0, 0, -15, 1];
console.log("right-hand-coord: ", T);
T[2] = -T[2];

console.log("left-hand-coord: ", T);

const res = v.matMult(camMatrix, T, [4, 4], [4, 1]);
const inv_res = v.matMult(invCamMatrix, res, [4, 4], [4, 1]);

console.log(res);
console.log(inv_res)
const r = [...inv_res];
r[2] = -r[2];
console.log(r)
    // U -- X
    // V -- Y
    // N -- Z

// let m = new Matrix()

// console.log(m.getInvMat([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1], 4))


function lookAt(e_x, e_y, e_z, p_x, p_y, p_z) {};

function translateCam(x, y, z) {};


// console.log(camera, lookat)
// console.log(N)

// const V = v.normalizeVec(v.crossProduct([N, v.crossProduct([N, up])]));
// const U = v.normalizeVec(v.crossProduct([N, V]));


class ObjectTransform {}

class CameraTransform {}

class CanvasObject {
    constructor() {
        this.vertices = [];
        this.center = [0, 0, 0]; //default object center
    }
}

class CanvasObjects {}

class Counter {}

class ObjectList {}

class Delaunay {}

class Vector {}

class LocalSpace {}

class WorldSpace {}

class ViewSpace {}

class ClipSpace {}

class ScreenSpace {}


let obj1 = new CanvasObject();
let obj2 = new CanvasObject();


const [a, b, c, d, e, f, g] = [
    [-100, 100, 100],
    [-100, 100, -100],
    [-100, -100, 100],
    [-100, -100, -100],
    [100, 100, 100],
    [100, 100, -100],
    [100, -100, 100],
    [100, -100, -100]
]

const [i, j, k, l] = [
    [0, 200, 0],
    [0, -50, 100],
    [150, -50, -120],
    [-150, -50, -120]
];

let q = new Quartenion()
    // obj1.vertices = [...a, ...b, ...c, ...d, ...e, ...f, ...g];

// obj2.vertices = [...i, ...j, ...k, ...l];

// console.log(q.q_rot(90, [1, 0, 0], [1, 0, 0]), "X: X")
// console.log(q.q_rot(90, [1, 0, 0], [0, 1, 0]), "X: Y")
// console.log(q.q_rot(90, [1, 0, 0], [0, 0, 1]), "X: Z")

// console.log(q.q_rot(90, [0, 1, 0], [1, 0, 0]), "Y: X")
// console.log(q.q_rot(90, [0, 1, 0], [0, 1, 0]), "Y: Y")
// console.log(q.q_rot(90, [0, 1, 0], [0, 0, 1]), "Y: Z")

// console.log(q.q_rot(90, [0, 0, 1], [1, 0, 0]), "Z: X")
// console.log(q.q_rot(90, [0, 0, 1], [0, 1, 0]), "Z: Y")
// console.log(q.q_rot(90, [0, 0, 1], [0, 0, 1]), "Z: Z")