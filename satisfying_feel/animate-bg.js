class Animate {
    constructor(root, time, times) {
        this.root = root;
        this.time = time;
        this.times = times;
        this.state = "play";
    }

    set() {
        this.root.style.setProperty("--time", this.times);
    }

    start() { //sets the random start color
        if (this.state === "play") {
            let A = Math.round(Math.random() * 256);
            let B = Math.round(Math.random() * 256);
            let C = Math.round(Math.random() * 256);
            var starts = `rgb(${A},${B},${C})`;
            this.root.style.setProperty("--start", starts)
        }
        return setTimeout(this.start, this.time);

    }

    end() { //sets the random end color
        let X = Math.round(Math.random() * 256);
        let Y = Math.round(Math.random() * 256);
        let Z = Math.round(Math.random() * 256);
        var ends = `rgb(${X},${Y},${Z})`;
        this.root.style.setProperty("--end", ends)
        return setTimeout(this.end, this.time);
    }
}

var root = document.querySelector(":root");


let Anim = new Animate(root, 3000, "3000ms");
Anim.set();
Anim.start();
Anim.end();