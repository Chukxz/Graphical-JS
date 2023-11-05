const _Classes = (bases) => {
    class Bases {
        constructor() {
            bases.foreach(base => Object.assign(this, new base()));
        }
    }
    bases.forEach(base => {
        Object.getOwnPropertyNames(base.prototype)
            .filter(prop => prop != 'constructor')
            .forEach(prop => Bases.prototype[prop] = base.prototype[prop]);
    });
    return Bases;
};

class BackwardsCompatibilitySettings {
    test_array;
    compatibility_error;
    error_pos;
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
    detect_compatibility_issues() {
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
    flat_exists() {
        if (typeof this.test_array.flat !== "undefined" && typeof this.test_array.flat === "function")
            this.test_array[0] = true;
        else
            this.test_array[0] = false;
    }
    map_exists() {
        if (typeof this.test_array.map !== "undefined" && typeof this.test_array.map === "function")
            this.test_array[1] = true;
        else
            this.test_array[1] = false;
    };
    reduce_exists() {
        if (typeof this.test_array.reduce !== "undefined" && typeof this.test_array.reduce === "function")
            this.test_array[2] = true;
        else
            this.test_array[2] = false;
    };
    reverse_exists() {
        if (typeof this.test_array.reverse !== "undefined" && typeof this.test_array.reverse === "function")
            this.test_array[3] = true;
        else
            this.test_array[3] = false;
    };
    push_exists() {
        if (typeof this.test_array.push !== "undefined" && typeof this.test_array.push === "function")
            this.test_array[4] = true;
        else
            this.test_array[4] = false;
    }
    forEach_exists() {
        if (typeof this.test_array.forEach !== "undefined" && typeof this.test_array.forEach === "function")
            this.test_array[5] = true;
        else
            this.test_array[5] = false;
    }
}

class CanvasObject {
    constructor() {
        // default values
        this.base_vertices = [];
        this.vertices_sign = [];
        this.center = [0, 0, 0];
        this.id = null;
        this.exists = true;
        this.depth_occlusion = true;
        // this.comp_error = compatibilitySettings.compatibility_error;
        this.space = "local"; // Possible values: local/object, world, camera/view, clip, screen
    }

    is_x_value(vertex_array_index) {
        if (vertex_array_index % 3 == 0) return true
        else return false;
    }

    is_y_value(vertex_array_index) {
        if (vertex_array_index % 3 == 1) return true
        else return false;
    }

    is_z_value(vertex_array_index) {
        if (vertex_array_index % 3 == 2) return true
        else return false;
    }

    add_vertices(vertex_array, add_vertex_array) {}

    clear_all_vertices(vertex_array) {}

    clear_selected_vertex(vertex_array, vertex_id_array) {}
}


class SolidOfRevolution {}

// Basic Object Types


// 2D Objects

class Line {}

class Curve {}

class Conic {}

class Circle extends Conic {}

class Oval extends Circle {}

class Ellipse extends Conic {}

class HyperBola extends Conic {}

class NPolygon extends Circle {}

class Triangle extends NPolygon {}

class Rectangle extends NPolygon {}

class Square extends Rectangle {}

class Kite extends NPolygon {}

class Parrallelogram extends NPolygon {}

class Rhombus extends Parrallelogram {}

// 3D Objects

class BoxObject extends CanvasObject {
    constructor() {
        super();
        this.box_vertex_density_number = 1;
        this.box_width_number = 10;
        this.box_height_number = 10;
        this.box_depth_number = 10;
        this.reload_box_functions_bool = false;
        this.pushed_vertices = new Float64Array()
        this.box_vertices = new Float64Array();
        this.box_base_edge_sequence = ["0-1", "0-2", "0-4", "3-1", "3-2", "3-7", "5-1", "5-4", "5-7", "6-2", "6-4", "6-7"];
        this.box_vertex_core();
        this.box_dimensions_core();
    }

    box_vertex_core() {
        for (let i = 0; i < 8; i++) {
            this.vertices_sign[i * 3] = i >= 4 ? 1 : -1; // x value
            this.vertices_sign[i * 3 + 1] = i % 4 >= 2 ? 1 : -1; // y value
            this.vertices_sign[i * 3 + 2] = i % 2 === 1 ? 1 : -1; // z value
        }
    }

    box_dimensions_core() {
        this.box_vertices = new Float64Array();
        const vertex_sgn_len = this.vertices_sign.length;
        for (let i = 0; i < vertex_sgn_len; i++) {
            if (this.is_x_value(i)) this.base_vertices[i] = this.vertices_sign[i] * this.box_width_number;
            if (this.is_y_value(i)) this.base_vertices[i] = this.vertices_sign[i] * this.box_height_number;
            if (this.is_z_value(i)) this.base_vertices[i] = this.vertices_sign[i] * this.box_depth_number;
        }
        this.box_vertices = [...this.base_vertices];
    }

    box_vertex_density_core() {
        this.pushed_vertices = [];
        if (this.box_vertex_density_number > 1) {
            const box_num = this.box_vertex_density_number - 1;

            const num = 12 * box_num;
            var start_array = [];
            var end_array = [];
            var pre_diffX = 0;
            var pre_diffY = 0;
            var pre_diffZ = 0;
            var diffX = 0;
            var diffY = 0;
            var diffZ = 0;
            var base_edge = 0;
            var minX = 0;
            var minY = 0;
            var minZ = 0;

            for (let index = 0; index < num; index++) {
                const mod_num = index % box_num;
                if (mod_num === 0) {

                    const [start, end] = this.box_base_edge_sequence[base_edge].split("-");
                    start_array = this.get_box_vertex_dimensions(start);
                    end_array = this.get_box_vertex_dimensions(end);

                    [pre_diffX, pre_diffY, pre_diffZ] = [
                        end_array[0] - start_array[0],
                        end_array[1] - start_array[1],
                        end_array[2] - start_array[2]
                    ];
                    base_edge++;

                    [diffX, diffY, diffZ] = [
                        Math.abs(pre_diffX / this.box_vertex_density_number),
                        Math.abs(pre_diffY / this.box_vertex_density_number),
                        Math.abs(pre_diffZ / this.box_vertex_density_number)
                    ];

                    minX = Math.min(start_array[0], end_array[0]);
                    minY = Math.min(start_array[1], end_array[1]);
                    minZ = Math.min(start_array[2], end_array[2]);
                }
                this.pushed_vertices.push(...[diffX * (mod_num + 1) + minX, diffY * (mod_num + 1) + minY, diffZ * (mod_num + 1) + minZ]);
            }
        }

        var pLen = this.pushed_vertices.length;
        var offset = 0;

        while (pLen > 1000) {
            var pushed_vertices_child = new Float64Array(this.pushed_vertices.slice(offset, offset + 1000));
            this.box_vertices.push(...pushed_vertices_child);
            pLen = pLen - 1000;
            offset += 1000;
            pushed_vertices_child = [];
        }

        if (pLen < 1000) {
            var pushed_vertices_child = new Float64Array(this.pushed_vertices.slice(offset));
            this.box_vertices.push(...pushed_vertices_child);
            pushed_vertices_child = [];
        }
    }

    box_vertex_density(number) {
        this.box_vertex_density_number = Math.abs(Math.round(number));
        if (this.reload_box_functions_bool === true) this.reload_box_functions();
        return this;
    }

    box_width(number) {
        this.box_width_number = Math.abs(number);
        if (this.reload_box_functions_bool === true) this.reload_box_functions();
        return this;
    }

    box_height(number) {
        this.box_height_number = Math.abs(number);
        if (this.reload_box_functions_bool === true) this.reload_box_functions();
        return this;
    }

    box_depth(number) {
        this.box_depth_number = Math.abs(number);
        if (this.reload_box_functions_bool === true) this.reload_box_functions();
        return this;
    }

    get_box_vertex_dimensions(vertex_no) {
        const [x, y, z] = [vertex_no * 3, vertex_no * 3 + 1, vertex_no * 3 + 2];
        return [this.base_vertices[x], this.base_vertices[y], this.base_vertices[z]];
    }

    reload_box_functions() {
        this.box_dimensions_core();
        this.box_vertex_density_core();
        return this;
    }

    getVertexNum(vertex_density_number) {
        return (vertex_density_number - 1) * 36 + 24;
    }
}

// const _box_ = new BoxObject()

// const a = _box_.box_width(24).box_height(12).box_depth(18).box_vertex_density(2).reload_box_functions()

// console.log(a.box_vertices)

const v = [-24, -12, -18, -24, -12, 18, -24,
    12, -18, -24, 12, 18, 24, -12, -18, 24, -12, 18, 24, 12, -18,
    24, 12, 18
]

// v = [-24, -12, -18, -24, -12, 18, -24, 12, -18, -24, 12, 18,
//     24, -12, -18, 24, -12, 18, 24, 12, -18, 24, 12, 18, -24, -12, 0, -24, 0, -18, 0, -12, -18, -24, 0, 18, -24, 12, 0, 0, 12, 18, 0, -12, 18, 24, -12, 0,
//     24, 0, 18, 0, 12, -18, 24, 0, -18, 24, 12, 0
// ]

var pos = 0;
var neg = 0;
var zer = 0;

var pos_v = [];

var neg_v = [];

var zero_v = [];

for (i in v) {

    if (i % 3 === 2) {
        if (v[i] > 0) {
            pos_v[pos] = [v[i - 2], v[i - 1], v[i]];
            pos++;
        }
        if (v[i] < 0) {
            neg_v[neg] = [v[i - 2], v[i - 1], v[i]];
            neg++;
        }
        if (v[i] === 0) {
            zero_v[zer] = [v[i - 2], v[i - 1], v[i]];
            zer++;
        }
    }
}

console.log(pos_v);

console.log(neg_v);

console.log(zero_v)