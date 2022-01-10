/** Common API call - start */
// let apiLink = "../../../api/";
const apiLink = "https://newdb.otasync.me/api/";
const doPost = (url, data, contentType = '') => {
    return new Promise((resolve, reject) => {
        const request = {
            url: apiLink + url,
            method: 'POST',
            data,
            success: (response) => {
                if (response) {
                    resolve(JSON.parse(response));
                    return;
                }
                reject(response);
            },
            error: (err) => {
                console.error(err);
                reject(err);
            }
        }

        if (contentType) {
            request.contentType = contentType;
        }
        $.ajax(request);
    })
}
/** Common API call - end */

/** Setting API call - start */
const getSettings = () => {
    const params = new URLSearchParams(location.search);
    const data = { id_properties: params.get('id_properties') };
    return doPost('engine/data/settings', data);
}

const getExtrasAndRooms = () => {
    const params = new URLSearchParams(location.search);
    const data = { id_properties: params.get('id_properties') };
    return doPost('engine/data/getSettings', data);
}
/** Setting API call - end */

/** Room API call - start */
const getRooms = (guests, currency, date_arrival, date_departure) => {
    const params = new URLSearchParams(location.search);
    const data = {
        id_properties: params.get('id_properties'),
        id_language: params.get('language'),
        guests: guests,
        currency: currency,
        dfrom: date_arrival,
        dto: date_departure
    };
    return doPost('engine/data/getRooms', data);
}

const getActiveReservationRoomDetails = (dfrom, dto, id_room_types, id_pricing_plans, currency) => {
    const params = new URLSearchParams(location.search);
    const data = {
        id_properties: params.get('id_properties'),
        id_language: params.get('language'),
        dfrom, dto, id_room_types,
        id_pricing_plans, currency
    };
    return doPost('engine/data/room', data);
}

const getSpecialOffer = (adults, children, date_arrival, date_departure) => {
    const params = new URLSearchParams(location.search);
    const data = {
        id_properties: params.get('id_properties'),
        id_language: params.get('language'),
        adults,
        children,
        dfrom: date_arrival,
        dto: date_departure
    };
    return doPost('engine/data/special_offers', data);
}

const getSpecialOfferAvailability = (id_special_offers) => {
    const params = new URLSearchParams(location.search);
    const data = {
        id_properties: params.get('id_properties'),
        id_special_offers
    };
    return doPost('engine/data/special_offer_availability', data);
}

const getSpecialOfferRooms = (id_special_offers, dfrom, dto, currency) => {
    const params = new URLSearchParams(location.search);
    const data = {
        id_properties: params.get('id_properties'),
        id_language: params.get('language'),
        id_special_offers, dfrom, dto, currency
    };
    return doPost('engine/data/special_offer_rooms', data);
}

const getSpecialWithPricingPlan = (id_room_types, dfrom, dto, currency) => {
    const params = new URLSearchParams(location.search);
    const data = {
        id_properties: params.get('id_properties'),
        id_language: params.get('language'),
        id_room_types, dfrom, dto, currency
    };
    return doPost('engine/data/getRoomWithPricingPlans', data);
}

const getRoomsByDates = (guests, currency, dfrom, dto) => {
    const params = new URLSearchParams(location.search);
    const data = {
        id_properties: params.get('id_properties'),
        id_language: params.get('language'),
        guests, currency,
        dfrom, dto
    };
    return doPost('engine/data/getRoomsByDates', data);
}

const getPolicy = (id_pricing_plans) => {
    const params = new URLSearchParams(location.search);
    const data = {
        id_properties: params.get('id_properties'),
        id_language: params.get('language'),
        id_pricing_plans
    };
    return doPost('engine/data/policy', data);
}
/** Room API call - end */

/** Reservation API call - start */
const addDataBeforeReservation = (data) => {
    $.ajax({
        url: apiLink + 'engine/insert/data_before_reservation',
        method: 'POST',
        contentType: "application/json",
        data: JSON.stringify(data),
        dataType: 'json',
        processData: false,
        success: () => { },
        error: () => { }
    });
}
const addReservation = (data) => {
    return doPost('engine/insert/reservations', JSON.stringify(data), "application/json");
}
/** Reservation API call - end */

/** Promo code api call - start */
const getPromoCode = (value) => {
    const params = new URLSearchParams(location.search);
    const data = { id_properties: params.get('id_properties'), value };
    return doPost('engine/data/getPromocode', data);
}
/** Promo code api call - end */

/** Language api call - start */
const getLanguage = () => {
    const params = new URLSearchParams(location.search);
    const data = { id_properties: params.get('id_properties') };
    return doPost('engine/data/languages', data);
}
/** Language api call - end */

/** Extra api call - start */
const getExtras = (currency) => {
    const params = new URLSearchParams(location.search);
    const data = {
        id_properties: params.get('id_properties'),
        id_language: params.get('language'),
        currency
    };
    return doPost('engine/data/extras', data);
}
/** Extra api call - end */

/** Contact US api call - start */
const sendMessage = (data) => {
    const params = new URLSearchParams(location.search);
    data.id_properties = params.get('id_properties');
    return doPost('engine/insert/sendMessage', data);
}
/** Contact US api call - start */