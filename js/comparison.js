// ============================================
// COMPARISON PAGE LOGIC (comparison.html)
// Material Design 3 Style
// ============================================

// Auto-cleanup old comparison data
function validateComparisonData() {
  let selectedPhones = JSON.parse(localStorage.getItem('comparisonList')) || [];

  // Check jika ada data yang missing field penting dan refresh dari smartphoneData
  selectedPhones = selectedPhones.map(phone => {
    // Try to find the current phone data by id first, then by name
    const freshPhone = smartphoneData.find(p => p.id === phone.id) ||
      smartphoneData.find(p => p.nama === phone.nama);
    return freshPhone || null;
  }).filter(phone => {
    return phone && phone.id && phone.alternatif && phone.cpuGhz !== undefined &&
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
document.addEventListener('DOMContentLoaded', function () {
  renderNavbar();
  renderFooter();

  // Re-setup theme toggle after navbar is rendered
  if (typeof ThemeManager !== 'undefined') {
    ThemeManager.setupToggleButtons();
  }

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
          <span class="label-text">Smartphone ${i + 1}</span>
        </label>
        <select id="phoneSelect${i}" class="select" onchange="updatePhoneSelection(${i})">
          <option value="">Pilih Smartphone</option>
          ${smartphoneData.map(phone => `
            <option value="${phone.id}" ${selectedPhone && selectedPhone.id === phone.id ? 'selected' : ''}>
              ${phone.nama}
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
  const phoneId = select.value;

  if (!phoneId) {
    // Remove from selection
    if (selectedPhones[index]) {
      selectedPhones.splice(index, 1);
    }
  } else {
    const phone = smartphoneData.find(p => p.id === parseInt(phoneId));

    // Check duplicate using unique ID
    const isDuplicate = selectedPhones.some((p, i) => i !== index && p.id === parseInt(phoneId));
    if (isDuplicate) {
      if (typeof ModalComponent !== 'undefined') {
        ModalComponent.alert('Smartphone ini sudah dipilih!', {
          title: 'Duplikat',
          icon: 'fa-exclamation-circle'
        });
      } else {
        alert('Smartphone ini sudah dipilih!');
      }
      select.value = selectedPhones[index] ? selectedPhones[index].id : '';
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
    <div class="alert alert-info mt-md">
      <i class="fas fa-info-circle"></i>
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
  switch (key) {
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

// Render comparison ranking results (Material Design 3)
function renderComparisonRanking(scores) {
  const gridCols = Math.min(scores.length, 3);

  return `
    <div class="grid grid-cols-1 md:grid-cols-${gridCols} gap-md mb-lg">
      ${scores.slice(0, 3).map((item, index) => {
    const phone = selectedPhones.find(p => p.alternatif === item.alternatif && p.nama === item.nama);
    const medalIcon = index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉';
    const borderColor = index === 0 ? 'var(--md-flagship)' : index === 1 ? 'var(--md-secondary)' : 'var(--md-tertiary)';

    return `
          <div class="card card-elevated" style="border: 2px solid ${borderColor};">
            <div class="card-body text-center">
              <div style="font-size: 48px;">${medalIcon}</div>
              <h3 class="title-large">#${item.rank}</h3>
              <p class="title-small font-bold mb-sm">${item.nama}</p>
              <div class="divider"></div>
              <div>
                <p class="label-small text-muted">Score TOPSIS</p>
                <p class="headline-medium text-primary">${(item.score * 100).toFixed(2)}%</p>
              </div>
              <div class="mt-md" style="font-size: 12px;">
                <div class="flex justify-between mb-xs">
                  <span class="text-muted">Processor:</span>
                  <span class="font-semibold">${phone.processor}</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-muted">Harga:</span>
                  <span class="font-semibold">${formatCurrency(phone.harga)}</span>
                </div>
              </div>
            </div>
          </div>
        `;
  }).join('')}
    </div>

    <div class="table-container">
      <table class="table table-striped">
        <thead>
          <tr>
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
            <tr class="${index < 3 ? 'highlight-best' : ''}">
              <td class="text-center">
                <span class="badge badge-primary">${item.rank}</span>
              </td>
              <td style="font-family: monospace;">${item.alternatif}</td>
              <td>${item.nama}</td>
              <td class="text-center" style="font-family: monospace; font-size: 12px;">${item.dPlus}</td>
              <td class="text-center" style="font-family: monospace; font-size: 12px;">${item.dMinus}</td>
              <td>
                <div class="progress-cell">
                  <div class="progress" style="width: 80px;">
                    <div class="progress-bar" style="width: ${item.score * 100}%;"></div>
                  </div>
                  <span class="progress-value">${(item.score * 100).toFixed(2)}%</span>
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
    if (typeof ModalComponent !== 'undefined') {
      ModalComponent.alert('Pilih minimal 2 smartphone untuk dibandingkan!', {
        title: 'Info',
        icon: 'fa-info-circle'
      });
    } else {
      alert('Pilih minimal 2 smartphone untuk dibandingkan!');
    }
    return;
  }

  const resultDiv = document.getElementById('comparisonResult');
  const emptyState = document.getElementById('emptyState');
  const header = document.getElementById('comparisonHeader');
  const body = document.getElementById('comparisonBody');

  // Show result, hide empty state
  resultDiv.classList.remove('hidden');
  emptyState.classList.add('hidden');

  // Build header
  let headerHTML = '<th class="sticky">Spesifikasi</th>';
  selectedPhones.forEach(phone => {
    const badgeClass = getCategoryBadgeClass(phone.kategori);
    headerHTML += `
      <th class="text-center" style="min-width: 150px;">
        <div class="font-bold line-clamp-2">${phone.nama || 'Unknown'}</div>
        <div class="body-small text-muted mt-xs">${phone.processor || 'N/A'}</div>
        <span class="badge ${badgeClass} mt-xs">${phone.kategori || 'N/A'}</span>
      </th>
    `;
  });
  header.innerHTML = headerHTML;

  // Build body rows untuk semua 8 kriteria
  let bodyHTML = '';

  // Alternatif row
  bodyHTML += '<tr><td class="font-semibold sticky">Alternatif</td>';
  selectedPhones.forEach(phone => {
    bodyHTML += `<td class="text-center" style="font-family: monospace; font-weight: bold;">${phone.alternatif || 'N/A'}</td>`;
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

    bodyHTML += `<tr><td class="font-semibold sticky">${criteriaInfo.name || key}</td>`;

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
        bodyHTML += `<td class="text-center text-muted">N/A</td>`;
        return;
      }

      const displayValue = formatComparisonValue(value, key);

      // Highlight best value
      const isBest = bestValue !== null && value === bestValue;
      const cellClass = isBest ? 'highlight-best' : '';

      bodyHTML += `<td class="text-center ${cellClass}">${isBest ? '<i class="fas fa-trophy" style="margin-right: 4px;"></i>' : ''}${displayValue}</td>`;
    });

    bodyHTML += '</tr>';
  });

  // Category row
  bodyHTML += '<tr><td class="font-semibold sticky">Kategori</td>';
  selectedPhones.forEach(phone => {
    const badgeClass = getCategoryBadgeClass(phone.kategori);
    bodyHTML += `<td class="text-center"><span class="badge ${badgeClass}">${phone.kategori || 'N/A'}</span></td>`;
  });
  bodyHTML += '</tr>';

  // Range Harga row
  bodyHTML += '<tr><td class="font-semibold sticky">Range Harga</td>';
  selectedPhones.forEach(phone => {
    bodyHTML += `<td class="text-center text-muted">${phone.rangeHarga || 'N/A'}</td>`;
  });
  bodyHTML += '</tr>';

  body.innerHTML = bodyHTML;

  // Calculate dan display TOPSIS ranking
  calculateAndDisplayRanking();

  // Refresh animations
  if (typeof AnimationManager !== 'undefined') {
    AnimationManager.refreshScrollAnimations();
  }
}

// Clear comparison
async function clearComparison() {
  let isConfirmed = false;

  if (typeof ModalComponent !== 'undefined') {
    isConfirmed = await ModalComponent.confirm('Hapus semua pilihan perbandingan?', {
      title: 'Konfirmasi',
      icon: 'fa-trash-alt',
      confirmText: 'Hapus',
      cancelText: 'Batal',
      dangerous: true
    });
  } else {
    isConfirmed = window.confirm('Hapus semua pilihan perbandingan?');
  }

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

// Helper function untuk getCategoryBadge (Material Design 3)
function getCategoryBadgeClass(category) {
  const badges = {
    'Low-End': 'badge-low-end',
    'Mid-Range': 'badge-mid-range',
    'Flagship': 'badge-flagship'
  };
  return badges[category] || 'badge-outlined';
}
