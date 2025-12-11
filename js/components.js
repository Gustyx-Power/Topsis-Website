
// REUSABLE UI COMPONENTS - Enhanced with FontAwesome Icons

// Render Navigation Bar
function renderNavbar() {
  const navbar = document.getElementById('navbar');

  navbar.innerHTML = `
    <div class="navbar bg-base-100/80 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-base-content/5">
      <div class="container mx-auto w-full px-4 flex justify-between items-center">
        <div class="flex-1">
          <a href="index.html" class="btn btn-ghost text-lg font-bold gap-2 group">
            <span class="text-2xl group-hover:animate-bounce">📱</span>
            <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Smartphone TOPSIS
            </span>
          </a>
        </div>
        <div class="flex-none gap-1">
          <a href="index.html" class="btn btn-ghost btn-sm gap-2 hover:text-primary transition-colors">
            <i class="fas fa-th-large"></i>
            <span class="hidden md:inline">Katalog</span>
          </a>
          <a href="comparison.html" class="btn btn-ghost btn-sm gap-2 hover:text-accent transition-colors">
            <i class="fas fa-code-compare"></i>
            <span class="hidden md:inline">Perbandingan</span>
          </a>
          <a href="ranking.html" class="btn btn-ghost btn-sm gap-2 hover:text-secondary transition-colors">
            <i class="fas fa-chart-line"></i>
            <span class="hidden md:inline">Ranking</span>
          </a>
          <div class="divider divider-horizontal mx-2 hidden md:flex"></div>
          <label class="swap swap-rotate btn btn-ghost btn-sm btn-circle">
            <input type="checkbox" class="theme-controller" value="corporate" />
            <i class="fas fa-moon swap-off text-lg"></i>
            <i class="fas fa-sun swap-on text-lg text-warning"></i>
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
    <footer class="footer footer-center bg-base-100/50 backdrop-blur-lg text-base-content p-8 mt-12 border-t border-base-content/5">
      <aside class="space-y-3">
        <div class="flex items-center gap-2 justify-center">
          <span class="text-3xl">📱</span>
          <span class="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Smartphone TOPSIS
          </span>
        </div>
        <p class="opacity-70">
          Sistem Pendukung Keputusan Pemilihan Smartphone<br/>
          Menggunakan Metode TOPSIS untuk analisis multi-kriteria (8 Kriteria)
        </p>
      </aside>
      <nav class="grid grid-flow-col gap-6">
        <a href="index.html" class="link link-hover flex items-center gap-2 hover:text-primary transition-colors">
          <i class="fas fa-th-large"></i> Katalog
        </a>
        <a href="comparison.html" class="link link-hover flex items-center gap-2 hover:text-accent transition-colors">
          <i class="fas fa-code-compare"></i> Perbandingan
        </a>
        <a href="ranking.html" class="link link-hover flex items-center gap-2 hover:text-secondary transition-colors">
          <i class="fas fa-chart-line"></i> Ranking
        </a>
      </nav>
      <aside class="opacity-50">
        <p>© 2025 Sistem Pendukung Keputusan | Low-End • Mid-Range • Flagship</p>
      </aside>
    </footer>
  `;
}

// Render Phone Card
function renderPhoneCard(phone) {
  const categoryConfig = {
    'Low-End': { badge: 'badge-secondary', icon: 'fa-coins', gradient: 'from-pink-500 to-rose-500' },
    'Mid-Range': { badge: 'badge-accent', icon: 'fa-star', gradient: 'from-purple-500 to-violet-500' },
    'Flagship': { badge: 'badge-warning', icon: 'fa-crown', gradient: 'from-amber-500 to-orange-500' }
  };

  const config = categoryConfig[phone.kategori] || { badge: 'badge-neutral', icon: 'fa-mobile', gradient: 'from-gray-500 to-slate-500' };

  return `
    <div class="card card-compact bg-base-100/80 backdrop-blur-lg shadow-lg hover:shadow-2xl transition-all duration-300 border border-base-content/5 phone-card group" data-aos="fade-up">
      <!-- Gradient Top Border -->
      <div class="h-1 bg-gradient-to-r ${config.gradient} rounded-t-2xl opacity-60 group-hover:opacity-100 transition-opacity"></div>
      
      <div class="card-body p-5">
        <!-- Header -->
        <div class="flex justify-between items-start gap-3 mb-3">
          <h3 class="card-title text-sm font-bold line-clamp-2 group-hover:text-primary transition-colors">${phone.nama}</h3>
          <div class="badge ${config.badge} badge-sm flex-shrink-0 gap-1">
            <i class="fas ${config.icon} text-xs"></i> ${phone.kategori}
          </div>
        </div>

        <!-- Price -->
        <div class="flex items-center justify-between p-3 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl mb-3">
          <span class="text-sm opacity-70"><i class="fas fa-tag mr-2"></i>Harga</span>
          <span class="font-bold text-lg text-primary">${formatCurrency(phone.harga)}</span>
        </div>
        
        <!-- Processor -->
        <div class="flex items-center gap-2 text-xs mb-3 p-2 bg-base-200/50 rounded-lg">
          <i class="fas fa-microchip text-secondary"></i>
          <span class="font-medium truncate">${phone.processor}</span>
        </div>

        <!-- Specs Grid 2x3 -->
        <div class="grid grid-cols-3 gap-2 text-xs mb-3">
          <div class="bg-base-200/50 p-3 rounded-xl text-center hover:bg-base-200 transition-colors">
            <div class="text-secondary mb-1"><i class="fas fa-memory"></i></div>
            <div class="font-bold">${phone.ram}GB</div>
            <div class="opacity-50 text-[10px]">RAM</div>
          </div>
          <div class="bg-base-200/50 p-3 rounded-xl text-center hover:bg-base-200 transition-colors">
            <div class="text-accent mb-1"><i class="fas fa-database"></i></div>
            <div class="font-bold">${phone.memori}GB</div>
            <div class="opacity-50 text-[10px]">Storage</div>
          </div>
          <div class="bg-base-200/50 p-3 rounded-xl text-center hover:bg-base-200 transition-colors">
            <div class="text-info mb-1"><i class="fas fa-camera"></i></div>
            <div class="font-bold">${phone.kamera}MP</div>
            <div class="opacity-50 text-[10px]">Kamera</div>
          </div>
          <div class="bg-base-200/50 p-3 rounded-xl text-center hover:bg-base-200 transition-colors">
            <div class="text-success mb-1"><i class="fas fa-battery-full"></i></div>
            <div class="font-bold">${formatNumber(phone.baterai)}</div>
            <div class="opacity-50 text-[10px]">mAh</div>
          </div>
          <div class="bg-base-200/50 p-3 rounded-xl text-center hover:bg-base-200 transition-colors">
            <div class="text-warning mb-1"><i class="fas fa-bolt"></i></div>
            <div class="font-bold">${phone.charging}W</div>
            <div class="opacity-50 text-[10px]">Charging</div>
          </div>
          <div class="bg-base-200/50 p-3 rounded-xl text-center hover:bg-base-200 transition-colors">
            <div class="text-error mb-1"><i class="fas fa-gauge-high"></i></div>
            <div class="font-bold">${phone.cpuGhz}</div>
            <div class="opacity-50 text-[10px]">GHz</div>
          </div>
        </div>

        <!-- Process Node -->
        <div class="flex justify-between text-xs p-2 bg-gradient-to-r from-base-200/50 to-transparent rounded-lg">
          <span class="opacity-70"><i class="fas fa-atom mr-1"></i> Process Node:</span>
          <span class="font-semibold">${phone.nanometer}nm</span>
        </div>

        <!-- Actions -->
        <div class="card-actions justify-between mt-4 pt-3 border-t border-base-content/5">
          <button class="btn btn-ghost btn-sm gap-1 hover:text-primary" onclick="viewPhoneDetail('${phone.alternatif}')">
            <i class="fas fa-eye"></i> Detail
          </button>
          <button class="btn btn-primary btn-sm gap-1" onclick="addToComparison('${phone.alternatif}')">
            <i class="fas fa-plus"></i> Bandingkan
          </button>
        </div>
      </div>
    </div>
  `;
}

// Render Phone Detail Modal
function renderPhoneDetailModal(phone) {
  const categoryConfig = {
    'Low-End': { badge: 'badge-secondary', icon: 'fa-coins' },
    'Mid-Range': { badge: 'badge-accent', icon: 'fa-star' },
    'Flagship': { badge: 'badge-warning', icon: 'fa-crown' }
  };

  const config = categoryConfig[phone.kategori] || { badge: 'badge-neutral', icon: 'fa-mobile' };

  return `
    <div class="modal modal-open">
      <div class="modal-box w-11/12 max-w-3xl">
        <div class="flex items-start justify-between mb-6">
          <div>
            <h3 class="font-bold text-2xl mb-2">${phone.nama}</h3>
            <div class="badge ${config.badge} gap-1">
              <i class="fas ${config.icon}"></i> ${phone.kategori}
            </div>
          </div>
          <form method="dialog">
            <button class="btn btn-ghost btn-circle">
              <i class="fas fa-times text-xl"></i>
            </button>
          </form>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div class="bg-gradient-to-br from-primary/10 to-secondary/10 p-5 rounded-2xl border border-primary/20">
            <h4 class="font-semibold mb-4 flex items-center gap-2">
              <i class="fas fa-microchip text-primary"></i> Spesifikasi Utama
            </h4>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between items-center py-2 border-b border-base-content/10">
                <span class="opacity-70 flex items-center gap-2"><i class="fas fa-tag"></i> Harga</span>
                <span class="font-bold text-primary text-lg">${formatCurrency(phone.harga)}</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-base-content/10">
                <span class="opacity-70 flex items-center gap-2"><i class="fas fa-microchip"></i> Processor</span>
                <span class="font-semibold">${phone.processor}</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-base-content/10">
                <span class="opacity-70 flex items-center gap-2"><i class="fas fa-gauge-high"></i> CPU Clock</span>
                <span class="font-semibold">${phone.cpuGhz} GHz</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-base-content/10">
                <span class="opacity-70 flex items-center gap-2"><i class="fas fa-atom"></i> Process Node</span>
                <span class="font-semibold">${phone.nanometer} nm</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-base-content/10">
                <span class="opacity-70 flex items-center gap-2"><i class="fas fa-memory"></i> RAM</span>
                <span class="font-semibold">${phone.ram} GB</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-base-content/10">
                <span class="opacity-70 flex items-center gap-2"><i class="fas fa-database"></i> Memori Internal</span>
                <span class="font-semibold">${phone.memori} GB</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-base-content/10">
                <span class="opacity-70 flex items-center gap-2"><i class="fas fa-camera"></i> Kamera</span>
                <span class="font-semibold">${phone.kamera} MP</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-base-content/10">
                <span class="opacity-70 flex items-center gap-2"><i class="fas fa-battery-full"></i> Baterai</span>
                <span class="font-semibold">${formatNumber(phone.baterai)} mAh</span>
              </div>
              <div class="flex justify-between items-center py-2">
                <span class="opacity-70 flex items-center gap-2"><i class="fas fa-bolt"></i> Charging</span>
                <span class="font-semibold">${phone.charging} W</span>
              </div>
            </div>
          </div>

          <div class="bg-gradient-to-br from-accent/10 to-primary/10 p-5 rounded-2xl border border-accent/20">
            <h4 class="font-semibold mb-4 flex items-center gap-2">
              <i class="fas fa-info-circle text-accent"></i> Informasi Alternatif
            </h4>
            <div class="space-y-3 text-sm">
              <div class="flex justify-between items-center py-2 border-b border-base-content/10">
                <span class="opacity-70">Kode</span>
                <span class="font-mono font-bold text-lg">${phone.alternatif}</span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-base-content/10">
                <span class="opacity-70">Kategori</span>
                <span class="badge ${config.badge} badge-sm gap-1">
                  <i class="fas ${config.icon}"></i> ${phone.kategori}
                </span>
              </div>
              <div class="flex justify-between items-center py-2 border-b border-base-content/10">
                <span class="opacity-70">Range Harga</span>
                <span class="font-semibold">${phone.rangeHarga}</span>
              </div>
              <div class="flex justify-between items-center py-2">
                <span class="opacity-70">ID Dataset</span>
                <span class="font-mono opacity-70">${phone.id}</span>
              </div>
            </div>
            <div class="mt-6 p-4 bg-base-200/50 rounded-xl">
              <p class="text-xs opacity-70 italic flex items-center gap-2">
                <i class="fas fa-database"></i> Data berdasarkan GSMArena & sumber resmi
              </p>
            </div>
          </div>
        </div>

        <div class="modal-action">
          <button class="btn btn-primary gap-2" onclick="addToComparison('${phone.alternatif}')">
            <i class="fas fa-plus"></i> Tambah ke Perbandingan
          </button>
          <form method="dialog">
            <button class="btn btn-ghost">Tutup</button>
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

  let row = `<tr><td class="font-semibold bg-base-200 sticky left-0 z-10">
    <i class="fas ${iconMap[criteriaKey]} mr-2 text-primary"></i>${criteriaInfo.name} (${criteriaInfo.unit})
  </td>`;

  const values = phones.map(p => p[criteriaKey]);
  const isBenefit = criteriaInfo.type === 'benefit';
  const bestValue = isBenefit ? Math.max(...values) : Math.min(...values);

  phones.forEach(phone => {
    const value = phone[criteriaKey];
    let displayValue = '';

    if (criteriaKey === 'harga') {
      displayValue = formatCurrency(value);
    } else if (criteriaKey === 'baterai') {
      displayValue = formatNumber(value);
    } else if (criteriaKey === 'cpuGhz') {
      displayValue = value + ' GHz';
    } else if (criteriaKey === 'nanometer') {
      displayValue = value + ' nm';
    } else if (criteriaKey === 'charging') {
      displayValue = value + ' W';
    } else {
      displayValue = value;
    }

    const isBest = value === bestValue;
    const cellClass = isBest ? 'bg-success/20 font-bold text-success' : '';

    row += `<td class="text-center ${cellClass}">${isBest ? '<i class="fas fa-trophy mr-1"></i>' : ''}${displayValue}</td>`;
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
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-gradient-to-br from-success/10 to-success/5 p-5 rounded-2xl border border-success/30">
          <h4 class="font-bold mb-4 text-success flex items-center gap-2">
            <i class="fas fa-arrow-up"></i> Solusi Ideal Positif (A+)
          </h4>
          <div class="space-y-2 text-sm">
            ${Object.keys(criteria).map((key, i) => `
              <div class="flex justify-between p-2 bg-base-100/50 rounded-lg">
                <span>${criteria[key].name}:</span>
                <span class="font-mono font-bold">${normalizeDecimal(stepData.idealPositive[i], 4)}</span>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="bg-gradient-to-br from-error/10 to-error/5 p-5 rounded-2xl border border-error/30">
          <h4 class="font-bold mb-4 text-error flex items-center gap-2">
            <i class="fas fa-arrow-down"></i> Solusi Ideal Negatif (A-)
          </h4>
          <div class="space-y-2 text-sm">
            ${Object.keys(criteria).map((key, i) => `
              <div class="flex justify-between p-2 bg-base-100/50 rounded-lg">
                <span>${criteria[key].name}:</span>
                <span class="font-mono font-bold">${normalizeDecimal(stepData.idealNegative[i], 4)}</span>
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
                <td class="font-bold">${item.rank <= 3 ? ['🥇', '🥈', '🥉'][item.rank - 1] : ''} #${item.rank}</td>
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
    <div class="card bg-base-100/80 backdrop-blur-lg shadow-lg border border-base-content/5 mb-4">
      <div class="card-body">
        <h3 class="card-title text-lg">
          <span class="badge badge-primary badge-lg">${stepData.step}</span>
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

  let html = '<div class="grid grid-cols-1 md:grid-cols-2 gap-4">';
  let totalWeight = 0;

  Object.keys(criteria).forEach(key => {
    const criteriaInfo = criteria[key];
    const weight = weights[key];
    totalWeight += weight;

    html += `
      <div class="form-control p-4 bg-base-200/30 rounded-xl">
        <label class="label">
          <span class="label-text font-medium flex items-center gap-2">
            <i class="fas ${iconMap[key]} text-primary"></i>
            ${criteriaInfo.name}
            <span class="badge badge-sm ${criteriaInfo.type === 'benefit' ? 'badge-success' : 'badge-error'}">${criteriaInfo.type}</span>
          </span>
          <span class="label-text-alt">
            <span id="weight-display-${key}" class="font-bold text-primary text-lg">${(weight * 100).toFixed(0)}%</span>
          </span>
        </label>
        <input type="range" id="weight-${key}" min="0" max="100" value="${(weight * 100).toFixed(0)}"
               class="range range-primary range-sm"
               onchange="updateWeightDisplay('${key}'); updateTotalWeight();" 
               oninput="updateWeightDisplay('${key}'); updateTotalWeight();" />
        <div class="flex justify-between text-xs px-1 mt-1 opacity-50">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>
    `;
  });

  html += '</div>';

  html += `
    <div class="alert ${totalWeight === 100 ? 'alert-success' : 'alert-warning'} mt-6 shadow-lg">
      <i class="fas ${totalWeight === 100 ? 'fa-check-circle' : 'fa-exclamation-triangle'} text-2xl"></i>
      <span>Total Bobot: <strong id="total-weight" class="text-xl">${totalWeight.toFixed(0)}%</strong></span>
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

  // Update icon
  const icon = alert.querySelector('i');
  icon.classList.remove('fa-check-circle', 'fa-exclamation-triangle');
  icon.classList.add(total === 100 ? 'fa-check-circle' : 'fa-exclamation-triangle');
}

// Render Ranking Results
function renderRankingResults(results) {
  return `
    <div class="overflow-x-auto">
      <table class="table table-zebra bg-base-100">
        <thead>
          <tr class="bg-gradient-to-r from-primary/20 to-secondary/20">
            <th>Rank</th>
            <th>Alt</th>
            <th>Smartphone</th>
            <th>Processor</th>
            <th>Harga</th>
            <th>Skor TOPSIS</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${results.ranking.map((item, index) => {
    const phone = smartphoneData.find(p => p.alternatif === item.alternatif);
    const medalIcon = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
    const rowClass = index === 0 ? 'bg-gradient-to-r from-warning/10 to-transparent' :
      index === 1 ? 'bg-gradient-to-r from-base-content/5 to-transparent' :
        index === 2 ? 'bg-gradient-to-r from-orange-900/10 to-transparent' : '';

    return `
              <tr class="${rowClass}">
                <td>
                  <span class="font-bold text-xl">${medalIcon}</span>
                  <span class="font-bold ml-1">#${item.rank}</span>
                </td>
                <td class="font-mono font-bold text-primary">${item.alternatif}</td>
                <td class="max-w-xs">
                  <div class="font-semibold">${item.nama}</div>
                </td>
                <td class="text-xs opacity-70">${phone.processor}</td>
                <td class="font-semibold">${formatCurrency(phone.harga)}</td>
                <td>
                  <div class="flex items-center gap-3">
                    <progress class="progress progress-primary w-24 h-3" value="${item.score * 100}" max="100"></progress>
                    <span class="font-bold text-primary">${(item.score * 100).toFixed(2)}%</span>
                  </div>
                </td>
                <td>
                  <button class="btn btn-sm btn-ghost gap-1" onclick="viewPhoneDetail('${item.alternatif}')">
                    <i class="fas fa-eye"></i> Detail
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
