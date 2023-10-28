// const pListCache = {}
// const pArgCache = {}

// const canvas = document.getElementsByTagName('canvas')[0]
// const ctx = canvas.getContext('2d')

// "use strict"

// function deepCopy(val) {
//     var res = JSON.parse(JSON.stringify(val))
//     if (typeof(structuredClone) == "function") {
//         res = structuredClone(val)
//     }
//     return res
// }

// function getParamAsList(maxPLen, paramList) { //Function is memoized to increase perfomance
//     if (arguments.length === 2) {
//         const key = `${paramList}-${maxPLen}`

//         if (pListCache[key] !== undefined) {
//             return pListCache[key]
//         }

//         var count = 0
//         var compParamList = []
//         for (let i of paramList) {

//             if (i < maxPLen) {
//                 compParamList[count] = i
//                 count++
//             }
//         }

//         pListCache[key] = compParamList

//         return compParamList
//     }
// }

// function getParamAsArg(maxPLen, ...args) { //Function is memoized to increase perfomance
//     const key = `${args}-${maxPLen}`

//     if (pArgCache[key] !== undefined) {
//         return pArgCache[key]
//     }

//     if (arguments.length > 1 && arguments.length <= 4) {
//         var start = 0
//         var end = maxPLen
//         var interval = 1
//         if (arguments.length === 2) {
//             if (arguments[1] !== undefined) {
//                 end = Math.min(arguments[1], maxPLen)
//             } else {
//                 end = maxPLen
//             }
//         } else {
//             start = arguments[1] || 0
//             if (arguments[1] !== undefined) {
//                 end = Math.min(arguments[2], maxPLen)
//             } else {
//                 end = maxPLen
//             }
//             interval = arguments[3] || 1
//         }

//         var count = 0
//         var index = 0
//         var compParamList = []

//         for (let i = start; i < end; i++) {
//             index = start + (count * interval)

//             if (index < end) {
//                 compParamList[count] = index
//                 count++
//             }
//         }

//         pArgCache[key] = compParamList
//         return compParamList
//     }
// }

// class ArrOp {
//     constructor() {
//         this.inc = -1
//         this.passArr = []
//         this.handedness = 1
//     }

//     setHandedness(value) {
//         if (value === 'left') {
//             this.handedness = -1
//         } else this.handedness = 1 //default
//     }

//     createArrayFromArgs(length) {
//         var arr = new Array(length || 0),
//             i = length;

//         if (arguments.length > 1) {
//             var args = Array.prototype.slice.call(arguments, 1)
//             while (i--) {
//                 arr[length - 1 - i] = this.createArrayFromArgs.apply(this, args)
//             }
//         }
//         return arr
//     }

//     createArrayFromList(param) {
//         var arr = new Array(param[0] || 0),
//             i = param[0];

//         if (param.length > 1) {
//             var args = Array.prototype.slice.call(param, 1)
//             while (i--) {
//                 arr[param[0] - 1 - i] = this.createArrayFromArgs.apply(this, args)
//             }
//         }
//         return arr
//     }

//     modArr(arr) {
//         return [arr]
//     }

//     homoVec(arr) {
//         // Converts the array to a nx1 matrix that is equivalent to a homogenous vector
//         var shape = this.getShape(arr),
//             ret = this.createArrayFromArgs(shape[0] + 1, 1)
//         if (shape.length < 2) {
//             for (let index in arr) {
//                 ret[index] = [arr[index]]
//             }
//             ret[shape[0] - 1][0] = ret[shape[0] - 1][0] * this.handedness
//             ret[shape[0]] = [1]
//             return ret
//         } else {
//             return arr
//         }
//     }

//     toVec(arr) {
//         // Converts the array to a nx1 matrix that is equivalent to a homogenous vector
//         var shape = this.getShape(arr),
//             ret = this.createArrayFromArgs(shape[0], 1)
//         if (shape.length < 2) {
//             for (let index in arr) {
//                 ret[index] = [arr[index]]
//             }
//             ret[shape[0] - 1][0] = ret[shape[0] - 1][0] * this.handedness
//             return ret
//         } else {
//             return arr
//         }
//     }
//     isHomoVec(arr) {
//         //Checks if it is a 1X4 or 4X1 homogenous vector with dimension of 2
//         var testArr = this.getShape(arr)
//         if (
//             (testArr.length === 2) && //Checks if the dimensions of the vector are equal to 2

//             ( // and if it is (case (A) or case (B))

//                 (testArr[0] === 1 && testArr[1] === 4) || //Checks if is a 1X4 matrix  case (A)
//                 (testArr[0] === 4 && testArr[1] === 1) //Checks if is a 4X1 matrix     case (B)
//             )) {
//             return true
//         } else return false
//     }

//     homoVecEqRow(arr1, arr2, n) {
//         //Works for 1xn homogenous vectors
//         var ret = true
//         for (let i = 0; i < n; i++) {
//             if (arr1[0][i] !== arr2[0][i]) {
//                 ret = false
//             }
//         }
//         return ret
//     }

//     homoVecEqCol(arr1, arr2, n) {
//         //Works for nxl homogenous vectors
//         var ret = true
//         for (let i = 0; i < n; i++) {
//             if (arr1[i][0] !== arr2[i][0]) {
//                 ret = false
//             }
//         }
//         return ret
//     }

//     unmodArr(arr) {
//         var shape = this.getShape(arr),
//             ret = this.createArrayFromList(shape)

//         if (shape[0] == 1) {
//             for (let index in arr[0]) {
//                 ret[index] = arr[0][index]
//             }
//             return ret
//         } else if (shape[1] == 1) {
//             for (let index in arr) {
//                 ret[index] = arr[index][0]
//             }
//             return ret
//         } else return arr
//     }
//     retShape(arr) {
//         if (typeof(arr[0]) !== "undefined") {
//             if (arr.length !== "undefined") {
//                 this.inc += 1
//                 this.passArr[this.inc] = arr.length
//                 this.retShape(arr[0])
//             }
//         }
//     }

//     getShape(arr) {
//         this.retShape(arr)
//         var retArr = deepCopy(this.passArr)
//         this.passArr = []
//         this.inc = -1
//         return retArr
//     }
// }

// class TransfMat {
//     constructor(Arrop) {
//         this.Arrop = Arrop
//         this.mode = "deg"
//         this.setObjTransfMat(1, 1, 1, 0, 0, 0, 0, 0, 0) // Default object transformalet  matrix
//         this.handSign = this.Arrop.handedness
//     }

//     isMatrix(matIn) {
//         var shape = this.Arrop.getShape(matIn)

//         if (shape.length <= 2) {
//             return true
//         } else { return false }
//     }

//     changeMode(mode) {
//         this.mode = mode
//         return this
//     }

//     runmode(angle) {
//         if (this.mode === "deg") {
//             return (Math.PI / 180) * angle;
//         } else if (this.mode === "rad") {
//             return angle
//         }
//     }

//     rotMat2d(angle) {
//         angle = this.runmode(angle)
//         return [
//             [Math.cos(angle), -Math.sin(angle), 0],
//             [Math.sin(angle), Math.cos(angle, 0), 0]
//         ]
//     }

//     // Pitch
//     rotX(angle) {
//         angle = this.runmode(angle)
//         return [
//             [1, 0, 0, 0],
//             [0, Math.cos(angle), -Math.sin(angle) * this.handSign, 0],
//             [0, Math.sin(angle) * this.handSign, Math.cos(angle), 0],
//             [0, 0, 0, 1]
//         ]
//     }

//     // Yaw
//     rotY(angle) {
//         angle = this.runmode(angle)
//         return [
//             [Math.cos(angle), 0, Math.sin(angle) * this.handSign, 0],
//             [0, 1, 0, 0],
//             [-Math.sin(angle) * this.handSign, 0, Math.cos(angle), 0],
//             [0, 0, 0, 1]
//         ]
//     }

//     //Roll
//     rotZ(angle) {
//         angle = this.runmode(angle)
//         return [
//             [Math.cos(angle), -Math.sin(angle) * this.handSign, 0, 0],
//             [Math.sin(angle) * this.handSign, Math.cos(angle), 0, 0],
//             [0, 0, 1, 0],
//             [0, 0, 0, 1]
//         ]
//     }

//     rot3d(x, y, z) {
//         return this.matMult(this.rotZ(z), this.matMult(this.rotY(y), this.rotX(x)))
//     }

//     translMat2d(x, y) {
//         return [
//             [1, 0, x],
//             [0, 1, y],
//             [0, 0, 1]
//         ]
//     }

//     transl3d(x, y, z) {
//         return [
//             [1, 0, 0, x],
//             [0, 1, 0, y],
//             [0, 0, 1, z],
//             [0, 0, 0, 1]
//         ]
//     }

//     scale3dim(x, y, z) {
//         return [
//             [x, 0, 0, 0],
//             [0, y, 0, 0],
//             [0, 0, z, 0],
//             [0, 0, 0, 1]
//         ]
//     }

//     refMat2d(param) {
//         if (param == "x") {
//             return [
//                 [1, 0, 0],
//                 [0, -1, 0],
//                 [0, 0, 1]
//             ]
//         }
//         if (param == "y") {
//             return [
//                 [-1, 0, 0],
//                 [0, 1, 0],
//                 [0, 0, 1]
//             ]
//         }
//         if (param == "y=x") {
//             return [
//                 [0, 1, 0],
//                 [1, 0, 0],
//                 [0, 0, 1]
//             ]
//         }
//         if (param == "y=-x") {
//             return [
//                 [0, -1, 0],
//                 [-1, 0, 0],
//                 [0, 0, 1]
//             ]
//         }
//         if (param == "o") {
//             return [
//                 [-1, 0, 0],
//                 [0, -1, 0],
//                 [0, 0, 1]
//             ]
//         } else return [
//             [1, 0, 0],
//             [0, 1, 0],
//             [0, 0, 1]
//         ]
//     }

//     scaleMat2d(x, y) {
//         return [
//             [x, 0, 0],
//             [0, y, 0],
//             [0, 0, 1]
//         ]
//     }

//     shearMat(angle, x, y) {
//         angle = this.runmode(angle)
//         return [
//             [1, Math.tan(angle), 0],
//             [Math.tan(angle), 1, 0],
//             [0, 0, 1]
//         ]
//     }

//     setObjTransfMat(Sx, Sy, Sz, Rx, Ry, Rz, Tx, Ty, Tz) {
//         // None of the scale parameters should equal zero as that would make the determinant of the matrix
//         // equal to zero, thereby making it impossible to get the inverse of the matrix (Zero Division Error)
//         if (Sx === 0) {
//             Sx += 0.01
//         }
//         if (Sy === 0) {
//             Sy += 0.01
//         }
//         if (Sz === 0) {
//             Sz += 0.01
//         }
//         this.objTransfMat = this.matMult(this.transl3d(Tx, Ty, Tz), this.matMult(this.rot3d(Rx, Ry, Rz), this.scale3dim(Sx, Sy, Sz)))
//     }

//     matMult(matA, matB) {
//         // Checks if both are matrices
//         if (this.isMatrix(matA) && this.isMatrix(matB)) {
//             var shapeA = this.Arrop.getShape(matA),
//                 shapeB = this.Arrop.getShape(matB),
//                 matC = this.Arrop.createArrayFromArgs(shapeA[0], shapeB[1])

//             // Checks if both matrices are of the form:let  and rxn
//             if ((shapeA[1] == shapeB[0]) && shapeA[1] > 0) {
//                 for (let i = 0; i < shapeA[0]; i++) {
//                     for (let j = 0; j < shapeB[1]; j++) {
//                         var sum = 0
//                         for (let k = 0; k < shapeB[0]; k++) {
//                             sum += matA[i][k] * matB[k][j]
//                         }
//                         matC[i][j] = sum
//                     }
//                 }
//             }
//             return matC
//         } else return []
//     }

//     scaMult(scalarVal, matIn, leaveLast = false) {
//         // Checks if the 'input matrix' is actually a matrix
//         if (this.isMatrix(matIn)) {
//             var shape = this.Arrop.getShape(matIn),
//                 matOut = deepCopy(matIn)
//             for (let i = 0; i < shape[0]; i++) {
//                 for (let j = 0; j < shape[1]; j++) {
//                     if (i === shape[0] - 1 && j === shape[1] - 1 && leaveLast === true) {
//                         // Do nothing...don't multiply the last matrix value by the scalar value
//                         // useful when perspective divide is going on.
//                     } else {
//                         matOut[i][j] = matOut[i][j] * scalarVal
//                         if (matOut[i][j] === 0) {
//                             matOut[i][j] = Math.abs(matOut[i][j])
//                         }
//                     }
//                 }
//             }
//             return matOut
//         } else return []
//     }

//     addSub(matA, matB) {
//         // Checks if both are matrices
//         if (this.isMatrix(matA) && this.isMatrix(matB)) {
//             var shapeA = this.Arrop.getShape(matA),
//                 shapeB = this.Arrop.getShape(matB),
//                 res = true

//             // Checks if both matrices have the same size
//             for (let i in shapeA) {
//                 if (shapeA[i] !== shapeB[i]) {
//                     res = false
//                 }
//             }

//             if (res === true) {
//                 var matC = this.Arrop.createArrayFromList(shapeA)
//                 for (let i = 0; i < shapeA[0]; i++) {
//                     for (let j = 0; j < shapeB[1]; j++) {
//                         matC[i][j] = matA[i][j] + matB[i][j]
//                     }
//                 }
//                 return matC
//             } else return []

//         } else return []
//     }

//     verifySquare(matIn) {
//         //Checks if it is a matrix
//         if (this.isMatrix(matIn)) {
//             var shapeMat = this.Arrop.getShape(matIn)
//                 // Checks if it is a square matrix
//             if (shapeMat[0] === shapeMat[1]) {
//                 return true
//             } else return false
//         } else return false
//     }

//     transposeMat(matIn) {
//         //Check if it is a matrix
//         if (this.isMatrix(matIn)) {
//             var shapeMat = this.Arrop.getShape(matIn),
//                 matOut = this.Arrop.createArrayFromArgs(shapeMat[1], shapeMat[0])

//             for (let i = 0; i < shapeMat[0]; i++) {
//                 for (let j = 0; j < shapeMat[1]; j++) {
//                     matOut[j][i] = matIn[i][j]
//                 }
//             }
//             return matOut
//         } else return []
//     }

//     identityMat(val) {
//         var num = 0
//         if (typeof(val) === "object") {
//             //Checks if it is a square matrix
//             if (this.verifySquare(val) === true) {
//                 num = this.Arrop.getShape(val)[0]
//             } else return []
//         } else {
//             num = val
//         }
//         var idMat = this.Arrop.createArrayFromArgs(num, num),
//             counter = 0

//         for (let i = 0; i < num; i++) {
//             for (let j = 0; j < num; j++) {
//                 if (j === counter) {
//                     idMat[i][j] = 1
//                 } else {
//                     idMat[i][j] = 0
//                 }
//             }
//             counter++
//         }
//         return idMat
//     }

//     getRest(matIn, shape, a, b) {
//         //Checks if it is a matrix
//         if (this.verifySquare(matIn)) {
//             var resMat = this.Arrop.createArrayFromArgs(shape - 1, shape - 1)
//             if (a < shape && b < shape) {
//                 for (let i in matIn) {
//                     for (let j in matIn) {
//                         if (Number(i) !== a && Number(j) !== b) {
//                             var x = i,
//                                 y = j

//                             if (i > a) {
//                                 x = i - 1
//                             }

//                             if (j > b) {
//                                 y = j - 1
//                             }
//                             resMat[x][y] = matIn[i][j]
//                         }
//                     }
//                 }
//                 return resMat
//             } else return []
//         } else return []
//     }

//     getDet(matIn, mode = "row", index = 0) {
//         //Checks if it is a matrix and verify if it is a square matrix
//         if (this.verifySquare(matIn)) {
//             var shapeMat = this.Arrop.getShape(matIn)
//             if (index < shapeMat[0]) {
//                 // If it is a 1x1 matrix, return the matrix
//                 if (shapeMat[0] === 1) {
//                     return matIn
//                 }
//                 // If it is a 2x2 matrix, return the determinant
//                 if (shapeMat[0] === 2) {
//                     return ((matIn[0][0] * matIn[1][1]) - (matIn[0][1] * matIn[1][0]))
//                 }
//                 // If it an nxn matrix, where n > 2, recursive compute the determinant,
//                 //using the first row of the matrix
//                 else {
//                     var res = 0,
//                         cofMatSgn = this.getCofSgn(matIn),
//                         storeCof = this.Arrop.createArrayFromArgs(shapeMat[0], 1),
//                         tmp = this.Arrop.createArrayFromArgs(shapeMat[0], 1),
//                         a = 0,
//                         b = 0

//                     if (mode === "column") {
//                         b = index
//                         for (let i in matIn) {
//                             tmp[i] = matIn[i][index]
//                             storeCof[i] = cofMatSgn[i][index]
//                         }
//                         for (let i in cofMatSgn) {
//                             var ret = this.getRest(matIn, shapeMat[0], Number(i), b)
//                             res += (storeCof[i] * tmp[i] * this.getDet(ret, mode, index))
//                         }
//                     } else {
//                         a = index
//                         tmp = matIn[index]
//                         storeCof = cofMatSgn[index]
//                         for (let i in cofMatSgn) {
//                             var ret = this.getRest(matIn, shapeMat[0], a, Number(i))
//                             res += (storeCof[i] * tmp[i] * this.getDet(ret, mode, index))
//                         }
//                     }
//                     return res
//                 }
//             } else return []
//         } else return []
//     }

//     getMinor(matIn) {
//         //Checks if it is a matrix and verify if it is a square matrix
//         if (this.verifySquare(matIn)) {
//             var shapeMat = this.Arrop.getShape(matIn),
//                 matOut = this.Arrop.createArrayFromList(shapeMat)

//             for (let i = 0; i < shapeMat[0]; i++) {
//                 for (let j = 0; j < shapeMat[1]; j++) {
//                     matOut[i][j] = this.getDet(this.getRest(matIn, shapeMat[0], i, j))
//                 }
//             }
//             return matOut
//         } else return []
//     }

//     getCofSgn(matIn) {
//         //Checks if it is a matrix
//         if (this.isMatrix(matIn)) {
//             var shapeMat = this.Arrop.getShape(matIn),
//                 matOut = this.Arrop.createArrayFromList(shapeMat)

//             for (let i = 0; i < shapeMat[0]; i++) {
//                 for (let j = 0; j < shapeMat[1]; j++) {
//                     if ((i + j) % 2 === 0) {
//                         matOut[i][j] = 1
//                     } else {
//                         matOut[i][j] = -1
//                     }
//                 }
//             }
//             return matOut
//         } else return []
//     }

//     getCof(matIn) {
//         //Checks if it is a matrix and verify if it is a square matrix
//         if (this.verifySquare(matIn)) {
//             var shapeMat = this.Arrop.getShape(matIn),
//                 matOut = this.Arrop.createArrayFromList(shapeMat),
//                 cofMatSgn = this.getCofSgn(matIn),
//                 minorMat = this.getMinor(matIn)

//             for (let i = 0; i < shapeMat[0]; i++) {
//                 for (let j = 0; j < shapeMat[1]; j++) {
//                     matOut[i][j] = cofMatSgn[i][j] * minorMat[i][j]
//                 }
//             }
//             return matOut
//         } else return []
//     }

//     getAdj(matIn) {
//         return this.transposeMat(this.getCof(matIn))
//     }

//     getInvMat(matIn) {
//         return this.scaMult(1 / (this.getDet(matIn)), this.getAdj(matIn))
//     }
// }

// function getSlope(A, B) {
//     var numer = B[0][0] - A[0][0]
//     var denum = B[1][0] - A[1][0]

//     return numer / denum
// }

// function getMid(a, b, paramList) {
//     var ret = arrOp.createArrayFromArgs(2, 1)
//     var count = 0
//     for (let val of paramList) {
//         ret[count][0] = (a[val][0] + b[val][0]) / 2
//         count++
//     }
//     return ret
// }

// function getDist(a, b, paramList) {
//     var ret = 0
//     for (let val of paramList) {
//         ret += (a[val][0] - b[val][0]) ** 2
//     }
//     return Math.sqrt(ret)
// }

// function mag(vec, len = null) {
//     //verify first that it is a vector
//     var
//         shape = arrOp.getShape(vec),
//         sLen = shape.length,
//         valid = false

//     if (shape[1] === 1 && shape[0] > 1) {
//         valid = true
//     }

//     if (sLen === 2 && valid === true) {
//         var magnitude = 0

//         if (typeof(len) === "number") {
//             if (len <= shape[0]) {
//                 shape[0] = len
//             }
//         }

//         for (let i = 0; i < shape[0]; i++) {
//             magnitude += vec[i][0] ** 2
//         }
//         return Math.sqrt(magnitude)
//     } else return null
// }

// function normalizeVec(vec, len = null) {
//     var magnitude = mag(vec, len)

//     if (typeof(magnitude) === "number") {
//         if (typeof(len) === "number") {
//             var ret = arrOp.createArrayFromArgs(len, 1)
//             for (let i = 0; i < len; i++) {
//                 ret[i][0] = vec[i][0]
//             }
//         } else {
//             var ret = vec
//         }
//         return trans.scaMult(1 / magnitude, ret)
//     } else return null
// }

// function dotProduct(deg = null, len = null, ...vecs) {
//     return runDotProduct(deg, len, vecs)
// }

// function runDotProduct(deg = null, len = null, vecs) {
//     //verify first that both vectors are of the same size
//     var
//         fshapeMat = arrOp.getShape(vecs[0]),
//         fsLen = fshapeMat.length,
//         valid = false,
//         offset = 0,
//         numValid = 0

//     if (typeof(len) === "number") {
//         if (len <= fshapeMat[0]) {
//             offset = fshapeMat[0] - len
//         }
//     }

//     fshapeMat[0] = fshapeMat[0] - offset

//     if (fsLen === 2 && fshapeMat[1] === 1 && vecs.length > 1) {
//         for (let i = 0; i < vecs.length; i++) {
//             let shapeMat = arrOp.getShape(vecs[i]),
//                 sLen = shapeMat.length

//             shapeMat[0] = shapeMat[0] - offset

//             if (shapeMat[0] === fshapeMat[0] && shapeMat[1] === fshapeMat[1] && sLen === 2) {
//                 numValid += 1
//             } else {
//                 numValid -= 1
//             }
//         }

//         if (numValid === vecs.length) {
//             valid = true
//         }

//         if (valid === true) {
//             if (typeof(deg) === "number") {
//                 var magnitude = 1,
//                     degToRad = (deg * Math.PI) / 180,
//                     cosAng = Math.cos(degToRad)
//                 for (let i = 0; i < vecN; i++) {
//                     magnitude *= mag(vecs[i], fshapeMat[0])
//                 }
//                 return magnitude * cosAng
//             } else {
//                 var ret = 0,
//                     cRet = 1
//                 for (let i = 0; i < fshapeMat[0]; i++) {
//                     for (let j = 0; j < vecs.length; j++) {
//                         cRet *= vecs[j][i][0]
//                     }
//                     ret += cRet
//                     cRet = 1
//                 }
//                 return ret
//             }
//         } else return null
//     } else return null
// }

// function getDotPAngle(len = null, ...vecs) {
//     var
//         dotP = runDotProduct(null, len, vecs),
//         magRes = 1

//     for (let i in vecs) {
//         magRes *= mag(vecs[i], len)
//     }

//     if (typeof(dotP) === "number") {
//         var cosAng = Math.asin(dotP / magRes)

//         return (cosAng * 180) / Math.PI
//     } else return null
// }

// function getCrossPVec(shape, vecN, ...vecs) {
//     //Checks if it is a matrix and verify if it is a square matrix
//     var matIn = trans.identityMat(shape)
//     if (trans.verifySquare(matIn)) {
//         for (let i = 0; i < vecN; i++) {
//             for (let j = 0; j < shape; j++) {
//                 matIn[i + 1][j] = vecs[0][i][j][0]
//             }
//         }

//         var
//             vecOut = arrOp.createArrayFromArgs(shape, 1),
//             cofMatSgn = trans.getCofSgn(matIn),
//             storeCof = cofMatSgn[0],
//             a = 0

//         for (let i in cofMatSgn) {
//             var ret = trans.getRest(matIn, shape, a, Number(i))
//             vecOut[i][0] = (storeCof[i] * trans.getDet(ret))
//         }
//         return vecOut
//     } else return null
// }

// function crossProduct(deg = null, len = null, ...vecs) {
//     return runCrossProduct(deg, len, vecs)
// }

// function runCrossProduct(deg = null, len = null, vecs) {
//     //verify first that both vectors are of the same size
//     var
//         fshapeMat = arrOp.getShape(vecs[0]),
//         vecN = fshapeMat[0] - 1,
//         fsLen = fshapeMat.length,
//         valid = false,
//         offset = 0,
//         numValid = 0

//     if (typeof(len) === "number") {
//         if (len <= fshapeMat[0]) {
//             offset = fshapeMat[0] - len
//         }
//     }

//     vecN = vecN - offset
//     fshapeMat[0] = fshapeMat[0] - offset

//     if (fsLen === 2 && fshapeMat[1] === 1 && vecN === fshapeMat[0] - 1 && vecs.length > 1 && vecs.length - fshapeMat[0] >= -1) {

//         for (let i = 0; i < vecN; i++) {
//             let shapeMat = arrOp.getShape(vecs[i]),
//                 sLen = shapeMat.length

//             shapeMat[0] = shapeMat[0] - offset

//             if (shapeMat[0] === fshapeMat[0] && shapeMat[1] === fshapeMat[1] && sLen === 2) {
//                 numValid += 1
//             } else {
//                 numValid -= 1
//             }
//         }

//         if (numValid === vecN) {
//             valid = true
//         }

//         if (fshapeMat[0] <= 2) {
//             valid = false
//         }

//         if (valid === true) {
//             if (typeof(deg) === "number") {
//                 var magnitude = 1,
//                     degToRad = (deg * Math.PI) / 180,
//                     sinAng = Math.sin(degToRad),
//                     unitVec = runGetCrossPUnitVec(len, vecs)
//                 for (let i = 0; i < vecN; i++) {
//                     magnitude *= mag(vecs[i], fshapeMat[0])
//                 }
//                 return trans.scaMult((magnitude * sinAng), unitVec)
//             } else {
//                 return getCrossPVec(fshapeMat[0], vecN, vecs)
//             }
//         } else return null
//     } else return null
// }

// function getCrossPAngle(len = null, ...vecs) {
//     var
//         crossP = runCrossProduct(null, len, vecs),
//         magRes = 1

//     for (let i in vecs) {
//         magRes *= mag(vecs[i], len) ** 2
//     }

//     if (typeof(crossP) === "object") {
//         var
//             crossPSq = dotProduct(null, len, crossP, crossP),
//             sinSqAng = crossPSq / magRes,
//             sinAng = Math.asin(Math.sqrt(sinSqAng))
//     }
// }

// var
//     arrOp = new ArrOp,
//     trans = new TransfMat(arrOp)

// var
//     a = [
//         [250.52798765537523],
//         [302.9501845162228],
//         [0.9694142661073207],
//         [3.97773450748606]
//     ],
//     b = [
//         [323.7119631794937],
//         [308.8247425773536],
//         [0.9692329989055107],
//         [3.9635880164337642]
//     ],
//     c = [
//         [339.16845861891306],
//         [360.5045387407569],
//         [0.9676383509433708],
//         [3.8433428424892506]
//     ],

//     p = [
//         [296.2309276563426],
//         [317.7156289648811],
//         [0.968958658932987],
//         [3.942368279855321]
//     ]

// function getParamAsList(maxPLen, paramList) { //Function is memoized to increase perfomance
//     if (arguments.length === 2) {
//         const key = `${paramList}-${maxPLen}`

//         if (pListCache[key] !== undefined) {
//             return pListCache[key]
//         }

//         var count = 0
//         var compParamList = []
//         for (let i of paramList) {

//             if (i < maxPLen) {
//                 compParamList[count] = i
//                 count++
//             }
//         }

//         pListCache[key] = compParamList

//         return compParamList
//     }
// }

// function getParamAsArg(maxPLen, ...args) { //Function is memoized to increase perfomance
//     const key = `${args}-${maxPLen}`

//     if (pArgCache[key] !== undefined) {
//         return pArgCache[key]
//     }

//     if (arguments.length > 1 && arguments.length <= 4) {
//         var start = 0
//         var end = maxPLen
//         var interval = 1
//         if (arguments.length === 2) {
//             if (arguments[1] !== undefined) {
//                 end = Math.min(arguments[1], maxPLen)
//             } else {
//                 end = maxPLen
//             }
//         } else {
//             start = arguments[1] || 0
//             if (arguments[1] !== undefined) {
//                 end = Math.min(arguments[2], maxPLen)
//             } else {
//                 end = maxPLen
//             }
//             interval = arguments[3] || 1
//         }

//         var count = 0
//         var index = 0
//         var compParamList = []

//         for (let i = start; i < end; i++) {
//             index = start + (count * interval)

//             if (index < end) {
//                 compParamList[count] = index
//                 count++
//             }
//         }

//         pArgCache[key] = compParamList
//         return compParamList
//     }
// }

// function getDist(a, b, paramList) {
//     var ret = 0
//     for (let val of paramList) {
//         ret += (a[val][0] - b[val][0]) ** 2
//     }
//     return Math.sqrt(ret)
// }

// function triArea(a, b, c) {
//     var S = (a + b + c) / 2
//     return Math.sqrt(S * (S - a) * (S - b) * (S - c))
// }

// function isInsideTri(pvec, avec, bvec, cvec, dim = 2) {
//     //MaxParamLength is assumed to be 4, since each input vector is assumed to be a 4X1 homogenous matrix

//     const
//         indexList = getParamAsArg(4, dim),

//         Adist = getDist(bvec, cvec, indexList),
//         Bdist = getDist(avec, cvec, indexList),
//         Cdist = getDist(avec, bvec, indexList),

//         apdist = getDist(pvec, avec, indexList),
//         bpdist = getDist(pvec, bvec, indexList),
//         cpdist = getDist(pvec, cvec, indexList),
//         TotalArea = triArea(Adist, Bdist, Cdist),

//         triA = triArea(Adist, bpdist, cpdist),
//         triB = triArea(Bdist, apdist, cpdist),
//         triC = triArea(Cdist, apdist, bpdist),

//         sum = triA + triB + triC

//     if (Math.round(sum) === Math.round(TotalArea)) {
//         return true
//     }
//     return false
// }


// function interpolateTri(pvec, avec, bvec, cvec, dim = 2) {
//     //MaxParamLength is assumed to be 4, since each input vector is assumed to be a 4X1 homogenous matrix

//     const
//         indexList = getParamAsArg(4, dim),

//         Adist = getDist(bvec, cvec, indexList),
//         Bdist = getDist(avec, cvec, indexList),
//         Cdist = getDist(avec, bvec, indexList),

//         apdist = getDist(pvec, avec, indexList),
//         bpdist = getDist(pvec, bvec, indexList),
//         cpdist = getDist(pvec, cvec, indexList),

//         TotalArea = triArea(Adist, Bdist, Cdist),
//         triA = triArea(Adist, bpdist, cpdist),
//         triB = triArea(Bdist, apdist, cpdist),
//         triC = triArea(Cdist, apdist, bpdist),

//         a = triA / TotalArea,
//         b = triB / TotalArea,
//         c = triC / TotalArea,

//         aPa = trans.scaMult(a, avec),
//         bPb = trans.scaMult(b, bvec),
//         cPc = trans.scaMult(c, cvec)

//     return trans.addSub(trans.addSub(aPa, bPb), cPc)
// }


// var
//     a = [
//         [4],
//         [5],
//         [6],
//         [1.5]
//     ],
//     b = [
//         [5],
//         [6],
//         [7],
//         [-1.4]
//     ],
//     c = [
//         [-2],
//         [-3],
//         [-4],
//         [2.6]
//     ],
//     p = [
//         [1],
//         [5],
//         [-3],
//         [1]
//     ]

// function getTriCentroid(vecA, vecB, vecC, len = null) {
//     //verify first that both vectors are of the same size
//     var
//         shapeA = arrOp.getShape(vecA),
//         shapeB = arrOp.getShape(vecB),
//         shapeC = arrOp.getShape(vecC),
//         sLenA = shapeA.length,
//         sLenB = shapeB.length,
//         sLenC = shapeC.length,
//         valid = false,
//         centroid

//     if (shapeA[1] === 1 && shapeB[1] === 1 && shapeC[1] === 1 && (shapeA[0] === shapeB[0] && shapeB[0] === shapeC[0]) && shapeA[0] > 1) {
//         valid = true
//     }

//     if ((sLenA === sLenB) && (sLenB === sLenC) && (sLenB === 2) && valid === true) {

//         if (typeof(len) === "number") {
//             shapeA[0] = len
//         }

//         centroid = arrOp.createArrayFromList(shapeA)

//         for (let i = 0; i < shapeA[0]; i++) {
//             centroid[i][0] = (vecA[i][0] + vecB[i][0] + vecC[i][0]) / 3
//         }
//         return centroid
//     }
//     return null
// }


// var
//     x = [
//         [3],
//         [9],
//         [2],
//         [2]
//     ],
//     y = [
//         [5],
//         [2],
//         [7],
//         [2]
//     ],
//     z = [
//         [6],
//         [8],
//         [3],
//         [3]
//     ],
//     m = [
//         [19, 22, 93],
//         [41, 52, 71],
//         [47, 28, 69]
//     ],
//     crossP = [
//         [0],
//         [-12],
//         [16]
//     ]

// // console.log(dotProduct(null, 2, x, y))

// // console.log(crossProduct(null, 3, y, x, z))


// // let n = crossProduct(null, 3, x, y)

// // console.log(n)

// // let o = getCrossPAngle(3, x, y)

// // console.log(o)

// // console.log(getCrossPUnitVec(3, x, y))

// // console.log(crossProduct(o, 3, x, y))
// // console.log(dotProduct(null, 3, x, y))

// // var ang = getDotPAngle(3, x, y)

// // console.log(ang)

// // console.log(dotProduct(ang, 3, x, y))


// var vertexBuffer = [
//     [
//         [10, 20, 1],
//         [255, 0, 0, 255]
//     ],
//     [
//         [30, 310, 1],
//         [0, 255, 0, 255]
//     ],
//     [
//         [200, 100, 1],
//         [0, 0, 255, 255]
//     ]
// ]

// var vert1 = vertexBuffer[0][0],
//     vert2 = vertexBuffer[1][0],
//     vert3 = vertexBuffer[2][0]

// cA = crossProduct(null, 3, arrOp.homoVec(vert1), arrOp.homoVec(vert2))
// cB = crossProduct(null, 3, arrOp.homoVec(vert3), arrOp.homoVec(vert2))

// console.log(cA)
// console.log(cB)

// console.log(mag(cA))
// console.log(mag(cB))

// var proj = [
//     [0.5487804878048782, 0, 0, 0],
//     [0, 1.0000000000000002, 0, 0],
//     [0, 0, 1.02020202020202, -0.20202020202020202],
//     [0, 0, 1, 0]
// ]

// console.log(cA[0][0])
// console.log(proj[0][0])

// // Vertex A (3,2)

// // Vertex B (1,4)

// // Vertex C (5,4)

// var
//     ArrA = [
//         [10],
//         [2]
//     ],
//     ArrB = [
//         [1],
//         [4]
//     ],
//     ArrC = [
//         [5],
//         [4]
//     ]

// ctx.beginPath()
// ctx.strokeStyle = "red"
// ctx.moveTo(ArrA[0][0] * 50, ArrA[1][0] * 50)
// ctx.lineTo(ArrB[0][0] * 50, ArrB[1][0] * 50)
// ctx.lineTo(ArrC[0][0] * 50, ArrC[1][0] * 50)
// ctx.closePath()
// ctx.stroke()

// function isVec(arr) {
//     var shape = arrOp.getShape(arr)
//     var ret = true
//     if (shape.length === 2) {
//         for (let i in arr) {
//             if (arr[i].length === 1) {
//                 ret = true
//             } else ret = false
//         }
//     } else ret = false

//     return ret
// }



// function getCircumCenter() {
//     var
//         midAB,
//         midAC,
//         gradAB,
//         gradAC,
//         normAB,
//         normAC,
//         matTrans,
//         matInvTrans,
//         supMat,
//         resMat,
//         circRadius

//     midAB = getMid(ArrA, ArrB, [0, 1])
//     midAC = getMid(ArrA, ArrC, [0, 1])

//     gradAB = getSlope(ArrA, ArrB)
//     gradAC = getSlope(ArrA, ArrC)

//     normAB = -1 / gradAB
//     normAC = -1 / gradAC

//     supMat = [
//         [-normAB * midAB[0][0] + midAB[1][0]],
//         [-normAC * midAC[0][0] + midAC[1][0]]
//     ]

//     matTrans = [
//         [-normAB, 1],
//         [-normAC, 1]
//     ]

//     matInvTrans = trans.getInvMat(matTrans)

//     resMat = trans.matMult(matInvTrans, supMat)

//     circRadius = getDist(resMat, ArrA, [0, 1])


//     ctx.beginPath()
//     ctx.strokeStyle = "green"
//     ctx.arc(resMat[0][0] * 50, resMat[1][0] * 50, circRadius * 50, 0, 2 * Math.PI)
//     ctx.stroke()

//     return [resMat, circRadius]

// }

// console.log(getCircumCenter())


// function calMaxInscribedCircle(...polygon) {
//     var n = polygon.length,
//         cen_x = 0,
//         cen_y = 0,
//         radius = Infinity,
//         param = [0, 1],
//         resMat = arrOp.createArrayFromArgs(2, 1)

//     for (let i = 0; i < n; i++) {
//         const start = polygon[i],
//             end = polygon[(i + 1) % n],

//             mid = getMid(start, end, param)

//         var min_dist = Infinity

//         for (let j = 0; j < n; j++) {
//             const start = polygon[j],
//                 end = polygon[(j + 1) % n]

//             dist = getDist(start, end, param)

//             min_dist = Math.min(min_dist, dist)
//         }

//         if (min_dist < radius) {
//             cen_x = mid[0]
//             cen_y = mid[1]
//             radius = min_dist
//         }
//     }

//     resMat[0][0] = cen_x[0]
//     resMat[1][0] = cen_y[0]


//     ctx.beginPath()
//     ctx.strokeStyle = 'blue'
//     ctx.arc(resMat[0][0] * 50, resMat[1][0] * 50, radius * 10, 0, 2 * Math.PI)
//     ctx.stroke()

//     return [resMat, radius]

// }