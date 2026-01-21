/**
 * Candidates & Voting Logic
 */

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Capture Token if present in URL (from OAuth redirect)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
        localStorage.setItem('token', token);
        // Clean URL to hide token
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    // Auth Check
    const user = await mockApi.getUser();
    if (!user) {
        window.location.href = 'index.html';
        return;
    }

    // UI Elements
    const userNameSpan = document.getElementById('user-name');
    const logoutBtn = document.getElementById('btn-logout');
    const grid = document.getElementById('candidates-grid');

    // Set User Info
    userNameSpan.textContent = user.name;

    // --- Profile Check Logic ---
    if (!user.linkedin_profile_url) {
        const modal = document.getElementById('profile-modal');
        const form = document.getElementById('profile-form');
        const input = document.getElementById('linkedin-url');

        if (modal && form) {
            modal.classList.remove('hidden'); // Show modal

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const btn = form.querySelector('button');
                const url = input.value.trim();

                if (!url) return;

                try {
                    btn.disabled = true;
                    btn.textContent = "Saving...";

                    await mockApi.updateUser({ linkedin_profile_url: url });

                    modal.classList.add('hidden'); // Hide modal
                    alert("Profile updated! You can now vote.");
                    // Optional: Reload to ensure user object is fresh, or just proceed
                    location.reload();
                } catch (error) {
                    alert("Error updating profile: " + error.message);
                    btn.disabled = false;
                    btn.textContent = "Save & Continue";
                }
            });
        }

    });
        }
    }

// Logout
logoutBtn.addEventListener('click', () => mockApi.logout());

// Check if already voted
const alreadyVoted = await mockApi.hasVoted();
if (alreadyVoted) {
    window.location.href = 'voters.html';
    return;
}

try {
    const candidates = await mockApi.getCandidates();
    renderCandidates(candidates);
} catch (error) {
    grid.innerHTML = '<p class="text-red-500 text-center col-span-2">Failed to load candidates.</p>';
}

function renderCandidates(candidates) {
    grid.innerHTML = '';
    candidates.forEach(candidate => {
        const card = document.createElement('div');
        card.className = 'candidate-card fade-in';

        card.innerHTML = `
                <div class="candidate-info">
                    <h2 class="candidate-name">${candidate.name}</h2>
                    <p class="candidate-role">${candidate.role || candidate.team_name}</p>
                    
                    <a href="${candidate.linkedin_profile_url}" target="_blank" class="social-link">
                         <img src="https://www.svgrepo.com/show/448234/linkedin.svg" alt="LinkedIn" class="w-4 h-4">
                         View Profile
                    </a>

                    <button class="btn btn-vote" onclick="handleVote('${candidate._id || candidate.id}')">
                        Vote for ${candidate.name.split(' ')[0]}
                    </button>
                </div>
            `;
        grid.appendChild(card);
    });
}

// Make handleVote global so inline onclick works
window.handleVote = async (candidateId) => {
    if (!confirm('Are you sure you want to vote for this candidate? You cannot change your vote later.')) {
        return;
    }

    const buttons = document.querySelectorAll('.btn-vote');
    buttons.forEach(b => {
        b.disabled = true;
        b.textContent = 'Voting...';
    });

    try {
        await mockApi.vote(candidateId);
        window.location.href = 'voters.html';
    } catch (error) {
        alert(error.message);
        buttons.forEach(b => {
            b.disabled = false;
            b.textContent = 'Vote';
        });
    }
};
});
