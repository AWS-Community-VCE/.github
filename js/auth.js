import { CONFIG } from './config.js';
import { registration } from './registration.js';

export const auth = {
    user: null,
    onAuthCallback: null,
    isInitialized: false,
    
    init(callback) {
        this.onAuthCallback = callback;
        
        window.handleCredentialResponse = (response) => {
            try {
                const payload = this.decodeJwtResponse(response.credential);
                this.user = {
                    name: payload.name,
                    email: payload.email,
                    profilePicture: payload.picture
                };
                if (this.onAuthCallback) this.onAuthCallback(this.user);
            } catch (err) {
                console.error("JWT Decode error", err);
                registration.showToast('Google login failed.', true);
            }
        };
        
        this.checkGoogleLibrary();
    },
    
    checkGoogleLibrary() {
        if (window.google && window.google.accounts) {
            this.setupGSI();
        } else {
            const interval = setInterval(() => {
                if (window.google && window.google.accounts) {
                    clearInterval(interval);
                    this.setupGSI();
                }
            }, 100);
            setTimeout(() => clearInterval(interval), 10000);
        }
    },
    
    setupGSI() {
        if (this.isInitialized) return;
        
        google.accounts.id.initialize({
            client_id: CONFIG.GOOGLE_CLIENT_ID,
            callback: window.handleCredentialResponse
        });
        
        this.isInitialized = true;
    },

    decodeJwtResponse(token) {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    }
};
