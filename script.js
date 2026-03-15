function setLang(lang) {
    document.querySelectorAll(`[data-${lang}]`).forEach(el => {
        el.innerText = el.getAttribute(`data-${lang}`);
    });
    localStorage.setItem('preferredLang', lang);
}

window.onload = () => {
    const savedLang = localStorage.getItem('preferredLang') || 'en';
    setLang(savedLang);
};
