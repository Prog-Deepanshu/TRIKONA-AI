class AngleFinder {
    constructor() {
        this.canvas = document.querySelector("canvas");
        this.ctx = this.canvas.getContext('2d');
        navigator.mediaDevices.getUserMedia(
            {
                video: {
                    facingMode: "environment"
                }
            }
        )
        .then(stream => {
            document.querySelector("video").srcObject = stream;
            document.querySelector("video").play();
        });

        document.querySelector("video").addEventListener("loadeddata", () => {
            this.canvas.width = document.querySelector("video").videoWidth;
            this.canvas.height = document.querySelector("video").videoHeight;
        });

        requestAnimationFrame(this.render.bind(this));
        this.registerEvent();
    }

    point1 = null;
    point2 = null;

    registerEvent() {
        this.canvas.addEventListener("mousedown", (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            if (this.point1 == null) {
                this.point1 = { x: x, y: y };
            } else if (this.point2 == null) {
                this.point2 = { x: x, y: y };
                console.log(this.calculateAngle(this.point1, this.point2));
                let calc = this.calculateAngle(this.point1, this.point2);
                this.values.angle = calc.degree;
                this.values.rad = calc.radians;
                this.values.cos = Math.cos(calc.radians);
                this.values.sin = Math.sin(calc.radians);
                this.values.tan = Math.tan(calc.radians);
                console.log(this.values);
                this.updateValuesDisplay();
            }
        });

        this.canvas.addEventListener("touchstart", (event) => {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.touches[0].clientX - rect.left;
            const y = event.touches[0].clientY - rect.top;

            if (this.point1 == null) {
                this.point1 = { x: x, y: y };
            } else if (this.point2 == null) {
                this.point2 = { x: x, y: y };
                console.log(this.calculateAngle(this.point1, this.point2));
                let calc = this.calculateAngle(this.point1, this.point2);
                this.values.angle = calc.degree;
                this.values.rad = calc.radians;
                this.values.cos = Math.cos(calc.radians);
                this.values.sin = Math.sin(calc.radians);
                this.values.tan = Math.tan(calc.radians);
                this.values.height = Math.tan(this.values.angle * Math.PI / 180) * parseInt(document.querySelector("#horizontalDistance").value) + 2;
                console.log(this.values);
                this.updateValuesDisplay();
            }
        });
    }

    values = {
        angle: 0,
        rad: 0,
        sin: 0,
        cos: 0,
        tan: 0,
        height: 0,
    };

    calculateAngle(point1, point2) {
        let angleRadians = Math.atan2(point2.y - point1.y, point2.x - point1.x);
        let angleDegrees = Math.round(angleRadians * 180 / Math.PI);
        console.log(point1.y - point2.y);
        return { degree: 180 - angleDegrees, radians: (180 - angleDegrees) * (Math.PI / 180) };
    }

    pythagorasTheo(height, base) {
        return parseFloat(Math.sqrt(Math.pow(height, 2) + Math.pow(base, 2))).toFixed(2);
    }

    updateValuesDisplay() {
        document.getElementById('angle').innerText = this.values.angle.toFixed(2);
        document.getElementById('rad').innerText = this.values.rad.toFixed(2);
        document.getElementById('cos').innerText = this.values.cos.toFixed(2);
        document.getElementById('sin').innerText = this.values.sin.toFixed(2);
        document.getElementById('tan').innerText = this.values.tan.toFixed(2);
    }

    render(ts) {
        this.ctx.drawImage(document.querySelector("video"), 0, 0, this.canvas.width, this.canvas.height);

        if (this.point1 != null) {
            this.ctx.fillStyle = "red";
            this.ctx.fillRect(this.point1.x, this.point1.y, 20, 20);
        }

        if (this.point2 != null) {
            let height = Math.tan(this.values.angle * Math.PI / 180) * parseInt(document.querySelector("#horizontalDistance").value) + 2;
            this.ctx.fillStyle = "blue";
            this.ctx.fillRect(this.point2.x, this.point2.y, 20, 20);

            this.ctx.font = "30px Arial";
            this.ctx.fillStyle = "white";
            this.ctx.fillText(this.values.angle.toFixed(2), 30, 30);

            // drawing line and height
            this.ctx.strokeStyle = "red";
            this.ctx.beginPath();
            this.ctx.moveTo(this.point1.x, this.point1.y);
            this.ctx.lineTo(this.point1.x, this.point2.y);
            this.ctx.lineWidth = 6;
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(this.point2.x, this.point2.y);
            this.ctx.lineTo(this.point1.x, this.point2.y);
            this.ctx.lineWidth = 6;
            this.ctx.stroke();

            this.ctx.beginPath();
            this.ctx.moveTo(this.point2.x, this.point2.y);
            this.ctx.lineTo(this.point1.x, this.point1.y);
            this.ctx.lineWidth = 6;
            this.ctx.stroke();

            this.ctx.font = "30px Arial";
            this.ctx.fillStyle = "white";
            this.ctx.fillText(parseFloat(height).toFixed(2), this.point1.x, this.point2.y);

            this.ctx.font = "30px Arial";
            this.ctx.fillStyle = "white";
            this.ctx.fillText(this.pythagorasTheo(height, parseInt(document.querySelector("#horizontalDistance").value)), (this.point2.x + this.point1.x) / 2, (this.point2.y + this.point1.y) / 2 - 20);
        }

        requestAnimationFrame(this.render.bind(this));
    }
}

window.onload = () => {
    window.game = new AngleFinder();
};
