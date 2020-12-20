var hidddenCanvas = document.getElementById("hc");
var holder = document.getElementById("drag-file");
let baseData;
let prom = [];

holder.ondragover = () => {
    return false;
};

holder.ondragleave = () => {
    return false;
};

holder.ondragend = () => {
    return false;
};

holder.ondrop = (e) => {
    e.preventDefault();
    //Загрузится последняя картинка из всех
    for (let f of e.dataTransfer.files) {
        console.log("File(s) you dragged here: ", f.path);
        var img = new Image();
        img.addEventListener("load", (e) => {
            console.log(img.naturalHeight);
            console.log(img.naturalWidth);
            var ctx = canvas.getContext("2d");
            const imgH = img.naturalHeight;
            const imgW = img.naturalWidth;
            const height = imgH < imgW ? 375 * (imgH / imgW) : 375;
            const width = imgH > imgW ? 375 * (imgW / imgH) : 375;
            hidddenCanvas.width = imgW;
            hidddenCanvas.height = imgH;
            canvas.width = width;
            canvas.height = height;
            hidddenCanvas.getContext("2d").drawImage(img, 0, 0, imgW, imgH);
            ctx.drawImage(img, 0, 0, width, height);
            const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
            baseData = data.data;
            for (let c = 0; c < (height * width); c++) {
                prom[c] = RGBtoHSV(baseData[c * 4], baseData[c * 4 + 1], baseData[c * 4 + 2])
            }
        });

        try {
            holder.style.border = "3px solid transparent";
            var child = document.getElementById("p");
            child.parentNode.removeChild(child);
            var canvas = document.createElement("canvas");
            canvas.setAttribute("id", "canvas");
            holder.appendChild(canvas);
            img.src = f.path;
        } catch {
            canvas = document.getElementById("canvas");
            canvas
                .getContext("2d")
                .clearRect(0, 0, canvas.width, canvas.height);
            img.src = f.path;
        }
    }

    return false;
};

const hueSlider = document.getElementById("hue");
const hueN = document.getElementById("hue-n");
hueN.value = 0;

const saturation = document.getElementById("saturation");
const saturationN = document.getElementById("saturation-n");
saturationN.value = 0;

const brightness = document.getElementById("brightness");
const brightnessN = document.getElementById("brightness-n");
brightnessN.value = 0;

hueSlider.oninput = () => {
    const hue = ((hueSlider.value < 180) ? -(180 - hueSlider.value) : (hueSlider.value - 180))
    const sat = saturation.value
    const bri = brightness.value
    hueN.value = hue;
    let canvas = document.getElementById("canvas");
    hsvHandler(canvas, hue, sat, bri);
};

saturation.oninput = () => {
    const hue = ((hueSlider.value < 180) ? -(180 - hueSlider.value) : (hueSlider.value - 180))
    const sat = saturation.value
    const bri = brightness.value
    saturationN.value = sat - 100;
    let canvas = document.getElementById("canvas");
    hsvHandler(canvas, hue, sat, bri);
};

brightness.oninput = () => {
    const hue = ((hueSlider.value < 180) ? -(180 - hueSlider.value) : (hueSlider.value - 180))
    const sat = saturation.value
    const bri = brightness.value
    brightnessN.value = brightness.value;
    let canvas = document.getElementById("canvas");
    hsvHandler(canvas, hue, sat, bri);
};

function hsvHandler(canvas, h, s, v) {
    const ctx = canvas.getContext("2d");
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let d = data.data;
    for (let c = 0; c < (canvas.width * canvas.height); c++) {
        const p = prom[c].s < (s-100) ? (s-100) : prom[c].s
        const ss = (p === 100) ? 99 : p
        const sat = ((s <= 100) ? ((prom[c].s / 100) * s) : ss);
        let converted = HSVtoRGB(prom[c].h + h, sat, (prom[c].v / 100) * v)
        d[c * 4] = converted.r;
        d[c * 4 + 1] = converted.g;
        d[c * 4 + 2] = converted.b;
        d[c * 4 + 3] = 255;
    }
    ctx.putImageData(data, 0, 0, 0, 0, canvas.width, canvas.height)
}

function HSVtoRGB(h, s, v) {
    const RGB_MAX = 255
    const HUE_MAX = 360
    const SV_MAX = 100
    if (typeof h === 'object') {
        const args = h
        h = args.h;
        s = args.s;
        v = args.v;
    }
    h = (h % 360 + 360) % 360
    h = (h === HUE_MAX) ? 1 : (h % HUE_MAX / parseFloat(HUE_MAX) * 6)
    s = (s === SV_MAX) ? 1 : (s % SV_MAX / parseFloat(SV_MAX))
    v = (v === SV_MAX) ? 1 : (v % SV_MAX / parseFloat(SV_MAX))
    var i = Math.floor(h)
    var f = h - i
    var p = v * (1 - s)
    var q = v * (1 - f * s)
    var t = v * (1 - (1 - f) * s)
    var mod = i % 6
    var r = [v, q, p, p, t, v][mod]
    var g = [t, v, v, q, p, p][mod]
    var b = [p, p, t, v, v, q][mod]
    return {
        r: Math.floor(r * RGB_MAX),
        g: Math.floor(g * RGB_MAX),
        b: Math.floor(b * RGB_MAX),
    }
}

function RGBtoHSV(r, g, b) {
    const RGB_MAX = 255
    const HUE_MAX = 360
    const SV_MAX = 100
    if (typeof r === 'object') {
        const args = r
        r = args.r;
        g = args.g;
        b = args.b;
    }
    r = (r === RGB_MAX) ? 1 : (r % RGB_MAX / parseFloat(RGB_MAX))
    g = (g === RGB_MAX) ? 1 : (g % RGB_MAX / parseFloat(RGB_MAX))
    b = (b === RGB_MAX) ? 1 : (b % RGB_MAX / parseFloat(RGB_MAX))
    var max = Math.max(r, g, b)
    var min = Math.min(r, g, b)
    var h, s, v = max
    var d = max - min
    s = max === 0 ? 0 : d / max
    if (max === min) {
        h = 0
    } else {
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0)
                break
            case g:
                h = (b - r) / d + 2
                break
            case b:
                h = (r - g) / d + 4
                break
        }
        h /= 6
    }
    return {
        h: Math.round(h * HUE_MAX),
        s: Math.round(s * SV_MAX),
        v: Math.round(v * SV_MAX)
    }
}

const button = document.getElementById("button");

button.onclick = () => {
    let promise = new Promise((resolve, reject) => {
        const hue = ((hueSlider.value < 180) ? -(180 - hueSlider.value) : (hueSlider.value - 180))
        const sat = saturation.value
        const bri = brightness.value
        const data = hidddenCanvas.getContext("2d").getImageData(0, 0, hidddenCanvas.width, hidddenCanvas.height);
        let bD = data.data;
        for (let c = 0; c < (hidddenCanvas.height * hidddenCanvas.width); c++) {
            prom[c] = RGBtoHSV(bD[c * 4], bD[c * 4 + 1], bD[c * 4 + 2])
        }
        hsvHandler(hidddenCanvas,hue,sat,bri)
        resolve(hidddenCanvas)
    })
    promise.then((canvas) => {
        canvas.toBlob(function (blob) {
            saveAs(blob, "pretty image.png");
        });
    })
    let canvas = document.getElementById("canvas");
    prom = []
    for (let c = 0; c < (canvas.height * canvas.width); c++) {
        prom[c] = RGBtoHSV(baseData[c * 4], baseData[c * 4 + 1], baseData[c * 4 + 2])
    }
};
