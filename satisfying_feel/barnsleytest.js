function Barnsley(maximum_iterations = 1000, multX, multY) {

    var x = 0.0;
    var y = 0.0;
    n = 0;
    xn = 0.0;
    yn = 0.0;

    var count = 0;

    while (n < maximum_iterations) {
        let r = Math.random();

        if (r < 0.1) {
            xn = 0.0
            yn = 0.16 * y;
        } else if (r < 0.86) {
            xn = 0.85 * x + 0.04 * y;
            yn = -0.04 * x + 0.85 * y + 1.6;
        } else if (r < 0.93) {
            xn = 0.2 * x - 0.26 * y;
            yn = 0.23 * x + 0.22 * y + 1.6;
        } else {
            xn = -0.15 * x + 0.28 * y;
            yn = 0.26 * x + 0.24 * y + 0.44;
        }

        // draw pixel (x,y) green on screen

        x = xn;
        y = yn;

        count += 2;

        // const [a, b] = unclip([x, y], true);
        // const [i, j] = toCanvas([a, b], multX, multY);

        // _b_ctx.fillStyle = "green ";
        // _b_ctx.fillRect(i, j, 1, 1);

        //increment n

        n++;
    }

    console.log(count)
}


function BarnsleyVariant(maximum_iterations = 1000, multX, multY) {

    var x = 0.0;
    var y = 0.0;
    n = 0;
    xn = 0.0;
    yn = 0.0;

    var count = 0;

    while (n < maximum_iterations) {
        let r = Math.random();

        if (r < 0.1) {
            xn = 0.0
            yn = 0.25 * y - 0.4;
        } else if (r < 0.86) {
            xn = 0.95 * x + 0.005 * y - 0.002;
            yn = -0.005 * x + 0.93 * y + 0.5;
        } else if (r < 0.93) {
            xn = 0.035 * x - 0.2 * y - 0.09;
            yn = 0.16 * x + 0.04 * y + 0.02;
        } else {
            xn = -0.04 * x + 0.2 * y + 0.083;
            yn = 0.16 * x + 0.04 * y + 0.12;
        }

        // draw pixel (x,y) green on screen

        x = xn;
        y = yn;

        count += 2;

        // const [a, b] = unclip([x, y], true);
        // const [i, j] = toCanvas([a, b], multX, multY);

        // _b_v_ctx.fillStyle = "green ";
        // _b_v_ctx.fillRect(i, j, 1, 1);

        //increment n

        n++;

    }
    console.log(count)

}

console.time("Barnsley");
Barnsley(1e7);
console.timeEnd('Barnsley');

console.time("Barnsley Variant");
BarnsleyVariant(1e7);
console.timeEnd('Barnsley Variant');