let roomList = [];

const fetchRoomList = async () => {
    showLoader();
    const specialRooms = await getSpecialOffer(adults, children, dfrom, dto);
    let rooms = specialRooms;
    const resp = await getRooms(adults, settings.currency, dfrom, dto);
    rooms = [...rooms, ...resp.rooms];
    getSpecialWithPricingPlan(resp.rooms[0].id_room_types, dfrom, dto, settings.currency).then(resp => {
        console.log(resp);
    })
    setDesktopRoomCard(rooms);
    setTabletRoomCard(rooms);
    setMobileRoomCard(rooms);
    setTimeout(() => {
        document.getElementById('room-card').style.display = 'block';
        document.getElementById('tablet-room-card').style.display = 'block';
        document.getElementById('mobile-room-card').style.display = 'block';
        if (dfrom && dto) {
            for (let i = 0; i < rooms.length; i++) {
                viewAvailability(i);
            }
        }
        hideLoader();
    }, 500);
}

const setDesktopRoomCard = (rooms) => {
    roomList = rooms;
    const elem = document.getElementById('room-card');
    let ind = 0;
    const fromDate = moment(dfrom);
    const toDate = moment(dto);
    const noOfDays = dfrom && dto ? toDate.diff(fromDate, 'days') + 1 : 0;
    console.log(noOfDays)
    roomList.forEach(itm => {
        const room = itm.room_details;
        if(room) {
            console.log(itm)
            let imageSlider = '';
            let imageItem = '';
            let imageButton = '';
            let roomInd = 0;
            let total_beds = 0;
            for (houseroom of room.room_types_houserooms) {
                total_beds += houseroom.beds.length;
            }
            room.roomImages.forEach(img => {
                const active = roomInd === 0 ? 'active' : '';
                imageItem += `
                <div class="carousel-item h-100 ` + active + `">
                    <img src="${img.url}" class="d-block w-100 h-100 slider-image-border-radius"
                        alt="room" />
                </div>
                `;
    
                imageButton += `
                <button type="button" data-bs-target="#roomImages${ind}" data-bs-slide-to="${roomInd}" class="${active} dot" aria-current="true" aria-label="Slide"></button>
                `;
                roomInd++;
            });
    
            imageSlider += `
                <div id="roomImages${ind}" class="carousel slide rounded-start h-100" data-bs-ride="carousel">
                    <div class="carousel-indicators">
                        ${imageButton}
                    </div>
                    <div class="carousel-inner slider-image-border-radius h-100" >
                        ${imageItem}
                    </div>
                </div>
            `;
    
            let amenitiesList = '';
            for (let i = 0; i < room.amenities.length; i++) {
                if (i === 5) {
                    break;
                }
                amenitiesList += `
                    <span class="amenity-icon me-2" data-bs-toggle="tooltip" title="${all_amenities[room.amenities[i].name].name}">${all_amenities[room.amenities[i].name].image}</span>
                `;
            }
    
            elem.innerHTML += `
            <div class="card m-3 border-radius-16 shadow room-info-card">
                <div class="row g-0">
                    <div class="col-md-4" style="max-height:270px">
                        ${imageSlider}
                    </div>
                    <div class="col-md-8">
                        <div class="card-body p-0 pt-4 ps-4">
                            <div class="row">
                                <div class="col-8">
                                    <h2 class="card-title mb-2"><b>${itm.name}</b></h2>
                                    <p class="card-text font-size-14 description m-0 mb-1">
                                        ${itm.description}
                                    </p>
                                    <button class="btn bg-white text-bright-yellow btn-sm font-size-14 ps-0" onclick="viewRoomDetail(${ind})">More
                                        about property</button>
                                </div>
                                <div class="col-4">
                                    <div class="font-size-14 bg-occur-yellow text-white p-2 price-badge">
                                        <span>Price from <b class="font-size-14">${itm.price}</b> ${settings.currency}</span>
                                    </div>
                                    <div class="room-info mb-4 mt-4 text-end">
                                        <span class="font-size-13 p-2 border-end">
                                            <span class="material-icons inline-icon">people</span> ${itm.occupancy}
                                        </span>
                                        <span class="font-size-13 p-2 border-end">
                                            <span class="material-icons inline-icon">bed</span> ${total_beds}
                                        </span>
                                        <span class="font-size-13 p-2">
                                            <span class="material-icons inline-icon">home</span>
                                            ${itm.area}m<sup>2</sup>
                                        </span>
                                    </div>
                                    <div class="text-end pt-3 pb-3">
                                        ${amenitiesList}
                                    </div>
                                </div>
                            </div>
                        </div>
    
                        <!-- view availability start -->
                        <div class="col-12 bg-light-grey p-2 mb-4" id="d-av-${ind}">
                            <div class="row p-1">
                                <div class="col-8">
                                    <button class="btn btn-dark btn-sm border-radius-8 fs-6" onclick="viewAvailability(${ind})">See
                                        availability</button>
                                </div>
                                <div class="col-4 pt-1" id="d-date-validation-${ind}" style="display:none;">
                                    <span class="fs-6">Pick a date to get rates</span>
                                </div>
                            </div>
                        </div>
                        <!-- view availability end -->
            
                        <!-- availability option start -->
                        <div class="col-12 bg-light-grey ps-1 pe-1 position-relative" id="av-${ind}" style="display:none">
                            <div class="row">
                                <div class="col-md-4 pb-1 pe-0">
                                    <div class="row">
                                        <div class="col-5 p-0 ps-3">
                                            <span class="font-size-12">Check-In</span><br>
                                            <b class="font-size-13">${moment(dfrom).format('DD MMMM')}</b>
                                        </div>
                                        <div class="col-2 p-0">
                                            <span class="material-icons fs-5 mt-3 text-occur-yellow">east</span>
                                        </div>
                                        <div class="col-5 p-0">
                                            <span class="font-size-12">Check-Out</span><br>
                                            <b class="font-size-13">${moment(dto).format('DD MMMM')}</b>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-3 p-1 text-center">
                                    <div class="dropdown pt-2">
                                        <button class="btn bg-white font-size-13 text-dark dropdown-toggle p-1" type="button"
                                            id="priceRateDropdDown1" data-bs-toggle="dropdown" aria-expanded="false">
                                            <span>Standard Rate</span>
                                            <span class="material-icons inline-icon text-bold font-size-18">expand_more</span>
                                        </button>
                                        <ul class="dropdown-menu selection-dropdown-lg" aria-labelledby="priceRateDropdDown1">
                                            <li class="dropdown-item">
                                                <div class="row">
                                                    <div class="col-6">
                                                        <b class="font-size-14">Standard Rate</b>
                                                    </div>
                                                    <div class="col-6 text-end">
                                                        <span class="font-size-10">Per night</span>
                                                        <b class="font-size-14">25</b>
                                                    </div>
                                                    <div class="col-12">
                                                        <span class="text-light-grey font-size-14"><b>Description</b></span>
                                                        <p class="font-size-12 mb-1">Here is the test
                                                            description</p>
                                                        <span class="text-light-grey font-size-14"><b>Cancellation
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
                                        <div class="col-md-4 font-size-14 pt-2">
                                            <span>Unit</span>
                                        </div>
                                        <div class="col-md-8">
                                            <div class="d-grid gap-3 d-md-block">
                                                <button class="btn btn-outline-dark btn-sm p-0 ps-1 pe-1 font-size-14" type="button">
                                                    <span class="material-icons m-1 font-size-14">remove</span>
                                                </button>
                                                <button class="btn btn-sm bg-light-grey text-dark font-size-14" type="button">
                                                    ${adults}
                                                </button>
                                                <button class="btn btn-outline-dark btn-sm p-0 ps-1 pe-1 font-size-14" type="button">
                                                    <span class="material-icons m-1 font-size-14">add</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-2 ps-0">
                                    <button class="btn btn-dark ps-4 pe-4 border-0 position-absolute top-0 end-0 h-100"
                                        onclick="window.location.href = 'booking.html'">
                                        <span class="fs-5">Book</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="row ps-2 mt-2 mb-2" id="pd-${ind}" style="display:none;">
                            <div class="col-md-4 text-center">
                                <span class="fs-5">${noOfDays} days</span>
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
        }
    })
}

const setTabletRoomCard = (rooms) => {
    roomList = rooms;
    const elem = document.getElementById('tablet-room-card');
    const params = new URLSearchParams(location.search);
    let ind = 0;
    roomList.forEach(itm => {
        const room = itm.room_details;
        if (room) {
            let imageItem = '';
            let roomInd = 0;
            let total_beds = 0;
            for (houseroom of room.room_types_houserooms) {
                total_beds += houseroom.beds.length;
            }
            room.roomImages.forEach(img => {
                const active = roomInd === 0 ? 'active' : '';
                imageItem += `
                <div class="carousel-item h-100 ` + active + `">
                    <img src="${img.url}" class="d-block w-100 h-100 slider-image-border-radius-tab"
                        alt="room" />
                </div>
                `;
                roomInd++;
            });

            let amenitiesList = '';
            for (let i = 0; i < room.amenities.length; i++) {
                if (i === 5) {
                    break;
                }
                amenitiesList += `
                    <span class="amenity-icon me-2" data-bs-toggle="tooltip" data-bs-placement="bottom" title="${all_amenities[room.amenities[i].name].name}">${all_amenities[room.amenities[i].name].image}</span>
                `;
            }

            elem.innerHTML += `
                <div class="card m-3 border-radius-16 shadow room-info-card">
                    <div class="row g-0">
                        <div class="col-md-4">
                            <div class="position-relative">
                                <div class="text-white text-center"
                                    style="position: absolute; z-index: 999; bottom: 5%; left: 0; right: 0; margin-left: auto; margin-right: auto; width: 100%;">
                                    <span class="font-size-12 p-2 border-end">
                                        <span class="material-icons inline-icon">people</span>
                                        <span class="font-size-11">${itm.occupancy}</span>
                                    </span>
                                    <span class="font-size-12 p-2 border-end">
                                        <span class="material-icons inline-icon">bed</span>
                                        <span class="font-size-11">${total_beds}</span>
                                    </span>
                                    <span class="font-size-12 p-2">
                                        <span class="material-icons inline-icon">home</span>
                                        <span class="font-size-11">${itm.area}m<sup>2</sup></span>
                                    </span>
                                </div>
                                <div id="tabRoomImages${ind}" class="carousel slide rounded-start h-100"
                                    data-bs-ride="carousel">
                                    <div class="carousel-inner slider-image-border-radius-tablet h-100">
                                    ${imageItem}
                                    </div>
                                    <button class="carousel-control-prev" type="button"
                                        data-bs-target="#tabRoomImages${ind}" data-bs-slide="prev">
                                        <span
                                            class="carousel-control-prev-icon absolute-left bg-mid-grey text-white p-2"
                                            aria-hidden="true"></span>
                                        <span class="visually-hidden">Previous</span>
                                    </button>
                                    <button class="carousel-control-next" type="button"
                                        data-bs-target="#tabRoomImages${ind}" data-bs-slide="next">
                                        <span
                                            class="carousel-control-next-icon absolute-right bg-mid-grey text-white p-2"
                                            aria-hidden="true"></span>
                                        <span class="visually-hidden">Next</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-8">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-12">
                                        <div class="font-size-14 bg-occur-yellow text-white p-2 price-badge">
                                            <span>Price from <b class="font-size-14">${itm.price}</b> ${settings.currency}</span>
                                        </div>
                                        <h4 class="mb-2"><b>${itm.name}</b></h4>
                                        <p class="card-text font-size-14 description m-0 mb-4">${itm.description}</p>
                                    </div>
                                    <div class="col-6">
                                        <button class="btn bg-white text-bright-yellow btn-sm font-size-14 ps-0" onclick="viewRoomDetail(${ind})">More
                                            about property</button>
                                    </div>
                                    <div class="col-6">
                                        <div class="amenity-icon text-end">
                                            ${amenitiesList}
                                        </div>
                                    </div>
                                </div>
                            </div>
    
                            <!-- availability option start -->
                            <!-- <div class="col-12 bg-light-grey ps-1 pe-1 position-relative">
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
                                            <button class="btn bg-white fs-7 text-dark dropdown-toggle p-1"
                                                type="button" id="priceRateDropdDown1" data-bs-toggle="dropdown"
                                                aria-expanded="false">
                                                <span>Standard Rate</span>
                                                <span
                                                    class="material-icons inline-icon text-bold fs-4">expand_more</span>
                                            </button>
                                            <ul class="dropdown-menu selection-dropdown-lg"
                                                aria-labelledby="priceRateDropdDown1">
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
                                                            <span
                                                                class="text-light-grey fs-6"><b>Description</b></span>
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
                                                    <button class="btn btn-outline-dark btn-sm p-0 ps-1 pe-1 fs-6"
                                                        type="button">
                                                        <span class="material-icons m-1 fs-6">remove</span>
                                                    </button>
                                                    <button class="btn btn-sm bg-light-grey text-dark fs-6"
                                                        type="button">
                                                        2
                                                    </button>
                                                    <button class="btn btn-outline-dark btn-sm p-0 ps-1 pe-1 fs-6"
                                                        type="button">
                                                        <span class="material-icons m-1 fs-6">add</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-md-2">
                                        <button
                                            class="btn btn-dark ps-4 pe-4 border-0 position-absolute top-0 end-0 h-100"
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
                            </div> -->
                            <!-- availability option start -->
                        </div>
                    </div>
    
                    <!-- view availability start -->
                    <div class="col-12 bg-light-grey p-2 mb-4">
                        <div class="row p-1">
                            <div class="col-8">
                                <button class="btn btn-dark btn-sm border-radius-8 fs-6">See
                                    availability</button>
                            </div>
                            <div class="col-4 pt-1" id="t-date-validation-${ind}" style="display:none;">
                                <span class="fs-6">Pick a date to get rates</span>
                            </div>
                        </div>
                    </div>
                    <!-- view availability end -->
                </div>
            `;

            ind++;
        }
    })
}

const setMobileRoomCard = (rooms) => {
    roomList = rooms;
    const elem = document.getElementById('mobile-room-card');
    let ind = 0;
    roomList.forEach(itm => {
        const room = itm.room_details;
        if(room) {
            let imageItem = '';
            let roomInd = 0;
            let total_beds = 0;
            for (houseroom of room.room_types_houserooms) {
                total_beds += houseroom.beds.length;
            }
            room.roomImages.forEach(img => {
                const active = roomInd === 0 ? 'active' : '';
                imageItem += `
                <div class="carousel-item h-100 ` + active + `">
                    <img src="${img.url}" class="d-block w-100 h-100 slider-image-border-radius-mobile"
                        alt="room" />
                </div>
                `;
                roomInd++;
            });
    
            let amenitiesList = '';
            for (let i = 0; i < room.amenities.length; i++) {
                if (i === 5) {
                    break;
                }
                amenitiesList += `
                    <span class="amenity-icon me-2" data-bs-toggle="tooltip" title="${all_amenities[room.amenities[i].name].name}">${all_amenities[room.amenities[i].name].image}</span>
                `;
            }
    
            elem.innerHTML += `
                <div class="card mb-3 ms-3 me-3" style="border-radius: 12px;">
                    <div class="card-img-top position-relative">
                        <div class="font-size-14 bg-occur-yellow text-white p-2 price-badge-mobile">
                            <span>Price from <b class="font-size-14">${itm.price}</b> ${settings.currency}</span>
                        </div>
                        <div class="text-white text-center"
                            style="position: absolute; z-index: 999; bottom: 5%; left: 0; right: 0; margin-left: auto; margin-right: auto; width: 100%;">
                            <span class="font-size-12 p-2 border-end">
                                <span class="material-icons inline-icon">people</span>
                                <span class="font-size-11">${itm.occupancy}</span>
                            </span>
                            <span class="font-size-12 p-2 border-end">
                                <span class="material-icons inline-icon">bed</span>
                                <span class="font-size-11">${total_beds}</span>
                            </span>
                            <span class="font-size-12 p-2">
                                <span class="material-icons inline-icon">home</span>
                                <span class="font-size-11">${itm.area}m<sup>2</sup></span>
                            </span>
                        </div>
                        <div id="mobRoomImages${ind}" class="carousel slide rounded-start h-100" data-bs-ride="carousel">
                            <div class="carousel-inner slider-image-border-radius-mobile h-100">
                                ${imageItem}
                            </div>
                            <button class="carousel-control-prev" type="button" data-bs-target="#mobRoomImages${ind}"
                                data-bs-slide="prev">
                                <span class="carousel-control-prev-icon absolute-left bg-mid-grey text-white p-2"
                                    aria-hidden="true"></span>
                                <span class="visually-hidden">Previous</span>
                            </button>
                            <button class="carousel-control-next" type="button" data-bs-target="#mobRoomImages${ind}"
                                data-bs-slide="next">
                                <span class="carousel-control-next-icon absolute-right bg-mid-grey text-white p-2"
                                    aria-hidden="true"></span>
                                <span class="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                    <div class="card-body">
                        <h2 class="mb-2"><b><u>${itm.name}</u></b></h2>
                        <p class="card-text font-size-14 description m-0 mb-2">
                            ${itm.description}
                        </p>
                        <button class="btn bg-white text-bright-yellow btn-sm font-size-14 ps-0" onclick="viewRoomDetail(${ind})">More
                            about property</button>
    
                        <div class="amenity-icon">
                            ${amenitiesList}
                        </div>
    
                        <button type="button" class="btn btn-outline-dark mt-3 fw-bold" style="border: 2px solid;">Check availability</button>
                        <div class="fs-6 mt-3 fw-bold" id="m-date-validation-${ind}" style="display:none;">Pick a date to get rates</div>
                    </div>
                </div>
            `;
    
            ind++;
        }
    })
}

const viewRoomDetail = (ind) => {
    const modal = new bootstrap.Modal(document.getElementById("roomInfoModal"), {});
    modal.show();

    const room = roomList[ind];
    console.log(room)
    document.getElementById('roomName').innerHTML = room.name;

    let total_beds = 0;
    for (houseroom of room.room_details.room_types_houserooms) {
        total_beds += houseroom.beds.length;
    }

    let imgInd = 0;
    let indicators = '';
    let images = '';
    room.room_details.roomImages.forEach(img => {
        const active = imgInd === 0 ? 'active' : '';
        indicators += `
        <button type="button" data-bs-target="#roomImages2" data-bs-slide-to="${imgInd}" class="${active} dot" aria-current="true" aria-label="Slide ${imgInd}"></button>
        `;

        images += `
            <div class="carousel-item ${active}">
                <img src="${img.url}" class="d-block w-100 border-radius-10"
                    alt="room" />
            </div>
        `;
        imgInd++;
    });

    document.getElementById('ri-indicator').innerHTML = indicators;
    document.getElementById('ri-images').innerHTML = images;

    let amenities = `
        <div class="col-md-12 mt-2 mb-2">
            <h4><b>Amenities</b></h4>
        </div>
    `;
    room.room_details.amenities.forEach(am => {
        amenities += `
            <div class="col-md-4 p-2 text-dark-grey">
            <span class="modal-amenity-icon me-2" data-bs-toggle="tooltip">${all_amenities[am.name].image}</span>
                <span class="font-size-12">${all_amenities[am.name].name}</span>
            </div>
        `;
    });

    document.getElementById('ri-am').innerHTML = amenities;

    const room_info = `
        <span class="font-size-13 p-2 border-end">
            <span class="material-icons inline-icon">people</span> ${room.occupancy}
        </span>
        <span class="font-size-13 p-2 border-end">
            <span class="material-icons inline-icon">bed</span> ${total_beds}
        </span>
        <span class="font-size-13 p-2">
            <span class="material-icons inline-icon">home</span>
            ${room.area}m<sup>2</sup>
        </span>
    `;

    document.getElementById('ri-info').innerHTML = room_info;
    document.getElementById('ri-description').innerHTML = room.description;

    settings.currency

}

const viewAvailability = (ind) => {
    if (!dfrom || !dto) {
        const dElem = document.getElementById(`d-date-validation-${ind}`);
        if (dElem) dElem.style.removeProperty('display');

        const tElem = document.getElementById(`t-date-validation-${ind}`);
        if (tElem) tElem.style.removeProperty('display');

        const mElem = document.getElementById(`m-date-validation-${ind}`);
        if (mElem) mElem.style.removeProperty('display');
        return;
    }
    document.getElementById('d-av-' + ind).style.display = 'none';
    const elem = document.getElementById('av-' + ind);
    const elem2 = document.getElementById('pd-' + ind);
    elem.style.removeProperty('display')
    elem2.style.removeProperty('display')
}

let all_amenities = {};
all_amenities['air-conditioning'] = {
    name: 'Air conditioning',
    image: `<svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation" title="air-conditioning"><path d="M22 11h-4.17l3.24-3.24-1.41-1.42L15 11h-2V9l4.66-4.66-1.42-1.41L13 6.17V2h-2v4.17L7.76 2.93 6.34 4.34 11 9v2H9L4.34 6.34 2.93 7.76 6.17 11H2v2h4.17l-3.24 3.24 1.41 1.42L9 13h2v2l-4.66 4.66 1.42 1.41L11 17.83V22h2v-4.17l3.24 3.24 1.42-1.41L13 15v-2h2l4.66 4.66 1.41-1.42L17.83 13H22z"></path></svg>`
};
all_amenities['heading'] = {
    name: 'Heating',
    image: `<img src="https://img.icons8.com/ios/25/000000/heating.png">`
};
all_amenities['tv-cable'] = {
    name: 'TV (Cable)',
    image: `<svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation"><path d="M21 3H3c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h5v2h8v-2h5c1.1 0 1.99-.9 1.99-2L23 5c0-1.1-.9-2-2-2zm0 14H3V5h18v12z"></path></svg>`
};
all_amenities['tv-satellite'] = {
    name: 'TV (Satellite)',
    image: `<img src="https://img.icons8.com/ios/25/000000/satellite-sending-signal.png">`
};
all_amenities['kitchen'] = {
    name: 'Kitchen',
    image: `<img src="https://img.icons8.com/ios/25/000000/kitchen-room.png">`
};
all_amenities['hob'] = {
    name: 'Hob',
    image: `<img src="https://img.icons8.com/wired/25/000000/cooker.png">`
};
all_amenities['oven'] = {
    name: 'Oven',
    image: `<img src="https://img.icons8.com/carbon-copy/25/000000/cooker.png">`
};
all_amenities['microwave'] = {
    name: 'Microwave',
    image: `<img src="https://img.icons8.com/dotty/25/000000/microwave.png">`
};
all_amenities['laundry'] = {
    name: 'Washing machine',
    image: `<svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation"><path d="M9.17 16.83c1.56 1.56 4.1 1.56 5.66 0 1.56-1.56 1.56-4.1 0-5.66l-5.66 5.66zM18 2.01L6 2c-1.11 0-2 .89-2 2v16c0 1.11.89 2 2 2h12c1.11 0 2-.89 2-2V4c0-1.11-.89-1.99-2-1.99zM10 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM7 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm5 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"></path></svg>`
};
all_amenities['teapot'] = {
    name: 'Teapot',
    image: `<img src="https://img.icons8.com/ios/25/000000/teapot.png">`
};
all_amenities['minibar'] = {
    name: 'Minibar',
    image: `<img src="https://img.icons8.com/ios/25/000000/mini-bar.png">`
};
all_amenities['fridge'] = {
    name: 'Fridge',
    image: `<img src="https://img.icons8.com/ios/25/000000/fridge.png">`
};
all_amenities['internet'] = {
    name: 'Internet',
    image: `<svg class="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true" role="presentation"><path d="M1 9l2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8l3 3 3-3c-1.65-1.66-4.34-1.66-6 0zm-4-4l2 2c2.76-2.76 7.24-2.76 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"></path></svg>`
};
all_amenities['private-bathroom'] = {
    name: 'Private bathroom',
    image: `<img src="https://img.icons8.com/ios/25/000000/toilet-room.png">`
};
all_amenities['shared-bathroom'] = {
    name: 'Shared bathroom',
    image: `<img src="https://img.icons8.com/ios/25/000000/toilet-room.png">`
};
all_amenities['cradle'] = {
    name: 'Cradle',
    image: `<img src="https://img.icons8.com/carbon-copy/25/000000/crib.png">`
};
all_amenities['private-toilet'] = {
    name: 'Private toilet',
    image: `<img src="https://img.icons8.com/ios/25/000000/toilet-room.png">`
};
all_amenities['hair-dryer'] = {
    name: 'Hair dryer',
    image: `<img src="https://img.icons8.com/ios/25/000000/hair-dryer.png">`
};
all_amenities['shower'] = {
    name: 'Shower',
    image: `<img src="https://img.icons8.com/ios/25/000000/shower.png">`
};
all_amenities['tub'] = {
    name: 'Tub',
    image: `<img src="https://img.icons8.com/ios/25/000000/shower-and-tub.png">`
};
all_amenities['jacuzzi'] = {
    name: 'Jacuzzi',
    image: ``
};
all_amenities['balcony'] = {
    name: 'Balcony',
    image: `<img src="https://img.icons8.com/ios/25/000000/balcony.png">`
};
all_amenities['terrace'] = {
    name: 'Terrace',
    image: ``
};
all_amenities['sea-view'] = {
    name: 'Sea view',
    image: `<img src="https://img.icons8.com/metro/25/000000/sea-waves.png">`
};
all_amenities['city-view'] = {
    name: 'City view',
    image: `<img src="https://img.icons8.com/ios/25/000000/city.png">`
};
all_amenities['mountain-view'] = {
    name: 'Mountain view',
    image: `<img src="https://img.icons8.com/ios/25/000000/mountain.png">`
};
all_amenities['pool'] = {
    name: 'Pool',
    image: `<img src="https://img.icons8.com/ios/25/000000/lap-pool.png">`
};
all_amenities['sauna'] = {
    name: 'Sauna',
    image: `<img src="https://img.icons8.com/ios/25/000000/sauna.png">`
};
all_amenities['ironing-facility'] = {
    name: 'Ironing facility',
    image: ``
};