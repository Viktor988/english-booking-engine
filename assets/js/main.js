let dfrom = '';
let dto = '';
let settings = {};
let languages = [];

$(document).ready(() => {
    initPage();
});

const initPage = () => {
    initDatePicker();
    setHeader();

    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map((elem) => {
        return new bootstrap.Popover(elem);
    });

    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    tooltipTriggerList.map((tooltipTriggerEl) => {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    });


    const params = new URLSearchParams(location.search);
    dfrom = params.get('dfrom') ? params.get('dfrom') : '';
    dto = params.get('dto') ? params.get('dto') : '';
    if (dfrom && dto) {
        const fromDate = moment(dfrom).format('DD MMMM');
        const toDate = moment(dto).format('DD MMMM');
        setDate(fromDate, toDate);
    }
}

const initDatePicker = () => {
    $('#dateRange').daterangepicker({
        opens: 'left'
    }, (start, end, label) => {
        dfrom = start.format('YYYY-MM-DD');
        dto = end.format('YYYY-MM-DD')
        setDate(start.format('DD MMMM'), end.format('DD MMMM'));
    });
}

const setHeader = async () => {
    const resp = await getSettings();
    console.log(resp);
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
    setLanguages();
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
        window.history.pushState({ path: newUrl }, '', newUrl);

    }
}

const setLanguages = async () => {
    const resp = await getLanguage();
    languages = resp.languages;
    const selectedLangElem = document.getElementById('selectedLang');
    const selectMobileLangElem = document.getElementById('selectMobileLang');
    selectedLangElem.innerHTML = selectMobileLangElem.innerHTML = `
        <img src="./assets/imgs/flags/`+ languages[0].flag + `" width="24" />
        <span class="fs-6">`+ languages[0].language + `</span>
        <span class="material-icons fs-4 inline-icon text-bold">expand_more</span>
    `;

    const selectionElem = document.getElementById('langSelection');
    const mobileSelectionElem = document.getElementById('mobileCountrySelection');
    let ind = 0;
    languages.forEach((itm) => {
        const active = ind === 0 ? 'active' : 0
        selectionElem.innerHTML += `
            <li>
                <button class="dropdown-item `+ active + `" onclick="onLangSelection(` + ind + `)">
                    <img src="./assets/imgs/flags/`+ itm.flag + `" width="24" /> 
                    <span class="fs-6">`+ itm.language + `</span>
                </button>
            </li>`;

        mobileSelectionElem.innerHTML += `
            <li>
                <button class="dropdown-item `+ active + `" onclick="onLangSelection(` + ind + `)">
                    <img src="./assets/imgs/flags/`+ itm.flag + `" width="24" /> 
                    <span class="fs-6">`+ itm.language + `</span>
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
        <span class="fs-6">`+ settings.currency + `</span>
        <span class="material-icons fs-4 inline-icon text-bold">expand_more</span>
    `;

    selectionElem = document.getElementById(settings.currency);
    mobileSelectionElem = document.getElementById('mob-' + settings.currency);
    selectionElem.classList.add('active');
    mobileSelectionElem.classList.add('active');

    if (history.pushState) {
        const newUrl = window.location.href + '&currency=' + settings.currency;
        window.history.pushState({ path: newUrl }, '', newUrl);
    }
}

const fetchSpecialOffer = async () => {
    const resp = await getSpecialOffer()
}

const setFocus = (id) => {
    setTimeout(() => {
        document.getElementById(id).focus();
    }, 700);
}

const onPromoCodeEnter = () => {
    const elem = document.getElementById('promocode');
    const val = elem.value;
    const btn = document.getElementById('submitPromo');
    btn.style.display = val ? "block" : "none";
    if (val) {
        elem.className.concat('border-end-0');
        elem.style.borderRadius = '10px 0px 0px 10px';
    } else {
        elem.style.borderRadius = '10px';
    }
}