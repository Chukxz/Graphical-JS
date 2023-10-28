class Misc {

    deepCopy(val) {
        var res = JSON.parse(JSON.stringify(val))
        if (typeof structuredClone === "function") {
            res = structuredClone(val);
        }
        return res;
    }
    getParamAsList(maxPLen, paramList) { //Function is memoized to increase perfomance
        if (arguments.length === 2) {
            const key = `${paramList}-${maxPLen}`;

            if (pListCache[key] !== undefined) {
                return pListCache[key];
            }

            var count = 0;
            var compParamList = [];
            for (let i of paramList) {

                if (i < maxPLen) {
                    compParamList[count] = i;
                    count++;
                }
            }

            pListCache[key] = compParamList;

            return compParamList;
        }
    }

    getParamAsArg(maxPLen = Infinity, ...args) { //Function is memoized to increase perfomance
        const key = `${args}-${maxPLen}`;

        if (pArgCache[key] !== undefined) {
            return pArgCache[key]
        }

        if (arguments.length > 1 && arguments.length <= 4) {
            var start = 0;
            var end = maxPLen;
            var interval = 1;
            if (arguments.length === 2) {
                if (arguments[1] !== undefined) {
                    end = Math.min(arguments[1], maxPLen);
                } else {
                    end = maxPLen;
                }
            } else {
                start = arguments[1] || 0;
                if (arguments[1] !== undefined) {
                    end = Math.min(arguments[2], maxPLen);
                } else {
                    end = maxPLen;
                }
                interval = arguments[3] || 1;
            }

            var count = 0;
            var index = 0;
            var compParamList = [];

            for (let i = start; i < end; i++) {
                index = start + (count * interval);

                if (index < end) {
                    compParamList[count] = index;
                    count++;
                }
            }

            pArgCache[key] = compParamList;
            return compParamList;
        }
    }

    getSlope(A_, B_) {
        var numer = B_[0][0] - A_[0][0];
        var denum = B_[1][0] - A_[1][0];

        return numer / denum;
    }

    getMid(a, b, paramList) {
        var ret = arrOp.createArrayFromArgs(2, 1);
        var count = 0;
        for (let val of paramList) {
            ret[count][0] = (a[val][0] + b[val][0]) / 2;
            count++;
        }
        return ret;
    }

    getDist(a, b, paramList) {
        var ret = 0;
        const pLen = paramList.length;
        for (let val = 0; val < pLen; val++) {
            ret += (a[val] - b[val]) ** 2;
        }
        return Math.sqrt(ret);
    }

    getTriArea(a, b, c) {
        var S = (a + b + c) / 2;
        return Math.sqrt(S * (S - a) * (S - b) * (S - c));
    }
}



// We implement a function closure here by binding the variable 'implementDrag'
// to a local function and invoking the local function, this ensures that we have
// some sort of private variables
var implementDrag = (function() {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0,
        prev = 0,
        now = Date.now(),
        dt = now - prev + 1,
        dX = 0,
        dY = 0,
        sens = 10,

        // We invoke the local functions (changeSens and startDrag) as methods
        // of the object 'retObject' and set the return value of the local function
        // to 'retObject'

        retObject = {
            change: changeSens,
            start: drag
        };

    function changeSens(value) {
        sens = value;
    }

    function drag(element) {
        if (navigator.userAgentData.mobile === true) {
            return startDragMobile(element);
        } else {
            return startDrag(element);
        }
    }

    function startDrag(element) {
        element.onmousedown = dragMouseDown;
    }

    function startDragMobile(element) {
        element.addEventListener('touchstart', dragTouchstart, { 'passive': true });
    }

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();

        pos3 = e.clientX;
        pos4 = e.clientY;

        document.onmouseup = dragMouseup;
        document.onmousemove = dragMousemove;
    }

    function dragTouchstart(e) {
        e = e || window.event;

        pos3 = e.touches[0].clientX;
        pos4 = e.touches[0].clientY;

        document.addEventListener('touchend', dragTouchend, { 'passive': true });
        document.addEventListener('touchmove', dragTouchmove, { 'passive': true });
    }

    function dragMousemove(e) {
        e = e || window.event;
        e.preventDefault();

        pos1 = e.clientX - pos3;
        pos2 = e.clientY - pos4;
        pos3 = e.clientX;
        pos4 = e.clientY;

        dX = pos1 / dt;
        dY = pos1 / dt;

        prev = now;
        now = Date.now();
        dt = now - prev + 1;

        console.log(`X: ${dX*sens}`);
        console.log(`Y: ${dY*sens}`);
    }

    function dragTouchmove(e) {
        e = e || window.event;

        pos1 = e.touches[0].clientX - pos3;
        pos2 = e.touches[0].clientY - pos4;
        pos3 = e.touches[0].clientX;
        pos4 = e.touches[0].clientY;

        dX = pos1 / dt;
        dY = pos1 / dt;

        prev = now;
        now = Date.now();
        dt = now - prev + 1;


        console.log(`X: ${dX*sens}`);
        console.log(`Y: ${dY*sens}`);
    }

    function dragMouseup() {
        document.onmouseup = null;
        document.onmousemove = null;
        console.log(sens);
    }

    function dragTouchend() {
        document.addEventListener('touchend', null, { 'passive': true });
        document.addEventListener('touchmove', null, { 'passive': true });
        console.log(sens)
    }

    return retObject;
})()

class ArrOp extends Misc {
    constructor() {
        super();
        this.inc = -1;
        this.passArr = [];
    }

    createArrayFromArgs(length) {
        var arr = new Array(length || 0),
            i = length;

        if (arguments.length > 1) {
            var args = Array.prototype.slice.call(arguments, 1);
            while (i--) {
                arr[length - 1 - i] = this.createArrayFromArgs.apply(this, args);
            }
        }
        return arr;
    }

    createArrayFromList(param) {
        var arr = new Array(param[0] || 0),
            i = param[0];

        if (param.length > 1) {
            var args = Array.prototype.slice.call(param, 1);
            while (i--) {
                arr[param[0] - 1 - i] = this.createArrayFromArgs.apply(this, args);
            }
        }
        return arr;
    }

    modArr(arr) {
        const retArr = [];
        const arrlen = arr.length
        for (let i = 0; i < arrlen; i++) {
            retArr.push([arr[i]]);
        }
        return retArr;
    }

    homoVec(arr) {
        // Converts the array to a nx1 matrix that is equivalent to a homogenous vector
        var shape = this.getShape(arr),
            ret = this.createArrayFromArgs(shape[0] + 1, 1);
        if (shape.length < 2) {
            for (let index in arr) {
                ret[index] = [arr[index]];
            }
            ret[shape[0] - 1][0] = ret[shape[0] - 1][0] * this.handedness;
            ret[shape[0]] = [1];
            return ret;
        } else {
            return arr;
        }
    }

    toVec(arr) {
        // Converts the array to a nx1 matrix that is equivalent to a homogenous vector
        var shape = this.getShape(arr),
            ret = this.createArrayFromArgs(shape[0], 1);
        if (shape.length < 2) {
            for (let index in arr) {
                ret[index] = [arr[index]];
            }
            ret[shape[0] - 1][0] = ret[shape[0] - 1][0] * this.handedness;
            return ret;
        } else {
            return arr;
        }
    }

    isVec(arr) {
        var shape = this.getShape(arr);
        var ret = true;
        if (shape.length === 2) {
            for (let i in arr) {
                if (arr[i].length === 1) {
                    ret = true;
                } else ret = false;
            }
        } else ret = false;

        return ret;
    }

    isHomoVec(arr) {
        //Checks if it is a 1X4 or 4X1 homogenous vector with dimension of 2
        var testArr = this.getShape(arr);
        if (
            (testArr.length === 2) && //Checks if the dimensions of the vector are equal to 2

            ( // and if it is (case (A) or case (B))

                (testArr[0] === 1 && testArr[1] === 4) || //Checks if is a 1X4 matrix  case (A)
                (testArr[0] === 4 && testArr[1] === 1) //Checks if is a 4X1 matrix     case (B)
            )) {
            return true;
        } else return false;
    }

    homoVecEqRow(arr1, arr2, n) {
        //Works for 1xn homogenous vectors
        var ret = true;
        for (let i = 0; i < n; i++) {
            if (arr1[0][i] !== arr2[0][i]) {
                ret = false;
            }
        }
        return ret;
    }

    homoVecEqCol(arr1, arr2, n) {
        //Works for nxl homogenous vectors
        var ret = true;
        for (let i = 0; i < n; i++) {
            if (arr1[i][0] !== arr2[i][0]) {
                ret = false;
            }
        }
        return ret;
    }

    unmodArr(arr) {
        return arr.flat(1);
    }
    retShape(arr) {
        if (typeof arr[0] !== "undefined") {
            if (arr.length !== "undefined") {
                this.inc += 1;
                this.passArr[this.inc] = arr.length;
                this.retShape(arr[0]);
            }
        }
    }

    getShape(arr) {
        this.retShape(arr);
        var retArr = [];
        retArr.push(this.passArr)
        retArr = retArr[0];
        this.passArr = [];
        this.inc = -1;
        return retArr;
    }
}

class DrawCanvas extends ArrOp {


    initDepthBuffer() {
        const elements = Math.ceil(this.canvH * this.canvW);
        this.depthBuffer = this.createArrayFromArgs(elements);
        this.resetDepthBuffer();
    }

    resetDepthBuffer() {
        this.depthBuffer.fill(MAX_DEPTH)
    }

    initFrameBuffer() {
        const elements = Math.ceil(this.canvH * this.canvW);
        this.frameBuffer = this.createArrayFromArgs(elements);
        this.resetFrameBuffer();
    }

    resetFrameBuffer() {
        this.frameBuffer.fill([0, 0, 0, 255])
    }

    initCanvas() {
        this.ocanvas.width = this.canvW;
        this.ocanvas.height = this.canvH;
        this.canvas.style.borderStyle = this.bordStyle;
        this.canvas.style.borderWidth = `${this.bordW}px`;
        this.canvas.style.borderColor = this.color;
        this.canvas.style.opacity = this.opacity;
        this.canvas.width = this.canvW;
        this.canvas.height = this.canvH;
    }
}


class menuBar {
    constructor(Sett) {
        this.Sett = Sett;
    }

    runMenuBar() {

    }
}

class TransfMat extends DrawCanvas {

    isMatrix(matIn) {
        var shape = this.getShape(matIn);

        if (shape.length <= 2) {
            return true;
        } else { return false; }
    }

    changeMode(mode) {
        this.mode = mode;
        return this;
    }

    runmode(angle) {
        if (this.mode === "deg") {
            return (Math.PI / 180) * angle;
        } else if (this.mode === "rad") {
            return angle;
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
        return [
            [1, 0, 0, 0],
            [0, Math.cos(angle), -Math.sin(angle) * this.handedness, 0],
            [0, Math.sin(angle) * this.handedness, Math.cos(angle), 0],
            [0, 0, 0, 1]
        ];
    }

    // Yaw
    rotY(ang) {
        const angle = this.runmode(ang)
        return [
            [Math.cos(angle), 0, Math.sin(angle) * this.handedness, 0],
            [0, 1, 0, 0],
            [-Math.sin(angle) * this.handedness, 0, Math.cos(angle), 0],
            [0, 0, 0, 1]
        ];
    }

    //Roll
    rotZ(ang) {
        const angle = this.runmode(ang)
        return [
            [Math.cos(angle), -Math.sin(angle) * this.handedness, 0, 0],
            [Math.sin(angle) * this.handedness, Math.cos(angle), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
    }

    rot3d(x, y, z) {
        return this.matMult(this.rotZ(z), this.matMult(this.rotY(y), this.rotX(x)))
    };

    translMat2d(x, y) {
        return [
            [1, 0, x],
            [0, 1, y],
            [0, 0, 1]
        ]
    };

    transl3d(x, y, z) {
        return [
            [1, 0, 0, x],
            [0, 1, 0, y],
            [0, 0, 1, z],
            [0, 0, 0, 1]
        ];
    }

    scale3dim(x, y, z) {
        return [
            [x, 0, 0, 0],
            [0, y, 0, 0],
            [0, 0, z, 0],
            [0, 0, 0, 1]
        ];
    }

    refMat2d(param) {
        if (param == "x") {
            return [
                [1, 0, 0],
                [0, -1, 0],
                [0, 0, 1]
            ];
        }
        if (param == "y") {
            return [
                [-1, 0, 0],
                [0, 1, 0],
                [0, 0, 1]
            ];
        }
        if (param == "y=x") {
            return [
                [0, 1, 0],
                [1, 0, 0],
                [0, 0, 1]
            ];
        }
        if (param == "y=-x") {
            return [
                [0, -1, 0],
                [-1, 0, 0],
                [0, 0, 1]
            ];
        }
        if (param == "o") {
            return [
                [-1, 0, 0],
                [0, -1, 0],
                [0, 0, 1]
            ];
        } else return [
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ];
    }

    scaleMat2d(x, y) {
        return [
            [x, 0, 0],
            [0, y, 0],
            [0, 0, 1]
        ];
    }

    shearMat(angle, x, y) {
        angle = this.runmode(angle)
        return [
            [1, Math.tan(angle), 0],
            [Math.tan(angle), 1, 0],
            [0, 0, 1]
        ];
    }

    setObjTransfMat(Sx, Sy, Sz, Rx, Ry, Rz, Tx, Ty, Tz) {
        // None of the scale parameters should equal zero as that would make the determinant of the matrix
        // equal to zero, thereby making it impossible to get the inverse of the matrix (Zero Division Error)
        if (Sx === 0) {
            Sx += 0.01;
        }
        if (Sy === 0) {
            Sy += 0.01;
        }
        if (Sz === 0) {
            Sz += 0.01;
        }
        this.objTransfMat = this.matMult(this.transl3d(Tx, Ty, Tz), this.matMult(this.rot3d(Rx, Ry, Rz), this.scale3dim(Sx, Sy, Sz)));
    }

    matMult(matA, matB) {
        // Checks if both are matrices
        if (this.isMatrix(matA) && this.isMatrix(matB)) {
            var shapeA = this.getShape(matA),
                shapeB = this.getShape(matB),
                matC = this.createArrayFromArgs(shapeA[0], shapeB[1]);

            // Checks if both matrices are of the form:let  and rxn
            if ((shapeA[1] == shapeB[0]) && shapeA[1] > 0) {
                for (let i = 0; i < shapeA[0]; i++) {
                    for (let j = 0; j < shapeB[1]; j++) {
                        var sum = 0;
                        for (let k = 0; k < shapeB[0]; k++) {
                            sum += matA[i][k] * matB[k][j];
                        }
                        matC[i][j] = sum;
                    }
                }
            }
            return matC;
        } else return [];
    }

    scaMult(scalarVal, matIn, leaveLast = false) {
        // Checks if the 'input matrix' is actually a matrix
        if (this.isMatrix(matIn)) {
            var shape = this.getShape(matIn),
                matOut = this.createArrayFromList(shape);
            for (let i = 0; i < shape[0]; i++) {
                for (let j = 0; j < shape[1]; j++) {
                    if (i === shape[0] - 1 && j === shape[1] - 1 && leaveLast === true) {
                        // Do nothing...don't multiply the last matrix value by the scalar value
                        // useful when perspective divide is going on.
                    } else {
                        matOut[i][j] = matIn[i][j] * scalarVal;
                    }
                }
            }
            return matOut
        } else return [];
    }

    scaMult2(scalarVal, matIn, leaveLast = false) {
        // Checks if the 'input matrix' is actually a matrix
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
        return matOut
    }

    addSub(matA, matB) {
        // Checks if both are matrices
        if (this.isMatrix(matA) && this.isMatrix(matB)) {
            var shapeA = this.getShape(matA),
                shapeB = this.getShape(matB);
            // Checks if both matrices have the same size

            var matC = this.createArrayFromList(shapeA);
            for (let i = 0; i < shapeA[0]; i++) {
                for (let j = 0; j < shapeB[1]; j++) {
                    matC[i][j] = matA[i][j] + matB[i][j];
                }
            }
            return matC;
        } else return [];
    }

    addSub2(matA, matB) {
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

    verifySquare(matIn) {
        //Checks if it is a matrix
        if (this.isMatrix(matIn)) {
            var shapeMat = this.getShape(matIn);
            // Checks if it is a square matrix
            if (shapeMat[0] === shapeMat[1]) {
                return true;
            } else return false;
        } else return false;
    }

    transposeMat(matIn) {
        //Check if it is a matrix
        if (this.isMatrix(matIn)) {
            var shapeMat = this.getShape(matIn),
                matOut = this.createArrayFromArgs(shapeMat[1], shapeMat[0]);

            for (let i = 0; i < shapeMat[0]; i++) {
                for (let j = 0; j < shapeMat[1]; j++) {
                    matOut[j][i] = matIn[i][j];
                }
            }
            return matOut;
        } else return [];
    }

    identityMat(val) {
        var num = 0
        if (typeof val === "object") {
            //Checks if it is a square matrix
            if (this.verifySquare(val) === true) {
                num = this.getShape(val)[0];
            } else return [];
        } else {
            num = val;
        }
        var idMat = this.createArrayFromArgs(num, num),
            counter = 0;

        for (let i = 0; i < num; i++) {
            for (let j = 0; j < num; j++) {
                if (j === counter) {
                    idMat[i][j] = 1;
                } else {
                    idMat[i][j] = 0;
                }
            }
            counter++
        }
        return idMat
    }

    getRest(matIn, shape, a, b) {
        //Checks if it is a matrix
        if (this.verifySquare(matIn)) {
            var resMat = this.createArrayFromArgs(shape - 1, shape - 1)
            if (a < shape && b < shape) {
                for (let i in matIn) {
                    for (let j in matIn) {
                        if (Number(i) !== a && Number(j) !== b) {
                            var x = i,
                                y = j;

                            if (i > a) {
                                x = i - 1;
                            }

                            if (j > b) {
                                y = j - 1;
                            }
                            resMat[x][y] = matIn[i][j];
                        }
                    }
                }
                return resMat;
            } else return [];
        } else return [];
    }

    getDet(matInmode = "row", index = 0) {
        const shapeMat = [shape, shape];
        if (index < shapeMat[0]) {
            // If it is a 1x1 matrix, return the matrix
            if (shapeMat[0] === 1) {
                return matIn;
            }
            // If it is a 2x2 matrix, return the determinant
            if (shapeMat[0] === 2) {
                return ((matIn[0][0] * matIn[1][1]) - (matIn[0][1] * matIn[1][0]));
            }
            // If it an nxn matrix, where n > 2, recursively compute the determinant,
            //using the first row of the matrix
            else {
                var res = 0,
                    cofMatSgn = this.getCofSgn(matIn),
                    storeCof = this.createArrayFromArgs(shapeMat[0], 1),
                    tmp = this.createArrayFromArgs(shapeMat[0], 1),
                    a = 0,
                    b = 0;

                if (mode === "column") {
                    b = index;
                    for (let i in matIn) {
                        tmp[i] = matIn[i][index];
                        storeCof[i] = cofMatSgn[i][index];
                    }
                    for (let i in cofMatSgn) {
                        var ret = this.getRest(matIn, shapeMat[0], Number(i), b)
                        ''
                        res += (storeCof[i] * tmp[i] * this.getDet(ret, shape, mode, index));
                    }
                } else {
                    a = index;
                    tmp = matIn[index];
                    storeCof = cofMatSgn[index];
                    for (let i in cofMatSgn) {
                        var ret = this.getRest(matIn, shapeMat[0], a, Number(i));
                        res += (storeCof[i] * tmp[i] * this.getDet(ret, shape, mode, index));
                    }
                }
                return res;
            }
        } else return [];
    }

    getMinor(matIn) {
        //Checks if it is a matrix and verify if it is a square matrix
        if (this.verifySquare(matIn)) {
            var shapeMat = this.getShape(matIn),
                matOut = this.createArrayFromList(shapeMat);

            for (let i = 0; i < shapeMat[0]; i++) {
                for (let j = 0; j < shapeMat[1]; j++) {
                    matOut[i][j] = this.getDet(this.getRest(matIn, shapeMat[0], i, j))
                }
            }
            return matOut;
        } else return [];
    }

    getCofSgn(matIn) {
        //Checks if it is a matrix
        if (this.isMatrix(matIn)) {
            var shapeMat = this.getShape(matIn),
                matOut = this.createArrayFromList(shapeMat);

            for (let i = 0; i < shapeMat[0]; i++) {
                for (let j = 0; j < shapeMat[1]; j++) {
                    if ((i + j) % 2 === 0) {
                        matOut[i][j] = 1;
                    } else {
                        matOut[i][j] = -1;
                    }
                }
            }
            return matOut;
        } else return [];
    }

    getCof(matIn) {
        //Checks if it is a matrix and verify if it is a square matrix
        if (this.verifySquare(matIn)) {
            var shapeMat = this.getShape(matIn),
                matOut = this.createArrayFromList(shapeMat),
                cofMatSgn = this.getCofSgn(matIn),
                minorMat = this.getMinor(matIn);

            for (let i = 0; i < shapeMat[0]; i++) {
                for (let j = 0; j < shapeMat[1]; j++) {
                    matOut[i][j] = cofMatSgn[i][j] * minorMat[i][j];
                }
            }
            return matOut;
        } else return [];
    }

    getAdj(matIn) {
        return this.transposeMat(this.getCof(matIn));
    }

    getInvMat(matIn) {
        return this.scaMult(1 / (this.getDet(matIn)), this.getAdj(matIn));
    }
}


const trans = new TransfMat()


const Cp = [
    [0, 28, 83, 57],
    [19, 96, 45, 76],
    [56, 97, 25, 97],
    [25, 98, 27, 42]
]


// console.log(Cp)
// const start = Date.now();
// const val = 4;
// // const num = (5) + ((3 * 3 * 2) + (3 * 3 * 1)) * 1e5;
// const num = 1;
// for (let i = 0; i < num; i++) {
//     trans.getMinor(Cp);
// }
// const end = Date.now();
// const res = trans.getMinor(Cp);
// const final = Date.now();
// console.log(res);
// const last = Date.now();

// console.log(`Time taken to run loop of ${num} element(s): ${(end-start)/1000}second(s)`);
// console.log(`Time taken to run: ${(final-end)/1000}second(s)`);
// console.log(`Time taken to print: ${(last-final)/1000}second(s)`);


class SetHalfEdges {
    constructor(vertex_indexes) {
        this.HalfEdgeDict = {};
        this.vert_len = vertex_indexes.length;
        this.vert_array = vertex_indexes;
        this.triangle = [];
        this.last = null;


        for (let i = 0; i < this.vert_len; i++) {
            this.setHalfEdge(i);
        }

        console.log(this.last)

        delete this.HalfEdgeDict[`${this.last}-null`];

        return this;
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

        this.HalfEdgeDict[halfEdgeKey] = this.halfEdge(vert_1, vert_2);

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
        }
    }
}

const indexBuffer = [0, 1, 2, 0, 3, 1, 0, 2, 4, 0];

let half = new SetHalfEdges(indexBuffer);

console.log(half.HalfEdgeDict);