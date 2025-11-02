// REUSABLE UI COMPONENTS


// Render Navigation Bar
function renderNavbar() {
  const navbar = document.getElementById('navbar');

  navbar.innerHTML = `
    <div class="navbar bg-base-100 shadow-md sticky top-0 z-50">
      <div class="container mx-auto w-full px-4 flex justify-between items-center">
        <div class="flex-1">
          <a href="index.html" class="btn btn-ghost text-lg font-bold text-primary">
            📱 Smartphone TOPSIS
          </a>
        </div>
        <div class="flex-none gap-2">
          <a href="index.html" class="btn btn-ghost btn-sm">Katalog</a>
          <a href="comparison.html" class="btn btn-ghost btn-sm">Perbandingan</a>
          <a href="ranking.html" class="btn btn-ghost btn-sm">Ranking TOPSIS</a>
          <label class="swap swap-rotate">
            <input type="checkbox" class="theme-controller" value="corporate" />
            <svg class="swap-off fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M21.64,13a1,1,0,0,0-1.05-.14,8,8,0,0,1-3.36.9,9.9,9.9,0,0,1-1.5-.1A10,10,0,0,1,7.51,2.75a10.1,10.1,0,0,1,8.9-1.6,1,1,0,0,0,1.15-1A12,12,0,0,0,12,2A12,12,0,0,0,8.04,23.87a10,10,0,0,0,9.63.5,1,1,0,0,0,.38-1.79Z" />
            </svg>
            <svg class="swap-on fill-current w-6 h-6" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM16.77,7.23a1,1,0,0,0,.92-.38l.71-.71a1,1,0,1,0-1.41-1.41l-.71.71A1,1,0,0,0,16.77,7.23Zm3.54,4.77h-1a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-1-9h1a1,1,0,0,0,0-2h-1a1,1,0,0,0,0,2ZM20.29,20.29a1,1,0,0,0-1.41,0l-.71.71a1,1,0,1,0,1.41,1.41l.71-.71A1,1,0,0,0,20.29,20.29ZM12,20a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V21A1,1,0,0,0,12,20Z" />
            </svg>
          </label>
        </div>
      </div>
    </div>
  `;
}

// Render Footer
function renderFooter() {
  const footer = document.getElementById('footer');

  footer.innerHTML = `
    <footer class="footer footer-center bg-base-300 text-base-content p-4 mt-12">
      <aside>
        <p>
          <strong>Smartphone TOPSIS</strong> - Sistem Pendukung Keputusan Pemilihan Smartphone<br/>
          Menggunakan Metode TOPSIS untuk analisis multi-kriteria
        </p>
      </aside>
      <nav class="grid grid-flow-col gap-4">
        <a href="index.html" class="link link-hover">Katalog</a>
        <a href="comparison.html" class="link link-hover">Perbandingan</a>
        <a href="ranking.html" class="link link-hover">Ranking</a>
      </nav>
      <aside>
        <p>&copy; 2025 Sistem Pendukung Keputusan | Data: Low-End, Mid-Range, Flagship</p>
      </aside>
    </footer>
  `;
}

// Render Phone Card
function renderPhoneCard(phone) {
  const categoryColor = getCategoryColor(phone.kategori);

  return `
    <div class="card card-compact bg-base-100 shadow-md hover:shadow-lg transition-shadow">
      <div class="card-body p-4">
        <div class="flex justify-between items-start gap-2 mb-2">
          <h3 class="card-title text-sm line-clamp-2">${phone.nama}</h3>
          <span class="badge badge-sm ${getCategoryBadge(phone.kategori)}">${phone.kategori}</span>
        </div>

        <div class="divider my-2"></div>

        <!-- Price -->
        <div class="flex justify-between text-sm mb-2">
          <span class="opacity-70">Harga:</span>
          <span class="font-semibold text-primary">${formatCurrency(phone.harga)}</span>
        </div>

        <!-- Specs Grid -->
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div class="bg-base-200 p-2 rounded">
            <div class="opacity-70">RAM</div>
            <div class="font-bold text-sm">${phone.ram}GB</div>
          </div>
          <div class="bg-base-200 p-2 rounded">
            <div class="opacity-70">Storage</div>
            <div class="font-bold text-sm">${phone.memori}GB</div>
          </div>
          <div class="bg-base-200 p-2 rounded">
            <div class="opacity-70">Kamera</div>
            <div class="font-bold text-sm">${phone.kamera}MP</div>
          </div>
          <div class="bg-base-200 p-2 rounded">
            <div class="opacity-70">Baterai</div>
            <div class="font-bold text-sm">${formatNumber(phone.baterai)}mAh</div>
          </div>
        </div>

        <div class="card-actions justify-between mt-4">
          <button class="btn btn-sm btn-ghost" onclick="viewPhoneDetail('${phone.alternatif}')">
            Detail
          </button>
          <button class="btn btn-sm btn-primary" onclick="addToComparison('${phone.alternatif}')">
            + Bandingkan
          </button>
        </div>
      </div>
    </div>
  `;
}

// Render Phone Detail Modal
function renderPhoneDetailModal(phone) {
  return `
    <div class="modal modal-open">
      <div class="modal-box w-11/12 max-w-2xl">
        <h3 class="font-bold text-lg mb-4">${phone.nama}</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div class="bg-base-200 p-4 rounded-lg">
            <h4 class="font-semibold mb-3">Spesifikasi Utama</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="opacity-70">Harga:</span>
                <span class="font-semibold">${formatCurrency(phone.harga)}</span>
              </div>
              <div class="flex justify-between">
                <span class="opacity-70">RAM:</span>
                <span class="font-semibold">${phone.ram} GB</span>
              </div>
              <div class="flex justify-between">
                <span class="opacity-70">Memori Internal:</span>
                <span class="font-semibold">${phone.memori} GB</span>
              </div>
              <div class="flex justify-between">
                <span class="opacity-70">Kamera:</span>
                <span class="font-semibold">${phone.kamera} MP</span>
              </div>
              <div class="flex justify-between">
                <span class="opacity-70">Baterai:</span>
                <span class="font-semibold">${formatNumber(phone.baterai)} mAh</span>
              </div>
            </div>
          </div>

          <div class="bg-base-200 p-4 rounded-lg">
            <h4 class="font-semibold mb-3">Informasi</h4>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="opacity-70">Alternatif:</span>
                <span class="font-semibold">${phone.alternatif}</span>
              </div>
              <div class="flex justify-between">
                <span class="opacity-70">Kategori:</span>
                <span class="font-semibold">${phone.kategori}</span>
              </div>
              <div class="flex justify-between">
                <span class="opacity-70">Range Harga:</span>
                <span class="font-semibold">${phone.rangeHarga}</span>
              </div>
              <div class="divider my-2"></div>
              <p class="text-xs opacity-70 italic">ID: ${phone.id}</p>
            </div>
          </div>
        </div>

        <div class="modal-action">
          <button class="btn btn-primary" onclick="addToComparison('${phone.alternatif}')">
            Tambah ke Perbandingan
          </button>
          <form method="dialog">
            <button class="btn">Tutup</button>
          </form>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop">
        <button>close</button>
      </form>
    </div>
  `;
}

// Render Comparison Row
function renderComparisonRow(criteriaKey, phones) {
  const criteriaInfo = criteria[criteriaKey];
  let row = `<tr>
    <td class="font-semibold bg-base-200">${criteriaInfo.name} (${criteriaInfo.unit})</td>`;

  phones.forEach(phone => {
    const value = phone[criteriaKey];
    let displayValue = '';

    if (criteriaKey === 'harga') {
      displayValue = formatCurrency(value);
    } else if (criteriaKey === 'baterai') {
      displayValue = formatNumber(value);
    } else {
      displayValue = value;
    }

    row += `<td>${displayValue}</td>`;
  });

  row += `</tr>`;
  return row;
}

// Render TOPSIS Step Card
function renderTOPSISStepCard(stepData, index) {
  let content = '';

  if (stepData.step === 1) {
    content = `
      <div class="overflow-x-auto">
        <table class="table table-sm table-zebra">
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
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="bg-success/10 p-4 rounded-lg border border-success">
          <h4 class="font-bold mb-3 text-success">Solusi Ideal Positif (A+)</h4>
          <div class="space-y-2 text-sm">
            ${Object.keys(criteria).map((key, i) => `
              <div class="flex justify-between">
                <span>${criteria[key].name}:</span>
                <span class="font-mono">${normalizeDecimal(stepData.idealPositive[i], 4)}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="bg-error/10 p-4 rounded-lg border border-error">
          <h4 class="font-bold mb-3 text-error">Solusi Ideal Negatif (A-)</h4>
          <div class="space-y-2 text-sm">
            ${Object.keys(criteria).map((key, i) => `
              <div class="flex justify-between">
                <span>${criteria[key].name}:</span>
                <span class="font-mono">${normalizeDecimal(stepData.idealNegative[i], 4)}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  if (stepData.step === 5) {
    content = `
      <div class="overflow-x-auto">
        <table class="table table-sm table-zebra">
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
                <td class="font-bold">${item.rank}</td>
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
    <div class="card bg-base-100 shadow-md mb-4">
      <div class="card-body">
        <h3 class="card-title text-lg">
          <span class="badge badge-primary">${stepData.step}</span>
          ${stepData.name}
        </h3>
        <p class="text-sm opacity-70 mb-4">${stepData.description}</p>
        <div class="overflow-auto max-h-96">
          ${content}
        </div>
      </div>
    </div>
  `;
}

// Render Weight Input Sliders
function renderWeightInputs(weights) {
  let html = '';
  let totalWeight = 0;

  Object.keys(criteria).forEach(key => {
    const criteriaInfo = criteria[key];
    const weight = weights[key];
    totalWeight += weight;

    html += `
      <div class="form-control mb-4">
        <label class="label">
          <span class="label-text font-medium">${criteriaInfo.name}</span>
          <span class="label-text-alt">
            <span id="weight-display-${key}" class="font-bold text-primary">${(weight * 100).toFixed(0)}%</span>
          </span>
        </label>
        <input type="range" id="weight-${key}" min="0" max="100" value="${(weight * 100).toFixed(0)}"
               class="range range-sm"
               onchange="updateWeightDisplay('${key}'); updateTotalWeight();" />
        <div class="flex justify-between text-xs px-2">
          <span>0%</span>
          <span>100%</span>
        </div>
      </div>
    `;
  });

  html += `
    <div class="alert ${totalWeight === 100 ? 'alert-success' : 'alert-warning'} mb-4">
      <span>Total Bobot: <strong id="total-weight">${totalWeight.toFixed(0)}%</strong></span>
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

// Update total weight display
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

// Render Ranking Results
function renderRankingResults(results) {
  return `
    <div class="overflow-x-auto">
      <table class="table table-zebra bg-base-100">
        <thead>
          <tr class="bg-base-300">
            <th>Rank</th>
            <th>Alternatif</th>
            <th>Smartphone</th>
            <th>Harga</th>
            <th>RAM</th>
            <th>Skor TOPSIS</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${results.ranking.map((item, index) => {
            const phone = smartphoneData.find(p => p.alternatif === item.alternatif);
            const medalIcon = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';

            return `
              <tr class="${index < 3 ? 'bg-base-200' : ''}">
                <td>
                  <span class="font-bold text-lg">${medalIcon} #${item.rank}</span>
                </td>
                <td class="font-mono font-semibold">${item.alternatif}</td>
                <td class="max-w-xs">${item.nama}</td>
                <td>${formatCurrency(phone.harga)}</td>
                <td>${phone.ram}GB</td>
                <td>
                  <div class="flex items-center gap-2">
                    <div class="progress progress-primary w-24 h-4">
                      <div style="width: ${item.score * 100}%"></div>
                    </div>
                    <span class="font-bold text-primary">${(item.score * 100).toFixed(2)}%</span>
                  </div>
                </td>
                <td>
                  <button class="btn btn-sm btn-ghost" onclick="viewPhoneDetail('${item.alternatif}')">
                    Detail
                  </button>
                </td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    renderNavbar,
    renderFooter,
    renderPhoneCard,
    renderPhoneDetailModal,
    renderComparisonRow,
    renderTOPSISStepCard,
    renderWeightInputs,
    renderRankingResults
  };
}
