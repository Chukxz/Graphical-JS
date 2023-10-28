var refArr = [
    [
        [100],
        [150]
    ],
    [
        [110],
        [200]
    ],
    [
        [150],
        [120]
    ],
    [
        [140],
        [190]
    ],
    [
        [130],
        [250]
    ],
    [
        [170],
        [250]
    ]
]

var triangleArr = [
    [
        [
            [32, 55],
            [23, 55],
            [23, 55]
        ]
    ]
]

function findPolygonBoundary(triangles) {
    const edges = {};

    // Step 1: Identify all unique edges

    for (const triangle of triangles) {
        for (let i = 0; i < 3; i++) {
            const edge = [triangle[i], triangle[(i + 1) % 3]];

            edge.sort();
            // Ensure constant edge representation

            const edgeKey = edge.join(',');

            if (edges[edgeKey]) {
                edges[edgeKey]++;
            } else {
                edges[edgeKey] = 1;
            }
        }
    }

    // Step 2: Filter edges that occur only once (boundary edges)

    const boundaryEdges = [];
    for (const edgeKey in edges) {
        if (edges[edgeKey] === 1) {

            boundaryEdges.push(edgeKey.split(',').map(Number));
        }
    }

    return boundaryEdges;
}

console.log(findPolygonBoundary(triangleArr))