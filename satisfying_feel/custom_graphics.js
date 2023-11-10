//
"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
{
    var pListCache_1 = {};
    var pArgCache_1 = {};
    // const scrW = screen.width;
    // const scrH = screen.height;
    // var prevW = 0;
    // var prevH = 0;
    // var speed = 0;
    // var prev = Date.now()
    var canvas_1 = document.getElementsByTagName('canvas')[0];
    var ctx_1 = canvas_1.getContext('2d', { willReadFrequently: true });
    var hovered = { color: document.getElementById('hoveredColor'), pixel: document.getElementById('hoveredPixel') };
    var selected = { color: document.getElementById('selectedColor'), pixel: document.getElementById('selectedPixel') };
    var drop = document.getElementById('drop');
    var _ERROR_ = void 0;
    (function (_ERROR_) {
        _ERROR_[_ERROR_["_NO_ERROR_"] = 1000000000000] = "_NO_ERROR_";
        _ERROR_[_ERROR_["_SETTINGS_ERROR_"] = 1000000000001] = "_SETTINGS_ERROR_";
        _ERROR_[_ERROR_["_MISCELLANOUS_ERROR_"] = 1000000000002] = "_MISCELLANOUS_ERROR_";
        _ERROR_[_ERROR_["_QUARTERNION_ERROR_"] = 1000000000003] = "_QUARTERNION_ERROR_";
        _ERROR_[_ERROR_["_MATRIX_ERROR_"] = 1000000000004] = "_MATRIX_ERROR_";
        _ERROR_[_ERROR_["_VECTOR_ERROR_"] = 1000000000005] = "_VECTOR_ERROR_";
        _ERROR_[_ERROR_["_PERSPECTIVE_PROJ_ERROR_"] = 1000000000006] = "_PERSPECTIVE_PROJ_ERROR_";
        _ERROR_[_ERROR_["_CLIP_ERROR_"] = 1000000000007] = "_CLIP_ERROR_";
        _ERROR_[_ERROR_["_LOCAL_SPACE_ERROR_"] = 1000000000008] = "_LOCAL_SPACE_ERROR_";
        _ERROR_[_ERROR_["_WORLD_SPACE_ERROR_"] = 1000000000009] = "_WORLD_SPACE_ERROR_";
        _ERROR_[_ERROR_["_CLIP_SPACE_ERROR_"] = 1000000000010] = "_CLIP_SPACE_ERROR_";
        _ERROR_[_ERROR_["_SCREEN_SPACE_ERROR_"] = 1000000000011] = "_SCREEN_SPACE_ERROR_";
        _ERROR_[_ERROR_["_OPTICAL_ELEMENT_OBJECT_ERROR_"] = 1000000000012] = "_OPTICAL_ELEMENT_OBJECT_ERROR_";
        _ERROR_[_ERROR_["_RENDER_ERROR_"] = 1000000000013] = "_RENDER_ERROR_";
        _ERROR_[_ERROR_["_DRAW_CANVAS_ERROR_"] = 1000000000014] = "_DRAW_CANVAS_ERROR_";
    })(_ERROR_ || (_ERROR_ = {}));
    var _ERROR_MATRIX_ = void 0;
    (function (_ERROR_MATRIX_) {
        _ERROR_MATRIX_[_ERROR_MATRIX_["_DET_"] = 1] = "_DET_";
        _ERROR_MATRIX_[_ERROR_MATRIX_["_MINOR_"] = 2] = "_MINOR_";
        _ERROR_MATRIX_[_ERROR_MATRIX_["_COF_"] = 3] = "_COF_";
        _ERROR_MATRIX_[_ERROR_MATRIX_["_ADJ_"] = 4] = "_ADJ_";
        _ERROR_MATRIX_[_ERROR_MATRIX_["_INV_"] = 5] = "_INV_";
    })(_ERROR_MATRIX_ || (_ERROR_MATRIX_ = {}));
    var BackTrack = /** @class */ (function () {
        function BackTrack() {
        }
        BackTrack.prototype.getPermutations = function (arr, permutationSize) {
            var permutations = [];
            function backtrack(currentPerm) {
                if (currentPerm.length === permutationSize) {
                    permutations.push(currentPerm.slice());
                    return;
                }
                arr.forEach(function (item) {
                    if (currentPerm.includes(item))
                        return;
                    currentPerm.push(item);
                    backtrack(currentPerm);
                    currentPerm.pop();
                });
            }
            backtrack([]);
            return permutations;
        };
        BackTrack.prototype.getCombinations = function (arr, combinationSize) {
            var combinations = [];
            function backtrack(startIndex, currentCombination) {
                if (currentCombination.length === combinationSize) {
                    combinations.push(currentCombination.slice());
                    return;
                }
                for (var i = startIndex; i < arr.length; i++) {
                    currentCombination.push(arr[i]);
                    backtrack(i + 1, currentCombination);
                    currentCombination.pop();
                }
            }
            backtrack(0, []);
            return combinations;
        };
        return BackTrack;
    }());
    // We implement a function closure here by binding the variable 'implementDrag'
    // to a local function and invoking the local function, this ensures that we have
    // some sort of private variables
    var implementDrag = (function () {
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0, prev = 0, now = Date.now(), dt = now - prev + 1, dX = 0, dY = 0, sens = 10, 
        // We invoke the local functions (changeSens and startDrag) as methods
        // of the object 'retObject' and set the return value of the local function
        // to 'retObject'
        retObject = {
            change: changeSens,
            start: drag,
            sensitivity: getSens()
        };
        function changeSens(value) {
            sens = value;
        }
        function getSens() {
            return sens;
        }
        function drag(element) {
            startDragMobile(element);
            startDrag(element);
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
            console.log("X: ".concat(dX * sens));
            console.log("Y: ".concat(dY * sens));
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
            console.log("X: ".concat(dX * sens));
            console.log("Y: ".concat(dY * sens));
        }
        function dragMouseup() {
            document.onmouseup = null;
            document.onmousemove = null;
        }
        function dragTouchend() {
            document.addEventListener('touchend', function () { return null; }, { 'passive': true });
            document.addEventListener('touchmove', function () { return null; }, { 'passive': true });
        }
        return retObject;
    })();
    var _Classes = function (bases) {
        var Bases = /** @class */ (function () {
            function Bases() {
                var _this = this;
                bases.foreach(function (base) { return Object.assign(_this, new base()); });
            }
            return Bases;
        }());
        bases.forEach(function (base) {
            Object.getOwnPropertyNames(base.prototype)
                .filter(function (prop) { return prop != 'constructor'; })
                .forEach(function (prop) { return Bases.prototype[prop] = base.prototype[prop]; });
        });
        return Bases;
    };
    var DEFAULT_PARAMS_1 = {
        _GLOBAL_ALPHA: '1',
        _CANVAS_WIDTH: 1,
        _CANVAS_HEIGHT: 1,
        _BORDER_COLOR: 'red',
        _BORDER_WIDTH: '4',
        _BORDER_RADIUS: '2',
        _BORDER_STYLE: "solid",
        _THETA: 0,
        _ANGLE_UNIT: "deg",
        _ANGLE_CONSTANT: Math.PI / 180,
        _REVERSE_ANGLE_CONSTANT: 180 / Math.PI,
        _HANDEDNESS: "right",
        _HANDEDNESS_CONSTANT: 1,
        _X: [1, 0, 0],
        _Y: [0, 1, 0],
        _Z: [0, 0, 1],
        _Q_VEC: [0, 0, 0],
        _Q_QUART: [0, 0, 0, 0],
        _Q_INV_QUART: [0, 0, 0, 0],
        _NZ: -0.1,
        _FZ: -100,
        _PROJ_ANGLE: 60,
        _ASPECT_RATIO: 1,
        _DIST: 1,
        _HALF_X: 1,
        _HALF_Y: 1,
        _PROJECTION_MAT: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        _INV_PROJECTION_MAT: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        _OPEN_SIDEBAR: true,
    };
    var MODIFIED_PARAMS_1 = JSON.parse(JSON.stringify(DEFAULT_PARAMS_1));
    var BackwardsCompatibilitySettings = /** @class */ (function () {
        // Composition is used as we don't want to compute the basic error-checking everytime.
        function BackwardsCompatibilitySettings() {
            this.test_array = new Array();
            this.compatibility_error = false;
            this.error_pos = [];
            this.flat_exists();
            this.map_exists();
            this.reduce_exists();
            this.reverse_exists();
            this.push_exists();
            this.forEach_exists();
            this.detect_compatibility_issues();
        }
        BackwardsCompatibilitySettings.prototype.detect_compatibility_issues = function () {
            var test_array_len = this.test_array.length;
            var inc = 0;
            for (var i = 0; i < test_array_len; i++) {
                if (this.test_array[i] === false) {
                    this.error_pos[inc] = i;
                    inc++;
                }
                this.compatibility_error = this.error_pos.length > 0;
            }
        };
        BackwardsCompatibilitySettings.prototype.flat_exists = function () {
            if (typeof this.test_array.flat !== "undefined" && typeof this.test_array.flat === "function")
                this.test_array[0] = true;
            else
                this.test_array[0] = false;
        };
        BackwardsCompatibilitySettings.prototype.map_exists = function () {
            if (typeof this.test_array.map !== "undefined" && typeof this.test_array.map === "function")
                this.test_array[1] = true;
            else
                this.test_array[1] = false;
        };
        ;
        BackwardsCompatibilitySettings.prototype.reduce_exists = function () {
            if (typeof this.test_array.reduce !== "undefined" && typeof this.test_array.reduce === "function")
                this.test_array[2] = true;
            else
                this.test_array[2] = false;
        };
        ;
        BackwardsCompatibilitySettings.prototype.reverse_exists = function () {
            if (typeof this.test_array.reverse !== "undefined" && typeof this.test_array.reverse === "function")
                this.test_array[3] = true;
            else
                this.test_array[3] = false;
        };
        ;
        BackwardsCompatibilitySettings.prototype.push_exists = function () {
            if (typeof this.test_array.push !== "undefined" && typeof this.test_array.push === "function")
                this.test_array[4] = true;
            else
                this.test_array[4] = false;
        };
        BackwardsCompatibilitySettings.prototype.forEach_exists = function () {
            if (typeof this.test_array.forEach !== "undefined" && typeof this.test_array.forEach === "function")
                this.test_array[5] = true;
            else
                this.test_array[5] = false;
        };
        return BackwardsCompatibilitySettings;
    }());
    var BasicSettings = /** @class */ (function () {
        function BasicSettings() {
            var _this = this;
            drop.style.top = "".concat(-drop.offsetTop + canvas_1.offsetTop, "px");
            this.setCanvas();
            this.resetCanvasToDefault();
            window.addEventListener("resize", function () { return _this.setCanvas(); });
        }
        BasicSettings.prototype.setCanvas = function () {
            // Canvas
            var width = window.innerWidth - 40;
            if (MODIFIED_PARAMS_1._OPEN_SIDEBAR === true)
                width = window.innerWidth - 300;
            var height = window.innerHeight - 100;
            MODIFIED_PARAMS_1._CANVAS_WIDTH = width;
            MODIFIED_PARAMS_1._CANVAS_HEIGHT = height;
            // Coordinate Space
            MODIFIED_PARAMS_1._HALF_X = width / 2;
            MODIFIED_PARAMS_1._HALF_Y = height / 2;
            // Perspective Projection
            MODIFIED_PARAMS_1._ASPECT_RATIO = width / height;
        };
        // initCanvas() {
        //     this.ocanvas.width = this.canvW;
        //     this.ocanvas.height = this.canvH;
        //     this.canvas.style.borderStyle = this.bordStyle;
        //     this.canvas.style.borderWidth = `${this.bordW}px`;
        //     this.canvas.style.borderColor = this.color;
        //     this.canvas.style.opacity = this.opacity;
        //     this.canvas.width = this.canvW;
        //     this.canvas.height = this.canvH;
        // }
        BasicSettings.prototype.resetCanvasToDefault = function () {
            canvas_1.style.borderColor = DEFAULT_PARAMS_1._BORDER_COLOR;
            canvas_1.style.borderWidth = DEFAULT_PARAMS_1._BORDER_WIDTH;
            canvas_1.style.borderRadius = DEFAULT_PARAMS_1._BORDER_RADIUS;
            canvas_1.style.borderStyle = DEFAULT_PARAMS_1._BORDER_STYLE;
        };
        BasicSettings.prototype.refreshCanvas = function () {
            ctx_1.clearRect(0, 0, canvas_1.width, canvas_1.height);
            this.setCanvas();
        };
        BasicSettings.prototype.changeAngleUnit = function (angleUnit) {
            MODIFIED_PARAMS_1._ANGLE_UNIT = angleUnit;
            MODIFIED_PARAMS_1._ANGLE_CONSTANT = this.angleUnit(angleUnit);
            MODIFIED_PARAMS_1._REVERSE_ANGLE_CONSTANT = this.revAngleUnit(angleUnit);
        };
        BasicSettings.prototype.setHandedness = function (value) {
            if (value === 'left')
                MODIFIED_PARAMS_1._HANDEDNESS_CONSTANT = -1;
            else if (value === 'right')
                MODIFIED_PARAMS_1._HANDEDNESS_CONSTANT = 1;
        };
        BasicSettings.prototype.angleUnit = function (angle_unit) {
            if (angle_unit === "deg")
                return Math.PI / 180; // deg to rad
            else if (angle_unit === "rad")
                return 1; // rad to rad
            else if (angle_unit === 'grad')
                return Math.PI / 200; // grad to rad
            else
                return _ERROR_._SETTINGS_ERROR_;
        };
        BasicSettings.prototype.revAngleUnit = function (angle_unit) {
            if (angle_unit === "deg")
                return 180 / Math.PI; // rad to deg
            else if (angle_unit === "rad")
                return 1; // rad to rad
            else if (angle_unit === 'grad')
                return 200 / Math.PI; // rad to grad
            else
                return _ERROR_._SETTINGS_ERROR_;
        };
        return BasicSettings;
    }());
    var _BasicSettings = new BasicSettings();
    var Miscellanous = /** @class */ (function () {
        function Miscellanous() {
        }
        // rad_to_deg();
        // rad_to_grad();
        // deg_to_rad();
        // deg_to_grad();
        // grad_to_rad();
        // grad_to_deg();
        Miscellanous.prototype.initDepthBuffer = function () {
            var elementNum = Math.ceil(MODIFIED_PARAMS_1._CANVAS_HEIGHT * MODIFIED_PARAMS_1._CANVAS_WIDTH);
            return new Float64Array(elementNum);
        };
        Miscellanous.prototype.resetDepthBuffer = function (depthBuffer) {
            return depthBuffer.fill(Infinity);
        };
        Miscellanous.prototype.initFrameBuffer = function () {
            var elementNum = Math.ceil(MODIFIED_PARAMS_1._CANVAS_HEIGHT * MODIFIED_PARAMS_1._CANVAS_WIDTH);
            return new Uint8Array(elementNum * 4);
        };
        Miscellanous.prototype.resetFrameBuffer = function (frameBuffer) {
            return frameBuffer.map(function (value, index) {
                var mod4 = index % 4;
                if (mod4 < 3) {
                    return value = 0;
                }
                else
                    return value = 255;
            });
        };
        Miscellanous.prototype.getParamAsList = function (maxPLen, paramList) {
            if (arguments.length === 2) {
                var key = "".concat(paramList, "-").concat(maxPLen);
                if (pListCache_1[key] !== undefined) {
                    return pListCache_1[key];
                }
                var count = 0;
                var compParamList = [];
                for (var _i = 0, paramList_1 = paramList; _i < paramList_1.length; _i++) {
                    var i = paramList_1[_i];
                    if (i < maxPLen) {
                        compParamList[count] = i;
                        count++;
                    }
                }
                pListCache_1[key] = compParamList;
                return compParamList;
            }
            return _ERROR_._MISCELLANOUS_ERROR_;
        };
        Miscellanous.prototype.getParamAsArg = function (maxPLen) {
            if (maxPLen === void 0) { maxPLen = Infinity; }
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            var key = "".concat(args, "-").concat(maxPLen);
            if (pArgCache_1[key] !== undefined) {
                return pArgCache_1[key];
            }
            if (arguments.length > 1 && arguments.length <= 4) {
                var start = 0;
                var end = maxPLen;
                var interval = 1;
                if (arguments.length === 2) {
                    if (arguments[1] !== undefined) {
                        end = Math.min(arguments[1], maxPLen);
                    }
                    else {
                        end = maxPLen;
                    }
                }
                else {
                    start = arguments[1] || 0;
                    if (arguments[1] !== undefined) {
                        end = Math.min(arguments[2], maxPLen);
                    }
                    else {
                        end = maxPLen;
                    }
                    interval = arguments[3] || 1;
                }
                var count = 0;
                var index = 0;
                var compParamList = [];
                for (var i = start; i < end; i++) {
                    index = start + (count * interval);
                    if (index < end) {
                        compParamList[count] = index;
                        count++;
                    }
                }
                pArgCache_1[key] = compParamList;
                return compParamList;
            }
            return _ERROR_._MISCELLANOUS_ERROR_;
        };
        Miscellanous.prototype.createArrayFromArgs = function (length) {
            var arr = new Array(length || 0), i = length;
            if (arguments.length > 1) {
                var args = Array.prototype.slice.call(arguments, 1);
                while (i--) {
                    arr[length - 1 - i] = this.createArrayFromArgs.apply(this, args);
                }
            }
            return arr;
        };
        Miscellanous.prototype.createArrayFromList = function (param) {
            var arr = new Array(param[0] || 0), i = param[0];
            if (param.length > 1) {
                var args = Array.prototype.slice.call(param, 1);
                while (i--) {
                    arr[param[0] - 1 - i] = this.createArrayFromArgs.apply(this, args);
                }
            }
            return arr;
        };
        Miscellanous.prototype.deepCopy = function (val) {
            var res = JSON.parse(JSON.stringify(val));
            if (typeof structuredClone === "function") {
                res = structuredClone(val);
            }
            return res;
        };
        Miscellanous.prototype.getSlope = function (A_, B_) {
            var numer = B_[0] - A_[0];
            var denum = B_[1] - A_[1];
            return numer / denum;
        };
        Miscellanous.prototype.getMid = function (a, b, paramList) {
            var ret = [];
            var count = 0;
            for (var _i = 0, paramList_2 = paramList; _i < paramList_2.length; _i++) {
                var val = paramList_2[_i];
                ret.push([(a[val] + b[val]) / 2]);
                count++;
            }
            return ret;
        };
        Miscellanous.prototype.getDist = function (a, b, paramList) {
            var ret = 0;
            var pLen = paramList.length;
            for (var val = 0; val < pLen; val++) {
                ret += Math.pow((a[val] - b[val]), 2);
            }
            return Math.sqrt(ret);
        };
        Miscellanous.prototype.getTriArea = function (a, b, c) {
            var S = (a + b + c) / 2;
            return Math.sqrt(S * (S - a) * (S - b) * (S - c));
        };
        Miscellanous.prototype.isInsideCirc = function (point, circle) {
            var x = Math.abs(point[0] - circle[0]);
            var y = Math.abs(point[1] - circle[1]);
            var r = circle[2];
            if ((Math.pow(x, 2) + Math.pow(y, 2)) <= Math.pow(r, 2)) {
                return true;
            }
            else
                return false;
        };
        return Miscellanous;
    }());
    var _Miscellenous_1 = new Miscellanous();
    var Quarternion = /** @class */ (function () {
        function Quarternion() {
            this.q_vector = DEFAULT_PARAMS_1._Q_VEC;
            this.q_quarternion = DEFAULT_PARAMS_1._Q_QUART;
            this.q_inv_quarternion = DEFAULT_PARAMS_1._Q_INV_QUART;
            this.theta = DEFAULT_PARAMS_1._THETA;
        }
        Quarternion.prototype.vector = function (input_vec) {
            // normalize flag to normalize vector (create a unit vector)
            if (this.normalize === false)
                this.q_vector = input_vec;
            else {
                var v1 = input_vec[0], v2 = input_vec[1], v3 = input_vec[2];
                var inv_mag = Math.pow(Math.pow(v1, 2) + Math.pow(v2, 2) + v3, -0.5);
                this.q_vector = [v1 * inv_mag, v2 * inv_mag, v3 * inv_mag];
            }
        };
        Quarternion.prototype.quarternion = function () {
            // quarternion
            var _a = this.q_vector, v1 = _a[0], v2 = _a[1], v3 = _a[2];
            var _b = [Math.cos(this.theta * 0.5), Math.sin(this.theta * 0.5)], a = _b[0], b = _b[1];
            this.q_quarternion = [a, v1 * b, v2 * b, v3 * b];
        };
        ;
        Quarternion.prototype.inv_quartenion = function () {
            // inverse quarternion           
            var _a = this.q_vector, v1 = _a[0], v2 = _a[1], v3 = _a[2];
            var _b = [Math.cos(this.theta * 0.5), Math.sin(this.theta * 0.5)], a = _b[0], b = _b[1];
            this.q_inv_quarternion = [a, -v1 * b, -v2 * b, -v3 * b];
        };
        ;
        Quarternion.prototype.q_mult = function (quart_A, quart_B) {
            // quarternion _ quarternion multiplication
            var w1 = quart_A[0], x1 = quart_A[1], y1 = quart_A[2], z1 = quart_A[3];
            var w2 = quart_B[0], x2 = quart_B[1], y2 = quart_B[2], z2 = quart_B[3];
            return [(w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2), (w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2), (w1 * y2 + y1 * w2 + z1 * x2 - x1 * z2), (w1 * z2 + z1 * w2 + x1 * y2 - y1 * x2)];
        };
        Quarternion.prototype.q_v_invq_mult = function (input_vec) {
            // quarternion _ vector _ inverse quarternion multiplication for point and vector rotation
            // with additional translating (for points) and scaling (for point and vectors) capabilities
            var output_vec = __spreadArray([0], input_vec, true);
            return this.q_mult(this.q_quarternion, this.q_mult(output_vec, this.q_inv_quarternion)).splice(1);
        };
        Quarternion.prototype.q_rot = function (_angle, _vector, _point) {
            if (_angle === void 0) { _angle = 0; }
            if (_vector === void 0) { _vector = [0, 0, 1]; }
            if (_point === void 0) { _point = [0, 0, 0]; }
            this.theta = MODIFIED_PARAMS_1._ANGLE_CONSTANT * _angle;
            this.vector(_vector);
            this.quarternion();
            this.inv_quartenion();
            return this.q_v_invq_mult(_point);
        };
        return Quarternion;
    }());
    var _Quartenion_1 = new Quarternion();
    var Matrix = /** @class */ (function () {
        function Matrix() {
        }
        // // Pitch
        // rotX(ang : number) : _16D_VEC_ {
        //     const angle = MODIFIED_PARAMS._ANGLE_CONSTANT*ang;
        //     return [1, 0, 0, 0, 0, Math.cos(angle), -Math.sin(angle) * MODIFIED_PARAMS._HANDEDNESS_CONSTANT, 0, 0, Math.sin(angle) * MODIFIED_PARAMS._HANDEDNESS_CONSTANT, Math.cos(angle), 0, 0, 0, 0, 1];
        // }
        // // Yaw
        // rotY(ang : number) : _16D_VEC_ {
        //     const angle = MODIFIED_PARAMS._ANGLE_CONSTANT*ang;
        //     return [Math.cos(angle), 0, Math.sin(angle) * MODIFIED_PARAMS._HANDEDNESS_CONSTANT, 0, 0, 1, 0, 0, -Math.sin(angle) * MODIFIED_PARAMS._HANDEDNESS_CONSTANT, 0, Math.cos(angle), 0, 0, 0, 0, 1];
        // }
        // //Roll
        // rotZ(ang : number) : _16D_VEC_ {
        //     const angle = MODIFIED_PARAMS._ANGLE_CONSTANT*ang;
        //     return [Math.cos(angle), -Math.sin(angle) * MODIFIED_PARAMS._HANDEDNESS_CONSTANT, 0, 0, Math.sin(angle) * MODIFIED_PARAMS._HANDEDNESS_CONSTANT, Math.cos(angle), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        // }
        // rot3d(x : number, y : number, z : number) : _16D_VEC_ {
        //     return this.matMult(this.rotZ(z), this.matMult(this.rotY(y), this.rotX(x), [4, 4], [4, 4]), [4, 4], [4, 4]) as _16D_VEC_;
        // };
        // transl3d(x : number, y : number, z : number) : _16D_VEC_ {
        //     return [1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1];
        // }
        // scale3dim(x : number, y : number, z : number) : _16D_VEC_ {
        //     return [x, 0, 0, 0, 0, y, 0, 0, 0, 0, z, 0, 0, 0, 0, 1];
        // }
        // setObjTransfMat(Sx, Sy, Sz, Rx, Ry, Rz, Tx, Ty, Tz) {
        //     // None of the scale parameters should equal zero as that would make the determinant of the matrix
        //     // equal to zero, thereby making it impossible to get the inverse of the matrix (Zero Division Error)
        //     if (Sx === 0) {
        //         Sx += 0.01;
        //     }
        //     if (Sy === 0) {
        //         Sy += 0.01;
        //     }
        //     if (Sz === 0) {
        //         Sz += 0.01;
        //     }
        //     this.objTransfMat = this.matMult(this.transl3d(Tx, Ty, Tz), this.matMult(this.rot3d(Rx, Ry, Rz), this.scale3dim(Sx, Sy, Sz), [4, 4], [4, 4]), [4, 4], [4, 4]);
        // }
        Matrix.prototype.matMult = function (matA, matB, shapeA, shapeB) {
            if (shapeA[1] !== shapeB[0])
                return _ERROR_._MATRIX_ERROR_;
            else {
                var matC = [];
                for (var i = 0; i < shapeA[0]; i++) {
                    for (var j = 0; j < shapeB[1]; j++) {
                        var sum = 0;
                        for (var k = 0; k < shapeB[0]; k++) {
                            sum += matA[(i * shapeA[1]) + k] * matB[(k * shapeB[1]) + j];
                        }
                        matC.push(sum);
                    }
                }
                return matC;
            }
        };
        Matrix.prototype.scaMult = function (scalarVal, matIn, leaveLast) {
            if (leaveLast === void 0) { leaveLast = false; }
            var matInlen = matIn.length;
            var matOut = [];
            for (var i = 0; i < matInlen; i++) {
                if (i === matInlen - 1 && leaveLast === true) {
                    // Do nothing...don't multiply the last matrix value by the scalar value
                    // useful when perspective division is going on.
                    matOut.push(matIn[i]);
                }
                else {
                    matOut.push(matIn[i] * scalarVal);
                }
            }
            return matOut;
        };
        Matrix.prototype.matAdd = function (matA, matB, neg) {
            if (neg === void 0) { neg = false; }
            var matC = [];
            var matAlen = matA.length;
            var matBlen = matB.length;
            var sgn = 1;
            if (neg === true) {
                sgn = -1;
            }
            if (matAlen === matBlen) {
                for (var i = 0; i < matAlen; i++) {
                    matC.push(matA[i] + sgn * matB[i]);
                }
            }
            return matC;
        };
        Matrix.prototype.getTranspMat = function (matIn, shapeMat) {
            var shpA = shapeMat[0];
            var shpB = shapeMat[1];
            var matOut = [];
            for (var i = 0; i < shpB; i++) {
                for (var j = 0; j < shpA; j++) {
                    matOut.push(matIn[(j * shpB) + i]);
                }
            }
            return matOut;
        };
        Matrix.prototype.getIdentMat = function (val) {
            var num = Math.pow(val, 2);
            var matOut = [];
            for (var i = 0; i < num; i++) {
                if (i % val === 0) {
                    matOut.push(1);
                }
                else
                    matOut.push(0);
            }
            return matOut;
        };
        Matrix.prototype.getRestMat = function (matIn, shapeNum, row, column) {
            var matOut = [];
            for (var i = 0; i < shapeNum; i++) {
                for (var j = 0; j < shapeNum; j++) {
                    if (i !== row && j !== column) {
                        matOut.push(matIn[(i * shapeNum) + j]);
                    }
                }
            }
            return matOut;
        };
        Matrix.prototype.getDet = function (matIn, shapeNum) {
            if (shapeNum > 0) {
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
                    var tmp = [];
                    for (var i = 0; i < shapeNum; i++) {
                        tmp.push(matIn[i]);
                    }
                    var cofMatSgn = this.getCofSgnMat([1, shapeNum]);
                    var a = 0;
                    var cofLen = cofMatSgn.length;
                    for (var i = 0; i < cofLen; i++) {
                        var ret = this.getRestMat(matIn, shapeNum, a, i);
                        var verify = this.getDet(ret, shapeNum - 1);
                        verify = verify > _ERROR_._NO_ERROR_ ? verify : 1;
                        res += (cofMatSgn[i] * tmp[i] * verify);
                    }
                    return res;
                }
            }
            else
                return _ERROR_._MATRIX_ERROR_ + _ERROR_MATRIX_._DET_ * 10;
        };
        Matrix.prototype.getMinorMat = function (matIn, shapeNum) {
            var matOut = [];
            for (var i = 0; i < shapeNum; i++) {
                for (var j = 0; j < shapeNum; j++) {
                    var result = this.getDet(this.getRestMat(matIn, shapeNum, i, j), shapeNum - 1);
                    if (result > _ERROR_._NO_ERROR_)
                        return result + _ERROR_MATRIX_._MINOR_ * 100;
                    matOut.push(result);
                }
            }
            return matOut;
        };
        Matrix.prototype.getCofSgnMat = function (shapeMat) {
            var shpA = shapeMat[0];
            var shpB = shapeMat[1];
            var matOut = [];
            for (var i = 0; i < shpA; i++) {
                for (var j = 0; j < shpB; j++) {
                    if ((i + j) % 2 === 0) {
                        matOut.push(1);
                    }
                    else
                        matOut.push(-1);
                }
            }
            return matOut;
        };
        Matrix.prototype.getCofMat = function (matIn, shapeNum) {
            var cofMatSgn = this.getCofSgnMat([shapeNum, shapeNum]);
            var _minorMat = this.getMinorMat(matIn, shapeNum);
            if (typeof _minorMat === "number")
                if (_minorMat > _ERROR_._NO_ERROR_)
                    return _minorMat + _ERROR_MATRIX_._COF_ * 1000;
            var minorMat = _minorMat;
            var matOut = [];
            var len = Math.pow(shapeNum, 2);
            for (var i = 0; i < len; i++) {
                matOut.push(cofMatSgn[i] * minorMat[i]);
            }
            return matOut;
        };
        Matrix.prototype.getAdjMat = function (matIn, shapeNum) {
            var result = this.getCofMat(matIn, shapeNum);
            if (typeof result === "number")
                if (result > _ERROR_._NO_ERROR_)
                    return result + _ERROR_MATRIX_._ADJ_ * 10000;
            return this.getTranspMat(result, [shapeNum, shapeNum]);
        };
        Matrix.prototype.getInvMat = function (matIn, shapeNum) {
            var det_result = this.getDet(matIn, shapeNum);
            if (det_result > _ERROR_._NO_ERROR_)
                return det_result + _ERROR_MATRIX_._INV_ * 100000;
            var adj_result = this.getAdjMat(matIn, shapeNum);
            if (typeof adj_result === "number")
                if (adj_result > _ERROR_._NO_ERROR_)
                    return adj_result + _ERROR_MATRIX_._INV_ * 100000;
            return _Matrix_1.scaMult(1 / det_result, adj_result);
        };
        return Matrix;
    }());
    var _Matrix_1 = new Matrix();
    var Vector = /** @class */ (function () {
        function Vector() {
        }
        Vector.prototype.mag = function (vec) {
            var v_len = vec.length;
            var magnitude = 0;
            for (var i = 0; i < v_len; i++) {
                magnitude += Math.pow(vec[i], 2);
            }
            return Math.sqrt(magnitude);
        };
        Vector.prototype.normalizeVec = function (vec) {
            var len = Math.round(vec.length);
            var magnitude = this.mag(vec);
            var ret_vec = [];
            for (var i = 0; i < len; i++) {
                ret_vec[i] = vec[i] / magnitude;
            }
            return ret_vec;
        };
        Vector.prototype.dotProduct = function (vecA_or_magA, vecB_or_magB, angle) {
            // Can be:
            //          1. two vectors without an angle (angle is undefined and vectors are 2d vectors or higher).
            //          2. two magnitudes (magnitude of two vectors) with an angle (angle is a number).
            if (angle === void 0) { angle = undefined; }
            // Use vectors if you know the components e.g [x,y] values for 2d vectors, [x,y,z] values for 3d vectors and so on.
            // Use magnitudes and an angle if you know the magnitudes of the vectors and the angle between the two vectors.
            if (typeof angle === "number") { // Magnitude use.
                var toRad = MODIFIED_PARAMS_1._ANGLE_CONSTANT * angle;
                return vecA_or_magA * vecB_or_magB * Math.cos(toRad);
            }
            if (typeof angle !== "undefined") { // Vector use.
                return _ERROR_._VECTOR_ERROR_;
            }
            var vec_a_len = vecA_or_magA.length;
            var vec_b_len = vecB_or_magB.length;
            //verify first that both vectors are of the same size and both are 2d or higher.
            if (vec_a_len === vec_b_len && vec_b_len >= 2) {
                var dot_product = 0;
                for (var i = 0; i < vec_a_len; i++) {
                    dot_product += vecA_or_magA[i] * vecB_or_magB[i];
                }
                return dot_product;
            }
            return _ERROR_._VECTOR_ERROR_;
        };
        Vector.prototype.getDotProductAngle = function (vecA, vecB) {
            var dot_product = this.dotProduct(vecA, vecB);
            var cosAng = Math.acos(dot_product / (this.mag(vecA) * this.mag(vecB)));
            return MODIFIED_PARAMS_1._REVERSE_ANGLE_CONSTANT * cosAng;
        };
        Vector.prototype.getCrossProductByMatrix = function (vecs, vecs_len) {
            var cross_product = [];
            var proper_vec_len = vecs_len + 1; // All the vectors should be the same dimension with n + 1, where n is the number of vectors.
            var matrix_array_top_row = [];
            for (var i = 0; i < proper_vec_len; i++) {
                matrix_array_top_row[i] = 0; // Actually the number 0 is just a placeholder as we don't need any numbers here but we put 0 to make it a number array.
            }
            var same_shape = 0; // If this variable is still equal to zero by the end of subsequent computations,
            // it means that all the vectors are of dimenstion n + 1
            var other_rows_array = [];
            for (var i = 0; i < vecs_len; i++) {
                var vec_len = vecs[i].length;
                if (vec_len !== proper_vec_len)
                    same_shape++; // If a vector is not the same dimension with n + 1,
                // increment the same_shape variable to capture this error.
                else
                    other_rows_array.push.apply(other_rows_array, vecs[i]); // Else if the vector is the same dimension with n + 1, push the vector to a matrix array.
            }
            if (same_shape === 0) { // All the vectors are the same dimension of n + 1.
                var matrix_array = __spreadArray(__spreadArray([], matrix_array_top_row, true), other_rows_array, true);
                var storeCofSgn = _Matrix_1.getCofSgnMat([proper_vec_len, 1]);
                for (var i = 0; i < proper_vec_len; i++) {
                    var rest_matrix_array = _Matrix_1.getRestMat(matrix_array, proper_vec_len, 0, i);
                    cross_product[i] = storeCofSgn[i] * _Matrix_1.getDet(rest_matrix_array, vecs_len);
                }
            }
            return cross_product;
        };
        Vector.prototype.crossProduct = function (vecs_or_mags, angle, unitVec) {
            if (angle === void 0) { angle = undefined; }
            if (unitVec === void 0) { unitVec = undefined; }
            var cross_product = [];
            var vecs_or_mags_len = vecs_or_mags.length;
            // Can be:
            //          1. two vectors without an angle (angle is undefined and vectors are 3d vectors or higher).
            //          2. two magnitudes (magnitude of two vectors) with an angle (angle is a number).
            // Use vectors if you know the components e.g [x,y,z] values for 3d vectors, [w,x,y,z] values for 4d vectors and so on.
            // Use magnitudes and an angle if you know the magnitudes of the vectors and the angle between the two vectors.
            if (typeof angle === "undefined") { // Vector use.
                cross_product = __spreadArray([], this.getCrossProductByMatrix(vecs_or_mags, vecs_or_mags_len), true);
            }
            if (typeof angle === "number") { // Magnitude use.
                var magnitude = 1; // initial magnitude place holder
                var toRad = MODIFIED_PARAMS_1._ANGLE_CONSTANT * angle;
                for (var i = 0; i < vecs_or_mags_len; i++) {
                    magnitude *= vecs_or_mags[i];
                }
                if (typeof unitVec === "undefined")
                    cross_product = magnitude * Math.sin(toRad);
                else if (typeof unitVec === "object")
                    cross_product = _Matrix_1.scaMult(magnitude * Math.sin(toRad), unitVec);
            }
            return cross_product;
        };
        Vector.prototype.getCrossProductAngle = function (vecs) {
            var cross_product_angle = undefined;
            var vecs_len = vecs.length;
            var proper_vec_len = vecs_len + 1; // All the vectors should be the same dimension with n + 1, where n is the number of vectors.
            var same_shape = 0; // If this variable is still equal to zero by the end of subsequent computations,
            // it means that all the vectors are of dimenstion n + 1
            var cross_product_mag = this.mag(this.crossProduct(vecs));
            var vecs_m = 1;
            for (var i = 0; i < vecs_len; i++) {
                var vec_len = vecs[i].length;
                if (vec_len !== proper_vec_len)
                    same_shape++; // If a vector is not the same dimension with n + 1,
                // increment the same_shape variable to capture this error.
                else
                    vecs_m *= this.mag(vecs[i]);
            }
            if (same_shape === 0) {
                var sinAng = Math.asin(cross_product_mag / vecs_m);
                var fromRad = MODIFIED_PARAMS_1._REVERSE_ANGLE_CONSTANT * sinAng;
                cross_product_angle = fromRad;
            }
            return typeof cross_product_angle === "undefined" ? cross_product_angle = _ERROR_._VECTOR_ERROR_ : cross_product_angle;
        };
        Vector.prototype.getCrossPUnitVec = function (vecs) {
            var cross_product_unit_vec = [];
            var cross_product = this.crossProduct(vecs);
            var cross_product_mag = this.mag(cross_product);
            cross_product_unit_vec = _Matrix_1.scaMult(1 / cross_product_mag, cross_product);
            return cross_product_unit_vec;
        };
        return Vector;
    }());
    var _Vector_1 = new Vector();
    var PerspectiveProjection = /** @class */ (function () {
        function PerspectiveProjection() {
        }
        PerspectiveProjection.prototype.changeNearZ = function (val) {
            MODIFIED_PARAMS_1._NZ = -val; // right to left hand coordinate system
            this.setPersProjectParam();
        };
        PerspectiveProjection.prototype.changeFarZ = function (val) {
            MODIFIED_PARAMS_1._FZ = -val; // right to left hand coordinate system
            this.setPersProjectParam();
        };
        PerspectiveProjection.prototype.changeProjAngle = function (val) {
            MODIFIED_PARAMS_1._PROJ_ANGLE = val;
            this.setPersProjectParam();
        };
        PerspectiveProjection.prototype.setPersProjectParam = function () {
            if (MODIFIED_PARAMS_1._ASPECT_RATIO > _ERROR_._NO_ERROR_)
                return _ERROR_._PERSPECTIVE_PROJ_ERROR_;
            MODIFIED_PARAMS_1._DIST = 1 / (Math.tan(MODIFIED_PARAMS_1._PROJ_ANGLE / 2 * MODIFIED_PARAMS_1._ANGLE_CONSTANT));
            MODIFIED_PARAMS_1._PROJECTION_MAT = [MODIFIED_PARAMS_1._DIST / MODIFIED_PARAMS_1._ASPECT_RATIO, 0, 0, 0, 0, MODIFIED_PARAMS_1._DIST, 0, 0, 0, 0, (-MODIFIED_PARAMS_1._NZ - MODIFIED_PARAMS_1._FZ) / (MODIFIED_PARAMS_1._NZ - MODIFIED_PARAMS_1._FZ), (2 * MODIFIED_PARAMS_1._FZ * MODIFIED_PARAMS_1._NZ) / (MODIFIED_PARAMS_1._NZ - MODIFIED_PARAMS_1._FZ), 0, 0, 1, 0];
            var inverse_res = _Matrix_1.getInvMat(MODIFIED_PARAMS_1._PROJECTION_MAT, 4);
            if (typeof inverse_res === "number")
                return _ERROR_._PERSPECTIVE_PROJ_ERROR_;
            if (inverse_res.length !== 16)
                return _ERROR_._PERSPECTIVE_PROJ_ERROR_;
            MODIFIED_PARAMS_1._INV_PROJECTION_MAT = inverse_res;
        };
        PerspectiveProjection.prototype.persProject = function (input_array) {
            return _Matrix_1.matMult(MODIFIED_PARAMS_1._PROJECTION_MAT, input_array, [4, 4], [4, 1]);
        };
        PerspectiveProjection.prototype.invPersProject = function (input_array) {
            return _Matrix_1.matMult(MODIFIED_PARAMS_1._INV_PROJECTION_MAT, input_array, [4, 4], [4, 1]);
        };
        return PerspectiveProjection;
    }());
    var _PerspectiveProjection = new PerspectiveProjection();
    var Clip = /** @class */ (function () {
        function Clip() {
        }
        Clip.prototype.canvasTo = function (arr) {
            var array = __spreadArray([], arr, true);
            array[0] -= MODIFIED_PARAMS_1._HALF_X;
            array[1] -= MODIFIED_PARAMS_1._HALF_Y;
            return array;
        };
        Clip.prototype.clipCoords = function (arr) {
            var array = __spreadArray([], arr, true);
            array[0] /= MODIFIED_PARAMS_1._HALF_X;
            array[1] /= MODIFIED_PARAMS_1._HALF_Y;
            return array;
        };
        Clip.prototype.toCanvas = function (arr) {
            var array = __spreadArray([], arr, true);
            array[0] += MODIFIED_PARAMS_1._HALF_X;
            array[1] += MODIFIED_PARAMS_1._HALF_Y;
            return array;
        };
        Clip.prototype.unclipCoords = function (arr) {
            var array = __spreadArray([], arr, true);
            array[0] *= MODIFIED_PARAMS_1._HALF_X;
            array[1] *= MODIFIED_PARAMS_1._HALF_Y;
            return array;
        };
        return Clip;
    }());
    var _Clip_1 = new Clip();
    var LocalSpace = /** @class */ (function () {
        function LocalSpace() {
        }
        ;
        LocalSpace.prototype.objectRotate = function (point, axis, angle, state) {
            if (state === "local" || state === "object")
                return _Quartenion_1.q_rot(angle, axis, point);
        };
        ;
        LocalSpace.prototype.ObjectScale = function (point, scaling_array, state) {
            if (state === "local" || state === "object")
                return [point[0] * scaling_array[0], point[1] * scaling_array[1], point[2] * scaling_array[2]];
        };
        return LocalSpace;
    }());
    var _LocalSpace = new LocalSpace();
    var WorldSpace = /** @class */ (function () {
        function WorldSpace() {
        }
        WorldSpace.prototype.ObjectTransform = function (point, translation_array, state) {
            if (state === "world")
                return _Matrix_1.matAdd(point, translation_array);
        };
        ;
        WorldSpace.prototype.objectRevolve = function (point, axis, angle, state) {
            if (state === "world")
                return _Quartenion_1.q_rot(angle, axis, point);
        };
        return WorldSpace;
    }());
    var _WorldSpace = new WorldSpace();
    var OpticalElement_1 = /** @class */ (function () {
        function OpticalElement(optical_type_input) {
            // Default
            // _CAM_MATRIX : [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
            // _INV_CAM_MATRIX : [1, -0, 0, -0, -0, 1, -0, 0, 0, -0, 1, -0, -0, 0, -0, 1],
            // actpos = [0,0,1],
            // usedpos = [0,0,-1]
            this.instance = {
                instance_number: 0,
                optical_type: "none",
                _ACTUAL_POS: [0, 0, 0],
                _USED_POS: [0, 0, 0],
                _LOOK_AT_POINT: [0, 0, 0],
                _U: [0, 0, 0],
                _V: [0, 0, 0],
                _N: [0, 0, 0],
                _C: [0, 0, 0],
                _MATRIX: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
                _INV_MATRIX: _Matrix_1.getInvMat([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], 4),
                depthBuffer: _Miscellenous_1.initDepthBuffer(),
                frameBuffer: _Miscellenous_1.initFrameBuffer(),
            };
            this.instance.optical_type = optical_type_input;
            return this;
        }
        OpticalElement.prototype.resetBuffers = function () {
            _Miscellenous_1.resetDepthBuffer(this.instance.depthBuffer);
            _Miscellenous_1.resetFrameBuffer(this.instance.frameBuffer);
        };
        OpticalElement.prototype.setPos = function (input_array) {
            this.instance._ACTUAL_POS = input_array;
            this.instance._USED_POS = input_array;
            this.instance._USED_POS[2] = -this.instance._USED_POS[2]; // reverse point for right to left hand coordinate system
        };
        OpticalElement.prototype.setCoordSystem = function () {
            var DIFF = _Matrix_1.matAdd(this.instance._LOOK_AT_POINT, this.instance._USED_POS, true);
            var UP = [0, 1, 0];
            this.instance._N = _Vector_1.normalizeVec(DIFF);
            this.instance._U = _Vector_1.normalizeVec(_Vector_1.crossProduct([UP, this.instance._N]));
            this.instance._V = _Vector_1.normalizeVec(_Vector_1.crossProduct([this.instance._N, this.instance._U]));
        };
        OpticalElement.prototype.setConversionMatrices = function () {
            this.instance._MATRIX = __spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray(__spreadArray([], this.instance._U, true), [this.instance._C[0]], false), this.instance._V, true), [this.instance._C[1]], false), this.instance._N, true), [this.instance._C[2]], false), [0, 0, 0, 1], false);
            this.instance._INV_MATRIX = _Matrix_1.getInvMat(this.instance._MATRIX, 4);
        };
        OpticalElement.prototype.setLookAtPos = function (look_at_point) {
            look_at_point[2] = -look_at_point[2]; // reverse point for right to left hand coordinate system
            this.instance._LOOK_AT_POINT = look_at_point;
            this.setCoordSystem();
            this.setConversionMatrices();
        };
        OpticalElement.prototype.rotate = function (plane, angle) {
            if (plane === "U-V") {
                var _U_N = _Quartenion_1.q_rot(angle, this.instance._U, this.instance._N);
                var _V_N = _Quartenion_1.q_rot(angle, this.instance._V, this.instance._N);
                if (typeof _U_N === "number")
                    return _ERROR_._OPTICAL_ELEMENT_OBJECT_ERROR_;
                if (typeof _V_N === "number")
                    return _ERROR_._OPTICAL_ELEMENT_OBJECT_ERROR_;
                this.instance._U = _U_N;
                this.instance._V = _V_N;
            }
            else if (plane === "U-N") {
                var _U_V = _Quartenion_1.q_rot(angle, this.instance._U, this.instance._V);
                var _V_N = _Quartenion_1.q_rot(angle, this.instance._V, this.instance._N);
                if (typeof _U_V === "number")
                    return _ERROR_._OPTICAL_ELEMENT_OBJECT_ERROR_;
                if (typeof _V_N === "number")
                    return _ERROR_._OPTICAL_ELEMENT_OBJECT_ERROR_;
                this.instance._U = _U_V;
                this.instance._V = _V_N;
            }
            else if (plane === "V-N") {
                var _U_V = _Quartenion_1.q_rot(angle, this.instance._U, this.instance._V);
                var _U_N = _Quartenion_1.q_rot(angle, this.instance._U, this.instance._N);
                if (typeof _U_V === "number")
                    return _ERROR_._OPTICAL_ELEMENT_OBJECT_ERROR_;
                if (typeof _U_N === "number")
                    return _ERROR_._OPTICAL_ELEMENT_OBJECT_ERROR_;
                this.instance._U = _U_V;
                this.instance._V = _U_N;
            }
            this.setConversionMatrices();
        };
        OpticalElement.prototype.translate = function (translation_array) {
            this.instance._C = translation_array;
            this.instance._ACTUAL_POS = _Matrix_1.matAdd(this.instance._ACTUAL_POS, translation_array);
            this.instance._USED_POS = __spreadArray([], this.instance._ACTUAL_POS, true);
            this.instance._USED_POS[2] = -this.instance._ACTUAL_POS[2]; // reverse point for right to left hand coordinate system
            this.setCoordSystem();
            this.setConversionMatrices();
        };
        OpticalElement.prototype.worldToOpticalObject = function (ar) {
            var arr = __spreadArray(__spreadArray([], ar, true), [1], false);
            arr[2] = -arr[2]; // reverse point for right to left hand coordinate system
            var result = _Matrix_1.matMult(this.instance._MATRIX, arr, [4, 4], [4, 1]);
            return result;
        };
        OpticalElement.prototype.opticalObjectToWorld = function (arr) {
            var result = _Matrix_1.matMult(this.instance._INV_MATRIX, arr, [4, 4], [4, 1]);
            result[2] = -result[2]; // reverse point for left to right hand coordinate system
            var new_result = result.slice(0, 3);
            return new_result;
        };
        return OpticalElement;
    }());
    var ClipSpace = /** @class */ (function () {
        function ClipSpace() {
        }
        ;
        ClipSpace.prototype.opticalObjectToClip = function (arr) {
            var orig_proj = _Matrix_1.matMult(MODIFIED_PARAMS_1._PROJECTION_MAT, arr, [4, 4], [4, 1]);
            var pers_div = _Matrix_1.scaMult(1 / orig_proj[3], orig_proj, true);
            return pers_div;
        };
        ;
        ClipSpace.prototype.clipToOpticalObject = function (arr) {
            var rev_pers_div = _Matrix_1.scaMult(arr[3], arr, true);
            var rev_orig_proj = _Matrix_1.matMult(MODIFIED_PARAMS_1._INV_PROJECTION_MAT, rev_pers_div, [4, 4], [4, 1]);
            return rev_orig_proj;
        };
        ;
        return ClipSpace;
    }());
    var _ClipSpace_1 = new ClipSpace();
    var ScreenSpace = /** @class */ (function () {
        function ScreenSpace() {
        }
        ;
        ScreenSpace.prototype.clipToScreen = function (arr) {
            if (arr[2] >= -1.1 && arr[2] <= 1.1 && arr[2] != Infinity) {
                arr[2] = -arr[2];
                // -array[2] (-z) reverse point for left to right hand coordinate system
                var _a = _Clip_1.unclipCoords(arr), i = _a[0], j = _a[1], k = _a[2], l = _a[3];
                var _b = _Clip_1.toCanvas([i, j, k, l]), x = _b[0], y = _b[1], z = _b[2], w = _b[3];
                return [x, y, z, w];
            }
            else
                return _ERROR_._SCREEN_SPACE_ERROR_;
        };
        ;
        ScreenSpace.prototype.screenToClip = function (arr) {
            var _a = _Clip_1.canvasTo(arr), i = _a[0], j = _a[1], k = _a[2], l = _a[3];
            var _b = _Clip_1.clipCoords([i, j, k, l]), x = _b[0], y = _b[1], z = _b[2], w = _b[3];
            // -array[2] (-z) reverse point for right to left hand coordinate system
            return [x, y, -z, w];
        };
        ;
        return ScreenSpace;
    }());
    var _ScreenSpace_1 = new ScreenSpace();
    var OpticalElement_Objects = /** @class */ (function () {
        function OpticalElement_Objects() {
            var _this = this;
            this.createNewMultipleCameraObjects = function (num) { if (num > 0)
                while (num > 0) {
                    _this.createNewCameraObject();
                    num--;
                } };
            this.createNewMultipleLightObjects = function (num) { if (num > 0)
                while (num > 0) {
                    _this.createNewLightObject();
                    num--;
                } };
            this.arrlen = 0;
            this.instance_number = 0;
            this.selected_light_instances = {};
            this.selected_camera_instances = {};
            this.createNewCameraObject();
            this.createNewCameraObject();
        }
        OpticalElement_Objects.prototype.createNewCameraObject = function () {
            this.max_camera_instance_number = this.instance_number;
            this.optical_element_array[this.arrlen] = new OpticalElement_1("camera");
            this.instance_number_to_list_map[this.instance_number] = this.arrlen;
            this.instance_number++;
            this.arrlen++;
        };
        OpticalElement_Objects.prototype.createNewLightObject = function () {
            this.max_light_instance_number = this.instance_number;
            this.optical_element_array[this.arrlen] = new OpticalElement_1("light");
            this.instance_number_to_list_map[this.instance_number] = this.arrlen;
            this.instance_number++;
            this.arrlen++;
        };
        OpticalElement_Objects.prototype.deleteOpticalObject = function (instance_number_input, index) {
            this.optical_element_array.splice(index, 1);
            delete this.instance_number_to_list_map[instance_number_input];
            for (var key in this.instance_number_to_list_map) {
                if (Number(key) > instance_number_input) {
                    this.instance_number_to_list_map[key] = this.instance_number_to_list_map[key] - 1;
                }
            }
            if (instance_number_input in this.selected_camera_instances)
                delete this.selected_camera_instances[instance_number_input];
            if (instance_number_input in this.selected_light_instances)
                delete this.selected_light_instances[instance_number_input];
            if (Object.keys(this.selected_camera_instances).length === 0)
                this.selected_camera_instances[0] = 0;
            if (Object.keys(this.selected_light_instances).length === 0)
                this.selected_light_instances[1] = 1;
        };
        OpticalElement_Objects.prototype.deleteCameraObject = function (instance_number_input) {
            if (instance_number_input > 1 && instance_number_input <= this.max_camera_instance_number) {
                var index = this.instance_number_to_list_map[instance_number_input];
                if (this.optical_element_array[index].instance.optical_type === "camera") // additional safety checks
                 {
                    this.deleteOpticalObject(instance_number_input, index);
                    this.arrlen = this.optical_element_array.length;
                }
            }
        };
        OpticalElement_Objects.prototype.deleteLightObject = function (instance_number_input) {
            if (instance_number_input > 1 && instance_number_input <= this.max_light_instance_number) {
                var index = this.instance_number_to_list_map[instance_number_input];
                if (this.optical_element_array[index].instance.optical_type === "light") // additional safety checks
                 {
                    this.deleteOpticalObject(instance_number_input, index);
                    this.arrlen = this.optical_element_array.length;
                }
            }
        };
        // doesn't delete the first one
        OpticalElement_Objects.prototype.deleteAllCameraObjects = function () {
            for (var key in this.instance_number_to_list_map) {
                var index = this.instance_number_to_list_map[key];
                if (index > 1 && this.optical_element_array[index].instance.optical_type === "camera") {
                    this.deleteOpticalObject(Number(key), index);
                }
            }
            this.arrlen = this.optical_element_array.length;
        };
        // doesn't delete the first one
        OpticalElement_Objects.prototype.deleteAllLightObjects = function () {
            for (var key in this.instance_number_to_list_map) {
                var index = this.instance_number_to_list_map[key];
                if (index > 1 && this.optical_element_array[index].instance.optical_type === "light") {
                    this.deleteOpticalObject(Number(key), index);
                }
            }
            this.arrlen = this.optical_element_array.length;
        };
        // doesn't delete the first two
        OpticalElement_Objects.prototype.deleteAllOpticalObjects = function () {
            for (var key in this.instance_number_to_list_map) {
                var index = this.instance_number_to_list_map[key];
                if (index > 1) {
                    this.deleteOpticalObject(Number(key), index);
                }
            }
            this.arrlen = this.optical_element_array.length;
        };
        OpticalElement_Objects.prototype.select_camera_instance = function (instance_number_input) {
            if (instance_number_input !== 1 && instance_number_input <= this.max_camera_instance_number) {
                var selection = this.instance_number_to_list_map[instance_number_input];
                if (this.optical_element_array[selection].instance.optical_type === "camera")
                    this.selected_camera_instances[instance_number_input] = selection;
            }
        };
        OpticalElement_Objects.prototype.deselect_camera_instance = function (instance_number_input) {
            if (instance_number_input !== 1 && instance_number_input <= this.max_camera_instance_number) {
                if (instance_number_input in this.selected_camera_instances) {
                    var selection = this.instance_number_to_list_map[instance_number_input];
                    if (this.optical_element_array[selection].instance.optical_type === "camera")
                        delete this.selected_camera_instances[instance_number_input];
                    if (Object.keys(this.selected_camera_instances).length === 0) {
                        this.selected_camera_instances[0] = 0;
                        if (instance_number_input === 0)
                            return _ERROR_._OPTICAL_ELEMENT_OBJECT_ERROR_;
                    }
                }
            }
        };
        OpticalElement_Objects.prototype.select_light_instance = function (instance_number_input) {
            if (instance_number_input !== 0 && instance_number_input <= this.max_light_instance_number) {
                var selection = this.instance_number_to_list_map[instance_number_input];
                if (this.optical_element_array[selection].instance.optical_type === "light")
                    this.selected_light_instances[instance_number_input] = selection;
            }
        };
        OpticalElement_Objects.prototype.deselect_light_instance = function (instance_number_input) {
            if (instance_number_input !== 0 && instance_number_input <= this.max_light_instance_number) {
                if (instance_number_input in this.selected_light_instances) {
                    var selection = this.instance_number_to_list_map[instance_number_input];
                    if (this.optical_element_array[selection].instance.optical_type === "light")
                        delete this.selected_light_instances[instance_number_input];
                    if (Object.keys(this.selected_light_instances).length === 0) {
                        this.selected_light_instances[1] = 1;
                        if (instance_number_input === 1)
                            return _ERROR_._OPTICAL_ELEMENT_OBJECT_ERROR_;
                    }
                }
            }
        };
        OpticalElement_Objects.prototype.render = function (vertex, optical_type) {
            var world_to_optical_object_space = [0, 0, 0, 0];
            switch (optical_type) {
                case "none": return _ERROR_._OPTICAL_ELEMENT_OBJECT_ERROR_;
                case "camera": world_to_optical_object_space = this.optical_element_array[this.selected_camera_instances[0]].worldToOpticalObject(vertex);
                case "light": world_to_optical_object_space = this.optical_element_array[this.selected_light_instances[0]].worldToOpticalObject(vertex);
            }
            var optical_object_to_clip_space = _ClipSpace_1.opticalObjectToClip(world_to_optical_object_space);
            return _ScreenSpace_1.clipToScreen(optical_object_to_clip_space);
        };
        return OpticalElement_Objects;
    }());
    var _Optical_Objects = new OpticalElement_Objects();
    var ObjectManager = /** @class */ (function () {
        function ObjectManager() {
        }
        return ObjectManager;
    }());
    var PointLight = /** @class */ (function () {
        function PointLight() {
        }
        return PointLight;
    }());
    var DirectionalLight = /** @class */ (function () {
        function DirectionalLight() {
        }
        return DirectionalLight;
    }());
    var SpotLight = /** @class */ (function () {
        function SpotLight() {
        }
        return SpotLight;
    }());
    var AreaLight = /** @class */ (function () {
        function AreaLight() {
        }
        return AreaLight;
    }());
    var AmbientLight = /** @class */ (function () {
        function AmbientLight() {
        }
        return AmbientLight;
    }());
    var AmbientLighting = /** @class */ (function () {
        function AmbientLighting() {
        }
        return AmbientLighting;
    }());
    var DiffuseLighting = /** @class */ (function () {
        function DiffuseLighting() {
        }
        return DiffuseLighting;
    }());
    var SpecularLighting = /** @class */ (function () {
        function SpecularLighting() {
        }
        return SpecularLighting;
    }());
    var FlatShading = /** @class */ (function () {
        function FlatShading() {
        }
        return FlatShading;
    }());
    var GouraudShading = /** @class */ (function () {
        function GouraudShading() {
        }
        return GouraudShading;
    }());
    var PhongShading = /** @class */ (function () {
        function PhongShading() {
        }
        return PhongShading;
    }());
    var BlinnPhongShading = /** @class */ (function () {
        function BlinnPhongShading() {
        }
        return BlinnPhongShading;
    }());
    //   class RENDER {
    //     kernel_Size : number;
    //     sigma_xy : number;
    //     sampleArr : any [];
    //     TotalArea : number;
    //     triA : number;
    //     triB : number;
    //     triC : number;
    //     aRatio: number;
    //     bRatio : number;
    //     cRatio : number;
    //     opacityCoeff : number;
    //     avec : _3D_VEC_;
    //     bvec : _3D_VEC_;
    //     cvec : _3D_VEC_;
    //     colA : _4D_VEC_;
    //     colB : _4D_VEC_;
    //     colC : _4D_VEC_;
    //     constructor() {
    //         this.kernel_Size = 3;
    //         this.sigma_xy = 1;
    //         this.sampleArr = [];
    //         this.TotalArea = 0;
    //         this.triA = 0;
    //         this.triB = 0;
    //         this.triC = 0;
    //         this.aRatio = 0;
    //         this.bRatio = 0;
    //         this.cRatio = 0;
    //         this.opacityCoeff = 0;
    //         this.avec = [0, 0, 0];
    //         this.bvec = [0, 0, 0];
    //         this.cvec = [0, 0, 0];
    //         this.colA = [0, 0, 0, 0];
    //         this.colB = [0, 0, 0, 0];
    //         this.colC = [0, 0, 0, 0];
    //         this.sample();
    //     }
    //     initParams(...vertArray : _3_7_MAT_) {
    //         this.avec = vertArray[0].slice(0, 3) as _3D_VEC_;
    //         this.bvec = vertArray[1].slice(0, 3) as _3D_VEC_;
    //         this.cvec = vertArray[2].slice(0, 3) as _3D_VEC_;
    //         this.colA = vertArray[0].slice(3) as _4D_VEC_;
    //         this.colB = vertArray[1].slice(3) as _4D_VEC_;
    //         this.colC = vertArray[2].slice(3) as _4D_VEC_;
    //     }
    //     private interpolate(pvec : _3D_VEC_, avec : _3D_VEC_, bvec : _3D_VEC_, cvec : _3D_VEC_) : _3D_VEC_ {
    //         const indexList = [0, 1];
    //         const Adist = _Miscellenous.getDist(bvec, cvec, indexList),
    //             Bdist = _Miscellenous.getDist(avec, cvec, indexList),
    //             Cdist = _Miscellenous.getDist(avec, bvec, indexList),
    //             apdist = _Miscellenous.getDist(pvec, avec, indexList),
    //             bpdist = _Miscellenous.getDist(pvec, bvec, indexList),
    //             cpdist = _Miscellenous.getDist(pvec, cvec, indexList);
    //         this.TotalArea = _Miscellenous.getTriArea(Adist, Bdist, Cdist);
    //         this.triA = _Miscellenous.getTriArea(Adist, bpdist, cpdist);
    //         this.triB = _Miscellenous.getTriArea(Bdist, apdist, cpdist);
    //         this.triC = _Miscellenous.getTriArea(Cdist, apdist, bpdist);
    //         this.aRatio = this.triA / this.TotalArea;
    //         this.bRatio = this.triB / this.TotalArea;
    //         this.cRatio = this.triC / this.TotalArea;
    //         const
    //             aPa : _3D_VEC_ = _Matrix.scaMult(this.aRatio, avec) as _3D_VEC_,
    //             bPb : _3D_VEC_ = _Matrix.scaMult(this.bRatio, bvec) as _3D_VEC_,
    //             cPc : _3D_VEC_ = _Matrix.scaMult(this.cRatio, cvec) as _3D_VEC_;
    //         return _Matrix.matAdd(_Matrix.matAdd(aPa, bPb), cPc) as _3D_VEC_;
    //     }
    //     private getBoundingRect(...vertices : _3_4_MAT_) : _4D_VEC_ {
    //         return this.getBoundingRectImpl(vertices);
    //     }
    //     private getBoundingRectImpl(vertices : _3_4_MAT_) : _4D_VEC_ {
    //         var n = vertices.length;
    //         var xArr : _3D_VEC_ = [0,0,0];
    //         var yArr : _3D_VEC_ = [0,0,0];
    //         var xmin = Infinity;
    //         var ymin = Infinity;
    //         var xmax = 0;
    //         var ymax = 0;
    //         for (let i = 0; i < n; i++) {
    //             xArr[i] = vertices[i][0];
    //             yArr[i] = vertices[i][1];
    //             if (xArr[i] < xmin) {
    //                 xmin = xArr[i];
    //             }
    //             if (yArr[i] < ymin) {
    //                 ymin = yArr[i];
    //             }
    //             if (xArr[i] > xmax) {
    //                 xmax = xArr[i];
    //             }
    //             if (yArr[i] > ymax) {
    //                 ymax = yArr[i];
    //             }
    //         }
    //         return [xmin, ymin, xmax - xmin, ymax - ymin];
    //     }
    //     isInsideTri() : boolean {
    //         var sum = this.triA + this.triB + this.triC
    //         if (Math.round(sum) === Math.round(this.TotalArea)) {
    //             return true;
    //         }
    //         return false;
    //     }
    //     sample() : void { //Generates an array of normalized Gaussian distribution function values with x and y coefficients 
    //         // Mean is taken as zero
    //         this.kernel_Size = this.kernel_Size
    //         const denom_ = ((2 * Math.PI) * (this.sigma_xy ** 2));
    //         if (this.kernel_Size > 1 && this.kernel_Size % 2 === 1) {
    //             const modifier = (this.kernel_Size - 1) / 2;
    //             for (let i = 0; i < this.kernel_Size; i++) {
    //                 const val_y = i - modifier;
    //                 for (let j = 0; j < this.kernel_Size; j++) {
    //                     const val_x = j - modifier;
    //                     const numer_ = Math.exp(-((val_x ** 2) + (val_y ** 2)) / (4 * (this.sigma_xy ** 2)));
    //                     this.sampleArr.push([val_x, val_y, numer_ / denom_]);
    //                 }
    //             }
    //         }
    //     }
    //     partSample(x : number, y : number) : any[] {
    //         const part_sample_arr : any [] = []
    //         for (let sample of this.sampleArr) {
    //             var val_x = sample[0] + x;
    //             var val_y = sample[1] + y;
    //             if (val_x < 0) {
    //                 val_x = 0;
    //             } else if (val_x >= MODIFIED_PARAMS._CANVAS_WIDTH) {
    //                 val_x = MODIFIED_PARAMS._CANVAS_WIDTH - 1;
    //             }
    //             if (val_y < 0) {
    //                 val_y = 0;
    //             } else if (val_y >= MODIFIED_PARAMS._CANVAS_HEIGHT) {
    //                 val_y = MODIFIED_PARAMS._CANVAS_HEIGHT - 1;
    //             }
    //             part_sample_arr.push([val_x, val_y, sample[2]]);
    //         }
    //         return part_sample_arr;
    //     }
    //     private vertexTransform() : _3_4_MAT_ | _ERROR_  { 
    //         const a_light : _4D_VEC_ | _ERROR_ = _Optical_Objects.render(this.avec,"light");
    //         if (typeof a_light === "number") return _ERROR_._NO_ERROR_;
    //         const b_light : _4D_VEC_ | _ERROR_ = _Optical_Objects.render(this.avec,"light");
    //         if (typeof b_light === "number") return _ERROR_._NO_ERROR_;
    //         const c_light : _4D_VEC_ | _ERROR_ = _Optical_Objects.render(this.avec,"light");
    //         if (typeof c_light === "number") return _ERROR_._NO_ERROR_;
    //         return [a_light,b_light,c_light];
    //     }
    //     private vertexShader(){}
    //     private fragmentTransform() {
    //             // Get 2d bounding rectangle
    //             const ret = this.getBoundingRect(this.A, this.B, this.C),
    //                 // Simple rasterizing function
    //                 minX = Math.round(Math.max(ret[0], 0)),
    //                 minY = Math.round(Math.max(ret[1], 0)),
    //                 maxX = Math.round(Math.min(ret[0] + ret[2], MODIFIED_PARAMS._CANVAS_WIDTH)),
    //                 maxY = Math.round(Math.min(ret[1] + ret[3], MODIFIED_PARAMS._CANVAS_HEIGHT));
    //             // Get Gaussian distribution array for particular pixel
    //             for (let x = minX; x <= maxX; x++) {
    //                 for (let y = minY; y <= maxY; y++) {
    //                     const point = [
    //                         [x],
    //                         [y]
    //                     ];
    //                     var interArray = this.interpolate(point, this.A, this.B, this.C);
    //                     if (this.isInsideTri() === true) {
    //                         const aCola = _Matrix.scaMult(this.aRatio, this.colA);
    //                         const bColb = _Matrix.scaMult(this.bRatio, this.colB);
    //                         const cColc = _Matrix.scaMult(this.cRatio, this.colC);
    //                         var pColp = _Matrix.matAdd(_Matrix.matAdd(aCola, bColb), cColc);
    //                         if (this.depthBuffer[(y * MODIFIED_PARAMS._CANVAS_WIDTH) + x] > interArray[2]) {
    //                             this.depthBuffer[(y * MODIFIED_PARAMS._CANVAS_WIDTH) + x] = interArray[2];
    //                             this.frameBuffer[(y * MODIFIED_PARAMS._CANVAS_WIDTH * 4) + (x * 4) + 0] = pColp[0];
    //                             this.frameBuffer[(y * MODIFIED_PARAMS._CANVAS_WIDTH * 4) + (x * 4) + 1] = pColp[1];
    //                             this.frameBuffer[(y * MODIFIED_PARAMS._CANVAS_WIDTH * 4) + (x * 4) + 2] = pColp[2];
    //                             this.frameBuffer[(y * MODIFIED_PARAMS._CANVAS_WIDTH * 4) + (x * 4) + 3] = pColp[3];
    //                         }
    //                     }
    //                 }
    //             }
    //     }
    //     private fragmentShader(shade : boolean){}
    //     shader(){
    //         this.vertexShader();
    //         this.fragmentShader();
    //     }
    // show() {
    //     // Normalize coordinate system to use CSS pixels
    //     octx.scale(this.scale, this.scale);
    //     ctx.scale(this.scale, this.scale);
    //     for (let y = 0; y < MODIFIED_PARAMS._CANVAS_HEIGHT; y++) {
    //         for (let x = 0; x < MODIFIED_PARAMS._CANVAS_WIDTH; x++) {
    //             const r = this.frameBuffer[(y * MODIFIED_PARAMS._CANVAS_WIDTH * 4) + (x * 4) + 0];
    //             const g = this.frameBuffer[(y * MODIFIED_PARAMS._CANVAS_WIDTH * 4) + (x * 4) + 1];
    //             const b = this.frameBuffer[(y * MODIFIED_PARAMS._CANVAS_WIDTH * 4) + (x * 4) + 2];
    //             const alpha = this.frameBuffer[(y * MODIFIED_PARAMS._CANVAS_WIDTH * 4) + (x * 4) + 3];
    //             if (typeof r !== "undefined" && typeof g != "undefined" && typeof b !== "undeefined") {
    //                 octx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + alpha / 255 + ")";
    //                 octx.fillRect(x, y, 1, 1);
    //             }
    //         }
    //     }
    //     octx.drawImage(ocanvas, 0, 0, MODIFIED_PARAMS._CANVAS_WIDTH * 0.5, MODIFIED_PARAMS._CANVAS_HEIGHT * 0.5);
    //     ctx.drawImage(ocanvas, 0, 0, MODIFIED_PARAMS._CANVAS_WIDTH * 0.5, MODIFIED_PARAMS._CANVAS_HEIGHT * 0.5, 0, 0, MODIFIED_PARAMS._CANVAS_WIDTH, MODIFIED_PARAMS._CANVAS_HEIGHT);
    // class DrawCanvas {
    //     protected static drawCount = 0;
    //     constructor()
    //     {
    //         window.addEventListener("resize", () => this.drawCanvas());
    //     }
    //     drawCanvas() {
    //         canvas.style.borderStyle = MODIFIED_PARAMS._BORDER_STYLE;
    //         canvas.style.borderWidth = MODIFIED_PARAMS._BORDER_WIDTH;
    //         canvas.style.borderColor = MODIFIED_PARAMS._BORDER_COLOR;
    //         canvas.style.opacity = MODIFIED_PARAMS._GLOBAL_ALPHA;
    //         canvas.width = MODIFIED_PARAMS._CANVAS_WIDTH;
    //         canvas.height = MODIFIED_PARAMS._CANVAS_HEIGHT;
    //         DrawCanvas.drawCount++;
    //     }
    // }   
    // const _DrawCanvas = new DrawCanvas()
    // _DrawCanvas.drawCanvas()
    
    console.log(_Matrix.getDet(5,9,2,7,1,0,3,5,2))
}
