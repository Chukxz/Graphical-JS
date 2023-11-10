

    type _ANGLE_UNIT_ = "deg" | "rad" | "grad";

    type _2D_VEC_ = [number, number];

    type _3D_VEC_ = [number, number, number];

    type _4D_VEC_ = [number,number,number,number];
    
    type _7D_VEC_ = [..._3D_VEC_,..._4D_VEC_];

    type _9D_VEC_ = [..._3D_VEC_,..._3D_VEC_,..._3D_VEC_];
    
    type _16D_VEC_ = [..._4D_VEC_,..._4D_VEC_,..._4D_VEC_,..._4D_VEC_];

    type _3_3_MAT_ = [_3D_VEC_,_3D_VEC_,_3D_VEC_];

    type _3_4_MAT_ = [_4D_VEC_,_4D_VEC_,_4D_VEC_];

    type _3_7_MAT_ = [_7D_VEC_,_7D_VEC_,_7D_VEC_];

    
    type _PLANE_ = "U-V" | "U-N" | "V-N";

    type _OBJ_STATE_ = "local" | "object" | "world";

    type _HANDEDNESS_ = "left" | "right";

    type _OPTICAL_ = "light" | "camera" | "none";
    
    enum _ERROR_ 
    {
        _NO_ERROR_ = 1e12,
        _SETTINGS_ERROR_,
        _MISCELLANOUS_ERROR_,
        _QUARTERNION_ERROR_,
        _MATRIX_ERROR_,
        _VECTOR_ERROR_,
        _PERSPECTIVE_PROJ_ERROR_,
        _CLIP_ERROR_,
        _LOCAL_SPACE_ERROR_,
        _WORLD_SPACE_ERROR_,
        _CLIP_SPACE_ERROR_,
        _SCREEN_SPACE_ERROR_,
        _OPTICAL_ELEMENT_OBJECT_ERROR_,
        _RENDER_ERROR_,
        _DRAW_CANVAS_ERROR_,
    }

    enum _ERROR_MATRIX_
    {
        _DET_ = 1,
        _MINOR_,
        _COF_,
        _ADJ_,
        _INV_
    }
   
       class Matrix 
    {
        constructor()
        {}

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
    
        matMult(matA : number[], matB : number[], shapeA : _2D_VEC_, shapeB : _2D_VEC_) : number[] | _ERROR_ {
            
            if (shapeA[1] !== shapeB[0]) return _ERROR_._MATRIX_ERROR_;
            else
            {
            const matC : number[] = []
    
            for (let i = 0; i < shapeA[0]; i++) {
                for (let j = 0; j < shapeB[1]; j++) {
                    var sum : number = 0;
                    for (let k = 0; k < shapeB[0]; k++) {
                        sum += matA[(i * shapeA[1]) + k] * matB[(k * shapeB[1]) + j];
                    }
                    matC.push(sum);
                }
            }
            return matC;
            }
        }
    
        scaMult(scalarVal : number, matIn : number [], leaveLast : boolean = false) : number[] {
            const matInlen : number = matIn.length;
            const matOut : number[] = [];
            for (let i = 0; i < matInlen; i++) {
                if (i === matInlen - 1 && leaveLast === true) {
                    // Do nothing...don't multiply the last matrix value by the scalar value
                    // useful when perspective division is going on.
                    matOut.push(matIn[i]);
                } else {
                    matOut.push(matIn[i] * scalarVal);
                }
            }
            return matOut;
        }
    
        matAdd(matA : number[], matB : number[], neg : boolean = false) : number[] | _ERROR_ {
        const matAlen : number = matA.length;
        const matBlen : number = matB.length;
            
        if (matAlen === matBlen) {
            const matC : number[] = [];
            const sgn = neg === true ? -1 : 1;
            for (let i = 0; i < matAlen; i++) {
                matC.push(matA[i] + sgn * matB[i]);
            }
            return matC;
            }
            else return _ERROR_._MATRIX_ERROR_;
        }
    
        getTranspMat(matIn : number[], shapeMat: _2D_VEC_): number[] {
            const shpA = shapeMat[0];
            const shpB = shapeMat[1];
            const matOut : number[] = [];
    
            for (let i = 0; i < shpB; i++) {
                for (let j = 0; j < shpA; j++) {
                    matOut.push(matIn[(j * shpB) + i]);
                }
            }
    
            return matOut;
        }
    
        getIdentMat(val : number) : number[]{
            const num : number = val ** 2;
            const matOut : number[] = [];
            var c = 0;        
            for (let i = 0; i < num; i++) {
                if (i === c) {
                    matOut.push(1);
                    c += val+1;    
                }
                else{
                    matOut.push(0);
                }
            }
            return matOut;
        }
    
        getRestMat(matIn : number[], shapeNum : number, row : number, column : number) : number[] {
            const matOut : number[] = [];
    
            for (let i = 0; i < shapeNum; i++) {
                for (let j = 0; j < shapeNum; j++) {
                    if (i !== row && j !== column) {
                        matOut.push(matIn[(i * shapeNum) + j]);
                    }
                }
            }
    
            return matOut;
        }
    
        getDet(matIn : number | number [], shapeNum : number) : number | _ERROR_._MATRIX_ERROR_ {
            if (shapeNum > 0) {
                // If it is a 1x1 matrix, return the matrix
                if (shapeNum === 1) {
                    return matIn as number;
                }
                // If it is a 2x2 matrix, return the determinant
                if (shapeNum === 2) {
                    return ((matIn[0] * matIn[3]) - (matIn[1] * matIn[2]));
                }
                // If it an nxn matrix, where n > 2, recursively compute the determinant,
                //using the first row of the matrix
                else {
                    var res : number = 0;
                    const tmp : number[] = [];
    
                    for (let i = 0; i < shapeNum; i++) {
                        tmp.push(matIn[i]);
                    }
    
                    const cofMatSgn = this.getCofSgnMat([1, shapeNum]);
    
                    var a = 0;
                    const cofLen : number = cofMatSgn.length;
    
                    for (let i = 0; i < cofLen; i++) {
                        var ret : number[] = this.getRestMat(matIn as number[], shapeNum, a, i);

                        var verify = this.getDet(ret, shapeNum - 1);
                    
                        verify = verify > _ERROR_._NO_ERROR_? _ERROR_._NO_ERROR_ : verify;

                        res += (cofMatSgn[i] * tmp[i] * verify);
                    }
    
                    return res;
                }
            }

            else return _ERROR_._MATRIX_ERROR_ + _ERROR_MATRIX_._DET_*10;
        }
    
        getMinorMat(matIn : number[], shapeNum : number) : number[] | _ERROR_ {
            const matOut : number[] = [];
    
            for (let i = 0; i < shapeNum; i++) {
                for (let j = 0; j < shapeNum; j++) {
                    const result : number | _ERROR_ = this.getDet(this.getRestMat(matIn, shapeNum, i, j), shapeNum - 1)
                    if (result > _ERROR_._NO_ERROR_) return result + _ERROR_MATRIX_._MINOR_*100;
                    matOut.push(result)
                }
            }
    
            return matOut;
        }
    
        getCofSgnMat(shapeMat : _2D_VEC_) : number[] {
            const shpA : number = shapeMat[0];
            const shpB : number = shapeMat[1];
            const matOut : number[] = [];
    
            for (let i = 0; i < shpA; i++) {
                for (let j = 0; j < shpB; j++) {
                    if ((i + j) % 2 === 0) {
                        matOut.push(1);
                    } else matOut.push(-1);
                }
            }
    
            return matOut;
        }
    
        getCofMat(matIn : number[], shapeNum : number) : number [] | _ERROR_ {
            const cofMatSgn : number[] = this.getCofSgnMat([shapeNum, shapeNum]);
            var _minorMat : number[] | _ERROR_ = this.getMinorMat(matIn, shapeNum);

            if (typeof _minorMat === "number")
                if (_minorMat > _ERROR_._NO_ERROR_) return _minorMat + _ERROR_MATRIX_._COF_*1000;
                
            const minorMat : number[] = _minorMat as number[]
            const matOut : number[] = [];
            const len : number = shapeNum ** 2;
    
            for (let i = 0; i < len; i++) {
                matOut.push(cofMatSgn[i] * minorMat[i]);
            }
    
            return matOut;
        }
    
        getAdjMat(matIn : number[], shapeNum : number) : number[] | _ERROR_ {
            const result : number[] | _ERROR_ = this.getCofMat(matIn, shapeNum)
            if (typeof result === "number")
                if (result > _ERROR_._NO_ERROR_) return result + _ERROR_MATRIX_._ADJ_*10000 ;
            return this.getTranspMat((result as number[]), [shapeNum, shapeNum]);
        }
    
        getInvMat(matIn : number[], shapeNum : number) : number[] | _ERROR_ {
            const det_result : number = this.getDet(matIn, shapeNum);

            if (det_result > _ERROR_._NO_ERROR_) return det_result+_ERROR_MATRIX_._INV_*100000;

            const adj_result : number[] | _ERROR_ = this.getAdjMat(matIn,shapeNum);

            if (typeof adj_result === "number")
                if (adj_result > _ERROR_._NO_ERROR_) return adj_result+_ERROR_MATRIX_._INV_*100000;
            
            return _Matrix.scaMult(1/det_result,(adj_result as number[]));
        }
    }
    
    const _Matrix = new Matrix()
    
  