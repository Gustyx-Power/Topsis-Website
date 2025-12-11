// TOPSIS ALGORITHM IMPLEMENTATION


class TOPSISCalculator {
  constructor(phones, weights, selectedPhones = null) {
    this.phones = selectedPhones || phones;
    this.weights = weights;
    this.criteriaNames = ['harga', 'ram', 'memori', 'kamera', 'baterai', 'cpuGhz', 'nanometer', 'charging'];
    this.steps = [];
    this.initializeMatrix();
  }

  // Initialize decision matrix
  initializeMatrix() {
    this.matrix = this.phones.map(phone => [
      phone.harga,
      phone.ram,
      phone.memori,
      phone.kamera,
      phone.baterai,
      phone.cpuGhz,
      phone.nanometer,
      phone.charging
    ]);
  }

  // Step 1: Normalize the matrix using vector normalization
  normalizeMatrix() {
    const numCriteria = this.criteriaNames.length;
    const numAlternatives = this.phones.length;
    const normalizedMatrix = [];

    // Pre-calculate divisors for each criterion (column)
    const divisors = [];
    for (let j = 0; j < numCriteria; j++) {
      let sumSquares = 0;
      for (let i = 0; i < numAlternatives; i++) {
        const value = this.matrix[i][j];
        if (!isNaN(value) && isFinite(value)) {
          sumSquares += Math.pow(value, 2);
        }
      }
      divisors[j] = Math.sqrt(sumSquares);
    }

    // Normalize each value
    for (let i = 0; i < numAlternatives; i++) {
      normalizedMatrix[i] = [];
      for (let j = 0; j < numCriteria; j++) {
        const value = this.matrix[i][j];
        const divisor = divisors[j];

        if (divisor !== 0 && !isNaN(value) && isFinite(value)) {
          normalizedMatrix[i][j] = value / divisor;
        } else {
          normalizedMatrix[i][j] = 0;
        }
      }
    }

    this.normalizedMatrix = normalizedMatrix;
    this.steps.push({
      step: 1,
      name: 'Normalisasi Matriks',
      description: 'Membagi setiap nilai dengan akar kuadrat jumlah kuadrat setiap kolom (Vector Normalization)',
      data: normalizedMatrix.map((row, i) => ({
        alternatif: this.phones[i].alternatif,
        nama: this.phones[i].nama,
        values: row.map((v, j) => ({
          criteria: this.criteriaNames[j],
          normalized: normalizeDecimal(v, 6)
        }))
      }))
    });

    return normalizedMatrix;
  }

  // Step 2: Calculate weighted normalized matrix
  weightNormalizedMatrix() {
    const weightedMatrix = [];

    for (let i = 0; i < this.phones.length; i++) {
      weightedMatrix[i] = [];

      for (let j = 0; j < this.criteriaNames.length; j++) {
        const criteriaKey = this.criteriaNames[j];
        const weight = this.weights[criteriaKey] || 0;
        const normalizedValue = this.normalizedMatrix[i][j] || 0;

        let weightedValue = normalizedValue * weight;
        if (isNaN(weightedValue) || !isFinite(weightedValue)) {
          weightedValue = 0;
        }
        weightedMatrix[i][j] = weightedValue;
      }
    }

    this.weightedMatrix = weightedMatrix;
    this.steps.push({
      step: 2,
      name: 'Matriks Ternormalisasi Terbobot',
      description: 'Mengalikan matriks ternormalisasi dengan bobot setiap kriteria (V = R × W)',
      data: weightedMatrix.map((row, i) => ({
        alternatif: this.phones[i].alternatif,
        nama: this.phones[i].nama,
        values: row.map((v, j) => ({
          criteria: this.criteriaNames[j],
          weight: this.weights[this.criteriaNames[j]],
          weighted: normalizeDecimal(v, 6)
        }))
      }))
    });

    return weightedMatrix;
  }

  // Step 3: Calculate ideal solutions (A+ and A-)
  getIdealSolutions() {
    const numCriteria = this.criteriaNames.length;
    const idealPositive = [];
    const idealNegative = [];
    const criteriaDetails = [];

    for (let j = 0; j < numCriteria; j++) {
      // Filter out NaN and invalid values
      const columnValues = this.weightedMatrix
        .map(row => row[j])
        .filter(v => !isNaN(v) && isFinite(v));

      const criteriaKey = this.criteriaNames[j];
      const type = criteria[criteriaKey].type;

      if (columnValues.length === 0) {
        idealPositive[j] = 0;
        idealNegative[j] = 0;
      } else if (type === 'benefit') {
        // Untuk benefit: max adalah ideal positif (A+), min adalah ideal negatif (A-)
        idealPositive[j] = Math.max(...columnValues);
        idealNegative[j] = Math.min(...columnValues);
      } else {
        // Untuk cost: min adalah ideal positif (A+), max adalah ideal negatif (A-)
        idealPositive[j] = Math.min(...columnValues);
        idealNegative[j] = Math.max(...columnValues);
      }

      criteriaDetails.push({
        criteria: criteriaKey,
        name: criteria[criteriaKey].name,
        type: type,
        aPlus: normalizeDecimal(idealPositive[j], 6),
        aMinus: normalizeDecimal(idealNegative[j], 6)
      });
    }

    this.idealPositive = idealPositive;
    this.idealNegative = idealNegative;

    this.steps.push({
      step: 3,
      name: 'Solusi Ideal Positif dan Negatif',
      description: 'A+ (Best) dan A- (Worst) untuk setiap kriteria. Benefit: max=A+, min=A-. Cost: min=A+, max=A-.',
      idealPositive: idealPositive.map((v, i) => ({ criteria: this.criteriaNames[i], value: normalizeDecimal(v, 6) })),
      idealNegative: idealNegative.map((v, i) => ({ criteria: this.criteriaNames[i], value: normalizeDecimal(v, 6) })),
      details: criteriaDetails
    });

    return { idealPositive, idealNegative };
  }

  // Step 4: Calculate distance to ideal solutions (Euclidean distance)
  calculateDistances() {
    const distances = [];

    for (let i = 0; i < this.phones.length; i++) {
      let distancePositive = 0;
      let distanceNegative = 0;
      const distanceDetails = [];

      for (let j = 0; j < this.criteriaNames.length; j++) {
        const value = this.weightedMatrix[i][j] || 0;
        const idealPos = this.idealPositive[j] || 0;
        const idealNeg = this.idealNegative[j] || 0;

        const diffPlus = Math.pow(value - idealPos, 2);
        const diffMinus = Math.pow(value - idealNeg, 2);

        distancePositive += diffPlus;
        distanceNegative += diffMinus;

        distanceDetails.push({
          criteria: this.criteriaNames[j],
          value: normalizeDecimal(value, 6),
          idealPos: normalizeDecimal(idealPos, 6),
          idealNeg: normalizeDecimal(idealNeg, 6),
          diffPlus: normalizeDecimal(diffPlus, 6),
          diffMinus: normalizeDecimal(diffMinus, 6)
        });
      }

      const dPlus = Math.sqrt(distancePositive);
      const dMinus = Math.sqrt(distanceNegative);

      distances[i] = {
        alternatif: this.phones[i].alternatif,
        nama: this.phones[i].nama,
        dPlus: isNaN(dPlus) ? 0 : dPlus,
        dMinus: isNaN(dMinus) ? 0 : dMinus,
        details: distanceDetails
      };
    }

    this.distances = distances;
    this.steps.push({
      step: 4,
      name: 'Jarak ke Solusi Ideal',
      description: 'Menghitung jarak Euclidean ke solusi ideal: D+ = √Σ(Vij - Aj+)² dan D- = √Σ(Vij - Aj-)²',
      data: distances.map(d => ({
        alternatif: d.alternatif,
        nama: d.nama,
        dPlus: normalizeDecimal(d.dPlus, 6),
        dMinus: normalizeDecimal(d.dMinus, 6)
      }))
    });

    return distances;
  }

  // Step 5: Calculate TOPSIS scores (relative closeness to ideal solution)
  calculateScores() {
    const scores = [];

    for (let i = 0; i < this.distances.length; i++) {
      const { dPlus, dMinus, alternatif, nama } = this.distances[i];
      const denominator = dPlus + dMinus;

      // Handle edge cases: division by zero or NaN
      let score;
      if (denominator === 0 || isNaN(denominator)) {
        // If both distances are 0, it means this alternative is exactly at ideal point
        score = dMinus > 0 ? 1 : (dPlus > 0 ? 0 : 0.5);
      } else {
        score = dMinus / denominator;
      }

      // Ensure score is valid and between 0 and 1
      if (isNaN(score) || !isFinite(score)) {
        score = 0;
      }
      score = Math.max(0, Math.min(1, score));

      scores.push({
        alternatif: alternatif,
        nama: nama,
        dPlus: normalizeDecimal(dPlus, 6),
        dMinus: normalizeDecimal(dMinus, 6),
        score: normalizeDecimal(score, 6),
        rank: 0 // Will be assigned after sorting
      });
    }

    // Sort by score (descending) - higher score = better alternative
    scores.sort((a, b) => {
      // Primary sort by score descending
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      // Secondary sort by dMinus descending (prefer larger distance from negative ideal)
      if (b.dMinus !== a.dMinus) {
        return b.dMinus - a.dMinus;
      }
      // Tertiary sort by dPlus ascending (prefer smaller distance from positive ideal)
      return a.dPlus - b.dPlus;
    });

    // Assign ranks (handle ties)
    let currentRank = 1;
    scores.forEach((item, index) => {
      if (index > 0 && item.score === scores[index - 1].score) {
        // Same score = same rank
        item.rank = scores[index - 1].rank;
      } else {
        item.rank = currentRank;
      }
      currentRank = index + 2; // Next potential rank
    });

    this.scores = scores;
    this.steps.push({
      step: 5,
      name: 'Skor TOPSIS & Ranking',
      description: 'Menghitung preferensi relatif C(i) = D- / (D+ + D-) dan merangking alternatif. Skor mendekati 1 = lebih baik.',
      data: scores.map(s => ({
        ...s,
        scorePercent: (s.score * 100).toFixed(2) + '%'
      }))
    });

    return scores;
  }

  // Get phone info by alternatif
  getPhoneInfo(alternatif) {
    return this.phones.find(p => p.alternatif === alternatif);
  }

  // Run full TOPSIS calculation
  calculate() {
    this.normalizeMatrix();
    this.weightNormalizedMatrix();
    this.getIdealSolutions();
    this.calculateDistances();
    this.calculateScores();

    return {
      scores: this.scores,
      steps: this.steps,
      idealSolutions: {
        positive: this.idealPositive,
        negative: this.idealNegative
      }
    };
  }

  // Get results summary
  getResults() {
    return {
      ranking: this.scores,
      details: this.scores.map(item => {
        const phone = this.getPhoneInfo(item.alternatif);
        return {
          ...item,
          ...phone
        };
      })
    };
  }

  // Get calculation steps for display
  getSteps() {
    return this.steps;
  }

  // Get matrix info
  getMatrixInfo() {
    return {
      phones: this.phones.length,
      criteria: this.criteriaNames.length,
      criteriaNames: this.criteriaNames,
      criteriaDetails: Object.keys(criteria).map(key => ({
        key: key,
        name: criteria[key].name,
        type: criteria[key].type,
        unit: criteria[key].unit
      }))
    };
  }

  // Validate weights
  validateWeights() {
    const sum = Object.values(this.weights).reduce((a, b) => a + b, 0);
    return {
      isValid: Math.abs(sum - 1) < 0.001,
      sum: sum,
      error: Math.abs(sum - 1) < 0.001 ? null : `Total bobot harus 100%, sekarang: ${(sum * 100).toFixed(1)}%`
    };
  }

  // Generate detailed report
  generateReport() {
    const validation = this.validateWeights();
    const matrixInfo = this.getMatrixInfo();

    return {
      title: 'Laporan Analisis TOPSIS - Smartphone Recommendation System',
      timestamp: new Date().toLocaleString('id-ID'),
      matrixInfo: matrixInfo,
      weights: this.weights,
      validation: validation,
      ranking: this.scores,
      steps: this.steps,
      summary: {
        topRecommendation: this.scores[0],
        topThree: this.scores.slice(0, 3),
        totalPhones: this.phones.length,
        totalCriteria: this.criteriaNames.length
      }
    };
  }
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { TOPSISCalculator };
}
