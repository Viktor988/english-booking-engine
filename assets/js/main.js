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

const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
popoverTriggerList.map((elem) => {
    return new bootstrap.Popover(elem);
});

const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
tooltipTriggerList.map((tooltipTriggerEl) => {
    return new bootstrap.Tooltip(tooltipTriggerEl)
});

const initPage = () => {
    initDatePicker();
    setHeader();

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

const setHeader = async () => {
    const resp = await getSettings();
    settings = resp.settings;

    const img = document.getElementById('logo');
    const mobileImg = document.getElementById('mobile-logo');
    if (settings.engine_logo) {
        img.src = mobileImg.src = settings.engine_logo;
    } else {
        img.style.display = mobileImg.style.display = 'none';
    }
    const description = document.getElementById('description');
    description.innerHTML = settings.description;
    onCurrencySelection(settings.currency);
    setContactSection();
    setLanguages();
    fetchRoomList();
}

const setContactSection = () => {
    const desktopSite = document.getElementById('desktop-site');
    const desktopSiteElem = document.getElementById('desktop-site-section');

    if (desktopSite) {
        desktopSite.innerHTML = settings.website;
    }
    if (desktopSiteElem) {
        desktopSiteElem.setAttribute("onclick", "window.open('" + settings.website + "');");
    }

    const mobileSite = document.getElementById('mobile-site');
    const mobileSiteElem = document.getElementById('mobile-site-section');

    if (mobileSite) {
        mobileSite.innerHTML = settings.website;
    }
    if (mobileSiteElem) {
        mobileSiteElem.setAttribute("onclick", "window.open('" + settings.website + "');");
    }

    const desktopEmail = document.getElementById('desktop-mail');
    const desktopEmailElem = document.getElementById('desktop-mail-section');

    if (desktopEmail) {
        desktopEmail.innerHTML = settings.email;
    }
    if (desktopEmailElem) {
        desktopEmailElem.setAttribute("onclick", "window.open('mailto:" + settings.email + "');");
    }

    const mobileEmail = document.getElementById('mobile-mail');
    const mobileEmailElem = document.getElementById('mobile-mail-section');

    if (mobileEmail) {
        mobileEmail.innerHTML = settings.email;
    }
    if (mobileEmailElem) {
        mobileEmailElem.setAttribute("onclick", "window.open('mailto:" + settings.email + "');");
    }

    const desktopLocation = document.getElementById('desktop-location');
    if (desktopLocation) {
        desktopLocation.innerHTML = settings.address;
    }

    const mobileLocation = document.getElementById('mobile-location');
    if (mobileLocation) {
        mobileLocation.innerHTML = settings.address;
    }

    const desktopPhone = document.getElementById('desktop-phone');
    const desktopPhoneElem = document.getElementById('desktop-phone-section');
    if (desktopPhone) {
        desktopPhone.innerHTML = settings.phone;
    }
    if (desktopPhoneElem) {
        desktopPhoneElem.setAttribute("onclick", "window.open('tel:" + settings.phone + "');");
    }

    const mobilePhone = document.getElementById('mobile-phone');
    const mobilePhoneElem = document.getElementById('mobile-phone-section');
    if (mobilePhone) {
        mobilePhone.innerHTML = settings.phone;
    }
    if (mobilePhoneElem) {
        mobilePhoneElem.setAttribute("onclick", "window.open('tel:" + settings.phone + "');");
    }
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

const setLanguages = async () => {
    const resp = await getLanguage();
    languages = resp.languages;
    const selectedLangElem = document.getElementById('selectedLang');
    const selectMobileLangElem = document.getElementById('selectMobileLang');
    selectedLangElem.innerHTML = selectMobileLangElem.innerHTML = `
        <img src="./assets/imgs/flags/` + languages[0].flag + `" width="24" />
        <span class="fs-6">` + languages[0].language + `</span>
        <span class="material-icons fs-4 inline-icon text-bold">expand_more</span>
    `;

    const selectionElem = document.getElementById('langSelection');
    const mobileSelectionElem = document.getElementById('mobileCountrySelection');
    let ind = 0;
    languages.forEach((itm) => {
        const active = ind === 0 ? 'active' : 0
        selectionElem.innerHTML += `
            <li>
                <button class="dropdown-item ` + active + `" onclick="onLangSelection(` + ind + `)">
                    <img src="./assets/imgs/flags/` + itm.flag + `" width="24" /> 
                    <span class="fs-6">` + itm.language + `</span>
                </button>
            </li>`;

        mobileSelectionElem.innerHTML += `
            <li>
                <button class="dropdown-item ` + active + `" onclick="onLangSelection(` + ind + `)">
                    <img src="./assets/imgs/flags/` + itm.flag + `" width="24" /> 
                    <span class="fs-6">` + itm.language + `</span>
                </button>
            </li>`;
        ind++;
    });
}

const onLangSelection = (ind) => {
    console.log(ind);
}

const onCurrencySelection = (cur) => {
    let selectionElem = document.getElementById(settings.currency);
    let mobileSelectionElem = document.getElementById('mob-' + settings.currency);
    selectionElem.classList.remove('active');
    mobileSelectionElem.classList.remove('active');

    settings.currency = cur;
    const currencySelection = document.getElementById('currencySelection');
    const mobileCurrencySelection = document.getElementById('mobileCurrencySelection');

    currencySelection.innerHTML = mobileCurrencySelection.innerHTML = `
        <span class="fs-6">` + settings.currency + `</span>
        <span class="material-icons fs-4 inline-icon text-bold">expand_more</span>
    `;

    selectionElem = document.getElementById(settings.currency);
    mobileSelectionElem = document.getElementById('mob-' + settings.currency);
    selectionElem.classList.add('active');
    mobileSelectionElem.classList.add('active');

    if (history.pushState) {
        const params = new URLSearchParams(location.search);
        if (params.get('currency') !== settings.currency) {
            const newUrl = window.location.href + '&currency=' + settings.currency;
            window.history.pushState({
                path: newUrl
            }, '', newUrl);
        }
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

const showToast = (message, bg = 'light') => {
    const bgObj = {
        'primary': 'white',
        'secondary': 'white',
        'white': 'dark',
        'light': 'dark',
        'danger': 'white',
        'success': 'white'
    }
    const toastElList = [].slice.call(document.querySelectorAll('.toast'))
    const toastList = toastElList.map(function (toastEl) {
        return new bootstrap.Toast(toastEl)
    });
    const toast = document.getElementById('toast');
    toast.classList.add('bg-' + bg);
    toast.classList.add('text-' + bgObj[bg]);
    toastList.forEach(toast => toast.show());
    document.getElementById('toast-msg').innerHTML = message;
}

const saveContactUsInfo = async () => {
    contact.first_last_name = document.getElementById('fullname').value.trim();
    contact.email = document.getElementById('email').value.trim();
    contact.message = document.getElementById('note').value.trim();
    console.log(contact)
    if (!contact.check_in || !contact.first_last_name || !contact.check_out || !contact.email || !contact.message) {
        showToast('Please add all details.', 'danger');
        return;
    }
    sendMessage(contact);
    const modal = bootstrap.Modal.getInstance(document.getElementById("contactModal"));
    modal.hide();
    showToast('<span class="material-icons fs-5 inline-icon text-bold">check_circle</span> Email Sent.', 'success')
}

const resetContactUs = () => {
    contact.check_in = contact.check_out = contact.first_last_name = contact.email = contact.message = '';
    document.getElementById('fullname').value = '';
    document.getElementById('email').value = '';
    document.getElementById('note').value = '';
}