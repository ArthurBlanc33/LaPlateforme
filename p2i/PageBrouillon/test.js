// Importation de Math.js (nécessaire si utilisé en Node.js, pas besoin dans un navigateur si math.js est inclus)
const math = require('mathjs');

function genererVariable(loi, params, taille = 1000) {
    let valeurs = [];

    if (loi === "binomiale") {
        for (let i = 0; i < taille; i++) {
            valeurs.push(math.randomInt(params.n + 1) < params.p * params.n ? 1 : 0);
        }
    }
    
    else if (loi === "normale") {
        for (let i = 0; i < taille; i++) {
            valeurs.push(math.randomNormal(params.moyenne || 0, params.ecart_type || 1));
        }
    }
    
    else if (loi === "exponentielle") {
        for (let i = 0; i < taille; i++) {
            valeurs.push(-params.scale * Math.log(1 - Math.random()));
        }
    }
    
    else if (loi === "poisson") {
        for (let i = 0; i < taille; i++) {
            valeurs.push(math.randomPoisson(params.lambda || 1));
        }
    }
    
    else if (loi === "uniforme") {
        for (let i = 0; i < taille; i++) {
            valeurs.push(math.random(params.min || 0, params.max || 1));
        }
    }
    
    else {
        throw new Error("Loi non reconnue. Choisissez parmi : binomiale, normale, exponentielle, poisson, uniforme.");
    }

    return valeurs;
}

// 🔥 Exemple d'utilisation :
console.log(genererVariable("normale", { moyenne: 10, ecart_type: 3 }, 10));  // 10 valeurs selon une loi normale
console.log(genererVariable("exponentielle", { scale: 2 }, 10)); // 10 valeurs exponentielles
console.log(genererVariable("poisson", { lambda: 1.5 }, 10)); // 10 valeurs Poisson
