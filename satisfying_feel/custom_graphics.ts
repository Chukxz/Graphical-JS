//

"use strict"

{
    const pListCache : {} = {};     
    const pArgCache : {} = {};

    // const scrW = screen.width;
    // const scrH = screen.height;

    // var prevW = 0;
    // var prevH = 0;
    // var speed = 0;
    // var prev = Date.now()

    const canvas = document.getElementsByTagName('canvas')[0];

    const ctx = canvas.getContext('2d', { willReadFrequently: true }) as CanvasRenderingContext2D;

    const hovered = { color: document.getElementById('hoveredColor'), pixel: document.getElementById('hoveredPixel') };

    const selected = { color: document.getElementById('selectedColor'), pixel: document.getElementById('selectedPixel') };

    var drop = document.getElementById('drop');

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

    interface DRAG
    { 
        change : (value : number) => void,
        start : (element : any) => void,
        sensitivity : number
    }
  
    // We implement a function closure here by binding the variable 'implementDrag'
    // to a local function and invoking the local function, this ensures that we have
    // some sort of private variables
    var implementDrag : DRAG =
     (function() {
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

            retObject : DRAG = {
                change: changeSens,
                start: drag,
                sensitivity: getSens()
            };

        function changeSens(value : number) {
            sens = value;
        }
        
        function getSens() : number{
            return sens;
        }

        function drag(element : any) : void {
              startDragMobile(element);
              startDrag(element);
        }

        function startDrag(element : any) : void {
            element.onmousedown = dragMouseDown;
        }

        function startDragMobile(element : any) : void {
            element.addEventListener('touchstart', dragTouchstart, { 'passive': true });
        }

        function dragMouseDown(e : any) {
            e = e || window.event;
            e.preventDefault();

            pos3 = e.clientX;
            pos4 = e.clientY;

            document.onmouseup = dragMouseup;
            document.onmousemove = dragMousemove;
        }

        function dragTouchstart(e : any) {
            e = e || window.event;

            pos3 = e.touches[0].clientX;
            pos4 = e.touches[0].clientY;

            document.addEventListener('touchend', dragTouchend, { 'passive': true });
            document.addEventListener('touchmove', dragTouchmove, { 'passive': true });
        }

        function dragMousemove(e : any) {
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

        function dragTouchmove(e : any) {
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
        }

        function dragTouchend() {
            document.addEventListener('touchend', () => null, { 'passive': true });
            document.addEventListener('touchmove', () => null, { 'passive': true });
        }

        return retObject;
    })()



    const _Classes = (bases: any) : object =>
    {
    class Bases
    {
        constructor()
        {
        bases.foreach(base => Object.assign(this,new base()));
        }
    }

        bases.forEach(base => 
        {
        Object.getOwnPropertyNames(base.prototype)
            .filter(prop => prop != 'constructor')
            .forEach(prop => Bases.prototype[prop] = base.prototype[prop]);
        }
        )
    return Bases
    }

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

    class BackwardsCompatibilitySettings
    {
        test_array: any;
        compatibility_error: boolean;
        error_pos : number [];
        // Composition is used as we don't want to compute the basic error-checking everytime.
        constructor() {
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

        detect_compatibility_issues()
        {
            const test_array_len = this.test_array.length;
            var inc = 0;
            for (let i = 0; i < test_array_len; i++) {
                if (this.test_array[i] === false) {
                    this.error_pos[inc] = i;
                    inc++;
                }
                this.compatibility_error = this.error_pos.length > 0;
            }
        }

        flat_exists()
        {
            if (typeof this.test_array.flat !== "undefined" && typeof this.test_array.flat === "function") this.test_array[0] = true;
            else this.test_array[0] = false;
        }

        map_exists()
        {
            if (typeof this.test_array.map !== "undefined" && typeof this.test_array.map === "function") this.test_array[1] = true;
            else this.test_array[1] = false;
        };

        reduce_exists()
        {
            if (typeof this.test_array.reduce !== "undefined" && typeof this.test_array.reduce === "function") this.test_array[2] = true;
            else this.test_array[2] = false;
        };

        reverse_exists()
        {
            if (typeof this.test_array.reverse !== "undefined" && typeof this.test_array.reverse === "function") this.test_array[3] = true;
            else this.test_array[3] = false;
        };

        push_exists()
        {
            if (typeof this.test_array.push !== "undefined" && typeof this.test_array.push === "function") this.test_array[4] = true;
            else this.test_array[4] = false;
        }

        forEach_exists()
        {
            if (typeof this.test_array.forEach !== "undefined" && typeof this.test_array.forEach === "function") this.test_array[5] = true;
            else this.test_array[5] = false;
        }
    }

    class BasicSettings
    {

        // Miscellanous

        private object_vertices : []
        private prev_hovered_vertices_array : [];
        private hovered_vertices_array : [];
        private pre_selected_vertices_array : [];
        private selected_vertices_array : [];

        constructor()
        {
            (drop as HTMLElement).style.top = `${-(drop as HTMLElement).offsetTop + canvas.offsetTop}px`;
            this.setCanvas()
            this.resetCanvasToDefault()

            window.addEventListener("resize", () => this.setCanvas());
        }

        setCanvas(): void
        {
            // Canvas
            var width = window.innerWidth - 40;
            if (MODIFIED_PARAMS._OPEN_SIDEBAR === true) width = window.innerWidth - 300;

            const height = window.innerHeight - 100;

            MODIFIED_PARAMS._CANVAS_WIDTH = width;

            MODIFIED_PARAMS._CANVAS_HEIGHT = height;

            // Coordinate Space
            MODIFIED_PARAMS._HALF_X = width / 2;
            MODIFIED_PARAMS._HALF_Y = height / 2;

            // Perspective Projection
            MODIFIED_PARAMS._ASPECT_RATIO = width / height;
        }

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

        resetCanvasToDefault() : void{
            canvas.style.borderColor = DEFAULT_PARAMS._BORDER_COLOR
            canvas.style.borderWidth = DEFAULT_PARAMS._BORDER_WIDTH
            canvas.style.borderRadius = DEFAULT_PARAMS._BORDER_RADIUS
            canvas.style.borderStyle = DEFAULT_PARAMS._BORDER_STYLE;    
        }

        refreshCanvas() : void {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            this.setCanvas();
        }

        changeAngleUnit(angleUnit: _ANGLE_UNIT_) : void {
            MODIFIED_PARAMS._ANGLE_UNIT = angleUnit;
            MODIFIED_PARAMS._ANGLE_CONSTANT = this.angleUnit(angleUnit);
            MODIFIED_PARAMS._REVERSE_ANGLE_CONSTANT = this.revAngleUnit(angleUnit);
        }

        setHandedness(value : _HANDEDNESS_) : void {
            if (value === 'left') MODIFIED_PARAMS._HANDEDNESS_CONSTANT = -1;
            else if (value === 'right') MODIFIED_PARAMS._HANDEDNESS_CONSTANT = 1;
        }

        private angleUnit(angle_unit: _ANGLE_UNIT_) : number { // for sin, sinh, cos, cosh, tan and tanh  
            if (angle_unit === "deg") return Math.PI/180; // deg to rad
            else if (angle_unit === "rad") return 1; // rad to rad
            else if (angle_unit === 'grad') return Math.PI/200; // grad to rad
            else return _ERROR_._SETTINGS_ERROR_;
        }
    
        private revAngleUnit(angle_unit: _ANGLE_UNIT_) : number { // for asin, asinh, acos, acosh, atan and atanh  
            if (angle_unit === "deg") return 180/Math.PI; // rad to deg
            else if (angle_unit === "rad") return 1; // rad to rad
            else if (angle_unit === 'grad') return 200/Math.PI; // rad to grad
            else return _ERROR_._SETTINGS_ERROR_;
        }
    }

    const _BasicSettings = new BasicSettings();
    
    class Miscellanous
    {
        constructor() 
        {
        }
    
        // rad_to_deg();
        // rad_to_grad();
        // deg_to_rad();
        // deg_to_grad();
        // grad_to_rad();
        // grad_to_deg();

        initDepthBuffer() : Float64Array {
            const elementNum = Math.ceil(MODIFIED_PARAMS._CANVAS_HEIGHT * MODIFIED_PARAMS._CANVAS_WIDTH);
            return new Float64Array(elementNum);
        }

        resetDepthBuffer(depthBuffer : Float64Array) : Float64Array {
            return depthBuffer.fill(Infinity);
        }

        initFrameBuffer() : Uint8Array {
            const elementNum = Math.ceil(MODIFIED_PARAMS._CANVAS_HEIGHT * MODIFIED_PARAMS._CANVAS_WIDTH);
            return new Uint8Array(elementNum * 4);
        }

        resetFrameBuffer(frameBuffer : Uint8Array) : Uint8Array {
            return frameBuffer.map((value : number, index : number) => {
                const mod4 = index % 4;
                if (mod4 < 3) { return value = 0 } else return value = 255;
            });
        }
    
        getParamAsList(maxPLen : number , paramList : any[]) : any[] | _ERROR_ { //Function is memoized to increase performance
            if (arguments.length === 2) {
                const key = `${paramList}-${maxPLen}`;

                if (pListCache[key] !== undefined) {
                    return pListCache[key];
                }

                var count = 0;
                var compParamList : any[] = [];

                for (let i of paramList) {

                    if (i < maxPLen) {
                        compParamList[count] = i;
                        count++;
                    }
                }

                pListCache[key] = compParamList;

                return compParamList;
            }
            return _ERROR_._MISCELLANOUS_ERROR_;
        }

        getParamAsArg(maxPLen = Infinity, ...args : any[]) : any[] | _ERROR_ { //Function is memoized to increase perfomance
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
                } 
                
                else {
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
                var compParamList : any[] = [];

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

            return _ERROR_._MISCELLANOUS_ERROR_;
        }

        createArrayFromArgs(length : any) {
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

        createArrayFromList(param : number[]) {
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


        deepCopy(val : any) {
            var res : any = JSON.parse(JSON.stringify(val))
            if (typeof structuredClone === "function") {
                res = structuredClone(val);
            }
            return res;
        }


        getSlope(A_ : _2D_VEC_, B_ : _2D_VEC_) {
            var numer = B_[0] - A_[0];
            var denum = B_[1] - A_[1];

            return numer / denum;
        }

        getMid(a : number [], b : number[], paramList : any[] ) : any[] {
            var ret : any [] = [];
            var count = 0;
            for (let val of paramList) {
                ret.push([(a[val] + b[val]) / 2]);
                count++;
            }

            return ret;
        }

        getDist(a : number [], b : number[], paramList : any[]) : number {
            var ret = 0;
            const pLen = paramList.length;
            for (let val = 0; val < pLen; val++) {
                ret += (a[val] - b[val]) ** 2;
            }
            return Math.sqrt(ret);
        }

        getTriArea(a : number, b : number, c : number) : number {
            var S = (a + b + c) / 2;
            return Math.sqrt(S * (S - a) * (S - b) * (S - c));
        }
    
        isInsideCirc(point : _2D_VEC_ , circle : _3D_VEC_) : boolean {
            const x = Math.abs(point[0] - circle[0]);
            const y = Math.abs(point[1] - circle[1]);
            const r = circle[2];
    
            if ((x ** 2 + y ** 2) <= r ** 2) {
                return true;
            } else return false;
        }    
    }
    
    const _Miscellenous = new Miscellanous()

    class Quarternion
    {
        private normalize : boolean;
        private theta : number;
        private q_vector : _3D_VEC_;
        private q_quarternion : _4D_VEC_;
        private q_inv_quarternion : _4D_VEC_;

        constructor()
        {
            this.q_vector = DEFAULT_PARAMS._Q_VEC
            this.q_quarternion = DEFAULT_PARAMS._Q_QUART;
            this.q_inv_quarternion = DEFAULT_PARAMS._Q_INV_QUART;
            this.theta = DEFAULT_PARAMS._THETA;
        }
    
        vector(input_vec : _3D_VEC_)
        { // recommended if vector is not a unit vector i.e non-normalized
            // normalize flag to normalize vector (create a unit vector)
            if (this.normalize === false) this.q_vector = input_vec;
            else {
                const [v1,v2,v3] = input_vec
                const inv_mag = Math.pow(v1 ** 2 + v2 ** 2 + v3, -0.5);
                this.q_vector = [v1 * inv_mag, v2 * inv_mag, v3 * inv_mag];
            }
        }
    
        quarternion() : void
        {
            // quarternion

            const [v1, v2, v3] = this.q_vector;
            const [a, b] = [Math.cos(this.theta * 0.5), Math.sin(this.theta * 0.5)];
            this.q_quarternion = [a, v1 * b, v2 * b, v3 * b];
        };
    
        inv_quartenion() : void
        {
            // inverse quarternion           
            const [v1, v2, v3] = this.q_vector;
            const [a, b] = [Math.cos(this.theta * 0.5), Math.sin(this.theta * 0.5)];
            this.q_inv_quarternion = [a, -v1 * b, -v2 * b, -v3 * b];
        };
    
        q_mult(quart_A : _4D_VEC_, quart_B : _4D_VEC_) : _4D_VEC_
        {
            // quarternion _ quarternion multiplication
            const [w1, x1, y1, z1] = quart_A
            const [w2, x2, y2, z2] = quart_B

            return [(w1 * w2 - x1 * x2 - y1 * y2 - z1 * z2), (w1 * x2 + x1 * w2 + y1 * z2 - z1 * y2), (w1 * y2 + y1 * w2 + z1 * x2 - x1 * z2), (w1 * z2 + z1 * w2 + x1 * y2 - y1 * x2)];
        }
    
        q_v_invq_mult(input_vec : _3D_VEC_) : _3D_VEC_
        {
            // quarternion _ vector _ inverse quarternion multiplication for point and vector rotation
            // with additional translating (for points) and scaling (for point and vectors) capabilities
            const output_vec : _4D_VEC_ = [0,...input_vec]

            return this.q_mult(this.q_quarternion, this.q_mult(output_vec, this.q_inv_quarternion)).splice(1) as _3D_VEC_;
        }
    
        q_rot(_angle : number = 0 , _vector : _3D_VEC_ = [0, 0, 1], _point : _3D_VEC_ = [0, 0, 0]) : _3D_VEC_
        {
            this.theta = MODIFIED_PARAMS._ANGLE_CONSTANT*_angle;
            this.vector(_vector);
            this.quarternion();
            this.inv_quartenion()
            return this.q_v_invq_mult(_point);
        }
    }

    const _Quartenion = new Quarternion();
    
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
    
        matAdd(matA : number[], matB : number[], neg : boolean = false) : number[] {
            const matC : number[] = [];
            const matAlen : number = matA.length;
            const matBlen : number = matB.length;
            var sgn : number = 1;
    
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
    
            for (let i = 0; i < num; i++) {
                if (i % val === 0) {
                    matOut.push(1);
                } else matOut.push(0);
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
                    
                        verify = verify > _ERROR_._NO_ERROR_? verify : 1;

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

    class Vector {
        constructor() {}
    
        mag(vec : number []) : number {
            const v_len : number = vec.length;
            var magnitude : number = 0;
    
            for (let i = 0; i < v_len; i++) {
                magnitude += vec[i] ** 2
            }
    
            return Math.sqrt(magnitude);
        }
    
        normalizeVec(vec : number[]) : number[] {
            const len : number = Math.round(vec.length);
            const magnitude : number = this.mag(vec);
            const ret_vec : number[] = [];
    
            for (let i = 0; i < len; i++) {
                ret_vec[i] = vec[i] / magnitude;
            }
    
            return ret_vec;
        }
    
        dotProduct(vecA_or_magA : number | number[], vecB_or_magB : number | number[], angle = undefined) : number {
            // Can be:
            //          1. two vectors without an angle (angle is undefined and vectors are 2d vectors or higher).
            //          2. two magnitudes (magnitude of two vectors) with an angle (angle is a number).
    
            // Use vectors if you know the components e.g [x,y] values for 2d vectors, [x,y,z] values for 3d vectors and so on.
            // Use magnitudes and an angle if you know the magnitudes of the vectors and the angle between the two vectors.
    
            if (typeof angle === "number") { // Magnitude use.
                const toRad = MODIFIED_PARAMS._ANGLE_CONSTANT*angle;
                return (vecA_or_magA as number) * (vecB_or_magB as number) * Math.cos(toRad);
            }
    
            if (typeof angle !== "undefined") { // Vector use.
                return _ERROR_._VECTOR_ERROR_
            }
    
            const vec_a_len = (vecA_or_magA as number[]).length;
            const vec_b_len = (vecB_or_magB as number[]).length;
    
            //verify first that both vectors are of the same size and both are 2d or higher.
            if (vec_a_len === vec_b_len && vec_b_len >= 2) {
                var dot_product = 0;
    
                for (let i = 0; i < vec_a_len; i++) {
                    dot_product += vecA_or_magA[i] * vecB_or_magB[i];
                }
                return dot_product;
            }

            return _ERROR_._VECTOR_ERROR_
        }
    
        getDotProductAngle(vecA : number[], vecB : number[]) : number { // get the angle between two vectors.
            const dot_product = this.dotProduct(vecA, vecB);
            const cosAng = Math.acos(dot_product / (this.mag(vecA) * this.mag(vecB)));
    
            return MODIFIED_PARAMS._REVERSE_ANGLE_CONSTANT*cosAng;
        }
    
        getCrossProductByMatrix(vecs : number[][], vecs_len : number) {
            var cross_product : number[] = [];
            const proper_vec_len : number = vecs_len + 1; // All the vectors should be the same dimension with n + 1, where n is the number of vectors.
            var matrix_array_top_row : number[] = [];
    
            for (let i = 0; i < proper_vec_len; i++) {
                matrix_array_top_row[i] = 0 // Actually the number 0 is just a placeholder as we don't need any numbers here but we put 0 to make it a number array.
            }
    
            var same_shape : number = 0; // If this variable is still equal to zero by the end of subsequent computations,
            // it means that all the vectors are of dimenstion n + 1
            var other_rows_array : number[] = [];
    
            for (let i = 0; i < vecs_len; i++) {
                const vec_len = vecs[i].length;
                if (vec_len !== proper_vec_len) same_shape++; // If a vector is not the same dimension with n + 1,
                // increment the same_shape variable to capture this error.
                else other_rows_array.push(...vecs[i]); // Else if the vector is the same dimension with n + 1, push the vector to a matrix array.
            }
    
            if (same_shape === 0) { // All the vectors are the same dimension of n + 1.
                const matrix_array = [...matrix_array_top_row, ...other_rows_array];
                const storeCofSgn = _Matrix.getCofSgnMat([proper_vec_len, 1]);
    
                for (let i = 0; i < proper_vec_len; i++) {
                    const rest_matrix_array = _Matrix.getRestMat(matrix_array, proper_vec_len, 0, i);
                    cross_product[i] = storeCofSgn[i] * _Matrix.getDet(rest_matrix_array, vecs_len);
                }
            }
    
            return cross_product;
        }
    
        crossProduct(vecs_or_mags : number[] | number[][], angle = undefined, unitVec = undefined) : number | number[] {
            var cross_product : number | number[] = [];
            const vecs_or_mags_len = (vecs_or_mags as number[]).length;
            // Can be:
            //          1. two vectors without an angle (angle is undefined and vectors are 3d vectors or higher).
            //          2. two magnitudes (magnitude of two vectors) with an angle (angle is a number).
    
            // Use vectors if you know the components e.g [x,y,z] values for 3d vectors, [w,x,y,z] values for 4d vectors and so on.
            // Use magnitudes and an angle if you know the magnitudes of the vectors and the angle between the two vectors.
            if (typeof angle === "undefined") { // Vector use.
                cross_product = [...this.getCrossProductByMatrix((vecs_or_mags as number[][]), vecs_or_mags_len)];
            }
    
            if (typeof angle === "number") { // Magnitude use.
                var magnitude = 1 // initial magnitude place holder
                const toRad = MODIFIED_PARAMS._ANGLE_CONSTANT*angle;
    
                for (let i = 0; i < vecs_or_mags_len; i++) {
                    magnitude *= (vecs_or_mags as number[])[i];
                }
    
                if (typeof unitVec === "undefined") cross_product = magnitude * Math.sin(toRad);
                else if (typeof unitVec === "object") cross_product = _Matrix.scaMult(magnitude * Math.sin(toRad), unitVec);
            }
    
            return cross_product;
        }
    
        getCrossProductAngle(vecs : number[] | number[][]) : number { // get the angle between the vectors (makes sense in 3d, but feels kinda weird for higher dimensions but sorta feels like it works...???)
            var cross_product_angle: number | undefined = undefined;
            const vecs_len = vecs.length;
            const proper_vec_len = vecs_len + 1; // All the vectors should be the same dimension with n + 1, where n is the number of vectors.
            var same_shape = 0; // If this variable is still equal to zero by the end of subsequent computations,
            // it means that all the vectors are of dimenstion n + 1
            const cross_product_mag = this.mag(this.crossProduct(vecs) as number[]);
            var vecs_m = 1;
    
            for (let i = 0; i < vecs_len; i++) {
                const vec_len = (vecs[i] as number[]).length;
                if (vec_len !== proper_vec_len) same_shape++; // If a vector is not the same dimension with n + 1,
                // increment the same_shape variable to capture this error.
                else vecs_m *= this.mag((vecs as number[][])[i]);
            }
    
            if (same_shape === 0) {
                const sinAng = Math.asin(cross_product_mag / vecs_m);
                const fromRad = MODIFIED_PARAMS._REVERSE_ANGLE_CONSTANT*sinAng;
                cross_product_angle = fromRad;
            }
    
            return typeof cross_product_angle === "undefined" ? cross_product_angle = _ERROR_._VECTOR_ERROR_ : cross_product_angle;
        }
    
        getCrossPUnitVec(vecs : number[]) {
            var cross_product_unit_vec : number[] = [];
    
            const cross_product = this.crossProduct(vecs);
            const cross_product_mag = this.mag((cross_product as number[]));
            cross_product_unit_vec = _Matrix.scaMult(1 / cross_product_mag, (cross_product as number[]));
    
            return cross_product_unit_vec;
        }
    }

    const _Vector = new Vector()
    
    class PerspectiveProjection {

        constructor() 
        {
        }
    
        changeNearZ(val : number) {
            MODIFIED_PARAMS._NZ = -val; // right to left hand coordinate system
            this.setPersProjectParam();
        }
    
        changeFarZ(val : number) {
            MODIFIED_PARAMS._FZ = -val; // right to left hand coordinate system
            this.setPersProjectParam();
        }
    
        changeProjAngle(val : number) {
            MODIFIED_PARAMS._PROJ_ANGLE = val
            this.setPersProjectParam();
        }
    
        setPersProjectParam() : void | _ERROR_ {
            if (MODIFIED_PARAMS._ASPECT_RATIO > _ERROR_._NO_ERROR_) return _ERROR_._PERSPECTIVE_PROJ_ERROR_;
            MODIFIED_PARAMS._DIST = 1 / (Math.tan(MODIFIED_PARAMS._PROJ_ANGLE / 2 * MODIFIED_PARAMS._ANGLE_CONSTANT));
            MODIFIED_PARAMS._PROJECTION_MAT = [MODIFIED_PARAMS._DIST / MODIFIED_PARAMS._ASPECT_RATIO, 0, 0, 0, 0, MODIFIED_PARAMS._DIST, 0, 0, 0, 0, (-MODIFIED_PARAMS._NZ - MODIFIED_PARAMS._FZ) / (MODIFIED_PARAMS._NZ - MODIFIED_PARAMS._FZ), (2 * MODIFIED_PARAMS._FZ * MODIFIED_PARAMS._NZ) / (MODIFIED_PARAMS._NZ - MODIFIED_PARAMS._FZ), 0, 0, 1, 0];

            const inverse_res : number[] | _ERROR_ = _Matrix.getInvMat(MODIFIED_PARAMS._PROJECTION_MAT, 4);
            if (typeof inverse_res === "number") return _ERROR_._PERSPECTIVE_PROJ_ERROR_;
            if (inverse_res.length !== 16) return _ERROR_._PERSPECTIVE_PROJ_ERROR_;
            MODIFIED_PARAMS._INV_PROJECTION_MAT = inverse_res as _16D_VEC_;
        }
    
        persProject(input_array : _4D_VEC_) : _4D_VEC_ {
            return _Matrix.matMult(MODIFIED_PARAMS._PROJECTION_MAT, input_array, [4, 4], [4, 1]) as _4D_VEC_;
        }
    
        invPersProject(input_array : _4D_VEC_) : _4D_VEC_ {
            return _Matrix.matMult(MODIFIED_PARAMS._INV_PROJECTION_MAT, input_array, [4, 4], [4, 1]) as _4D_VEC_;
        }
    }

    const _PerspectiveProjection = new PerspectiveProjection()  

    class Clip {
        constructor() {}
    
        canvasTo(arr : _4D_VEC_) : _4D_VEC_ {
            const array : _4D_VEC_ = [...arr];
            array[0] -= MODIFIED_PARAMS._HALF_X;
            array[1] -= MODIFIED_PARAMS._HALF_Y;
            return array;
        }
    
        clipCoords(arr : _4D_VEC_) : _4D_VEC_{
            const array : _4D_VEC_ = [...arr];
            array[0] /= MODIFIED_PARAMS._HALF_X;
            array[1] /= MODIFIED_PARAMS._HALF_Y;
            return array;
        }
    
        toCanvas(arr : _4D_VEC_) : _4D_VEC_ {
            const array : _4D_VEC_ = [...arr];
            array[0] += MODIFIED_PARAMS._HALF_X;
            array[1] += MODIFIED_PARAMS._HALF_Y;
            return array;
        }
    
        unclipCoords(arr : _4D_VEC_) : _4D_VEC_ {
            const array : _4D_VEC_ = [...arr];
            array[0] *= MODIFIED_PARAMS._HALF_X;
            array[1] *= MODIFIED_PARAMS._HALF_Y;
            return array;
        }
    }

    const _Clip = new Clip()
    
    class LocalSpace {
        constructor() {};
    
        objectRotate(point : _3D_VEC_, axis : _3D_VEC_, angle : number, state : _OBJ_STATE_) {
            if (state === "local" || state === "object") return _Quartenion.q_rot(angle, axis, point);
        };
    
        ObjectScale(point : _3D_VEC_, scaling_array : _3D_VEC_, state : _OBJ_STATE_) {
            if (state === "local" || state === "object") return [point[0] * scaling_array[0], point[1] * scaling_array[1], point[2] * scaling_array[2]];
        }
    }

    const _LocalSpace = new LocalSpace();
    
    class WorldSpace {
        constructor() {}
        ObjectTransform(point : _3D_VEC_, translation_array : _3D_VEC_, state : _OBJ_STATE_) {
            if (state === "world") return _Matrix.matAdd(point, translation_array);
        };
    
        objectRevolve(point : _3D_VEC_, axis : _3D_VEC_, angle : number, state : _OBJ_STATE_) {
            if (state === "world") return _Quartenion.q_rot(angle, axis, point);
        }
    }
    
    const _WorldSpace = new WorldSpace();

    interface OPTICALELEMENT {
        instance_number : number;
        optical_type : _OPTICAL_;
        _ACTUAL_POS: _3D_VEC_;
        _USED_POS : _3D_VEC_;
        _LOOK_AT_POINT : _3D_VEC_;
        _U: _3D_VEC_;
        _V: _3D_VEC_;
        _N: _3D_VEC_;
        _C : _3D_VEC_;
        _MATRIX : _16D_VEC_;
        _INV_MATRIX : _16D_VEC_,
        depthBuffer : Float64Array,
        frameBuffer : Uint8Array,
    }

    class OpticalElement {
        // Default

        // _CAM_MATRIX : [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        // _INV_CAM_MATRIX : [1, -0, 0, -0, -0, 1, -0, 0, 0, -0, 1, -0, -0, 0, -0, 1],
        // actpos = [0,0,1],
        // usedpos = [0,0,-1]

        instance : OPTICALELEMENT = {
            instance_number : 0,
            optical_type : "none",
            _ACTUAL_POS : [0,0,0],
            _USED_POS : [0,0,0],
            _LOOK_AT_POINT : [0,0,0],
            _U : [0,0,0],
            _V : [0,0,0],
            _N : [0,0,0],
            _C : [0,0,0],
            _MATRIX : [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1] as _16D_VEC_,
            _INV_MATRIX : _Matrix.getInvMat([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], 4) as _16D_VEC_,
            depthBuffer : _Miscellenous.initDepthBuffer(),
            frameBuffer : _Miscellenous.initFrameBuffer(),
        }    

        constructor(optical_type_input : _OPTICAL_)
        {
            this.instance.optical_type = optical_type_input;
            return this;
        }

        resetBuffers() : void{
            _Miscellenous.resetDepthBuffer(this.instance.depthBuffer);
            _Miscellenous.resetFrameBuffer(this.instance.frameBuffer);
        }

        setPos(input_array: _3D_VEC_) {
            this.instance._ACTUAL_POS = input_array;
            this.instance._USED_POS = input_array;
            this.instance._USED_POS[2] = -this.instance._USED_POS[2] // reverse point for right to left hand coordinate system
        }
        
        setCoordSystem(){
            const DIFF: _3D_VEC_ = _Matrix.matAdd(this.instance._LOOK_AT_POINT, this.instance._USED_POS, true) as _3D_VEC_;
            const UP: _3D_VEC_ = [0, 1, 0];
            
            this.instance._N = _Vector.normalizeVec(DIFF) as _3D_VEC_;
            this.instance._U = _Vector.normalizeVec(_Vector.crossProduct([UP, this.instance._N]) as number[]) as _3D_VEC_;
            this.instance._V = _Vector.normalizeVec(_Vector.crossProduct([this.instance._N, this.instance._U]) as number[]) as _3D_VEC_;
        }
        
        setConversionMatrices(){
            this.instance._MATRIX = [...this.instance._U, this.instance._C[0], ...this.instance._V, this.instance._C[1], ...this.instance._N, this.instance._C[2], ...[0, 0, 0, 1]] as _16D_VEC_;
            this.instance._INV_MATRIX = _Matrix.getInvMat(this.instance._MATRIX, 4) as _16D_VEC_;
        }
    
        setLookAtPos(look_at_point: _3D_VEC_) {
            look_at_point[2] = -look_at_point[2];// reverse point for right to left hand coordinate system
            this.instance._LOOK_AT_POINT = look_at_point;
            
            this.setCoordSystem()
            this.setConversionMatrices()
        }
    
        rotate(plane: _PLANE_, angle: number): void | _ERROR_._OPTICAL_ELEMENT_OBJECT_ERROR_ {
            if (plane === "U-V") {
                const _U_N = _Quartenion.q_rot(angle, this.instance._U, this.instance._N);
                const _V_N = _Quartenion.q_rot(angle, this.instance._V, this.instance._N);
    
                if (typeof _U_N === "number") return _ERROR_._OPTICAL_ELEMENT_OBJECT_ERROR_
                if (typeof _V_N === "number") return _ERROR_._OPTICAL_ELEMENT_OBJECT_ERROR_
                this.instance._U = _U_N as _3D_VEC_;
                this.instance._V = _V_N as _3D_VEC_;
    
            } else if (plane === "U-N") {
                const _U_V = _Quartenion.q_rot(angle, this.instance._U, this.instance._V);
                const _V_N = _Quartenion.q_rot(angle, this.instance._V, this.instance._N);
    
                if (typeof _U_V === "number") return _ERROR_._OPTICAL_ELEMENT_OBJECT_ERROR_
                if (typeof _V_N === "number") return _ERROR_._OPTICAL_ELEMENT_OBJECT_ERROR_
                this.instance._U = _U_V as _3D_VEC_;
                this.instance._V = _V_N as _3D_VEC_;
    
            } else if (plane === "V-N") {
                const _U_V = _Quartenion.q_rot(angle, this.instance._U, this.instance._V);
                const _U_N = _Quartenion.q_rot(angle, this.instance._U, this.instance._N);
    
                if (typeof _U_V === "number") return _ERROR_._OPTICAL_ELEMENT_OBJECT_ERROR_
                if (typeof _U_N === "number") return _ERROR_._OPTICAL_ELEMENT_OBJECT_ERROR_
                this.instance._U = _U_V as _3D_VEC_;
                this.instance._V = _U_N as _3D_VEC_;
            }
            
            this.setConversionMatrices()
        }
        
        translate(translation_array: _3D_VEC_) {
            this.instance._C = translation_array;
            this.instance._ACTUAL_POS = _Matrix.matAdd(this.instance._ACTUAL_POS, translation_array) as _3D_VEC_;
            this.instance._USED_POS = [...this.instance._ACTUAL_POS];
            this.instance._USED_POS[2] = -this.instance._ACTUAL_POS[2]; // reverse point for right to left hand coordinate system
            
            this.setCoordSystem()
            this.setConversionMatrices()
        }

        worldToOpticalObject(ar:  _3D_VEC_) : _4D_VEC_ {
            const arr : _4D_VEC_ = [...ar,1]
            arr[2] = -arr[2] // reverse point for right to left hand coordinate system
            const result : _4D_VEC_ = _Matrix.matMult(this.instance._MATRIX, arr, [4, 4], [4, 1]) as _4D_VEC_;
            return result;
        }
    
        opticalObjectToWorld(arr : _4D_VEC_) : _3D_VEC_ {
            const result : _4D_VEC_ = _Matrix.matMult(this.instance._INV_MATRIX, arr, [4, 4], [4, 1]) as _4D_VEC_;
            result[2] = -result[2] // reverse point for left to right hand coordinate system
            const new_result : _3D_VEC_ = result.slice(0,3) as _3D_VEC_;
            return new_result;
        }
    }

    class ClipSpace {
        constructor() {};
    
        opticalObjectToClip(arr :  _4D_VEC_) : _4D_VEC_ {
            const orig_proj : _4D_VEC_ = _Matrix.matMult(MODIFIED_PARAMS._PROJECTION_MAT, arr, [4, 4], [4, 1]) as _4D_VEC_;
            const pers_div : _4D_VEC_ = _Matrix.scaMult(1 / orig_proj[3], orig_proj, true) as _4D_VEC_;
            return pers_div;
        };
    
        clipToOpticalObject(arr :  _4D_VEC_) : _4D_VEC_ {
            const rev_pers_div : _4D_VEC_ = _Matrix.scaMult(arr[3], arr, true) as _4D_VEC_;
            const rev_orig_proj : _4D_VEC_ = _Matrix.matMult(MODIFIED_PARAMS._INV_PROJECTION_MAT, rev_pers_div, [4, 4], [4, 1]) as _4D_VEC_;
            return rev_orig_proj;
        };
    }

    const _ClipSpace = new ClipSpace();
    
    class ScreenSpace {
        constructor() {};
    
        clipToScreen(arr :  _4D_VEC_) : _4D_VEC_ | _ERROR_ {
            if (arr[2] >= -1.1 && arr[2] <= 1.1 && arr[2] != Infinity) {
                arr[2] = -arr[2];
                // -array[2] (-z) reverse point for left to right hand coordinate system
                const [i, j, k, l] = _Clip.unclipCoords(arr);
                const [x, y, z, w] = _Clip.toCanvas([i, j, k, l]);
                return [x, y, z, w];
            }
            else return _ERROR_._SCREEN_SPACE_ERROR_;
        };
    
        screenToClip(arr :  _4D_VEC_) : _4D_VEC_  {
            const [i, j, k, l] = _Clip.canvasTo(arr);
            const [x, y, z, w] = _Clip.clipCoords([i, j, k, l]);
            // -array[2] (-z) reverse point for right to left hand coordinate system
            return  [x, y, -z, w];
        };
    }

    const _ScreenSpace = new ScreenSpace();

    class OpticalElement_Objects{
        optical_element_array : OpticalElement[]
        instance_number : number;
        arrlen : number;

        selected_light_instances : object;
        selected_camera_instances : object;

        max_camera_instance_number : number;
        max_light_instance_number : number;

        instance_number_to_list_map : object;

        constructor()
        {
            this.arrlen = 0;
            this.instance_number = 0;
            this.selected_light_instances = {};
            this.selected_camera_instances = {};
            this.createNewCameraObject();
            this.createNewCameraObject();
        }

        createNewCameraObject() : void{
            this.max_camera_instance_number = this.instance_number;
            this.optical_element_array[this.arrlen] = new OpticalElement("camera");
            this.instance_number_to_list_map[this.instance_number] = this.arrlen;
            this.instance_number++;
            this.arrlen++;
        }

        createNewLightObject() : void{
            this.max_light_instance_number = this.instance_number;
            this.optical_element_array[this.arrlen] = new OpticalElement("light");
            this.instance_number_to_list_map[this.instance_number] = this.arrlen;
            this.instance_number++;
            this.arrlen++;
        }

        createNewMultipleCameraObjects = (num : number) : void => {if(num > 0) while (num > 0) {this.createNewCameraObject(); num--;}}

        createNewMultipleLightObjects = (num : number) : void =>  {if(num > 0) while (num > 0) {this.createNewLightObject(); num--;}}

        private deleteOpticalObject(instance_number_input : number,index : number) : void {
            this.optical_element_array.splice(index,1);
            delete this.instance_number_to_list_map[instance_number_input];

            for (const key in this.instance_number_to_list_map){
                if (Number(key) > instance_number_input){
                    this.instance_number_to_list_map[key] = this.instance_number_to_list_map[key] - 1;
                }
            }

            if (instance_number_input in this.selected_camera_instances) delete this.selected_camera_instances[instance_number_input];
            if (instance_number_input in this.selected_light_instances) delete this.selected_light_instances[instance_number_input];

            if (Object.keys(this.selected_camera_instances).length === 0) this.selected_camera_instances[0] = 0;
            if (Object.keys(this.selected_light_instances).length === 0) this.selected_light_instances[1] = 1;
        }

        deleteCameraObject(instance_number_input : number) : void {
            if (instance_number_input > 1 && instance_number_input <= this.max_camera_instance_number)
            {
                const index = this.instance_number_to_list_map[instance_number_input];
                if(this.optical_element_array[index].instance.optical_type === "camera")// additional safety checks
                {
                    this.deleteOpticalObject(instance_number_input,index);
                    this.arrlen = this.optical_element_array.length;
                }
            }            
        }

        deleteLightObject(instance_number_input : number) : void 
        {
            if (instance_number_input > 1 && instance_number_input <= this.max_light_instance_number)
            {
                const index = this.instance_number_to_list_map[instance_number_input];
                if(this.optical_element_array[index].instance.optical_type === "light") // additional safety checks
                {
                    this.deleteOpticalObject(instance_number_input,index);
                    this.arrlen = this.optical_element_array.length;
                }
            }           
        }

        // doesn't delete the first one
        deleteAllCameraObjects():void
        {
            for (const key in this.instance_number_to_list_map){
                const index = this.instance_number_to_list_map[key];
                if (index > 1 && this.optical_element_array[index].instance.optical_type === "camera")
                {
                    this.deleteOpticalObject(Number(key),index);
                }
            }
            this.arrlen = this.optical_element_array.length;
        }

        // doesn't delete the first one
        deleteAllLightObjects():void{
            for (const key in this.instance_number_to_list_map){
                const index = this.instance_number_to_list_map[key];
                if (index > 1 && this.optical_element_array[index].instance.optical_type === "light")
                {
                    this.deleteOpticalObject(Number(key),index);
                }
            }
            this.arrlen = this.optical_element_array.length;
        }

        // doesn't delete the first two
        deleteAllOpticalObjects():void{
            for (const key in this.instance_number_to_list_map){
                const index = this.instance_number_to_list_map[key];
                if (index > 1)
                {
                    this.deleteOpticalObject(Number(key),index);
                }
            }
            this.arrlen = this.optical_element_array.length;
        }

        select_camera_instance(instance_number_input : number) : void{            
            if (instance_number_input !== 1 && instance_number_input <= this.max_camera_instance_number){            
                const selection = this.instance_number_to_list_map[instance_number_input];    
                if (this.optical_element_array[selection].instance.optical_type === "camera") this.selected_camera_instances[instance_number_input] = selection;
            }
        }

        deselect_camera_instance(instance_number_input : number) : void | _ERROR_{
            if (instance_number_input !== 1 && instance_number_input <= this.max_camera_instance_number){
                if (instance_number_input in this.selected_camera_instances){
                    const selection = this.instance_number_to_list_map[instance_number_input];
                    if (this.optical_element_array[selection].instance.optical_type === "camera") delete this.selected_camera_instances[instance_number_input];

                    if (Object.keys(this.selected_camera_instances).length === 0){
                        this.selected_camera_instances[0] = 0;
                        if (instance_number_input === 0) return _ERROR_._OPTICAL_ELEMENT_OBJECT_ERROR_;                
                    }
                }
            }
        }

        select_light_instance(instance_number_input : number) : void{            
            if (instance_number_input !== 0 && instance_number_input <= this.max_light_instance_number){            
                const selection = this.instance_number_to_list_map[instance_number_input]    
                if (this.optical_element_array[selection].instance.optical_type === "light") this.selected_light_instances[instance_number_input] = selection;
            }
        }

        deselect_light_instance(instance_number_input : number) : void | _ERROR_{
            if (instance_number_input !== 0 && instance_number_input <= this.max_light_instance_number){
                if (instance_number_input in this.selected_light_instances){
                    const selection = this.instance_number_to_list_map[instance_number_input];
                    if (this.optical_element_array[selection].instance.optical_type === "light") delete this.selected_light_instances[instance_number_input];

                    if (Object.keys(this.selected_light_instances).length === 0){
                        this.selected_light_instances[1] = 1;
                        if (instance_number_input === 1) return _ERROR_._OPTICAL_ELEMENT_OBJECT_ERROR_;  
                    }
                }
            }
        }

        render(vertex : _3D_VEC_,optical_type : _OPTICAL_) : _4D_VEC_ | _ERROR_{
            var world_to_optical_object_space : _4D_VEC_ = [0,0,0,0];

            switch (optical_type){
                case "none" : return _ERROR_._OPTICAL_ELEMENT_OBJECT_ERROR_;
                case "camera" : world_to_optical_object_space = this.optical_element_array[this.selected_camera_instances[0]].worldToOpticalObject(vertex);
                case "light" : world_to_optical_object_space =  this.optical_element_array[this.selected_light_instances[0]].worldToOpticalObject(vertex);
            }

            const optical_object_to_clip_space : _4D_VEC_ = _ClipSpace.opticalObjectToClip(world_to_optical_object_space);
            return _ScreenSpace.clipToScreen(optical_object_to_clip_space);
        }
    }

    const _Optical_Objects = new OpticalElement_Objects()

    class ObjectManager{}

    class PointLight{}

    class DirectionalLight{}

    class SpotLight{}

    class AreaLight{}

    class AmbientLight{}

    class AmbientLighting{}

    class DiffuseLighting{}

    class SpecularLighting{}

    class FlatShading{}

    class GouraudShading{}

    class PhongShading{}

    class BlinnPhongShading{}

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
}