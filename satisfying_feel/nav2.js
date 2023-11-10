var _ERROR_;
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
var _ERROR_MATRIX_;
(function (_ERROR_MATRIX_) {
    _ERROR_MATRIX_[_ERROR_MATRIX_["_DET_"] = 1] = "_DET_";
    _ERROR_MATRIX_[_ERROR_MATRIX_["_MINOR_"] = 2] = "_MINOR_";
    _ERROR_MATRIX_[_ERROR_MATRIX_["_COF_"] = 3] = "_COF_";
    _ERROR_MATRIX_[_ERROR_MATRIX_["_ADJ_"] = 4] = "_ADJ_";
    _ERROR_MATRIX_[_ERROR_MATRIX_["_INV_"] = 5] = "_INV_";
})(_ERROR_MATRIX_ || (_ERROR_MATRIX_ = {}));
class Matrix {
    constructor() { }
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
    matMult(matA, matB, shapeA, shapeB) {
        if (shapeA[1] !== shapeB[0])
            return _ERROR_._MATRIX_ERROR_;
        else {
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
    scaMult(scalarVal, matIn, leaveLast = false) {
        const matInlen = matIn.length;
        const matOut = [];
        for (let i = 0; i < matInlen; i++) {
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
    }
    matAdd(matA, matB, neg = false) {
        const matAlen = matA.length;
        const matBlen = matB.length;
        if (matAlen === matBlen) {
            const matC = [];
            const sgn = neg === true ? -1 : 1;
            for (let i = 0; i < matAlen; i++) {
                matC.push(matA[i] + sgn * matB[i]);
            }
            return matC;
        }
        else
            return _ERROR_._MATRIX_ERROR_;
    }
    getTranspMat(matIn, shapeMat) {
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
    getIdentMat(val) {
        const num = val ** 2;
        const matOut = [];
        var c = 0;
        for (let i = 0; i < num; i++) {
            if (i === c) {
                matOut.push(1);
                c += val + 1;
            }
            else {
                matOut.push(0);
            }
        }
        return matOut;
    }
    getRestMat(matIn, shapeNum, row, column) {
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
                const tmp = [];
                for (let i = 0; i < shapeNum; i++) {
                    tmp.push(matIn[i]);
                }
                const cofMatSgn = this.getCofSgnMat([1, shapeNum]);
                var a = 0;
                const cofLen = cofMatSgn.length;
                for (let i = 0; i < cofLen; i++) {
                    var ret = this.getRestMat(matIn, shapeNum, a, i);
                    var verify = this.getDet(ret, shapeNum - 1);
                    verify = verify > _ERROR_._NO_ERROR_ ? _ERROR_._NO_ERROR_ : verify;
                    res += (cofMatSgn[i] * tmp[i] * verify);
                }
                return res;
            }
        }
        else
            return _ERROR_._MATRIX_ERROR_ + _ERROR_MATRIX_._DET_ * 10;
    }
    getMinorMat(matIn, shapeNum) {
        const matOut = [];
        for (let i = 0; i < shapeNum; i++) {
            for (let j = 0; j < shapeNum; j++) {
                const result = this.getDet(this.getRestMat(matIn, shapeNum, i, j), shapeNum - 1);
                if (result > _ERROR_._NO_ERROR_)
                    return result + _ERROR_MATRIX_._MINOR_ * 100;
                matOut.push(result);
            }
        }
        return matOut;
    }
    getCofSgnMat(shapeMat) {
        const shpA = shapeMat[0];
        const shpB = shapeMat[1];
        const matOut = [];
        for (let i = 0; i < shpA; i++) {
            for (let j = 0; j < shpB; j++) {
                if ((i + j) % 2 === 0) {
                    matOut.push(1);
                }
                else
                    matOut.push(-1);
            }
        }
        return matOut;
    }
    getCofMat(matIn, shapeNum) {
        const cofMatSgn = this.getCofSgnMat([shapeNum, shapeNum]);
        var _minorMat = this.getMinorMat(matIn, shapeNum);
        if (typeof _minorMat === "number")
            if (_minorMat > _ERROR_._NO_ERROR_)
                return _minorMat + _ERROR_MATRIX_._COF_ * 1000;
        const minorMat = _minorMat;
        const matOut = [];
        const len = shapeNum ** 2;
        for (let i = 0; i < len; i++) {
            matOut.push(cofMatSgn[i] * minorMat[i]);
        }
        return matOut;
    }
    getAdjMat(matIn, shapeNum) {
        const result = this.getCofMat(matIn, shapeNum);
        if (typeof result === "number")
            if (result > _ERROR_._NO_ERROR_)
                return result + _ERROR_MATRIX_._ADJ_ * 10000;
        return this.getTranspMat(result, [shapeNum, shapeNum]);
    }
    getInvMat(matIn, shapeNum) {
        const det_result = this.getDet(matIn, shapeNum);
        if (det_result > _ERROR_._NO_ERROR_)
            return det_result + _ERROR_MATRIX_._INV_ * 100000;
        const adj_result = this.getAdjMat(matIn, shapeNum);
        if (typeof adj_result === "number")
            if (adj_result > _ERROR_._NO_ERROR_)
                return adj_result + _ERROR_MATRIX_._INV_ * 100000;
        return _Matrix.scaMult(1 / det_result, adj_result);
    }
}
const _Matrix = new Matrix();

const start =new Date().getTime();

console.log(_Matrix.matMult([5,7,9,2],[6,3,0,4,8,2],[2,2],[3,2]))

console.log(_Matrix.matMult([5,7,9,2],[6,3,0,4,8,2],[2,2],[2,3]))

console.log(_Matrix.matAdd([6,0,2,6,8,1],[5,9,2,0,6,3],[2,3],[3,2]))

console.log(_Matrix.getTranspMat([ 58, 71, 14, 62, 43, 4 ],[2,3]))

console.log(_Matrix.matAdd([6,0,2,6,8,1],[5,9,2,0,6,3],))

console.log(_Matrix.matAdd([6,0,2,6,8,1],[5,9,2,0,6,3],true))

console.log(_Matrix.matAdd([6,0,2,6,8,1],[5,9,2,0,6,3],false))

console.log(_Matrix.getRestMat([6,0,2,7,5,6,8,1,5,9,2,0,6,1,7,3],4,0,0))

console.log(_Matrix.getRestMat([6,0,2,7,5,6,8,1,5,9,2,0,6,1,7,3],4,0,1))

console.log(_Matrix.getRestMat([6,0,2,7,5,6,8,1,5,9,2,0,6,1,7,3],4,0,2))

console.log(_Matrix.getRestMat([6,0,2,7,5,6,8,1,5,9,2,0,6,1,7,3],4,0,3))

console.log(_Matrix.getRestMat([6,0,2,7,5,6,8,1,5,9,2,0,6,1,7,3],4,1,0))

console.log(_Matrix.getRestMat([6,0,2,7,5,6,8,1,5,9,2,0,6,1,7,3],4,1,1))

console.log(_Matrix.getRestMat([6,0,2,7,5,6,8,1,5,9,2,0,6,1,7,3],4,1,2))

console.log(_Matrix.getRestMat([6,0,2,7,5,6,8,1,5,9,2,0,6,1,7,3],4,1,3))

console.log(_Matrix.getRestMat([6,0,2,7,5,6,8,1,5,9,2,0,6,1,7,3],4,2,0))

console.log(_Matrix.getRestMat([6,0,2,7,5,6,8,1,5,9,2,0,6,1,7,3],4,2,1))

console.log(_Matrix.getRestMat([6,0,2,7,5,6,8,1,5,9,2,0,6,1,7,3],4,2,2))

console.log(_Matrix.getRestMat([6,0,2,7,5,6,8,1,5,9,2,0,6,1,7,3],4,2,3))

console.log(_Matrix.getRestMat([6,0,2,7,5,6,8,1,5,9,2,0,6,1,7,3],4,3,0))

console.log(_Matrix.getRestMat([6,0,2,7,5,6,8,1,5,9,2,0,6,1,7,3],4,3,1))

console.log(_Matrix.getRestMat([6,0,2,7,5,6,8,1,5,9,2,0,6,1,7,3],4,3,2))

console.log(_Matrix.getRestMat([6,0,2,7,5,6,8,1,5,9,2,0,6,1,7,3],4,3,3))   

console.log(_Matrix.scaMult(4,[6,0,2,7,5,6,8,1,5,9,2,0,6,1,7,3]))

console.log(_Matrix.scaMult(4,[6,0,2,7,5,6,8,1,5,9,2,0,6,1,7,3],true))

console.log(_Matrix.scaMult(1/4,[6,0,2,7,5,6,8,1,5,9,2,0,6,1,7,3],false))

console.log(_Matrix.getIdentMat(3));

console.log(_Matrix.getIdentMat(8));

console.log(_Matrix.getDet([6,0,2,7,5,6,8,1,5,9,2,0,6,1,7,3],4))

console.log(_Matrix.getDet([6],1))

console.log(_Matrix.getDet([6,0,2,7],2))


console.log(_Matrix.getDet([6,0,2,7,5,6,8,1,5],3))

console.log(_Matrix.getDet([6,0,2,7,5,6,8,1,5,7],3))

console.log(_Matrix.getDet([6,0,2,7,5,6,8,1,5,9,2,0,6,1,7,3],1))

console.log(_Matrix.getCofSgnMat([1,1]))

console.log(_Matrix.getCofSgnMat([2,2]))

console.log(_Matrix.getCofSgnMat([2,3]))

console.log(_Matrix.getCofSgnMat([3,2]))

console.log(_Matrix.getCofSgnMat([3,3]))

console.log(_Matrix.getCofSgnMat([5,5]))

console.log(_Matrix.getCofSgnMat([6,6]))

console.log(_Matrix.getMinorMat([6,0,2,7,5,6,8,1,5,9,2,0,6,1,7,3],4))

console.log(_Matrix.getCofMat([6,0,2,7,5,6,8,1,5,9,2,0,6,1,7,3],4))

console.log(_Matrix.getAdjMat([6,0,2,7,5,6,8,1,5,9,2,0,6,1,7,3],4))

console.log(_Matrix.getInvMat([6,0,2,7,5,6,8,1,5,9,2,0,6,1,7,3],4))

const end = new Date().getTime();

console.log(`Time taken : ${end - start} ms`)