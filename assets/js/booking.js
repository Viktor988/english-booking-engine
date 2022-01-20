const init = async () => {
    console.log('here')
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

    $('#checkin').daterangepicker({
        opens: 'center',
        singleDatePicker: true,
        autoApply: true
    }, (start, end, label) => {
        document.getElementById('checkin').value = contact.check_in = start.format('YYYY-MM-DD');
    });

    $('#checkout').daterangepicker({
        opens: 'center',
        singleDatePicker: true,
        autoApply: true
    }, (start, end, label) => {
        document.getElementById('checkout').value = contact.check_out = start.format('YYYY-MM-DD');
    });

}

init();