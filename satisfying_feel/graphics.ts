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
    
    interface _BASIC_PARAMS_ {
        _GLOBAL_ALPHA : string,
        _CANVAS_WIDTH : number,
        _CANVAS_HEIGHT : number,
        _BORDER_COLOR  : string,
        _BORDER_WIDTH: string,
        _BORDER_RADIUS: string,
        _BORDER_STYLE: string,
        _THETA : number,
        _ANGLE_UNIT : _ANGLE_UNIT_
        _ANGLE_CONSTANT : number,
        _REVERSE_ANGLE_CONSTANT : number,
        _HANDEDNESS : _HANDEDNESS_;
        _HANDEDNESS_CONSTANT : number,
        _X : _3D_VEC_,
        _Y :_3D_VEC_,
        _Z : _3D_VEC_,
        _Q_VEC : _3D_VEC_,
        _Q_QUART : _4D_VEC_,
        _Q_INV_QUART : _4D_VEC_,
        _NZ : number,
        _FZ : number,
        _PROJ_ANGLE : number,
        _ASPECT_RATIO : number,
        _DIST : number,
        _HALF_X : number,
        _HALF_Y : number,
        _PROJECTION_MAT : _16D_VEC_,
        _INV_PROJECTION_MAT : _16D_VEC_,
        _OPEN_SIDEBAR : boolean,
    }

    const DEFAULT_PARAMS : _BASIC_PARAMS_ =
    {
        _GLOBAL_ALPHA : '1',
        _CANVAS_WIDTH : 1,
        _CANVAS_HEIGHT : 1,
        _BORDER_COLOR  :'red',
        _BORDER_WIDTH:  '4',
        _BORDER_RADIUS:  '2',
        _BORDER_STYLE:  "solid",
        _THETA : 0,
        _ANGLE_UNIT : "deg",
        _ANGLE_CONSTANT : Math.PI/180,
        _REVERSE_ANGLE_CONSTANT : 180/Math.PI,
        _HANDEDNESS: "right",
        _HANDEDNESS_CONSTANT: 1,
        _X : [1,0,0],
        _Y : [0,1,0],
        _Z : [0,0,1],
        _Q_VEC : [0,0,0],
        _Q_QUART : [0,0,0,0],
        _Q_INV_QUART : [0,0,0,0],
        _NZ : -0.1,
        _FZ : -100,
        _PROJ_ANGLE : 60,
        _ASPECT_RATIO : 1,
        _DIST : 1,
        _HALF_X : 1,
        _HALF_Y : 1,
        _PROJECTION_MAT : [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        _INV_PROJECTION_MAT : [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        _OPEN_SIDEBAR : true,
        }

    const MODIFIED_PARAMS : _BASIC_PARAMS_ = JSON.parse(JSON.stringify(DEFAULT_PARAMS))
    
    enum _ERROR_ 
    {
        _NO_ERROR_ = 1e3,
        _SETTINGS_ERROR_ = 2e3,
        _MISCELLANOUS_ERROR_ = 3e3,
        _QUARTERNION_ERROR_ = 4e3,
        _MATRIX_ERROR_ = 5e3,
        _VECTOR_ERROR_ = 6e3,
        _PERSPECTIVE_PROJ_ERROR_ = 7e3,
        _CLIP_ERROR_ = 8e3,
        _LOCAL_SPACE_ERROR_ = 9e3,
        _WORLD_SPACE_ERROR_ = 10e3,
        _CLIP_SPACE_ERROR_ = 11e3,
        _SCREEN_SPACE_ERROR_ = 12e3,
        _OPTICAL_ELEMENT_OBJECT_ERROR_ = 13e3,
        _RENDER_ERROR_ = 14e3,
        _DRAW_CANVAS_ERROR_ = 15e3,
    }
    
       
    class BackTrack 
    {
        constructor(){}
        
        getPermutationsArr(arr : number[], permutationSize : number) : number[] {
            const permutations : number[] = [];

            function backtrack(currentPerm : number[]) 
            {
                if (currentPerm.length === permutationSize) {
                    permutations.push(currentPerm.slice() as any);

                    return;
                }

                arr.forEach((item : number) => {
                    if (currentPerm.includes(item)) return;
                    currentPerm.push(item);
                    backtrack(currentPerm);
                    currentPerm.pop();
                });
            }

            backtrack([]);

            return permutations;
        }

        getCombinationsArr(arr : number[], combinationSize: number): number[] 
        {
            const combinations : number[] = [];

            function backtrack(startIndex : number, currentCombination : number[]) {
                if (currentCombination.length === combinationSize) {
                    combinations.push(currentCombination.slice() as any);
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
        
        getFibonacciNum(num : number) : number 
        {
            if (num < 0)
                return 0;
            else if (num === 0 || num === 1)
                return 1;
            else
                return this.getFibonacciNum(num - 1) + this.getFibonacciNum(num - 2);
        }
        
        getFibonacciSeq(start : number, stop : number) : number[] 
        {
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
        
        getFactorialNum(num : number) : number 
        {
            if (num <= 1)
                return 1;
            else
                return num * this.getFactorialNum(num - 1) 
        }
        
        getFactorialSeq(start : number, stop : number) : number[] 
        {
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
        
        getCombinationsNum(arrlen : number,num : number)
        {
            return (this.getFactorialNum(arrlen)/((this.getFactorialNum(arrlen - num))*(this.getFactorialNum(num))));
        }
        
        getPermutationsNum(arrlen : number,num : number)
        {
           return (this.getFactorialNum(arrlen)/(this.getFactorialNum(arrlen - num)));
        }
    }
    
    const _Backtrack = new BackTrack()
    
    class Matrix 
       {
       constructor()
       {}


        matMult(matA : number[], matB : number[], shapeA : _2D_VEC_, shapeB : _2D_VEC_) : number[] {
            const matC : number[] = []
    
            if (shapeA[1] === shapeB[0])
            {
                for (let i = 0; i < shapeA[0]; i++) 
                {
                    for (let j = 0; j < shapeB[1]; j++) 
                    {
                        var sum : number = 0;
                        for (let k = 0; k < shapeB[0]; k++) 
                        {
                            sum += matA[(i * shapeA[1]) + k] * matB[(k * shapeB[1]) + j];
                        }
                        matC.push(sum);
                    }
                }
            }
            return matC;
        }
    
        scaMult(scalarVal : number, matIn : number [], leaveLast : boolean = false) : number[] 
        {
            const matInlen : number = matIn.length;
            const matOut : number[] = [];
            for (let i = 0; i < matInlen; i++) 
            {
                if (i === matInlen - 1 && leaveLast === true) 
                {
                    // Do nothing...don't multiply the last matrix value by the scalar value
                    // useful when perspective division is going on.
                    matOut.push(matIn[i]);
                } else 
                {
                    matOut.push(matIn[i] * scalarVal);
                }
            }
            return matOut;
        }
    
        matAdd(matA : number[], matB : number[], neg : boolean = false) : number[]
        {
            const matAlen : number = matA.length;
            const matBlen : number = matB.length;
            const matC : number[] = [];
            
            if (matAlen === matBlen) 
            {
                const sgn = neg === true ? -1 : 1;
                for (let i = 0; i < matAlen; i++) 
                {
                    matC.push(matA[i] + sgn * matB[i]);
                }
            }
            
            return matC;
        }
    
        getTranspMat(matIn : number[], shapeMat: _2D_VEC_): number[] 
        {
            const shpA = shapeMat[0];
            const shpB = shapeMat[1];
            const matOut : number[] = [];
    
            for (let i = 0; i < shpB; i++) {
                for (let j = 0; j < shpA; j++) 
                {
                    matOut.push(matIn[(j * shpB) + i]);
                }
            }
    
            return matOut;
        }
    
        getIdentMat(val : number) : number[]{
            const num : number = val ** 2;
            const matOut : number[] = [];
            var c = 0;        
            for (let i = 0; i < num; i++) 
            {
                if (i === c) 
                {
                    matOut.push(1);
                    c += val+1;    
                }
                else
                {
                    matOut.push(0);
                }
            }
            return matOut;
        }
    
        getRestMat(matIn : number[], shapeNum : number, row : number, column : number) : number[] 
        {
            const matOut : number[] = [];
    
            for (let i = 0; i < shapeNum; i++) 
            {
                for (let j = 0; j < shapeNum; j++) {
                    if (i !== row && j !== column) 
                    {
                        matOut.push(matIn[(i * shapeNum) + j]);
                    }
                }
            }
    
            return matOut;
        }
    
        getDet(matIn : number [], shapeNum : number) : number 
        {
            if (shapeNum < 0) 
            {
                return 0;
            }
            // If it is a 1x1 matrix, return the matrix
            if (shapeNum === 1) 
            {
               return matIn[0];
            }
                // If it is a 2x2 matrix, return the determinant
            if (shapeNum === 2) 
            {
                return ((matIn[0] * matIn[3]) - (matIn[1] * matIn[2]));
            }
                // If it an nxn matrix, where n > 2, recursively compute the determinant,
                //using the first row of the matrix
            else 
            {
                var res : number = 0;
                const tmp : number[] = [];
    
                for (let i = 0; i < shapeNum; i++) 
                {
                   tmp.push(matIn[i]);
                }
    
                const cofMatSgn = this.getCofSgnMat([1, shapeNum]);
    
                var a = 0;
                const cofLen : number = cofMatSgn.length;
    
                for (let i = 0; i <  cofLen; i++) 
                {
                    var ret : number[] = this.getRestMat(matIn, shapeNum, a, i);

                    var verify = this.getDet(ret, shapeNum - 1);
                   
                    res += (cofMatSgn[i] * tmp[i] * verify);
                }
    
                return res;
            }
            
        }
    
        getMinorMat(matIn : number[], shapeNum : number) : number[] {
            const matOut : number[] = [];
    
            for (let i = 0; i < shapeNum; i++) 
            {
                for (let j = 0; j < shapeNum; j++) 
                {
                    const result = this.getDet(this.getRestMat(matIn, shapeNum, i, j), shapeNum - 1)
     
                    matOut.push(result as number)
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
    
        getCofMat(matIn : number[], shapeNum : number) : number [] {
            const cofMatSgn : number[] = this.getCofSgnMat([shapeNum, shapeNum]);
            var minorMat : number[] = this.getMinorMat(matIn, shapeNum);

            const matOut : number[] = [];
            const len = Math.sign(shapeNum) * shapeNum ** 2;
    
            for (let i = 0; i < len; i++) {
                matOut.push(cofMatSgn[i] * minorMat[i]);
            }
    
            return matOut;
        }
    
        getAdjMat(matIn : number[], shapeNum : number) : number[] {
            const result : number[] = this.getCofMat(matIn, shapeNum)

            return this.getTranspMat((result), [shapeNum, shapeNum]);
        }
    
        getInvMat(matIn : number[], shapeNum : number) : number[] | string {
            const det_result = this.getDet(matIn, shapeNum);

            if (det_result === 0) return _ERROR_._MATRIX_ERROR_.toString() 

            const adj_result : number[] = this.getAdjMat(matIn,shapeNum);

            return _Matrix.scaMult(1/det_result as number,(adj_result));
        }
    }
    
    const _Matrix = new Matrix()
    
    
    
        class BackTrack {
        getPermutations(arr : number[], permutationSize : number) : number[] {
            const permutations : number[] = [];

            function backtrack(currentPerm : number[]) {
                if (currentPerm.length === permutationSize) {
                    permutations.push(currentPerm.slice() as any);

                    return;
                }

                arr.forEach((item : number) => {
                    if (currentPerm.includes(item)) return;
                    currentPerm.push(item);
                    backtrack(currentPerm);
                    currentPerm.pop();
                });
            }

            backtrack([]);

            return permutations;
        }

        getCombinations(arr : number[], combinationSize: number): number[] {
            const combinations : number[] = [];

            function backtrack(startIndex : number, currentCombination : number[]) {
                if (currentCombination.length === combinationSize) {
                    combinations.push(currentCombination.slice() as any);
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
