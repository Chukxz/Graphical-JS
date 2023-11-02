(function() {
    const MAX_DEPTH = Infinity;

    const pListCache = {};
    const pArgCache = {};

    var prevW = 0;
    var prevH = 0;
    var speed = 0;
    var prev = Date.now()

    //{ willReadFrequently: true }
    const body = document.getElementsByTagName("body");
    const ocanvas = document.createElement("canvas");
    const octx = ocanvas.getContext("2d");
    const canvas = document.getElementsByTagName("canvas")[0];
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    const menu = document.getElementById("menu");
    const inputs = document.getElementsByTagName("input");

    const ratio = document.getElementById('ratio');

    ratio.innerHTML = window.devicePixelRatio;


    const hovered = { color: document.getElementById("hoveredColor"), pixel: document.getElementById("hoveredPixel") };
    const selected = { color: document.getElementById("selectedColor"), pixel: document.getElementById("selectedPixel") };

    var brotX = document.getElementById("rotx");
    var brotY = document.getElementById("roty");
    var brotZ = document.getElementById("rotz");
    var btransX = document.getElementById("transx");
    var btransY = document.getElementById("transy");
    var btransZ = document.getElementById("transz");
    var bscaleX = document.getElementById("scalex");
    var bscaleY = document.getElementById("scaley");
    var bscaleZ = document.getElementById("scalez");
    var bangle = document.getElementById("angle");
    var bnearZ = document.getElementById("nearz");
    var bfarZ = document.getElementById("farz");
    var save = document.getElementById("save");

    //Default values

    var brX = 0,
        brY = 10,
        brZ = 0,
        btX = 0,
        btY = 0,
        btZ = 0,
        bSx = 1,
        bSy = 50,
        bSz = 1,
        bAng = 90,
        bNz = 0.1,
        bFz = 50;

    function setInputValue() {
        brotX.value = brX;
        brotY.value = brY;
        brotZ.value = brZ;
        btransX.value = btX;
        btransY.value = btY;
        btransZ.value = btZ;
        bscaleX.value = bSx;
        bscaleY.value = bSy;
        bscaleZ.value = bSz;
        bangle.value = bAng;
        bnearZ.value = bNz;
        bfarZ.value = bFz;
    }

    setInputValue();


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

    class Settings {
        constructor(canvas, ocanvas, menu) {
            this.canvas = canvas;
            this.ocanvas = ocanvas;
            this.menu = menu;
            this.mCol = "gray";
            this.color = 'black';
            this.bordStyle = 'solid';
            this.opacity = 1;
            this.aspectRatio = 1;
            this.deviceRatio = window.devicePixelRatio;
            this.handedness = 1; // default
        }

        setHandedness(value) {
            if (value === 'left') {
                this.handedness = -1;
            } else this.handedness = 1; //default
        }

        runSettings() {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.bordW = 1;
            this.menu.style.position = "absolute";
            this.menu.style.backgroundColor = this.mCol;

            if (this.width >= 600 && this.width < 768) {
                this.canvW = this.width - 150;
                this.canvH = this.height - 40;
                this.menu.style.top = `${this.canvas.offsetTop}px`;
                this.menu.style.right = `${this.canvas.offsetLeft}px`;
                this.menu.style.width = `${this.width - this.canvW - 18}px`;
                this.menu.style.height = `${this.canvH+2}px`;
            } else if (this.width >= 768) {
                this.canvW = this.width - 300;
                this.canvH = this.height - 40;
                this.menu.style.top = `${this.canvas.offsetTop}px`;
                this.menu.style.right = `${this.canvas.offsetLeft}px`;
                this.menu.style.width = `${this.width - this.canvW - 18}px`;
                this.menu.style.height = `${this.canvH+2}px`;
            } else {
                this.canvW = this.width - 20;
                this.canvH = this.height / 2;
                this.menu.style.top = `${this.canvas.offsetTop+2+this.canvH}px`;
                this.menu.style.right = `${this.canvas.offsetLeft + 2}px`;
                this.menu.style.width = `${this.width-18}px`;
                this.menu.style.height = `${this.height-this.canvH-40}px`;
            }

            this.aspectRatio = this.canvW / this.canvH;
            return this;
        }
    }

    class Misc extends Settings {
        constructor(canvas, ocanvas, menu) {
            super(canvas, ocanvas, menu);
        }
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


    //CHECK IF DEVICE IS A MOBILE DEVICE OR NOT--3

    details = navigator.userAgentData;

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
        constructor(canvas, ocanvas, menu) {
            super(canvas, ocanvas, menu);
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
        constructor(canvas, ocanvas, menu) {
            super(canvas, ocanvas, menu);
        }

        initDepthBuffer() {
            const elements = Math.ceil(this.canvH * this.canvW);
            this.depthBuffer = this.createArrayFromArgs(elements);
            this.reseTDepthBuffer();
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
        constructor(canvas, ocanvas, menu) {
            super(canvas, ocanvas, menu);
            this.mode = "deg";
        }

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
                console.log(matC)
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

        getDet(matIn, mode = "row", index = 0) {
            //Checks if it is a matrix and verify if it is a square matrix
            if (this.verifySquare(matIn)) {
                var shapeMat = this.getShape(matIn);
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
                                res += (storeCof[i] * tmp[i] * this.getDet(ret, mode, index));
                            }
                        } else {
                            a = index;
                            tmp = matIn[index];
                            storeCof = cofMatSgn[index];
                            for (let i in cofMatSgn) {
                                var ret = this.getRest(matIn, shapeMat[0], a, Number(i));
                                res += (storeCof[i] * tmp[i] * this.getDet(ret, mode, index));
                            }
                        }
                        return res;
                    }
                } else return [];
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

    class VecOp extends TransfMat {
        constructor(canvas, ocanvas, menu) {
            super(canvas, ocanvas, menu);
        }
        mag(vec, len = null) {
            //verify first that it is a vector
            var
                shape = this.getShape(vec),
                sLen = shape.length,
                valid = false;

            if (shape[1] === 1 && shape[0] > 1) {
                valid = true;
            }

            if (sLen === 2 && valid === true) {
                var magnitude = 0;

                if (typeof len === "number") {
                    if (len <= shape[0]) {
                        shape[0] = len;
                    }
                }

                for (let i = 0; i < shape[0]; i++) {
                    magnitude += vec[i][0] ** 2
                }
                return Math.sqrt(magnitude);
            } else return null;
        }

        normalizeVec(vec, len = null) {
            var magnitude = mag(vec, len);

            if (typeof magnitude === "number") {
                if (typeof len === "number") {
                    var ret = this.createArrayFromArgs(len, 1);
                    for (let i = 0; i < len; i++) {
                        ret[i][0] = vec[i][0];
                    }
                } else {
                    var ret = vec;
                }
                return this.scaMult(1 / magnitude, ret);
            } else return null;
        }

        dotProduct(deg = null, len = null, ...vecs) {
            return this.runDotProduct(deg, len, vecs);
        }

        runDotProduct(deg = null, len = null, vecs) {
            //verify first that both vectors are of the same size
            var
                fshapeMat = this.getShape(vecs[0]),
                fsLen = fshapeMat.length,
                valid = false,
                offset = 0,
                numValid = 0

            if (typeof len === "number") {
                if (len <= fshapeMat[0]) {
                    offset = fshapeMat[0] - len;
                }
            }

            fshapeMat[0] = fshapeMat[0] - offset;

            if (fsLen === 2 && fshapeMat[1] === 1 && vecs.length > 1) {
                for (let i = 0; i < vecs.length; i++) {
                    let shapeMat = this.getShape(vecs[i]),
                        sLen = shapeMat.length;

                    shapeMat[0] = shapeMat[0] - offset;

                    if (shapeMat[0] === fshapeMat[0] && shapeMat[1] === fshapeMat[1] && sLen === 2) {
                        numValid += 1;
                    } else {
                        numValid -= 1;
                    }
                }

                if (numValid === vecs.length) {
                    valid = true;
                }

                if (valid === true) {
                    if (typeof deg === "number") {
                        var magnitude = 1,
                            degToRad = (deg * Math.PI) / 180,
                            cosAng = Math.cos(degToRad)
                        for (let i = 0; i < vecN; i++) {
                            magnitude *= mag(vecs[i], fshapeMat[0]);
                        }
                        return magnitude * cosAng;
                    } else {
                        var ret = 0,
                            cRet = 1;
                        for (let i = 0; i < fshapeMat[0]; i++) {
                            for (let j = 0; j < vecs.length; j++) {
                                cRet *= vecs[j][i][0];
                            }
                            ret += cRet;
                            cRet = 1;
                        }
                        return ret;
                    }
                } else return null;
            } else return null;
        }

        getDotPAngle(len = null, ...vecs) {
            var
                dotP = this.runDotProduct(null, len, vecs),
                magRes = 1;

            for (let i in vecs) {
                magRes *= this.mag(vecs[i], len);
            }

            if (typeof dotP === "number") {
                var cosAng = Math.asin(dotP / magRes);

                return (cosAng * 180) / Math.PI;
            } else return null;
        }

        getCrossPVec(shape, vecN, ...vecs) {
            //Checks if it is a matrix and verify if it is a square matrix
            var matIn = this.identityMat(shape)
            if (this.verifySquare(matIn)) {
                for (let i = 0; i < vecN; i++) {
                    for (let j = 0; j < shape; j++) {
                        matIn[i + 1][j] = vecs[0][i][j][0];
                    }
                }

                var
                    vecOut = this.createArrayFromArgs(shape, 1),
                    cofMatSgn = this.getCofSgn(matIn),
                    storeCof = cofMatSgn[0],
                    a = 0;

                for (let i in cofMatSgn) {
                    var ret = this.getRest(matIn, shape, a, Number(i));
                    vecOut[i][0] = (storeCof[i] * this.getDet(ret));
                }
                return vecOut;
            } else return null;
        }

        crossProduct(deg = null, len = null, ...vecs) {
            return this.runCrossProduct(deg, len, vecs);
        }

        runCrossProduct(deg = null, len = null, vecs) {
            //verify first that both vectors are of the same size
            var
                fshapeMat = this.getShape(vecs[0]),
                vecN = fshapeMat[0] - 1,
                fsLen = fshapeMat.length,
                valid = false,
                offset = 0,
                numValid = 0

            if (typeof len === "number") {
                if (len <= fshapeMat[0]) {
                    offset = fshapeMat[0] - len
                }
            }

            vecN = vecN - offset
            fshapeMat[0] = fshapeMat[0] - offset

            if (fsLen === 2 && fshapeMat[1] === 1 && vecN === fshapeMat[0] - 1 && vecs.length > 1 && vecs.length - fshapeMat[0] >= -1) {

                for (let i = 0; i < vecN; i++) {
                    let shapeMat = this.getShape(vecs[i]),
                        sLen = shapeMat.length

                    shapeMat[0] = shapeMat[0] - offset

                    if (shapeMat[0] === fshapeMat[0] && shapeMat[1] === fshapeMat[1] && sLen === 2) {
                        numValid += 1
                    } else {
                        numValid -= 1
                    }
                }

                if (numValid === vecN) {
                    valid = true
                }

                if (fshapeMat[0] <= 2) {
                    valid = false
                }

                if (valid === true) {
                    if (typeof deg === "number") {
                        var magnitude = 1,
                            degToRad = (deg * Math.PI) / 180,
                            sinAng = Math.sin(degToRad),
                            unitVec = this.runGetCrossPUnitVec(len, vecs)
                        for (let i = 0; i < vecN; i++) {
                            magnitude *= this.mag(vecs[i], fshapeMat[0])
                        }
                        return this.scaMult((magnitude * sinAng), unitVec)
                    } else {
                        return this.getCrossPVec(fshapeMat[0], vecN, vecs)
                    }
                } else return null
            } else return null
        }

        getCrossPAngle(len = null, ...vecs) {
            var
                crossP = this.runCrossProduct(null, len, vecs),
                magRes = 1

            for (let i in vecs) {
                magRes *= this.mag(vecs[i], len) ** 2
            }

            if (typeof crossP === "object") {
                var
                    crossPSq = this.dotProduct(null, len, crossP, crossP),
                    sinSqAng = crossPSq / magRes,
                    sinAng = Math.asin(Math.sqrt(sinSqAng))

                return (sinAng * 180) / Math.PI
            } else return null
        }

        unitVec(vec, len = null) {
            var magnitude = this.mag(vec, len)
            if (typeof len === "number") {
                var outVec = vec.slice(0, len)
            } else outVec = vec
            return this.scaMult(1 / magnitude, outVec)
        }

        getCrossPUnitVec(len, ...vecs) {
            return this.runGetCrossPUnitVec(len, vecs)
        }

        runGetCrossPUnitVec(len, vecs) {
            var
                crossP = this.runCrossProduct(null, len, vecs),
                magnitude = this.mag(crossP)

            return this.scaMult(1 / magnitude, crossP)
        }
    }


    class Project extends VecOp {
        constructor(canvas, ocanvas, menu) {
            super(canvas, ocanvas, menu);
            return this;
        }

        project(nearZ, farZ, fovAng) {
            this.f = farZ;
            this.n = nearZ;
            this.w = 1;
            this.fov = fovAng;
            this.arInv = 1 / this.aspectRatio;
            this.dist = 1 / (Math.tan((this.fov / 2) * (Math.PI / 180)));
            this.camProjectionMatrix = [
                [this.dist * this.arInv, 0, 0, 0],
                [0, this.dist, 0, 0],
                [0, 0, (-this.n - this.f) / (this.n - this.f), (2 * this.f * this.n) / (this.n - this.f)],
                [0, 0, 1, 0]
            ];
            this.lightProjectionMatrix = [
                [this.dist * this.arInv, 0, 0, 0],
                [0, this.dist, 0, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0]
            ];
        }

        changeW(val) {
            this.w = val;
            return this;
        }
    }

    class CoordinateSpace extends Project {
        constructor(canvas, ocanvas, menu) {
            super(canvas, ocanvas, menu);
            this.defLightVec = [
                    [1, 0, 0, 0],
                    [0, 1, 0, 0],
                    [0, 0, 1, 0],
                    [0, 0, 0, 1]
                ] // Default light transformation matrix
            this.defCameraVec = [
                    [1, 0, 0, 0],
                    [0, 1, 0, 0],
                    [0, 0, 1, 0],
                    [0, 0, 0, 1]
                ] // Default camera transformation matrix
            this.cameraVec = [];
            this.lightVec = [];
        }

        setHalf() {
            this.halfx = this.canvas.width / 2
            this.halfy = this.canvas.height / 2
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

        setCamera(Rx, Ry, Rz, Tx, Ty, Tz) {
            this.cameraVec = this.matMult(this.defCameraVec, this.matMult(this.transl3d(-Tx, -Ty, -Tz), this.rot3d(-Rx, -Ry, -Rz)))
            return this.cameraVec
        }

        setLight(Tx, Ty, Tz) {
            this.lightVec = this.matMult(this.defLightVec, this.transl3d(-Tx, Ty, -Tz))
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
    }

    class Prerender extends CoordinateSpace {
        constructor(canvas, ocanvas, menu) {
            super(canvas, ocanvas, menu);
        }

        camRender(vertex) {
            const clip = this.clip(vertex),
                homoVec = this.homoVec(clip),
                vertTransformClip = this.matMult(this.objTransfMat, homoVec),
                worldToCamSpace = this.matMult(this.cameraVec, vertTransformClip),
                vertProjMat = this.matMult(this.camProjectionMatrix, worldToCamSpace),
                vertProjArr = this.unmodArr(vertProjMat),
                persDiv = this.scaMult2(1 / vertProjArr[3], vertProjArr, true)

            if (persDiv[2] >= -1.1 && persDiv[2] <= 1.1 && persDiv[2] != Infinity) { //Culling
                const vertTransformUnclip = this.unclip(persDiv),
                    viewToCanvas = this.toCanvas(vertTransformUnclip)
                return viewToCanvas
            } else return null

        }

        lightRender(vertex) {
            const clip = this.clip(vertex),
                homoVec = this.homoVec(clip),
                vertTransformClip = this.matMult(this.objTransfMat, homoVec),
                worldToLightSpace = this.matMult(this.lightVec, vertTransformClip),
                vertProjMat = this.matMult(this.lightProjectionMatrix, worldToLightSpace),
                vertProjArr = this.unmodArr(vertProjMat),
                persDiv = this.scaMult2(1 / vertProjArr[3], vertProjArr, true)

            if (persDiv[2] != Infinity) { //Preventing zero division error
                const vertTransformUnclip = this.unclip(persDiv),
                    viewToCanvas = this.toCanvas(vertTransformUnclip)
                return viewToCanvas
            } else return null
        }

        camUnrender(vertex) {
            const canvasToView = this.canvasTo(vertex),
                vertTransformClip = this.clip(canvasToView),
                revPersDiv = this.scaMult(vertTransformClip[3], vertTransformClip, true),
                homoVec = this.homoVec(revPersDiv),
                vertProjMatInv = this.getInvMat(this.camProjectionMatrix),
                revVertProjMat = this.matMult(vertProjMatInv, homoVec),
                cameraVecInv = this.getInvMat(this.cameraVec),
                camToWorldSpace = this.matMult(cameraVecInv, revVertProjMat),
                vertTransformInv = this.getInvMat(this.objTransfMat),
                revVertTransform = this.matMult(vertTransformInv, camToWorldSpace),
                revClip = this.unclip(revVertTransform)

            return revClip
        }

        lightUnrender(vertex) {
            const canvasToView = this.canvasTo(vertex),
                vertTransformClip = this.clip(canvasToView),
                revPersDiv = this.scaMult(Math.abs(vertTransformClip[3]), vertTransformClip, true),
                homoVec = this.homoVec(revPersDiv),
                vertProjMatInv = this.getInvMat(this.lightProjectionMatrix),
                revVertProjMat = this.matMult(vertProjMatInv, homoVec),
                lightVecInv = this.getInvMat(this.lightVec),
                lightToWorldSpace = this.matMult(lightVecInv, revVertProjMat),
                vertTransformInv = this.getInvMat(this.objTransfMat),
                revVertTransform = this.matMult(vertTransformInv, lightToWorldSpace),
                revClip = this.unclip(revVertTransform)

            return revClip
        }
    }

    class InterPolRend extends Prerender {
        constructor(canvas, ocanvas, menu) {
            super(canvas, ocanvas, menu);
            this.kernel_Size = 3;
            this.sigma_xy = 1;
            this.sampleArr = [];
            this.TotalArea = 0;
            this.triA = 0;
            this.triB = 0;
            this.triC = 0;
            this.aRatio = 0;
            this.bRatio = 0;
            this.cRatio = 0;
            this.opacityCoeff = 0;
            this.render = false;
            this.shader = false;
            this.Alight = new Array();
            this.Blight = new Array();
            this.Clight = new Array();
            this.Acam = new Array();
            this.Bcam = new Array();
            this.Ccam = new Array();
            this.setObjTransfMat(bSx, bSy, bSz, brX, 10, brZ, btX, btY, btZ);
            this.setCamera(0, 0, 5, 1, 0, 20);
            this.setLight(-5, 50, -5);
            this.project(bNz, bFz, bAng);

            this.sample();
        }

        initParamsBasic() {
            this.runSettings();
            this.initCanvas();
            this.iniTDepthBuffer();
            this.initFrameBuffer();
            this.setHalf();
        }

        initParamsFull(...vertArray) {
            this.avec = vertArray[0].slice(0, 3);
            this.bvec = vertArray[1].slice(0, 3);
            this.cvec = vertArray[2].slice(0, 3);
            this.colA = vertArray[0].slice(3);
            this.colB = vertArray[1].slice(3);
            this.colC = vertArray[2].slice(3);
        }

        interpolate(pvec, avec, bvec, cvec) {
            //MaxParamLength is assumed to be 4, since each input vector is assumed to be a 4X1 homogenous matrix

            const indexList = [0, 1];
            const Adist = this.getDist(bvec, cvec, indexList),
                Bdist = this.getDist(avec, cvec, indexList),
                Cdist = this.getDist(avec, bvec, indexList),
                apdist = this.getDist(pvec, avec, indexList),
                bpdist = this.getDist(pvec, bvec, indexList),
                cpdist = this.getDist(pvec, cvec, indexList);

            this.TotalArea = this.getTriArea(Adist, Bdist, Cdist);
            this.triA = this.getTriArea(Adist, bpdist, cpdist);
            this.triB = this.getTriArea(Bdist, apdist, cpdist);
            this.triC = this.getTriArea(Cdist, apdist, bpdist);

            this.aRatio = this.triA / this.TotalArea;
            this.bRatio = this.triB / this.TotalArea;
            this.cRatio = this.triC / this.TotalArea;

            const
                aPa = this.scaMult2(this.aRatio, avec),
                bPb = this.scaMult2(this.bRatio, bvec),
                cPc = this.scaMult2(this.cRatio, cvec);

            return this.addSub2(this.addSub2(aPa, bPb), cPc);
        }

        getBoundingRect(...vertices) {
            return this.getBoundingRectImpl(vertices);
        }

        getBoundingRectImpl(vertices) {
            var n = vertices.length;
            var xArr = [];
            var yArr = [];
            var xmin = Infinity;
            var ymin = Infinity;
            var xmax = 0;
            var ymax = 0;

            for (let i = 0; i < n; i++) {
                xArr[i] = vertices[i][0];
                yArr[i] = vertices[i][1];

                if (xArr[i] < xmin) {
                    xmin = xArr[i];
                }

                if (yArr[i] < ymin) {
                    ymin = yArr[i];
                }

                if (xArr[i] > xmax) {
                    xmax = xArr[i];
                }

                if (yArr[i] > ymax) {
                    ymax = yArr[i];
                }
            }

            return [xmin, ymin, xmax - xmin, ymax - ymin];
        }

        isInsideTri() {
            var sum = this.triA + this.triB + this.triC
            if (Math.round(sum) === Math.round(this.TotalArea)) {
                return true;
            }
            return false;
        }

        sample() { //Generates an array of normalized Gaussian distribution function values with x and y coefficients 
            // Mean is taken as zero

            this.kernel_Size = this.kernel_Size
            const denom_ = ((2 * Math.PI) * (this.sigma_xy ** 2));
            if (this.kernel_Size > 1 && this.kernel_Size % 2 === 1) {
                const modifier = (this.kernel_Size - 1) / 2;
                for (let i = 0; i < this.kernel_Size; i++) {
                    const val_y = i - modifier;
                    for (let j = 0; j < this.kernel_Size; j++) {
                        const val_x = j - modifier;
                        const numer_ = Math.exp(-((val_x ** 2) + (val_y ** 2)) / (4 * (this.sigma_xy ** 2)));
                        this.sampleArr.push([val_x, val_y, numer_ / denom_]);
                    }
                }
            }
        }

        partSample(x, y) {
            const part_sample_arr = []

            for (let sample of this.sampleArr) {
                var val_x = sample[0] + x;
                var val_y = sample[1] + y;

                if (val_x < 0) {
                    val_x = 0;
                } else if (val_x >= this.canvW) {
                    val_x = this.canvW - 1;
                }
                if (val_y < 0) {
                    val_y = 0;
                } else if (val_y >= this.canvH) {
                    val_y = this.canvH - 1;
                }

                part_sample_arr.push([val_x, val_y, sample[2]]);
            }

            return part_sample_arr;
        }

        vertShader() {
            const avec = this.avec,
                bvec = this.bvec,
                cvec = this.cvec;

            if (avec !== null && bvec !== null && cvec !== null) {
                this.Alight = this.lightRender(avec);
                this.Blight = this.lightRender(bvec);
                this.Clight = this.lightRender(cvec);

            } else return null;
        }

        vertRend() {
            const avec = this.avec,
                bvec = this.bvec,
                cvec = this.cvec;


            if (avec !== null && bvec !== null && cvec !== null) {
                this.A = this.camRender(avec);
                this.B = this.camRender(bvec);
                this.C = this.camRender(cvec);
            }

            if (this.A !== null && this.B !== null && this.C !== null) {
                this.render = true;
            } else this.render = false;
        }

        fragShader() {
            // Get 2d bounding rectangle
            const ret = this.getBoundingRect(this.A, this.B, this.C),
                // Simple rasterizing function
                minX = Math.max(ret[0], 0),
                minY = Math.max(ret[1], 0),
                maxX = Math.min(ret[0] + ret[2], this.canvW),
                maxY = Math.min(ret[1] + ret[3], this.canvH);

            for (let x = minX; x <= maxX; x++) {
                for (let y = minY; y <= maxY; y++) {
                    const point = [
                        [x],
                        [y]
                    ];
                    var interArray = this.interpolate(point, this.A, this.B, this.C),
                        aCola = this.scaMult(this.aRatio, this.colA),
                        bColb = this.scaMult(this.bRatio, this.colB),
                        cColc = this.scaMult(this.cRatio, this.colC),
                        pcolP = this.addSub(this.addSub(aCola, bColb), cColc);

                    if (this.isInsideTri() === true) {

                    }
                }
            }
        }

        fragRend() {
            if (this.render === true) {
                // Get 2d bounding rectangle
                const ret = this.getBoundingRect(this.A, this.B, this.C),
                    // Simple rasterizing function
                    minX = Math.round(Math.max(ret[0], 0)),
                    minY = Math.round(Math.max(ret[1], 0)),
                    maxX = Math.round(Math.min(ret[0] + ret[2], this.canvW)),
                    maxY = Math.round(Math.min(ret[1] + ret[3], this.canvH));

                // Get Gaussian distribution array for particular pixel

                for (let x = minX; x <= maxX; x++) {
                    for (let y = minY; y <= maxY; y++) {

                        const point = [
                            [x],
                            [y]
                        ];

                        var interArray = this.interpolate(point, this.A, this.B, this.C);

                        if (this.isInsideTri() === true) {
                            const aCola = this.scaMult2(this.aRatio, this.colA);
                            const bColb = this.scaMult2(this.bRatio, this.colB);
                            const cColc = this.scaMult2(this.cRatio, this.colC);
                            var pColp = this.addSub2(this.addSub2(aCola, bColb), cColc);

                            // this.opacityCoeff = (2 - (Math.abs(this.aRatio - this.bRatio) + Math.abs(this.aRatio - this.cRatio) + Math.abs(this.bRatio - this.cRatio))) / 2;

                            for (let i = 0; i < 4; i++) {
                                pColp[i] = Math.round(pColp[i]);
                            }

                            if (this.aRatio < 0.03) {
                                pColp = [255, 0, 0, pColp[3]];
                            }

                            if (this.bRatio < 0.03) {
                                pColp = [0, 255, 0, pColp[3]];
                            }


                            if (this.cRatio < 0.03) {
                                pColp = [0, 0, 255, pColp[3]];
                            }

                            if (this.depthBuffer[(y * this.canvW) + x] > interArray[2]) {
                                this.depthBuffer[(y * this.canvW) + x] = interArray[2];
                                this.frameBuffer[(y * this.canvW) + x] = pColp;
                            }
                            // else {
                            //     this.frameBuffer[(y * this.canvW) + x] = [255, 255, 0, 255];
                            // }
                        }
                    }
                }
            }
        }

        show() {
            for (let y = 0; y < this.canvH; y++) {
                for (let x = 0; x < this.canvW; x++) {
                    const frame = this.frameBuffer[(y * this.canvW) + x];
                    if (frame !== undefined) {
                        octx.fillStyle = "rgba(" + frame[0] + "," + frame[1] + "," + frame[2] + "," + frame[3] / 255 + ")";
                        octx.fillRect(x, y, this.deviceRatio, this.deviceRatio);
                    }
                }
            }
            octx.drawImage(ocanvas, 0, 0, this.canvW * 0.5, this.canvH * 0.5)
            ctx.drawImage(ocanvas, 0, 0, this.canvW * 0.5, this.canvH * 0.5, 0, 0, this.canvW, this.canvH)
        }
    }

    class DrawObject {
        constructor(vertexRadius, lineWidth) {
            this.vertR = vertexRadius
            this.LineW = lineWidth
        }

        drawVertex(point, fill = "black", stroke = fill) {
            ctx.beginPath()
            ctx.arc(point[0][0], point[1][0], this.vertR, 0, 2 * Math.PI)
            ctx.lineWidth = this.LineW
            ctx.strokeStyle = stroke
            ctx.stroke()
            ctx.fillStyle = fill
            ctx.fill()
        }

        drawCircle(point, fill = "black", stroke = fill, radius) {
            ctx.beginPath()
            ctx.arc(point[0][0], point[1][0], radius, 0, 2 * Math.PI)
            ctx.lineWidth = this.LineW
            ctx.strokeStyle = stroke
            ctx.stroke()
            ctx.fillStyle = fill
            ctx.fill()
        }

        drawLine(start, end, drawpoint = false, fill = "black", stroke = fill) {
            ctx.beginPath()
            ctx.moveTo(start[0][0], start[1][0])
            ctx.lineTo(end[0][0], end[1][0])
            ctx.lineWidth = this.LineW
            ctx.strokeStyle = stroke
            ctx.stroke()
            ctx.fillStyle = fill
            ctx.fill()

            if (drawpoint === true) {
                this.drawVertex(start, fill, stroke)
                this.drawVertex(end, fill, stroke)
            }
        }
        drawTriangle(A, B, C, orientOut = true, drawpoint = false, fill = "black", stroke = fill, diff = false, strokeBool = true) {
            ctx.lineWidth = this.LineW;

            if (orientOut === false) {
                if (stroke === fill) {
                    stroke = 'gray';
                }
                fill = 'gray';
            }

            ctx.beginPath()
            ctx.moveTo(A[0][0], A[1][0]);
            ctx.lineTo(B[0][0], B[1][0]);
            ctx.lineTo(C[0][0], C[1][0]);
            ctx.strokeStyle = stroke;
            ctx.fillStyle = fill;
            ctx.fill();

            if (strokeBool === true) {
                ctx.closePath();
                ctx.stroke();
            }

            if (drawpoint === true) {
                if (diff === true) {
                    this.drawVertex(A, 'red');
                    this.drawVertex(B, 'green');
                    this.drawVertex(C, 'blue');
                } else {
                    this.drawVertex(A, fill, stroke);
                    this.drawVertex(B, fill, stroke);
                    this.drawVertex(C, fill, stroke);
                }
            }
        }
    }

    // console.log(details)
    // console.log(details.mobile)

    //Default value is right
    //arrOp.setHandedness('left')

    implementDrag.start(canvas)


    const inter = new InterPolRend(canvas, ocanvas, menu);

    var vertexBuffer = [

        [25, 80, 35, 90, 35, 25, 255],
        [5, 30, 30, 34, 34, 212, 255],
        [10, 20, 45, 98, 45, 124, 255],
        [15, 15, 25, 134, 52, 82, 255],
        [20, 30, 50, 123, 98, 23, 255]
    ]

    var v = vertexBuffer[0],
        w = vertexBuffer[1],
        x = vertexBuffer[2],
        y = vertexBuffer[3],
        z = vertexBuffer[4]

    function deploy() {
        // octx.clearRect(0, 0, inter.canvW, inter.canvH);
        // ctx.clearRect(0, 0, inter.scrCanvW, inter.scrCanvH);
        inter.initParamsBasic()
        inter.initParamsFull(v, z, w);
        inter.vertRend();
        inter.fragRend();
        inter.initParamsFull(y, z, w);
        inter.vertRend();
        inter.fragRend();
        inter.initParamsFull(y, z, v);
        inter.vertRend();
        inter.fragRend();
        inter.initParamsFull(w, v, y);
        inter.vertRend();
        inter.fragRend();
        inter.show()
    }

    deploy()

    function look(event) {

        if (event.keyCode === 82 || event.altKey === true && event.keyCode === 74) {
            deploy();
        }

        if (event.keyCode === 83 || event.keyCode === 13) {
            generalizeInput()
        }
        console.log(event.keyCode)
        console.log(event.altKey)
    }

    document.body.addEventListener('keydown', look);


    window.onresize = function() {
        deploy();
    }


    function generalizeInput() {

        console.log("lsk")
        setInputValue();
        deploy();

        console.log('dlk')
    }


    brotX.oninput = function() {
        brX = Number(brotX.value);
    }

    brotY.oninput = function() {
        brY = Number(brotY.value);
    }

    brotZ.oninput = function() {
        brZ = Number(brotZ.value);
    }

    btransX.oninput = function() {
        btX = Number(btransX.value);
    }

    btransY.oninput = function() {
        btY = Number(btransY.value);
    }

    btransZ.oninput = function() {
        btZ = Number(btransZ.value);
    }

    bscaleX.oninput = function() {
        bSx = Number(bscaleX.value);
    }

    bscaleY.oninput = function() {
        bSy = Number(bscaleY.value);
    }

    bscaleZ.oninput = function() {
        bSz = Number(bscaleZ.value);
    }

    bangle.oninput = function() {
        bAng = Number(bangle.value);
    }

    bnearZ.oninput = function() {
        bNz = Number(bnearZ.value);
    }

    bfarZ.oninput = function() {
        bFz = Number(bfarZ.value);
    }

    (1, 50, 1, 0, 10, 0, 0, 0, 0)

    // console.log(coord.cameraVec)
    // console.log(coord.lightVec)

    // console.log(proj.camProjectionMatrix)
    // console.log(proj.lightProjectionMatrix)

    class Object {
        constructor(vertexBuffer, indexBuffer) {
            this.vertexBuffer = vertexBuffer
            this.indexBuffer = indexBuffer
        }
    }

    class TextureMap {
        constructor(texture, object) {}
    }



    //drawObj.drawTriangle(al, bl, cl, undefined, undefined, 'red', 'brown', true, true)
    // inter.initParamsFull(v, w, x)
    // inter.vertRend()
    // inter.fragRend()


    class HalfEdge {
        constructor(start, end) {
            this.vertices = [start, end];
            this.face_vertices = null;
            this.twin = null;
            this.prev = null;
            this.next = null;
        }
    }

    class setHalfEdges {
        constructor(vertex_indexes) {
            this.HalfEdgeDict = {};
            this.vert_len = vertex_indexes.length;
            this.vert_array = vertex_indexes;
            this.triangle = [];
            this.settable = true;
            this.last = null;

            for (let i = 0; i < this.vert_len; i++) {
                this.setHalfEdge(i);
            }

            delete this.HalfEdgeDict[`${this.last}-null`];

            return this;
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

            this.triangle.push(this.vert_array[index]);

            const vert_0 = prev_start
            const vert_2 = end;
            const vert_3 = next_end;

            const halfEdgeKey = `${vert_1}-${vert_2}`;
            const prevHalfEdgeKey = `${vert_0}-${vert_1}`
            const nextHalfEdgeKey = `${vert_2}-${vert_3}`;
            const twinHalfEdgeKey = `${vert_2}-${vert_1}`;


            this.HalfEdgeDict[halfEdgeKey] = new HalfEdge(vert_1, vert_2);

            this.HalfEdgeDict[halfEdgeKey].prev = prevHalfEdgeKey;
            this.HalfEdgeDict[halfEdgeKey].next = nextHalfEdgeKey;

            if (index === this.vert_len - 1) {
                this.last = vert_1;
                end = this.HalfEdgeDict[this.HalfEdgeDict[prevHalfEdgeKey].prev].vertices[0];
                this.HalfEdgeDict[halfEdgeKey].vertices[1] = end;
                this.HalfEdgeDict[halfEdgeKey].next = `${end}-null`;
                this.HalfEdgeDict[`${vert_1}-${end}`] = this.HalfEdgeDict[halfEdgeKey];
            }

            if ((index + 1) % 3 === 0) {
                this.HalfEdgeDict[halfEdgeKey].face_vertices = this.triangle;
                this.HalfEdgeDict[prevHalfEdgeKey].face_vertices = this.triangle;
                this.HalfEdgeDict[this.HalfEdgeDict[prevHalfEdgeKey].prev].face_vertices = this.triangle;
                this.triangle = [];
            }

            if (this.HalfEdgeDict[twinHalfEdgeKey]) {
                this.HalfEdgeDict[halfEdgeKey].twin = twinHalfEdgeKey;
                this.HalfEdgeDict[twinHalfEdgeKey].twin = halfEdgeKey;
            }
        }
    }

    // // [
    // //     [-50, 200, 1],
    // //     [0, 255, 0, 255]
    // // ],
    // // [
    // //     [10, 20, 1],
    // //     [0, 233, 0, 0]
    // // ]

    // let simpTri = new Object(vertexBuffer, indexBuffer)

    // inter.vertShader()
    // inter.fragShader()
    // inter.show()


    // window.onresize = function() {
    //     sett.runSettings()
    //     drawcanvas.runDrawCanvas()
    //     coord.setHalf()
    // }

    function lineFromPoints(P, Q) {
        //ax
        //by
        //c
        let a = Q[1][0] - P[1][0];
        let b = P[0][0] - Q[0][0];
        let c = a * (P[0][0]) + b * (P[1][0]);
        return [a, b, c]
    }

    function perpendicularBisectorFromLine(P, Q, a, b, c) {
        let mid_point = [(P[0][0] + Q[0][0]) / 2, (P[1][0] + Q[1][0]) / 2]
            //c = -bx + ay
        c = -b * (mid_point[0]) + a * (mid_point[1]);

        let temp = a;
        a = -b;
        b = temp

        return [a, b, c]
    }

    function lineLineIntersection(a1, b1, c1, a2, b2, c2) {
        let determinant = (a1 * b2) - (a2 * b1);

        if (determinant === 0) {
            return [null, null]
        } else {
            let x = ((b2 * c1) - (b1 * c2)) / determinant;
            let y = ((a1 * c2) - (a2 * c1)) / determinant;
            return [x, y]
        }
    }

    function getCircumCircle(P, Q, R) {
        var PQ_line = lineFromPoints(P, Q);
        var QR_line = lineFromPoints(Q, R);
        var a = PQ_line[0];
        var b = PQ_line[1];
        var c = PQ_line[2];
        var e = QR_line[0];
        var f = QR_line[1];
        var g = QR_line[2];

        var PQ_perpendicular = perpendicularBisectorFromLine(P, Q, a, b, c);
        var QR_perpendicular = perpendicularBisectorFromLine(Q, R, e, f, g);
        a = PQ_perpendicular[0];
        b = PQ_perpendicular[1];
        c = PQ_perpendicular[2];
        e = QR_perpendicular[0];
        f = QR_perpendicular[1];
        g = QR_perpendicular[2];

        var circumCenter = lineLineIntersection(a, b, c, e, f, g)

        var x = circumCenter[0]
        var y = circumCenter[1]

        var center = [
            [x],
            [y]
        ]

        var radius = misc.getDist(P, center, [0, 1])

        return { center, radius }
    }

    function getInscr(A, B, C) {
        const param = [0, 1];
        const lenAB = misc.getDist(A, B, param);
        const lenBC = misc.getDist(B, C, param);
        const lenCA = misc.getDist(C, A, param);

        const area = misc.getTriArea(lenAB, lenBC, lenCA);
        const semiPerimeter = (lenAB + lenBC + lenCA) / 2
        const radius = area / semiPerimeter

        const center = [
            [(lenAB * A[0][0] + lenBC * B[0][0] + lenCA * C[0][0]) / (lenAB + lenBC + lenCA)],
            [(lenAB * A[1][0] + lenBC * B[1][0] + lenCA * C[1][0]) / (lenAB + lenBC + lenCA)]
        ]

        return { center, radius }
    }

    var a = [
        [100],
        [150]
    ];
    var b = [
        [110],
        [200]
    ];
    var c = [
        [150],
        [120]
    ];
    var d = [
        [140],
        [190]
    ];
    var e = [
        [130],
        [250]
    ];
    var f = [
        [170],
        [250]
    ];


    function findCircTriFSq(rect) {
        var mid = (rect[2] / 2) + rect[0]
        var lSmall = rect[2] / 2
        var hSmall = Math.tan((60 * Math.PI) / 180) * lSmall
        var hBig = hSmall + rect[3]
        var lBig = hBig / (Math.tan((60 * Math.PI) / 180))
        var A = [
            [mid - lBig],
            [rect[1] + rect[3]]
        ]
        var B = [
            [mid],
            [rect[1] - hSmall]
        ]
        var C = [
            [mid + lBig],
            [rect[1] + rect[3]]
        ]

        return { A, B, C }
    }


    // var refx1 = coord.canvasTo(arrOp.homoVec([0, canvas.height / 2, 60])),
    //     refx2 = coord.canvasTo(arrOp.homoVec([canvas.width, canvas.height / 2, 60])),
    //     refy1 = coord.canvasTo(arrOp.homoVec([canvas.width / 2, canvas.height, 60])),
    //     refy2 = coord.canvasTo(arrOp.homoVec([canvas.width / 2, 0, 60])),
    //     refz1 = coord.canvasTo(arrOp.homoVec([canvas.width / 2, canvas.height / 2, 0])),
    //     refz2 = coord.canvasTo(arrOp.homoVec([canvas.width / 2, canvas.height / 2, 120]))

    // var rendx1 = rend.render(refx1),
    //     rendx2 = rend.render(refx2),
    //     rendy1 = rend.render(refy1),
    //     rendy2 = rend.render(refy2),
    //     rendz1 = rend.render(refz1),
    //     rendz2 = rend.render(refz2)


    // drawObj.drawTriangle(aRend, bRend, dRend, true, true, 'red', null, null, false)


    // console.log(isInsideTri([
    //     [289],
    //     [350],
    //     [0],
    //     [0]
    // ], aRend, bRend, cRend, 2))

    // var check = document.getElementById('check')
    // check.innerHTML = isInsideTri([
    //         [x],
    //         [y]
    //     ], aRend, bRend, cRend, 2)
    // getRaster(ret[0], ret[1], ret[2], ret[3])

    // drawObj.drawLine(rendx1, rendx2)
    // drawObj.drawLine(rendy1, rendy2)
    // drawObj.drawLine(rendz1, rendz2)


    //console.log(arrOp.homoVecEqCol(Avec, Evec, 4))


    // var orig = [0, 0, 0],
    //     origVec = arrOp.homoVec(orig),
    //     projVec = this.matMult(proj.projectionMatrix, origVec),
    //     origUnclipVec = clip.unclip(projVec)

    // console.log(origVec)

    // console.log(projVec)

    // console.log(origUnclipVec)


    // drawObj.drawVertex(origUnclipVec, "blue", "red")

    // var p1 = arrOp.homoVec([-100, -100, -5]),
    //     p2 = arrOp.homoVec([-100, -100, 5]),
    //     p3 = arrOp.homoVec([-100, 100, -5]),
    //     p4 = arrOp.homoVec([-100, 100, 5]),
    //     p5 = arrOp.homoVec([100, -100, -5]),
    //     p6 = arrOp.homoVec([100, -100, 5]),
    //     p7 = arrOp.homoVec([100, 100, -5]),
    //     p8 = arrOp.homoVec([100, 100, 5])

    // console.log(p1)

    // console.log(coord.toCanvas(p2))
    // console.log(coord.toCanvas(p4))
    // console.log(coord.toCanvas(p6))
    // console.log(coord.toCanvas(p8))


    // var v1 = rend.render(p1),
    //     v2 = rend.render(p2),
    //     v3 = rend.render(p3),
    //     v4 = rend.render(p4),
    //     v5 = rend.render(p5),
    //     v6 = rend.render(p6),
    //     v7 = rend.render(p7),
    //     v8 = rend.render(p8)

    // drawObj.drawVertex(v1, 'red')
    // drawObj.drawVertex(v2, 'blue')
    // drawObj.drawVertex(v3, 'green')
    // drawObj.drawVertex(v4, 'violet')
    // drawObj.drawVertex(v5, 'cyan')
    // drawObj.drawVertex(v6, 'magenta')
    // drawObj.drawVertex(v7, 'yellow')
    // drawObj.drawVertex(v8, 'gray')

    // drawObj.drawVertex(rend.render(arrOp.homoVec([0, 0, 0.1])))

    // drawObj.drawLine(v1, v2)
    // drawObj.drawLine(v1, v3)
    // drawObj.drawLine(v1, v5)
    // drawObj.drawLine(v2, v6)
    // drawObj.drawLine(v2, v4)
    // drawObj.drawLine(v3, v7)
    // drawObj.drawLine(v3, v4)
    // drawObj.drawLine(v4, v8)
    // drawObj.drawLine(v5, v6)
    // drawObj.drawLine(v5, v7)
    // drawObj.drawLine(v6, v8)
    // drawObj.drawLine(v7, v8)

    // drawObj.drawTriangle(v1, v2, v3, null, null, 'white', 'black')
    // drawObj.drawTriangle(v2, v3, v4, null, null, 'white', 'black')



    // var a = arrOp.homoVec([50, 50, 2]),
    //     b = arrOp.homoVec([200, 25, 2]),
    //     c = arrOp.homoVec([400, 200, 2]),

    //     rendA = rend.render(a),
    //     rendB = rend.render(b),
    //     rendC = rend.render(c)


    // drawObj.drawTriangle(rendA, rendB, rendC, null, true, null, null, true)


    // console.log(ctx.clearRect(0, 0, canvas.width, canvas.height))

    // fillstyle / concat method fastest
    // ctx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + (a / 255) + ")";
    // ctx.fillRect(10, 10, 10, 10);

    // fillstyle / join method slightly slower
    // ctx.fillStyle = 'rgba(' + [r, g, b, a / 255].join() + ')'
    // ctx.fillRect(10, 10, 10, 10)

    // var px = ctx.createImageData(10, 10) // Slowest
    // px[0] = r
    // px[1] = g
    // px[2] = b

    // ctx.putImageData(px, 10, 10)

    // Color Picker

    function pick(event, destination) {
        const bounding = canvas.getBoundingClientRect();
        const x = event.clientX - bounding.left;
        const y = event.clientY - bounding.top;

        const pixel = ctx.getImageData(x, y, 1, 1);
        const data = pixel.data;

        const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
        destination.color.innerHTML = rgba
        destination.pixel.innerHTML = `(${x},${y})`

        return rgba;
    }

    canvas.addEventListener("mousemove", (event) => pick(event, hovered));
    canvas.addEventListener("click", (event) => pick(event, selected));


    // if (ret !== null) {
    //     ctx.fillStyle = "#999"
    //     ctx.fillRect(ret[0], ret[1], ret[2], ret[3])
    // }
    // if (ret2 !== null) {
    //     ctx.fillStyle = "#ddd"
    //     ctx.fillRect(ret2[0], ret2[1], ret2[2], ret2[3])
    // }

    //getRaster('blue', aRend, bRend, cRend, ret)
    // getRaster('black', aRend, bRend, dRend, ret2)


    //console.log(canvas.toDataURL('image/jpeg', 1))

    // console.log(rend.unrender(rend.render(v)))

    // var link = document.getElementById('link');
    // link.setAttribute('download', 'MintyPaper.png');
    // link.setAttribute('href', canvas.toDataURL("image/png").replace("image/png", "image/octet-stream"));
    // link.click();

    // // Convert canvas to image
    // document.getElementById('btn-download').addEventListener("click", function(e) {
    //     var canvas = document.querySelector('#my-canvas');

    //     var dataURL = canvas.toDataURL("image/jpeg", 1.0);

    //     downloadImage(dataURL, 'my-canvas.jpeg');
    // });

    // // Save | Download image
    // function downloadImage(data, filename = 'untitled.jpeg') {
    //     var a = document.createElement('a');
    //     a.href = data;
    //     a.download = filename;
    //     document.body.appendChild(a);
    //     a.click();
    // }

})()