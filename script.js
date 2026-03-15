// --- Language Switching Logic ---
function setLang(lang) {
    // Update all elements with data attributes for the selected language
    document.querySelectorAll(`[data-${lang}]`).forEach(el => {
        el.innerText = el.getAttribute(`data-${lang}`);
    });

    // Handle Right-to-Left for Arabic
    document.body.dir = (lang === 'ar') ? 'rtl' : 'ltr';
    
    // Save preference to browser storage
    localStorage.setItem('prefLang', lang);
    
    // If we are on the project page, reload the external description text
    if (document.getElementById('project-description')) {
        loadProjectData();
    }
}

// --- Donation Tracker Logic (Reads from donation_data.txt) ---
function updateDonations() {
    const collectedEl = document.getElementById('collected-amount');
    const goalEl = document.getElementById('goal-amount');
    const barEl = document.getElementById('progress-bar');

    if (collectedEl && goalEl && barEl) {
        // Cache buster added to ensure fresh data from GitHub
        fetch(`donation_data.txt?v=${new Date().getTime()}`)
            .then(response => response.text())
            .then(data => {
                const values = data.split(',');
                const collected = parseFloat(values[0].trim());
                const goal = parseFloat(values[1].trim());
                const percentage = (collected / goal) * 100;
                
                // Format numbers with commas (e.g., 250,000)
                collectedEl.innerText = collected.toLocaleString();
                goalEl.innerText = goal.toLocaleString();
                
                // Update the progress bar width
                barEl.style.width = percentage + '%';
            })
            .catch(err => console.error("Error loading donation data:", err));
    }
}

// --- Project Page Logic (Loads description and video from /project/ dir) ---
function loadProjectData() {
    const descEl = document.getElementById('project-description');
    const videoEl = document.getElementById('project-video-iframe');
    const lang = localStorage.getItem('prefLang') || 'fr'; // Defaults to FR

    if (descEl) {
        fetch(`project/description_${lang}.txt?v=${new Date().getTime()}`)
            .then(response => {
                if (!response.ok) throw new Error('File not found');
                return response.text();
            })
            .then(text => {
                descEl.innerText = text;
            })
            .catch(() => {
                // Fallback message if file is missing
                const fallbacks = {
                    'fr': "Description à venir bientôt...",
                    'en': "Description coming soon...",
                    'ar': "سيتم إضافة الوصف قريباً..."
                };
                descEl.innerText = fallbacks[lang] || fallbacks['fr'];
            });
    }

    if (videoEl && !videoEl.src) {
        fetch(`project/video_url.txt?v=${new Date().getTime()}`)
            .then(response => response.text())
            .then(url => {
                if (url.trim()) videoEl.src = url.trim();
            })
            .catch(err => console.error("Error loading video URL:", err));
    }
}

// --- Initialization ---
window.onload = () => {
    // Check for saved language; if none exists, use 'fr' (French)
    const saved = localStorage.getItem('prefLang') || 'fr';
    
    // Apply the language
    setLang(saved);
    
    // Load dynamic data
    updateDonations();
};
