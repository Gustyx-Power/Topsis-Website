// HOMEPAGE LOGIC (index.html)

let currentPhones = [...smartphoneData];
let comparisonList = JSON.parse(localStorage.getItem('comparisonList')) || [];

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    renderNavbar();
    renderFooter();
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

    grid.innerHTML = phones.map(phone => renderPhoneCard(phone)).join('');
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
}

// View phone detail
function viewPhoneDetail(alternatif) {
    const phone = smartphoneData.find(p => p.alternatif === alternatif);
    if (!phone) return;

    const modalContainer = document.getElementById('phoneDetailModal');
    modalContainer.innerHTML = renderPhoneDetailModal(phone);
}

// Add to comparison
function addToComparison(alternatif) {
    const phone = smartphoneData.find(p => p.alternatif === alternatif);
    if (!phone) return;

    // Check if already in comparison
    if (comparisonList.find(p => p.alternatif === alternatif)) {
        alert('Smartphone ini sudah ada di daftar perbandingan!');
        return;
    }

    // Max 5 phones
    if (comparisonList.length >= 5) {
        alert('Maksimal 5 smartphone untuk dibandingkan!');
        return;
    }

    comparisonList.push(phone);
    localStorage.setItem('comparisonList', JSON.stringify(comparisonList));

    alert(`${phone.nama} ditambahkan ke daftar perbandingan!\n\nTotal: ${comparisonList.length} smartphone`);

    // Redirect to comparison page
    const goToComparison = confirm('Lihat halaman perbandingan sekarang?');
    if (goToComparison) {
        window.location.href = 'comparison.html';
    }
}
