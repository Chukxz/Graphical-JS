//
(function(){
  type Datatype_B = "Point" | null;

  type Datatype = Datatype_B | "Edge" | "Face";

  type Datatype_adv = {"datatype" : Datatype_B, "point" : Point2D_Store | null};

  type Planar_Object_Store_Datatype = [Datatype, Edge_Store | Triangle_Store, Datatype_adv, Datatype_adv, Datatype_adv]

  type Tracker = {edge_list : (Planar_Object_Store_Datatype_Operations)[], face_list : (Planar_Object_Store_Datatype_Operations)[]}

  type Output = {egdes : Planar_Object_Store_Datatype_Operations[], faces : Planar_Object_Store_Datatype_Operations[], history_tracker : Tracker[]};
  class Planar_Object_Store_Datatype_Operations{
    private _data : Planar_Object_Store_Datatype;
    constructor(input : Planar_Object_Store_Datatype){ this._data = input;}

    get_data_type = () : string | null => {return this._data[0];}

    get_data = () : Planar_Object_Store_Datatype => {return this._data;}
    
    Equals(other : Planar_Object_Store_Datatype_Operations){
      if (this._data[0] === "Edge")
      {
        const edge = this._data[1] as Edge_Store;
        
        return edge.Equals(other._data[1] as Edge_Store);
      }
    }

    face_id(){
      if (this._data[0] === "Face")
      {
        return (this._data[1] as Triangle_Store).tri_id();
      }
    }
  }

  class Planar_Object_Store{
    point2d = (datatype : "Point" | null, p : Point2D_Store | null) : Datatype_adv => {return {"datatype" : datatype, "point" : p};}

    edge2d = (edge: Edge_Store, s : Point2D_Store, e : Point2D_Store) => {return new Planar_Object_Store_Datatype_Operations(["Edge", edge, {"datatype": s.get_parent_data_type(), "point" : s},{"datatype": e.get_parent_data_type(), "point" : e},{"datatype": null, "point" : null}])};

    face2d = (triangle : Triangle_Store, p1 : Point2D_Store, p2 : Point2D_Store, p3 : Point2D_Store) =>{return new Planar_Object_Store_Datatype_Operations(["Face", triangle, {"datatype": p1.get_parent_data_type(), "point" : p1},{"datatype": p2.get_parent_data_type(), "point" : p2},{"datatype": p3.get_parent_data_type(), "point" : p3}])};
  }

  class Point2D{
    x: number;
    y: number;
    r : number;
    constructor(x : number,y : number,r = 0){
      this.x = x;
      this.y = y;
      this.r = r;
    }
  }

  class Point2D_Store{
    private _pt_id : number;
    private _u_pt_id : number;
    private _x : number;
    private _y : number;
    private store_parent_data : "Point" | null;
    private _connected_edge_list : Edge_Store[];

    constructor(id : number, u_id : number, i_x : number , i_y : number, data_type : "Point" | null){
      this._pt_id = id;
      this._u_pt_id = u_id;
      this._x = i_x;
      this._y = i_y;
      this.store_parent_data = data_type;
      this._connected_edge_list = [];
    }

    set_pt_id = (pt_id : number) : void => {this._pt_id = pt_id;}

    pt_id = () : number => {return this._pt_id;}

    u_pt_id = () : number => {return this._u_pt_id;}

    x = () : number => {return this._x;}

    y = () : number => {return this._y;}

    get_parent_data_type = () => {return this.store_parent_data;}

    cc_vertical_edge(input : number | Edge_Store) : Edge_Store | null // counter clockwise vertical edge 
    {
      if(typeof input === "number")
      {
        const id : number = input;
        if(id > (this._connected_edge_list.length - 1)) return null;
        return this._connected_edge_list[id]; // 0, 1, 2, ......
      }

      else{
        const with_edge : Edge_Store = input;

        let index_of_next = this._connected_edge_list.findIndex(obj => obj.edge_id() === with_edge.edge_id());

        if (index_of_next === -1)  // object not found
          return null; // this should never happen

        index_of_next++; // next counter clockwise edge in the list
        if (index_of_next === this._connected_edge_list.length) // check if the index reached end
          index_of_next = 0; // cycle back to zero

        return this.cc_vertical_edge(index_of_next); //0,1,2,....
      }
    }

    cw_vertical_edge(input : number | Edge_Store) : Edge_Store | null // clockwise vertical edge 
    {
      if(typeof input === "number")
      {
        const id : number = input;
        if(id > (this._connected_edge_list.length - 1)) return null;
        return this._connected_edge_list[this._connected_edge_list.length - 1 - id]; // n-0, n-1, n-2, ......
      }

      else{
        const with_edge : Edge_Store = input;

        let index_of_next = this._connected_edge_list.findIndex(obj => obj.edge_id() === with_edge.edge_id());

        if (index_of_next === -1)  // object not found
          return null; // this should never happen

        index_of_next--; // next clockwise edge in the list
        if (index_of_next === -1) // check if the index reached beginning
          index_of_next = this._connected_edge_list.length - 1; // cycle back to end(reverse)

        return this.cc_vertical_edge(index_of_next); //0,1,2,....
      }
    }

    Equals(other : Point2D_Store)
    {
      return (this._x === other._x && this._y === other._y);
    }

    get_edge_away_from_this_pt(the_edge : Edge_Store)
    {
      // This function returns the edge oriented from this point
      const this_pt : Point2D_Store = new Point2D_Store(this._pt_id, this._u_pt_id,this._x,this._y,this.store_parent_data);

      if (the_edge.start_pt().Equals(this_pt) === false)
      {
        return new Edge_Store(the_edge.edge_id(),this_pt,the_edge.the_other_pt(this_pt));
      }
      else return the_edge;
    }

    add_sorted_edge(edge_to_add : Edge_Store)
    {
      // Add the edges as counter clock wise to the sorted list
      //     this_pt
      //      |\     
      //      | \  
      //      |  \ 
      //      |   \
      //      |    \
      //      |     \
      //      V      V
      //  vertical   edge_0
      //____________________________________________________________________________________

      edge_to_add = this.get_edge_away_from_this_pt(edge_to_add); // Always add edge away from this point

      if (this._connected_edge_list.length === 0)
      {
        this._connected_edge_list.push(edge_to_add);
        return;
      }

      if (new Edge_Angle_Comparer_Vertical().compare(this._connected_edge_list[this._connected_edge_list.length - 1], edge_to_add) <= 0) // Equal to zero should not occur
      {
        this._connected_edge_list.push(edge_to_add);
        return;
      }

      if (new Edge_Angle_Comparer_Vertical().compare(this._connected_edge_list[0], edge_to_add) >= 0) // Equal to zero should not occur
      {
        this._connected_edge_list.splice(0, 0, edge_to_add); // Insert at zero because all the other angles are higher
        return;
      }

      // Uses a binary search algorithm to locate a specific element in the sorted List : Edge_Store
      let index = new BinarySearch().iterative(edge_to_add,this._connected_edge_list);
      if (index < 0) index = ~index; // Bitwise Complement operator is represented by ~. It is a unary operator, i.e.operates on only one operand.The ~ operator inverts each bits i.e.changes 1 to 0 and 0 to 1.
      this._connected_edge_list.splice(index,0,edge_to_add);
    }

    delete_edge(input : number | Edge_Store)
    {
      let edge_index : number;

      if (typeof input === "number")
      {
        const the_edge_id = input;

        edge_index = this._connected_edge_list.findIndex(obj => obj.edge_id() === the_edge_id);

      }
      else{
        const edge_to_delete = input;

        edge_index = this._connected_edge_list.findIndex(obj => obj.Equals(edge_to_delete));   
      }

      if (edge_index != -1) this._connected_edge_list.splice(edge_index,1);
  }
  }

  class Edge_Angle_Comparer_Vertical {
    compare(e1 : Edge_Store, e2 : Edge_Store)
    {
      // if return is less than 0 (then e1 is less than e2)
      // if return equals 0 (then e1 is equal to e2)
      // if return is greater than 0 (then e1 is greater than e2)

      let vert_edge1 : Edge_Store, vert_edge2 : Edge_Store;
      let angle_e1 : number, angle_e2 : number;

      const point_data = new Planar_Object_Store().point2d(null,null).datatype;

      vert_edge1 = new Edge_Store(-1, e1.start_pt(), new Point2D_Store(-1, -1, e1.start_pt().x(), e1.start_pt().y() - 100, point_data));
      angle_e1 = MeshStore.angle_between(vert_edge1, e1);

      vert_edge2 = new Edge_Store(-1, e2.start_pt(), new Point2D_Store(-1, -1, e2.start_pt().x(), e2.start_pt().y() - 100, point_data));
      angle_e2 = MeshStore.angle_between(vert_edge2, e2);

      // A signed integer that indicates the relative values of x and y:
      //  -If less than 0, x is less than y.
      //  - If 0, x equals y.
      //  - If greater than 0, x is greater than y.
      if (angle_e1 < angle_e2) return -1;
      else if (angle_e1 > angle_e2) return +1;
      else return 0; // Zero is not a case (never). If this line executes something went wrong!!
    }
  }

  class Edge_Store{
    private _edge_id : number;
    private _start_pt : Point2D_Store;
    private _end_pt : Point2D_Store;
    private tri1_id : number;
    private tri_2_id : number;

    constructor(i_e_id : number, s : Point2D_Store, e : Point2D_Store)
    {
      this._edge_id = i_e_id;
      this._start_pt = s;
      this._end_pt = e;
      this.tri1_id = -1;
      this.tri_2_id = -1;
    }

    edge_id = () : number => {return this._edge_id;}

    start_pt = () : Point2D_Store => {return this._start_pt;}

    end_pt = () : Point2D_Store => {return this._end_pt;}

    get_first_tri_index = () : number => {return this.tri1_id;}

    get_second_tri_index = () : number => {return this.tri_2_id;}

    add_triangle_id(t_id : number) // function to add the id of triangles attached to this edge (when new triangles are added using this edge)
    {
      // only two ids are stored
      if (this.tri1_id === -1 || this.tri1_id === t_id) this.tri1_id = t_id;
      else this.tri_2_id = t_id;
    }

    delete_triangle_id(t_id : number)// function to remove the id of triangles connected to this point (if the edge is removed)
    {
      if (this.tri1_id === t_id) this.tri1_id = -1;
      if (this.tri_2_id === t_id) this.tri_2_id = -1;
    }

    Equals(other : Edge_Store) // orientation is important
    {
      return (this._start_pt.Equals(other._start_pt) && this._end_pt.Equals(other._end_pt));
    }

    commutative_equal(other : Edge_Store) // commutative equal check edges with same two points but different orientation
    {
      return ((this._start_pt.Equals(other._start_pt) && this._end_pt.Equals(other._end_pt)) ||
      (this._end_pt.Equals(other._start_pt) && this._start_pt.Equals(other._end_pt)));
    }

    the_other_pt(this_pt : Point2D_Store) : Point2D_Store
    {
      if(this_pt.Equals(this.start_pt()) === true) return this.end_pt();
      else return this.start_pt();
    } 
  }

  class Triangle_Store{
    private _tri_id : number;
    public e1 : Edge_Store;
    public e2 : Edge_Store;
    public e3 : Edge_Store;
    private _p1 : Point2D_Store;
    private _p2 : Point2D_Store;
    private _p3 : Point2D_Store;

    constructor(i_tri_id : number, i_p1 : Point2D_Store, i_p2 : Point2D_Store, i_p3 : Point2D_Store)
    {
      this._tri_id = i_tri_id;
      this._p1 = i_p1;
      this._p2 = i_p2;
      this._p3 = i_p3;
    }

    p1 = () : Point2D_Store => {return this._p1;}

    p2 = () : Point2D_Store => {return this._p2;}

    p3 = () : Point2D_Store => {return this._p3;}

    tri_id = () : number => {return this._tri_id;}

    equal_edge(other_e : Edge_Store)
    {
      if (other_e.Equals(this.e1) === true || other_e.Equals(this.e2) === true || other_e.Equals(this.e3) === true) return true;
      else return false;
    }
  }

  class Delaunay_triangulation_divide_n_conquer
  {
    delaunay_start(point_list : Point2D[]) : Output
    {

      // constructor for the main umbrella class
      // This class only takes list of point2Ds as inputs
      // The input class can be modified as long as it can output pt.x & pt.y as a list

      // convert from type Point2d to type Point2d_Store
      const sorted_points_store : Point2D_Store[] = point_list.map((point, index) => new Point2D_Store(index, index, point.x, point.y, "Point"));

      // sort the point2D with x coordinate (y is a tie breaker)
      sorted_points_store.sort((a,b)=>{return (a.x() < b.x() || (a.x() === b.x() && a.y() < b.y())) ? -1 : 1});

      // reset the index of sorted point from the old indexing based on the unsorted array of input points to the new indexing based on the sorted array
      sorted_points_store.forEach((value, index) => {sorted_points_store[index].set_pt_id(index)});

      // convert from type Point2d_Store to Planar_Object_Store
      const sorted_pts_planar : Datatype_adv[] = sorted_points_store.map((point) => new Planar_Object_Store().point2d("Point", point));

      return new MeshStore().mesh_start(sorted_points_store, sorted_pts_planar);
    }
  }

  class MeshStore
  {

    // Output variables
    local_input_points : Datatype_adv[];
    local_output_edges : Planar_Object_Store_Datatype_Operations[];
    local_output_triangles : Planar_Object_Store_Datatype_Operations[];
    local_history_tracker : Tracker[];

    // Local variables
    pt_list : Point2D_Store[]
    edge_list : Edge_Store[];
    triangle_list : Triangle_Store[];

    // unique id list
    unique_edgeid_list : number[];
    unique_triangleid_list : number[];

    mesh_start (input_vertices : Point2D_Store[], sorted_input_points : Datatype_adv[]) : Output{
      // Set the local input points to local variable
      this.local_input_points = sorted_input_points;
      this.local_output_edges = [];
      this.local_output_triangles = [];
      this.local_history_tracker = []; // History tracker for animation

      // Transfer to Local point list
      this.pt_list = input_vertices;
      this.edge_list = [];
      this.triangle_list = [];

      this.unique_edgeid_list = [];
      this.unique_triangleid_list = [];

      if(this.pt_list.length > 3) // First call to delaunay divide and conquer
      {
        const half_length = Math.ceil(this.pt_list.length * 0.5);
        const left_list : Point2D_Store[] = this.pt_list.slice(0, half_length); // extract the left list
        const right_list : Point2D_Store[] = this.pt_list.slice(half_length); // extract the right list

        this.delaunay_divide_n_conquer(left_list, right_list) // delaunay divide and conquer
      }
      else // if initial pt_list.length <= 3 no need to divide and conquer
      {
        if(this.pt_list.length === 3)
        {
          this.add_triangle(this.pt_list[0], this.pt_list[1], this.pt_list[2]);
        }

        else // pt_list.length === 2
        {
          this.add_edge(this.pt_list[0], this.pt_list[1]);
        }
      }

      return {"egdes": this.local_output_edges, "faces" : this.local_output_triangles, "history_tracker" : this.local_history_tracker};
    }

    delaunay_divide_n_conquer(left_list : Point2D_Store[], right_list : Point2D_Store[])
    {
      // main divide and conquer recursive function

      // Left
      if(left_list.length > 3)
      {
        const half_length = Math.ceil(left_list.length * 0.5);
        const left_left_list : Point2D_Store[] = left_list.slice(0,half_length); // extract the left list
        const left_right_list : Point2D_Store[] = left_list.slice(half_length); // extract the right list

        this.delaunay_divide_n_conquer(left_left_list, left_right_list) // delaunay divide and conquer
      }
      else
      {
        if(left_list.length === 3)
        {
          this.add_triangle(left_list[0], left_list[1], left_list[2]);
        }
        else // pt_list.length === 2
        {
          this.add_edge(left_list[0], left_list[1]);
        }
      }

      // Right
      if(right_list.length > 3)
      {
        const half_length = Math.ceil(right_list.length * 0.5);
        const right_left_list : Point2D_Store[] = right_list.slice(0, half_length); // extract the left list
        const right_right_list : Point2D_Store[] = right_list.slice(half_length); // extract the right list

        this.delaunay_divide_n_conquer(right_left_list, right_right_list) // delaunay divide and conquer
      }
      else
      {
        if(right_list.length === 3)
        {
          this.add_triangle(right_list[0], right_list[1], right_list[2]);
        }
        else // pt_list.length === 2
        {
          this.add_edge(right_list[0], right_list[1]);
        }
      }
      
      const baseLR : Edge_Store = this.find_initial_baseLR(left_list, right_list)
      // Link LR edges
      this.merge_LRedges(baseLR);
    }

    add_to_local_list(e : Edge_Store, t : Triangle_Store | null)
    {
      //____________________________________________________________________________________________________________________________________________________________________
      // !! Addition on main list here

      const temp_edge = new Planar_Object_Store().edge2d(e, e.start_pt(), e.end_pt());
      this.local_output_edges.push(temp_edge);

      if(t !== null)
      {
        const temp_face = new Planar_Object_Store().face2d(t ,t.p1(),t.p2(),t.p3());
        this.local_output_triangles.push(temp_face);
      }

      // #################################################################
      const temp_edge_tracker : Tracker = {"edge_list" : [] , "face_list" : []};
      temp_edge_tracker.edge_list = this.local_output_edges;
      temp_edge_tracker.face_list = this.local_output_triangles;

      this.local_history_tracker.push(temp_edge_tracker);        
      // #################################################################   
    }

    delete_from_local_list(e : Edge_Store, t1_id : number, t2_id : number)
    {
      let temp_edge : Planar_Object_Store_Datatype_Operations;
      let temp_edge_sym : Planar_Object_Store_Datatype_Operations
      let rem_index : number;

      // edge e
      // !! removal on main list here

      temp_edge = new Planar_Object_Store().edge2d(e , e.start_pt(), e.end_pt());
      temp_edge_sym = new Planar_Object_Store().edge2d(e , e.end_pt(), e.start_pt());

      rem_index = this.local_output_edges.findIndex(obj => obj.Equals(temp_edge) || obj.Equals(temp_edge_sym));

      if (rem_index != -1)
      {
        this.local_output_edges.splice(rem_index,1);  // !! Deletion on main list here

        if (t1_id < t2_id) // swap to remove in order
        {
          let temp = t1_id;
          t1_id = t2_id;
          t2_id = temp;
        }

        if(t1_id != -1)
        {
          const t1_index = this.local_output_triangles.findIndex(obj => obj.face_id() === this.triangle_list[t1_id].tri_id());
          this.local_output_triangles.splice(t1_index,1);
        }

        if(t2_id != -1)
        {
          const t2_index = this.local_output_triangles.findIndex(obj => obj.face_id() === this.triangle_list[t2_id].tri_id());
          this.local_output_triangles.splice(t2_index,1);
        }
      }


      // #################################################################
      const temp_edge_tracker : Tracker = {"edge_list" : [], "face_list" : []};
      temp_edge_tracker.edge_list = this.local_output_edges;
      temp_edge_tracker.face_list = this.local_output_triangles;

      this.local_history_tracker.push(temp_edge_tracker);        
      // #################################################################
    }

    add_triangle(p1 : Point2D_Store, p2 : Point2D_Store, p3 : Point2D_Store)
    {
      // Add the first two edge
      this.add_edge(p1, p2);
      this.add_edge(p2, p3);

      // Check colinearity of p1, p2, p3
      if (MeshStore.is_collinear(p1, p2, p3) == false) // Add the third edge only when collinear is false
      {
          this.add_edge_with_triangle(p3, p1); // Add third edge with triangle
      }  }

      remove_triangle( r_tri_id : number)
    {
      this.triangle_list[r_tri_id].e1.delete_triangle_id(this.triangle_list[r_tri_id].tri_id()); // delete the triangle index in first edge
      this.triangle_list[r_tri_id].e2.delete_triangle_id(this.triangle_list[r_tri_id].tri_id()); // delete the triangle index in secomd edge
      this.triangle_list[r_tri_id].e3.delete_triangle_id(this.triangle_list[r_tri_id].tri_id()); // delete the triangle index in third edge

      this.unique_triangleid_list.push(this.triangle_list[r_tri_id].tri_id());
      this.triangle_list.splice(r_tri_id, 1); // Remove the triange
    }

    add_edge(p1 : Point2D_Store, p2 : Point2D_Store)
    {
      const edge_id = this.get_unique_edge_id();
      const e = new Edge_Store(edge_id, p1, p2);

      // Update the points p1 $ p2 -> edge id lists
      // Note points are never removed from the list so indexing is easier (pt_id remains the same)

      this.pt_list[p1.pt_id()].add_sorted_edge(e);
      this.pt_list[p2.pt_id()].add_sorted_edge(e);

      this.edge_list.push(e); // Add the edge to the list

      this.add_to_local_list(e, null);
    }

    add_edge_with_triangle(p1 : Point2D_Store, p2 : Point2D_Store)
    {
      const edge_id = this.get_unique_edge_id();
      const e = new Edge_Store(edge_id, p1, p2);

      // Update the points p1 $ p2 -> edge id lists
      // Note points are never removed from the list so indexing is easier (pt_id remains the same)

      this.pt_list[p1.pt_id()].add_sorted_edge(e);
      this.pt_list[p2.pt_id()].add_sorted_edge(e);

      // Now find the other two edges connected to this edge forming a triangle

      let is_triangle_found : boolean = false;
      let second_edge : Edge_Store;
      let third_edge : Edge_Store;

      // clockwise search
      second_edge = e.end_pt().cc_vertical_edge(e) as Edge_Store;
      third_edge = second_edge.end_pt().cc_vertical_edge(second_edge) as Edge_Store;

      if (third_edge.end_pt().Equals(e.start_pt()) === true) is_triangle_found = true;
      
      else{
        // counter clocwise search
        second_edge = e.end_pt().cw_vertical_edge(e) as Edge_Store;
        third_edge = second_edge.end_pt().cw_vertical_edge(second_edge) as Edge_Store;

        if (third_edge.end_pt().Equals(e.start_pt()) === true) is_triangle_found = true;
      }

      this.edge_list.push(e) // Add the edge to the list

      if (is_triangle_found === true) // must be found otherwise something went wrong
      {
        const tri_id = this.get_unique_triangle_id();

        let second_edge_index : number, third_edge_index : number;

        second_edge_index = this.edge_list.findIndex(obj => obj.edge_id() === second_edge.edge_id());
        third_edge_index = this.edge_list.findIndex(obj => obj.edge_id() === third_edge.edge_id());

        this.edge_list[second_edge_index].add_triangle_id(tri_id); // got lazy.. need to develop more efficient method
        this.edge_list[third_edge_index].add_triangle_id(tri_id);// got lazy.. need to develop more efficient method

        // Update the edge triangle id
        this.edge_list[this.edge_list.length - 1].add_triangle_id(tri_id);

        // Add the triangle
        this.triangle_list.push(new Triangle_Store(tri_id, e.start_pt(), e.end_pt(), second_edge.the_other_pt(e.end_pt())));

        this.triangle_list[this.triangle_list.length - 1].e1 = this.edge_list[third_edge_index];
        this.triangle_list[this.triangle_list.length - 1].e2 = this.edge_list[second_edge_index];
        this.triangle_list[this.triangle_list.length - 1].e3 = this.edge_list[this.edge_list.length - 1];
      }

      this.add_to_local_list(e, is_triangle_found === true ? this.triangle_list[this.triangle_list.length - 1] : null);
    }

    remove_edge(r_edge_id : number)
    {
      const edge_list_index = this.edge_list.findIndex(obj => obj.edge_id() === r_edge_id);

      // Remove the edge ids in the points
      this.pt_list[this.edge_list[edge_list_index].start_pt().pt_id()].delete_edge(this.edge_list[edge_list_index].edge_id());
      this.pt_list[this.edge_list[edge_list_index].end_pt().pt_id()].delete_edge(this.edge_list[edge_list_index].edge_id());

      // Note no edges with two triangles (ie, triangle with either side), so finding two index is not efficient <- need improvement below
      // Find the triangle1 ids i the adjacent sides of this edge
      let tri_list_index1 = -1, tri_list_index2 = -1;

      tri_list_index1 = this.triangle_list.findIndex(obj => obj.tri_id() === this.edge_list[edge_list_index].get_first_tri_index());

      if (tri_list_index1 === -1)
      { 
        // Find the triangle2 (if any) ids in the adjacent sides of this edges
        tri_list_index2 = this.triangle_list.findIndex(obj => obj.tri_id() === this.edge_list[edge_list_index].get_second_tri_index());
      }

      this.delete_from_local_list(this.edge_list[edge_list_index], tri_list_index1, tri_list_index2);

      // Remove the triangle1 ids in the adjacent sides of this edge
      if (tri_list_index1 !== -1) // if -1 then not found
      {
          this.remove_triangle(tri_list_index1); // Remove the triange
      }
      else if (tri_list_index2 !== -1) // if -1 then not found // Remove the triangle2 (if any) ids in the adjacent sides of this edges
      {
          this.remove_triangle(tri_list_index2); // Remove the triange
      }
      // update the unique edge id list to maintain the edge ids
      this.unique_edgeid_list.push(this.edge_list[edge_list_index].edge_id());
      // remove the edge
      this.edge_list.splice(edge_list_index, 1);
    }

    get_unique_edge_id()
    {
      let edge_id : number;
      // get an unique edge id
      if(this.unique_edgeid_list.length != 0)
      {
      edge_id = this.unique_edgeid_list[0]; // retrive the edge id from the list which stores the id of deleted edges
      this.unique_edgeid_list.splice(0,1);
      }
      
      else
      {
        edge_id = this.edge_list.length;
      }
      
      return edge_id;
    }

    get_unique_triangle_id()
    {
      let tri_id : number;
      // get an unique triangle id
      if(this.unique_triangleid_list.length != 0)
      {
      tri_id = this.unique_triangleid_list[0]; // retrive the edge id from the list which stores the id of deleted triangles
      this.unique_triangleid_list.splice(0,1);
      }
      
      else
      {
        tri_id = this.triangle_list.length;
      }
      
      return tri_id;
    }

    find_initial_baseLR(left : Point2D_Store[], right : Point2D_Store[])
    {
      let left_end : Point2D_Store = left[left.length - 1]; // left end // Colinear error fixed
      let right_end : Point2D_Store = right[0]; // right end

      let left_bot_edge : Edge_Store = left_end.cw_vertical_edge(0) as Edge_Store; // First Vertical edge at clock wise direction at this point
      let right_bot_edge : Edge_Store = right_end.cc_vertical_edge(0) as Edge_Store;// First Vertical edge at  counter clock wise direction at this point

      while(true)
      {
        // Select the bottom most end by comparing the orientation with the other
        if (MeshStore.leftof(right_end, left_bot_edge) === true) // check the right_end point and orientation of the left edge
        {
          left_end = left_bot_edge.the_other_pt(left_end); // Find the next point (which is the endpoint of the left edge)
          left_bot_edge = left_end.cw_vertical_edge(0) as Edge_Store;
        }
        else if(MeshStore.rightof(left_end,right_bot_edge) === true) // check the left_end point and orientation of the right edge
        {
          right_end = right_bot_edge.the_other_pt(right_end);  // Find the next point (which is the endpoint of the right edge)
          right_bot_edge = right_end.cc_vertical_edge(0) as Edge_Store;
        }
        else
        {
          break;
        }
      }

      this.add_edge(left_end, right_end); // Add the base LR edge
      return this.edge_list[this.edge_list.length - 1]; // return the last add item (which is the baseLR edge)
    }

    merge_LRedges(baseLRedge : Edge_Store)
    {
      const baseLRdege_sym = new Edge_Store(baseLRedge.edge_id(), baseLRedge.end_pt(), baseLRedge.start_pt()) // symmetry of baseLRedge
      let lcand : Edge_Store = baseLRedge.start_pt().cc_vertical_edge(baseLRedge) as Edge_Store;// left candidate
      let rcand : Edge_Store = baseLRedge.end_pt().cw_vertical_edge(baseLRdege_sym) as Edge_Store;// right candidate

      // Left side Remove operation
      if (MeshStore.leftof(lcand.end_pt(), baseLRedge) === true) // if the left candidate end point is not leftof baseLRedge then top is reached with baseLRedge and the end point of leftcandidate will not lie inCircle
      {
        let lcand_next : Edge_Store = baseLRedge.start_pt().cc_vertical_edge(lcand) as Edge_Store; // find the next candidate by counter clockwise cycle at baseLRedge start point with the current left candidate as qualifier
        while (MeshStore.incircle(baseLRedge.start_pt(), baseLRedge.end_pt(), lcand.end_pt(), lcand_next.end_pt()) === true)
        {
          const new_lcand : Edge_Store = baseLRedge.start_pt().cc_vertical_edge(lcand) as Edge_Store; // find the next candidate by counter clockwise cycle at baseLRedge start point with the current left candidate as qualifier
          this.remove_edge(lcand.edge_id());
          lcand = new_lcand;
          lcand_next = baseLRedge.start_pt().cc_vertical_edge(lcand) as Edge_Store;
        }
      }

      // Right side Remove operation
      if (MeshStore.rightof(rcand.end_pt(), baseLRdege_sym) === true) // if the right candidate end point is not rightof baseLRedge_sym then top is reached with baseLRedge and the end point of rightcandidate will not lie inCircle
      {
        let rcand_next : Edge_Store = baseLRedge.end_pt().cw_vertical_edge(rcand) as Edge_Store; // find the next candidate by clockwise cycle at baseLRedge end point with the current right candidate as qualifier
        while(MeshStore.incircle(baseLRdege_sym.end_pt(), baseLRdege_sym.start_pt(), rcand.end_pt(), rcand_next.end_pt()) === true)
        {
          const new_rcand : Edge_Store = baseLRedge.end_pt().cw_vertical_edge(rcand) as Edge_Store; // find the next candidate by clockwise cycle at baseLRedge end point with the current right candidate as qualifier
          this.remove_edge(rcand.edge_id());
          rcand = new_rcand;
          rcand_next = baseLRedge.end_pt().cw_vertical_edge(rcand) as Edge_Store;
        }
      }

      let lvalid : boolean, rvalid : boolean;
      lvalid = MeshStore.leftof(lcand.end_pt(), baseLRedge);  // validity of left candidate
      rvalid = MeshStore.rightof(rcand.end_pt(), baseLRdege_sym); // validity of right candidate

      // The next cross edge is to be connected to either lcand.end_pt or rcand.end_pt
      if (lvalid === true && rvalid === true) // both are valid, then choose the correct end with in-circle test
      {
        if (MeshStore.incircle(baseLRedge.start_pt(), baseLRedge.end_pt(), lcand.end_pt(), rcand.end_pt()) === true) //right candidate end point lies inside in circle formed by left candidate
        {
          this.add_edge_with_triangle(baseLRedge.start_pt(), rcand.end_pt()); // so form the edge with right candidate end point
        }
        else // left candidate end point in cicle doesn't enclose right candidate end point
        {
          this.add_edge_with_triangle(lcand.end_pt(), baseLRdege_sym.start_pt());
        }
      }

      else if (lvalid === true)
      {
        this.add_edge_with_triangle(lcand.end_pt(), baseLRdege_sym.start_pt());// Add cross edge base1 from lcand.end_pt() to baseLRedge_sym.start_pt()
      }
      else if (rvalid === true)
      {
        this.add_edge_with_triangle(baseLRedge.start_pt(), rcand.end_pt());// Add cross edge basel from baseLRedge.start_pt() to rcand.end_pt()
      }
      else
      {
      // both lcand and rcand are making obtuse angle with baseLRedge, then baseLRedge is the upper common tangent
      return; // end of recursion 
      }

      const new_baseLRedge : Edge_Store = this.edge_list[this.edge_list.length - 1]; // new baseLRedge is the last created edge
      this.merge_LRedges(new_baseLRedge); // Recursion here
    }

    static angle_between(with_edge : Edge_Store, the_edge : Edge_Store)
    {
      let v1_x : number , v1_y : number;
      let v2_x : number, v2_y :  number;
      let normalize : number;

      // vector with edge
      v1_x = with_edge.end_pt().x() - with_edge.start_pt().x();
      v1_y = with_edge.end_pt().y() - with_edge.start_pt().y();
      normalize = Math.sqrt(Math.pow(v1_x,2) + Math.pow(v1_y,2));

      v1_x = v1_x / normalize;
      v1_y = v1_y / normalize;

      // vector the edge
      v2_x = the_edge.end_pt().x() - the_edge.start_pt().x();
      v2_y = the_edge.end_pt().y() - the_edge.start_pt().y();
      normalize = Math.sqrt(Math.pow(v2_x,2) + Math.pow(v2_y,2));

      v2_x = v2_x / normalize;
      v2_y = v2_y / normalize;

      // sin and cos of the two vectors
      const sin = (v1_x * v2_y) - (v2_x * v1_y);
      const cos = (v1_x * v2_x) + (v1_y * v2_y);

      let angle = (Math.atan2(sin,cos) / Math.PI) * 180;
      if (angle <= 0) // there is no zero degree (zero degree = 360 degree) to avoid the vertical line mismatch
        angle += 360;
        
      return angle;
    }

    static is_collinear(a : Point2D_Store, b : Point2D_Store, c : Point2D_Store)
    {
      return (( ( (b.x() - a.x()) * (c.y() - a.y()) ) - ( (b.y() - a.y()) * (c.x() - a.x()) ) ) === 0);
    }

    static ccw (a : Point2D_Store, b : Point2D_Store, c : Point2D_Store)
    {
      // Computes | a.x a.y  1 |
      //          | b.x b.y  1 | > 0
      //          | c.x c.y  1 |

      return (( ( (b.x() - a.x()) * (c.y() - a.y()) ) - ( (b.y() - a.y()) * (c.x() - a.x()) ) )) > 0;
    }

    static rightof (x : Point2D_Store, e : Edge_Store)
    {
      return MeshStore.ccw(x , e.end_pt(), e.start_pt());
    }

    static leftof (x : Point2D_Store, e : Edge_Store)
    {
      return MeshStore.ccw(x, e.start_pt(), e.end_pt());
    }

    static incircle(a : Point2D_Store, b : Point2D_Store, c : Point2D_Store, d : Point2D_Store)
    {
      //Computes | a.x  a.y  a.x²+a.y²  1 |
      //         | b.x  b.y  b.x²+b.y²  1 | > 0
      //         | c.x  c.y  c.x²+c.y²  1 |
      //         | d.x  d.y  d.x²+d.y²  1 |
      // Return true is d is in the circumcircle of a, b, c
      // From Jon Shewchuk's "Fast Robust predicates for Computational geometry"
      
      const a1 = a.x() - d.x();
      const a2 = a.y() - d.y();

      const b1 = b.x() - d.x();
      const b2 = b.y() - d.y();

      const c1 = c.x() - d.x();
      const c2 = c.y() - d.y();

      const a3 = Math.pow(a1,2) + Math.pow(a2,2);
      const b3 = Math.pow(b1,2) + Math.pow(b2,2);
      const c3 = Math.pow(c1,2) + Math.pow(c2,2);

      const det = (a1 * b2 * c3 + a2 * b3 * c1 + a3 * b1 * c2) - (a3 * b2 * c1 + a1 * b3 * c2 + a2 * b1 * c3);

      return (det > 0); // Determinant greater than zero means inside the circle
    }
  }


  class BinarySearch{
    recursive(edge : Edge_Store, arr : Edge_Store[],min : number,max : number) // min = 0, max = inputArray.length - 1
    {
      if (min > max) return -1;

      else
      {
        let mid = Math.floor((min+max) / 2);

        if(edge.edge_id() === arr[mid].edge_id()) return mid;
        else if (edge.edge_id() < arr[mid].edge_id()) return this.recursive(edge,arr,min, mid - 1);
        else return this.recursive(edge, arr, mid + 1, max);
      }
    }

    iterative(edge: Edge_Store, arr : Edge_Store[])
    {
      let min = 0;
      let max = arr.length - 1;

      while (min <= max)
      {
        let mid = Math.floor((min+max) / 2);

        if(edge.edge_id() === arr[mid].edge_id()) return mid;
        else if (edge.edge_id() < arr[mid].edge_id()) max = mid - 1;
        else min = mid + 1;
      }

      return -1;
    }
  }

  function toPoints(pointList) {
    const retList = [];
    for (let point in pointList) {
        retList[point] = new Point2D(pointList[point][0], pointList[point][1]);
    }
    return retList;
}
const points = [
    // [23, 29],
    // [328, 87],
    // [98, 234],
    // [892, 382],
    // [745, 342],
    // [442, 298],
    // [232, 450],
    // [900, 23],
    // [500, 500],
    // [573, 18],
    [294, 289],
    [423, 200],
    [234, 234],
    [300, 213],
    [278, 258],
    [352, 331],
];
const mod_points = toPoints(points);
const d_n_q = new Delaunay_triangulation_divide_n_conquer();
const d = d_n_q.delaunay_start(mod_points);
// console.log(d);
function make_easy(input : Output) {
    const retList : string[] = [];
    for (let input_edge of input.egdes) {
        const edge = input_edge.get_data()[1] as Edge_Store;
        const p = edge.start_pt().u_pt_id();
        const q = edge.end_pt().u_pt_id();
        const [a, b] = [Math.min(p, q), Math.max(p, q)];
        retList.push(`${a}-${b}`);
    }
    return retList;
}
// console.log(make_easy(d));
function genEdgefromArray(array : any[]) {
    var prev = array[array.length - 1]; // set previous to last element in the array
    const result : any[] = [];
    for (let index in array) {
        const [a, b] = [Math.min(prev, array[index]), Math.max(prev, array[index])];
        result[index] = `${a}-${b}`;
        prev = array[index];
    }
    return result;
}

function genArray(min : number, n : number, diff : number, decimal : boolean) {
    const list : number[] = [];
    for (let i = 0; i < n; i++) {
        if (decimal === true)
            list[i] = min + Math.random() * diff;
        else if (decimal === false)
            list[i] = Math.round(min + Math.random() * diff);
    }
    return list;
}

function generatePointsArray(minX = 0, maxX = 100, minY = 0, maxY = 100, n = 10, decimal = false) {
    const _minX = Math.min(minX, maxX);
    const _maxX = Math.max(minX, maxX);
    const _minY = Math.min(minY, maxY);
    const _maxY = Math.max(minY, maxY);
    const diffX = _maxX - _minX;
    const diffY = _maxY - _minY;
    const xlist = genArray(_minX, n, diffX, decimal);
    const ylist = genArray(_minX, n, diffY, decimal);
    const xylist : number[][] = [];
    for (let i = 0; i < n; i++) {
        xylist[i] = [xlist[i], ylist[i]];
    }
    return xylist;
}

// console.log(generatePointsArray(-100, 100, -100, 100, 200, true))



const point_num = 1e3;
const n = 1;
const minX = -100;
const minY = -100;
const maxX = 100;
const maxY = 100;

const arr = generatePointsArray(minX, maxX, minY, maxX, point_num, false);

const mod_arr = toPoints(arr);

const start = new Date().getTime();
for (let i = 0; i < n; i++)
    d_n_q.delaunay_start(mod_arr);
const end = new Date().getTime();

console.log(`Minimum value of X: ${minX}\nMaximum value of X: ${maxX}\nMinimum value of Y: ${minY}\nMaximum value of Y: ${maxY}`);
console.log(`Time taken To run Delaunay Triangulation Divide and Conquer Algorithm with ${point_num} points at ${n} iterations: ${end - start} ms`);
})()