//

"use strict"

{
    const pListCache : {} = {};     
    const pArgCache : {} = {};

    // //CHECK IF DEVICE IS A MOBILE DEVICE OR NOT--3

    const details = navigator.userAgentData;

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

    type _7D_VEC_ = [..._3D_VEC_,..._4D_VEC_]

    type _3_3_MAT_ = [_3D_VEC_,_3D_VEC_,_3D_VEC_]

    type _3_7_MAT_ = [_7D_VEC_,_7D_VEC_,_7D_VEC_]

    type _4_4_MAT_ = [number, number, number,number,number, number, number,number,number, number, number,number,number, number, number,number];
    
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
        _MATRIX_ERROR,
        _VECTOR_ERROR_,
        _PERSPECTIVE_PROJ_ERROR_,
        _ERROR_,
        _CLIP_ERROR_,
        _LOCAL_SPACE_ERROR_,
        _WORLD_SPACE_ERROR_,
        _CLIP_SPACE_ERROR_,
        _SCREEN_SPACE_ERROR_,
        _OPTICAL_ELEMENT_OBJECT_ERROR_,
        _PRERENDER_ERROR_,
        _INTERPOL_REND_ERROR_,
        _DRAW_CANVAS_ERROR_,
    }

    enum _MATRIX_ERROR_
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
            if (navigator.userAgentData.mobile === true) {
                return startDragMobile(element);
            } else {
                return startDrag(element);
            }
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
        _AR_INV : number ,
        _DIST : number,
        _HALF_X : number,
        _HALF_Y : number,
        _PROJECTION_MAT_ : _4_4_MAT_,
        _INV_PROJECTION_MAT_ : _4_4_MAT_,
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
        _NZ : 0.1,
        _FZ : 100,
        _PROJ_ANGLE : 60,
        _ASPECT_RATIO : 1,
        _AR_INV : 1,
        _DIST : 1,
        _HALF_X : 1,
        _HALF_Y : 1,
        _PROJECTION_MAT_ : [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        _INV_PROJECTION_MAT_ : [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
        _OPEN_SIDEBAR : true,
        }

    const MODIFIED_PARAMS : _BASIC_PARAMS_ = JSON.parse(JSON.stringify(DEFAULT_PARAMS))

    class BackwardsCompatibilitySettings
    {
        test_array: any;
        compatibility_error: boolean;
        first_ERROR_pos : null | number;
        // Composition is used as we don't want to compute the basic error-checking everytime.
        constructor() {
            this.test_array = new Array();
            this.compatibility_error = false;
            this.first_ERROR_pos = null;

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
            for (let i = 0; i < test_array_len; i++) {
                if (this.test_array[i] === false) {
                    this.compatibility_error = true;
                    this.first_ERROR_pos = i;
                    return;
                }
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
        private normalize : boolean
        private theta : number | undefined

        private q_vector : _3D_VEC_
        private q_quarternion : _4D_VEC_
        private q_inv_quarternion : _4D_VEC_

        constructor()
        {
            this.q_vector = DEFAULT_PARAMS._Q_VEC
            this.q_quarternion = DEFAULT_PARAMS._Q_QUART
            this.q_inv_quarternion = DEFAULT_PARAMS._Q_INV_QUART
            this.theta = undefined
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
            this.theta = this.theta as number
            const [a, b] = [Math.cos(this.theta * 0.5), Math.sin(this.theta * 0.5)];
            this.q_quarternion = [a, v1 * b, v2 * b, v3 * b];
        };
    
        inv_quartenion() : void
        {
            // inverse quarternion           
            const [v1, v2, v3] = this.q_vector;
            this.theta = this.theta as number;
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
    
        q_rot(_angle : number = 0 , _vector : _3D_VEC_ = [0, 0, 1], _point : _3D_VEC_ = [0, 0, 0]) : _3D_VEC_ | _ERROR_._QUARTERNION_ERROR_ 
        {
            if (typeof this.theta === "undefined") return _ERROR_._QUARTERNION_ERROR_
            this.theta = this.theta as number
            this.theta = MODIFIED_PARAMS._ANGLE_CONSTANT*_angle;
            this.vector(_vector);
            this.quarternion();this.inv_quartenion()
            return this.q_v_invq_mult(_point);
        }
    }

    const _Quartenion = new Quarternion();
    
    class Matrix 
    {
        constructor()
        {}

        // // Pitch
        // rotX(ang : number) : _4_4_MAT_ {
        //     const angle = MODIFIED_PARAMS._ANGLE_CONSTANT*ang;
        //     return [1, 0, 0, 0, 0, Math.cos(angle), -Math.sin(angle) * MODIFIED_PARAMS._HANDEDNESS_CONSTANT, 0, 0, Math.sin(angle) * MODIFIED_PARAMS._HANDEDNESS_CONSTANT, Math.cos(angle), 0, 0, 0, 0, 1];
        // }

        // // Yaw
        // rotY(ang : number) : _4_4_MAT_ {
        //     const angle = MODIFIED_PARAMS._ANGLE_CONSTANT*ang;
        //     return [Math.cos(angle), 0, Math.sin(angle) * MODIFIED_PARAMS._HANDEDNESS_CONSTANT, 0, 0, 1, 0, 0, -Math.sin(angle) * MODIFIED_PARAMS._HANDEDNESS_CONSTANT, 0, Math.cos(angle), 0, 0, 0, 0, 1];
        // }

        // //Roll
        // rotZ(ang : number) : _4_4_MAT_ {
        //     const angle = MODIFIED_PARAMS._ANGLE_CONSTANT*ang;
        //     return [Math.cos(angle), -Math.sin(angle) * MODIFIED_PARAMS._HANDEDNESS_CONSTANT, 0, 0, Math.sin(angle) * MODIFIED_PARAMS._HANDEDNESS_CONSTANT, Math.cos(angle), 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
        // }

        // rot3d(x : number, y : number, z : number) : _4_4_MAT_ {
        //     return this.matMult(this.rotZ(z), this.matMult(this.rotY(y), this.rotX(x), [4, 4], [4, 4]), [4, 4], [4, 4]) as _4_4_MAT_;
        // };
        
        // transl3d(x : number, y : number, z : number) : _4_4_MAT_ {
        //     return [1, 0, 0, x, 0, 1, 0, y, 0, 0, 1, z, 0, 0, 0, 1];
        // }

        // scale3dim(x : number, y : number, z : number) : _4_4_MAT_ {
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
    
        matMult(matA : number[], matB : number[], shapeA : _2D_VEC_, shapeB : _2D_VEC_) : number[] {
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
    
        scaMult(scalarVal : number, matIn : number [], leaveLast : boolean = false) : number[] {
            const matInlen : number = matIn.length;
            const matOut : number[] = [];
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
    
        matAdd(matA : number[], matB : number[], neg : boolean = false) : number[] {
            const matC : number[] = [];
            const matAlen : number = matA.length;
            const matBlen : number = matB.length;
            var sgn : number  = 1;
    
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
    
        getDet(matIn : number | number [], shapeNum : number) : number | _ERROR_._MATRIX_ERROR {
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

            else return _ERROR_._MATRIX_ERROR + _MATRIX_ERROR_._DET_*10;
        }
    
        getMinorMat(matIn : number[], shapeNum : number) : number[] | _ERROR_ {
            const matOut : number[] = [];
    
            for (let i = 0; i < shapeNum; i++) {
                for (let j = 0; j < shapeNum; j++) {
                    const result : number | _ERROR_ = this.getDet(this.getRestMat(matIn, shapeNum, i, j), shapeNum - 1)
                    if (result > _ERROR_._NO_ERROR_) return result + _MATRIX_ERROR_._MINOR_*100;
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
                if (_minorMat > _ERROR_._NO_ERROR_) return _minorMat + _MATRIX_ERROR_._COF_*1000;
                
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
                if (result > _ERROR_._NO_ERROR_) return result + _MATRIX_ERROR_._ADJ_*10000 ;
            return this.getTranspMat((result as number[]), [shapeNum, shapeNum]);
        }
    
        getInvMat(matIn : number[], shapeNum : number) : number[] | _ERROR_ {
            const det_result : number = this.getDet(matIn, shapeNum);

            if (det_result > _ERROR_._NO_ERROR_) return det_result+_MATRIX_ERROR_._INV_*100000;

            const adj_result : number[] | _ERROR_ = this.getAdjMat(matIn,shapeNum);

            if (typeof adj_result === "number")
                if (adj_result > _ERROR_._NO_ERROR_) return adj_result+_MATRIX_ERROR_._INV_*100000;
            
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
    
            return typeof cross_product_angle === "undefined" ? cross_product_angle = _ERROR_._VECTOR_ERROR_ : cross_product_angle
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
            MODIFIED_PARAMS._NZ = val;
            this.setPersProjectParam();
        }
    
        changeFarZ(val : number) {
            MODIFIED_PARAMS._FZ = val;
            this.setPersProjectParam();
        }
    
        changeProjAngle(val : number) {
            MODIFIED_PARAMS._FZ = val
            this.setPersProjectParam();
        }
    
        setPersProjectParam() {
            if (MODIFIED_PARAMS._ASPECT_RATIO > _ERROR_._NO_ERROR_) return _ERROR_._PERSPECTIVE_PROJ_ERROR_;
            MODIFIED_PARAMS._AR_INV = 1 / MODIFIED_PARAMS._ASPECT_RATIO;
            MODIFIED_PARAMS._DIST = 1 / (Math.tan((MODIFIED_PARAMS._DIST / 2) * (Math.PI / 180)));
            MODIFIED_PARAMS._PROJECTION_MAT_ = [MODIFIED_PARAMS._DIST * MODIFIED_PARAMS._AR_INV, 0, 0, 0, 0, MODIFIED_PARAMS._DIST, 0, 0, 0, 0, (-MODIFIED_PARAMS._NZ - MODIFIED_PARAMS._FZ) / (MODIFIED_PARAMS._NZ - MODIFIED_PARAMS._FZ), (2 * MODIFIED_PARAMS._FZ * MODIFIED_PARAMS._NZ) / (MODIFIED_PARAMS._NZ - MODIFIED_PARAMS._FZ), 0, 0, 1, 0];

            const inverse_res : number[] | _ERROR_ = _Matrix.getInvMat(MODIFIED_PARAMS._PROJECTION_MAT_, 4);
            if (typeof inverse_res === "number") return _ERROR_._PERSPECTIVE_PROJ_ERROR_;
            if (inverse_res.length !== 16) return _ERROR_._PERSPECTIVE_PROJ_ERROR_;
            MODIFIED_PARAMS._INV_PROJECTION_MAT_ = inverse_res as _4_4_MAT_;
        }
    
        persProject(input_array : _4D_VEC_) {
            return _Matrix.matMult(MODIFIED_PARAMS._PROJECTION_MAT_, input_array, [4, 4], [4, 1]);
        }
    
        invPersProject(input_array : _4D_VEC_) {
            return _Matrix.matMult(MODIFIED_PARAMS._INV_PROJECTION_MAT_, input_array, [4, 4], [4, 1]);
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

    const _LocalSpace = new LocalSpace()
    
    class WorldSpace {
        constructor() {}
        ObjectTransform(point : _3D_VEC_, translation_array : _3D_VEC_, state : _OBJ_STATE_) {
            if (state === "world") return _Matrix.matAdd(point, translation_array);
        };
    
        objectRevolve(point : _3D_VEC_, axis : _3D_VEC_, angle : number, state : _OBJ_STATE_) {
            if (state === "world") return _Quartenion.q_rot(angle, axis, point);
        }
    }
    
    const _WorldSpace = new WorldSpace()

    class ClipSpace {
        constructor() {};
    
        camera_or_light_ToClip(arr :  _4D_VEC_) : _4D_VEC_ {
            const orig_proj : _4D_VEC_ = _Matrix.matMult(MODIFIED_PARAMS._PROJECTION_MAT_, arr, [4, 4], [4, 1]) as _4D_VEC_;
            const pers_div : _4D_VEC_ = _Matrix.scaMult(1 / orig_proj[3], orig_proj, true) as _4D_VEC_;
            return pers_div;
        };
    
        clip_ToCamera_or_ToLight(arr :  _4D_VEC_) : _4D_VEC_ {
            const rev_pers_div : _4D_VEC_ = _Matrix.scaMult(arr[3], arr, true) as _4D_VEC_;
            const rev_orig_proj : _4D_VEC_ = _Matrix.matMult(MODIFIED_PARAMS._INV_PROJECTION_MAT_, rev_pers_div, [4, 4], [4, 1]) as _4D_VEC_;
            return rev_orig_proj;
        };
    }

    const _ClipSpace = new ClipSpace()
    
    class ScreenSpace {
        constructor() {};
    
        clipToScreen(arr :  _4D_VEC_) : _4D_VEC_ | _ERROR_ {
            if (arr[2] >= -1.1 && arr[2] <= 1.1 && arr[2] != Infinity) {
                const [i, j, k, l] = _Clip.unclipCoords(arr);
                const [w, x, y, z] = _Clip.toCanvas([i, j, k, l]);
                // -array[2] (-y) reverse point for right to left hand coordinate system
                return [w, x, -y, z];
            }
            else return _ERROR_._NO_ERROR_;
        };
    
        screenToClip(arr :  _4D_VEC_) : _4D_VEC_  {
            const [i, j, k, l] = _Clip.canvasTo(arr);
            const [w, x, y, z] = _Clip.clipCoords([i, j, k, l]);
            // -array[2] (-y) reverse point for right to left hand coordinate system
            return [w, x, -y, z];
        };
    }

    const _ScreenSpace = new ScreenSpace();

    interface OPTICALELEMENT {
        instance_number : number;
        optical_type : _OPTICAL_
        _ACTUAL_POS: _3D_VEC_;
        _USED_POS: _3D_VEC_;
        _U: _3D_VEC_;
        _V: _3D_VEC_;
        _N: _3D_VEC_;
        _C : _3D_VEC_;
        _MATRIX : _4_4_MAT_;
        _INV_MATRIX : _4_4_MAT_,
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
            _U : [0,0,0],
            _V : [0,0,0],
            _N : [0,0,0],
            _C : [0,0,0],
            _MATRIX : [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1] as _4_4_MAT_,
            _INV_MATRIX : _Matrix.getInvMat([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1], 4) as _4_4_MAT_,
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

        setLightPos(input_array: _3D_VEC_) {
            this.instance._ACTUAL_POS = input_array;
            this.instance._USED_POS = input_array;
            this.instance._USED_POS[2] = -this.instance._USED_POS[2] // reverse point for right to left hand coordinate system
        }
    
        lookAt(look_at_point: _3D_VEC_) {
            look_at_point[2] = -look_at_point[2]; // reverse point for right to left hand coordinate system
            const DIFF: _3D_VEC_ = _Matrix.matAdd(look_at_point, this.instance._USED_POS, true) as _3D_VEC_;
            const UP: _3D_VEC_ = [0, 1, 0];
    
            this.instance._N = _Vector.normalizeVec(DIFF) as _3D_VEC_;
            this.instance._U = _Vector.normalizeVec(_Vector.crossProduct([UP, this.instance._N]) as number[]) as _3D_VEC_;
            this.instance._V = _Vector.normalizeVec(_Vector.crossProduct([this.instance._N, this.instance._U]) as number[]) as _3D_VEC_;
        }
    
        rotate(plane: _PLANE_, angle: number): void | _ERROR_._ERROR_ {
            if (plane === "U-V") {
                const _N_U = _Quartenion.q_rot(angle, this.instance._N, this.instance._U);
                const _N_V = _Quartenion.q_rot(angle, this.instance._N, this.instance._V);
    
                if (typeof _N_U === "number") return _ERROR_._ERROR_
                if (typeof _N_V === "number") return _ERROR_._ERROR_
                this.instance._U = _N_U as _3D_VEC_;
                this.instance._V = _N_V as _3D_VEC_;
    
            } else if (plane === "U-N") {
                const _V_U = _Quartenion.q_rot(angle, this.instance._V, this.instance._U);
                const _V_N = _Quartenion.q_rot(angle, this.instance._V, this.instance._N);
    
                if (typeof _V_U === "number") return _ERROR_._ERROR_
                if (typeof _V_N === "number") return _ERROR_._ERROR_
                this.instance._U = _V_U as _3D_VEC_;
                this.instance._V = _V_N as _3D_VEC_;
    
            } else if (plane === "V-N") {
                const _U_V = _Quartenion.q_rot(angle, this.instance._U, this.instance._V);
                const _U_N = _Quartenion.q_rot(angle, this.instance._U, this.instance._N);
    
                if (typeof _U_V === "number") return _ERROR_._ERROR_
                if (typeof _U_N === "number") return _ERROR_._ERROR_
                this.instance._U = _U_V as _3D_VEC_;
                this.instance._V = _U_N as _3D_VEC_;
    
            }
    
            this.instance._MATRIX = [...this.instance._U, this.instance._C[0], ...this.instance._V, this.instance._C[1], ...this.instance._N, this.instance._C[2], ...[0, 0, 0, 1]] as _4_4_MAT_;
            this.instance._INV_MATRIX = _Matrix.getInvMat(this.instance._MATRIX, 4) as _4_4_MAT_;
        }
    
        translate(translation_array: _3D_VEC_) {
            this.instance._C = translation_array;
            this.instance._ACTUAL_POS = _Matrix.matAdd(this.instance._ACTUAL_POS, translation_array) as _3D_VEC_;
            this.instance._USED_POS = [...this.instance._ACTUAL_POS];
            this.instance._USED_POS[2] = -this.instance._ACTUAL_POS[2]; // reverse point for right to left hand coordinate system
            this.instance._MATRIX = [...this.instance._U, this.instance._C[0], ...this.instance._V, this.instance._C[1], ...this.instance._N, this.instance._C[2], ...[0, 0, 0, 1]] as _4_4_MAT_;
            this.instance._INV_MATRIX = _Matrix.getInvMat(this.instance._MATRIX, 4) as _4_4_MAT_;
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

    class OpticalElement_Objects{
        optical_element_array : OpticalElement[]
        instance_number : number;
        arrlen : number;

        selected_light_instance : number;
        selected_camera_instance : number;

        max_camera_instance_number : number;
        max_light_instance_number : number;

        instance_number_to_list_map : object;

        constructor()
        {
            this.arrlen = 0;
            this.instance_number = 0;
            this.selected_light_instance = 0;
            this.selected_camera_instance = 0;
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

        deleteOpticalObject(instance_number_input : number,index : number) : void {
            this.optical_element_array.splice(index,1);
            delete this.instance_number_to_list_map[instance_number_input];

            for (const key in this.instance_number_to_list_map){
                if (Number(key) > instance_number_input){
                    this.instance_number_to_list_map[key] = this.instance_number_to_list_map[key] - 1;
                }
            }
        }

        deleteCameraObject(instance_number_input : number) : void {
            if (instance_number_input > 0 && instance_number_input <= this.max_camera_instance_number)
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
            if (instance_number_input > 0 && instance_number_input <= this.max_light_instance_number)
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
                if (index !== 0 && this.optical_element_array[index].instance.optical_type === "camera")
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
                if (index !== 1 && this.optical_element_array[index].instance.optical_type === "light")
                {
                    this.deleteOpticalObject(Number(key),index);
                }
            }
            this.arrlen = this.optical_element_array.length;
        }

        select_camera_instance(selection : number) : void{
            if (selection >= 0 && selection < this.optical_element_array.length)
            {
                if (this.optical_element_array[selection].instance.optical_type === "camera") this.selected_camera_instance = selection;
            }
        }

        select_light_instance(selection : number) : void{
            if (selection >= 0 && selection < this.optical_element_array.length)
            {
                if (this.optical_element_array[selection].instance.optical_type === "light") this.selected_light_instance = selection;
            }
        }

        render(vertex : _3D_VEC_,optical_type : _OPTICAL_) : _4D_VEC_ | _ERROR_{
            var world_to_optical_object_space : _4D_VEC_ = [0,0,0,0];

            switch (optical_type){
                case "none" : return _ERROR_._OPTICAL_ELEMENT_OBJECT_ERROR_;
                case "camera" : world_to_optical_object_space = this.optical_element_array[this.selected_camera_instance].worldToOpticalObject(vertex);
                case "light" : world_to_optical_object_space =  this.optical_element_array[this.selected_light_instance].worldToOpticalObject(vertex);
            }

            const optical_object_to_clip_space : _4D_VEC_ = _ClipSpace.camera_or_light_ToClip(world_to_optical_object_space);
            return _ScreenSpace.clipToScreen(optical_object_to_clip_space);
        }
    }

    const _Optical_Objects = new OpticalElement_Objects()

    class ObjectManager{}

      class InterPolRend  {

        kernel_Size : number;
        sigma_xy : number;
        sampleArr : any [];
        TotalArea : number;
        triA : number;
        triB : number;
        triC : number;
        aRatio: number;
        bRatio : number;
        cRatio : number;
        opacityCoeff : number;
        render : boolean;
        shader : boolean;
        Alight : _4D_VEC_ | _ERROR_;
        Blight : _4D_VEC_ | _ERROR_;
        Clight : _4D_VEC_ | _ERROR_;
        Acam : _4D_VEC_ | _ERROR_;
        Bcam : _4D_VEC_ | _ERROR_;
        Ccam : _4D_VEC_ | _ERROR_;
        avec : _3D_VEC_;
        bvec : _3D_VEC_;
        cvec : _3D_VEC_;
        colA : _4D_VEC_;
        colB : _4D_VEC_;
        colC : _4D_VEC_;
        
        constructor() {
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
            this.Alight = new Array() as _4D_VEC_; 
            this.Blight = new Array() as _4D_VEC_;
            this.Clight = new Array() as _4D_VEC_;
            this.Acam = new Array()  as _4D_VEC_;
            this.Bcam = new Array()  as _4D_VEC_;
            this.Ccam = new Array()  as _4D_VEC_;
            this.sample();
        }

        initParams(...vertArray : _3_7_MAT_) {
            this.avec = vertArray[0].slice(0, 3) as _3D_VEC_;
            this.bvec = vertArray[1].slice(0, 3) as _3D_VEC_;
            this.cvec = vertArray[2].slice(0, 3) as _3D_VEC_;
            this.colA = vertArray[0].slice(3) as _4D_VEC_;
            this.colB = vertArray[1].slice(3) as _4D_VEC_;
            this.colC = vertArray[2].slice(3) as _4D_VEC_;
        }

        interpolate(pvec : _3D_VEC_, avec : _3D_VEC_, bvec : _3D_VEC_, cvec : _3D_VEC_) : _3D_VEC_ {
            //MaxParamLength is assumed to be 4, since each input vector is assumed to be a 4X1 homogenous matrix

            const indexList = [0, 1];
            const Adist = _Miscellenous.getDist(bvec, cvec, indexList),
                Bdist = _Miscellenous.getDist(avec, cvec, indexList),
                Cdist = _Miscellenous.getDist(avec, bvec, indexList),
                apdist = _Miscellenous.getDist(pvec, avec, indexList),
                bpdist = _Miscellenous.getDist(pvec, bvec, indexList),
                cpdist = _Miscellenous.getDist(pvec, cvec, indexList);

            this.TotalArea = _Miscellenous.getTriArea(Adist, Bdist, Cdist);
            this.triA = _Miscellenous.getTriArea(Adist, bpdist, cpdist);
            this.triB = _Miscellenous.getTriArea(Bdist, apdist, cpdist);
            this.triC = _Miscellenous.getTriArea(Cdist, apdist, bpdist);

            this.aRatio = this.triA / this.TotalArea;
            this.bRatio = this.triB / this.TotalArea;
            this.cRatio = this.triC / this.TotalArea;

            const
                aPa : _3D_VEC_ = _Matrix.scaMult(this.aRatio, avec) as _3D_VEC_,
                bPb : _3D_VEC_ = _Matrix.scaMult(this.bRatio, bvec) as _3D_VEC_,
                cPc : _3D_VEC_ = _Matrix.scaMult(this.cRatio, cvec) as _3D_VEC_;

            return _Matrix.matAdd(_Matrix.matAdd(aPa, bPb), cPc) as _3D_VEC_;
        }

        getBoundingRect(...vertices : _3_3_MAT_) : _4D_VEC_ {
            return this.getBoundingRectImpl(vertices);
        }

        getBoundingRectImpl(vertices : _3_3_MAT_) : _4D_VEC_ {
            var n = vertices.length;
            var xArr : _3D_VEC_ = [0,0,0];
            var yArr : _3D_VEC_ = [0,0,0];
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

        isInsideTri() : boolean {
            var sum = this.triA + this.triB + this.triC
            if (Math.round(sum) === Math.round(this.TotalArea)) {
                return true;
            }
            return false;
        }

        sample() : void { //Generates an array of normalized Gaussian distribution function values with x and y coefficients 
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

        partSample(x : number, y : number) : any[] {
            const part_sample_arr : any [] = []

            for (let sample of this.sampleArr) {
                var val_x = sample[0] + x;
                var val_y = sample[1] + y;

                if (val_x < 0) {
                    val_x = 0;
                } else if (val_x >= MODIFIED_PARAMS._CANVAS_WIDTH) {
                    val_x = MODIFIED_PARAMS._CANVAS_WIDTH - 1;
                }
                if (val_y < 0) {
                    val_y = 0;
                } else if (val_y >= MODIFIED_PARAMS._CANVAS_HEIGHT) {
                    val_y = MODIFIED_PARAMS._CANVAS_HEIGHT - 1;
                }

                part_sample_arr.push([val_x, val_y, sample[2]]);
            }

            return part_sample_arr;
        }

        vertexShader() : void | _ERROR_ {
            if (this.avec !== null && this.bvec !== null && this.cvec !== null) {
                this.Alight = _Optical_Objects.render(this.avec,"light");
                if (typeof this.Alight === "number") return _ERROR_._NO_ERROR_;
                this.Blight = _Optical_Objects.render(this.bvec,"light");
                if (typeof this.Blight === "number") return _ERROR_._NO_ERROR_;
                this.Clight = _Optical_Objects.render(this.cvec,"light");
                if (typeof this.Clight === "number") return _ERROR_._NO_ERROR_;
            } else return _ERROR_._NO_ERROR_;
        }

        vertRend() {
                if (this.avec !== null && this.bvec !== null && this.cvec !== null) {
                    this.Acam = _Optical_Objects.render(this.avec,"camera");
                    if (typeof this.Alight === "number") return _ERROR_._NO_ERROR_
                    this.Bcam = _Optical_Objects.render(this.bvec,"camera");
                    if (typeof this.Alight === "number") return _ERROR_._NO_ERROR_
                    this.Ccam = _Optical_Objects.render(this.cvec,"camera");
                    if (typeof this.Alight === "number") return _ERROR_._NO_ERROR_
            } else return _ERROR_._NO_ERROR_;
        }

        fragmentShader() {
            if (this.render === true) {
                // Get 2d bounding rectangle
                const ret = this.getBoundingRect(this.Alight, this.Blight, this.Clight),
                    // Simple rasterizing function
                    minX = Math.round(Math.max(ret[0], 0)),
                    minY = Math.round(Math.max(ret[1], 0)),
                    maxX = Math.round(Math.min(ret[0] + ret[2], MODIFIED_PARAMS._CANVAS_WIDTH)),
                    maxY = Math.round(Math.min(ret[1] + ret[3], MODIFIED_PARAMS._CANVAS_HEIGHT));

                // Get Gaussian distribution array for particular pixel

                for (let x = minX; x <= maxX; x++) {
                    for (let y = minY; y <= maxY; y++) {

                        const point = [
                            [x],
                            [y]
                        ];

                        var interArray = this.interpolate(point, this.A, this.B, this.C);

                        if (this.isInsideTri() === true) {
                            const aCola = _Matrix.scaMult(this.aRatio, this.colA);
                            const bColb = _Matrix.scaMult(this.bRatio, this.colB);
                            const cColc = _Matrix.scaMult(this.cRatio, this.colC);
                            var pColp = _Matrix.matAdd(_Matrix.matAdd(aCola, bColb), cColc);

                            if (this.depthBuffer[(y * MODIFIED_PARAMS._CANVAS_WIDTH) + x] > interArray[2]) {
                                this.depthBuffer[(y * MODIFIED_PARAMS._CANVAS_WIDTH) + x] = interArray[2];
                                this.frameBuffer[(y * MODIFIED_PARAMS._CANVAS_WIDTH * 4) + (x * 4) + 0] = pColp[0];
                                this.frameBuffer[(y * MODIFIED_PARAMS._CANVAS_WIDTH * 4) + (x * 4) + 1] = pColp[1];
                                this.frameBuffer[(y * MODIFIED_PARAMS._CANVAS_WIDTH * 4) + (x * 4) + 2] = pColp[2];
                                this.frameBuffer[(y * MODIFIED_PARAMS._CANVAS_WIDTH * 4) + (x * 4) + 3] = pColp[3];
                            }
                        }
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
                    maxX = Math.round(Math.min(ret[0] + ret[2], MODIFIED_PARAMS._CANVAS_WIDTH)),
                    maxY = Math.round(Math.min(ret[1] + ret[3], MODIFIED_PARAMS._CANVAS_HEIGHT));

                // Get Gaussian distribution array for particular pixel

                for (let x = minX; x <= maxX; x++) {
                    for (let y = minY; y <= maxY; y++) {

                        const point = [
                            [x],
                            [y]
                        ];

                        var interArray = this.interpolate(point, this.A, this.B, this.C);

                        if (this.isInsideTri() === true) {
                            const aCola = _Matrix.scaMult(this.aRatio, this.colA);
                            const bColb = _Matrix.scaMult(this.bRatio, this.colB);
                            const cColc = _Matrix.scaMult(this.cRatio, this.colC);
                            var pColp = _Matrix.matAdd(_Matrix.matAdd(aCola, bColb), cColc);

                            if (this.depthBuffer[(y * MODIFIED_PARAMS._CANVAS_WIDTH) + x] > interArray[2]) {
                                this.depthBuffer[(y * MODIFIED_PARAMS._CANVAS_WIDTH) + x] = interArray[2];
                                this.frameBuffer[(y * MODIFIED_PARAMS._CANVAS_WIDTH * 4) + (x * 4) + 0] = pColp[0];
                                this.frameBuffer[(y * MODIFIED_PARAMS._CANVAS_WIDTH * 4) + (x * 4) + 1] = pColp[1];
                                this.frameBuffer[(y * MODIFIED_PARAMS._CANVAS_WIDTH * 4) + (x * 4) + 2] = pColp[2];
                                this.frameBuffer[(y * MODIFIED_PARAMS._CANVAS_WIDTH * 4) + (x * 4) + 3] = pColp[3];
                            }
                        }
                    }
                }
            }
        }

        show() {
            // Normalize coordinate system to use CSS pixels

            octx.scale(this.scale, this.scale);
            ctx.scale(this.scale, this.scale);

            for (let y = 0; y < MODIFIED_PARAMS._CANVAS_HEIGHT; y++) {
                for (let x = 0; x < MODIFIED_PARAMS._CANVAS_WIDTH; x++) {
                    const r = this.frameBuffer[(y * MODIFIED_PARAMS._CANVAS_WIDTH * 4) + (x * 4) + 0];
                    const g = this.frameBuffer[(y * MODIFIED_PARAMS._CANVAS_WIDTH * 4) + (x * 4) + 1];
                    const b = this.frameBuffer[(y * MODIFIED_PARAMS._CANVAS_WIDTH * 4) + (x * 4) + 2];
                    const alpha = this.frameBuffer[(y * MODIFIED_PARAMS._CANVAS_WIDTH * 4) + (x * 4) + 3];
                    if (typeof r !== "undefined" && typeof g != "undefined" && typeof b !== "undeefined") {
                        octx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + alpha / 255 + ")";
                        octx.fillRect(x, y, 1, 1);
                    }
                }
            }

            octx.drawImage(ocanvas, 0, 0, MODIFIED_PARAMS._CANVAS_WIDTH * 0.5, MODIFIED_PARAMS._CANVAS_HEIGHT * 0.5);
            ctx.drawImage(ocanvas, 0, 0, MODIFIED_PARAMS._CANVAS_WIDTH * 0.5, MODIFIED_PARAMS._CANVAS_HEIGHT * 0.5, 0, 0, MODIFIED_PARAMS._CANVAS_WIDTH, MODIFIED_PARAMS._CANVAS_HEIGHT);
        }
    }

    
    class BasicManager {
        constructor() {
            _PerspectiveProjection.setPersProjectParam();
    
            // canvas.addEventListener("mousemove", (event) => this.pick(event, hovered));
            // canvas.addEventListener("click", (event) => this.pick(event, selected));
            // canvas.addEventListener("click", (event) => this.selectionManager(event));
        }
    }

    const _Basic_Manager = new BasicManager();

    
    class DrawCanvas {
        protected static drawCount = 0;
        constructor()
        {
            window.addEventListener("resize", () => this.drawCanvas());
        }
        drawCanvas() {
            canvas.style.borderStyle = MODIFIED_PARAMS._BORDER_STYLE;
            canvas.style.borderWidth = MODIFIED_PARAMS._BORDER_WIDTH;
            canvas.style.borderColor = MODIFIED_PARAMS._BORDER_COLOR;
            canvas.style.opacity = MODIFIED_PARAMS._GLOBAL_ALPHA;
            canvas.width = MODIFIED_PARAMS._CANVAS_WIDTH;
            canvas.height = MODIFIED_PARAMS._CANVAS_HEIGHT;

            DrawCanvas.drawCount++;
        }
    }   

    const _DrawCanvas = new DrawCanvas()

    _DrawCanvas.drawCanvas()

    
    // const point = [0.5, 0.8, 0.9];
    // const a = basic_manager.objectRotate(point, basic_manager.Y, 90, "object");
    // console.log(a)
    // const b = basic_manager.objectRotate(a, basic_manager.Y, -90, "local")
    // console.log(b)
    // const c = basic_manager.ObjectTransform(a, [20, 10, 4], "world")
    // console.log(c)
    // const d = basic_manager.objectRevolve(c, basic_manager.Y, 90, "world")
    // console.log(d)
    // const e = basic_manager.worldToOpticalObjectCamera(d);
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
    
    // class CanvasObject {
    //     constructor() {
    //         // default values
    //         this.base_vertices = [];
    //         this.vertices_sign = [];
    //         this.center = [0, 0, 0];
    //         this.id = null;
    //         this.exists = true;
    //         this.depth_occlusion = true;
    //         this.comp_error = compatibilitySettings.compatibility_error;
    //         this.space = "local"; // Possible values: local/object, world, camera/view, clip, screen
    //     }
    
    //     is_x_value(vertex_array_index) {
    //         if (vertex_array_index % 3 == 0) return true
    //         else return false;
    //     }
    
    //     is_y_value(vertex_array_index) {
    //         if (vertex_array_index % 3 == 1) return true
    //         else return false;
    //     }
    
    //     is_z_value(vertex_array_index) {
    //         if (vertex_array_index % 3 == 2) return true
    //         else return false;
    //     }
    
    //     add_vertices(vertex_array, add_vertex_array) {}
    
    //     clear_all_vertices(vertex_array) {}
    
    //     clear_selected_vertex(vertex_array, vertex_id_array) {}
    // }
    
    // class GridObject extends CanvasObject {
    //     constructor(width, height, aspect_ratio, num) {
    //         super();
    //     }
    
    //     refreshParams(width, height, aspect_ratio, num = this.num) {
    //         this.width = width;
    //         this.height = height;
    //         this.aspect_ratio = aspect_ratio;
    //         this.refreshLines(num);
    //     }
    
    //     refreshLines(num) {
    //         this.num = num;
    //         if (this.aspectRatio > 1) {
    //             this.numX = Math.round(num * this.aspectRatio);
    //             this.numY = num;
    //         } else {
    //             this.numX = num;
    //             this.numY = Math.round(num * (1 / this.aspectRatio));
    //         }
    //         this.verList = new Int16Array(this.numX + 1);
    //         this.horList = new Int16Array(this.numY + 1);
    //         this.generateGridVertices();
    //         this.drawLines(ctx, "blue", 2);
    //     }
    
    //     generateGridVertices() {
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
    //         return this.horList;
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
    
    //     drawLines(ctx, color, lineWidth) { //draws the vertical and horizontal canvas lines
    
    //         for (let R = 0; R <= this.numY; R++) {
    //             this.lineMatrixHorizontal(R, ctx, color, lineWidth);
    //         }
    
    //         for (let R = 0; R <= this.numX; R++) {
    //             this.lineMatrixVertical(R, ctx, color, lineWidth);
    //         }
    //     }
    // }
    
    // class ObjectManager extends Counter {
    //     constructor() {
    //         super();
    //         this.counter = 0;
    //         this.objects_dict = {};
    //     }
    //     createObject(instance_of_object) {}
    //     registerObject() {}
    //     deleteObject(object_id) {
    //         delete this.objects_dict[`${object_id}`];
    //     }
    // }
    
    
    // // var obj2 = {
    // //     "0": [
    // //         { object_id: 0, object_name: 'Square_Object_0', object_vertices: [2, 5, 3.8] },
    // //     ],
    // //     "1": [
    // //         { object_id: 1, object_name: 'Circle_Object_0', object_vertices: [7, 8, 3.9] }
    // //     ]
    // // }
    
    // class RefreshObjects extends ObjectManager {
    //     constructor() { super(); }
    //     refresh_objects(objects, basic_m) {
    //         const object_len = objects.length;
    //         for (let i = 0; i < object_len; i++) {
    //             objects[i].refreshParams(basic_m.width, basic_m.height, basic_m.aspect_ratio);
    //         }
    //     }
    // }
    
    
    // class CanvasManager extends RefreshObjects {
    //     constructor(basic_m) {
    //         super();
    //         this.basic_m = basic_m;
    //         this.objects = [];
    
    //         window.addEventListener('resize', {} = () => {
    //             this.basic_m.refreshCanvas();
    //             this.basic_m.setPersProjectParam();
    
    //             this.basic_m.object_vertices = [];
    //             this.basic_m.prev_hovered_vertices_array = [];
    //             this.basic_m.hovered_vertices_array = [];
    //             this.basic_m.pre_selected_vertices_array = [];
    //             this.basic_m.selected_vertices_array = [];
    
    //             this.refresh_objects(this.objects, basic_m);
    //         });
    //     }
    // }

   

    // class DrawObject {
    //     constructor(vertexRadius, lineWidth) {
    //         this.vertR = vertexRadius
    //         this.LineW = lineWidth
    //     }

    //     drawVertex(point, fill = "black", stroke = fill) {
    //         ctx.beginPath()
    //         ctx.arc(point[0][0], point[1][0], this.vertR, 0, 2 * Math.PI)
    //         ctx.lineWidth = this.LineW
    //         ctx.strokeStyle = stroke
    //         ctx.stroke()
    //         ctx.fillStyle = fill
    //         ctx.fill()
    //     }

    //     drawCircle(point, fill = "black", stroke = fill, radius) {
    //         ctx.beginPath()
    //         ctx.arc(point[0][0], point[1][0], radius, 0, 2 * Math.PI)
    //         ctx.lineWidth = this.LineW
    //         ctx.strokeStyle = stroke
    //         ctx.stroke()
    //         ctx.fillStyle = fill
    //         ctx.fill()
    //     }

    //     drawLine(start, end, drawpoint = false, fill = "black", stroke = fill) {
    //         ctx.beginPath()
    //         ctx.moveTo(start[0][0], start[1][0])
    //         ctx.lineTo(end[0][0], end[1][0])
    //         ctx.lineWidth = this.LineW
    //         ctx.strokeStyle = stroke
    //         ctx.stroke()
    //         ctx.fillStyle = fill
    //         ctx.fill()

    //         if (drawpoint === true) {
    //             this.drawVertex(start, fill, stroke)
    //             this.drawVertex(end, fill, stroke)
    //         }
    //     }
    //     drawTriangle(A, B, C, orientOut = true, drawpoint = false, fill = "black", stroke = fill, diff = false, strokeBool = true) {
    //         ctx.lineWidth = this.LineW;

    //         if (orientOut === false) {
    //             if (stroke === fill) {
    //                 stroke = 'gray';
    //             }
    //             fill = 'gray';
    //         }

    //         ctx.beginPath()
    //         ctx.moveTo(A[0][0], A[1][0]);
    //         ctx.lineTo(B[0][0], B[1][0]);
    //         ctx.lineTo(C[0][0], C[1][0]);
    //         ctx.strokeStyle = stroke;
    //         ctx.fillStyle = fill;
    //         ctx.fill();

    //         if (strokeBool === true) {
    //             ctx.closePath();
    //             ctx.stroke();
    //         }

    //         if (drawpoint === true) {
    //             if (diff === true) {
    //                 this.drawVertex(A, 'red');
    //                 this.drawVertex(B, 'green');
    //                 this.drawVertex(C, 'blue');
    //             } else {
    //                 this.drawVertex(A, fill, stroke);
    //                 this.drawVertex(B, fill, stroke);
    //                 this.drawVertex(C, fill, stroke);
    //             }
    //         }
    //     }
    // }

    // class Counter {
    //     constructor() {
    //         this.counter = 0;
    //     }

    //     change(value) {
    //         this.counter = value;
    //         return this
    //     }

    //     add() {
    //         this.counter++;
    //         return this
    //     }

    //     subtract() {
    //         this.counter--;
    //         return this
    //     }

    //     value() {
    //         return this.counter;
    //     }
    // }

    // const counter = new Counter()

    // // console.log(details)
    // // console.log(details.mobile)

    // //Default value is right
    // //arrOp.setHandedness('left')

    // implementDrag.start(canvas)

    // var vertexBuffer = [
    //     [25, 80, 35, 255, 0, 0, 255], //red
    //     [5, 30, 30, 0, 255, 0, 255], //green
    //     [10, 20, 45, 0, 0, 255, 255], //blue
    //     [15, 15, 25, 255, 255, 255, 255], //white
    // ]

    // var vertexBuffer2 = [
    //     [45, 80, 60, 255, 0, 0, 255], //red
    //     [25, 30, 55, 0, 255, 0, 255], //green
    //     [30, 20, 70, 0, 0, 255, 255], //blue
    //     [35, 15, 50, 255, 255, 255, 255], //white
    // ]

    // var
    //     w = vertexBuffer[0],
    //     x = vertexBuffer[1],
    //     y = vertexBuffer[2],
    //     z = vertexBuffer[3]


    // var o = vertexBuffer2[0],
    //     p = vertexBuffer2[1],
    //     q = vertexBuffer2[2],
    //     r = vertexBuffer2[3]


    // class TextureMap {
    //     constructor(texture, object) {}
    // }


    // //drawObj.drawTriangle(al, bl, cl, undefined, undefined, 'red', 'brown', true, true)
    // // trObj.initParamsFull(v, w, x)
    // // trObj.vertRend()
    // // trObj.fragRend()

    // class SetHalfEdges {
    //     constructor(vertex_indexes) {
    //         this.HalfEdgeDict = {};
    //         this.vert_len = vertex_indexes.length;
    //         this.vert_array = vertex_indexes;
    //         this.triangle = [];
    //         this.last = null;
    //         this.edge_no = 0;

    //         for (let i = 0; i < this.vert_len; i++) {
    //             this.setHalfEdge(i);
    //         }

    //         if (Object.entries(this.HalfEdgeDict).length > 0) {
    //             this.edge_no--;
    //             delete this.HalfEdgeDict[`${this.last}-null`];
    //         }

    //     }

    //     halfEdge(start, end) {
    //         return {
    //             vertices: [start, end],
    //             face_vertices: [],
    //             twin: null,
    //             prev: null,
    //             next: null
    //         };
    //     }

    //     setHalfEdge(index) {

    //         const vert_1 = this.vert_array[index];
    //         var end = null;
    //         var prev_start = null;
    //         var next_end = null;

    //         if (index - 1 >= 0) {
    //             prev_start = this.vert_array[index - 1];
    //         }

    //         if (index + 1 < this.vert_len) {
    //             end = this.vert_array[index + 1];
    //         } else {
    //             end = null;
    //         }

    //         if (index + 2 < this.vert_len) {
    //             next_end = this.vert_array[index + 2];
    //         } else {
    //             next_end = null;
    //         }

    //         if (index === this.vert_len - 1) {
    //             this.last = this.vert_array[index];
    //         }

    //         const vert_0 = prev_start
    //         const vert_2 = end;
    //         const vert_3 = next_end;

    //         const halfEdgeKey = `${vert_1}-${vert_2}`;
    //         const prevHalfEdgeKey = `${vert_0}-${vert_1}`
    //         const nextHalfEdgeKey = `${vert_2}-${vert_3}`;
    //         const twinHalfEdgeKey = `${vert_2}-${vert_1}`;

    //         if (!this.HalfEdgeDict[halfEdgeKey]) {
    //             this.HalfEdgeDict[halfEdgeKey] = this.halfEdge(vert_1, vert_2);
    //             this.edge_no++;

    //             this.HalfEdgeDict[halfEdgeKey].prev = prevHalfEdgeKey;
    //             this.HalfEdgeDict[halfEdgeKey].next = nextHalfEdgeKey;


    //             if ((index % 3 === 0) && index > 0) {
    //                 this.HalfEdgeDict[prevHalfEdgeKey].face_vertices = this.triangle;
    //                 this.HalfEdgeDict[this.HalfEdgeDict[prevHalfEdgeKey].prev].face_vertices = this.triangle;
    //                 this.HalfEdgeDict[this.HalfEdgeDict[this.HalfEdgeDict[prevHalfEdgeKey].prev].prev].face_vertices = this.triangle;

    //                 this.triangle = [];
    //             }

    //             this.triangle.push(this.vert_array[index]);

    //             if (this.HalfEdgeDict[twinHalfEdgeKey]) {
    //                 this.HalfEdgeDict[halfEdgeKey].twin = twinHalfEdgeKey;
    //                 this.HalfEdgeDict[twinHalfEdgeKey].twin = halfEdgeKey;
    //                 this.edge_no--;
    //             }
    //         }

    //     }
    // }

    // const indexBuffer = [0, 1, 2, 3, 0, 2, 1, 0, 3, 2];
    // const indexBuffer2 = [0, 1, 2, 0, 3, 1, 0, 2, 4, 0];

    // const objectDict = {};

    // class TriObject extends SetHalfEdges {
    //     constructor(vertexBuffer, indexBuffer) {
    //         super(indexBuffer);
    //         this.vertexBuffer = vertexBuffer;
    //         this.indexBuffer = indexBuffer;
    //         this.vertex_set = new Set(indexBuffer);
    //         this.vertex_no = this.vertex_set.size;

    //         // From Euler's graph theorem that V - E + F = 2 which can be generalized to V - E + F = n + 1 where n is the number of objects   
    //         this.face_no = this.edge_no - this.vertex_no + 2;

    //         this.vertex_array = this.vertex_set.values();

    //         this.vertex_keys = Object.keys(this.HalfEdgeDict);

    //         this.vertex_keys_len = this.vertex_keys.length;

    //         for (let i = 0; i < this.vertex_no; i++) {
    //             this.vertexNormal(this.vertex_array[i]);
    //         }

    //     }

    //     vertexNormal(vertex_index) {
    //         const face_normals = [];

    //         for (let i = 0; i < this.vertex_keys_len; i++) {
    //             for (let i = 0; i < 2; i++) {
    //                 if (Number(this.vertex_keys[i]) === 2) {
    //                     face_normals.push([])
    //                 }
    //             }
    //         }
    //     }

    //     faceNormal() {}
    // }

    // class TriObjects extends InterPolRend {
    //     constructor(canvas, ocanvas, menu) {
    //         super(canvas, ocanvas, menu)
    //             // Function closure to increment the number of objects added.
    //         this.count = (function() {
    //             var count = 0;
    //             return function() {
    //                 return count++;
    //             }
    //         })();

    //         this.project(bNz, bFz, bAng);
    //         this.setCamera(0, 0, 0, 0, 0, 20);
    //         this.setLight(-10, -10, -10);
    //         this.setObjTransfMat(1, 1, 1, 0, 0, 0, 0, 0, 0);

    //         this.object_dict = {};
    //         console.log(this)

    //     }

    //     // Starts counting the objects from 1
    //     createTriObject(vertexBuffer, indexBuffer) {
    //         this.object_dict[`${this.count()}`] = new TriObject(vertexBuffer, indexBuffer);
    //     }

    // }

    // let trObj = new TriObjects(canvas, ocanvas, menu);
    // trObj.createTriObject(vertexBuffer, indexBuffer);
    // trObj.createTriObject(vertexBuffer2, indexBuffer2)

    // console.log(trObj.object_dict);

    // function displayTri(a, b, c) {
    //     trObj.initParams(a, b, c);
    //     trObj.vertRend();
    //     trObj.fragRend();
    // }

    // function deploy() {
    //     // octx.clearRect(0, 0, trObj.canvW, trObj.canvH);
    //     // ctx.clearRect(0, 0, trObj.scrCanvW, trObj.scrCanvH);

    //     displayTri(w, x, y);
    //     displayTri(x, y, z);
    //     displayTri(w, x, z);
    //     displayTri(w, y, z);

    //     displayTri(o, p, q);
    //     displayTri(p, q, r);
    //     displayTri(o, p, r);
    //     displayTri(o, q, r);

    //     trObj.show();
    // }

    // deploy()

    // function look(event) {

    //     if (event.keyCode === 82 || event.altKey === true && event.keyCode === 74) {
    //         // deploy();
    //     }

    //     if (event.keyCode === 83 || event.keyCode === 13) {
    //         generalizeInput()
    //     }
    //     console.log(event.keyCode)
    //     console.log(event.altKey)
    // }

    // document.body.addEventListener('keydown', look);


    // window.onresize = function() {
    //     // deploy();
    // }


    // function generalizeInput() {

    //     //console.log("lsk")
    //     setInputValue();
    //     // deploy();

    //     //console.log('dlk')
    // }


    // brotX.oninput = function() {
    //     brX = Number(brotX.value);
    // }

    // brotY.oninput = function() {
    //     brY = Number(brotY.value);
    // }

    // brotZ.oninput = function() {
    //     brZ = Number(brotZ.value);
    // }

    // btransX.oninput = function() {
    //     btX = Number(btransX.value);
    // }

    // btransY.oninput = function() {
    //     btY = Number(btransY.value);
    // }

    // btransZ.oninput = function() {
    //     btZ = Number(btransZ.value);
    // }

    // bangle.oninput = function() {
    //     bAng = Number(bangle.value);
    // }

    // bnearZ.oninput = function() {
    //     bNz = Number(bnearZ.value);
    // }

    // bfarZ.oninput = function() {
    //     bFz = Number(bfarZ.value);
    // }

    // // console.log(coord.cameraVec)
    // // console.log(coord.lightVec)

    // // console.log(proj.camProjectionMatrix)
    // // console.log(proj.lightProjectionMatrix)


    // // // [
    // // //     [-50, 200, 1],
    // // //     [0, 255, 0, 255]
    // // // ],
    // // // [
    // // //     [10, 20, 1],
    // // //     [0, 233, 0, 0]
    // // // ]

    // // let simpTri = new Object(vertexBuffer, indexBuffer)

    // // trObj.vertShader()
    // // trObj.fragShader()
    // // trObj.show()


    // // window.onresize = function() {
    // //     sett.runSettings()
    // //     drawcanvas.runDrawCanvas()
    // //     coord.setHalf()
    // // }

    // function lineFromPoints(P, Q) {
    //     //ax
    //     //by
    //     //c
    //     let a = Q[1] - P[1];
    //     let b = P[0] - Q[0];
    //     let c = a * (P[0]) + b * (P[1]);
    //     return [a, b, c]
    // }

    // function perpendicularBisectorFromLine(P, Q, a, b, c) {
    //     let mid_point = [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2]
    //         //c = -bx + ay
    //     c = -b * (mid_point[0]) + a * (mid_point[1]);

    //     let temp = a;
    //     a = -b;
    //     b = temp

    //     return [a, b, c]
    // }

    // function lineLineIntersection(a1, b1, c1, a2, b2, c2) {
    //     let determinant = (a1 * b2) - (a2 * b1);

    //     if (determinant === 0) {
    //         return [null, null]
    //     } else {
    //         let x = ((b2 * c1) - (b1 * c2)) / determinant;
    //         let y = ((a1 * c2) - (a2 * c1)) / determinant;
    //         return [x, y]
    //     }
    // }

    // function getCircumCircle(P, Q, R) {
    //     var PQ_line = lineFromPoints(P, Q);
    //     var QR_line = lineFromPoints(Q, R);
    //     var a = PQ_line[0];
    //     var b = PQ_line[1];
    //     var c = PQ_line[2];
    //     var e = QR_line[0];
    //     var f = QR_line[1];
    //     var g = QR_line[2];

    //     var PQ_perpendicular = perpendicularBisectorFromLine(P, Q, a, b, c);
    //     var QR_perpendicular = perpendicularBisectorFromLine(Q, R, e, f, g);
    //     a = PQ_perpendicular[0];
    //     b = PQ_perpendicular[1];
    //     c = PQ_perpendicular[2];
    //     e = QR_perpendicular[0];
    //     f = QR_perpendicular[1];
    //     g = QR_perpendicular[2];

    //     var circumCenter = lineLineIntersection(a, b, c, e, f, g)

    //     var x = circumCenter[0]
    //     var y = circumCenter[1]

    //     var center = [
    //         [x],
    //         [y]
    //     ]

    //     var radius = trObj.getDist(P, center, [0, 1])

    //     return { center, radius }
    // }

    // function getInscr(A, B, C) {
    //     const param = [0, 1];
    //     const lenAB = trObj.getDist(A, B, param);
    //     const lenBC = trObj.getDist(B, C, param);
    //     const lenCA = trObj.getDist(C, A, param);

    //     const area = trObj.getTriArea(lenAB, lenBC, lenCA);
    //     const semiPerimeter = (lenAB + lenBC + lenCA) / 2
    //     const radius = area / semiPerimeter

    //     const center = [
    //         [(lenAB * A[0][0] + lenBC * B[0][0] + lenCA * C[0][0]) / (lenAB + lenBC + lenCA)],
    //         [(lenAB * A[1][0] + lenBC * B[1][0] + lenCA * C[1][0]) / (lenAB + lenBC + lenCA)]
    //     ]

    //     return { center, radius }
    // }

    // var a = [
    //     [100],
    //     [150]
    // ];
    // var b = [
    //     [110],
    //     [200]
    // ];
    // var c = [
    //     [150],
    //     [120]
    // ];
    // var d = [
    //     [140],
    //     [190]
    // ];
    // var e = [
    //     [130],
    //     [250]
    // ];
    // var f = [
    //     [170],
    //     [250]
    // ];


    // function findCircTriFSq(rect) {
    //     var mid = (rect[2] / 2) + rect[0]
    //     var lSmall = rect[2] / 2
    //     var hSmall = Math.tan((60 * Math.PI) / 180) * lSmall
    //     var hBig = hSmall + rect[3]
    //     var lBig = hBig / (Math.tan((60 * Math.PI) / 180))
    //     var A = [
    //         [mid - lBig],
    //         [rect[1] + rect[3]]
    //     ]
    //     var B = [
    //         [mid],
    //         [rect[1] - hSmall]
    //     ]
    //     var C = [
    //         [mid + lBig],
    //         [rect[1] + rect[3]]
    //     ]

    //     return { A, B, C }
    // }


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


    // function loop() {
    //     const timer = setInterval(func => {
    //         const val = counter.add().value()
    //         if (val % 5 === 1) {
    //             displayTri(w, y, z);
    //             trObj.show();
    //         }
    //         if (val % 5 === 2) {
    //             displayTri(w, x, y);
    //             trObj.show();
    //         }
    //         if (val % 5 === 3) {
    //             displayTri(w, x, z);
    //             trObj.show();
    //         }
    //         if (val % 5 === 4) {
    //             displayTri(x, y, z);
    //             trObj.show();
    //         }
    //         // setTimeout(func => {
    //         //     trObj.resetFrameBuffer();
    //         //     trObj.resetDepthBuffer();
    //         // }, 3000)
    //         if (val % 5 === 0) {
    //             clearInterval(timer);
    //             trObj.resetFrameBuffer();
    //             trObj.resetDepthBuffer();
    //             trObj.show();
    //             loop();
    //         }
    //     }, requestAnimationFrame(loop))
    // }


    // function loop2() {
    //     const timer = setInterval(func => {
    //         const val = counter.add().value()
    //         if (val % 5 === 1) {
    //             displayTri(w, y, z);
    //             trObj.show();
    //         }
    //         if (val % 5 === 2) {
    //             displayTri(w, x, y);
    //             trObj.show();
    //         }
    //         if (val % 5 === 3) {
    //             displayTri(w, x, z);
    //             trObj.show();
    //         }
    //         if (val % 5 === 4) {
    //             displayTri(x, y, z);
    //             trObj.show();
    //         }
    //         // setTimeout(func => {
    //         //     trObj.resetFrameBuffer();
    //         //     trObj.resetDepthBuffer();
    //         // }, 3000)
    //         if (val % 5 === 0) {
    //             clearInterval(timer);
    //             trObj.resetFrameBuffer();
    //             trObj.resetDepthBuffer();
    //             trObj.show();
    //             loop();
    //         }
    //     }, requestAnimationFrame(loop))
    // }


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
}


 // class Settings {
    //     constructor(canvas, ocanvas, menu) {
    //         this.canvas = canvas;
    //         this.ocanvas = ocanvas;
    //         this.menu = menu;
    //         this.mCol = "gray";
    //         this.color = 'black';
    //         this.bordStyle = 'solid';
    //         this.opacity = 1;
    //         this.aspectRatio = 1;
    //         this.deviceRatio = window.devicePixelRatio;
    //         MODIFIED_PARAMS._HANDEDNESS_CONSTANT = 1; // default
    //         this.scale = window.devicePixelRatio;
    //         this.runSettings();
    //     }

    //     setHandedness(value) {
    //         if (value === 'left') {
    //             MODIFIED_PARAMS._HANDEDNESS_CONSTANT = -1;
    //         } else MODIFIED_PARAMS._HANDEDNESS_CONSTANT = 1; //default
    //     }

    //     runSettings() {
    //         this.width = window.innerWidth;
    //         this.height = window.innerHeight;
    //         this.bordW = 1;
    //         this.menu.style.position = "absolute";
    //         this.menu.style.backgroundColor = this.mCol;

    //         if (this.width >= 600 && this.width < 768) {
    //             MODIFIED_PARAMS._CANVAS_WIDTH = this.width - 150;
    //             MODIFIED_PARAMS._CANVAS_HEIGHT = this.height - 40;
    //             this.menu.style.top = `${this.canvas.offsetTop}px`;
    //             this.menu.style.right = `${this.canvas.offsetLeft}px`;
    //             this.menu.style.width = `${this.width - MODIFIED_PARAMS._CANVAS_WIDTH - 18}px`;
    //             this.menu.style.height = `${MODIFIED_PARAMS._CANVAS_HEIGHT+2}px`;
    //         } else if (this.width >= 768) {
    //             MODIFIED_PARAMS._CANVAS_WIDTH = this.width - 300;
    //             MODIFIED_PARAMS._CANVAS_HEIGHT = this.height - 40;
    //             this.menu.style.top = `${this.canvas.offsetTop}px`;
    //             this.menu.style.right = `${this.canvas.offsetLeft}px`;
    //             this.menu.style.width = `${this.width - MODIFIED_PARAMS._CANVAS_WIDTH - 18}px`;
    //             this.menu.style.height = `${MODIFIED_PARAMS._CANVAS_HEIGHT+2}px`;
    //         } else {
    //             MODIFIED_PARAMS._CANVAS_WIDTH = this.width - 20;
    //             MODIFIED_PARAMS._CANVAS_HEIGHT = this.height / 2;
    //             this.menu.style.top = `${this.canvas.offsetTop+2+MODIFIED_PARAMS._CANVAS_HEIGHT}px`;
    //             this.menu.style.right = `${this.canvas.offsetLeft + 2}px`;
    //             this.menu.style.width = `${this.width-18}px`;
    //             this.menu.style.height = `${this.height-MODIFIED_PARAMS._CANVAS_HEIGHT-40}px`;
    //         }

    //         MODIFIED_PARAMS._CANVAS_WIDTH = Math.floor(this.scale * MODIFIED_PARAMS._CANVAS_WIDTH);
    //         MODIFIED_PARAMS._CANVAS_HEIGHT = Math.floor(this.scale * MODIFIED_PARAMS._CANVAS_HEIGHT);

    //         this.aspectRatio = MODIFIED_PARAMS._CANVAS_WIDTH / MODIFIED_PARAMS._CANVAS_HEIGHT;
    //         return this;
    //     }
    // }
