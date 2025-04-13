console.log("Démarrage de la simulation");



// const readline = require('readline').createInterface({
//     input: process.stdin,
//     output: process.stdout
// });

class Personnage {
    static currentId = 0; // Static variable to keep track of the current ID
    constructor(etat) {
        this.id = Personnage.currentId++; // identifiant unique
        this.etat = etat;
        this.faim = 0; // S'assure que la faim initiale n'est pas négative
        this.life = 10;
        this.influenceScore = 0;
        this.influencable = generationInfluencable();
    }

    manger(valeurrepas) {
        this.faim = Math.max(0, this.faim - valeurrepas);
        return this.faim;
    }

    battre(personnage) {

        let nb = getRandomInt(1);
        if (nb == 0) {
            personnage.life -= 1;
        }
    }



    determinerEtat(autrePersonnage) {
        // Si l'autre personnage existe
        if (autrePersonnage) {
            // Confrontation d'influence entre personnages de types opposés
            if (this.etat !== autrePersonnage.etat) {
                // Calculer la force d'influence de chaque personnage
                // Facteurs qui peuvent affecter la force: vie, faim, influençabilité
                const forceThisPersonnage = this.calculerForceInfluence();
                const forceAutrePersonnage = autrePersonnage.calculerForceInfluence();

                // Déterminer qui gagne l'influence
                if (forceThisPersonnage > forceAutrePersonnage) {
                    // Ce personnage influence l'autre
                    autrePersonnage.influenceScore += 0.3 * autrePersonnage.influencable;
                    console.log(`Le personnage ${this.etat} influence le personnage ${autrePersonnage.etat}`);
                } else if (forceAutrePersonnage > forceThisPersonnage) {
                    // L'autre personnage influence celui-ci
                    this.influenceScore += (this.etat === "gentil" ? -0.3 : 0.3) * this.influencable;
                    console.log(`Le personnage ${autrePersonnage.etat} influence le personnage ${this.etat}`);
                } else {
                    // Égalité - légère influence mutuelle mais plus faible
                    this.influenceScore += (this.etat === "gentil" ? -0.1 : 0.1) * this.influencable;
                    autrePersonnage.influenceScore += (autrePersonnage.etat === "gentil" ? -0.1 : 0.1) * autrePersonnage.influencable;
                    console.log("Les deux personnages s'influencent mutuellement de façon égale");
                }
            } else {
                // Renforcement mutuel pour les personnages de même type
                this.influenceScore += (this.etat === "gentil" ? 0.2 : -0.2) * this.influencable;
                console.log(`Les personnages ${this.etat} se renforcent mutuellement`);
            }

            // Conditions de changement d'état
            if (this.influenceScore > 0.5 && this.etat === "mechant") {
                this.changerEtat(this);
                console.log("Un personnage méchant devient gentil");
            } else if (this.influenceScore < -0.5 && this.etat === "gentil") {
                this.changerEtat(this);
                console.log("Un personnage gentil devient méchant");
            }

            // Réinitialisation si l'influence devient trop extrême
            this.influenceScore = Math.max(-1, Math.min(1, this.influenceScore));
        }
    }

    // Nouvelle méthode pour calculer la force d'influence d'un personnage
    calculerForceInfluence() {
        // Facteurs qui déterminent la force d'influence:
        // - Vie (plus de vie = plus d'influence)
        // - Faim (moins de faim = plus d'influence)
        // - État (on peut supposer que les méchants sont plus influents dans certaines situations)
        // - Un facteur aléatoire pour plus de variabilité

        const forceSanté = this.life / 10; // Force proportionnelle à la vie (max 10)
        const forceFaim = 1 - (this.faim / 15); // Moins de faim = plus de force
        const forceEtat = this.etat === "mechant" ? 1.2 : 1.0; // Les méchants peuvent être légèrement plus intimidants
        const facteurAleatoire = 0.8 + (Math.random() * 0.4); // Entre 0.8 et 1.2

        return (forceSanté + forceFaim) * forceEtat * facteurAleatoire;
    }

    changerEtat(personnage) {
        personnage.etat = (personnage.etat === "gentil") ? "mechant" : "gentil";
    }

    // Ajouter ce comportement dans la classe Personnage
    endoctriner(autrePersonnage) {
        if (this.etat === "gourou" && autrePersonnage.etat !== "gourou") {
            const resistanceChance = autrePersonnage.etat === "mechant" ? 0.7 : 0.3;

            if (Math.random() > resistanceChance * (1 - autrePersonnage.influencable / 2)) {
                console.log(`Le gourou a endoctriné un personnage ${autrePersonnage.etat}`);
                autrePersonnage.etat = "disciple";
                autrePersonnage.influencable = Math.min(autrePersonnage.influencable + 0.5, 2);
                return true;
            }
        }

        if (this.etat === "disciple" && autrePersonnage.etat !== "gourou") {
            const resistanceChance = autrePersonnage.etat === "mechant" ? 0.5 : 0.2;

            if (Math.random() > resistanceChance * (1 - autrePersonnage.influencable / 2)) {
                console.log(`Le disciple a endoctriné un personnage ${autrePersonnage.etat}`);
                autrePersonnage.etat = "disciple";
                autrePersonnage.influencable = Math.min(autrePersonnage.influencable + 0.5, 2);
                return true;
            }
        }
        return false;
    }

    recuperationLife() {

        if (this.life < 10) {
            this.life++;
        }
    }



    voler() {

    }
    canibalisme() {

    }
    suicide() {

    }

    malade() {

    }

}

// Classe pour représenter la tour
class Tour {
    constructor(NbNiveau) {
        this.NbNiveau = NbNiveau;
        this.Niveaux = Array.from({ length: NbNiveau }, () => []);
    }

    afficherTour() {
        let i = 1;
        this.Niveaux.forEach(element => {
            console.log("-------------");
            console.log("Étage " + i);

            if (element.length !== 0) {
                console.log("Personnages :");
                element.forEach(personnage => {
                    console.log(` - État : ${personnage.etat}, Faim : ${personnage.faim}, - Life : ${personnage.life}, influencable ??? ${personnage.influencable} `);
                });
            } else {
                console.log("Aucun personnage à cet étage.");
            }

            console.log("-------------");
            console.log("");
            i++;
        });
    }
}




// Fonctions utilitaires
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function randomNormal(mean = 0.5, stdDev = 0.2) {
    let u = 1 - Math.random(); // Uniforme (0,1] pour éviter log(0)
    let v = 1 - Math.random();
    let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return Math.min(1, Math.max(0, mean + z * stdDev)); // Clamp entre [0,1]
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function generationInfluencable() {
   
    let n = getRandomInt(4);


    if (n == 0) {
        return 0;
    }
    else if (n == 1) {
        return 0.5;
    }
    else if (n == 2) {
        return 1;
    }
    else {
        return 1.5;
    }



}


// Fonction pour générer les personnages en fonction de la distribution choisie
function CreationPerso(TourPrincipale, distribution, mean = 0.5, stdDev = 0.2) {
    const Persos = [];
    let nmbPerso = TourPrincipale.Niveaux.length * 2;

    for (let i = 0; i < nmbPerso; i++) {
        let perso;
        if (distribution === "uniforme") {
            perso = getRandomInt(2) === 0 ? new Personnage("gentil") : new Personnage("mechant");
        } else if (distribution === "normale") {
            perso = randomNormal(mean, stdDev) < 0.5 ? new Personnage("gentil") : new Personnage("mechant");
        }
        Persos.push(perso);
    }

    return Persos;
}


// Fonction pour créer les personnages lois Normales
function CreationPersoNormaux(TourPrincipale) {
    const Persos = [];
    let nmbPerso = TourPrincipale.Niveaux.length * 2;

    for (let i = 0; i < nmbPerso; i++) {
        let perso;
        if (randomNormal(0.5, 0) < 0.5) {
            perso = new Personnage("gentil");
        } else {
            perso = new Personnage("mechant");
        }
        Persos.push(perso);
    }

    return Persos;
}

// Fonction pour répartir les personnages dans la tour
function Repartition(TourPrincipale, Persos) {
    const shuffledPersos = shuffle(Persos);
    let i = 0;

    for (let j = 0; j < TourPrincipale.NbNiveau; j++) {
        TourPrincipale.Niveaux[j] = []; // Vider chaque niveau d'abord
        if (i + 1 < shuffledPersos.length) {
            TourPrincipale.Niveaux[j].push(shuffledPersos[i], shuffledPersos[i + 1]);
            i += 2;
        }
    }

    return TourPrincipale;
}


//Gourou
// Add this global variable at the top of your script
let gourouExists = false;

// Then modify your verifierApparitionGourou function
function verifierApparitionGourou(TourPrincipale, nmbJour) {
    if (gourouExists) {
        return false;
    }

    let tousPersonnages = [];
    TourPrincipale.Niveaux.forEach(niveau => {
        niveau.forEach(personnage => {
            if (isValidPersonnage(personnage) && personnage.life > 0) {
                tousPersonnages.push(personnage);
                if (personnage.etat === "gourou") {
                    gourouExists = true;
                }
            }
        });
    });

    if (gourouExists) {
        return false;
    }

    const nbGentils = tousPersonnages.filter(p => p.etat === "gentil").length;
    const pourcentageGentils = (nbGentils / tousPersonnages.length) * 100;

    if (pourcentageGentils > 80 && tousPersonnages.length > 0) {
        const gentisList = tousPersonnages.filter(p => p.etat === "gentil");
        if (gentisList.length > 0) {
            const indexGourou = Math.floor(Math.random() * gentisList.length);
            const nouveauGourou = gentisList[indexGourou];
            const ancienEtat = nouveauGourou.etat; // Sauvegarder l'état avant changement

            nouveauGourou.etat = "gourou";
            nouveauGourou.pouvoirInfluence = 2;
            gourouExists = true;

            // Ajouter l'événement aux logs globaux
            eventLogs.push({
                ID: nouveauGourou.id,
                Jour: nmbJour,
                Type: "Changement d'état",
                AncienEtat: ancienEtat,
                NouveauEtat: "gourou"
            });

            console.log(`Événement gourou ajouté : ID=${nouveauGourou.id}, Jour=${nmbJour}`);

            if (journal) {
                let Message = document.createElement('div');
                Message.textContent = `ALERTE : Un gourou est apparu au sein de la communauté !`;
                Message.style.color = "purple";
                Message.style.fontWeight = "bold";
                journal.appendChild(Message);
            }

            return true;
        }
    }
    return false;
}


function exporterCSV(data, simulationNom = "simulation_resultats") {
    // Vérifier que les données sont dans un tableau
    if (!Array.isArray(data)) {
        console.error("Les données ne sont pas dans un format valide pour l'exportation CSV");
        return;
    }

    // Créer l'en-tête du CSV avec des noms de colonnes clairs
    let csvContent = "ID,Simulation,Jour,Etage,Etat,Vie,Faim,Influencable\n";

    // Ajouter chaque ligne de données
    data.forEach(row => {
        if (!row) return; // Ignorer les lignes invalides

        // Récupérer les valeurs avec des valeurs par défaut pour les propriétés manquantes
        const id = row.ID !== undefined ? row.ID : "";
        const simulation = row.Simulation !== undefined ? row.Simulation : "";
        const jour = row.Jour !== undefined ? row.Jour : "";
        const etage = row.Étage !== undefined ? row.Étage : "";  // Note: Utilise "Étage" au lieu de "Etage"
        const etat = row.État !== undefined ? row.État : "";     // Note: Utilise "État" au lieu de "Etat"
        const vie = row.Vie !== undefined ? row.Vie : "";
        const faim = row.Faim !== undefined ? row.Faim : "";
        const influencable = row.Influencable !== undefined ? row.Influencable : "";

        csvContent += `${id},${simulation},${jour},${etage},${etat},${vie},${faim},${influencable}\n`;
    });

    // Créer un Blob et déclencher le téléchargement
    let blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });

    // Pour les environnements de navigateur
    if (typeof window !== 'undefined' && window.URL && window.URL.createObjectURL) {
        let url = URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = `${simulationNom}.csv`;
        document.body.appendChild(a);
        a.click();
        setTimeout(function () {
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        }, 0);
    } else {
        // Pour l'environnement Node.js (bien que cela ne sera pas atteint dans le navigateur)
        console.log("L'exportation CSV n'est pas prise en charge dans cet environnement");
    }
}

// Add this function to safely check if a character exists before accessing its properties
function isValidPersonnage(personnage) {
    return personnage !== undefined && personnage !== null;
}

function exporterEvenementsCSV(events, nom = "evenements") {
    // LOG 1: Confirmer l'entrée et la taille des données
    console.log(`>>> Dans exporterEvenementsCSV : Reçu ${events ? events.length : 'null/undefined'} événements.`);

    if (!Array.isArray(events) || events.length === 0) {
        console.warn(">>> exporterEvenementsCSV : Aucune donnée à exporter, sortie.");
        return;
    }

    let csv = "ID,Jour,Type,AncienEtat,NouveauEtat\n"; // En-tête

    try { // Ajout d'un bloc try...catch pour la génération du CSV
        events.forEach((ev, index) => {
            if (!ev) {
                console.warn(`>>> exporterEvenementsCSV : Événement à l'index ${index} est invalide, ignoré.`);
                return; // Ignore les événements potentiellement nuls/undefined
            }

            // Récupérer les valeurs avec des valeurs par défaut (chaîne vide)
            const id = ev.ID !== undefined ? ev.ID : "";
            const jour = ev.Jour !== undefined ? ev.Jour : "";
            // Gérer les caractères spéciaux pour le champ Type (le plus probable)
            const type = ev.Type !== undefined ? `"${String(ev.Type).replace(/"/g, '""')}"` : "";
            const ancienEtat = ev.AncienEtat !== undefined ? ev.AncienEtat : "";
            const nouveauEtat = ev.NouveauEtat !== undefined ? ev.NouveauEtat : "";

            csv += `${id},${jour},${type},${ancienEtat},${nouveauEtat}\n`;
        });

        // LOG 2: Afficher le contenu CSV final avant de créer le Blob
        console.log(`>>> exporterEvenementsCSV : Contenu CSV généré (${csv.length} caractères):\n`, csv);

        // Créer un Blob et déclencher le téléchargement
        let blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        // LOG 3: Vérifier la taille du Blob
        console.log(`>>> exporterEvenementsCSV : Blob créé, taille: ${blob.size} octets`);

        if (typeof window !== 'undefined' && window.URL && window.URL.createObjectURL) {
            let url = URL.createObjectURL(blob);
            // LOG 4: Afficher l'URL du Blob (vous pouvez essayer de cliquer dessus dans la console)
            console.log(`>>> exporterEvenementsCSV : URL du Blob : ${url}`);

            let a = document.createElement("a");
            a.href = url;
            a.download = `${nom}.csv`;
            // LOG 5: Vérifier que le lien est prêt
            console.log(`>>> exporterEvenementsCSV : Lien prêt : href=${a.href}, download=${a.download}`);

            document.body.appendChild(a);
            a.click();
            console.log(">>> exporterEvenementsCSV : Clic simulé sur le lien.");

            // Utiliser un délai plus court pour le nettoyage
            setTimeout(() => {
                try {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                    console.log(">>> exporterEvenementsCSV : Lien et URL nettoyés.");
                } catch (cleanupError) {
                     console.error(">>> exporterEvenementsCSV : Erreur lors du nettoyage du lien/URL : ", cleanupError);
                }
            }, 100); // 100ms devrait suffire

        } else {
            console.error(">>> exporterEvenementsCSV : Environnement ne supporte pas URL.createObjectURL.");
        }

    } catch (error) {
         console.error(">>> exporterEvenementsCSV : Erreur lors de la génération du contenu CSV ou du téléchargement : ", error);
    }
}


// Modify the lancerPlusieursSimulations function to correctly export data
async function lancerPlusieursSimulations(nbSimulations, nbEtages, distribution, mean = 0.5, stdDev = 0.2, nbJours = 15) {
    let allData = [];
    eventLogs = [];
    const typeSimulation = document.querySelector('input[name="typeSimulation"]:checked').value;

    const journal = document.getElementById('journal');
    if (journal) {
        journal.innerHTML = '<h3>Journal de la simulation :</h3>';
    }

    for (let i = 1; i <= nbSimulations; i++) {
        console.log(`Simulation ${i} en cours...`);

        if (journal) {
            let simMessage = document.createElement('div');
            simMessage.textContent = `Démarrage de la simulation ${i}...`;
            journal.appendChild(simMessage);
        }

        TourPrincipale = new Tour(nbEtages);
        let Persos = CreationPerso(TourPrincipale, distribution, mean, stdDev);
        TourPrincipale = Repartition(TourPrincipale, Persos);

        let simulationResult = await Simulation(TourPrincipale, Persos, i, nbJours, typeSimulation);

        if (simulationResult.dataExport) {
            allData = allData.concat(simulationResult.dataExport);
        }

        if (journal) {
            let resultatMessage = document.createElement('div');
            resultatMessage.textContent = `Simulation ${i} terminée : ${simulationResult.raisonFin} (Jour ${simulationResult.joursFinal})`;
            journal.appendChild(resultatMessage);
        }

        await delay(1000);
    }

    if (allData.length > 0) {
        exporterCSV(allData, "simulation_resultats");
    }

    if (eventLogs.length > 0) {
        exporterEvenementsCSV(eventLogs, "evenements");
    }
}


// Déclarer eventLogs comme variable globale
let eventLogs = [];

async function Simulation(TourPrincipale, Persos, numSimulation = 1, nbJours = 15, typeSimulation = "normale") {
    gourouExists = false;
    let nbtotalnourriture = Persos.length;
    let Quantitenourriture = nbtotalnourriture;
    let dataExport = [];
    let simulationEvents = [];
    let premiereMort = false;

    console.log("Quantité nourriture initiale : " + Quantitenourriture);

    const journal = document.getElementById('journal');
    if (journal) journal.innerHTML = '';

    let hpnourriture = 1;
    let nbfaimparj = 1;
    let nmbJour = 0;
    let semaine = 1;

    // Boucle de simulation modifiée pour gérer les deux types
    while ((typeSimulation === "normale" && nmbJour < nbJours) || 
           (typeSimulation === "mort" && !premiereMort)) {
        console.log(`\n=== JOUR ${nmbJour} ===`);

        if (journal) {
            let jourMessage = document.createElement('div');
            jourMessage.textContent = `Jour ${nmbJour} : Simulation en cours...`;
            journal.appendChild(jourMessage);
        }

        if (nmbJour === 7 * semaine) {
            semaine++;
            console.log("Semaine " + semaine);

            let allCharacters = [];
            TourPrincipale.Niveaux.forEach(level => {
                allCharacters = allCharacters.concat(level.filter(isValidPersonnage));
            });

            TourPrincipale.Niveaux.forEach(level => level.length = 0);
            Repartition(TourPrincipale, allCharacters);
        }

        for (let index = 0; index < TourPrincipale.NbNiveau; index++) {
            console.log("\n-------------------------------");
            console.log("Etage numéro " + index);
            console.log("-------------------------------");

           
            TourPrincipale.Niveaux[index] = TourPrincipale.Niveaux[index].filter(isValidPersonnage);

            const personnagesNiveau = [...TourPrincipale.Niveaux[index]];

            for (let personneIndex = 0; personneIndex < personnagesNiveau.length; personneIndex++) {
                const personnage = personnagesNiveau[personneIndex];

                // Skip if character is invalid
                if (!isValidPersonnage(personnage)) continue;

                // Sauvegarder l'état actuel pour détecter les changements
                const ancienEtat = personnage.etat;

                // Dans la fonction Simulation, lors de la collecte de données
                dataExport.push({
                    ID: personnage.id,
                    Simulation: numSimulation,
                    Jour: nmbJour + 1,  // Commencer à jour 1 au lieu de jour 0 pour plus de clarté
                    Étage: index + 1,   // Commencer à étage 1 au lieu de 0 pour correspondre à l'affichage
                    État: personnage.etat,
                    Vie: personnage.life,
                    Faim: personnage.faim,
                    Influencable: personnage.influencable
                });

                let autrePersonnage = null;
                for (let j = 0; j < personnagesNiveau.length; j++) {
                    if (j !== personneIndex && isValidPersonnage(personnagesNiveau[j])) {
                        autrePersonnage = personnagesNiveau[j];
                        break;
                    }
                }

                if (isValidPersonnage(autrePersonnage)) {
                    personnage.determinerEtat(autrePersonnage);

                    
                    if (personnage.etatavantdautreperso === "gentil") {
                        console.log("Le personnage avec lui est gentil");
                    } else {
                        console.log("Le personnage avec lui est méchant");
                    }
                }

                // Mange logic
                if (Quantitenourriture > 0) {
                    if (personnage.etat === "gentil") {
                        console.log("Le personnage mange");
                        personnage.manger(hpnourriture);
                        Quantitenourriture--;
                        if (personnage.determinerEtat(autrePersonnage) === "gentil") {
                            personnage.recuperationLife();
                        }
                    } else {
                        // Méchant
                        console.log("Le personnage mange");
                        personnage.manger(hpnourriture);

                        if (isValidPersonnage(autrePersonnage)) {
                            // Battre    
                            if (Math.random() > 0.5) {
                                personnage.battre(autrePersonnage);
                                personnage.faim += 2;
                            }
                        }

                        if (personnage.faim > 5) {
                            personnage.manger(hpnourriture);
                            Quantitenourriture -= 2;
                        }
                    }
                } else {
                    if (personnage.etat === "gentil") {
                        console.log("Le personnage ne mange pas");
                        personnage.faim += 1;
                    } else {
                        // Méchant
                        console.log("Le personnage ne mange pas");

                        if (isValidPersonnage(autrePersonnage)) {
                            personnage.battre(autrePersonnage);
                        }

                        personnage.faim += 1;

                        if (journal) {
                            let Message = document.createElement('div');
                            Message.textContent = `se bat`;
                            journal.appendChild(Message);
                        }
                    }
                }

                // Logique du gourou
                if (personnage.etat === "gourou") {
                    //Mange
                    if (Quantitenourriture > 0) {
                        console.log("Le gourou mange");
                        personnage.manger(hpnourriture);
                        Quantitenourriture--;
                    } else {
                        console.log("Le gourou ne mange pas");
                        personnage.faim += 1;
                    }

                    // Le gourou tente d'endoctriner l'autre personnage à son niveau
                    if (isValidPersonnage(autrePersonnage)) {
                        personnage.endoctriner(autrePersonnage);
                    }

                    // Le gourou a une chance d'influencer d'autres étages également
                }

                // Logique du disciple
                if (personnage.etat === "disciple") {
                    // Manger
                    if (Quantitenourriture > 0) {
                        console.log("Le disciple mange");
                        personnage.manger(hpnourriture);
                        Quantitenourriture--;
                    } else {
                        console.log("Le disciple ne mange pas");
                        personnage.faim += 1;
                    }
                    // Le disciple tente d'influencer l'autre personnage à son niveau
                    if (isValidPersonnage(autrePersonnage)) {
                        personnage.determinerEtat(autrePersonnage);
                        personnage.endoctriner(autrePersonnage);
                    }
                }

                console.log(`Personnage : État = ${personnage.etat}, Faim = ${personnage.faim}, Life = ${personnage.life}, influencable = ${personnage.influencable}`);

                if (personnage.faim > 10) {
                    console.log("Le personnage a faim");
                    console.log("il perd un point de vie");
                    personnage.life--;
                } else {
                    personnage.faim += nbfaimparj;
                }

                if (personnage.life <= 0) {
                    console.log("personnage mort");
                    // Remove dead characters
                    TourPrincipale.Niveaux[index] = TourPrincipale.Niveaux[index].filter(p =>
                        isValidPersonnage(p) && p.life > 0
                    );

                    if (typeSimulation === "mort") {
                        premiereMort = true;
                        if (journal) {
                            let mortMessage = document.createElement('div');
                            mortMessage.textContent = `Simulation terminée : Première mort détectée au jour ${nmbJour}`;
                            mortMessage.style.color = 'red';
                            mortMessage.style.fontWeight = 'bold';
                            journal.appendChild(mortMessage);
                        }
                        break;
                    }
                }

                // Vérifier les changements d'état à la fin du traitement du personnage
                if (ancienEtat !== personnage.etat) {
                    simulationEvents.push({
                        ID: personnage.id,
                        Jour: nmbJour,
                        Type: "Changement d'état",
                        AncienEtat: ancienEtat,
                        NouveauEtat: personnage.etat
                    });
                }
            }
        }

        // À la fin de chaque jour, après avoir traité tous les étages mais avant de reset la nourriture

        // Dans la boucle principale de simulation
        const gourouApparu = verifierApparitionGourou(TourPrincipale, nmbJour);
        if (gourouApparu) {
            console.log("Un gourou est apparu et va commencer à influencer les autres personnages");
        }

        console.log("la nourriture revient");
        Quantitenourriture = nbtotalnourriture;

        affichageDom();
        await delay(nbtemps); // Pause

        nmbJour++;
    }

    // Final display
    if (journal) {
        let finMessage = document.createElement('div');
        finMessage.textContent = `Simulation terminée après ${nmbJour} jours.`;
        journal.appendChild(finMessage);
    }

    // Ajouter les événements de cette simulation aux événements globaux
    eventLogs = eventLogs.concat(simulationEvents);

    // Retourner les résultats avec information sur le type de fin
    return { 
        dataExport, 
        simulationEvents,
        joursFinal: nmbJour,
        raisonFin: premiereMort ? "Première mort" : "Durée maximale atteinte"
    };
}


// Démarrage de la simulation sans html


// readline.question('Entrez le nombre d\'étages souhaité : ', (input) => {
//     const nbetages = parseInt(input) || 10;
//     console.log(`\nCréation d'une tour avec ${nbetages} étages`);

//     const TourPrincipale = new Tour(nbetages);
//     const Persos = CreationPerso(TourPrincipale);

//     console.log("\nPersonnages créés :");
//     Persos.forEach((p, i) => console.log(`${i + 1}: ${p.etat} (faim: ${p.faim})`));

//     console.log("\nRépartition des personnages dans la tour...");
//     Repartition(TourPrincipale, Persos);

//     console.log("\nDémarrage de la simulation...\n");
//     Simulation(TourPrincipale, Persos);

//     readline.close();
// });


let nbetages;  // Déclaration globale
let etagesElements = [];  // Liste globale des éléments d'étage
let TourPrincipale;  // La tour principale également globale




document.getElementById('simulationForm').onsubmit = function (e) {
    e.preventDefault();

    // Récupération des valeurs du formulaire
    let nbSimulations = parseInt(document.getElementById('nbSimulation').value);
    let nbEtages = parseInt(document.getElementById('nbEtages').value);
    let nbJours = parseInt(document.getElementById('nbJours').value);
    let distribution = document.querySelector('input[name="distribution"]:checked').value;
    let mean = parseFloat(document.getElementById("mean").value);
    let stdDevFront = parseFloat(document.getElementById("stdDev").value);

    if (isNaN(nbSimulations) || nbSimulations < 1 || isNaN(nbEtages) || nbEtages < 1 || isNaN(nbJours) || nbJours < 1) {
        alert("Veuillez entrer des valeurs valides.");
        return;
    }

    console.log(`Lancement de ${nbSimulations} simulations avec ${nbEtages} étages et ${nbJours} jours par simulation.`);
    console.log(`Distribution choisie : ${distribution}`);
    if (distribution === "normale") {
        console.log(`Moyenne : ${mean}, Écart-type : ${stdDevFront}`);
    }

    let screen = document.getElementById('screen');
    screen.innerHTML = '<h3>Tour en construction :</h3>'; // Reset des étages existants

    etagesElements = []; // Réinitialisation de la liste des éléments d'étage

    // Création des étages
    for (let index = 0; index < nbEtages; index++) {
        let etage = document.createElement("div");
        etage.classList.add("etage");
        etage.textContent = `Étage ${index + 1}`;
        screen.appendChild(etage);
        etagesElements.push(etage);
    }

    // Lancer plusieurs simulations avec les bons paramètres, y compris nbJours
    lancerPlusieursSimulations(nbSimulations, nbEtages, distribution, mean, stdDevFront, nbJours);
};




function affichageDom() {
    console.log("\nRépartition des personnages dans la tour...");

    for (let i = 0; i < etagesElements.length; i++) {
        etagesElements[i].innerHTML = '';
    }

    for (let index = 0; index < TourPrincipale.Niveaux.length; index++) {
        let etagePersos = TourPrincipale.Niveaux[index];
        let etageDiv = etagesElements[index];

        let persoContainer = document.createElement('div');
        persoContainer.style.display = 'flex';
        persoContainer.style.flexWrap = 'wrap';
        etageDiv.appendChild(persoContainer);

        // Ajout des personnages de l'étage
        for (let j = 0; j < etagePersos.length; j++) {
            let perso = etagePersos[j];
            let persoDiv = document.createElement('div');

            // Base class for perso
            persoDiv.classList.add('perso');

            // Add state-specific class
            if (perso.etat === 'gentil') {
                persoDiv.classList.add('gentil');
            } else if (perso.etat === 'mechant') {
                persoDiv.classList.add('mechant');
            }

            // Special state styling
            if (perso.etat === "gourou") {
                persoDiv.style.backgroundColor = "purple";
            } else if (perso.etat === "disciple") {
                //remove the previous class

                persoDiv.style.backgroundColor = "blue";
            }

            persoDiv.textContent = `Vie: ${perso.life}\nFaim: ${perso.faim}`;
            persoContainer.appendChild(persoDiv);
        }
    }
}



let nbtemps = 2000;



// let skip = document.getElementById('skip');
skip.onclick = function () {
    nbtemps = 0;
};

















// document.getElementById('simulationForm').onsubmit = function(e) {
//     e.preventDefault();
//     const nbEtages = parseInt(document.getElementById('nbEtages').value);
//     // Ici, vous pouvez appeler votre fonction de simulation avec nbEtages
//     console.log("Nombre d'étages choisi :", nbEtages);
// };



// Affichage de la tour

