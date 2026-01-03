// ============================================
// RANKING PAGE LOGIC (ranking.html)
// Material Design 3 Style
// ============================================

let currentWeights = { ...defaultWeights };
let topsisCalculator = null;

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
  renderNavbar();
  renderFooter();

  // Re-setup theme toggle after navbar is rendered
  if (typeof ThemeManager !== 'undefined') {
    ThemeManager.setupToggleButtons();
  }

  initializeWeights();
});

// Initialize weight inputs
function initializeWeights() {
  const container = document.getElementById('weightInputs');
  container.innerHTML = renderWeightInputsM3(currentWeights);
}

// Render weight inputs (Material Design 3 style)
function renderWeightInputsM3(weights) {
  const iconMap = {
    harga: 'fa-tag',
    ram: 'fa-memory',
    memori: 'fa-database',
    kamera: 'fa-camera',
    baterai: 'fa-battery-full',
    cpuGhz: 'fa-gauge-high',
    nanometer: 'fa-atom',
    charging: 'fa-bolt'
  };

  // Deskripsi untuk setiap kriteria
  const descriptions = {
    harga: 'Semakin tinggi bobot, semakin diprioritaskan smartphone dengan harga murah.',
    ram: 'Semakin tinggi bobot, semakin diprioritaskan smartphone dengan RAM besar untuk multitasking.',
    memori: 'Semakin tinggi bobot, semakin diprioritaskan smartphone dengan penyimpanan internal besar.',
    kamera: 'Semakin tinggi bobot, semakin diprioritaskan smartphone dengan resolusi kamera tinggi.',
    baterai: 'Semakin tinggi bobot, semakin diprioritaskan smartphone dengan kapasitas baterai besar.',
    cpuGhz: 'Semakin tinggi bobot, semakin diprioritaskan smartphone dengan kecepatan prosesor tinggi.',
    nanometer: 'Semakin tinggi bobot, semakin diprioritaskan smartphone dengan prosesor hemat daya (nm kecil).',
    charging: 'Semakin tinggi bobot, semakin diprioritaskan smartphone dengan pengisian daya cepat.'
  };

  let html = '<div class="weight-grid">';
  let totalWeight = 0;

  Object.keys(criteria).forEach(key => {
    const criteriaInfo = criteria[key];
    const weight = weights[key];
    totalWeight += weight * 100;

    html += `
      <div class="weight-item">
        <div class="weight-header">
          <span class="weight-label">
            <i class="fas ${iconMap[key]}"></i>
            ${criteriaInfo.name}
          </span>
          <span class="weight-value" id="weight-display-${key}">${(weight * 100).toFixed(0)}%</span>
        </div>
        <span class="weight-type ${criteriaInfo.type}">${criteriaInfo.type}</span>
        <p class="weight-description">${descriptions[key]}</p>
        <input type="range" id="weight-${key}" class="range mt-sm" 
               min="0" max="100" value="${(weight * 100).toFixed(0)}"
               onchange="updateWeightDisplay('${key}'); updateTotalWeight();" 
               oninput="updateWeightDisplay('${key}'); updateTotalWeight();">
        <div class="range-labels">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
    `;
  });

  html += '</div>';

  // Total weight alert
  html += `
    <div class="alert ${totalWeight === 100 ? 'alert-success' : 'alert-warning'} mt-lg">
      <i class="fas ${totalWeight === 100 ? 'fa-check-circle' : 'fa-exclamation-triangle'}"></i>
      <span>Total Bobot: <strong id="total-weight" class="title-medium">${totalWeight.toFixed(0)}%</strong></span>
    </div>
  `;

  return html;
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

  // Update icon
  const icon = alert.querySelector('i');
  icon.classList.remove('fa-check-circle', 'fa-exclamation-triangle');
  icon.classList.add(total === 100 ? 'fa-check-circle' : 'fa-exclamation-triangle');
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
  console.log('Category updated');
}

// Run TOPSIS calculation
function runTOPSIS() {
  // Get current weights
  const weights = getCurrentWeights();

  // Validate weights
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  if (Math.abs(totalWeight - 1) > 0.01) {
    if (typeof ModalComponent !== 'undefined') {
      ModalComponent.alert(`Total bobot harus 100%! Saat ini: ${(totalWeight * 100).toFixed(0)}%`, {
        title: 'Bobot Tidak Valid',
        icon: 'fa-exclamation-circle'
      });
    } else {
      alert('Total bobot harus 100%! Saat ini: ' + (totalWeight * 100).toFixed(0) + '%');
    }
    return;
  }

  // Get selected category
  const category = document.getElementById('categoryFilter').value;
  let phonesToAnalyze = category === 'all' ? smartphoneData : filterByCategory(smartphoneData, category);

  if (phonesToAnalyze.length === 0) {
    if (typeof ModalComponent !== 'undefined') {
      ModalComponent.alert('Tidak ada smartphone untuk dianalisis!', {
        title: 'Data Kosong',
        icon: 'fa-database'
      });
    } else {
      alert('Tidak ada smartphone untuk dianalisis!');
    }
    return;
  }

  // Show loading
  const rankingResults = document.getElementById('rankingResults');
  rankingResults.innerHTML = `
    <div class="text-center py-xl">
      <div class="loading"></div>
      <p class="body-medium mt-md text-muted">Menghitung...</p>
    </div>
  `;

  // Switch to ranking tab IMMEDIATELY so user sees loading
  if (typeof showTab === 'function') {
    showTab('ranking');
  }

  // Scroll to results section
  const contentRanking = document.getElementById('content-ranking');
  if (contentRanking) {
    contentRanking.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Run calculation with small delay for smooth UX
  setTimeout(() => {
    // Create calculator instance
    topsisCalculator = new TOPSISCalculator(phonesToAnalyze, weights);

    // Calculate
    const results = topsisCalculator.calculate();

    // Display results
    displayResults(results);
  }, 300);
}

// Display TOPSIS results
function displayResults(results) {
  const rankingResults = document.getElementById('rankingResults');
  const calculationSteps = document.getElementById('calculationSteps');

  // Get the phones that were analyzed
  const analyzedPhones = topsisCalculator.phones;

  // Render ranking results - match by alternatif AND nama
  const resultsWithPhone = results.scores.map(item => {
    const phone = analyzedPhones.find(p =>
      p.alternatif === item.alternatif && p.nama === item.nama
    );
    return { ...item, ...phone };
  });

  rankingResults.innerHTML = renderRankingTableM3(resultsWithPhone);

  // Render calculation steps
  calculationSteps.innerHTML = results.steps.map((step, index) =>
    renderTOPSISStepCardM3(step, index)
  ).join('');

  // Refresh animations
  if (typeof AnimationManager !== 'undefined') {
    AnimationManager.refreshScrollAnimations();
  }
}

// Render ranking table (Material Design 3)
function renderRankingTableM3(results) {
  return `
    <div class="alert alert-success mb-lg">
      <i class="fas fa-check-circle"></i>
      <span>Perhitungan TOPSIS berhasil! Total ${results.length} smartphone dianalisis.</span>
    </div>

    <div class="table-container">
      <table class="table table-striped table-ranking">
        <thead>
          <tr>
            <th style="width: 80px;">Rank</th>
            <th style="width: 100px;">Alternatif</th>
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
    const badgeClass = getCategoryBadgeClass(item.kategori);

    return `
              <tr>
                <td>
                  <div class="medal-cell">
                    <span class="medal">${medalIcon}</span>
                    <span class="font-bold">${item.rank}</span>
                  </div>
                </td>
                <td style="font-family: monospace; font-weight: 600;">${item.alternatif}</td>
                <td style="min-width: 200px;">${item.nama}</td>
                <td><span class="badge ${badgeClass}">${item.kategori}</span></td>
                <td class="text-right">${formatCurrency(item.harga)}</td>
                <td class="text-center">${item.ram}GB</td>
                <td class="text-center">${item.memori}GB</td>
                <td class="text-center" style="font-family: monospace; font-size: 12px;">${item.dPlus}</td>
                <td class="text-center" style="font-family: monospace; font-size: 12px;">${item.dMinus}</td>
                <td class="text-center">
                  <div class="progress-cell">
                    <div class="progress" style="width: 80px;">
                      <div class="progress-bar" style="width: ${item.score * 100}%;"></div>
                    </div>
                    <span class="progress-value">${(item.score * 100).toFixed(2)}%</span>
                  </div>
                </td>
              </tr>
            `;
  }).join('')}
        </tbody>
      </table>
    </div>

    <div class="card card-outlined mt-lg">
      <div class="card-body">
        <h4 class="card-title">
          <i class="fas fa-chart-bar"></i>
          Top 3 Rekomendasi
        </h4>
        <ol style="list-style: decimal; padding-left: 20px; margin-top: 12px;">
          ${results.slice(0, 3).map(item => `
            <li class="body-medium mb-sm">
              <strong>${item.nama}</strong> - Skor: ${(item.score * 100).toFixed(2)}% 
              <span class="badge ${getCategoryBadgeClass(item.kategori)} badge-sm">${item.kategori}</span>
            </li>
          `).join('')}
        </ol>
      </div>
    </div>
  `;
}

// Render TOPSIS step card (Material Design 3)
function renderTOPSISStepCardM3(stepData, index) {
  let content = '';

  if (stepData.step === 1) {
    content = `
      <div class="table-container">
        <table class="table table-striped table-compact">
          <thead>
            <tr>
              <th>No</th>
              <th>Alternatif</th>
              ${Object.keys(criteria).map(key => `<th>${criteria[key].name}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${stepData.data.map((row, i) => `
              <tr>
                <td>${i + 1}</td>
                <td>${smartphoneData[i].alternatif}</td>
                ${row.map(val => `<td>${normalizeDecimal(val, 4)}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  if (stepData.step === 3) {
    content = `
      <div class="ideal-solutions">
        <div class="ideal-solution ideal-positive">
          <h4 class="ideal-title">
            <i class="fas fa-arrow-up"></i> Solusi Ideal Positif (A+)
          </h4>
          ${Object.keys(criteria).map((key, i) => `
            <div class="ideal-item">
              <span>${criteria[key].name}:</span>
              <span class="ideal-item-value">${normalizeDecimal(stepData.idealPositive[i], 4)}</span>
            </div>
          `).join('')}
        </div>
        <div class="ideal-solution ideal-negative">
          <h4 class="ideal-title">
            <i class="fas fa-arrow-down"></i> Solusi Ideal Negatif (A-)
          </h4>
          ${Object.keys(criteria).map((key, i) => `
            <div class="ideal-item">
              <span>${criteria[key].name}:</span>
              <span class="ideal-item-value">${normalizeDecimal(stepData.idealNegative[i], 4)}</span>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  if (stepData.step === 5) {
    content = `
      <div class="table-container">
        <table class="table table-striped table-compact">
          <thead>
            <tr>
              <th>Rank</th>
              <th>Alternatif</th>
              <th>D+</th>
              <th>D-</th>
              <th>Skor TOPSIS</th>
            </tr>
          </thead>
          <tbody>
            ${stepData.data.map(item => `
              <tr>
                <td class="font-bold">
                  ${item.rank <= 3 ? ['🥇', '🥈', '🥉'][item.rank - 1] : ''} #${item.rank}
                </td>
                <td>${item.alternatif} - ${item.nama}</td>
                <td>${item.dPlus}</td>
                <td>${item.dMinus}</td>
                <td class="font-bold text-primary">${item.score}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  return `
    <div class="card card-elevated topsis-step mb-md" data-animate="slide-up">
      <div class="card-body">
        <div class="topsis-step-header">
          <span class="topsis-step-number">${stepData.step}</span>
          <span class="topsis-step-title">${stepData.name}</span>
        </div>
        <p class="topsis-step-description">${stepData.description}</p>
        <div class="overflow-auto" style="max-height: 400px;">
          ${content}
        </div>
      </div>
    </div>
  `;
}

// Helper function untuk getCategoryBadge (Material Design 3)
function getCategoryBadgeClass(category) {
  const badges = {
    'Low-End': 'badge-low-end',
    'Mid-Range': 'badge-mid-range',
    'Flagship': 'badge-flagship'
  };
  return badges[category] || 'badge-outlined';
}
