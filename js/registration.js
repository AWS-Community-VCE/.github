import { api } from './api.js';
import { members } from './members.js';
import { CONFIG } from './config.js';

export const registration = {
    modalEl: null,
    formEl: null,
    iframeName: 'gscript_iframe',
    submitTimeout: null,
    
    init() {
        this.modalEl = document.getElementById('registration-modal');
        this.formEl = document.getElementById('registration-form');
        
        // Setup hidden iframe for CORS-free Google Apps Script submission
        let iframe = document.getElementById(this.iframeName);
        if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.name = this.iframeName;
            iframe.id = this.iframeName;
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
        }
        
        if (this.formEl) {
            this.formEl.target = this.iframeName;
            this.formEl.action = CONFIG.APPS_SCRIPT_URL;
            this.formEl.method = 'POST';
            this.formEl.addEventListener('submit', this.handleSubmit.bind(this));
        }
        
        // Listen for message from Apps Script HTML output
        window.addEventListener('message', this.handleMessage.bind(this));
        
        const closeBtn = document.getElementById('close-modal-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
    },
    
    openLoginPrompt() {
        this.modalEl.style.display = 'flex';
        
        const loginPrompt = document.getElementById('login-prompt-container');
        const formContainer = document.getElementById('reg-form-container');
        const alreadyRegisteredMsg = document.getElementById('already-registered-msg');
        
        if (loginPrompt) loginPrompt.style.display = 'block';
        if (formContainer) formContainer.style.display = 'none';
        if (alreadyRegisteredMsg) alreadyRegisteredMsg.style.display = 'none';
    },

    open(user) {
        this.modalEl.style.display = 'flex';
        
        const loginPrompt = document.getElementById('login-prompt-container');
        if (loginPrompt) loginPrompt.style.display = 'none';
        
        const formContainer = document.getElementById('reg-form-container');
        const alreadyRegisteredMsg = document.getElementById('already-registered-msg');
        
        formContainer.style.display = 'block';
        alreadyRegisteredMsg.style.display = 'none';
        
        // Prefill form and ensure email is readonly
        document.getElementById('reg-name').value = user.name || '';
        document.getElementById('reg-email').value = user.email || '';
        document.getElementById('reg-email').readOnly = true;
        
        document.getElementById('reg-picture').value = user.profilePicture || '';
    },
    
    showAlreadyRegistered() {
        document.getElementById('reg-form-container').style.display = 'none';
        document.getElementById('already-registered-msg').style.display = 'block';
    },
    
    close() {
        if(this.modalEl) this.modalEl.style.display = 'none';
    },
    
    handleSubmit(e) {
        // Do NOT preventDefault() - let the form submit natively to the hidden iframe
        const submitBtn = this.formEl.querySelector('button[type="submit"]');
        submitBtn.dataset.originalText = submitBtn.innerText;
        submitBtn.innerText = 'Registering...';
        submitBtn.disabled = true;
        
        // Fallback in case of no response from Apps Script
        this.submitTimeout = setTimeout(() => {
            if (submitBtn.disabled) {
                this.resetButton();
                this.showToast('Registration took too long. Please check network.', true);
            }
        }, 15000);
    },
    
    resetButton() {
        const submitBtn = this.formEl.querySelector('button[type="submit"]');
        if (submitBtn && submitBtn.dataset.originalText) {
            submitBtn.innerText = submitBtn.dataset.originalText;
            submitBtn.disabled = false;
        }
        if (this.submitTimeout) {
            clearTimeout(this.submitTimeout);
        }
    },
    
    async handleMessage(event) {
        let response;
        try {
            response = JSON.parse(event.data);
        } catch (err) {
            return; // Ignore non-JSON messages (like from React/Vite extensions)
        }
        
        if (response.success !== undefined) {
            this.resetButton();
            
            if (response.success === false) {
                if (response.message === "Already registered") {
                    this.showAlreadyRegistered();
                } else {
                    this.showToast(response.message || 'Registration failed.', true);
                }
            } else {
                this.showToast('Registration successful! Welcome to the community.');
                this.close();
                await members.loadMembers(); // Refresh dynamically
            }
        }
    },
    
    showToast(message, isError = false) {
        const toast = document.getElementById('toast-notification');
        if (!toast) return;
        
        toast.innerText = message;
        toast.style.background = isError ? '#ef4444' : '#10b981';
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
};
