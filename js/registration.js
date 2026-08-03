import { api } from './api.js';
import { members } from './members.js';

export const registration = {
    modalEl: null,
    formEl: null,
    
    init() {
        this.modalEl = document.getElementById('registration-modal');
        this.formEl = document.getElementById('registration-form');
        
        if (this.formEl) {
            this.formEl.addEventListener('submit', this.handleSubmit.bind(this));
        }
        
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
        
        // Prefill form and ensure email is readonly (it is in HTML, but good to enforce)
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
    
    async handleSubmit(e) {
        e.preventDefault();
        
        const submitBtn = this.formEl.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerText;
        submitBtn.innerText = 'Registering...';
        submitBtn.disabled = true;
        
        const formData = new FormData(this.formEl);
        const data = Object.fromEntries(formData.entries());
        
        // Payload expected by Apps Script: Name, Email, Branch, Year, Phone, profilePicture
        // (Apps Script doPost uses data.name, data.email, data.branch, data.year, data.phone, data.profilePicture)
        // Ensure keys match what Google Apps Script expects
        const payload = {
            name: data.name,
            email: data.email,
            branch: data.branch,
            year: data.year,
            phone: data.phone,
            profilePicture: data.picture // in HTML it's name="picture", mapping it to profilePicture
        };
        
        try {
            const response = await api.register(payload);
            
            if (response && response.success === false) {
                if (response.message === "Already registered") {
                    this.showAlreadyRegistered();
                } else {
                    this.showToast(response.message || 'Registration failed.', true);
                }
            } else {
                this.showToast('Registration successful! Welcome to the community.');
                this.close();
                // Reload members and update count without page refresh
                await members.loadMembers();
            }
        } catch (err) {
            this.showToast('Network error. Please try again.', true);
        } finally {
            submitBtn.innerText = originalText;
            submitBtn.disabled = false;
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
