import { CONFIG } from './config.js';

export const api = {
    async getMembers() {
        try {
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
            // Using text/plain prevents the browser from sending a CORS preflight OPTIONS request.
            // Google Apps Script will receive this as e.postData.contents and parse the JSON.
            const response = await fetch(CONFIG.APPS_SCRIPT_URL, {
                method: 'POST',
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
