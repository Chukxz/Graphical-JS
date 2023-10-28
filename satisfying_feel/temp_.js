class Drawlines {
    constructor(basic_m, num) {
        this.basic_m = basic_m;
        this.width = this.basic_m.width;
        this.height = this.basic_m.height;
        this.aspectRatio = this.basic_m.aspect_ratio;
        this.refreshLines(num);
    }

    refreshLines(num) {
        if (this.aspectRatio > 1) {
            console.log(num)
            this.numX = Math.round(num * this.aspectRatio);
            this.numY = num;
        } else {
            this.numX = num;
            this.numY = Math.round(num * (1 / this.aspectRatio));
        }
        this.verList = new Int16Array(this.numX + 1);
        this.horList = new Int16Array(this.numY + 1);
    }

    lineMatrixHorizontal(R, ctx, color, lineWidth) { //the horizontal lines
        let hor = this.numY / R;
        ctx.beginPath();
        ctx.moveTo(0, Math.round(this.height / hor));
        ctx.lineTo(Math.round(this.width), Math.round(this.height / hor));
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        ctx.closePath();

        this.horList[R] = Math.round(this.height / hor);
        return this.horList
    }

    showhorList() {
        return this.horList
    }

    lineMatrixVertical(R, ctx, color, lineWidth) { //the vertical lines
        var ver = this.numX / R;
        ctx.beginPath();
        ctx.moveTo(Math.round(this.width / ver), 0);
        ctx.lineTo(Math.round(this.width / ver), Math.round(this.height));
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.stroke();
        ctx.closePath();

        this.verList[R] = Math.round(this.width / ver);
        return this.verList;
    }

    showverList() {
        return this.verList;
    }

    drawLines(ctx, color, lineWidth) { //draws the vertical and horizontal canvas lines

        for (let R = 0; R <= this.numY; R++) {
            this.lineMatrixHorizontal(R, ctx, color, lineWidth);
        }

        for (let R = 0; R <= this.numX; R++) {
            this.lineMatrixVertical(R, ctx, color, lineWidth);
        }
    }

    getVertices() {
        this.vlen = this.verList.length;
        this.hlen = this.horList.length;
        this.canvas_grid_vert = new Int16Array(this.hlen * this.vlen * 3);
        for (let y = 0; y < this.hlen; y++) {
            for (let x = 0; x < this.vlen; x++) {
                const mult = y * this.vlen * 3 + x * 3;
                this.canvas_grid_vert[mult] = this.verList[x];
                this.canvas_grid_vert[mult + 1] = this.horList[y];
                this.canvas_grid_vert[mult + 3] = 0;
            }
        }
    }

    shadeVertices() {
        this.getVertices();
        const a_third_vert_len = this.canvas_grid_vert.length / 3;
        for (let i = 0; i < a_third_vert_len; i++) {
            ctx.beginPath();
            ctx.fillStyle = 'green';
            ctx.arc(this.canvas_grid_vert[i * 3], this.canvas_grid_vert[i * 3 + 1], 3, 0, 2 * Math.PI, true);
            ctx.fill();
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'black';
            ctx.stroke();
            ctx.closePath();
        }
    }

    hoverVertex(x, y) {
        ctx.beginPath();
        ctx.fillStyle = 'yellow';
        ctx.arc(x, y, 3, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.closePath();
    }

    unhoverVertex(x, y) {
        ctx.beginPath();
        ctx.fillStyle = 'green';
        ctx.arc(x, y, 3, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.closePath();
    }

    selectVertex(x, y) {
        ctx.beginPath();
        ctx.fillStyle = 'brown';
        ctx.arc(x, y, 3, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.closePath();
    }

    unselectVertex(x, y) {
        ctx.beginPath();
        ctx.fillStyle = 'green';
        ctx.arc(x, y, 3, 0, 2 * Math.PI, true);
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'black';
        ctx.stroke();
        ctx.closePath();
    }
}


class Grid extends Drawlines {
    constructor(num = 10) {
        super(num);
        this.drawLines(ctx, 'blue', 2);
        this.shadeVertices();
    }
}
class Select {
    constructor(basic_m) {
        this.basic_m = basic_m

        this.prev_hovered_vertices_array = [];
        this.hovered_vertices_array = [];
        this.pre_selected_vertices_array = [];
        this.selected_vertices_array = [];

        canvas.addEventListener("mousemove", (event) => this.pick(event, hovered));
        canvas.addEventListener("click", (event) => this.pick(event, selected));
        canvas.addEventListener("click", (event) => this.select(event));

        this.basic_m.refresh();
        this.basic_m.setPersProjectParam();
        this.refreshLines(num);
        this.drawLines(ctx, 'blue', 2)
        this.shadeVertices();

        window.addEventListener('resize', {} = () => {
            this.basic_m.refresh();
            this.basic_m.setPersProjectParam();
            this.refreshLines(num);
            this.drawLines(ctx, 'blue', 2)
            this.shadeVertices();

            this.prev_hovered_vertices_array = [];
            this.hovered_vertices_array = [];
            this.pre_selected_vertices_array = [];
            this.selected_vertices_array = [];
        });

        const grid_vert_len = this.canvas_grid_vert.length;
        this.screen_grid_vert = new Int16Array(grid_vert_len);
        this.world_grid_vert = new Float32Array(grid_vert_len);

    }

    validity(x, y) {
        var found = false;
        var s_val = 0;
        const half_len = this.selected_vertices_array.length / 2;

        for (let s = 0; s < half_len; s++) {
            const s_x = this.selected_vertices_array[s * 2];
            const s_y = this.selected_vertices_array[s * 2 + 1];

            if (s_x === x && s_y === y) {
                found = true;
                s_val = s;
            }
        }
        return [found, s_val];
    }

    select(event) {
        const bounding = canvas.getBoundingClientRect();
        const x = event.clientX - bounding.left;
        const y = event.clientY - bounding.top;

        this.pre_selected_vertices_array = this.basic_m.hoveredVertices(x, y, this.canvas_grid_vert, this.vlen, this.hlen, 3, 5);

        const half_selected_vertices_len = this.selected_vertices_array.length / 2;
        const half_pre_selected_vertices_len = this.pre_selected_vertices_array.length / 2;

        for (let p = 0; p < half_pre_selected_vertices_len; p++) {
            const p_x = this.pre_selected_vertices_array[p * 2];
            const p_y = this.pre_selected_vertices_array[p * 2 + 1];

            const [found, s_val] = this.validity(p_x, p_y);

            if (found === true) {
                const first_part = this.selected_vertices_array.slice(0, (s_val * 2));
                const second_part = this.selected_vertices_array.slice((s_val * 2) + 2);
                this.selected_vertices_array = [...first_part, ...second_part];

                this.unselectVertex(p_x, p_y);
                this.pick(event, hovered);
            } else {
                this.selected_vertices_array.push(...[p_x, p_y]);

                this.selectVertex(p_x, p_y);
            }
        }
    }

    pick(event, destination) {
        const bounding = canvas.getBoundingClientRect();
        const x = event.clientX - bounding.left;
        const y = event.clientY - bounding.top;

        const pixel = ctx.getImageData(x, y, 1, 1);
        const data = pixel.data;

        const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
        destination.color.innerHTML = rgba;
        destination.pixel.innerHTML = `(${x},${y})`;

        const prev_half_len = this.prev_hovered_vertices_array.length / 2;

        this.hovered_vertices_array = this.basic_m.hoveredVertices(x, y, this.canvas_grid_vert, this.vlen, this.hlen, 3, 200);
        const half_len = this.hovered_vertices_array.length / 2;

        const half_selected_vertices_len = this.selected_vertices_array.length;

        for (let i = 0; i < prev_half_len; i++) {
            const xval = this.prev_hovered_vertices_array[i * 2];
            const yval = this.prev_hovered_vertices_array[i * 2 + 1];

            const [found, s_val] = this.validity(xval, yval);

            if (found === false) this.unhoverVertex(xval, yval);
        }

        for (let i = 0; i < half_len; i++) {
            const xval = this.hovered_vertices_array[i * 2];
            const yval = this.hovered_vertices_array[i * 2 + 1];

            const [found, s_val] = this.validity(xval, yval);

            if (found === false) this.hoverVertex(xval, yval);
        }

        this.prev_hovered_vertices_array = this.hovered_vertices_array;

        return rgba;
    }
}

var select = new Select(basic_manager);



class ObjectManager {
    constructor() {
        this.objects_dict = {};
    }
    createObject() {}
    registerObject() {}
    deleteObject(object_id) {
        delete this.objects_dict[`${object_id}`];
    }
}

var obj2 = {
    "0": [
        { object_id: 0, object_name: 'Square_Object_0', object_vertices: [2, 5, 3.8] },
    ],
    "1": [
        { object_id: 1, object_name: 'Circle_Object_0', object_vertices: [7, 8, 3.9] }
    ]
}