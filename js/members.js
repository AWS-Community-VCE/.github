import { api } from './api.js';
import { registration } from './registration.js';

export const members = {
    allMembers: [],
    
    init() {
        const searchInput = document.getElementById('member-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.filterMembers(e.target.value));
        }
        this.loadMembers();
    },
    
    async loadMembers() {
        this.renderLoading();
        try {
            const data = await api.getMembers();
            this.allMembers = Array.isArray(data) ? data : (data.members || []);
            this.updateCount();
            this.renderMembers(this.allMembers);
        } catch (error) {
            this.renderError();
            registration.showToast('Failed to load members.', true);
        }
    },
    
    isRegistered(email) {
        return this.allMembers.some(m => m['Email'] === email);
    },
    
    filterMembers(query) {
        const q = query.toLowerCase();
        const filtered = this.allMembers.filter(m => 
            (m['Name'] && m['Name'].toLowerCase().includes(q)) || 
            (m['Branch'] && m['Branch'].toLowerCase().includes(q))
        );
        this.renderMembers(filtered);
    },
    
    updateCount() {
        const count = this.allMembers.length;
        const countEl = document.getElementById('member-count');
        if (countEl) {
            countEl.innerText = `${count} Members`;
        }
        
        const heroCount = document.getElementById('hero-member-count');
        if (heroCount) {
            heroCount.innerHTML = `<i class="ri-group-line"></i> ${count} members`;
        }
    },
    
    renderMembers(list) {
        const container = document.getElementById('members-grid');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (list.length === 0) {
            container.innerHTML = `<div class="empty-state" style="padding: 24px; color: var(--text-tertiary); text-align: center; width: 100%;">No members found.</div>`;
            return;
        }
        
        list.forEach(member => {
            const card = document.createElement('div');
            card.className = 'member-card';
            
            const name = member['Name'] || 'Anonymous';
            const branch = member['Branch'] || '';
            const year = member['Year'] ? '• ' + member['Year'] : '';
            const pic = member['Profile Picture'];
            
            const avatarHtml = pic 
                ? `<img src="${pic}" alt="${name}" class="avatar" style="object-fit: cover;">`
                : `<div class="avatar">${name.charAt(0).toUpperCase()}</div>`;
                
            card.innerHTML = `
                ${avatarHtml}
                <div class="member-info">
                    <h5>${name}</h5>
                    <p>${branch} ${year}</p>
                </div>
            `;
            container.appendChild(card);
        });
    },
    
    renderLoading() {
        const container = document.getElementById('members-grid');
        if (!container) return;
        container.innerHTML = `
            <div class="member-card" style="opacity: 0.5;">
                <div class="avatar" style="background: #e5e7eb;"></div>
                <div class="member-info">
                    <div style="height: 16px; width: 100px; background: #e5e7eb; margin-bottom: 4px; border-radius: 4px;"></div>
                    <div style="height: 12px; width: 60px; background: #e5e7eb; border-radius: 4px;"></div>
                </div>
            </div>
            <div class="member-card" style="opacity: 0.5;">
                <div class="avatar" style="background: #e5e7eb;"></div>
                <div class="member-info">
                    <div style="height: 16px; width: 100px; background: #e5e7eb; margin-bottom: 4px; border-radius: 4px;"></div>
                    <div style="height: 12px; width: 60px; background: #e5e7eb; border-radius: 4px;"></div>
                </div>
            </div>
        `;
    },
    
    renderError() {
        const container = document.getElementById('members-grid');
        if (container) {
            container.innerHTML = `<div class="empty-state" style="padding: 24px; color: #ef4444; text-align: center; width: 100%;">Failed to load members.</div>`;
        }
    }
};
