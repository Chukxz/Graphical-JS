const canvas = document.getElementsByTagName('canvas')[0]

const ctx = canvas.getContext('2d')

canvas.width = 5000
canvas.height = 5000
canvas.style.borderStyle = 'solid'
canvas.style.borderColor = 'red'
canvas.style.borderWidth = '5px'

const MAX_ITER = 1000

const getRanHex = (size = 1) => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join("")

const ranHexCol = (num = 100, size = 6) => [...Array(num)].map((elem, index) => index === 0 ? elem = "#000000" : elem = "#" + getRanHex(size))

function mandelbrot(c) {
    const z = { re: 0, im: 0 },
        p = {};

    let n = 0,
        d = 0;

    do {
        p.re = z.re ** 2 - z.im ** 2
        p.im = 2 * z.re * z.im

        z.re = p.re + c.re
        z.im = p.im + c.im

        n += 1

        d = Math.sqrt(z.re ** 2 + z.im ** 2)

    } while (d <= 2 && n < MAX_ITER)

    return [n, d <= 2]
}

const REAL_SET = { start: -2, end: 1 }
const IMAGINARY_SET = { start: -1, end: 1 }

const colors = ranHexCol(500)

function draw() {
    for (let i = 0; i < canvas.width; i++) {
        for (let j = 0; j < canvas.height; j++) {
            complex = {
                re: REAL_SET.start + (i / canvas.width) * (REAL_SET.end - REAL_SET.start),
                im: IMAGINARY_SET.start + (j / canvas.height) * (IMAGINARY_SET.end - IMAGINARY_SET.start)
            }

            const [m, isMandelbrotSet] = mandelbrot(complex);
            ctx.fillStyle = colors[isMandelbrotSet ? 0 : (m % colors.length - 1) + 1]
            ctx.fillRect(i, j, 1, 1)
        }
    }
}

draw()