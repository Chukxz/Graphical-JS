

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
