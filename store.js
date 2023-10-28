function createArrayFromArgs(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        console.log(arguments)
        var args = Array.prototype.slice.call(arguments, 1)
        console.log(args)
        while (i--) {
            arr[length - 1 - i] = createArrayFromArgs.apply(createArrayFromArgs, args)
        }
    }
    return arr
}

function createArrayFromList(param) {
    var arr = new Array(param[0] || 0),
        i = param[0];

    if (param.length > 1) {
        console.log(param)
        var args = Array.prototype.slice.call(param, 1)
        console.log(args)
        while (i--) {
            arr[param[0] - 1 - i] = createArrayFromArgs.apply(createArrayFromArgs, args)
        }
    }
    return arr

}


// var boundRect = inter.getBoundingRect(a, b, c, d, e, f)

// console.log(boundRect)

// var triRect = findCircTriFSq(boundRect)

// var circC = getCircumCircle(triRect.A, triRect.B, triRect.C)

// var inCirc = getInscr(triRect.A, triRect.B, triRect.C)
// console.log(inCirc)

// drawObj.drawCircle(circC.center, 'white', 'black', circC.radius)
// drawObj.drawTriangle(triRect.A, triRect.B, triRect.C, undefined, true, 'white', 'black')
// drawObj.drawCircle(inCirc.center, 'white', 'black', inCirc.radius)

// ctx.beginPath()
// ctx.rect(boundRect[0], boundRect[1], boundRect[2], boundRect[3])
// ctx.strokeStyle = 'red'
// ctx.fillStyle = 'gray'
// ctx.stroke()
// ctx.fill()
// ctx.closePath()

// drawObj.drawVertex(a, 'yellow', 'green')
// drawObj.drawVertex(b, 'red', 'green')
// drawObj.drawVertex(c, 'red', 'green')
// drawObj.drawVertex(d, 'red', 'green')
// drawObj.drawVertex(e, 'red', 'green')
// drawObj.drawVertex(f, 'red', 'green')


// function fac(n) {
//     if (n >= 0) {
//         if (n === 0 || n === 1) {
//             return 1
//         } else return n * fac(n - 1)
//     } else return null
// }

// function permutation(a, b) {
//     if (a >= b && a > 0 && b > 0) {
//         return fac(a) / fac(a - b)
//     } else return null
// }

// function combination(a, b) {
//     if (a >= b && a > 0 && b > 0) {
//         return fac(a) / (fac(a - b) * fac(b))
//     } else return null
// }

// console.log(permutation(4, 3))
// console.log(combination(4, 3))


// function isInsideCirc(point, center, radius) {
//     if (misc.getDist(point, center, [0, 1]) <= radius) {
//         return true
//     } else return false
// }

// function createSuperTriangle(vertices) {
//     const boundRect = inter.getBoundingRectImpl(vertices)
//     const triRect = findCircTriFSq(boundRect)

//     return [triRect.A, triRect.B, triRect.C]
// }

// function isPointInsideCircumcircle(point, P, Q, R) {
//     var cirC = getCircumCircle(P, Q, R)

//     return isInsideCirc(point, cirC.center, circC.radius)
// }

// function findPolygonBoundary(triangles) {
//     const edges = {};

//     // Step 1: Identify all unique edges

//     for (const triangle of triangles) {
//         for (let i = 0; i < 3; i++) {
//             const edge = [triangle[i], triangle[(i + 1) % 3]];

//             edge.sort();
//             // Ensure constant edge representation

//             const vertKey = edge.join(',');

//             if (edges[vertKey]) {
//                 edges[vertKey]++;
//             } else {
//                 edges[vertKey] = 1;
//             }
//         }
//     }

//     // Step 2: Filter edges that occur only once (boundary edges)

//     const boundaryEdges = [];
//     for (const vertKey in edges) {
//         if (edges[vertKey] === 1) {

//             boundaryEdges.push(vertKey.split(',').map(Number));
//         }
//     }

//     return boundaryEdges;
// }

// function delaunayTriangulation(vertices) {
//     // Delaunay triangulation using the Bowyer-Watson algorithm
//     const n = vertices.length

//     const superTriangle = createSuperTriangle(vertices)

//     const triangulation = [
//         [0, 1, 2]
//     ]

//     const vertDict = {}
//     console.log(vertDict)

//     for (let i = 0; i < 3; i++) {
//         vertDict[`${i}`] = `${superTriangle[i][0]}-${superTriangle[i][1]}`
//     }

//     const overall_count = n + 3
//     for (let i = 3; i < overall_count; i++) {
//         vertDict[`${i}`] = `${vertices[i-3][0]}-${vertices[i-3][1]}`
//     }

//     var counter = 3;

//     for (const vertex of vertices) {
//         const badTriangles = []

//         // Find all triangles that are no longer Delaunay due to the new vertex

//         for (const triangle of triangulation) {
//             const A = vertDict[triangle[0]].split("-")
//             const B = vertDict[triangle[1]].split("-")
//             const C = vertDict[triangle[2]].split("-")

//             const P = [
//                 [Number(A[0])],
//                 [Number(A[1])]
//             ]
//             const Q = [
//                 [Number(B[0])],
//                 [Number(B[1])]
//             ]
//             const R = [
//                 [Number(C[0])],
//                 [Number(C[1])]
//             ]

//             if (isPointInsideCircumcircle(vertex, P, Q, R) === true) {
//                 badTriangles.push(triangle)
//             }
//         }

//         // Find the boundary of the polygon formed by bad triangles

//         const polygonBoundary = findPolygonBoundary(badTriangles);

//         // Remove bad triangles from triangulation

//         console.log(triangulation)
//         for (const triangle of badTriangles) {
//             triangulation.splice(triangulation.indexOf(triangle), 1);
//         }

//         // Create new triangles connecting the point to the boundary vertices
//         for (const edge of polygonBoundary) {
//             const newTriangle = [edge[0], edge[1], counter];
//             triangulation.push(newTriangle)
//         }

//         counter++
//     }

//     // Remove triangles that share vertices with the super-triangle and reorder the array indexes
//     return triangulation.filter(triangle => (!
//             triangle.includes(0) &&
//             !
//             triangle.includes(1) &&
//             !
//             triangle.includes(2)))
//         .map(vertexArr => vertexArr.map(vertexVal => vertexVal - 3));
// }

// var refArr = [
//     [
//         [100],
//         [150]
//     ],
//     [
//         [110],
//         [200]
//     ],
//     [
//         [150],
//         [120]
//     ],
//     [
//         [140],
//         [190]
//     ],
//     [
//         [130],
//         [250]
//     ],
//     [
//         [170],
//         [250]
//     ]
// ]

// const arr = delaunayTriangulation(refArr)


// const nu = arr.length

// console.log(arr, nu)

// for (let i = 0; i < nu; i++) {

//     var a = refArr[arr[i][0]]
//     var b = refArr[arr[i][1]]
//     var c = refArr[arr[i][2]]

//     drawObj.drawTriangle(a, b, c, undefined, true, 'green', 'black', true, true);
// }


// console.log(ctx.getImageData(40, 100, 1, 1))

//var indexBuffer = [0, 1, 2, 0, 2, 3, 0, 3, 4, 0, 4, 5, 0, 5, 6, 0, 6, 1, 0]

//var indexBuffer = [0, 1, 2, 0, 2, 3, 0]

const indexBuffer = [0, 1, 2, 3, 1, 0, 2, 1, 3, 0, 3, 2, 1, 0];

class HalfEdge {
    constructor(start, end) {
        this.vertices = [start, end];
        this.face_vertices = null;
        this.twin = null;
        this.prev = null;
        this.next = null;
    }
}

class setHalfEdges {
    constructor(vertex_indexes) {
        this.HalfEdgeDict = {};
        this.vert_len = vertex_indexes.length;
        this.vert_array = vertex_indexes;
        this.triangle = [];
        this.settable = true;
        this.last = null;

        for (let i = 0; i < this.vert_len; i++) {
            this.setHalfEdge(i);
        }

        delete this.HalfEdgeDict[`${this.last}-null`];

        return this;
    }

    setHalfEdge(index) {
        const vert_1 = this.vert_array[index];
        var end = null;
        var prev_start = null;
        var next_end = null;

        if (index - 1 >= 0) {
            prev_start = this.vert_array[index - 1];
        }

        if (index + 1 < this.vert_len) {
            end = this.vert_array[index + 1];
        } else {
            end = null;
        }

        if (index + 2 < this.vert_len) {
            next_end = this.vert_array[index + 2];
        } else {
            next_end = null;
        }

        this.triangle.push(this.vert_array[index]);

        const vert_0 = prev_start
        const vert_2 = end;
        const vert_3 = next_end;

        const halfEdgeKey = `${vert_1}-${vert_2}`;
        const prevHalfEdgeKey = `${vert_0}-${vert_1}`
        const nextHalfEdgeKey = `${vert_2}-${vert_3}`;
        const twinHalfEdgeKey = `${vert_2}-${vert_1}`;


        this.HalfEdgeDict[halfEdgeKey] = new HalfEdge(vert_1, vert_2);

        this.HalfEdgeDict[halfEdgeKey].prev = prevHalfEdgeKey;
        this.HalfEdgeDict[halfEdgeKey].next = nextHalfEdgeKey;

        if (index === this.vert_len - 1) {
            this.last = vert_1;
            end = this.HalfEdgeDict[this.HalfEdgeDict[prevHalfEdgeKey].prev].vertices[0];
            this.HalfEdgeDict[halfEdgeKey].vertices[1] = end;
            this.HalfEdgeDict[halfEdgeKey].next = `${end}-null`;
            this.HalfEdgeDict[`${vert_1}-${end}`] = this.HalfEdgeDict[halfEdgeKey];
        }

        if ((index + 1) % 3 === 0) {
            this.HalfEdgeDict[halfEdgeKey].face_vertices = this.triangle;
            this.HalfEdgeDict[prevHalfEdgeKey].face_vertices = this.triangle;
            this.HalfEdgeDict[this.HalfEdgeDict[prevHalfEdgeKey].prev].face_vertices = this.triangle;
            this.triangle = [];
        }

        if (this.HalfEdgeDict[twinHalfEdgeKey]) {
            this.HalfEdgeDict[halfEdgeKey].twin = twinHalfEdgeKey;
            this.HalfEdgeDict[twinHalfEdgeKey].twin = halfEdgeKey;
        }
    }
}

// const set_half = new setHalfEdges(indexBuffer);
// console.log(set_half.HalfEdgeDict);


function isInsideCirc(point, circle) {
    const x = Math.abs(point[0] - circle[0]);
    const y = Math.abs(point[1] - circle[1]);
    const r = circle[2]

    console.log(x, y, r ** 2)

    if ((x ** 2 + y ** 2) <= r ** 2) {
        return true;
    } else return false
}

const circle = [234, 342, 3]

const point = [235, 384]

console.log(isInsideCirc(point, circle))