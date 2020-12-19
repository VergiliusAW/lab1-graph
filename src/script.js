var hidddenCanvas = document.getElementById("hc");

var holder = document.getElementById("drag-file");

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

hueSlider.oninput = () => {
    var val = hueSlider.value;
    hueN.value = val;
    hueHandler(val);
};

function hueHandler(val) {
    var canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "hsl(" + val + ",100%,50%)";
    // ctx.drawImage(canvas, 0, 0);
    // ctx.beginPath();
    // var r = 50 * Math.random();
    // ctx.arc(
    //     1000 * Math.random(),
    //     1000 * Math.random(),
    //     r,
    //     0,
    //     2 * Math.PI,
    //     false
    // );
    ctx.fill();
    const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    for (let index = 0; index < 4; index++) {
        console.log(data[index]);
    }
}

function HSVtoRGB(H, S, V,R,G,B) {
    if (S == 0) {
        // находимся на оси симметрии - оттенки серого
        R = V;
        G = V;
        B = V;
    } else {
        // floor(x) возвращает наибольшее целое <= x

        var sector = Math.floor(H/60);
        var frac = H/60 - sector; // дробная часть H/60

        T = V * (1 - S);
        P = V * (1 - S * frac);
        Q = V * (1 - S * (1 - frac));

        switch (sector) {
            case 0:
                R = V;
                G = Q;
                B = T;
                break;
            case 1:
                R = P;
                G = V;
                B = T;
                break;
            case 2:
                R = T;
                G = V;
                B = Q;
                break;
            case 3:
                R = T;
                G = P;
                B = V;
                break;
            case 4:
                R = Q;
                G = T;
                B = V;
                break;
            case 5:
                R = V;
                G = T;
                B = P;
                break;
        }
    }
}

const button = document.getElementById("button");

button.onclick = () => {
    var link = document.createElement("a");
    link.download = "filename.png";
    link.href = hidddenCanvas.toDataURL();
    link.click();
};
