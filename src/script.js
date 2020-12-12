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
        try {
            holder.style.border = "3px solid transparent";
            var child = document.getElementById("p");
            child.parentNode.removeChild(child);

            var picture = document.createElement("picture");
            var img = document.createElement("img");
            img.id = "image";
            img.src = f.path;
            img.style.maxWidth = "375px"
            img.style.maxHeight = "375px"
            picture.appendChild(img);
            holder.appendChild(picture);
        } catch {
            var img = document.getElementById("image");
            img.src = f.path;
        }
    }

    return false;
};
