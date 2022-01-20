
const viewImage = (img) => {
    const modal = document.getElementById("image-viewer");
    const modalImg = document.getElementById("img01");
    modal.style.display = "block";
    modalImg.src = img.src;
    console.log(modalImg)
}


const closeImage = () => {
    document.getElementById("image-viewer").style.display = "none";
}