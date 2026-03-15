function setLang(lang) {
    document.querySelectorAll(`[data-${lang}]`).forEach(el => {
        el.innerText = el.getAttribute(`data-${lang}`);
    });
    localStorage.setItem('prefLang', lang);
}
window.onload = () => {
    setLang(localStorage.getItem('prefLang') || 'en');
};

