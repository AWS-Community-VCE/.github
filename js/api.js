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
    }
};
