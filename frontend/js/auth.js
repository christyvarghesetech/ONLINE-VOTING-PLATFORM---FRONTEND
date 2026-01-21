/**
 * Auth Logic
 */

document.addEventListener('DOMContentLoaded', async () => {

    // Check for token in URL (Back from OAuth)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');

    if (token) {
        localStorage.setItem('token', token);
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
        // Redirect to candidates/dashboard
        window.location.href = 'candidates.html';
        return;
    }

    // If on index.html, check if already logged in
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        const user = await mockApi.getUser();
        if (user) {
            window.location.href = 'candidates.chtml';
            return;
        }
    }

    const btnGoogle = document.getElementById('btn-google');
    const btnLinkedin = document.getElementById('btn-linkedin');

    // Direct redirects to backend auth endpoints
    if (btnGoogle) {
        btnGoogle.addEventListener('click', () => {
            // Use the global API service to get the correct Production URL
            mockApi.login('google');
        });
    }

    if (btnLinkedin) {
        btnLinkedin.addEventListener('click', () => {
            mockApi.login('linkedin');
        });
    }
});
