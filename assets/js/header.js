const setHeader = async () => {
    const resp = await getSettings();
    settings = resp.settings;

    const params = new URLSearchParams(location.search);
    if (params.get('currency')) {
        settings.currency = params.get('currency');
        console.log(settings.currency)
    }

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
        const urlCurrency = params.get('currency');
        if (!urlCurrency) {
            const newUrl = window.location.href + '&currency=' + settings.currency;
            window.history.pushState({
                path: newUrl
            }, '', newUrl);
            initPage();
        } else if (urlCurrency !== settings.currency) {
            const url = new URL(window.location.href);
            url.searchParams.set('currency', settings.currency)
            initPage();
        }
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