/**
 * Real API Service
 * Replaces mockApi with real backend calls
 */

// CHANGE THIS TO YOUR RENDER URL IN PRODUCTION
// e.g., const API_BASE_URL = "https://your-app-name.onrender.com";
const API_BASE_URL = "https://voting-backend-dl2q.onrender.com";

const api = {

    /**
     * Initialize: Check for token in URL (OAuth callback)
     */
    init() {
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
            localStorage.setItem('token', token);
            // Clean URL
            window.history.replaceState({}, document.title, window.location.pathname);
        }
    },

    /**
     * Get Auth Token
     */
    getToken() {
        return localStorage.getItem('token');
    },

    /**
     * Login - Redirects to Backend Auth
     */
    login(provider) {
        window.location.href = `${API_BASE_URL}/auth/${provider}`;
    },

    /**
     * Logout
     */
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user'); // Clean up old mock data if present
        window.location.href = 'index.html';
    },

    /**
     * Get Current User
     */
    async getUser() {
        const token = this.getToken();
        if (!token) return null;

        try {
            const response = await fetch(`${API_BASE_URL}/me`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                if (response.status === 401) {
                    this.logout();
                }
                return null;
            }
            return await response.json();
        } catch (error) {
            console.error("Error fetching user:", error);
            return null;
        }
    },

    /**
     * Get Candidates
     */
    async getCandidates() {
        // Candidates endpoint is public, but we might send token if we want context
        const response = await fetch(`${API_BASE_URL}/candidates`);
        if (!response.ok) throw new Error("Failed to load candidates");
        return await response.json();
    },

    /**
     * Cast Vote
     */
    async vote(candidateId) {
        const token = this.getToken();
        if (!token) throw new Error("Please login to vote");

        const response = await fetch(`${API_BASE_URL}/vote`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ candidate_id: candidateId }) // Note: Backend expects candidate_id (int)
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail || "Voting failed");
        }
        return await response.json();
    },

    /**
     * Get Voters (Admin)
     */
    async getVoters() {
        // Admin check is loosely handled in frontend, strictly in backend (but backend 'get_voters' currently public in my code? I should check this security later)
        const response = await fetch(`${API_BASE_URL}/voters`);
        if (!response.ok) throw new Error("Failed to load voters");
        return await response.json();
    },

    /**
     * Reset Election (Admin)
     */
    async reset() {
        const response = await fetch(`${API_BASE_URL}/reset`, { method: 'POST' });
        if (!response.ok) throw new Error("Reset failed");
        return await response.json();
    },

    // Helper for compatibility
    getStoredVotes() {
        console.warn("getStoredVotes is deprecated in real API mode.");
        return [];
    }
};

// Initialize on load to catch tokens
api.init();

// Export as mockApi for backward compatibility
window.mockApi = api;
