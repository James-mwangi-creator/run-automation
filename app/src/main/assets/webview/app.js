// App State
let currentUser = null;
let userScripts = [];
let marketScripts = [];
let currentTheme = 'dark';
let cloudSyncEnabled = false;
let currentScriptName = null;
let currentCategory = 'all';

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    // Set default theme
    document.body.setAttribute('data-theme', currentTheme);
    
    // Check if user is logged in
    checkLoginStatus();
    
    // Load market scripts
    loadMarketScripts();
});

// Authentication Functions
function checkLoginStatus() {
    try {
        const userData = Android.getUserData('current_user');
        const response = JSON.parse(userData);
        
        if (response.value) {
            currentUser = JSON.parse(response.value);
            showMainScreen();
            loadUserScripts();
        }
    } catch (e) {
        // User not logged in, stay on auth screen
    }
}

function handleLogin() {
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showToast('Please fill in all fields');
        return;
    }
    
    // In production, validate with backend
    // For now, simulate login
    currentUser = {
        name: email.split('@')[0],
        email: email,
        joinDate: new Date().toISOString()
    };
    
    // Save user data
    Android.saveUserData('current_user', JSON.stringify(currentUser));
    
    showToast('Login successful!');
    showMainScreen();
    loadUserScripts();
}

function handleRegister() {
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    if (!name || !email || !password || !confirmPassword) {
        showToast('Please fill in all fields');
        return;
    }
    
    if (password !== confirmPassword) {
        showToast('Passwords do not match');
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters');
        return;
    }
    
    // In production, register with backend
    // For now, simulate registration
    currentUser = {
        name: name,
        email: email,
        joinDate: new Date().toISOString()
    };
    
    // Save user data
    Android.saveUserData('current_user', JSON.stringify(currentUser));
    
    showToast('Account created successfully!');
    showMainScreen();
    loadUserScripts();
}

function handleLogout() {
    if (confirm('Are you sure you want to sign out?')) {
        currentUser = null;
        Android.saveUserData('current_user', '');
        
        // Reset UI
        document.getElementById('authScreen').classList.add('active');
        document.getElementById('mainScreen').classList.remove('active');
        
        // Clear forms
        document.getElementById('loginEmail').value = '';
        document.getElementById('loginPassword').value = '';
        
        showToast('Logged out successfully');
    }
}

function showLogin() {
    document.getElementById('loginForm').classList.add('active');
    document.getElementById('registerForm').classList.remove('active');
}

function showRegister() {
    document.getElementById('registerForm').classList.add('active');
    document.getElementById('loginForm').classList.remove('active');
}

function showMainScreen() {
    document.getElementById('authScreen').classList.remove('active');
    document.getElementById('mainScreen').classList.add('active');
    
    // Update user info
    const initials = currentUser.name.substring(0, 2).toUpperCase();
    document.getElementById('userInitials').textContent = initials;
    document.getElementById('userName').textContent = currentUser.name;
    document.getElementById('userEmail').textContent = currentUser.email;
}

// Tab Navigation
function switchTab(tabName) {
    // Remove active class from all tabs and nav items
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.currentTarget.classList.add('active');
    
    // Load data for specific tabs
    if (tabName === 'profile') {
        loadUserScripts();
    } else if (tabName === 'market') {
        loadMarketScripts();
    }
}

// User Scripts Management
function loadUserScripts() {
    try {
        const scriptsData = Android.getUserScripts();
        const response = JSON.parse(scriptsData);
        
        if (response.scripts && response.scripts.length > 0) {
            userScripts = response.scripts.map(name => ({
                name: name,
                displayName: formatScriptName(name),
                status: 'offline', // Would be determined by script metadata
                icon: '🤖'
            }));
            
            renderUserScripts();
        } else {
            renderEmptyScripts();
        }
    } catch (e) {
        console.error('Error loading scripts:', e);
        renderEmptyScripts();
    }
}

function renderUserScripts() {
    const container = document.getElementById('myScriptsList');
    document.getElementById('scriptCount').textContent = `${userScripts.length} scripts`;
    
    container.innerHTML = userScripts.map(script => `
        <div class="script-card card" onclick="openScriptRunner('${script.name}')">
            <div class="script-icon">${script.icon}</div>
            <h4>${script.displayName}</h4>
            <span class="script-status ${script.status}">${script.status}</span>
        </div>
    `).join('');
}

function renderEmptyScripts() {
    const container = document.getElementById('myScriptsList');
    document.getElementById('scriptCount').textContent = '0 scripts';
    
    container.innerHTML = `
        <div class="empty-state">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2"/>
                <line x1="12" y1="8" x2="12" y2="16" stroke-width="2"/>
                <line x1="8" y1="12" x2="16" y2="12" stroke-width="2"/>
            </svg>
            <p>No scripts yet</p>
            <small>Visit the marketplace to get started</small>
        </div>
    `;
}

function formatScriptName(name) {
    // Convert snake_case or camelCase to Title Case
    return name
        .replace(/[_-]/g, ' ')
        .replace(/([A-Z])/g, ' $1')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ')
        .trim();
}

// Marketplace Functions
function loadMarketScripts() {
    // Mock marketplace data
    // In production, fetch from your Django backend
    marketScripts = [
        {
            id: 'file_organizer',
            name: 'Smart File Organizer',
            creator: 'AutomationLab',
            description: 'Automatically organize files by type, date, or custom rules',
            price: '$4.99',
            category: 'files',
            icon: '📁',
            status: 'offline',
            tags: ['Files', 'Productivity'],
            screenshots: 3,
            rating: 4.8
        },
        {
            id: 'photo_enhancer',
            name: 'Batch Photo Enhancer',
            creator: 'ImagePro',
            description: 'Enhance multiple photos at once with AI-powered filters',
            price: '$6.99',
            category: 'productivity',
            icon: '🖼️',
            status: 'offline',
            tags: ['Photos', 'AI'],
            screenshots: 4,
            rating: 4.9
        },
        {
            id: 'social_scheduler',
            name: 'Social Media Scheduler',
            creator: 'SocialTools',
            description: 'Schedule posts across multiple platforms automatically',
            price: '$9.99',
            category: 'social',
            icon: '📱',
            status: 'online',
            tags: ['Social', 'Marketing'],
            screenshots: 5,
            rating: 4.7
        },
        {
            id: 'pdf_merger',
            name: 'PDF Swiss Army Knife',
            creator: 'DocMaster',
            description: 'Merge, split, compress, and convert PDF files effortlessly',
            price: '$3.99',
            category: 'files',
            icon: '📄',
            status: 'offline',
            tags: ['PDF', 'Documents'],
            screenshots: 3,
            rating: 4.6
        },
        {
            id: 'data_scraper',
            name: 'Web Data Extractor',
            creator: 'DataFlow',
            description: 'Extract data from websites and save to spreadsheets',
            price: '$12.99',
            category: 'productivity',
            icon: '🌐',
            status: 'online',
            tags: ['Web', 'Data'],
            screenshots: 4,
            rating: 4.8
        },
        {
            id: 'video_converter',
            name: 'Universal Video Converter',
            creator: 'MediaTools',
            description: 'Convert videos between any format with batch processing',
            price: '$7.99',
            category: 'files',
            icon: '🎬',
            status: 'offline',
            tags: ['Video', 'Converter'],
            screenshots: 3,
            rating: 4.5
        }
    ];
    
    renderMarketScripts();
}

function renderMarketScripts() {
    const container = document.getElementById('marketScriptsList');
    const filtered = filterScriptsByCategory();
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No scripts found</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(script => `
        <div class="market-card card" onclick="showScriptDetail('${script.id}')">
            <div class="market-card-icon">${script.icon}</div>
            <div class="market-card-content">
                <div class="market-card-header">
                    <div>
                        <h4>${script.name}</h4>
                        <span class="creator">by ${script.creator}</span>
                    </div>
                    <span class="price">${script.price}</span>
                </div>
                <p>${script.description}</p>
                <div class="tags">
                    ${script.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                    <span class="tag ${script.status}">${script.status === 'online' ? '🌐 Online' : '📱 Offline'}</span>
                </div>
            </div>
        </div>
    `).join('');
}

function filterScriptsByCategory() {
    if (currentCategory === 'all') {
        return marketScripts;
    }
    return marketScripts.filter(script => script.category === currentCategory);
}

function filterCategory(category) {
    currentCategory = category;
    
    // Update UI
    document.querySelectorAll('.category-chip').forEach(chip => {
        chip.classList.remove('active');
    });
    event.currentTarget.classList.add('active');
    
    renderMarketScripts();
}

function filterScripts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    const filtered = marketScripts.filter(script => 
        script.name.toLowerCase().includes(searchTerm) ||
        script.description.toLowerCase().includes(searchTerm) ||
        script.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
    
    const container = document.getElementById('marketScriptsList');
    
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <p>No scripts match your search</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filtered.map(script => `
        <div class="market-card card" onclick="showScriptDetail('${script.id}')">
            <div class="market-card-icon">${script.icon}</div>
            <div class="market-card-content">
                <div class="market-card-header">
                    <div>
                        <h4>${script.name}</h4>
                        <span class="creator">by ${script.creator}</span>
                    </div>
                    <span class="price">${script.price}</span>
                </div>
                <p>${script.description}</p>
                <div class="tags">
                    ${script.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        </div>
    `).join('');
}

function showScriptDetail(scriptId) {
    const script = marketScripts.find(s => s.id === scriptId);
    if (!script) return;
    
    const modal = document.getElementById('scriptDetailModal');
    const content = document.getElementById('scriptDetailContent');
    
    content.innerHTML = `
        <div class="detail-hero">
            <div class="detail-icon">${script.icon}</div>
            <h2>${script.name}</h2>
            <p class="creator">by ${script.creator}</p>
            <div class="tags" style="justify-content: center; margin-top: 1rem;">
                ${script.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                <span class="tag ${script.status}">${script.status === 'online' ? '🌐 Online' : '📱 Offline'}</span>
            </div>
        </div>
        
        <div class="detail-section">
            <h4>Screenshots</h4>
            <div class="detail-screenshots">
                ${Array(script.screenshots).fill(0).map((_, i) => `
                    <div class="screenshot">Screenshot ${i + 1}</div>
                `).join('')}
            </div>
        </div>
        
        <div class="detail-section">
            <h4>Description</h4>
            <p>${script.description}</p>
        </div>
        
        <div class="detail-section">
            <h4>Features</h4>
            <ul style="padding-left: 1.5rem; line-height: 1.8;">
                <li>Easy to use interface</li>
                <li>Fast processing</li>
                <li>Batch operations supported</li>
                <li>Regular updates and support</li>
            </ul>
        </div>
        
        <div class="detail-section">
            <h4>Documentation</h4>
            <p>Full documentation available after purchase. Includes setup guide, usage examples, and troubleshooting tips.</p>
        </div>
        
        <button onclick="purchaseScript('${script.id}')" class="btn-purchase">
            Buy Now - ${script.price}
        </button>
    `;
    
    modal.classList.add('active');
}

function closeScriptDetail() {
    document.getElementById('scriptDetailModal').classList.remove('active');
}

function purchaseScript(scriptId) {
    // In production, handle purchase via Google Play Billing
    // For now, simulate purchase
    
    const script = marketScripts.find(s => s.id === scriptId);
    if (!script) return;
    
    if (confirm(`Purchase ${script.name} for ${script.price}?`)) {
        // Mock script content
        const scriptContent = `
# ${script.name}
# Created by ${script.creator}

def run_automation(input_data):
    """
    Main automation function
    """
    print(f"Running ${script.name}...")
    print(f"Input: {input_data}")
    
    # Your automation logic here
    result = "Automation completed successfully!"
    
    return result

if __name__ == "__main__":
    result = run_automation("test input")
    print(result)
`;
        
        // Download and save script
        const response = Android.downloadScript(scriptId, scriptContent, scriptId);
        const result = JSON.parse(response);
        
        if (result.success) {
            showToast('Purchase successful! Script downloaded.');
            closeScriptDetail();
            
            // Refresh user scripts
            setTimeout(() => {
                loadUserScripts();
                switchTab('profile');
            }, 500);
        } else {
            showToast('Purchase failed: ' + result.error);
        }
    }
}

// Script Runner Functions
function openScriptRunner(scriptName) {
    currentScriptName = scriptName;
    
    document.getElementById('runnerScriptName').textContent = formatScriptName(scriptName);
    document.getElementById('scriptInput').value = '';
    document.getElementById('scriptOutput').textContent = '';
    document.getElementById('scriptRunnerModal').classList.add('active');
}

function closeScriptRunner() {
    document.getElementById('scriptRunnerModal').classList.remove('active');
    currentScriptName = null;
}

function executeScript() {
    if (!currentScriptName) return;
    
    const input = document.getElementById('scriptInput').value;
    const output = document.getElementById('scriptOutput');
    
    output.textContent = 'Running script...\n';
    
    try {
        const response = Android.runPythonScript(currentScriptName, input);
        const result = JSON.parse(response);
        
        if (result.success) {
            output.textContent += '\n✅ Success!\n\n';
            output.textContent += result.data;
        } else {
            output.textContent += '\n❌ Error:\n\n';
            output.textContent += result.error;
        }
    } catch (e) {
        output.textContent += '\n❌ Error:\n\n';
        output.textContent += e.message;
    }
}

// Settings Functions
function setTheme(theme) {
    currentTheme = theme;
    document.body.setAttribute('data-theme', theme);
    
    // Update theme buttons
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    if (theme === 'light') {
        document.getElementById('lightThemeBtn').classList.add('active');
    } else {
        document.getElementById('darkThemeBtn').classList.add('active');
    }
    
    // Save preference
    Android.saveUserData('theme', theme);
    showToast(`${theme === 'light' ? 'Light' : 'Dark'} theme activated`);
}

function toggleCloudSync() {
    cloudSyncEnabled = !cloudSyncEnabled;
    
    const btn = document.getElementById('cloudSyncBtn');
    if (cloudSyncEnabled) {
        btn.classList.add('active');
        btn.querySelector('span').textContent = 'Cloud Sync: On';
        showToast('Cloud sync enabled');
    } else {
        btn.classList.remove('active');
        btn.querySelector('span').textContent = 'Cloud Sync: Off';
        showToast('Cloud sync disabled');
    }
    
    // In production, sync with backend
}

function editProfile() {
    showToast('Profile editing coming soon!');
}

function manageSubscription() {
    showToast('Subscription management coming soon!');
}

function contactSupport() {
    showToast('Support: support@runautomation.com');
}

function showAbout() {
    alert('Run-automation v1.0\n\nAutomate your mobile tasks with powerful Python scripts.\n\n© 2026 Run-automation');
}

// Utility Functions
function showToast(message) {
    Android.showToast(message);
}

// Close modals on background click
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});
