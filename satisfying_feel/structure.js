function classes(bases) {
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

class Counter {
    constructor() {
        this.counter = 0;
    }

    change(value) {
        this.counter = value;
        return this;
    }

    add() {
        this.counter++;
        return this;
    }

    subtract() {
        this.counter--;
        return this;
    }

    value() {
        return this.counter;
    }
}

class SetHalfEdges {
    constructor(vertex_indexes) {
        this.HalfEdgeDict = {};
        this.vert_len = vertex_indexes.length;
        this.vert_array = vertex_indexes;
        this.triangle = [];
        this.last = null;
        this.edge_no = 0;

        for (let i = 0; i < this.vert_len; i++) {
            this.setHalfEdge(i);
        }

        if (Object.entries(this.HalfEdgeDict).length > 0) {
            this.edge_no--;
            delete this.HalfEdgeDict[`${this.last}-null`];
        }

    }

    halfEdge(start, end) {
        return {
            vertices: [start, end],
            face_vertices: [],
            twin: null,
            prev: null,
            next: null
        };
    }

    setHalfEdge(index) {

        const vert_1 = this.vert_array[index];
        var end = null;
        var prev_start = null;
        var next_end = null;

        if (index - 1 >= 0) {
            prev_start = this.vert_array[index - 1];
        }

        if (index + 1 < this.vert_len) {
            end = this.vert_array[index + 1];
        } else {
            end = null;
        }

        if (index + 2 < this.vert_len) {
            next_end = this.vert_array[index + 2];
        } else {
            next_end = null;
        }

        if (index === this.vert_len - 1) {
            this.last = this.vert_array[index];
        }

        const vert_0 = prev_start
        const vert_2 = end;
        const vert_3 = next_end;

        const halfEdgeKey = `${vert_1}-${vert_2}`;
        const prevHalfEdgeKey = `${vert_0}-${vert_1}`
        const nextHalfEdgeKey = `${vert_2}-${vert_3}`;
        const twinHalfEdgeKey = `${vert_2}-${vert_1}`;

        if (!this.HalfEdgeDict[halfEdgeKey]) {
            this.HalfEdgeDict[halfEdgeKey] = this.halfEdge(vert_1, vert_2);
            this.edge_no++;

            this.HalfEdgeDict[halfEdgeKey].prev = prevHalfEdgeKey;
            this.HalfEdgeDict[halfEdgeKey].next = nextHalfEdgeKey;


            if ((index % 3 === 0) && index > 0) {
                this.HalfEdgeDict[prevHalfEdgeKey].face_vertices = this.triangle;
                this.HalfEdgeDict[this.HalfEdgeDict[prevHalfEdgeKey].prev].face_vertices = this.triangle;
                this.HalfEdgeDict[this.HalfEdgeDict[this.HalfEdgeDict[prevHalfEdgeKey].prev].prev].face_vertices = this.triangle;

                this.triangle = [];
            }

            this.triangle.push(this.vert_array[index]);

            if (this.HalfEdgeDict[twinHalfEdgeKey]) {
                this.HalfEdgeDict[halfEdgeKey].twin = twinHalfEdgeKey;
                this.HalfEdgeDict[twinHalfEdgeKey].twin = halfEdgeKey;
                this.edge_no--;
            }
        }

    }
}

class Misc {
    constructor() {}

    isInsideCirc(point, circle) {
        const x = Math.abs(point[0] - circle[0]);
        const y = Math.abs(point[1] - circle[1]);
        const r = circle[2]

        if ((x ** 2 + y ** 2) <= r ** 2) {
            return true;
        } else return false
    }

    hoveredVertices(x, y, array, width, height, num, radius) {
        const hovered_vertices = [];
        for (let j = 0; j < height; j++) {
            for (let i = 0; i < width; i++) {
                const mult = j * width * num + i * num;
                if (this.isInsideCirc([x, y], [array[mult], array[mult + 1], radius])) {
                    hovered_vertices.push(...[array[mult], array[mult + 1]]);
                }
            }
        }
        return hovered_vertices;
    }
}

class BackwardsCompatibilitySettings {
    // Composition is used as we don't want to compute the basic error-checking everytime.
    constructor() {
        this.test_array = new Array();
        this.compatibility_error = false;
        this.first_error_pos = null;

        this.flat_exists();
        this.map_exists();
        this.reduce_exists();
        this.reverse_exists();
        this.push_exists();
        this.forEach_exists();

        this.detect_compatibility_issues();
    }

    detect_compatibility_issues() {
        const test_array_len = this.test_array.length;
        for (let i = 0; i < test_array_len; i++) {
            if (this.test_array[i] === false) {
                this.compatibility_error = true;
                this.first_error_pos = i;
                return;
            }
        }
    }

    flat_exists() {
        if (typeof this.test_array.flat !== "undefined" && typeof this.test_array.flat === "function") this.test_array[0] = true;
        else this.test_array[0] = false;
    }

    map_exists() {
        if (typeof this.test_array.map !== "undefined" && typeof this.test_array.map === "function") this.test_array[1] = true;
        else this.test_array[1] = false;
    };

    reduce_exists() {
        if (typeof this.test_array.reduce !== "undefined" && typeof this.test_array.reduce === "function") this.test_array[2] = true;
        else this.test_array[2] = false;
    };

    reverse_exists() {
        if (typeof this.test_array.reverse !== "undefined" && typeof this.test_array.reverse === "function") this.test_array[3] = true;
        else this.test_array[3] = false;
    };

    push_exists() {
        if (typeof this.test_array.push !== "undefined" && typeof this.test_array.push === "function") this.test_array[4] = true;
        else this.test_array[4] = false;
    }

    forEach_exists() {
        if (typeof this.test_array.forEach !== "undefined" && typeof this.test_array.forEach === "function") this.test_array[5] = true;
        else this.test_array[5] = false;
    }
}

const compatibilitySettings = new BackwardsCompatibilitySettings();

class Quartenion extends Misc {
    constructor() {
        super();
        this.X = [1, 0, 0];
        this.Y = [0, 1, 0];
        this.Z = [0, 0, 1];
        this.q_vector = [0, 0, 0]; // 3d vector
        this.q_quartenion = [0, 0, 0, 0]; // 4d quartenion
        this.q_inv_quartenion = [0, 0, 0, 0]; // 4d inverse quartenion
        this.normalize = true;
        this.translate = true;
        this.theta = 0;
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

function update_Vec_Pos(vec_or_pos, tx, ty, tz) {
    var [i, j, k] = vec_or_pos;
    const [x, y, z] = [i + tx, j + ty, k + tz];
    return [x, y, z];
}


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

class Vector extends Matrix {
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

class PerspectiveProjection extends Matrix {
    constructor() {
        super();
    }

    setPersProjectParam(nearZ = 0.1, farZ = 100, angle = 60) {
        this.f = farZ;
        this.n = nearZ;
        this.fov = fovAng;
        this.arInv = 1 / this.aspectRatio;
        this.dist = 1 / (Math.tan((this.fov / 2) * (Math.PI / 180)));
    }

    persProject() {
        this.camProjectionMatrix = [this.dist * this.arInv, 0, 0, 0, 0, this.dist, 0, 0, 0, 0, (-this.n - this.f) / (this.n - this.f), (2 * this.f * this.n) / (this.n - this.f), 0, 0, 1, 0];
    }

    invPersProject() {
        this.invCamProjectionMatrix = this.getInvMat(this.camProjectionMatrix, 4);
    }

    changeW(val) {
        this.w = val;
        return this;
    }
}

let pers = new PerspectiveProjection()

pers.setPersProjectParam()

class CanvasObject extends Vector {
    constructor() {
        super();
        // default values
        this.base_vertices = [];
        this.vertices_sign = [];
        this.center = [0, 0, 0];
        this.id = null;
        this.exists = true;
        this.depth_occlusion = true;
        this.comp_error = compatibilitySettings.compatibility_error;
        this.space = "local"; // Possible values: local/object, world, camera/view, clip, screen
    }

    is_x_value(vertex_array_index) {
        if (vertex_array_index % 3 == 0) return true
        else return false;
    }

    is_y_value(vertex_array_index) {
        if (vertex_array_index % 3 == 1) return true
        else return false;
    }

    is_z_value(vertex_array_index) {
        if (vertex_array_index % 3 == 2) return true
        else return false;
    }

    add_vertices(vertex_array, add_vertex_array) {}

    clear_all_vertices(vertex_array) {}

    clear_selected_vertex(vertex_array, vertex_id_array) {}
}

class SolidOfRevolution {}

// Basic Object Types


// 2D Objects

class Line {}

class Curve {}

class Conic {}

class Circle extends Conic {}

class Oval extends Circle {}

class Ellipse extends Conic {}

class HyperBola extends Conic {}

class NPolygon extends Circle {}

class Triangle extends NPolygon {}

class Rectangle extends NPolygon {}

class Square extends Rectangle {}

class Kite extends NPolygon {}

class Parrallelogram extends NPolygon {}

class Rhombus extends Parrallelogram {}

// 3D Objects

class BoxObject extends CanvasObject {
    constructor() {
        super();
        this.box_vertex_density_number = 1;
        this.box_width_number = 10;
        this.box_height_number = 10;
        this.box_depth_number = 10;
        this.reload_box_functions_bool = false;
        this.pushed_vertices = new Float64Array()
        this.box_vertices = new Float64Array();
        this.box_base_edge_sequence = ["0-1", "0-2", "0-4", "3-1", "3-2", "3-7", "5-1", "5-4", "5-7", "6-2", "6-4", "6-7"];
        this.box_vertex_core();
        this.box_dimensions_core();
    }

    box_vertex_core() {
        for (let i = 0; i < 8; i++) {
            this.vertices_sign[i * 3] = i >= 4 ? 1 : -1; // x value
            this.vertices_sign[i * 3 + 1] = i % 4 >= 2 ? 1 : -1; // y value
            this.vertices_sign[i * 3 + 2] = i % 2 === 1 ? 1 : -1; // z value
        }
    }

    box_dimensions_core() {
        this.box_vertices = new Float64Array();
        const vertex_sgn_len = this.vertices_sign.length;
        for (let i = 0; i < vertex_sgn_len; i++) {
            if (this.is_x_value(i)) this.base_vertices[i] = this.vertices_sign[i] * this.box_width_number;
            if (this.is_y_value(i)) this.base_vertices[i] = this.vertices_sign[i] * this.box_height_number;
            if (this.is_z_value(i)) this.base_vertices[i] = this.vertices_sign[i] * this.box_depth_number;
        }
        this.box_vertices = [...this.base_vertices];
    }

    box_vertex_density_core() {
        this.pushed_vertices = [];
        if (this.box_vertex_density_number > 1) {
            const box_num = this.box_vertex_density_number - 1;

            const num = 12 * box_num;
            var start_array = [];
            var end_array = [];
            var pre_diffX = 0;
            var pre_diffY = 0;
            var pre_diffZ = 0;
            var diffX = 0;
            var diffY = 0;
            var diffZ = 0;
            var base_edge = 0;
            var minX = 0;
            var minY = 0;
            var minZ = 0;

            for (let index = 0; index < num; index++) {
                const mod_num = index % box_num;
                if (mod_num === 0) {

                    const [start, end] = this.box_base_edge_sequence[base_edge].split("-");
                    start_array = this.get_box_vertex_dimensions(start);
                    end_array = this.get_box_vertex_dimensions(end);

                    [pre_diffX, pre_diffY, pre_diffZ] = [
                        end_array[0] - start_array[0],
                        end_array[1] - start_array[1],
                        end_array[2] - start_array[2]
                    ];
                    base_edge++;

                    [diffX, diffY, diffZ] = [
                        Math.abs(pre_diffX / this.box_vertex_density_number),
                        Math.abs(pre_diffY / this.box_vertex_density_number),
                        Math.abs(pre_diffZ / this.box_vertex_density_number)
                    ];

                    minX = Math.min(start_array[0], end_array[0]);
                    minY = Math.min(start_array[1], end_array[1]);
                    minZ = Math.min(start_array[2], end_array[2]);
                }
                this.pushed_vertices.push(...[diffX * (mod_num + 1) + minX, diffY * (mod_num + 1) + minY, diffZ * (mod_num + 1) + minZ]);
            }
        }

        var pLen = this.pushed_vertices.length;
        var offset = 0;

        while (pLen > 1000) {
            var pushed_vertices_child = new Float64Array(this.pushed_vertices.slice(offset, offset + 1000));
            this.box_vertices.push(...pushed_vertices_child);
            pLen = pLen - 1000;
            offset += 1000;
            pushed_vertices_child = [];
        }

        if (pLen < 1000) {
            var pushed_vertices_child = new Float64Array(this.pushed_vertices.slice(offset));
            this.box_vertices.push(...pushed_vertices_child);
            pushed_vertices_child = [];
        }
    }

    box_vertex_density(number) {
        this.box_vertex_density_number = Math.abs(Math.round(number));
        if (this.reload_box_functions_bool === true) this.reload_box_functions();
    }

    box_width(number) {
        this.box_width_number = Math.abs(number);
        if (this.reload_box_functions_bool === true) this.reload_box_functions();
    }

    box_height(number) {
        this.box_height_number = Math.abs(number);
        if (this.reload_box_functions_bool === true) this.reload_box_functions();
    }

    box_depth(number) {
        this.box_depth_number = Math.abs(number);
        if (this.reload_box_functions_bool === true) this.reload_box_functions();
    }

    get_box_vertex_dimensions(vertex_no) {
        const [x, y, z] = [vertex_no * 3, vertex_no * 3 + 1, vertex_no * 3 + 2];
        return [this.base_vertices[x], this.base_vertices[y], this.base_vertices[z]];
    }

    reload_box_functions() {
        this.box_dimensions_core();
        this.box_vertex_density_core();
    }

    getVertexNum(vertex_density_number) {
        return (vertex_density_number - 1) * 36 + 24;
    }
}

class SphereObject extends classes([CanvasObject, Circle, SolidOfRevolution]) {
    constructor() {
        super();
        this.vertex_len = this.base_vertices.length
    }
    sphere_radius(number) {}
}

class PyramidObject extends CanvasObject {
    constructor() {
        super();
        this.vertex_len = this.base_vertices.length
    }
    pyramid_height(number) {}
    pyramid_length(number) {}
}

class TriangularBasedPyramid extends PyramidObject {}

class SquareBasedPyramid extends PyramidObject {}

class nPolygonBasedPyramid extends([PyramidObject, NPolygon]) {}

class ConeObject extends classes([CanvasObject, Line, NPolygon, SolidOfRevolution]) {}

class TorusObject extends classes([CanvasObject, NPolygon, SolidOfRevolution]) {}

class CylinderObject extends classes([CanvasObject, Line, NPolygon, SolidOfRevolution]) {}

class RevolvedCurve extends classes([CanvasObject, Curve, NPolygon, SolidOfRevolution]) {}

function runs() {
    for (let i = 0; i < 1e10; i++) {
        if (t > 1000) return t;
        else t += Math.PI + Math.E;
    }
}

// edge_no = face_no + vertex_no - 2


// ** PERFOMANCE TEST ** //



// * BOX OBJECT PERFORMANCE TEST * //

// const num = 1;

// let testbox = new BoxObject();
// console.time("startboxrun");
// for (let i = 0; i < 1; i++) {
//     testbox.box_vertex_density(num);
//     testbox.box_width(28);
//     testbox.box_height(18);
//     testbox.box_depth(38);
//     testbox.reload_box_functions();
// }
// console.timeEnd("startboxrun");

// console.log(testbox.box_vertices);
// console.log(testbox.box_vertices.length);
// console.log(testbox.getVertexNum(num));