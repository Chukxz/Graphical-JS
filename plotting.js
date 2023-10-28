function lineFromPoints(P, Q) {
    //ax
    //by
    //c
    let a = Q[1][0] - P[1][0];
    let b = P[0][0] - Q[0][0];
    let c = a * (P[0][0]) + b * (P[1][0]);
    return [a, b, c]
}

function perpendicularBisectorFromLine(P, Q, a, b, c) {
    let mid_point = [(P[0][0] + Q[0][0]) / 2, (P[1][0] + Q[1][0]) / 2]
        //c = -bx + ay
    c = -b * (mid_point[0]) + a * (mid_point[1]);

    let temp = a;
    a = -b;
    b = temp
    return [a, b, c]
}

function lineLineIntersection(a1, b1, c1, a2, b2, c2) {
    let determinant = (a1 * b2) - (a2 * b1);

    console.log(determinant)

    if (determinant === 0) {
        return [null, null]
    } else {
        let x = ((b2 * c1) - (b1 * c2)) / determinant;
        let y = ((a1 * c2) - (a2 * c1)) / determinant;
        return [x, y]
    }
}

function findCircumcenter(P, Q, R) {
    let PQ_line = lineFromPoints(P, Q);
    let QR_line = lineFromPoints(Q, R);
    let a = PQ_line[0];
    let b = PQ_line[1];
    let c = PQ_line[2];
    let e = QR_line[0];
    let f = QR_line[1];
    let g = QR_line[2];

    let PQ_perpendicular = perpendicularBisectorFromLine(P, Q, a, b, c);
    let QR_perpendicular = perpendicularBisectorFromLine(Q, R, e, f, g);
    a = PQ_perpendicular[0];
    b = PQ_perpendicular[1];
    c = PQ_perpendicular[2];
    e = QR_perpendicular[0];
    f = QR_perpendicular[1];
    g = QR_perpendicular[2];

    let circumCenter = lineLineIntersection(a, b, c, e, f, g)

    if (circumCenter[0] === null && circumCenter[1] === null) {
        return null
    } else {
        let x = circumCenter[0]
        let y = circumCenter[1]

        return [
            [x],
            [y]
        ]
    }
}

// const A = [
//     [6],
//     [0]
// ]
// const B = [
//     [0],
//     [0]
// ]
// const C = [
//     [0],
//     [8]
// ]

const A = [
    [3],
    [2]
]
const B = [
    [1],
    [4]
]
const C = [
    [5],
    [4]
]

console.log(findCircumcenter(B, A, C))