import { CONFIG } from './config.js';

export const api = {
    async getMembers() {
        try {
            // Fetching members list from Apps Script endpoint
            const url = new URL(CONFIG.APPS_SCRIPT_URL);
            
            const response = await fetch(url.toString(), {
                method: 'GET',
                mode: 'cors'
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('Error fetching members:', error);
            return []; // Return empty array on error
        }
    },
    
    async register(userData) {
        try {
            // Posting registration data to Apps Script endpoint
            // Using text/plain for Google Apps script to avoid CORS preflight issues
            const response = await fetch(CONFIG.APPS_SCRIPT_URL, {
                method: 'POST',
                // Removed mode: 'no-cors' to allow reading the JSON response.
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8',
                },
                body: JSON.stringify(userData)
            });
            
            return await response.json();
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    }
};
