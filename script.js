// Theme management
const themeToggle = document.getElementById('themeToggle');
let currentTheme = localStorage.getItem('theme') || 'light';

// Apply saved theme on load
document.documentElement.setAttribute('data-theme', currentTheme);

// Toggle theme function
function toggleTheme() {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
}

// Theme toggle event listener
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// Menu functionality
function toggleMenu() {
    const dropdown = document.getElementById('menuDropdown');
    const overlay = document.getElementById('menuOverlay');
    
    if (!dropdown || !overlay) return;
    
    dropdown.classList.toggle('show');
    overlay.classList.toggle('show');
    
    // Block body scroll when menu is open
    document.body.style.overflow = dropdown.classList.contains('show') ? 'hidden' : '';
}

// Submenu toggle
function toggleSubmenu(event) {
    event.stopPropagation();
    const submenu = event.target.closest('.submenu-group').querySelector('.submenu-content');
    submenu.classList.toggle('show');
    
    // Toggle arrow direction
    const arrow = event.target.querySelector('after');
    if (arrow) {
        arrow.style.transform = submenu.classList.contains('show') ? 'rotate(180deg)' : 'rotate(0)';
    }
}

// Scroll button functionality
const scrollBtn = document.getElementById('scrollBtn');

if (scrollBtn) {
    // Check scroll position
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        
        // Show button when not at bottom
        if (documentHeight - (scrollY + windowHeight) > 100) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    // Scroll to bottom on click
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth'
        });
    });
    
    // Initial check
    if (document.documentElement.scrollHeight > window.innerHeight + 200) {
        scrollBtn.classList.add('visible');
    }
}

// Dictionary functionality
if (typeof dictionary !== 'undefined' && (window.location.pathname.includes('dictionary.html') || window.location.pathname.includes('mati.html'))) {
    // Enhanced search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const term = e.target.value.toLowerCase();
            const wordItems = document.querySelectorAll('.word-item');
            
            dictionary.forEach((word, index) => {
                const wordItem = wordItems[index];
                if (!wordItem) return;

                // Search in word, definitions, and examples
                const wordMatch = word.word.toLowerCase().includes(term);
                const defMatch = word.definitions.some(def => def.toLowerCase().includes(term));
                const ruExMatch = word.examples.ru.some(ex => ex.toLowerCase().includes(term));
                const roExMatch = word.examples.ro.some(ex => ex.toLowerCase().includes(term));

                const shouldShow = wordMatch || defMatch || ruExMatch || roExMatch;
                wordItem.style.display = shouldShow ? 'block' : 'none';

                // If it's a match and no word is currently selected, show its details
                if (shouldShow && !document.querySelector('.word-item.active')) {
                    wordItem.classList.add('active');
                    showWordDetails(word);
                }
            });
        });
    }
    
    // Render word list
    function renderWordList() {
        const container = document.getElementById('wordList');
        if (!container) return;
        
        container.innerHTML = '';
        
        dictionary.forEach((word, index) => {
            const div = document.createElement('div');
            div.className = 'word-item';
            div.textContent = word.word;
            div.onclick = () => {
                // Remove active class from all items
                document.querySelectorAll('.word-item').forEach(item => {
                    item.classList.remove('active');
                });
                
                // Add active class to clicked item
                div.classList.add('active');
                
                // Show word details
                showWordDetails(word);
            };
            
            container.appendChild(div);
            
            // Select first word by default
            if (index === 0) {
                div.classList.add('active');
                showWordDetails(word);
            }
        });
    }
    
    // Show word details
    function showWordDetails(word) {
        const titleEl = document.getElementById('wordTitle');
        const pronEl = document.getElementById('wordPronunciation');
        const defEl = document.getElementById('wordDefinition');
        const examplesEl = document.getElementById('usageExamples');
        
        if (!titleEl || !pronEl || !defEl || !examplesEl) return;
        
        // Update elements with word data
        titleEl.textContent = word.word;
        pronEl.textContent = word.pronunciation;
        
        // Definitions
        defEl.innerHTML = '';
        word.definitions.forEach(def => {
            const defItem = document.createElement('div');
            defItem.className = 'definition-item';
            defItem.textContent = def;
            defEl.appendChild(defItem);
        });
        
        // Examples
        examplesEl.innerHTML = '';
        
        // Russian examples
        word.examples.ru.forEach(example => {
            const exItem = document.createElement('div');
            exItem.className = 'example-item';
            
            const langBadge = document.createElement('span');
            langBadge.className = 'lang-badge';
            langBadge.textContent = 'RU';
            
            exItem.appendChild(langBadge);
            exItem.appendChild(document.createTextNode(' ' + example));
            
            examplesEl.appendChild(exItem);
        });
        
        // Romanian examples
        word.examples.ro.forEach(example => {
            const exItem = document.createElement('div');
            exItem.className = 'example-item';
            
            const langBadge = document.createElement('span');
            langBadge.className = 'lang-badge';
            langBadge.textContent = 'RO';
            
            exItem.appendChild(langBadge);
            exItem.appendChild(document.createTextNode(' ' + example));
            
            examplesEl.appendChild(exItem);
        });
    }
    
    // Update word count
    function updateWordCount() {
        const countEl = document.getElementById('wordCount');
        if (countEl && typeof dictionary !== 'undefined') {
            countEl.textContent = dictionary.length;
        }
    }
    
    // Initialize dictionary page
    function initDictionary() {
        renderWordList();
        updateWordCount();
    }
    
    // Run initialization
    document.addEventListener('DOMContentLoaded', initDictionary);
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    const menu = document.getElementById('menuDropdown');
    const overlay = document.getElementById('menuOverlay');
    const menuBtn = document.querySelector('.hamburger-btn');
    
    if (menu && overlay && !menu.contains(e.target) && !menuBtn.contains(e.target)) {
        menu.classList.remove('show');
        overlay.classList.remove('show');
        document.body.style.overflow = '';
    }
});