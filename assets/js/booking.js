
const init = async () => {
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

    const params = new URLSearchParams(location.search);
    const selectedRoom = JSON.parse(sessionStorage.getItem('selectedRoom'));

    dfrom = params.get('dfrom') ? params.get('dfrom') : '';
    dto = params.get('dto') ? params.get('dto') : '';
    console.log(dfrom, dto)
    const d1 = document.getElementById('desktop-check-in');
    if (d1) d1.innerHTML = moment(dfrom).format('DD MMMM');
    const d2 = document.getElementById('desktop-check-out');
    if (d2) d2.innerHTML = moment(dto).format('DD MMMM');
    const d3 = document.getElementById('desktop-room-cost')
    if (d3) d3.innerHTML = selectedRoom.selectedPrice.total_price + ' ' + settings.currency;
    const d4 = document.getElementById('desktop-room-name');
    if (d4) d4.innerHTML = selectedRoom.name;
    const d5 = document.getElementById('desktop-room-unit');
    if (d5) d5.innerHTML = selectedRoom.unit + 'x';
    const d6 = document.getElementById('desktop-room-total');
    if(d6) d6.innerHTML = selectedRoom.selectedPrice.total_price + ' ' + settings.currency;

    const s1 = document.getElementById('s-tablet-check-in');
    if (s1) s1.innerHTML = moment(dfrom).format('DD MMMM');
    const s2 = document.getElementById('s-tablet-check-out');
    if (s2) s2.innerHTML = moment(dto).format('DD MMMM');
    const s3 = document.getElementById('s-tablet-room-cost')
    if (s3) s3.innerHTML = selectedRoom.selectedPrice.total_price + ' ' + settings.currency;
    const s4 = document.getElementById('s-tablet-room-name');
    if (s4) s4.innerHTML = selectedRoom.name;
    const s5 = document.getElementById('s-tablet-room-unit');
    if (s5) s5.innerHTML = selectedRoom.unit + 'x';
    const s6 = document.getElementById('s-desktop-room-total');
    if(s6) s6.innerHTML = selectedRoom.selectedPrice.total_price + ' ' + settings.currency;

    const t1 = document.getElementById('tablet-check-in');
    if (t1) t1.innerHTML = moment(dfrom).format('DD MMMM');
    const t2 = document.getElementById('tablet-check-out');
    if (t2) t2.innerHTML = moment(dto).format('DD MMMM');
    const t3 = document.getElementById('tablet-room-cost')
    if (t3) t3.innerHTML = selectedRoom.selectedPrice.total_price + ' ' + settings.currency;
    const t4 = document.getElementById('tablet-room-name');
    if (t4) t4.innerHTML = selectedRoom.name;
    const t5 = document.getElementById('tablet-room-unit');
    if (t5) t5.innerHTML = selectedRoom.unit + 'x';

}

$(document).ready(() => {
    init();
});