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

  // Step 1: Normalize the matrix
  normalizeMatrix() {
    const numCriteria = this.criteriaNames.length;
    const normalizedMatrix = [];

    for (let i = 0; i < this.phones.length; i++) {
      normalizedMatrix[i] = [];

      for (let j = 0; j < numCriteria; j++) {
        // Calculate sum of squares for each criterion
        let sumSquares = 0;
        for (let k = 0; k < this.phones.length; k++) {
          sumSquares += Math.pow(this.matrix[k][j], 2);
        }

        const divisor = Math.sqrt(sumSquares);
        normalizedMatrix[i][j] = divisor !== 0 ? this.matrix[i][j] / divisor : 0;
      }
    }

    this.normalizedMatrix = normalizedMatrix;
    this.steps.push({
      step: 1,
      name: 'Normalisasi Matriks',
      description: 'Membagi setiap nilai dengan akar kuadrat jumlah kuadrat setiap kolom',
      data: normalizedMatrix
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
        const weight = this.weights[criteriaKey];
        weightedMatrix[i][j] = this.normalizedMatrix[i][j] * weight;
      }
    }

    this.weightedMatrix = weightedMatrix;
    this.steps.push({
      step: 2,
      name: 'Matriks Ternormalisasi Terbobot',
      description: 'Mengalikan matriks ternormalisasi dengan bobot setiap kriteria',
      data: weightedMatrix
    });

    return weightedMatrix;
  }

  // Step 3: Calculate ideal solutions (A+ and A-)
  getIdealSolutions() {
    const numCriteria = this.criteriaNames.length;
    const idealPositive = [];
    const idealNegative = [];

    for (let j = 0; j < numCriteria; j++) {
      const columnValues = this.weightedMatrix.map(row => row[j]);
      const criteriaKey = this.criteriaNames[j];
      const type = criteria[criteriaKey].type;

      if (type === 'benefit') {
        // Untuk benefit: max adalah ideal positif
        idealPositive[j] = Math.max(...columnValues);
        idealNegative[j] = Math.min(...columnValues);
      } else {
        // Untuk cost: min adalah ideal positif
        idealPositive[j] = Math.min(...columnValues);
        idealNegative[j] = Math.max(...columnValues);
      }
    }

    this.idealPositive = idealPositive;
    this.idealNegative = idealNegative;

    this.steps.push({
      step: 3,
      name: 'Solusi Ideal Positif dan Negatif',
      description: 'A+ (Best) dan A- (Worst) untuk setiap kriteria berdasarkan tipe benefit/cost',
      idealPositive: idealPositive,
      idealNegative: idealNegative
    });

    return { idealPositive, idealNegative };
  }

  // Step 4: Calculate distance to ideal solutions
  calculateDistances() {
    const distances = [];

    for (let i = 0; i < this.phones.length; i++) {
      let distancePositive = 0;
      let distanceNegative = 0;

      for (let j = 0; j < this.criteriaNames.length; j++) {
        distancePositive += Math.pow(this.weightedMatrix[i][j] - this.idealPositive[j], 2);
        distanceNegative += Math.pow(this.weightedMatrix[i][j] - this.idealNegative[j], 2);
      }

      distances[i] = {
        alternatif: this.phones[i].alternatif,
        nama: this.phones[i].nama,
        dPlus: Math.sqrt(distancePositive),
        dMinus: Math.sqrt(distanceNegative)
      };
    }

    this.distances = distances;
    this.steps.push({
      step: 4,
      name: 'Jarak ke Solusi Ideal',
      description: 'Menghitung jarak Euclidean ke solusi ideal positif (D+) dan negatif (D-)',
      data: distances
    });

    return distances;
  }

  // Step 5: Calculate TOPSIS scores
  calculateScores() {
    const scores = [];

    for (let i = 0; i < this.distances.length; i++) {
      const { dPlus, dMinus } = this.distances[i];
      const score = dMinus / (dPlus + dMinus);

      scores.push({
        alternatif: this.distances[i].alternatif,
        nama: this.distances[i].nama,
        dPlus: normalizeDecimal(dPlus, 4),
        dMinus: normalizeDecimal(dMinus, 4),
        score: normalizeDecimal(score, 4),
        rank: 0 // Will be assigned after sorting
      });
    }

    // Sort by score (descending)
    scores.sort((a, b) => b.score - a.score);

    // Assign ranks
    scores.forEach((item, index) => {
      item.rank = index + 1;
    });

    this.scores = scores;
    this.steps.push({
      step: 5,
      name: 'Skor TOPSIS & Ranking',
      description: 'Menghitung preferensi relatif C(i) = D- / (D+ + D-) dan merangking alternatif',
      data: scores
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
