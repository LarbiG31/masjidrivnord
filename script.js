// --- Language Logic ---
function setLang(lang) {
    document.querySelectorAll(`[data-${lang}]`).forEach(el => {
        el.innerText = el.getAttribute(`data-${lang}`);
    });

    // Handle Right-to-Left for Arabic
    document.body.dir = (lang === 'ar') ? 'rtl' : 'ltr';
    localStorage.setItem('prefLang', lang);
    
    // Immediately load project text if on that page
    if (document.getElementById('project-description')) {
        loadProjectData();
    }
}

// --- Donation Logic ---
function updateDonations() {
    const collectedEl = document.getElementById('collected-amount');
    const goalEl = document.getElementById('goal-amount');
    const barEl = document.getElementById('progress-bar');

    if (collectedEl && goalEl && barEl) {
        fetch(`donation_data.txt?v=${new Date().getTime()}`)
            .then(res => res.text())
            .then(data => {
                const [collected, goal] = data.split(',').map(n => parseFloat(n.trim()));
                const percentage = (collected / goal) * 100;
                collectedEl.innerText = collected.toLocaleString();
                goalEl.innerText = goal.toLocaleString();
                barEl.style.width = percentage + '%';
            }).catch(err => console.error("Donation file missing"));
    }
}

// --- Project Page Logic (Matching your 'Project' folder) ---
function loadProjectData() {
    const descEl = document.getElementById('project-description');
    const videoEl = document.getElementById('project-video-iframe');
    const lang = localStorage.getItem('prefLang') || 'fr';

    if (descEl) {
        // Updated to use "Project/" with a capital P
        fetch(`Project/description_${lang}.txt?v=${new Date().getTime()}`)
            .then(res => res.text())
            .then(text => descEl.innerText = text)
            .catch(() => descEl.innerText = "Description à venir...");
    }

    if (videoEl && !videoEl.src) {
        fetch(`Project/video_url.txt?v=${new Date().getTime()}`)
            .then(res => res.text())
            .then(url => { if(url.trim()) videoEl.src = url.trim(); });
    }
}

// --- Initialization ---
// We run this immediately to prevent the "English flicker"
const initialLang = localStorage.getItem('prefLang') || 'fr';
setLang(initialLang);

window.onload = () => {
    updateDonations();
    if (document.getElementById('project-description')) {
        loadProjectData();
    }
};

