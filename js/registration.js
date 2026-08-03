import { api } from './api.js';
import { members } from './members.js';
import { CONFIG } from './config.js';

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

        const renderBtn = () => {
            if (window.google && window.google.accounts) {
                const btnContainer = document.getElementById('google-signin-btn');
                if (btnContainer && !btnContainer.hasChildNodes()) {
                    window.google.accounts.id.renderButton(
                        btnContainer,
                        { theme: "outline", size: "large", type: "standard", width: 250 }
                    );
                }
            } else {
                setTimeout(renderBtn, 100);
            }
        };
        renderBtn();
    },

    open(user) {
        this.modalEl.style.display = 'flex';
        
        const loginPrompt = document.getElementById('login-prompt-container');
        if (loginPrompt) loginPrompt.style.display = 'none';
        
        const formContainer = document.getElementById('reg-form-container');
        const alreadyRegisteredMsg = document.getElementById('already-registered-msg');
        
        formContainer.style.display = 'block';
        alreadyRegisteredMsg.style.display = 'none';
        
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
        
        const payload = {
            name: data.name,
            email: data.email,
            branch: data.branch,
            year: data.year,
            phone: data.phone,
            profilePicture: data.picture 
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
                await members.loadMembers();
            }
        } catch (err) {
            console.error('Registration API error:', err);
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
