$(document).ready(async () => {
    initPage();
    await setHeader();
    setLanguages();
    setContactSection();

    setTimeout(() => {
        const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
        popoverTriggerList.map((elem) => {
            return new bootstrap.Popover(elem);
        });

        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
        tooltipTriggerList.map(function (tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl)
        })
    }, 1000);
});