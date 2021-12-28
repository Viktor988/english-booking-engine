let dfrom = '';
let dto = '';
let settings = {};
let languages = [];
let adults = 1;
let children = 0;

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
    fetchRoomList();
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

const fetchRoomList = async () => {
    const specialRooms = await getSpecialOffer(adults, children, dfrom, dto);
    let rooms = specialRooms;
    const resp = await getRooms(adults, settings.currency, dfrom.dto);
    rooms = [...rooms, ...resp.rooms];
    const elem = document.getElementById('room-card');
    const params = new URLSearchParams(location.search);
    let ind = 0;
    rooms.forEach(itm => {
        const room = itm.room_details;
        console.log(itm)
        let imageSlider = '';
        let imageItem = '';
        let imageButton = '';
        let roomInd = 0;
        room.roomImages.forEach(img => {
            const active = roomInd === 0 ? 'active' : '';
            imageItem += `
            <div class="carousel-item h-100 ` + active + `">
                <img src="` + img.url + `" class="d-block w-100 h-100 slider-image-border-radius"
                    alt="room" />
            </div>
            `;

            imageButton += `
            <button type="button" data-bs-target="#roomImages` + ind + `" data-bs-slide-to="` + roomInd + `" class="` + active + ` dot" aria-current="true" aria-label="Slide"></button>
            `;
            roomInd++;
        });

        imageSlider += `
            <div id="roomImages` + ind + `" class="carousel slide rounded-start h-100" data-bs-ride="carousel">
                <div class="carousel-indicators">
                    ` + imageButton + `
                </div>
                <div class="carousel-inner slider-image-border-radius h-100">
                    ` + imageItem + `
                </div>
            </div>
        `;

        elem.innerHTML += `
        <div class="card m-3 border-radius-16 shadow room-info-card">
            <div class="row g-0">
                <div class="col-md-4">
                    ` + imageSlider + `
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-8">
                                <h2 class="card-title mb-2"><b>` + itm.name + `</b></h2>
                                <p class="card-text fs-6 description m-0 mb-1">
                                    ` + itm.description + `
                                </p>
                                <button class="btn bg-white text-bright-yellow btn-sm fs-6 ps-0" data-bs-toggle="modal"
                                    data-bs-target="#roomInfoModal">More
                                    about property</button>
                            </div>
                            <div class="col-4">
                                <div class="fs-6 bg-occur-yellow text-white p-2 price-badge">
                                    <span>Price from <b class="fs-6">` + itm.price + `</b> ` + params.get('currency') + `</span>
                                </div>
                                <div class="room-info mb-3 mt-5 text-end">
                                    <span class="fs-6 p-2 border-end">
                                        <span class="material-icons inline-icon">people</span> ` + itm.occupancy + `
                                    </span>
                                    <span class="fs-6 p-2 border-end">
                                        <span class="material-icons inline-icon">bed</span> 2
                                    </span>
                                    <span class="fs-6 p-2">
                                        <span class="material-icons inline-icon">home</span>
                                        60m²
                                    </span>
                                </div>
                                <div class="amenity-icon text-end">
                                    <span class="material-icons fs-4">wifi</span>
                                    <span class="material-icons fs-4">ac_unit</span>
                                    <span class="material-icons fs-4">satellite_alt</span>
                                    <span class="material-icons fs-4">liquor</span>
                                </div>
                            </div>
                        </div>
                    </div>
        
                    <!-- availability option start -->
                    <div class="col-12 bg-light-grey ps-1 pe-1 position-relative">
                        <div class="row">
                            <div class="col-md-4 pb-1">
                                <div class="row">
                                    <div class="col-5 p-0 ps-3">
                                        <span class="font-size-12">Check-In</span><br>
                                        <b class="font-size-14">11 November</b>
                                    </div>
                                    <div class="col-2 p-0">
                                        <span class="material-icons fs-5 mt-3 text-occur-yellow">east</span>
                                    </div>
                                    <div class="col-5 p-0">
                                        <span class="font-size-12">Check-Out</span><br>
                                        <b class="font-size-14">11 November</b>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-3 p-1 text-center">
                                <div class="dropdown pt-2">
                                    <button class="btn bg-white fs-7 text-dark dropdown-toggle p-1" type="button"
                                        id="priceRateDropdDown1" data-bs-toggle="dropdown" aria-expanded="false">
                                        <span>Standard Rate</span>
                                        <span class="material-icons inline-icon text-bold fs-4">expand_more</span>
                                    </button>
                                    <ul class="dropdown-menu selection-dropdown-lg" aria-labelledby="priceRateDropdDown1">
                                        <li class="dropdown-item">
                                            <div class="row">
                                                <div class="col-6">
                                                    <b class="fs-5">Standard Rate</b>
                                                </div>
                                                <div class="col-6 text-end">
                                                    <span class="font-size-10">Per night</span>
                                                    <b class="fs-5">25</b>
                                                </div>
                                                <div class="col-12">
                                                    <span class="text-light-grey fs-6"><b>Description</b></span>
                                                    <p class="font-size-12 mb-1">Here is the test
                                                        description</p>
                                                    <span class="text-light-grey fs-6"><b>Cancellation
                                                            Policy</b>
                                                    </span>
                                                    <p class="font-size-12">Here is the test policy</p>
                                                </div>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div class="col-md-3 p-1">
                                <div class="row pt-1">
                                    <div class="col-md-4 fs-6 pt-2">
                                        <span>Unit</span>
                                    </div>
                                    <div class="col-md-8">
                                        <div class="d-grid gap-3 d-md-block">
                                            <button class="btn btn-outline-dark btn-sm p-0 ps-1 pe-1 fs-6" type="button">
                                                <span class="material-icons m-1 fs-6">remove</span>
                                            </button>
                                            <button class="btn btn-sm bg-light-grey text-dark fs-6" type="button">
                                                2
                                            </button>
                                            <button class="btn btn-outline-dark btn-sm p-0 ps-1 pe-1 fs-6" type="button">
                                                <span class="material-icons m-1 fs-6">add</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-md-2">
                                <button class="btn btn-dark ps-4 pe-4 border-0 position-absolute top-0 end-0 h-100"
                                    onclick="window.location.href = 'booking.html'">
                                    <span class="fs-5">Book</span>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="row ps-2 mt-2 mb-2">
                        <div class="col-md-4 text-center">
                            <span class="fs-5">11 days</span>
                        </div>
                        <div class="col-md-3">
                            <div class="row">
                                <div class="col-5 p-0 text-end">
                                    <div class="fs-6">25 <sup>EUR</sup></div>
                                    <div class="font-size-10 text-light-grey">Per Night</div>
                                </div>
                                <div class="col-2 p-0 pt-1 text-center text-light-grey fw-lighter">/</div>
                                <div class="col-5 p-0">
                                    <div class="fs-6"><b>275</b> <sup>EUR</sup></div>
                                    <div class="font-size-10 text-light-grey">Per Night</div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-3 text-center">
                            <span class="fs-5">2 rooms</span>
                        </div>
                        <div class="col-md-2 text-end pe-4">
                            <div class="fs-6"><b>550</b> <sup>EUR</sup></div>
                            <div class="font-size-8 text-light-grey">For staying</div>
                        </div>
                    </div>
                    <!-- availability option start -->
                </div>
            </div>
        </div>
        `;

        ind++;
    })
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