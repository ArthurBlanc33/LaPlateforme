const fs = require("fs");
const Papa = require("papaparse");

// Fonction pour lire le fichier CSV
function lireCSV(fichier) {
    const contenu = fs.readFileSync(fichier, "utf8");
    return Papa.parse(contenu, { header: true, dynamicTyping: true }).data;
}

// Fonction pour calculer des statistiques
function calculerStats(data, colonne) {
    const valeurs = data.map(row => row[colonne]).filter(val => !isNaN(val));

    if (valeurs.length === 0) return null;

    const somme = valeurs.reduce((acc, val) => acc + val, 0);
    const moyenne = somme / valeurs.length;
    
    const trié = [...valeurs].sort((a, b) => a - b);
    const médiane = trié.length % 2 === 0 ? 
        (trié[trié.length / 2 - 1] + trié[trié.length / 2]) / 2 :
        trié[Math.floor(trié.length / 2)];

    const variance = valeurs.reduce((acc, val) => acc + Math.pow(val - moyenne, 2), 0) / valeurs.length;
    const ecartType = Math.sqrt(variance);

    return { moyenne, médiane, ecartType };
}

// Fonction d'analyse des données CSV
function analyserCSV(fichier) {
    const data = lireCSV(fichier);
    console.log(`✅ Analyse du fichier : ${fichier}`);

    // Statistiques sur "Faim" et "Vie"
    ["Faim", "Vie"].forEach(colonne => {
        const stats = calculerStats(data, colonne);
        if (stats) {
            console.log(`📊 Statistiques sur ${colonne} :`);
            console.log(`   Moyenne : ${stats.moyenne.toFixed(2)}`);
            console.log(`   Médiane : ${stats.médiane.toFixed(2)}`);
            console.log(`   Écart-type : ${stats.ecartType.toFixed(2)}\n`);
        }
    });

    // Analyse du nombre de "gentil" et "mechant"
    const totalPersos = data.length;
    const nbGentils = data.filter(row => row["État"] === "gentil").length;
    const nbMéchants = data.filter(row => row["État"] === "mechant").length;

    console.log(`👥 Répartition des personnages :`);
    console.log(`   Gentils  : ${nbGentils} (${((nbGentils / totalPersos) * 100).toFixed(2)}%)`);
    console.log(`   Méchants : ${nbMéchants} (${((nbMéchants / totalPersos) * 100).toFixed(2)}%)`);
}

// Exécuter l'analyse sur un fichier CSV
const fichierCSV = "simulations/essai_einstein_simulation1.csv"; // Remplace par le chemin du fichier
analyserCSV(fichierCSV);
