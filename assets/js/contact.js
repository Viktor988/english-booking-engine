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