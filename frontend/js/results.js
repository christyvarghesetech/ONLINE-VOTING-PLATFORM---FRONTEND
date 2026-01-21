/**
 * Results Declaration Logic
 */
document.addEventListener('DOMContentLoaded', async () => {
    // Admin Auth Check - Commented out for demo purposes
    // if (localStorage.getItem('admin_session') !== 'true') {
    //     window.location.href = 'admin.html'; // Redirect to login if not admin
    //     return;
    // }

    const winnerNameEl = document.getElementById('winner-name');
    const winnerVotesEl = document.getElementById('winner-votes');
    const totalVotesEl = document.getElementById('total-votes');
    const winnerLinkEl = document.getElementById('winner-link');
    const tieMsgEl = document.getElementById('tie-message');

    // --- 1. Winner Logic ---
    try {
        const candidates = await mockApi.getCandidates();

        // Calculate total votes
        const totalVotes = candidates.reduce((sum, c) => sum + c.vote_count, 0);

        // Update UI
        if (totalVotesEl) totalVotesEl.textContent = totalVotes;

        if (totalVotes === 0) {
            winnerNameEl.textContent = "No votes cast yet";
            return;
        }

        // Find winner based on vote_count
        let maxVotes = -1;
        let winners = [];

        candidates.forEach(c => {
            if (c.vote_count > maxVotes) {
                maxVotes = c.vote_count;
                winners = [c];
            } else if (c.vote_count === maxVotes) {
                winners.push(c);
            }
        });

        if (winners.length === 1) {
            const winner = winners[0];
            winnerNameEl.textContent = winner.name;
            winnerVotesEl.textContent = maxVotes;
            winnerLinkEl.href = winner.linkedin_profile_url;
            winnerLinkEl.classList.remove('hidden');
            winnerLinkEl.classList.add('inline-flex');
            startConfetti();
        } else {
            // Tie Logic
            winnerNameEl.innerHTML = `<span class="text-red-500">It's a Tie!</span> <br> <span class="text-xl">${winners.map(w => w.name).join(' & ')}</span>`;
            winnerVotesEl.textContent = maxVotes;
            tieMsgEl.classList.remove('hidden');
            tieMsgEl.textContent = `Between ${winners.map(w => w.name).join(' and ')} with ${maxVotes} votes each.`;
        }

    } catch (error) {
        console.error(error);
        winnerNameEl.textContent = "Error loading results";
    }

    // --- 2. Reset Button Logic ---
    const btnReset = document.getElementById('btn-reset');
    console.log("Reset Button found:", btnReset); // Debug

    if (btnReset) {
        btnReset.addEventListener('click', async () => {
            console.log("Reset Button Clicked"); // Debug
            if (confirm('Are you sure you want to delete ALL votes? This action cannot be undone.')) {
                btnReset.disabled = true;
                btnReset.innerHTML = "Resetting...";
                try {
                    await mockApi.reset();
                    alert('Election has been reset!');
                    location.reload();
                } catch (error) {
                    alert("Error resetting election: " + error.message);
                    btnReset.disabled = false;
                    btnReset.innerHTML = "Reset Election";
                }
            }
        });
    }

    // --- 3. Render Voters List ---
    const votersListEl = document.getElementById('voters-list');
    if (votersListEl) {
        try {
            const voters = await mockApi.getVoters();
            votersListEl.innerHTML = ''; // Clear loading text

            if (voters.length === 0) {
                votersListEl.innerHTML = '<p class="text-gray-500 col-span-2">No voters yet.</p>';
            } else {
                voters.forEach(voter => {
                    const div = document.createElement('div');
                    div.className = "flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100";
                    div.innerHTML = `
                        <div class="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                            ${voter.name.charAt(0)}
                        </div>
                        <div class="flex-grow">
                            <p class="font-medium text-gray-900">${voter.name}</p>
                        </div>
                        ${voter.linkedin_profile_url ? `
                        <a href="${voter.linkedin_profile_url}" target="_blank" class="text-blue-500 hover:text-blue-700">
                            <img src="https://www.svgrepo.com/show/448234/linkedin.svg" alt="IN" class="w-5 h-5">
                        </a>` : ''}
                    `;
                    votersListEl.appendChild(div);
                });
            }
        } catch (error) {
            console.error("Error loading voters:", error);
            votersListEl.innerHTML = '<p class="text-red-500 col-span-2">Failed to load voters list.</p>';
        }
    }

});

// Simple Confetti Effect
function startConfetti() {
    const colors = ['#f2d74e', '#95c3de', '#ff9a9e'];
    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = -10 + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        document.body.appendChild(confetti);
    }
}
