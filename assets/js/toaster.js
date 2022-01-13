const toaster = new bootstrap.Toast(document.getElementById('toast'));

const showToast = (message, bg = 'light') => {
    const bgObj = {
        'primary': 'white',
        'secondary': 'white',
        'white': 'dark',
        'light': 'dark',
        'danger': 'white',
        'success': 'white'
    }

    const toast = document.getElementById('toast');
    toast.style.display = 'block';
    toast.classList.add('bg-' + bg);
    toast.classList.add('text-' + bgObj[bg]);
    toaster.show();
    document.getElementById('toast-msg').innerHTML = message;
}