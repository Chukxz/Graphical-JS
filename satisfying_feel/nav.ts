

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


interface CANVASOBJECT {
        instance_number : number;
        center : _3D_VEC_;
        object_type : string;
    }

class CanvasObject{
     instance : CANVASOBJECT = {
         instance_number : 0,
         center : [0, 0, 0],
         object_type : "none",
     }
     
     
    constructor(instance_number_input : number)
        {
            this.instance.instance_number = instance_number_input;
        }
    }
    
    
    class BoxObject extends CanvasObject {
        constructor(instance_number_input : number)
            {
                super(instance_number_input);
                this.instance.object_type = "box";
            }
    }

    class CanvasObjectManager{
        canvas_object_array: CanvasObject[];
        instance_number : number;
        arrlen : number;
        
        max_canvas_instance_number : number;

        selected_object_instances : number[];
        
        instance_number_to_list_map : object;

        constructor()
        {
            this.arrlen = 0;
            this.instance_number = 0;
            this.selected_object_instances = [];
            this.max_canvas_instance_number = 0;
            this.instance_number_to_list_map = {};
            this.canvas_object_array = [];
        }
        
        
        createNewCanvasObject(object_type_input : string = "none") 
        {
            this.max_canvas_instance_number = this.instance_number;
            this.canvas_object_array[this.arrlen] = this.getObjClass(object_type_input, this.instance_number);
            this.instance_number_to_list_map[this.instance_number] = this.arrlen;
            this.instance_number++;
            this.arrlen++;
        }
l
        createNewMultipleCanvasObjects = (object_type_input = "none",num = 0)  => 
        {
            if(num > 0) while (num > 0) 
            {
                this.createNewCanvasObject(object_type_input); num--;
            }
        }

        deleteCanvasObjectBase(instance_number_input : number,index : number)  
        {
            if (instance_number_input in this.instance_number_to_list_map)
            {
                this.canvas_object_array.splice(index,1);
                delete this.instance_number_to_list_map[instance_number_input];

                for (const key in this.instance_number_to_list_map)
                {
                    if (Number(key) > instance_number_input)
                    {
                        this.instance_number_to_list_map[key] = this.instance_number_to_list_map[key] - 1;
                    }
                }
            
              if (instance_number_input in this.selected_object_instances) this.selected_object_instances.splice(this.selected_object_instances.indexOf(instance_number_input),1);
            } 
        }
        
        deleteCanvasObject(instance_number_input : number)  
        {
            if (instance_number_input >= 0 && instance_number_input <= this.max_canvas_instance_number)
            {
                const index = this.instance_number_to_list_map[instance_number_input];
                this.deleteCanvasObjectBase(instance_number_input,index);
                this.arrlen = this.canvas_object_array.length;
            }
        }
        
        deleteSelectedCanvasObjects()
        {
            for (const val in this.selected_object_instances)
            {
                const index = this.instance_number_to_list_map[val];
                this.deleteCanvasObjectBase(Number(val),index);
            }
            this.arrlen = this.canvas_object_array.length;          
        }

        deleteAllCanvasObjects()
        {
            for (const key in this.instance_number_to_list_map)
            {
                const index = this.instance_number_to_list_map[key];
                this.deleteCanvasObjectBase(Number(key),index);
                
            }
            this.arrlen = this.canvas_object_array.length;
        }

        select_canvas_instance(instance_number_input : number)  
        {            
            if (instance_number_input >= 0 && instance_number_input <= this.max_canvas_instance_number)
            {
                if (instance_number_input in this.instance_number_to_list_map)
            {   
                if (instance_number_input in this.selected_object_instances)
                {
                    this.deselect_canvas_instance(instance_number_input);
                    return;
                }
                const selection = this.instance_number_to_list_map[instance_number_input]    
                this.selected_object_instances.push(selection);
                }
            }
        }

        deselect_canvas_instance(instance_number_input : number) {
            if (instance_number_input >= 0 && instance_number_input <= this.max_canvas_instance_number)
            {
                if (instance_number_input in this.selected_object_instances)
                {
                    const selection = this.instance_number_to_list_map[instance_number_input];
                    this.selected_object_instances.splice(this.selected_object_instances.indexOf(instance_number_input),1);
                }
            }
        }
        
        clearAllSelectedCanvasInstances()
        {
           this.selected_object_instances.splice(0);
        }
        
        
        getObjClass(object_type_input : string, instance_number_input : number) : CanvasObject
        {
            switch (object_type_input){
                case 'box' :
                    return new BoxObject(instance_number_input)
                default : 
                return new CanvasObject(instance_number_input)
            }
        }

   }
   
    const canvas_object_manager = new CanvasObjectManager()
