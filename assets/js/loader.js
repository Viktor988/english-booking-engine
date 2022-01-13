const loader = new bootstrap.Modal(document.getElementById('loader-modal'), {
    keyboard: false
})

const showLoader = (msg = "Loading...") => {
    document.getElementById('loader-msg').innerHTML = msg;
    loader.show();
}

const hideLoader = () => {
    setTimeout(() => loader.hide(), 1000);
}