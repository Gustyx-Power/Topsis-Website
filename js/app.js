// ============================================
// HOMEPAGE LOGIC (index.html)
// Material Design 3 Style
// ============================================

let currentPhones = [...smartphoneData];
let comparisonList = JSON.parse(localStorage.getItem('comparisonList')) || [];

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    // Render components
    renderNavbar();
    renderFooter();

    // Re-setup theme toggle after navbar is rendered
    if (typeof ThemeManager !== 'undefined') {
        ThemeManager.setupToggleButtons();
    }

    // Render initial data
    renderPhoneGrid(currentPhones);
    updateStats();
});

// Render phone grid
function renderPhoneGrid(phones) {
    const grid = document.getElementById('phoneGrid');
    const noResults = document.getElementById('noResults');

    if (phones.length === 0) {
        grid.classList.add('hidden');
        noResults.classList.remove('hidden');
        return;
    }

    grid.classList.remove('hidden');
    noResults.classList.add('hidden');

    grid.innerHTML = phones.map(phone => PhoneCardComponent.render(phone)).join('');

    // Refresh scroll animations
    if (typeof AnimationManager !== 'undefined') {
        AnimationManager.refreshScrollAnimations();
    }
}

// Apply filters
function applyFilters() {
    const category = document.getElementById('filterCategory').value;
    const searchQuery = document.getElementById('searchInput').value;
    const sortType = document.getElementById('sortBy').value;

    // Filter by category
    let filtered = filterByCategory(smartphoneData, category);

    // Search
    filtered = searchPhones(filtered, searchQuery);

    // Sort
    filtered = sortPhones(filtered, sortType);

    currentPhones = filtered;
    renderPhoneGrid(currentPhones);

    // Update displayed count
    document.getElementById('totalCount').textContent = filtered.length;
}

// Update statistics
function updateStats() {
    const lowEnd = smartphoneData.filter(p => p.kategori === 'Low-End').length;
    const midRange = smartphoneData.filter(p => p.kategori === 'Mid-Range').length;
    const flagship = smartphoneData.filter(p => p.kategori === 'Flagship').length;

    document.getElementById('totalCount').textContent = smartphoneData.length;
    document.getElementById('lowEndCount').textContent = lowEnd;
    document.getElementById('midRangeCount').textContent = midRange;
    document.getElementById('flagshipCount').textContent = flagship;

    // Animate counters if AnimationManager is available
    if (typeof AnimationManager !== 'undefined') {
        // AnimationManager.animateCounter(document.getElementById('totalCount'), 0, smartphoneData.length);
    }
}

// View phone detail
function viewPhoneDetail(alternatif) {
    const phone = smartphoneData.find(p => p.alternatif === alternatif);
    if (!phone) return;

    // Use modal component
    if (typeof ModalComponent !== 'undefined') {
        ModalComponent.showPhoneDetail(phone);
    }
}

// Add to comparison
async function addToComparison(alternatif) {
    const phone = smartphoneData.find(p => p.alternatif === alternatif);
    if (!phone) return;

    // Check if already in comparison
    if (comparisonList.find(p => p.alternatif === alternatif)) {
        if (typeof ModalComponent !== 'undefined') {
            ModalComponent.alert('Smartphone ini sudah ada di daftar perbandingan!', {
                title: 'Info',
                icon: 'fa-info-circle'
            });
        } else {
            alert('Smartphone ini sudah ada di daftar perbandingan!');
        }
        return;
    }

    // Max 5 phones
    if (comparisonList.length >= 5) {
        if (typeof ModalComponent !== 'undefined') {
            ModalComponent.alert('Maksimal 5 smartphone untuk dibandingkan!', {
                title: 'Batas Tercapai',
                icon: 'fa-exclamation-circle'
            });
        } else {
            alert('Maksimal 5 smartphone untuk dibandingkan!');
        }
        return;
    }

    comparisonList.push(phone);
    localStorage.setItem('comparisonList', JSON.stringify(comparisonList));

    // Ask to go to comparison page
    if (typeof ModalComponent !== 'undefined') {
        const message = `${phone.nama} ditambahkan ke daftar perbandingan!\n\nTotal: ${comparisonList.length} smartphone`;
        const goToComparison = await ModalComponent.confirm(message, {
            title: 'Berhasil Ditambahkan',
            icon: 'fa-check-circle',
            confirmText: 'Lihat Perbandingan',
            cancelText: 'Tetap di Sini'
        });

        if (goToComparison) {
            window.location.href = 'comparison.html';
        }
    } else {
        alert(`${phone.nama} ditambahkan ke daftar perbandingan!\n\nTotal: ${comparisonList.length} smartphone`);
        const goToComparison = confirm('Lihat halaman perbandingan sekarang?');
        if (goToComparison) {
            window.location.href = 'comparison.html';
        }
    }
}
