const DEFAULT_PARAMS = {
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
const MODIFIED_PARAMS = JSON.parse(JSON.stringify(DEFAULT_PARAMS));
var _ERROR_;
(function (_ERROR_) {
    _ERROR_[_ERROR_["_NO_ERROR_"] = 1000] = "_NO_ERROR_";
    _ERROR_[_ERROR_["_SETTINGS_ERROR_"] = 2000] = "_SETTINGS_ERROR_";
    _ERROR_[_ERROR_["_MISCELLANOUS_ERROR_"] = 3000] = "_MISCELLANOUS_ERROR_";
    _ERROR_[_ERROR_["_QUARTERNION_ERROR_"] = 4000] = "_QUARTERNION_ERROR_";
    _ERROR_[_ERROR_["_MATRIX_ERROR_"] = 5000] = "_MATRIX_ERROR_";
    _ERROR_[_ERROR_["_VECTOR_ERROR_"] = 6000] = "_VECTOR_ERROR_";
    _ERROR_[_ERROR_["_PERSPECTIVE_PROJ_ERROR_"] = 7000] = "_PERSPECTIVE_PROJ_ERROR_";
    _ERROR_[_ERROR_["_CLIP_ERROR_"] = 8000] = "_CLIP_ERROR_";
    _ERROR_[_ERROR_["_LOCAL_SPACE_ERROR_"] = 9000] = "_LOCAL_SPACE_ERROR_";
    _ERROR_[_ERROR_["_WORLD_SPACE_ERROR_"] = 10000] = "_WORLD_SPACE_ERROR_";
    _ERROR_[_ERROR_["_CLIP_SPACE_ERROR_"] = 11000] = "_CLIP_SPACE_ERROR_";
    _ERROR_[_ERROR_["_SCREEN_SPACE_ERROR_"] = 12000] = "_SCREEN_SPACE_ERROR_";
    _ERROR_[_ERROR_["_OPTICAL_ELEMENT_OBJECT_ERROR_"] = 13000] = "_OPTICAL_ELEMENT_OBJECT_ERROR_";
    _ERROR_[_ERROR_["_RENDER_ERROR_"] = 14000] = "_RENDER_ERROR_";
    _ERROR_[_ERROR_["_DRAW_CANVAS_ERROR_"] = 15000] = "_DRAW_CANVAS_ERROR_";
})(_ERROR_ || (_ERROR_ = {}));
class BackTrack {
    constructor() { }
    getPermutationsArr(arr, permutationSize) {
        const permutations = [];
        function backtrack(currentPerm) {
            if (currentPerm.length === permutationSize) {
                permutations.push(currentPerm.slice());
                return;
            }
            arr.forEach((item) => {
                if (currentPerm.includes(item))
                    return;
                currentPerm.push(item);
                backtrack(currentPerm);
                currentPerm.pop();
            });
        }
        backtrack([]);
        return permutations;
    }
    getCombinationsArr(arr, combinationSize) {
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
    getFibonacciNum(num) {
        if (num < 0)
            return 0;
        else if (num === 0 || num === 1)
            return 1;
        else
            return this.getFibonacciNum(num - 1) + this.getFibonacciNum(num - 2);
    }
    getFibonacciSeq(start, stop) {
        var s = Math.max(start, 0);
        const hold = [];
        var n = 0;
        while (s <= stop) {
            hold[n] = this.getFibonacciNum(s);
            n++;
            s++;
        }
        return hold;
    }
    getFactorialNum(num) {
        if (num <= 1)
            return 1;
        else
            return num * this.getFactorialNum(num - 1);
    }
    getFactorialSeq(start, stop) {
        var s = Math.max(start, 0);
        const hold = [];
        var n = 0;
        while (s <= stop) {
            hold[n] = this.getFactorialNum(s);
            n++;
            s++;
        }
        return hold;
    }
    getCombinationsNum(arrlen, num) {
        return (this.getFactorialNum(arrlen) / ((this.getFactorialNum(arrlen - num)) * (this.getFactorialNum(num))));
    }
    getPermutationsNum(arrlen, num) {
        return (this.getFactorialNum(arrlen) / (this.getFactorialNum(arrlen - num)));
    }
}
const _Backtrack = new BackTrack();

const start = new Date().getTime();


console.log(_Backtrack.getPermutationsArr([0,1,2,3,4],3))

console.log(_Backtrack.getCombinationsArr([0,1,2,3,4],3))

console.log(_Backtrack.getFibonacciNum(3))

console.log(_Backtrack.getFibonacciSeq(0,20))

console.log(_Backtrack.getFactorialNum(3))

console.log(_Backtrack.getFactorialSeq(0,20))

console.log(_Backtrack.getPermutationsNum(5,3))

console.log(_Backtrack.getCombinationsNum(5,3))

const end = new Date().getTime();

console.log(`${ end - start} milliseconds`);
