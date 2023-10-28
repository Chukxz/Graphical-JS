(function() {
    "use strict";


    var canvas =
        document.getElementById("maincanvas"),
        ctx = canvas.getContext("2d"),

        width = window.innerWidth,
        height = window.innerHeight - 100,

        canvas_object = {
            "Canvas": [],
            "Canvas_Num": 0
        };
    /* Instance Counter */

    class Counter {
        constructor() {
            this.counter = -1;
        }

        change(value) {
            this.counter = value;
            return this
        }

        add() {
            this.counter++;
            return this
        }

        subtract() {
            this.counter--;
            return this
        }

        value() {
            return this.counter;
        }
    }

    let canvasC = new Counter()

    let mC = new Counter()



    /*let add = (function() {
        let counter = -1;
          return function(){return counter+=1;}
        })();
        add()
        console.log(add());
      */


    class TransfMat {
        constructor() {
            this.mode = "deg"
        }
        changeMode(mode) {
            this.mode = mode
            return this
        }

        runMode(angle) {
            if (this.mode === "deg") {
                return (Math.PI / 180) * angle;
            } else if (this.mode === "rad") {
                return angle
            }
        }
        getIndex(a, b, val) {
            return (a * val) + b
        }
        rotMat2d(angle) {
            angle = this.runMode(angle)
            return [Math.cos(angle), -1 * Math.sin(angle), Math.sin(angle), Math.cos(angle)]
        }

        // Pitch
        rotX(angle) {
            angle = this.runMode(angle)
            return [1, 0, 0, 0, Math.cos(angle), -Math.sin(angle), 0, Math.sin(angle), Math.cos(angle)]
        }

        // Yaw
        rotY(angle) {
            angle = this.runMode(angle)
            return [Math.cos(angle), 0, Math.sin(angle), 0, 1, 0, -Math.sin(angle), 0, Math.cos(angle)]
        }

        //Roll
        rotZ(angle) {
            angle = this.runMode(angle)
            console.log(angle)
            return [Math.cos(angle), -Math.sin(angle), 0, Math.sin(angle), Math.cos(angle), 0, 0, 0, 1]
        }

        translMatrix() {}
        refMatrix() {}
        scaMatrix() {}
        shearMatrix() {}

        matMult(counter, matA, matB, shapeA, shapeB) {
            var matC = [],
                sum = 0

            if ((shapeA[1] == shapeB[0]) && shapeA[1] > 0) {
                for (let i = 0; i < shapeA[0]; i++) {
                    for (let j = 0; j < shapeB[1]; j++) {
                        sum = 0
                        for (let k = 0; k < shapeB[0]; k++) {
                            let aIndex = this.getIndex(i, k, shapeA[1]),
                                bIndex = this.getIndex(k, j, shapeB[1])
                            sum += matA[aIndex] * matB[bIndex]
                        }
                        // console.log(sum)
                        matC[counter.add().value()] = sum
                    }
                }
            }
            counter.change(-1)
            return [matC, [shapeA[0], shapeB[1]]]
        }
    }


    class DrawCanvas {
        constructor(instance_func, instance_object) {
            let instance = instance_func.value()
            instance_object.Canvas[instance] = { "objects": 0 }
            instance_object.Canvas_Num = instance + 1
        }
        drawCanvas(canvas, canvWidth, color, width, height, opacity) {
            canvas.style.borderStyle = 'solid';
            canvas.style.borderWidth = canvWidth;
            canvas.style.borderColor = color;
            canvas.style.opacity = opacity;
            canvas.width = width;
            canvas.height = height;
        }
    }

    let drawcanvas = new DrawCanvas(canvasC.add(), canvas_object)
    drawcanvas.drawCanvas(canvas, 1, "black", 500, 500, 0.8)

    // const mouseXratio = ( mouseX/width)*Math.PI
    // const mouseYratio = ( mouseY/height)*Math.PI



    class DrawBoxes {
        constructor(width, height, angle) {
            this.ArrX = []
            this.ArrY = []
            this.width = width
            this.height = height
            this.angle = (angle / 180) * Math.PI;
            this.fullArr = []
            this.shpA = [3, 3]
            this.shpB = [3, 1]
        }
        getLoc(coord, canv, scale) {
            let canvP = canv / 2
            let val = (coord * canvP * scale) + canvP
            return val
        }
        conv2dTo3d(x, y, z) {
            let xP = x / (z * Math.tan(0.5 * this.angle))
            let yP = y / (z * Math.tan(0.5 * this.angle))
            return [1 / xP, 1 / yP]
        }
        calc3dArray(arrX, arrY, arrZ) {
            let pointArr = [
                []
            ]
            let i = 0
            for (let x in arrX) {
                for (let y in arrY) {
                    for (let z in arrZ) {
                        pointArr[i] = [arrX[x], arrY[y], arrZ[z]]
                        i++
                    }
                }
            }
            return pointArr
        }
        calcParams(pointArr) {
            let i = 0
            for (let x of pointArr) {
                let tmp = this.conv2dTo3d(x[0], x[1], x[2])
                this.ArrX[i] = this.getLoc(tmp[0], this.width, 1)
                this.ArrY[i] = this.getLoc(tmp[1], this.height, 1)
                i++
            }
        }
        rotBox(pointArr, angleX, angleY, angleZ, transform, mC) {
            if (angleX > 0) {
                let rX = transform.rotX(angleX)
                for (let x in pointArr) {
                    pointArr[x] = transform.matMult(mC, rX, pointArr[x], this.shpA, this.shpB)[0]
                }
            }
            if (angleY > 0) {
                let rY = transform.rotY(angleY)
                for (let x in pointArr) {
                    pointArr[x] = transform.matMult(mC, rY, pointArr[x], this.shpA, this.shpB)[0]
                }
            }
            if (angleZ > 0) {
                let rZ = transform.rotZ(angleZ)
                console.log(rZ)
                for (let x in pointArr) {
                    pointArr[x] = transform.matMult(mC, rZ, pointArr[x], this.shpA, this.shpB)[0]
                }
            }
            return pointArr
        }
        drawBoxes() {
            for (let i in this.ArrX) {
                ctx.beginPath();
                ctx.arc(this.ArrX[i], this.ArrY[i], 5, 0, 2 * Math.PI);
                ctx.stroke();
            }
        }
    }


    let db = new DrawBoxes(500, 500, 45)

    var a = db.calc3dArray([0.5, -0.5], [0.5, -0.5], [0.5, -0.5])
    console.log(a)
    db.calcParams(a)
    console.log(db.ArrX)
    console.log(db.ArrY)

    let tr = new TransfMat()

    var b = db.rotBox(a, 0, 0, 46, tr, mC)

    console.log(b)

    db.calcParams(b)
    console.log(db.ArrX)
    console.log(db.ArrY)

    db.drawBoxes()


}())