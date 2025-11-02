// COMPARISON PAGE LOGIC (comparison.html)

// Auto-cleanup old comparison data
function validateComparisonData() {
    let selectedPhones = JSON.parse(localStorage.getItem('comparisonList')) || [];

    // Check jika ada data yang missing field penting
    selectedPhones = selectedPhones.filter(phone => {
        return phone && phone.alternatif && phone.cpuGhz !== undefined &&
               phone.nanometer !== undefined && phone.charging !== undefined;
    });

    if (selectedPhones.length === 0) {
        localStorage.removeItem('comparisonList');
    } else {
        localStorage.setItem('comparisonList', JSON.stringify(selectedPhones));
    }

    return selectedPhones;
}

let selectedPhones = validateComparisonData();

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    renderNavbar();
    renderFooter();
    renderPhoneSelectors();

    if (selectedPhones.length >= 2) {
        buildComparison();
    }
});

// Render phone selectors
function renderPhoneSelectors() {
    const container = document.getElementById('phoneSelectors');
    const maxSelections = 5;

    let html = '';

    for (let i = 0; i < maxSelections; i++) {
        const selectedPhone = selectedPhones[i];

        html += `
            <div class="form-control">
                <label class="label">
                    <span class="label-text font-medium">Smartphone ${i + 1}</span>
                </label>
                <select id="phoneSelect${i}" class="select select-bordered select-sm w-full"
                        onchange="updatePhoneSelection(${i})">
                    <option value="">Pilih Smartphone</option>
                    ${smartphoneData.map(phone => `
                        <option value="${phone.alternatif}"
                                ${selectedPhone && selectedPhone.alternatif === phone.alternatif ? 'selected' : ''}>
                            ${phone.nama} (${phone.processor || 'N/A'})
                        </option>
                    `).join('')}
                </select>
            </div>
        `;
    }

    container.innerHTML = html;
    updateSelectedList();
}

// Update phone selection
function updatePhoneSelection(index) {
    const select = document.getElementById(`phoneSelect${index}`);
    const alternatif = select.value;

    if (!alternatif) {
        // Remove from selection
        if (selectedPhones[index]) {
            selectedPhones.splice(index, 1);
        }
    } else {
        const phone = smartphoneData.find(p => p.alternatif === alternatif);

        // Check duplicate
        const isDuplicate = selectedPhones.some((p, i) => i !== index && p.alternatif === alternatif);
        if (isDuplicate) {
            alert('Smartphone ini sudah dipilih!');
            select.value = selectedPhones[index] ? selectedPhones[index].alternatif : '';
            return;
        }

        if (selectedPhones[index]) {
            selectedPhones[index] = phone;
        } else {
            selectedPhones.push(phone);
        }
    }

    localStorage.setItem('comparisonList', JSON.stringify(selectedPhones));
    updateSelectedList();
}

// Update selected phones list display
function updateSelectedList() {
    const container = document.getElementById('selectedPhonesList');

    if (selectedPhones.length === 0) {
        container.innerHTML = '';
        return;
    }

    container.innerHTML = `
        <div class="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span><strong>${selectedPhones.length}</strong> smartphone dipilih untuk dibandingkan</span>
        </div>
    `;
}

// Format value with null check
function formatComparisonValue(value, key) {
    // Handle null/undefined
    if (value === null || value === undefined) {
        return 'N/A';
    }

    // Format value berdasarkan kriteria
    switch(key) {
        case 'harga':
            return formatCurrency(value);
        case 'baterai':
            return formatNumber(value) + ' mAh';
        case 'cpuGhz':
            return (value || 0) + ' GHz';
        case 'nanometer':
            return (value || 0) + ' nm';
        case 'charging':
            return (value || 0) + ' W';
        case 'kamera':
            return (value || 0) + ' MP';
        case 'ram':
        case 'memori':
            return (value || 0) + ' GB';
        default:
            return value || 'N/A';
    }
}

// Calculate dan display TOPSIS ranking
function calculateAndDisplayRanking() {
    if (selectedPhones.length < 2) {
        return;
    }

    try {
        // Create TOPSIS calculator dengan default weights
        const topsisCalc = new TOPSISCalculator(selectedPhones, defaultWeights);
        const results = topsisCalc.calculate();

        // Render ranking
        const rankingDiv = document.getElementById('rankingResults');
        rankingDiv.innerHTML = renderComparisonRanking(results.scores);

        // Show ranking section
        document.getElementById('rankingSection').classList.remove('hidden');
    } catch (error) {
        console.error('Error calculating TOPSIS:', error);
        document.getElementById('rankingSection').classList.add('hidden');
    }
}

// Render comparison ranking results
function renderComparisonRanking(scores) {
    return `
        <div class="grid grid-cols-1 md:grid-cols-${Math.min(scores.length, 3)} gap-4 mb-6">
            ${scores.slice(0, 3).map((item, index) => {
                const phone = smartphoneData.find(p => p.alternatif === item.alternatif);
                const medalIcon = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
                const medalColor = index === 0 ? 'border-yellow-400' : index === 1 ? 'border-gray-400' : 'border-orange-400';

                return `
                    <div class="card bg-gradient-to-br from-base-100 to-base-200 border-2 ${medalColor} shadow-lg">
                        <div class="card-body">
                            <div class="text-4xl text-center mb-2">${medalIcon}</div>
                            <h3 class="card-title text-lg text-center">#${item.rank}</h3>
                            <p class="text-sm text-center font-bold mb-2">${item.nama}</p>
                            <div class="divider my-2"></div>
                            <div class="text-center">
                                <p class="text-xs opacity-70">Score TOPSIS</p>
                                <p class="text-2xl font-bold text-primary">${(item.score * 100).toFixed(2)}%</p>
                            </div>
                            <div class="mt-3 space-y-1 text-xs">
                                <div class="flex justify-between">
                                    <span>Processor:</span>
                                    <span class="font-semibold">${phone.processor}</span>
                                </div>
                                <div class="flex justify-between">
                                    <span>Harga:</span>
                                    <span class="font-semibold">${formatCurrency(phone.harga)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>

        <div class="overflow-x-auto">
            <table class="table table-sm table-zebra w-full">
                <thead>
                    <tr class="bg-base-300">
                        <th>Rank</th>
                        <th>Alternatif</th>
                        <th>Smartphone</th>
                        <th>D+</th>
                        <th>D-</th>
                        <th>Score</th>
                    </tr>
                </thead>
                <tbody>
                    ${scores.map((item, index) => `
                        <tr class="${index < 3 ? 'bg-base-200 font-semibold' : ''}">
                            <td class="text-center">
                                <span class="badge badge-lg badge-primary">${item.rank}</span>
                            </td>
                            <td class="font-mono">${item.alternatif}</td>
                            <td>${item.nama}</td>
                            <td class="text-right font-mono text-xs">${item.dPlus}</td>
                            <td class="text-right font-mono text-xs">${item.dMinus}</td>
                            <td class="text-right">
                                <div class="flex items-center justify-end gap-2">
                                    <progress class="progress progress-primary w-16 h-2" value="${item.score * 100}" max="100"></progress>
                                    <span class="font-bold text-primary text-sm min-w-max">${(item.score * 100).toFixed(2)}%</span>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

// Build comparison table
function buildComparison() {
    if (selectedPhones.length < 2) {
        alert('Pilih minimal 2 smartphone untuk dibandingkan!');
        return;
    }

    const resultDiv = document.getElementById('comparisonResult');
    const emptyState = document.getElementById('emptyState');
    const header = document.getElementById('comparisonHeader');
    const body = document.getElementById('comparisonBody');

    // Show result, hide empty state
    resultDiv.classList.remove('hidden');
    emptyState.classList.add('hidden');

    // Build header dengan processor info
    let headerHTML = '<th class="sticky left-0 z-10 bg-base-300">Spesifikasi</th>';
    selectedPhones.forEach(phone => {
        headerHTML += `
            <th class="text-center min-w-max">
                <div class="font-bold text-sm line-clamp-2">${phone.nama || 'Unknown'}</div>
                <div class="text-xs opacity-70 mt-1">${phone.processor || 'N/A'}</div>
                <div class="badge ${getCategoryBadge(phone.kategori)} badge-xs mt-1">${phone.kategori || 'N/A'}</div>
            </th>
        `;
    });
    header.innerHTML = headerHTML;

    // Build body rows untuk semua 8 kriteria
    let bodyHTML = '';

    // Alternatif row
    bodyHTML += '<tr><td class="font-semibold bg-base-200 sticky left-0 z-10">Alternatif</td>';
    selectedPhones.forEach(phone => {
        bodyHTML += `<td class="text-center font-mono font-bold">${phone.alternatif || 'N/A'}</td>`;
    });
    bodyHTML += '</tr>';

    // Semua kriteria rows
    const allCriteria = ['harga', 'ram', 'memori', 'kamera', 'baterai', 'cpuGhz', 'nanometer', 'charging'];

    allCriteria.forEach(key => {
        const criteriaInfo = criteria[key];

        if (!criteriaInfo) {
            console.warn(`Kriteria ${key} tidak ditemukan`);
            return;
        }

        bodyHTML += `<tr><td class="font-semibold bg-base-200 sticky left-0 z-10">${criteriaInfo.name || key}</td>`;

        // Get all values for this criteria
        const values = selectedPhones.map(p => p[key]).filter(v => v !== null && v !== undefined);
        const isBenefit = criteriaInfo.type === 'benefit';

        // Find best value with safety check
        const bestValue = values.length > 0
            ? (isBenefit ? Math.max(...values) : Math.min(...values))
            : null;

        selectedPhones.forEach(phone => {
            const value = phone[key];

            // Safety check untuk value yang tidak ada
            if (value === null || value === undefined) {
                bodyHTML += `<td class="text-center text-sm text-gray-400">N/A</td>`;
                return;
            }

            const displayValue = formatComparisonValue(value, key);

            // Highlight best value
            const isBest = bestValue !== null && value === bestValue;
            const cellClass = isBest ? 'bg-success/20 font-bold text-success' : '';

            bodyHTML += `<td class="text-center text-sm ${cellClass}">${displayValue}</td>`;
        });

        bodyHTML += '</tr>';
    });

    // Category row
    bodyHTML += '<tr><td class="font-semibold bg-base-200 sticky left-0 z-10">Kategori</td>';
    selectedPhones.forEach(phone => {
        bodyHTML += `<td class="text-center"><span class="badge ${getCategoryBadge(phone.kategori)} badge-sm">${phone.kategori || 'N/A'}</span></td>`;
    });
    bodyHTML += '</tr>';

    // Range Harga row
    bodyHTML += '<tr><td class="font-semibold bg-base-200 sticky left-0 z-10">Range Harga</td>';
    selectedPhones.forEach(phone => {
        bodyHTML += `<td class="text-center text-sm opacity-70">${phone.rangeHarga || 'N/A'}</td>`;
    });
    bodyHTML += '</tr>';

    body.innerHTML = bodyHTML;

    // Calculate dan display TOPSIS ranking
    calculateAndDisplayRanking();
}

// Clear comparison
function clearComparison() {
    const isConfirmed = window.confirm('Hapus semua pilihan perbandingan?');
    if (!isConfirmed) return;

    selectedPhones = [];
    localStorage.removeItem('comparisonList');

    // Reset selectors
    for (let i = 0; i < 5; i++) {
        const select = document.getElementById(`phoneSelect${i}`);
        if (select) select.value = '';
    }

    // Hide result, show empty state
    document.getElementById('comparisonResult').classList.add('hidden');
    document.getElementById('rankingSection').classList.add('hidden');
    document.getElementById('emptyState').classList.remove('hidden');

    updateSelectedList();
}

// Helper function untuk getCategoryBadge
function getCategoryBadge(category) {
    const badges = {
        'Low-End': 'badge-secondary',
        'Mid-Range': 'badge-accent',
        'Flagship': 'badge-info'
    };
    return badges[category] || 'badge-neutral';
}
