// RANKING PAGE LOGIC (ranking.html)

let currentWeights = { ...defaultWeights };
let topsisCalculator = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    renderNavbar();
    renderFooter();
    initializeWeights();

    // Set default tab to first (Info Kriteria)
    document.querySelectorAll('input[name="my_tabs"]')[2].checked = true;
});

// Initialize weight inputs
function initializeWeights() {
    const container = document.getElementById('weightInputs');
    container.innerHTML = renderWeightInputs(currentWeights);
}

// Update weight display
function updateWeightDisplay(criteriaKey) {
    const slider = document.getElementById(`weight-${criteriaKey}`);
    const display = document.getElementById(`weight-display-${criteriaKey}`);
    display.textContent = slider.value + '%';
}

// Update total weight
function updateTotalWeight() {
    let total = 0;
    Object.keys(criteria).forEach(key => {
        const slider = document.getElementById(`weight-${key}`);
        total += parseInt(slider.value);
    });

    const totalDisplay = document.getElementById('total-weight');
    totalDisplay.textContent = total.toFixed(0) + '%';

    const alert = totalDisplay.closest('.alert');
    alert.classList.remove('alert-success', 'alert-warning');
    alert.classList.add(total === 100 ? 'alert-success' : 'alert-warning');
}

// Reset weights to default
function resetWeights() {
    currentWeights = { ...defaultWeights };

    Object.keys(criteria).forEach(key => {
        const slider = document.getElementById(`weight-${key}`);
        if (slider) {
            slider.value = (currentWeights[key] * 100).toFixed(0);
            updateWeightDisplay(key);
        }
    });

    updateTotalWeight();
}

// Get current weights from sliders
function getCurrentWeights() {
    const weights = {};

    Object.keys(criteria).forEach(key => {
        const slider = document.getElementById(`weight-${key}`);
        weights[key] = parseInt(slider.value) / 100;
    });

    return weights;
}

// Update phone list based on category
function updatePhoneList() {
    // This can be expanded if needed
    console.log('Category updated');
}

// Run TOPSIS calculation
function runTOPSIS() {
    // Get current weights
    const weights = getCurrentWeights();

    // Validate weights
    const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
    if (Math.abs(totalWeight - 1) > 0.01) {
        alert('Total bobot harus 100%! Saat ini: ' + (totalWeight * 100).toFixed(0) + '%');
        return;
    }

    // Get selected category
    const category = document.getElementById('categoryFilter').value;
    let phonesToAnalyze = category === 'all' ? smartphoneData : filterByCategory(smartphoneData, category);

    if (phonesToAnalyze.length === 0) {
        alert('Tidak ada smartphone untuk dianalisis!');
        return;
    }

    // Show loading
    const rankingResults = document.getElementById('rankingResults');
    rankingResults.innerHTML = '<div class="text-center py-12"><span class="loading loading-spinner loading-lg"></span><p class="mt-4">Menghitung...</p></div>';

    // Run calculation with small delay for smooth UX
    setTimeout(() => {
        // Create calculator instance
        topsisCalculator = new TOPSISCalculator(phonesToAnalyze, weights);

        // Calculate
        const results = topsisCalculator.calculate();

        // Display results
        displayResults(results);

        // Switch to ranking tab
        document.querySelectorAll('input[name="my_tabs"]')[0].checked = true;
    }, 300);
}

// Display TOPSIS results
function displayResults(results) {
    const rankingResults = document.getElementById('rankingResults');
    const calculationSteps = document.getElementById('calculationSteps');

    // Get the phones that were analyzed (from the calculator)
    const analyzedPhones = topsisCalculator.phones;

    // Render ranking results - match by alternatif AND nama to ensure correct phone
    const resultsWithPhone = results.scores.map(item => {
        // Find from the analyzed phones (filtered by category), not all smartphoneData
        const phone = analyzedPhones.find(p =>
            p.alternatif === item.alternatif && p.nama === item.nama
        );
        return { ...item, ...phone };
    });

    rankingResults.innerHTML = renderRankingTable(resultsWithPhone);

    // Render calculation steps
    calculationSteps.innerHTML = results.steps.map((step, index) =>
        renderTOPSISStepCard(step, index)
    ).join('');
}

// Render ranking table
function renderRankingTable(results) {
    return `
        <div class="mb-4">
            <div class="alert alert-success">
                <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Perhitungan TOPSIS berhasil! Total ${results.length} smartphone dianalisis.</span>
            </div>
        </div>

        <div class="overflow-x-auto">
            <table class="table table-zebra w-full">
                <thead>
                    <tr class="bg-base-300">
                        <th class="w-16">Rank</th>
                        <th class="w-24">Alternatif</th>
                        <th>Nama Smartphone</th>
                        <th>Kategori</th>
                        <th class="text-right">Harga</th>
                        <th class="text-center">RAM</th>
                        <th class="text-center">Storage</th>
                        <th class="text-center">D+</th>
                        <th class="text-center">D-</th>
                        <th class="text-center">Skor</th>
                    </tr>
                </thead>
                <tbody>
                    ${results.map((item, index) => {
        const medalIcon = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
        const highlightClass = index < 3 ? 'bg-base-200' : '';

        return `
                            <tr class="${highlightClass}">
                                <td class="font-bold text-lg">${medalIcon} ${item.rank}</td>
                                <td class="font-mono font-semibold">${item.alternatif}</td>
                                <td class="min-w-[200px]">${item.nama}</td>
                                <td><span class="badge ${getCategoryBadge(item.kategori)} badge-sm">${item.kategori}</span></td>
                                <td class="text-right">${formatCurrency(item.harga)}</td>
                                <td class="text-center">${item.ram}GB</td>
                                <td class="text-center">${item.memori}GB</td>
                                <td class="text-center font-mono text-sm">${item.dPlus}</td>
                                <td class="text-center font-mono text-sm">${item.dMinus}</td>
                                <td class="text-center">
                                    <div class="flex flex-col items-center gap-1">
                                        <span class="font-bold text-primary">${(item.score * 100).toFixed(2)}%</span>
                                        <progress class="progress progress-primary w-20" value="${item.score * 100}" max="100"></progress>
                                    </div>
                                </td>
                            </tr>
                        `;
    }).join('')}
                </tbody>
            </table>
        </div>

        <div class="mt-6 p-4 bg-base-200 rounded-lg">
            <h4 class="font-semibold mb-2">📊 Top 3 Rekomendasi:</h4>
            <ol class="list-decimal list-inside space-y-1">
                ${results.slice(0, 3).map(item => `
                    <li class="text-sm"><strong>${item.nama}</strong> - Skor: ${(item.score * 100).toFixed(2)}% (${item.kategori})</li>
                `).join('')}
            </ol>
        </div>
    `;
}
