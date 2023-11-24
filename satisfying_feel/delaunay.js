class TriangularMeshDataStructure2D {
    constructor() {
        this.HalfEdgeDict = {};
        // this.vert_len = vertex_indexes.length;
        // this.vert_array = vertex_indexes;
        this.triangle = [];
        this.last = null;
        this.edge_no = 0;
        this.prev = null;
        this.next = null;
        this.temp = null;
        this.last_half_edge = null;
        this.face_vertices = [];
    }

    addtriangle(v1, v2, v3) {
        this.face_vertices = [v1, v2, v3];

        for (let i in arguments) {
            const halfEdgeKey = this.setHalfEdge(arguments[i], arguments[(i + 1) % 3]);
            const [a, b] = halfEdgeKey.split("-");

            if (this.temp === null) {
                this.prev = `${null}-${a}`;
            } else {
                this.prev = this.temp;
                this.HalfEdgeDict[this.prev].next = halfEdgeKey
            }

            this.next = `${b}-null`;

            this.HalfEdgeDict[halfEdgeKey].prev = this.prev;
            this.HalfEdgeDict[halfEdgeKey].next = this.next;

            this.temp = `${a}-${b}`;
        }
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

    halfEdge(start, end) {
        return {
            vertices: [start, end],
            face_vertices: [],
            twin: null,
            prev: null,
            next: null
        };
    }

}

// const vertex_indexes = [0, 1, 2, 3, 4, 5, 6]

// const setHalfEdge = new SetHalfEdges(vertex_indexes)

// console.log(setHalfEdge.HalfEdgeDict)

const tmesh = new TriangularMeshDataStructure2D()

tmesh.addtriangle(0, 1, 2)

tmesh.addtriangle(0, 1, 3)

tmesh.addtriangle(3, 2, 5)

console.log(tmesh.HalfEdgeDict)

console.log(tmesh.edge_no)