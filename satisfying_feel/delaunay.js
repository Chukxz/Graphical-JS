class TriangularMeshDataStructure2D {
    constructor() {
        this.HalfEdgeDict = {};
        this.triangleList = [];
        // this.vert_len = vertex_indexes.length;
        // this.vert_array = vertex_indexes;
        this.triangle = [];
        this.edge_no = 0;
        this.prev = null;
        this.next = null;
        this.temp = null;
        this.face_vertices = [];
    }

    halfEdge(start, end) {
        return {
            vertices: [start, end],
            face_vertices: [],
            twin: null,
            prev: null,
            next: null
        };
    }

    setHalfEdge(a, b) {
        let halfEdgeKey = `${a}-${b}`;
        let twinHalfEdgeKey = `${b}-${a}`;

        if (this.HalfEdgeDict[halfEdgeKey]) {
            const halfEdgeKeyTemp = twinHalfEdgeKey;
            twinHalfEdgeKey = halfEdgeKey;
            halfEdgeKey = halfEdgeKeyTemp;
        }

        if (!this.HalfEdgeDict[halfEdgeKey]) {
            this.HalfEdgeDict[halfEdgeKey] = this.halfEdge(a, b);
            this.edge_no++;
            this.HalfEdgeDict[halfEdgeKey].face_vertices = this.face_vertices;
        }

        if (this.HalfEdgeDict[twinHalfEdgeKey]) {
            this.HalfEdgeDict[halfEdgeKey].twin = twinHalfEdgeKey;
            this.HalfEdgeDict[twinHalfEdgeKey].twin = halfEdgeKey;
            this.edge_no--;
        }

        return halfEdgeKey;
    }

    addtriangle(v1, v2, v3) {
        this.face_vertices = [v1, v2, v3];
        const min = Math.min(v1, v2, v3);
        const max = Math.max(v1, v2, v3);
        var mid = 0;

        for (let i of this.face_vertices) {
            if (i !== min && i !== max) {
                mid = i;
                break;
            }
        }

        this.face_vertices = [min, mid, max];

        if (!this.triangleList.includes(`${min}-${mid}-${max}`)) {
            this.triangleList.push(`${min}-${mid}-${max}`);

            for (let i in arguments) {
                const halfEdgeKey = this.setHalfEdge(arguments[i], arguments[(i + 1) % 3]);
                const [a, b] = halfEdgeKey.split("-");

                if (this.temp === null) {
                    this.prev = `${null}-${a}`;
                } else {
                    this.prev = this.temp;

                    if (this.HalfEdgeDict[this.prev] !== undefined) {
                        this.HalfEdgeDict[this.prev].next = halfEdgeKey;
                    }
                }

                this.next = `${b}-null`;

                this.HalfEdgeDict[halfEdgeKey].prev = this.prev;
                this.HalfEdgeDict[halfEdgeKey].next = this.next;

                this.temp = `${a}-${b}`;
            }
        }
    }

    removeTriangle(v1, v2, v3) {
        var face_vertices = [v1, v2, v3];
        const min = Math.min(v1, v2, v3);
        const max = Math.max(v1, v2, v3);
        var mid = 0;

        for (let i of face_vertices) {
            if (i !== min && i !== max) {
                mid = i;
                break;
            }
        }

        face_vertices = [min, mid, max];
        const triangle = `${min}-${mid}-${max}`;
        const triangle_index = this.triangleList.indexOf(triangle);

        if (triangle_index >= 0) {
            for (let edge in this.HalfEdgeDict) {
                var tallies = 0;
                const half_edge_face_vertices = this.HalfEdgeDict[edge].face_vertices;

                for (let i = 0; i < 3; i++) {
                    if (half_edge_face_vertices[i] === face_vertices[i]) tallies++;
                }

                if (tallies === 3) {
                    const twinHalfEdgeKey = this.HalfEdgeDict[edge].twin;
                    if (!this.HalfEdgeDict[twinHalfEdgeKey]) {
                        this.edge_no--;
                    }
                    delete this.HalfEdgeDict[edge];
                }
            }

            this.triangleList.splice(triangle_index, 1);
        }
    }

    getTriangleEdges(v1, v2, v3) {
        var face_vertices = [v1, v2, v3];
        const min = Math.min(v1, v2, v3);
        const max = Math.max(v1, v2, v3);
        var mid = 0;
        const edge_list = [];

        for (let i of face_vertices) {
            if (i !== min && i !== max) {
                mid = i;
                break;
            }
        }

        face_vertices = [min, mid, max];

        for (let edge in this.HalfEdgeDict) {
            var tallies = 0;
            const half_edge_face_vertices = this.HalfEdgeDict[edge].face_vertices;

            for (let i = 0; i < 3; i++) {
                if (half_edge_face_vertices[i] === face_vertices[i]) tallies++;
            }

            if (tallies === 3) edge_list.push(edge);
        }

        return edge_list;
    }
}

// const vertex_indexes = [0, 1, 2, 3, 4, 5, 6]

// const setHalfEdge = new SetHalfEdges(vertex_indexes)

// console.log(setHalfEdge.HalfEdgeDict)

const tmesh = new TriangularMeshDataStructure2D()

const start = new Date().getTime();

tmesh.addtriangle(0, 1, 2);
tmesh.removeTriangle(0, 1, 2);
tmesh.addtriangle(0, 2, 3);
tmesh.addtriangle(0, 1, 5);
tmesh.addtriangle(0, 3, 5);
tmesh.addtriangle(1, 5, 6);
tmesh.addtriangle(1, 2, 6);
tmesh.addtriangle(3, 5, 7);
tmesh.addtriangle(5, 6, 7);
tmesh.addtriangle(3, 6, 7);
tmesh.addtriangle(2, 3, 8);
tmesh.addtriangle(3, 6, 8);
tmesh.addtriangle(2, 6, 8);

// tmesh.removeTriangle(0, 2, 3);
// tmesh.removeTriangle(0, 1, 5);
// tmesh.removeTriangle(0, 3, 5);
// tmesh.removeTriangle(1, 5, 6)
// tmesh.removeTriangle(1, 2, 6)

const prune_list = [];

for (let triangle of tmesh.triangleList) {
    const [string_a, string_b, string_c] = triangle.split("-");
    const num_triangle = [Number(string_a), Number(string_b), Number(string_c)];
    for (let num of num_triangle) {
        if (num === 0 || num === 1 || num === 2) {
            prune_list.push(num_triangle);
            break;
        }
    }
}

for (let triangle of prune_list) {
    tmesh.removeTriangle(triangle[0], triangle[1], triangle[2])
}

// console.log(tmesh.getTriangleEdges(0, 2, 1))

// tmesh.removeTriangle(0, 3, 1);


const end = new Date().getTime();


console.log(tmesh.HalfEdgeDict)

console.log(tmesh.edge_no)

console.log(tmesh.triangleList)

console.log(prune_list)

console.log(`Time taken: ${end - start} ms`)