let extras = [];
let selectedExtras = [];

const setExtra = async () => {
    const settings = JSON.parse(sessionStorage.getItem('settings'));
    const resp = await getExtras(settings.currency);
    extras = resp.extras;
    if (resp.extras && resp.extras.length) {
        let htmlContent = '';
        let tabletContent = '';
        let ind = 0;
        resp.extras.forEach(elm => {
            let des = '';
            elm.unit = 0;
            let tDes = '';
            if (elm.description) {
                des += `<p class="font-size-12 mt-2">${elm.description}</p>`;
                tDes += `<p class="font-size-14 mt-2" style="font-weight: 600;">${elm.description}</p>`;
            }

            htmlContent += `
                <div class="col-lg-4 d-lg-block d-none p-4">
                    <div class="card border-radius-16">
                        <img class="card-img-top" style="border-radius: 16px 16px 0 0;"
                            src="${elm.image}" />
                        <div class="card-body">
                            <div>
                                <b>${elm.name}</b>
                                <!--<span class="float-end text-occur-yellow">(x1 included in the room)</span>-->
                            </div>
                            ${des}
                            <div class="text-center"><b>${elm.price} ${settings.currency}</b></div>
                            <div class="row mt-2">
                                <div class="col-md-6">
                                    <div class="d-grid gap-3 d-md-block">
                                        <button class="btn btn-outline-dark btn-sm p-0 ps-1 pe-1" type="button"
                                            style="font-size: 0.9rem;" onclick="changeExtraUnit(${ind},'rm')">
                                            <span class="material-icons m-1"
                                                style="font-size: 0.9rem;">remove</span>
                                        </button>
                                        <button class="btn btn-sm bg-white text-dark" type="button"
                                            style="font-size: 0.9rem;">
                                            <span id="qty-${ind}">0</span>
                                        </button>
                                        <button class="btn btn-outline-dark btn-sm p-0 ps-1 pe-1" type="button"
                                            style="font-size: 0.9rem;" onclick="changeExtraUnit(${ind},'add')">
                                            <span class="material-icons m-1" style="font-size: 0.9rem;">add</span>
                                        </button>
                                    </div>
                                </div>
                                <div class="col-md-6 text-end">
                                    <button class="btn bg-occur-yellow text-white p-0 ps-4 pe-4" onclick="addExtra(${ind})">Add</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            tabletContent += `
                <div class="col-md-6 col-12 d-lg-none d-block ps-sm-5 pe-sm-5 pt-3 pb-3 ps-md-3 pe-md-3">
                    <div class="card border-radius-16 shadow-lg">
                        <img class="m-3 border-radius-8" src="${elm.image}" />
                        <div class="card-body">
                            <div class="font-size-16">
                                <b>${elm.name}</b>
                                <!--<span class="text-occur-yellow">(x1 included in the room)</span>-->
                            </div>
                            ${tDes}
                            <div class="text-center mt-2 mb-2"><b>${elm.price} ${settings.currency}</b></div>
                            <div class="row mt-2">
                                <div class="col-6">
                                    <div class="row">
                                        <div class="col-5 p-0 text-end">
                                            <button class="btn btn-outline-dark btn-sm font-size-12 p-0 ps-1 pe-1"
                                                type="button" onclick="changeExtraUnit(${ind},'rm')">
                                                <span class="material-icons m-1">remove</span>
                                            </button>
                                        </div>
                                        <div class="col-2 p-0 text-center">
                                            <button class="btn btn-sm bg-white text-dark" type="button">
                                                <span class="font-size-14" id="t-qty-${ind}">0</span>
                                            </button>
                                        </div>
                                        <div class="col-5 p-0">
                                            <button class="btn btn-outline-dark btn-sm font-size-12 p-0 ps-1 pe-1"
                                                type="button" onclick="changeExtraUnit(${ind},'add')">
                                                <span class="material-icons m-1">add</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-6 text-end text-center">
                                    <button class="btn bg-occur-yellow w-75 text-white p-1 ps-4 pe-4" onclick="addExtra(${ind})">Add</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            ind++;
        });

        document.getElementById('extras').innerHTML = htmlContent + tabletContent;
    }
}

const changeExtraUnit = (ind, operation) => {
    if (operation === 'add') {
        extras[ind].unit++;
    } else {
        if (extras[ind].unit !== 0) {
            extras[ind].unit--;
        }
    }

    const d1 = document.getElementById('qty-' + ind);
    if (d1) d1.innerHTML = extras[ind].unit;
    const t1 = document.getElementById('t-qty-' + ind);
    if (t1) t1.innerHTML = extras[ind].unit;
}

const addExtra = (ind) => {
    if (extras[ind].unit === 0) {
        showToast('Please add the quantity detail.', 'warning');
        return;
    }
    const eId = selectedExtras.findIndex(x => x.id_extras === extras[ind].id_extras);
    if (eId > -1) {
        selectedExtras[eId].unit = extras[ind].unit;
        document.getElementById('d-' + extras[ind].id_extras).innerHTML = extras[ind].unit + 'x';
    } else {
        selectedExtras.push(extras[ind]);
        const d1 = document.getElementById('d-services')
        if (d1) {
            const elem = document.createElement('div');
            elem.innerHTML = `
            <div class="row font-size-14">
                    <div class="col-12">
                        <p class="font-size-12 mb-1">
                        ${extras[ind].name}
                        </p>
                    </div>
                    <div class="col-3">
                        <span id="d-${extras[ind].id_extras}">${extras[ind].unit}x</span>
                    </div>
                    <div class="col-6">
                        <span>${extras[ind].price} ${settings.currency}</span>
                    </div>
                    <!--<div class="col-3 text-end">
                        <span class="material-icons inline-icon">info</span>
                    </div>-->
                </div>
            `
            d1.appendChild(elem);
        }

        const t1 = document.getElementById('t-services');
        if (t1) {
            const elem = document.createElement('div');
            elem.innerHTML = `
            <div class="row font-size-14">
                <div class="col-12">
                    <p class="font-size-12 mb-1">
                    ${extras[ind].name}
                    </p>
                </div>
                <div class="col-3">
                    <span id="d-${extras[ind].id_extras}">${extras[ind].unit}x</span>
                </div>
                <div class="col-6">
                    <span>${extras[ind].price} ${settings.currency}</span>
                </div>
                <!--<div class="col-3 text-end">
                <span class="material-icons inline-icon">info</span>
                </div>-->
            </div>
        `
            t1.appendChild(elem)
        }
    }
}

setExtra();