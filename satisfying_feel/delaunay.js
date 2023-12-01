// // // class TriangularMeshDataStructure2D {
// // //     constructor() {
// // //         this.HalfEdgeDict = {};
// // //         this.triangleList = [];
// // //         // this.vert_len = vertex_indexes.length;
// // //         // this.vert_array = vertex_indexes;
// // //         this.triangle = [];
// // //         this.edge_no = 0;
// // //         this.prev = null;
// // //         this.next = null;
// // //         this.temp = null;
// // //         this.face_vertices = [];
// // //     }

// // //     halfEdge(start, end) {
// // //         return {
// // //             vertices: [start, end],
// // //             face_vertices: [],
// // //             twin: null,
// // //             prev: null,
// // //             next: null
// // //         };
// // //     }

// // //     setHalfEdge(a, b) {
// // //         let halfEdgeKey = `${a}-${b}`;
// // //         let twinHalfEdgeKey = `${b}-${a}`;

// // //         if (this.HalfEdgeDict[halfEdgeKey]) {
// // //             const halfEdgeKeyTemp = twinHalfEdgeKey;
// // //             twinHalfEdgeKey = halfEdgeKey;
// // //             halfEdgeKey = halfEdgeKeyTemp;
// // //         }

// // //         if (!this.HalfEdgeDict[halfEdgeKey]) {
// // //             this.HalfEdgeDict[halfEdgeKey] = this.halfEdge(a, b);
// // //             this.edge_no++;
// // //             this.HalfEdgeDict[halfEdgeKey].face_vertices = this.face_vertices;
// // //         }

// // //         if (this.HalfEdgeDict[twinHalfEdgeKey]) {
// // //             this.HalfEdgeDict[halfEdgeKey].twin = twinHalfEdgeKey;
// // //             this.HalfEdgeDict[twinHalfEdgeKey].twin = halfEdgeKey;
// // //             this.edge_no--;
// // //         }

// // //         return halfEdgeKey;
// // //     }

// // //     addtriangle(v1, v2, v3) {
// // //         this.face_vertices = [v1, v2, v3];
// // //         const min = Math.min(v1, v2, v3);
// // //         const max = Math.max(v1, v2, v3);
// // //         var mid = 0;

// // //         for (let i of this.face_vertices) {
// // //             if (i !== min && i !== max) {
// // //                 mid = i;
// // //                 break;
// // //             }
// // //         }

// // //         this.face_vertices = [min, mid, max];

// // //         if (!this.triangleList.includes(`${min}-${mid}-${max}`)) {
// // //             this.triangleList.push(`${min}-${mid}-${max}`);

// // //             for (let i in arguments) {
// // //                 const halfEdgeKey = this.setHalfEdge(arguments[i], arguments[(i + 1) % 3]);
// // //                 const [a, b] = halfEdgeKey.split("-");

// // //                 if (this.temp === null) {
// // //                     this.prev = `${null}-${a}`;
// // //                 } else {
// // //                     this.prev = this.temp;

// // //                     if (this.HalfEdgeDict[this.prev] !== undefined) {
// // //                         this.HalfEdgeDict[this.prev].next = halfEdgeKey;
// // //                     }
// // //                 }

// // //                 this.next = `${b}-null`;

// // //                 this.HalfEdgeDict[halfEdgeKey].prev = this.prev;
// // //                 this.HalfEdgeDict[halfEdgeKey].next = this.next;

// // //                 this.temp = `${a}-${b}`;
// // //             }
// // //         }
// // //     }

// // //     removeTriangle(v1, v2, v3) {
// // //         var face_vertices = [v1, v2, v3];
// // //         const min = Math.min(v1, v2, v3);
// // //         const max = Math.max(v1, v2, v3);
// // //         var mid = 0;

// // //         for (let i of face_vertices) {
// // //             if (i !== min && i !== max) {
// // //                 mid = i;
// // //                 break;
// // //             }
// // //         }

// // //         face_vertices = [min, mid, max];
// // //         const triangle = `${min}-${mid}-${max}`;
// // //         const triangle_index = this.triangleList.indexOf(triangle);

// // //         if (triangle_index >= 0) {
// // //             for (let edge in this.HalfEdgeDict) {
// // //                 var tallies = 0;
// // //                 const half_edge_face_vertices = this.HalfEdgeDict[edge].face_vertices;

// // //                 for (let i = 0; i < 3; i++) {
// // //                     if (half_edge_face_vertices[i] === face_vertices[i]) tallies++;
// // //                 }

// // //                 if (tallies === 3) {
// // //                     const twinHalfEdgeKey = this.HalfEdgeDict[edge].twin;
// // //                     if (!this.HalfEdgeDict[twinHalfEdgeKey]) {
// // //                         this.edge_no--;
// // //                     }
// // //                     delete this.HalfEdgeDict[edge];
// // //                 }
// // //             }

// // //             this.triangleList.splice(triangle_index, 1);
// // //         }
// // //     }

// // //     getTriangleEdges(v1, v2, v3) {
// // //         var face_vertices = [v1, v2, v3];
// // //         const min = Math.min(v1, v2, v3);
// // //         const max = Math.max(v1, v2, v3);
// // //         var mid = 0;
// // //         const edge_list = [];

// // //         for (let i of face_vertices) {
// // //             if (i !== min && i !== max) {
// // //                 mid = i;
// // //                 break;
// // //             }
// // //         }

// // //         face_vertices = [min, mid, max];

// // //         for (let edge in this.HalfEdgeDict) {
// // //             var tallies = 0;
// // //             const half_edge_face_vertices = this.HalfEdgeDict[edge].face_vertices;

// // //             for (let i = 0; i < 3; i++) {
// // //                 if (half_edge_face_vertices[i] === face_vertices[i]) tallies++;
// // //             }

// // //             if (tallies === 3) edge_list.push(edge);
// // //         }

// // //         return edge_list;
// // //     }
// // // }

// // // // const vertex_indexes = [0, 1, 2, 3, 4, 5, 6]

// // // // const setHalfEdge = new SetHalfEdges(vertex_indexes)

// // // // console.log(setHalfEdge.HalfEdgeDict)

// // // const tmesh = new TriangularMeshDataStructure2D()

// // // const start = new Date().getTime();

// // // tmesh.addtriangle(0, 1, 2);
// // // tmesh.removeTriangle(0, 1, 2);
// // // tmesh.addtriangle(0, 2, 3);
// // // tmesh.addtriangle(0, 1, 5);
// // // tmesh.addtriangle(0, 3, 5);
// // // tmesh.addtriangle(1, 5, 6);
// // // tmesh.addtriangle(1, 2, 6);
// // // tmesh.addtriangle(3, 5, 7);
// // // tmesh.addtriangle(5, 6, 7);
// // // tmesh.addtriangle(3, 6, 7);
// // // tmesh.addtriangle(2, 3, 8);
// // // tmesh.addtriangle(3, 6, 8);
// // // tmesh.addtriangle(2, 6, 8);

// // // // tmesh.removeTriangle(0, 2, 3);
// // // // tmesh.removeTriangle(0, 1, 5);
// // // // tmesh.removeTriangle(0, 3, 5);
// // // // tmesh.removeTriangle(1, 5, 6)
// // // // tmesh.removeTriangle(1, 2, 6)

// // // const prune_list = [];

// // // for (let triangle of tmesh.triangleList) {
// // //     const [string_a, string_b, string_c] = triangle.split("-");
// // //     const num_triangle = [Number(string_a), Number(string_b), Number(string_c)];
// // //     for (let num of num_triangle) {
// // //         if (num === 0 || num === 1 || num === 2) {
// // //             prune_list.push(num_triangle);
// // //             break;
// // //         }
// // //     }
// // // }

// // // for (let triangle of prune_list) {
// // //     tmesh.removeTriangle(triangle[0], triangle[1], triangle[2])
// // // }

// // // // console.log(tmesh.getTriangleEdges(0, 2, 1))

// // // // tmesh.removeTriangle(0, 3, 1);


// // // const end = new Date().getTime();


// // // console.log(tmesh.HalfEdgeDict)

// // // console.log(tmesh.edge_no)

// // // console.log(tmesh.triangleList)

// // // console.log(prune_list)

// // // console.log(`Time taken: ${end - start} ms`)

// // // Given three collinear points (x1,y1) , (x2,y2), (x3,y3) the function checks if
// // // point (x2,y2) lies on the line segment (x1,y1) (x3,y3).

// // class Point {
// //     constructor(x, y) {
// //         this.x = x;
// //         this.y = y;
// //     }
// // }

// // function toPoints(pointList) {
// //     const retList = [];
// //     for (let point in pointList) {
// //         retList[point] = new Point(pointList[point][0], pointList[point][1]);
// //     }
// //     return retList
// // }

// // const c = [
// //     [5, 6],
// //     [14, 12],
// //     [23, 13]
// // ];

// // const [p, q, r] = toPoints(c);


// // // Given three collinear points p,q,r, the function checks if
// // // point q lies on line segment "pr"
// // function onSegment(p, q, r) {
// //     if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
// //         q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y))
// //         return true;

// //     return false;

// // }
// // //console.log(onSegment(p, q, r));

// // //To find orientation of ordered triplet (p,q,r),
// // //The function returns the following values
// // // 0 --> p,q and r are collinear
// // // 1 --> Clockwise
// // // 2 --> Counterclockwise
// // function findOrientation(p, q, r) {
// //     const val = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);

// //     if (val === 0) return 0; // collinear

// //     return (val > 0) ? 1 : 2 // clock or counterclock wise
// // }

// // // The main function that returns true if line segment 'p1q1'
// // // and 'p2q2' intersect
// // function doIntersect(p1, q1, p2, q2) {

// //     // Find the four orientations needed for general and 
// //     //special cases
// //     const o1 = findOrientation(p1, q1, p2);
// //     const o2 = findOrientation(p1, q1, q2);
// //     const o3 = findOrientation(p2, q2, p1);
// //     const o4 = findOrientation(p2, q2, q1);

// //     // General Case

// //     if (o1 !== o2 && o3 !== o4) return true;

// //     // Special Cases
// //     // p1,q1 and p2 are collinear and p2 lies on segment p1q1
// //     if (o1 === 0 && onSegment(p1, p2, q1)) return true;

// //     // p1,q1 and q2 are collinear and q2 lies on segment p1q1
// //     if (o2 === 0 && onSegment(p1, q2, q1)) return true;

// //     // p2,q2 and p1 are collinear and p1 lies on segment p2q2
// //     if (o3 === 0 && onSegment(p2, p1, q2)) return true;

// //     // p2,q2 and q1 are collinear and q1 lies on segment p2q2
// //     if (o4 === 0 && onSegment(p2, q1, q2)) return true;

// //     return false; // Doesnt't fall in any of the above cases
// // }

// // let p1 = new Point(1, 1);
// // let q1 = new Point(10, 1);
// // let p2 = new Point(1, 2);
// // let q2 = new Point(10, 2);

// // // console.log(doIntersect(p1, q1, p2, q2));

// // p1 = new Point(10, 1);
// // q1 = new Point(0, 10);
// // p2 = new Point(0, 0);
// // q2 = new Point(10, 10);

// // // console.log(doIntersect(p1, q1, p2, q2));

// // p1 = new Point(-5, -5);
// // q1 = new Point(0, 0);
// // p2 = new Point(1, 1);
// // q2 = new Point(10, 10);

// // // console.log(doIntersect(p1, q1, p2, q2));

// // const points_Set = [
// //     // [23, 29],
// //     // [328, 87],
// //     // [98, 234],
// //     // [892, 382],
// //     // [745, 342],
// //     // [442, 298],
// //     // [232, 450],
// //     // [900, 23],
// //     // [500, 500],
// //     // [573, 18],

// //     [294, 289],
// //     [423, 200],
// //     [234, 234],
// //     [300, 213],
// //     [278, 258],
// //     [352, 331]
// // ]

// // function jarvisConvexHull(points) {
// //     const n = points.length;

// //     if (n < 3) return; // there must be at least three points

// //     let hull = [];

// //     // Find the leftmost point and bottom-most point
// //     let l = 0;
// //     for (let i = 1; i < n; i++) {
// //         if (points[i].x < points[l].x)
// //             l = i;

// //         // For handling leftmost colinear points
// //         else if (points[i].x === points[l].x && points[i].y < points[l].y) {
// //             l = i;
// //         }
// //     }

// //     // Start form leftmost point and keep moving counterclockwise unitll we reach the start point
// //     // again. This loop runs O(h) tiems where h is the number of points in the result or output.

// //     let p = l,
// //         q;

// //     do {
// //         // Add current point to result
// //         hull.push(points[p]);

// //         // Search for a point 'q' such that orientation (p,q,x) is counterclockwise
// //         // for all points 'x'. The idea is to keep track of last visited most counterclock-wise point in q
// //         // If any point 'i' is more counterclock-wise than q, then update q.animate-bg

// //         q = (p + 1) % n;

// //         for (let i = 0; i < n; i++) {
// //             // If i is more counterclockwise than current q, then update p

// //             if (findOrientation(points[p], points[i], points[q]) === 2) q = i;

// //             // HANDLING  COLLINEAR POINTS
// //             // If point q lies in the middle, then also update q

// //             if (p !== i && findOrientation(points[p], points[i], points[q]) === 0 &&
// //                 onSegment(points[p], points[q], points[i])) q = i;
// //         }

// //         // Now q is the most counterclockwise with respect to p. Set p as q for next iteration.
// //         // so that q is added tor result 'hull'
// //         p = q;
// //     } while (p != l); // While we don't come to first point

// //     // // Print Result

// //     // for (let temp of hull.values()) {
// //     //     console.log(`[${temp.x} , ${temp.y}]`);
// //     // }
// //     return hull
// // }

// // const test_points = [
// //     [0, 3],
// //     [2, 3],
// //     [1, 1],
// //     [2, 1],
// //     [3, 0],
// //     [0, 0],
// //     [3, 3]
// // ];

// // const test = [
// //     [2, 2],
// //     [4, 3],
// //     [5, 4],
// //     [0, 3],
// //     [0, 2],
// //     [0, 0],
// //     [2, 1],
// //     [2, 0],
// //     [4, 0]
// // ]

// // const tests = [
// //     [0, 3],
// //     [1, 1],
// //     [2, 2],
// //     [4, 4],
// //     [0, 0],
// //     [1, 2],
// //     [3, 1],
// //     [3, 3]
// // ]

// // // A global point needed for sorting points with reference to the first point
// // let p0 = new Point(0, 0);


// // // A utility function to find next to top in a stack

// // function nextToTop(S) { return S[S.length - 2]; }

// // // A utility function to return square of distance between p1 and p2

// // function distSq(p1, p2) {
// //     return ((p1.x - p2.x) * (p1.x - p2.x) + (p1.y - p2.y) * (p1.y - p2.y));
// // }

// // // A function used by cmp_to_key function to sort an array of points with respect to the first point

// // function compare(p1, p2) {
// //     // Find orientation

// //     let o = findOrientation(p0, p1, p2);

// //     if (o === 0) {
// //         if (distSq(p0, p2) >= distSq(p0, p1)) return -1;
// //         else return 1;
// //     } else {
// //         if (o === 2) return -1;
// //         else return 1;
// //     }
// // }

// // function grahamScanConvexHull(points) {
// //     const n = points.length;

// //     // Find the bottom-most point
// //     let ymin = points[0].y;
// //     let min = 0;

// //     for (var i = 1; i < n; i++) {
// //         let y = points[i].y;

// //         // Pick the bottom-most or choose the left-most in case of tie
// //         if ((y < ymin) || ((ymin === y) && points[i].x < points[min].x)) {
// //             ymin = points[i].y;
// //             min = i;
// //         }
// //     }

// //     // Place the bottom-most point at first position
// //     const tmp = points[0];
// //     points[0] = points[min];
// //     points[min] = tmp;

// //     // Sort n-1 points with respect the the first point.
// //     // A point p1 comes before p2 in sorted output if p2 has larger polar angle
// //     // (in counterclockwise direction) than p1

// //     let p0 = points[0];
// //     points.sort(compare);

// //     // If two or more points make same angle with p0, 
// //     // remove all but the one that is farthest from p0
// //     // Remember that, in above sorting, our criteria was
// //     // to keep the farthest point at the end when more than
// //     // one points have same angle

// //     let m = 1; // Initialize size of modified array

// //     for (var i = 1; i < n; i++) {
// //         // Keep removing i while angle of i and i+1 is same
// //         // with respect to p0
// //         while ((i < n - 1) && (findOrientation(p0, points[i], points[i + 1]) === 0)) i += 1;

// //         points[m] = points[i];
// //         m += 1; // Update size of modified array
// //     }

// //     // If modified array of points has less than 3 points,
// //     // convex hull is not possible

// //     if (m < 3) return;

// //     // Create an empty stack and push first three points to it.animate-bg
// //     let S = [];
// //     S.push(points[0]);
// //     S.push(points[1]);
// //     S.push(points[2]);

// //     // Process remaining n-3 points

// //     for (var i = 3; i < m; i++) {
// //         // Keep removing top while the angle formed by points next-to-top, top, and points[i] makes a non-left turn
// //         while (true) {
// //             if (S.length < 2) break;
// //             if (findOrientation(nextToTop(S), S[S.length - 1], points[i]) >= 2) break;
// //             S.pop();
// //         }

// //         S.push(points[i])
// //     }

// //     // Now stack has output points,
// //     // print contents of stack

// //     while (S.length > 0) {
// //         let p = S[S.length - 1];
// //         console.log(`[${p.x} , ${p.y}]`);
// //         S.pop();
// //     }
// // }



// // // Stores the result (points of convex hull)

// // let hull = new Set();

// // // Returns the side of point p with respect to line joining points p1 and p2

// // function findSide(p1, p2, p) {
// //     let val = (p.y - p1.y) * (p2.x - p1.x) - (p2.y - p1.y) * (p.x - p1.x);

// //     if (val > 0) return 1;
// //     if (val < 0) return -1;
// //     return 0;
// // }

// // // returns a value proportional to the distance between the pont p and the line jointing
// // // the points p1 and p2

// // function lineDist(p1, p2, p) {
// //     return Math.abs((p.y - p1.y) * (p2.x - p1.x) - (p2.y - p1.y) * (p.x - p1.x));
// // }

// // // End points of line L are p1 and p2. Side can have value of 1 or -1
// // // specifying each of the parts made by the line L

// // function quickHull(points, n, p1, p2, side) {
// //     let ind = -1;
// //     let max_dist = 0;

// //     // finding the point with maximum distance from L and also on the specified side of L.
// //     for (let i = 0; i < n; i++) {
// //         let temp = lineDist(p1, p2, points[i]);
// //         if ((findSide(p1, p2, points[i]) === side) && (temp > max_dist)) {
// //             ind = i;
// //             max_dist = temp;
// //         }
// //     }

// //     // If no point is found, add the end points of L to the convex hull.
// //     if (ind === -1) {
// //         hull.add(p1);
// //         hull.add(p2);
// //         return;
// //     }

// //     // Recur for the two parts divided by a[ind]

// //     quickHull(points, n, points[ind], p1, -findSide(points[ind], p1, p2));
// //     quickHull(points, n, points[ind], p2, -findSide(points[ind], p2, p1));
// // }

// // function printHull(points) {
// //     const n = points.length;
// //     if (n < 3) {
// //         console.log("Convex hull not possible");
// //         return;
// //     }

// //     // Finding the point with minimum and maximum x-coordinate

// //     let min_x = 0,
// //         max_x = 0;

// //     for (let i = 1; i < n; i++) {
// //         if (points[i].x < points[min_x].x) min_x = i;
// //         if (points[i].x > points[max_x].x) max_x = i;
// //     }

// //     // Recursively find convex hull points on one side of line joining a[min_x] and a[max_x]
// //     quickHull(points, n, points[min_x], points[max_x], 1);

// //     // Recursively find convex hull points on other side of line joining a[min_x] and a[max_x]
// //     quickHull(points, n, points[min_x], points[max_x], -1);

// //     console.log("Quickhull");
// //     hull.forEach(element => { console.log(`[${element.x} , ${element.y}]`) });
// // }

// // // Method to find convex hull using the divide and conquer algorithm

// // function d_c_convexHull(points) {
// //     if (points.length < 3) return points;

// //     points.sort((a, b) => a.x !== b.x ? a.x - b.x : a.y - b.y);

// //     const upper = [];
// //     const lower = [];

// //     for (const point of points) {
// //         while (upper.length >= 2 && isNotRightTurn(upper[upper.length - 2],
// //                 upper[upper.length - 1], point)) {
// //             upper.pop();
// //         }
// //         upper.push(point);
// //     }

// //     for (let i = points.length - 1; i >= 0; i--) {
// //         const point = points[i];
// //         while (lower.length >= 2 && isNotRightTurn(lower[lower.length - 2],
// //                 lower[lower.length - 1], point)) {
// //             lower.pop();
// //         }
// //         lower.push(point);
// //     }

// //     const hull = new Set([...upper, ...lower]);
// //     return Array.from(hull);
// // }

// // function d_c_print(points) {
// //     const hull = d_c_convexHull(points);
// //     console.log("Divide and Conquer")
// //     for (const point of hull) {
// //         console.log(`[${point.x} , ${point.y}]`);
// //     }
// // }

// // // Function to check the correct direction
// // function isNotRightTurn(a, b, c) {
// //     return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x) <= 0;
// // }

// // // JS implementation of the monotone chain approach

// // function crossProduct(O, A, B) {
// //     return (A.x - O.x) * (B.y - O.y) - (A.y - O.y) * (B.x - O.x);
// // }

// // function monotoneChainConvexHull(points) {
// //     let n = points.length;
// //     let k = 0;

// //     if (n <= 3) return points;

// //     let ans = new Array(2 * n);

// //     // Sort points lexicographically
// //     points.sort((a, b) => {
// //         return a.x < b.x || (a.x === b.x && a.y < b.y);
// //     });

// //     // Build lower hull
// //     for (let i = 0; i < n; ++i) {

// //         // If the point at K-1 position is not a part of hull as vector from ans[k-2]
// //         // to ans[k-1] and ans[k-2] to points[i] has a clockwise turn
// //         while (k >= 2 && crossProduct(ans[k - 2], ans[k - 1], points[i]) <= 0) k--;
// //         ans[k++] = points[i];
// //     }

// //     // Build upper hull
// //     for (let i = n - 1, t = k + 1; i > 0; --i) {

// //         // If the point at K-1 position is not a part of hull as vector from ans[k-2]
// //         // to ans[k-1] and ans[k-2] to points[i] has a clockwise turn
// //         while (k >= t && crossProduct(ans[k - 2], ans[k - 1], points[i - 1]) <= 0) k--;
// //         ans[k++] = points[i - 1];
// //     }

// //     // Resize the array to desired size
// //     ans.length = k - 1;

// //     return ans;
// // }


// // function monotoneprint(points) {
// //     const ans = monotoneChainConvexHull(points);
// //     console.log("Monotone Chain")
// //     for (let i = 0; i < ans.length; i++) {
// //         console.log(`[${ans[i].x} , ${ans[i].y}]`);
// //     }
// // }


// // function genList(min, n, diff, decimal) {
// //     const list = [];
// //     for (let i = 0; i < n; i++) {
// //         if (decimal === true) list[i] = min + Math.random() * diff;
// //         else if (decimal === false) list[i] = Math.round(min + Math.random() * diff);
// //     }
// //     return list;
// // }

// // function generatePointsList(minX = 0, maxX = 100, minY = 0, maxY = 100, n = 10, decimal = false) {
// //     const _minX = Math.min(minX, maxX);
// //     const _maxX = Math.max(minX, maxX);
// //     const _minY = Math.min(minY, maxY);
// //     const _maxY = Math.max(minY, maxY);
// //     const diffX = _maxX - _minX;
// //     const diffY = _maxY - _minY;

// //     const xlist = genList(_minX, n, diffX, decimal);
// //     const ylist = genList(_minX, n, diffY, decimal);

// //     const xylist = [];

// //     for (let i = 0; i < n; i++) {
// //         xylist[i] = [xlist[i], ylist[i]];
// //     }

// //     return xylist;
// // }

// // // For points

// // // const convex_hull = [
// // // [294, 289],
// // // [235, 200],
// // // [234, 234],
// // // [300, 213],
// // // [278, 258],
// // // [352, 331]
// // // ]

// // // const n = 1e7;

// // // const first = new Date().getTime();

// // // for (let i = 0; i < n; i++) {
// // //     jarvisConvexHull(toPoints(points_Set));
// // // }

// // // const second = new Date().getTime();


// // // for (let i = 0; i < n; i++) {
// // //     d_c_convexHull(toPoints(points_Set));
// // // }

// // // const third = new Date().getTime();


// // // console.log(`Time taken To run Jarvis Algorithm at ${n} iterations: ${second - first } ms`);
// // // console.log(`Time taken To run Divide and Conquer Algorithm at ${n} iterations: ${third - second} ms`);

// // const point_num = 1e3;
// // const n = 1e4;
// // const minX = 0;
// // const minY = 0;
// // const maxX = 100;
// // const maxY = 100;

// // const points_ = generatePointsList(minX, maxX, minY, maxY, point_num, false);

// // console.log(points_)
// // console.log(jarvisConvexHull(toPoints(points_Set)))

// // const first = new Date().getTime();

// // for (let i = 0; i < n; i++) {
// //     d_c_convexHull(toPoints(points_));
// // }

// // const second = new Date().getTime();


// // for (let i = 0; i < n; i++) {
// //     jarvisConvexHull(toPoints(points_));

// // }

// // const third = new Date().getTime();

// // console.log(`Minimum value of X: ${minX}\nMaximum value of X: ${maxX}\nMinimum value of Y: ${minY}\nMaximum value of Y: ${maxY}`);
// // console.log(`Time taken To run Jarvis Algorithm with ${point_num} points at ${n} iterations: ${third - second} ms`);
// // console.log(`Time taken To run Divide and Conquer Algorithm with ${point_num} points at ${n} iterations: ${second - first} ms`);


// // // Jarvis --> good
// // // Graham Scan --> bad
// // // Quick Hull --> bad
// // // Divide and Conquer --> good
// // // Monotone Chain --> bad


// // // For points

// // // const convex_hull = [
// // //     [294, 289],
// // //     [423, 200],
// // //     [234, 234],
// // //     [300, 213],
// // //     [278, 258],
// // //     [352, 331]
// // // ]

// // // Jarvis --> good
// // // Graham Scan --> bad
// // // Quick Hull --> bad
// // // Divide and Conquer --> good
// // // Monotone Chain --> bad

// // // JARVIS CONVEX HULL ALGORITHM IS FASTER THAN DIVIDE AND CONQUER ALGORITHM

// const list = [2, 3, 1, 5, 0]

// function genEdgefromList(list) {
//     var prev = list[list.length - 1];

//     const result = [];

//     for (index in list) {
//         const [a, b] = [Math.min(prev, list[index]), Math.max(prev, list[index])];
//         result[index] = `${a}-${b}`;
//         prev = list[index];
//     }

//     return result;
// }

// console.log(genEdgefromList(list))

class BinarySearch {
    recursive(elem, arr, min, max) // min = 0, max = inputArray.length - 1
        {
            if (min > max) return -1;

            else {
                let mid = Math.floor((min + max) / 2);

                if (elem === arr[mid]) return mid;
                else if (elem < arr[mid]) return this.recursive(elem, arr, min, mid - 1);
                else return this.recursive(elem, arr, mid + 1, max);
            }
        }

    iterative(elem, arr) {
        let min = 0;
        let max = arr.length - 1;

        while (min <= max) {
            let mid = Math.floor((min + max) / 2);

            if (elem === arr[mid]) return mid;
            else if (elem < arr[mid]) max = mid - 1;
            else min = mid + 1;
        }

        return -1;
    }
}

const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9];

console.log(new BinarySearch().iterative(1, arr));

console.log(new BinarySearch().recursive(1, arr, 0, arr.length - 1));