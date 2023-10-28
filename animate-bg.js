//OBJECTIVE PROGRAMMING METHOD

(function() {
    "use strict"
    class Animate {
        constructor(root, time, times) {
            this.root = root;
            this.time = time;
            this.times = times;
        }

        set() {
            this.root.style.setProperty("--time", this.times);
        }

        run() {
            //runs the background animation
            for (let i = 0; i < 9; i++) {
                //sets the random start color
                let A = Math.round(Math.random() * 256);
                let B = Math.round(Math.random() * 256);
                let C = Math.round(Math.random() * 256);
                var starts = `rgb(${A},${B},${C})`;
                this.root.style.setProperty("--start_cycle_" + `${i}`, starts)

                //sets the random end color
                let X = Math.round(Math.random() * 256);
                let Y = Math.round(Math.random() * 256);
                let Z = Math.round(Math.random() * 256);
                var ends = `rgb(${X},${Y},${Z})`;
                this.root.style.setProperty("--end_cycle_" + `${i}`, ends)
            }
        }
    }

    var time = 60000,
        root = document.querySelector(':root')
    let Anim = new Animate(root, `${time}`, `${time}ms`)
    Anim.set()
    Anim.run()
})()