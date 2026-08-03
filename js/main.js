import { auth } from './auth.js';
import { members } from './members.js';
import { registration } from './registration.js';

document.addEventListener('DOMContentLoaded', () => {
    members.init();
    registration.init();
    
    // Auth automatically checks if GSI is loaded and initializes
    auth.init((user) => {
        // Automatically open the registration modal after successful login
        registration.open(user);
    });

    const joinBtns = document.querySelectorAll('.btn-join');
    joinBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // User clicks "Join Community" -> Open login prompt modal
            registration.openLoginPrompt();
        });
    });
});
