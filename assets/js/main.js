let dfrom = '';
let dto = '';
let settings = {};
let languages = [];
let adults = 1;
let children = 0;
let promocode = '';
const contact = {
    check_in: '',
    check_out: '',
    first_last_name: '',
    email: '',
    message: '',
}

$(document).ready(() => {
    initPage();
});

const initPage = async () => {
    initDatePicker();
    await setHeader();
    setLanguages();
    fetchRoomList();
    setContactSection();

    const params = new URLSearchParams(location.search);
    dfrom = params.get('dfrom') ? params.get('dfrom') : '';
    dto = params.get('dto') ? params.get('dto') : '';
    if (dfrom && dto) {
        const fromDate = moment(dfrom).format('DD MMMM');
        const toDate = moment(dto).format('DD MMMM');
        setDate(fromDate, toDate);
    }

    document.getElementById('noOfAdult').innerHTML = adults;
    document.getElementById('noOfChildren').innerHTML = children;
    const currentDate = new Date();
    contact.check_out = contact.check_in = moment(currentDate).format('YYYY-MM-DD');

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
}

const initDatePicker = () => {
    $('#dateRange').daterangepicker({
        opens: 'center',
        autoApply: true,
    }, (start, end, label) => {
        dfrom = start.format('YYYY-MM-DD');
        dto = end.format('YYYY-MM-DD')
        setDate(start.format('DD MMMM'), end.format('DD MMMM'));
    });

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

const setDate = (labelFrom, labelEnd) => {
    const checkInElem = document.getElementById('checkIn');
    const checkOutElem = document.getElementById('checkOut');
    checkInElem.innerHTML = labelFrom;
    checkOutElem.innerHTML = labelEnd;
    checkInElem.classList.add('bg-bright-yellow');
    checkOutElem.classList.add('bg-bright-yellow');
    checkInElem.classList.add('fw-bold');
    checkOutElem.classList.add('fw-bold');
    checkInElem.classList.remove('bg-white');
    checkOutElem.classList.remove('bg-white');

    const dateRangeElem = document.getElementById('dateRange');
    dateRangeElem.classList.add('bg-bright-yellow-tint');
    const checkInLabelElem = document.getElementById('checkInLabel');
    const checkOutLabelElem = document.getElementById('checkOutLabel');
    checkInLabelElem.classList.add('text-bright-yellow');
    checkOutLabelElem.classList.add('text-bright-yellow');

    if (history.pushState) {
        const url = new URL(window.location.href);
        url.searchParams.set("dfrom", dfrom);
        url.searchParams.set("dto", dto);
        const newUrl = url.href;
        window.history.pushState({
            path: newUrl
        }, '', newUrl);

    }
}

const setFocus = (id) => {
    setTimeout(() => {
        document.getElementById(id).focus();
    }, 700);
}

const onPromoCodeEnter = () => {
    const elem = document.getElementById('promocode');
    promocode = elem.value;
    const btn = document.getElementById('submitPromo');
    btn.style.display = promocode ? "block" : "none";
    if (promocode) {
        elem.className.concat('border-end-0');
        elem.style.borderRadius = '10px 0px 0px 10px';
    } else {
        elem.style.borderRadius = '10px';
    }
}

const setPromoCode = () => {
    const appliedPromocode = document.getElementById('appliedPromocode');
    appliedPromocode.innerHTML = promocode;
    appliedPromocode.style.display = 'block';
    document.getElementById('enterPromocodeText').style.display = 'none';
    document.getElementById('enterPromocode').classList.add('bg-bright-yellow-tint');
    document.getElementById('promocodeSection').classList.add('bg-bright-yellow-tint');
    document.getElementById('promocodeLabel').classList.add('text-bright-yellow');
}

$('#addAdult').click(() => {
    adults++;
    document.getElementById('noOfAdult').innerHTML = adults;
    setGuestFilter();
});

$('#addChildren').click(() => {
    children++;
    document.getElementById('noOfChildren').innerHTML = children;
    setGuestFilter();
});

$('#removeAdult').click(() => {
    if (adults !== 0) {
        adults--;
        document.getElementById('noOfAdult').innerHTML = adults;
        setGuestFilter();
    }
});

$('#removeChildren').click(() => {
    if (children !== 0) {
        children--;
        document.getElementById('noOfChildren').innerHTML = children;
        setGuestFilter();
    }
});

const setGuestFilter = () => {
    const elem = document.getElementById('noOfGuest');
    if (adults > 1 || children > 0) {
        document.getElementById('addGuest').style.display = 'none';
        elem.innerHTML = children > 0 ? adults + ' Adult, ' + children + ' child' : adults + ' Adult';
        elem.style.display = 'block';
        document.getElementById('guestLable').classList.add('text-bright-yellow');
        document.getElementById('guestSection').classList.add('bg-bright-yellow-tint');
        document.getElementById('addGuestDropDown').classList.add('bg-bright-yellow-tint');
        document.getElementById('addGuestDropDown').classList.remove('bg-white');
    } else {
        document.getElementById('addGuest').style.display = 'block';
        elem.innerHTML = '';
        elem.style.display = 'none';
        document.getElementById('guestLable').classList.remove('text-bright-yellow');
        document.getElementById('guestSection').classList.remove('bg-bright-yellow-tint');
        document.getElementById('addGuestDropDown').classList.remove('bg-bright-yellow-tint');
        document.getElementById('addGuestDropDown').classList.add('bg-white');
    }
}