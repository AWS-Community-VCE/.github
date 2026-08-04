import { registration } from './registration.js';

document.addEventListener('DOMContentLoaded', () => {
    registration.init();
    
    const joinBtns = document.querySelectorAll('.btn-join');
    joinBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            // User clicks "Join Community" -> Open registration form directly
            registration.open();
        });
    });
});
