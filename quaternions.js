// i^2 = j^2 = k^2 = -1

// ij = -ji = k

// ki = -ik = j

// jk = -kj = i


//(w1 + x1i + y1j + z1k)(w2 + x2i + y2j + z2k) = (w1w2 - x1x2 - y1y2 - z1z2) + (w1x2 + x1w2 + y1z2 - z1y2)i + (w1y2 + y1w2 + z1x2 - x1z2)j + (w1z2 + z1w2 + x1y2 + y1x2)k


//      |x1|          |x2|
// v1 = |y1|     v2 = |y2|
//      |z1|          |z2|


// (w1w2 - v1.v2, w1v2 + w2v1 + v1 x v2)

// . : dot product
// x : cross product

// ||q|| = || w1 + x1i + y1j + z1k|| = sqrt(w1^2 + x1i^2 + y1j^2 + z1k^2)

// unit vector of q = (q/||q||)

// q1 . q2 = (q1/||q1||) ||q1|| . q2

// f(p) = qpq^-1

// v = [ v1 v2 v3]

//p = [xi yi zi]

// q = cos(theta/2) + sin(theta/2)(v1 v2 v3)

// q = w + xi + yj + zk
// where :
//        w = cos(theta/2)
//        x = v1*sin(theta/2)
//        y = v2*sin(theta/2)
//        z = v3*sin(theta/2)

// q^-1 = w - xi - yj - zk


const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d', { willReadFrequently: true });

const hovered = { color: document.getElementById('hoveredColor'), pixel: document.getElementById('hoveredPixel') };

const selected = { color: document.getElementById('selectedColor'), pixel: document.getElementById('selectedPixel') };

// const qt = new Quartenion()

// const a = [0, 0, 0];

// const b = [100, 0, 0];

// qt.angle(30)
// qt.vector(...[0, 0, 1], true)

// qt.quartenion()
// qt.inv_quartenion()

// // const c = qt.q_v_invq_mult(...qt.q_quartenion, ...a, ...qt.q_inv_quartenion)
// // const d = qt.q_v_invq_mult(...qt.q_quartenion, ...b, ...qt.q_inv_quartenion)

// const c = qt.q_v_invq_mult(...a, ...[1, 1, 1], ...[10, 20, 0]);
// const d = qt.q_v_invq_mult(...b, ...[5, 1, 1], ...[10, 20, 0]);

// console.log(c, d, qt.status(), qt.q_vector)

// function drawLine(x1, y1, z1, x2, y2, z2, color = 'red') {
//     ctx.beginPath();
//     ctx.lineWidth = 5;
//     ctx.strokeStyle = color;
//     ctx.moveTo(x1, y1);
//     ctx.lineTo(x2, y2)
//     ctx.stroke();
//     ctx.closePath();

// }

// window.addEventListener("dblclick", {} = () => drawLine(...a, ...b));
// window.addEventListener("dblclick", {} = () => drawLine(...c, ...d, 'blue'));

//YOU CAN ROTATE AND SCALE BUT NOT TRANSLATE VECTORS

//YOU CAN ROTATE, SCALE AND TRANSLATE POINTS



class Settings {
    constructor() {
        this.load();
        canvas.style.borderColor = 'red';
        canvas.style.borderWidth = 4;
        canvas.style.borderRadius = 2;
        canvas.style.borderStyle = "dashed";

        this.N_VECTOR = [1, 0, 0]; // Normal vector
        this.U_VECTOR = [0, 1, 0]; // Up vector
        this.V_VECTOR = [0, 0, 1]; // View vector -- target vector

        this.theta = 0; // radians
        this.angle_unit = 'deg' // make sure to keep your angle unit consistent through out your work!
    }

    load() {
        this.width = window.innerWidth - 40;
        this.height = window.innerHeight - 100;

        canvas.width = this.width;
        canvas.height = this.height;

        ctx.beginPath();
        ctx.fillStyle = 'gray';
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.closePath();
    }

    refresh() {
        ctx.clearRect(0, 0, this.width, this.height);
        this.load();
    }

    changeAngUnit(ang_unit) {
        this.angle_unit = ang_unit;
        return this;
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
}

class Misc extends Settings {
    constructor() {
        super();
    }

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

class Matrix extends Misc {
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

        var dot_product = 0;

        if (typeof angle === "undefined") { // Vector use.
            const vec_a_len = vecA_or_magA.length;
            const vec_b_len = vecB_or_magB.length;

            //verify first that both vectors are of the same size and both are 2d or higher.
            if (vec_a_len === vec_b_len && vec_b_len >= 2) {
                for (let i = 0; i < vec_a_len; i++) {
                    dot_product += vecA_or_magA[i] * vecB_or_magB[i];
                }
            }
        } else if (typeof angle === "number") { // Magnitude use.
            const toRad = this.angleUnit(angle);
            dot_product = vecA_or_magA * vecB_or_magB * Math.cos(toRad);
        }

        return dot_product;
    }

    getDotProductAngle(vecA, vecB) { // get the angle between two vectors.
        const dot_product = this.dotProduct(vecA, vecB);
        const cosAng = Math.acos(dot_product / (this.mag(vecA) * this.mag(vecB)));
        const fromRad = this.revAngleUnit(cosAng);

        return fromRad;
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
        } else if (typeof angle === "number") { // Magnitude use.
            var magnitude = 1 // initial magnitude place holder
            const toRad = this.angleUnit(angle);

            for (let i = 0; i < vecs_or_mags_len; i++) {
                magnitude *= vecs_or_mags[i];
            }

            if (typeof unitVec === "undefined") cross_product = magnitude * Math.sin(toRad), unitVec;
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

class Quartenion extends VecOp {
    constructor() {
        super();
        this.q_vector = [0, 0, 0]; // 3d vector
        this.q_quartenion = [0, 0, 0, 0]; // 4d quartenion
        this.q_inv_quartenion = [0, 0, 0, 0]; // 4d inverse quartenion
        this.normalize = true;
        this.translate = true;
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

class DrawLines extends Quartenion {
    constructor(num) {
        super(num);
        this.refreshLines(num);
    }

    refreshLines(num) {
        this.aspectRatio = this.width / this.height;
        if (this.aspectRatio > 1) {
            this.numX = Math.round(num * this.aspectRatio);
            this.numY = num;
        } else {
            this.numX = num;
            this.numY = Math.round(num * (1 / this.aspectRatio));
        }
        this.verList = new Int16Array(this.numX + 1);
        this.horList = new Int16Array(this.numY + 1);
        this.halfX = this.width / 2;
        this.halfY = this.width / 2;
    }

    lineMatrixHorizontal(R, ctx, color, lineWidth) { //the horizontal lines
        let hor = this.numY / R;
        ctx.beginPath();
        ctx.moveTo(0, Math.round(this.height / hor));
        ctx.lineTo(Math.round(this.width), Math.round(this.height / hor));
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        ctx.closePath();

        this.horList[R] = Math.round(this.height / hor);
        return this.horList
    }

    showhorList() {
        return this.horList
    }


    lineMatrixVertical(R, ctx, color, lineWidth) { //the vertical lines
        var ver = this.numX / R;
        ctx.beginPath();
        ctx.moveTo(Math.round(this.width / ver), 0);
        ctx.lineTo(Math.round(this.width / ver), Math.round(this.height));
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        ctx.closePath();

        this.verList[R] = Math.round(this.width / ver);
        return this.verList;
    }

    showverList() {
        return this.verList;
    }

    drawLines(ctx, color, lineWidth) { //draws the vertical and horizontal canvas lines

        for (let R = 0; R <= this.numY; R++) {
            this.lineMatrixHorizontal(R, ctx, color, lineWidth);
        }

        for (let R = 0; R <= this.numX; R++) {
            this.lineMatrixVertical(R, ctx, color, lineWidth);
        }

    }

    getVertices() {
        this.vlen = this.verList.length;
        this.hlen = this.horList.length;
        this.canvas_grid_vert = new Int16Array(this.hlen * this.vlen * 3);
        for (let y = 0; y < this.hlen; y++) {
            for (let x = 0; x < this.vlen; x++) {
                const mult = y * this.vlen * 3 + x * 3;
                this.canvas_grid_vert[mult] = this.verList[x];
                this.canvas_grid_vert[mult + 1] = this.horList[y];
                this.canvas_grid_vert[mult + 3] = 0;
            }
        }
    }

    shadeVertices() {
        this.getVertices();
        const a_third_vert_len = this.canvas_grid_vert.length / 3;
        for (let i = 0; i < a_third_vert_len; i++) {
            ctx.beginPath();
            ctx.fillStyle = 'green';
            ctx.arc(this.canvas_grid_vert[i * 3], this.canvas_grid_vert[i * 3 + 1], 3, 0, 2 * Math.PI, true);
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'black';
            ctx.stroke();
            ctx.closePath();
        }
    }

    hoverVertex(x, y) {
        ctx.beginPath();
        ctx.fillStyle = 'yellow';
        ctx.arc(x, y, 3, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.closePath();
    }

    unhoverVertex(x, y) {
        ctx.beginPath();
        ctx.fillStyle = 'green';
        ctx.arc(x, y, 3, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.closePath();
    }

    selectVertex(x, y) {
        ctx.beginPath();
        ctx.fillStyle = 'brown';
        ctx.arc(x, y, 3, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.closePath();
    }

    unselectVertex(x, y) {
        ctx.beginPath();
        ctx.fillStyle = 'green';
        ctx.arc(x, y, 3, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.closePath();
    }
}


class Grid extends DrawLines {
    constructor(num) {
        super(num);
        this.drawLines(ctx, 'blue', 2);
        this.shadeVertices();
    }
}

class CoordinateSpace extends Grid {
    constructor(num) {
        super(num);
        this.cameraPos = [0, 0, 1];
        this.cameraAng = [0, 0, 0];
        this.lightPos = [-5, 5, 5];
        this.objectPos = [0, 0, 0];
    }

    canvasTo(arr) {
        arr[0] -= this.halfx;
        arr[1] -= this.halfy;
        return arr;
    }

    toCanvas(arr) {
        arr[0] += this.halfx;
        arr[1] += this.halfy;
        return arr;
    }

    clip(arr) {
        arr[0] /= this.halfx;
        arr[1] /= this.halfy;
        return arr;
    }

    unclip(arr) {
        arr[0] *= this.halfx;
        arr[1] *= this.halfy;
        return arr;
    }

    canvToScreen(inputVertexArray, returnVertexArray) {
        const a_third_vert_len = inputVertexArray.length / 3;

        for (let i = 0; i < a_third_vert_len; i++) {
            returnVertexArray[i * 3] = inputVertexArray[i * 3] - this.halfX;
            returnVertexArray[i * 3 + 1] = inputVertexArray[i * 3 + 1] - this.halfY;
        }
    }

    screenToCanv(inputVertexArray, returnVertexArray) {
        const a_third_vert_len = inputVertexArray.length / 3;

        for (let i = 0; i < a_third_vert_len; i++) {
            returnVertexArray[i * 3] = inputVertexArray[i * 3] + this.halfX;
            returnVertexArray[i * 3 + 1] = inputVertexArray[i * 3 + 1] + this.halfY;
        }
    }

    screenToWorld(inputVertexArray, returnVertexArray) {
        const a_third_vert_len = inputVertexArray.length / 3;

        for (let i = 0; i < a_third_vert_len; i++) {
            returnVertexArray[i * 3] = inputVertexArray[i * 3] / this.halfX;
            returnVertexArray[i * 3 + 1] = inputVertexArray[i * 3 + 1] / this.halfY;
        }
    }

    worldToScreen(inputVertexArray, returnVertexArray) {
        const a_third_vert_len = inputVertexArray.length / 3;

        for (let i = 0; i < a_third_vert_len; i++) {
            returnVertexArray[i * 3] = inputVertexArray[i * 3] * this.halfX;
            returnVertexArray[i * 3 + 1] = inputVertexArray[i * 3 + 1] * this.halfY;
        }
    }

    translatePoint(point, tx, ty, tz) {
        var [i, j, k] = point;
        const [x, y, z] = [i + tx, j + ty, k + tz];
        return [x, y, z];
    }

    setObject(Sx, Sy, Sz, Rx, Ry, Rz, Tx, Ty, Tz) {};

    // rotCamX(Rx) {
    //     this.U_VECTOR = this.q_rot(Rx, this.N_VECTOR, this.U_VECTOR); // rotate Up vector around Normal vector by X rotation angle
    //     this.V_VECTOR = this.q_rot(Rx, this.N_VECTOR, this.V_VECTOR); // rotate View vector around Normal vector by X rotation angle
    // }

    // rotCamY(Ry) {
    //     this.V_VECTOR = this.q_rot(Ry, this.U_VECTOR, this.V_VECTOR); // rotate View vector around Up vector by Y rotation angle
    //     this.N_VECTOR = this.q_rot(Ry, this.U_VECTOR, this.N_VECTOR); // rotate Normal vector around Up vector by Y rotation angle
    // }

    // rotCamZ(Rz) {
    //     this.N_VECTOR = this.q_rot(Rz, this.V_VECTOR, this.N_VECTOR); // rotate Normal vector around View vector by Z rotation angle
    //     this.U_VECTOR = this.q_rot(Rz, this.V_VECTOR, this.U_VECTOR); // rotate Up vector around View vector by Z rotation angle
    // }

    // setCamera(Rx = 0, Ry = 0, Rz = 0, Tx = 0, Ty = 0, Tz = 0, order = [0, 1, 2]) {

    //     this.translate = false;
    //     this.normalize = false;

    //     console.log(this.N_VECTOR, this.U_VECTOR, this.V_VECTOR);

    //     this.cameraPos = this.translatePoint(this.cameraPos, Tx, Ty, Tz); // translate camera position

    //     this.cameraAng = [Rx, Ry, Rz];

    //     // Determine the order of 3d rotation from the order array
    //     // e.g the default order array is [0,1,2], therefore:

    //     // order[0] is 0, and this.rotCamX is called
    //     // order[1] is 1, and this.rotCamY is called
    //     // order[2] is 2, and this.rotCamZ is called
    //     // hence an x,y,z rotation

    //     //else if the order array is set to [2,0,1], then:

    //     // order[0] is 2, and this.rotCamZ is called
    //     // order[1] is 0, and this.rotCamX is called
    //     // order[2] is 1, and this.rotCamX is called
    //     // hence an z,x,y rotation

    //     for (let i = 0; i < 3; i++) {
    //         if (order[i] === 0) {
    //             this.rotCamX(Rx);
    //         } else if (order[i] === 1) {
    //             this.rotCamY(Ry);
    //         } else if (order[i] === 2) {
    //             this.rotCamZ(Rz);
    //         }
    //     }

    //     this.translate = true;
    //     this.normalize = true;

    //     console.log(this.N_VECTOR, this.U_VECTOR, this.V_VECTOR);;

    //     return this.cameraPos;
    // }

    setLight(Tx, Ty, Tz) {
        const prev_angle = this.theta;
        this.angle(0);
        this.lightPos;
        this.theta = prev_angle;
    }
}

class Select extends CoordinateSpace {
    constructor(num = 10) {
        super(num);

        this.prev_hovered_vertices_array = [];
        this.hovered_vertices_array = [];
        this.pre_selected_vertices_array = [];
        this.selected_vertices_array = [];

        canvas.addEventListener("mousemove", (event) => this.pick(event, hovered));
        canvas.addEventListener("click", (event) => this.pick(event, selected));
        canvas.addEventListener("click", (event) => this.select(event));

        window.addEventListener('resize', {} = () => {
            this.refresh();
            this.refreshLines(num);
            this.drawLines(ctx, 'blue', 2)
            this.shadeVertices();

            this.prev_hovered_vertices_array = [];
            this.hovered_vertices_array = [];
            this.pre_selected_vertices_array = [];
            this.selected_vertices_array = [];
        });

        const grid_vert_len = this.canvas_grid_vert.length;
        this.screen_grid_vert = new Int16Array(grid_vert_len);
        this.world_grid_vert = new Float32Array(grid_vert_len);

        this.canvToScreen(this.canvas_grid_vert, this.screen_grid_vert);
        this.screenToWorld(this.screen_grid_vert, this.world_grid_vert);

        // console.log(this.canvas_grid_vert);
        // console.log(this.screen_grid_vert);
        // console.log(this.world_grid_vert);
    }

    validity(x, y) {
        var found = false;
        var s_val = 0;
        const half_len = this.selected_vertices_array.length / 2;

        for (let s = 0; s < half_len; s++) {
            const s_x = this.selected_vertices_array[s * 2];
            const s_y = this.selected_vertices_array[s * 2 + 1];

            if (s_x === x && s_y === y) {
                found = true;
                s_val = s;
            }
        }
        return [found, s_val];
    }

    select(event) {
        const bounding = canvas.getBoundingClientRect();
        const x = event.clientX - bounding.left;
        const y = event.clientY - bounding.top;

        this.pre_selected_vertices_array = this.hoveredVertices(x, y, this.canvas_grid_vert, this.vlen, this.hlen, 3, 5);

        const half_selected_vertices_len = this.selected_vertices_array.length / 2;
        const half_pre_selected_vertices_len = this.pre_selected_vertices_array.length / 2;

        for (let p = 0; p < half_pre_selected_vertices_len; p++) {
            const p_x = this.pre_selected_vertices_array[p * 2];
            const p_y = this.pre_selected_vertices_array[p * 2 + 1];

            const [found, s_val] = this.validity(p_x, p_y);

            if (found === true) {
                const first_part = this.selected_vertices_array.slice(0, (s_val * 2));
                const second_part = this.selected_vertices_array.slice((s_val * 2) + 2);
                this.selected_vertices_array = [...first_part, ...second_part];

                this.unselectVertex(p_x, p_y);
                this.pick(event, hovered);
            } else {
                this.selected_vertices_array.push(...[p_x, p_y]);

                this.selectVertex(p_x, p_y);
            }
        }
    }

    pick(event, destination) {
        const bounding = canvas.getBoundingClientRect();
        const x = event.clientX - bounding.left;
        const y = event.clientY - bounding.top;

        const pixel = ctx.getImageData(x, y, 1, 1);
        const data = pixel.data;

        const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
        destination.color.innerHTML = rgba;
        destination.pixel.innerHTML = `(${x},${y})`;

        const prev_half_len = this.prev_hovered_vertices_array.length / 2;

        this.hovered_vertices_array = this.hoveredVertices(x, y, this.canvas_grid_vert, this.vlen, this.hlen, 3, 200);
        const half_len = this.hovered_vertices_array.length / 2;

        const half_selected_vertices_len = this.selected_vertices_array.length;

        for (let i = 0; i < prev_half_len; i++) {
            const xval = this.prev_hovered_vertices_array[i * 2];
            const yval = this.prev_hovered_vertices_array[i * 2 + 1];

            const [found, s_val] = this.validity(xval, yval);

            if (found === false) this.unhoverVertex(xval, yval);
        }

        for (let i = 0; i < half_len; i++) {
            const xval = this.hovered_vertices_array[i * 2];
            const yval = this.hovered_vertices_array[i * 2 + 1];

            const [found, s_val] = this.validity(xval, yval);

            if (found === false) this.hoverVertex(xval, yval);
        }

        this.prev_hovered_vertices_array = this.hovered_vertices_array;

        return rgba;
    }
}

const select = new Select();


// const e = [0, 0, 0];

// const f = [100, 0, 0];


// // const c = qt.q_v_invq_mult(...qt.q_quartenion, ...a, ...qt.q_inv_quartenion)
// // const d = qt.q_v_invq_mult(...qt.q_quartenion, ...b, ...qt.q_inv_quartenion)

// const c = select.q_rot(45, [0, 0, 1], e);
// const d = select.q_rot(45, [0, 0, 1], f);

// console.log(c, d, select.status(), select.q_vector)

// function drawLine(x1, y1, z1, x2, y2, z2, color = 'red') {
//     ctx.beginPath();
//     ctx.lineWidth = 5;
//     ctx.strokeStyle = color;
//     ctx.moveTo(x1, y1);
//     ctx.lineTo(x2, y2)
//     ctx.stroke();
//     ctx.closePath();

// }

// window.addEventListener("dblclick", {} = () => drawLine(...e, ...f));
// window.addEventListener("dblclick", {} = () => drawLine(...c, ...d, 'blue'));