class AngleFinder {
    constructor() {
        this.canvas = document.querySelector("canvas");
        this.ctx = this.canvas.getContext('2d');
        this.video = document.querySelector("video");

        this.point1 = null;
        this.point2 = null;
        this.values = {
            angle: 0,
            rad: 0,
            sin: 0,
            cos: 0,
            tan: 0,
            height: 0,
        };

        this.initializeVideoStream();
        this.registerEvents();
        requestAnimationFrame(this.render.bind(this));

        document.getElementById("takePictureButton").addEventListener("click", this.takePicture.bind(this));
        document.getElementById("resetButton").addEventListener("click", this.reset.bind(this)); // Add reset event
    }

    // Existing methods (initializeVideoStream, registerEvents, handleCanvasClick, etc.)

    // Reset method
    reset() {
        // Clear points and reset values
        this.point1 = null;
        this.point2 = null;
        this.values = {
            angle: 0,
            rad: 0,
            sin: 0,
            cos: 0,
            tan: 0,
            height: 0,
        };

        // Clear canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Reset the display
        this.updateValuesDisplay();
    }


    initializeVideoStream() {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
            .then(stream => {
                this.video.srcObject = stream;
                this.video.play();
            });

        this.video.addEventListener("loadeddata", () => {
            this.canvas.width = this.video.videoWidth;
            this.canvas.height = this.video.videoHeight;
        });
    }

    registerEvents() {
        this.canvas.addEventListener("mousedown", this.handleCanvasClick.bind(this));
        this.canvas.addEventListener("touchstart", this.handleCanvasClick.bind(this));
    }

    handleCanvasClick(event) {
        event.preventDefault();
        const rect = this.canvas.getBoundingClientRect();
        const x = (event.clientX || event.touches[0].clientX) - rect.left;
        const y = (event.clientY || event.touches[0].clientY) - rect.top;

        if (this.point1 === null) {
            this.point1 = { x, y };
        } else if (this.point2 === null) {
            this.point2 = { x, y };
            const calc = this.calculateAngle(this.point1, this.point2);
            this.values.angle = calc.degree;
            this.values.rad = calc.radians;
            this.values.cos = Math.cos(calc.radians);
            this.values.sin = Math.sin(calc.radians);
            this.values.tan = Math.tan(calc.radians);
            this.values.height = Math.tan(this.values.angle * Math.PI / 180) * parseInt(document.querySelector("#horizontalDistance").value);
            this.updateValuesDisplay();
        }
    }

    calculateAngle(point1, point2) {
        const angleRadians = Math.atan2(point2.y - point1.y, point2.x - point1.x);
        const angleDegrees = Math.round(angleRadians * 180 / Math.PI);
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
        document.getElementById('height').innerText = this.values.height.toFixed(2);
    }
    

    render() {
        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);

        if (this.point1) {
            this.ctx.fillStyle = "red";
            this.ctx.fillRect(this.point1.x - 10, this.point1.y - 10, 20, 20);
        }

        if (this.point2) {
            const height = Math.tan(this.values.angle * Math.PI / 180) * parseInt(document.querySelector("#horizontalDistance").value);
            this.ctx.fillStyle = "blue";
            this.ctx.fillRect(this.point2.x - 10, this.point2.y - 10, 20, 20);

            this.ctx.font = "30px Arial";
            this.ctx.fillStyle = "white";
            this.ctx.fillText(this.values.angle.toFixed(2), 30, 30);

            this.drawTriangleAndLabel(height);
        }

        requestAnimationFrame(this.render.bind(this));
    }

    drawTriangleAndLabel(height) {
        const base = parseInt(document.querySelector("#horizontalDistance").value);

        this.ctx.strokeStyle = "red";
        this.ctx.lineWidth = 6;

        this.ctx.beginPath();
        this.ctx.moveTo(this.point1.x, this.point1.y);
        this.ctx.lineTo(this.point1.x, this.point2.y);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.point2.x, this.point2.y);
        this.ctx.lineTo(this.point1.x, this.point2.y);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(this.point2.x, this.point2.y);
        this.ctx.lineTo(this.point1.x, this.point1.y);
        this.ctx.stroke();

        this.ctx.font = "30px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(parseFloat(height).toFixed(2), this.point1.x, this.point2.y);
        this.ctx.fillText(this.pythagorasTheo(height, base), (this.point2.x + this.point1.x) / 2, (this.point2.y + this.point1.y) / 2 - 20);
    }

    takePicture() {
        const link = document.createElement('a');
        link.download = 'canvas_image.png';
        link.href = this.canvas.toDataURL();
        link.click();
    }
}

window.onload = () => {
    window.angleFinder = new AngleFinder();
};
