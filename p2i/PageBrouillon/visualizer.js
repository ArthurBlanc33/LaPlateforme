const { ChartJSNodeCanvas } = require('chartjs-node-canvas');
const fs = require('fs');

// Dimensions du graphique
const width = 800; // largeur en pixels
const height = 600; // hauteur en pixels
const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height });

// Fonction de densité de probabilité d'une loi normale
function normalPDF(x, mean, stdDev) {
  return (1 / (stdDev * Math.sqrt(2 * Math.PI))) * Math.exp(-((x - mean) ** 2) / (2 * stdDev * stdDev));
}

const mean = 0;
const stdDev = 1;
const numPoints = 100;

// Génération des valeurs pour l'axe des x (par exemple de -4σ à +4σ)
const xValues = [];
const yValues = [];
const minX = mean - 4 * stdDev;
const maxX = mean + 4 * stdDev;
const step = (maxX - minX) / (numPoints - 1);

for (let i = 0; i < numPoints; i++) {
  let x = minX + i * step;
  xValues.push(x.toFixed(2)); // On formate pour un affichage plus lisible
  yValues.push(normalPDF(x, mean, stdDev));
}

// Configuration du graphique Chart.js
const configuration = {
  type: 'line',
  data: {
    labels: xValues,
    datasets: [{
      label: 'Loi Normale (μ=0, σ=1)',
      data: yValues,
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 2,
      fill: false,
    }]
  },
  options: {
    scales: {
      x: {
        title: {
          display: true,
          text: 'x'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Densité'
        }
      }
    }
  }
};

// Générer et sauvegarder le graphique sous forme d'image PNG
chartJSNodeCanvas.renderToBuffer(configuration)
  .then(buffer => {
    fs.writeFileSync('loi_normale.png', buffer);
    console.log("Graphique enregistré sous 'loi_normale.png'");
  })
  .catch(err => {
    console.error("Erreur lors de la génération du graphique :", err);
  });
