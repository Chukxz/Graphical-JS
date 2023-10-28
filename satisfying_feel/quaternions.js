"use strict"

const canvas = document.getElementsByTagName('canvas')[0];
const ctx = canvas.getContext('2d', { willReadFrequently: true });

const hovered = { color: document.getElementById('hoveredColor'), pixel: document.getElementById('hoveredPixel') };

const selected = { color: document.getElementById('selectedColor'), pixel: document.getElementById('selectedPixel') };

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

class Counter {
    constructor() {
        // this.counter = 0; commented here to avoid calling member functions natively  
    };

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

class BasicSettings {
    constructor() {
        //Canvas
        this.loadCanvas();

        canvas.style.borderColor = 'red';
        canvas.style.borderWidth = 4;
        canvas.style.borderRadius = 2;
        canvas.style.borderStyle = "dashed";

        //Quarternion
        this.theta = 0;
        this.angle_unit = 'deg';

        this.X = [1, 0, 0];
        this.Y = [0, 1, 0];
        this.Z = [0, 0, 1];
        this.q_vector = [0, 0, 0]; // 3d vector
        this.q_quarternion = [0, 0, 0, 0]; // 4d quarternion
        this.q_inv_quartenion = [0, 0, 0, 0]; // 4d inverse quarternion
        this.normalize = true;
        this.translate = true;
        this.theta = 0;

        // Perspective Projection;

        this.nearZ = 0.1
        this.farZ = 100;
        this.proj_angle = 60;

        this.arInv = undefined;
        this.dist = undefined;
        this.camProjectionMatrix = undefined;
        this.lightProjectionMatrix = undefined;
        this.invCamProjectionMatrix = undefined;
        this.invLightProjectionMatrix = undefined;

        // Camera

        this.actual_camera_pos = [0, 0, 1];
        this.used_camera_pos = [0, 0, -1]; // reverse point for right to left hand coordinate system

        this.U = [1, 0, 0];
        this.V = [0, 1, 0];
        this.N = [0, 0, 1];

        [this.cX, this.cY, this.cZ] = [0, 0, 0];

        this.camMatrix = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        this.invCamMatrix = [1, -0, 0, -0, -0, 1, -0, 0, 0, -0, 1, -0, -0, 0, -0, 1];

        // Miscellanous

        this.object_vertices = [];
        this.prev_hovered_vertices_array = [];
        this.hovered_vertices_array = [];
        this.pre_selected_vertices_array = [];
        this.selected_vertices_array = [];
    }

    loadCanvas() {
        // Canvas
        this.width = window.innerWidth - 40;
        this.height = window.innerHeight - 100;

        canvas.width = this.width;
        canvas.height = this.height;

        ctx.beginPath();
        ctx.fillStyle = 'gray';
        ctx.fillRect(0, 0, this.width, this.height);
        ctx.closePath();

        // Coordinate Space
        this.halfX = this.width / 2;
        this.halfY = this.height / 2;

        // Perspective Projection

        this.aspect_ratio = this.width / this.height;
    }

    refreshCanvas() {
        ctx.clearRect(0, 0, this.width, this.height);
        this.loadCanvas();
    }
}

class Miscellanous {
    constructor() {}

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

    isInsideCirc(point, circle) {
        const x = Math.abs(point[0] - circle[0]);
        const y = Math.abs(point[1] - circle[1]);
        const r = circle[2];

        if ((x ** 2 + y ** 2) <= r ** 2) {
            return true;
        } else return false;
    }

    hoveredVertices(x, y, vertex_array, radius) {
        const hovered_vertices = [];
        const a_third_vert_len = vertex_array.length / 3;
        for (let i = 0; i < a_third_vert_len; i++) {
            if (this.isInsideCirc([x, y], [vertex_array[i * 3], vertex_array[i * 3 + 1], radius])) {
                hovered_vertices.push(...[array[mult], array[mult + 1]]);
            }
        }

        return hovered_vertices;
    }

    shadeVertices(vertex_array, fill_color, stroke_color) {
        const a_third_vert_len = vertex_array.length / 3;
        for (let i = 0; i < a_third_vert_len; i++) {
            ctx.beginPath();
            ctx.fillStyle = fill_color;
            ctx.arc(vertex_array[i * 3], vertex_array[i * 3 + 1], 3, 0, 2 * Math.PI, true);
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = stroke_color;
            ctx.stroke();
            ctx.closePath();
        }
    }

    hoverVertex(x, y, hover_fill_color, hover_stroke_color) {
        ctx.beginPath();
        ctx.fillStyle = hover_fill_color;
        ctx.arc(x, y, 3, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = hover_stroke_color;
        ctx.stroke();
        ctx.closePath();
    }

    unhoverVertex(x, y, unhover_fill_color, unhover_stroke_color) {
        ctx.beginPath();
        ctx.fillStyle = unhover_fill_color;
        ctx.arc(x, y, 3, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = unhover_stroke_color;
        ctx.stroke();
        ctx.closePath();
    }

    selectVertex(x, y, select_fill_color, select_stroke_color) {
        ctx.beginPath();
        ctx.fillStyle = select_fill_color;
        ctx.arc(x, y, 3, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = select_stroke_color;
        ctx.stroke();
        ctx.closePath();
    }

    unselectVertex(x, y, unselect_fill_color, unselect_stroke_color) {
        ctx.beginPath();
        ctx.fillStyle = unselect_fill_color;
        ctx.arc(x, y, 3, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = unselect_stroke_color;
        ctx.stroke();
        ctx.closePath();
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

    selectionManager(event) {
        const bounding = canvas.getBoundingClientRect();
        const x = event.clientX - bounding.left;
        const y = event.clientY - bounding.top;

        if (this.object_vertices.length >= 1) {
            this.pre_selected_vertices_array = this.hoveredVertices(x, y, object_vertices, 5);

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

                    this.unselectVertex(p_x, p_y, "green", "black");
                    this.pick(event, hovered);
                } else {
                    this.selected_vertices_array.push(...[p_x, p_y]);

                    this.selectVertex(p_x, p_y, "brown", "black");
                }
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

        this.hovered_vertices_array = this.hoveredVertices(x, y, this.object_vertices, this.vlen, this.hlen, 3, 200);
        const half_len = this.hovered_vertices_array.length / 2;

        const half_selected_vertices_len = this.selected_vertices_array.length;

        for (let i = 0; i < prev_half_len; i++) {
            const xval = this.prev_hovered_vertices_array[i * 2];
            const yval = this.prev_hovered_vertices_array[i * 2 + 1];

            const [found, s_val] = this.validity(xval, yval);

            if (found === false) this.unhoverVertex(xval, yval, "green", "black");
        }

        for (let i = 0; i < half_len; i++) {
            const xval = this.hovered_vertices_array[i * 2];
            const yval = this.hovered_vertices_array[i * 2 + 1];

            const [found, s_val] = this.validity(xval, yval);

            if (found === false) this.hoverVertex(xval, yval, "yellow", "black");
        }

        this.prev_hovered_vertices_array = this.hovered_vertices_array;

        return rgba;
    }
}

class Quarternion {
    constructor() {}

    vector(v1, v2, v3) { // recommeded if vector is not a unit vector i.e non-normalized
        // normalize flag to normalize vector (create a unit vector)
        if (this.normalize === false) this.q_vector = [v1, v2, v3];
        else {
            const inv_mag = Math.pow(v1 ** 2 + v2 ** 2 + v3, -0.5);
            this.q_vector = [v1 * inv_mag, v2 * inv_mag, v3 * inv_mag];
        }
    }

    quarternion() {
        // quarternion
        const [v1, v2, v3] = this.q_vector;
        const [a, b] = [Math.cos(this.theta * 0.5), Math.sin(this.theta * 0.5)];
        this.q_quarternion = [a, v1 * b, v2 * b, v3 * b];
    };

    inv_quartenion() {
        // inverse quarternion
        const [v1, v2, v3] = this.q_vector;
        const [a, b] = [Math.cos(this.theta * 0.5), Math.sin(this.theta * 0.5)];
        this.q_inv_quartenion = [a, -v1 * b, -v2 * b, -v3 * b];
    };

    q_mult(w1, x1, y1, z1, w2, x2, y2, z2) {
        // quarternion _ quarternion multiplication
        return [(w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2), (w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2), (w1 * y2 + y1 * w2 + z1 * x2 - x1 * z2), (w1 * z2 + z1 * w2 + x1 * y2 - y1 * x2)];
    }

    q_v_invq_mult(x, y, z) {
        // quarternion _ vector _ inverse quarternion multiplication for point and vector rotation
        // with additional translating (for points) and scaling (for point and vectors) capabilities
        return this.q_mult(...this.q_quarternion, ...this.q_mult(0, x, y, z, ...this.q_inv_quartenion)).splice(1);
    }

    q_rot(_angle = 0, _vector = [0, 0, 1], _point = [0, 0, 0]) { // default values
        const [x, y, z] = _point;
        this.theta = this.angleUnit(_angle);
        this.vector(..._vector);
        this.quarternion();
        this.inv_quartenion();
        return this.q_v_invq_mult(x, y, z);
    }
}

class Matrix {
    constructor() {}

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
                matOut.push(matIn[i]);
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

class Vector {
    constructor() {}

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

class PerspectiveProjection {
    constructor() {}

    changeNearZ(val) {
        this.nearZ = val;
        this.setPersProjectParam();
    }

    changeFarZ(val) {
        this.farZ = val;
        this.setPersProjectParam();
    }

    changeProjAngle(val) {
        this.proj_angle = val;
        this.setPersProjectParam();
    }

    setPersProjectParam() {
        this.arInv = 1 / this.aspect_ratio;
        this.dist = 1 / (Math.tan((this.proj_angle / 2) * (Math.PI / 180)));
        this.camProjectionMatrix = [this.dist * this.arInv, 0, 0, 0, 0, this.dist, 0, 0, 0, 0, (-this.nearZ - this.farZ) / (this.nearZ - this.farZ), (2 * this.farZ * this.nearZ) / (this.nearZ - this.farZ), 0, 0, 1, 0];
        this.invCamProjectionMatrix = this.getInvMat(this.camProjectionMatrix, 4);
    }

    persProject(array) {
        return this.matMult(this.camProjectionMatrix, array, [4, 4], [4, 1]);
    }

    invPersProject(array) {
        return this.matMult(this.invCamProjectionMatrix, array, [4, 4], [4, 1]);
    }
}

class Camera {
    constructor() {}

    setCameraPos(x, y, z) {
        this.actual_camera_pos = [x, y, z];
        this.used_camera_pos = [x, y, -z]; // reverse point for right to left hand coordinate system
    }

    lookAt(look_at_point) {
        look_at_point[2] = -look_at_point[2]; // reverse point for right to left hand coordinate system
        const diff = this.addSub(look_at_point, this.used_camera_pos, true);
        const up = [0, 1, 0];
        this.N = this.normalizeVec(diff);
        this.U = this.normalizeVec(this.crossProduct([up, this.N]));
        this.V = this.normalizeVec(this.crossProduct([this.N, this.U]));
    }

    camRotate(plane, angle) {
        if (plane === "U-V") {
            this.U = this.q_rot(angle, this.N, this.U);
            this.V = this.q_rot(angle, this.N, this.V);
        } else if (plane === "U-N") {
            this.U = this.q_rot(angle, this.V, this.U);
            this.N = this.q_rot(angle, this.V, this.N);
        } else if (plane === "V-N") {
            this.V = this.q_rot(angle, this.U, this.V);
            this.N = this.q_rot(angle, this.U, this.N);
        }
        this.camMatrix = [...this.U, this.cX, ...this.V, this.cY, ...this.N, this.cZ, ...[0, 0, 0, 1]];
        this.invCamMatrix = this.getInvMat(this.camMatrix, 4);
    }

    camTranslate(translation_array) {
        [this.cX, this.cY, this.cZ] = translation_array;
        this.actual_camera_pos = this.addSub(this.actual_camera_pos, translation_array);
        this.used_camera_pos = [...this.actual_camera_pos];
        this.used_camera_pos[2] = -this.actual_camera_pos[2]; // reverse point for right to left hand coordinate system
        this.camMatrix = [...this.U, this.cX, ...this.V, this.cY, ...this.N, this.cZ, ...[0, 0, 0, 1]];
        this.invCamMatrix = this.getInvMat(this.camMatrix, 4);
    }
}

class Clip {
    constructor() {}

    canvasTo(arr) {
        const array = [...arr];
        array[0] -= this.halfX;
        array[1] -= this.halfY;
        return array;
    }

    clipCoords(arr) {
        const array = [...arr];
        array[0] /= this.halfX;
        array[1] /= this.halfY;
        return array;
    }

    toCanvas(arr) {
        const array = [...arr];
        array[0] += this.halfX;
        array[1] += this.halfY;
        return array;
    }

    unclipCoords(arr) {
        const array = [...arr];
        array[0] *= this.halfX;
        array[1] *= this.halfY;
        return array;
    }
}

class LocalSpace {
    constructor() {};

    objectRotate(point, axis, angle, state) {
        if (state === "local" || state === "object") return this.q_rot(angle, axis, point);
    };

    ObjectScale(point, scaling_array, state) {
        if (state === "local" || state === "object") return [point[0] * scaling_array[0], point[1] * scaling_array[1], point[2] * scaling_array[2]];
    }
}

class WorldSpace {
    constructor() {}
    ObjectTransform(point, translation_array, state) {
        if (state === "world") return this.addSub(point, translation_array);
    };

    objectRevolve(point, axis, angle, state) {
        if (state === "world") return this.q_rot(angle, axis, point);
    }
}

class CameraSpace {
    constructor() {};

    worldToCamera(array) {
        array[3] = 1;
        array[2] = -array[2] // reverse point for right to left hand coordinate system
        const result = this.matMult(this.camMatrix, array, [4, 4], [4, 1]);
        return result;
    };

    cameraToWorld(array) {
        const result = this.matMult(this.invCamMatrix, array, [4, 4], [4, 1]);
        result[2] = -result[2] // reverse point for left to right hand coordinate system
        result.length = 3;
        console.log(result);
        return result;
    };
}

class ClipSpace {
    constructor() {};

    cameraToClip(array) {
        const cam_proj = this.matMult(this.camProjectionMatrix, array, [4, 4], [4, 1]);
        const pers_div = this.scaMult(1 / cam_proj[3], cam_proj, true);
        return pers_div;
    };

    clipToCamera(array) {
        const rev_pers_div = this.scaMult(array[3], array, true);
        const rev_cam_proj = this.matMult(this.invCamProjectionMatrix, rev_pers_div, [4, 4], [4, 1]);
        return rev_cam_proj;
    };
}

class ScreenSpace {
    constructor() {};

    clipToScreen(array) {
        if (array[2] >= -1.1 && array[2] <= 1.1 && array[2] != Infinity) {
            const [i, j] = this.unclipCoords(array);
            const [x, y] = this.toCanvas([i, j]);
            // reverse point for left to right hand coordinate system
            return [x, y, -array[2], array[3]];
        }
    };

    screenToClip(array) {
        const [i, j] = this.canvasTo(array);
        const [x, y] = this.clipCoords([i, j]);
        // -array[2] reverse point for right to left hand coordinate system
        return [x, y, -array[2], array[3]];
    };
}


class BasicManager extends Classes([BasicSettings, Miscellanous, Quarternion, Vector, Matrix, PerspectiveProjection, Camera, Clip, LocalSpace, WorldSpace, CameraSpace, ClipSpace, ScreenSpace]) {
    constructor() {
        super();
        this.setPersProjectParam();

        canvas.addEventListener("mousemove", (event) => this.pick(event, hovered));
        canvas.addEventListener("click", (event) => this.pick(event, selected));
        canvas.addEventListener("click", (event) => this.selectionManager(event));
    }
}

// const point = [0.5, 0.8, 0.9];
// const a = basic_manager.objectRotate(point, basic_manager.Y, 90, "object");
// console.log(a)
// const b = basic_manager.objectRotate(a, basic_manager.Y, -90, "local")
// console.log(b)
// const c = basic_manager.ObjectTransform(a, [20, 10, 4], "world")
// console.log(c)
// const d = basic_manager.objectRevolve(c, basic_manager.Y, 90, "world")
// console.log(d)
// const e = basic_manager.worldToCamera(d);
// const f = basic_manager.cameraToWorld(e);
// console.log(e, f);
// const g = basic_manager.cameraToClip(e);
// const h = basic_manager.clipToCamera(g);
// console.log(g, h)
// const k = basic_manager.clipToScreen(g);
// const l = basic_manager.screenToClip(k);
// console.log(k, l)
// const w = basic_manager.ObjectTransform(f, [-20, -10, -4], "world")
// console.log(w)

class CanvasObject {
    constructor() {
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

class GridObject extends CanvasObject {
    constructor(width, height, aspect_ratio, num) {
        super();
    }

    refreshParams(width, height, aspect_ratio, num = this.num) {
        this.width = width;
        this.height = height;
        this.aspect_ratio = aspect_ratio;
        this.refreshLines(num);
    }

    refreshLines(num) {
        this.num = num;
        if (this.aspectRatio > 1) {
            this.numX = Math.round(num * this.aspectRatio);
            this.numY = num;
        } else {
            this.numX = num;
            this.numY = Math.round(num * (1 / this.aspectRatio));
        }
        this.verList = new Int16Array(this.numX + 1);
        this.horList = new Int16Array(this.numY + 1);
        this.generateGridVertices();
        this.drawLines(ctx, "blue", 2);
    }

    generateGridVertices() {
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
        return this.horList;
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

    drawLines(ctx, color, lineWidth) { //draws the vertical and horizontal canvas lines

        for (let R = 0; R <= this.numY; R++) {
            this.lineMatrixHorizontal(R, ctx, color, lineWidth);
        }

        for (let R = 0; R <= this.numX; R++) {
            this.lineMatrixVertical(R, ctx, color, lineWidth);
        }
    }
}

class ObjectManager extends Counter {
    constructor() {
        super();
        this.counter = 0;
        this.objects_dict = {};
    }
    createObject(instance_of_object) {}
    registerObject() {}
    deleteObject(object_id) {
        delete this.objects_dict[`${object_id}`];
    }
}


// var obj2 = {
//     "0": [
//         { object_id: 0, object_name: 'Square_Object_0', object_vertices: [2, 5, 3.8] },
//     ],
//     "1": [
//         { object_id: 1, object_name: 'Circle_Object_0', object_vertices: [7, 8, 3.9] }
//     ]
// }

class RefreshObjects extends ObjectManager {
    constructor() { super(); }
    refresh_objects(objects, basic_m) {
        const object_len = objects.length;
        for (let i = 0; i < object_len; i++) {
            objects[i].refreshParams(basic_m.width, basic_m.height, basic_m.aspect_ratio);
        }
    }
}


class CanvasManager extends RefreshObjects {
    constructor(basic_m) {
        super();
        this.basic_m = basic_m;
        this.objects = [];

        window.addEventListener('resize', {} = () => {
            this.basic_m.refreshCanvas();
            this.basic_m.setPersProjectParam();

            this.basic_m.object_vertices = [];
            this.basic_m.prev_hovered_vertices_array = [];
            this.basic_m.hovered_vertices_array = [];
            this.basic_m.pre_selected_vertices_array = [];
            this.basic_m.selected_vertices_array = [];

            this.refresh_objects(this.objects, basic_m);
        });
    }
}

const basic_manager = new BasicManager();
const compatibilitySettings = new BackwardsCompatibilitySettings();
const grid = new GridObject();
const canvas_manager = new CanvasManager(basic_manager);


console.log(canvas_manager.add().add().value())
























// class Drawlines {
//     constructor(basic_m, num) {
//         this.basic_m = basic_m;
//         this.width = this.basic_m.width;
//         this.height = this.basic_m.height;
//         this.aspectRatio = this.basic_m.aspect_ratio;
//         this.refreshLines(num);
//     }

//     refreshLines(num) {
//         if (this.aspectRatio > 1) {
//             console.log(num)
//             this.numX = Math.round(num * this.aspectRatio);
//             this.numY = num;
//         } else {
//             this.numX = num;
//             this.numY = Math.round(num * (1 / this.aspectRatio));
//         }
//         this.verList = new Int16Array(this.numX + 1);
//         this.horList = new Int16Array(this.numY + 1);
//     }

//     lineMatrixHorizontal(R, ctx, color, lineWidth) { //the horizontal lines
//         let hor = this.numY / R;
//         ctx.beginPath();
//         ctx.moveTo(0, Math.round(this.height / hor));
//         ctx.lineTo(Math.round(this.width), Math.round(this.height / hor));
//         ctx.strokeStyle = color;
//         ctx.lineWidth = lineWidth;
//         ctx.stroke();
//         ctx.closePath();

//         this.horList[R] = Math.round(this.height / hor);
//         return this.horList
//     }

//     showhorList() {
//         return this.horList
//     }

//     lineMatrixVertical(R, ctx, color, lineWidth) { //the vertical lines
//         var ver = this.numX / R;
//         ctx.beginPath();
//         ctx.moveTo(Math.round(this.width / ver), 0);
//         ctx.lineTo(Math.round(this.width / ver), Math.round(this.height));
//         ctx.strokeStyle = color;
//         ctx.lineWidth = lineWidth;
//         ctx.stroke();
//         ctx.closePath();

//         this.verList[R] = Math.round(this.width / ver);
//         return this.verList;
//     }

//     showverList() {
//         return this.verList;
//     }

//     drawLines(ctx, color, lineWidth) { //draws the vertical and horizontal canvas lines

//         for (let R = 0; R <= this.numY; R++) {
//             this.lineMatrixHorizontal(R, ctx, color, lineWidth);
//         }

//         for (let R = 0; R <= this.numX; R++) {
//             this.lineMatrixVertical(R, ctx, color, lineWidth);
//         }

//     }

//     getVertices() {
//         this.vlen = this.verList.length;
//         this.hlen = this.horList.length;
//         this.canvas_grid_vert = new Int16Array(this.hlen * this.vlen * 3);
//         for (let y = 0; y < this.hlen; y++) {
//             for (let x = 0; x < this.vlen; x++) {
//                 const mult = y * this.vlen * 3 + x * 3;
//                 this.canvas_grid_vert[mult] = this.verList[x];
//                 this.canvas_grid_vert[mult + 1] = this.horList[y];
//                 this.canvas_grid_vert[mult + 3] = 0;
//             }
//         }
//     }

//     shadeVertices() {
//         this.getVertices();
//         const a_third_vert_len = this.canvas_grid_vert.length / 3;
//         for (let i = 0; i < a_third_vert_len; i++) {
//             ctx.beginPath();
//             ctx.fillStyle = 'green';
//             ctx.arc(this.canvas_grid_vert[i * 3], this.canvas_grid_vert[i * 3 + 1], 3, 0, 2 * Math.PI, true);
//             ctx.fill();
//             ctx.lineWidth = 1;
//             ctx.strokeStyle = 'black';
//             ctx.stroke();
//             ctx.closePath();
//         }
//     }

//     hoverVertex(x, y) {
//         ctx.beginPath();
//         ctx.fillStyle = 'yellow';
//         ctx.arc(x, y, 3, 0, 2 * Math.PI, true);
//         ctx.fill();
//         ctx.lineWidth = 1;
//         ctx.strokeStyle = 'black';
//         ctx.stroke();
//         ctx.closePath();
//     }

//     unhoverVertex(x, y) {
//         ctx.beginPath();
//         ctx.fillStyle = 'green';
//         ctx.arc(x, y, 3, 0, 2 * Math.PI, true);
//         ctx.fill();
//         ctx.lineWidth = 1;
//         ctx.strokeStyle = 'black';
//         ctx.stroke();
//         ctx.closePath();
//     }

//     selectVertex(x, y) {
//         ctx.beginPath();
//         ctx.fillStyle = 'brown';
//         ctx.arc(x, y, 3, 0, 2 * Math.PI, true);
//         ctx.fill();
//         ctx.lineWidth = 1;
//         ctx.strokeStyle = 'black';
//         ctx.stroke();
//         ctx.closePath();
//     }

//     unselectVertex(x, y) {
//         ctx.beginPath();
//         ctx.fillStyle = 'green';
//         ctx.arc(x, y, 3, 0, 2 * Math.PI, true);
//         ctx.fill();
//         ctx.lineWidth = 1;
//         ctx.strokeStyle = 'black';
//         ctx.stroke();
//         ctx.closePath();
//     }
// }


// class Grid extends Drawlines {
//     constructor(num) {
//         super(num);
//         this.drawLines(ctx, 'blue', 2);
//         this.shadeVertices();
//     }
// }

// class Select extends Grid {
//     constructor(basic_m, num = 10) {
//         super(basic_m, num = 10);
//         this.basic_m = basic_m

//         this.prev_hovered_vertices_array = [];
//         this.hovered_vertices_array = [];
//         this.pre_selected_vertices_array = [];
//         this.selected_vertices_array = [];

//         canvas.addEventListener("mousemove", (event) => this.pick(event, hovered));
//         canvas.addEventListener("click", (event) => this.pick(event, selected));
//         canvas.addEventListener("click", (event) => this.select(event));

//         this.basic_m.refresh();
//         this.basic_m.setPersProjectParam();
//         this.refreshLines(num);
//         this.drawLines(ctx, 'blue', 2)
//         this.shadeVertices();

//         window.addEventListener('resize', {} = () => {
//             this.basic_m.refresh();
//             this.basic_m.setPersProjectParam();
//             this.refreshLines(num);
//             this.drawLines(ctx, 'blue', 2)
//             this.shadeVertices();

//             this.prev_hovered_vertices_array = [];
//             this.hovered_vertices_array = [];
//             this.pre_selected_vertices_array = [];
//             this.selected_vertices_array = [];
//         });

//         const grid_vert_len = this.canvas_grid_vert.length;
//         this.screen_grid_vert = new Int16Array(grid_vert_len);
//         this.world_grid_vert = new Float32Array(grid_vert_len);

//     }

//     validity(x, y) {
//         var found = false;
//         var s_val = 0;
//         const half_len = this.selected_vertices_array.length / 2;

//         for (let s = 0; s < half_len; s++) {
//             const s_x = this.selected_vertices_array[s * 2];
//             const s_y = this.selected_vertices_array[s * 2 + 1];

//             if (s_x === x && s_y === y) {
//                 found = true;
//                 s_val = s;
//             }
//         }
//         return [found, s_val];
//     }

//     select(event) {
//         const bounding = canvas.getBoundingClientRect();
//         const x = event.clientX - bounding.left;
//         const y = event.clientY - bounding.top;

//         this.pre_selected_vertices_array = this.basic_m.hoveredVertices(x, y, this.canvas_grid_vert, this.vlen, this.hlen, 3, 5);

//         const half_selected_vertices_len = this.selected_vertices_array.length / 2;
//         const half_pre_selected_vertices_len = this.pre_selected_vertices_array.length / 2;

//         for (let p = 0; p < half_pre_selected_vertices_len; p++) {
//             const p_x = this.pre_selected_vertices_array[p * 2];
//             const p_y = this.pre_selected_vertices_array[p * 2 + 1];

//             const [found, s_val] = this.validity(p_x, p_y);

//             if (found === true) {
//                 const first_part = this.selected_vertices_array.slice(0, (s_val * 2));
//                 const second_part = this.selected_vertices_array.slice((s_val * 2) + 2);
//                 this.selected_vertices_array = [...first_part, ...second_part];

//                 this.unselectVertex(p_x, p_y);
//                 this.pick(event, hovered);
//             } else {
//                 this.selected_vertices_array.push(...[p_x, p_y]);

//                 this.selectVertex(p_x, p_y);
//             }
//         }
//     }

//     pick(event, destination) {
//         const bounding = canvas.getBoundingClientRect();
//         const x = event.clientX - bounding.left;
//         const y = event.clientY - bounding.top;

//         const pixel = ctx.getImageData(x, y, 1, 1);
//         const data = pixel.data;

//         const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
//         destination.color.innerHTML = rgba;
//         destination.pixel.innerHTML = `(${x},${y})`;

//         const prev_half_len = this.prev_hovered_vertices_array.length / 2;

//         this.hovered_vertices_array = this.basic_m.hoveredVertices(x, y, this.canvas_grid_vert, this.vlen, this.hlen, 3, 200);
//         const half_len = this.hovered_vertices_array.length / 2;

//         const half_selected_vertices_len = this.selected_vertices_array.length;

//         for (let i = 0; i < prev_half_len; i++) {
//             const xval = this.prev_hovered_vertices_array[i * 2];
//             const yval = this.prev_hovered_vertices_array[i * 2 + 1];

//             const [found, s_val] = this.validity(xval, yval);

//             if (found === false) this.unhoverVertex(xval, yval);
//         }

//         for (let i = 0; i < half_len; i++) {
//             const xval = this.hovered_vertices_array[i * 2];
//             const yval = this.hovered_vertices_array[i * 2 + 1];

//             const [found, s_val] = this.validity(xval, yval);

//             if (found === false) this.hoverVertex(xval, yval);
//         }

//         this.prev_hovered_vertices_array = this.hovered_vertices_array;

//         return rgba;
//     }
// }

// var select = new Select(basic_manager);