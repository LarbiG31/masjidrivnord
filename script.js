// --- Language Switching Logic ---
function setLang(lang) {
    document.querySelectorAll(`[data-${lang}]`).forEach(el => {
        el.innerText = el.getAttribute(`data-${lang}`);
    });
    localStorage.setItem('prefLang', lang);
}

// --- Donation Tracker Logic ---
function updateDonations() {
    const collectedEl = document.getElementById('collected-amount');
    const goalEl = document.getElementById('goal-amount');
    const barEl = document.getElementById('progress-bar');

    // Only run if the elements exist on the current page
    if (collectedEl && goalEl && barEl) {
        fetch('donation_data.txt')
            .then(response => response.text())
            .then(data => {
                const values = data.split(',');
                const collected = parseFloat(values[0].trim());
                const goal = parseFloat(values[1].trim());
                
                const percentage = (collected / goal) * 100;
                
                // Format numbers with commas (e.g., 250,000)
                collectedEl.innerText = collected.toLocaleString();
                goalEl.innerText = goal.toLocaleString();
                
                // Set the bar width
                barEl.style.width = percentage + '%';
            })
            .catch(err => console.error("Error loading donation data:", err));
    }
}

// --- Initialization ---
window.onload = () => {
    const saved = localStorage.getItem('prefLang') || 'en';
    setLang(saved);
    updateDonations();
};
