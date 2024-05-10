var entries = []; // Tableau pour stocker les entrées

// Charger les données du localStorage lors du chargement de l'application
window.onload = function() {
    var storedEntries = JSON.parse(localStorage.getItem('entries'));
    if (storedEntries) {
        entries = storedEntries;
        displayHistory();
    }
};

function calculateDrivingHours() {
    var startTime = document.getElementById('startTime').value;
    var endTime = document.getElementById('endTime').value;

    // Convertir les heures de début et de fin en objets Date
    var startDate = new Date('2000-01-01T' + startTime);
    var endDate = new Date('2000-01-01T' + endTime);

    // Vérifier si l'heure de fin est antérieure à l'heure de départ
    if (endDate < startDate) {
        // Ajouter une journée à l'heure de fin pour obtenir la bonne durée
        endDate.setDate(endDate.getDate() + 1);
    }

    // Calculer la différence de temps en millisecondes
    var timeDifference = endDate - startDate;

    // Convertir la différence de temps en heures et minutes
    var hours = Math.floor(timeDifference / (1000 * 60 * 60));
    var minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));

    // Afficher la différence de temps dans le champ "Heures de conduite"
    document.getElementById('drivingHours').value = hours + 'h ' + minutes + 'min';
}

function saveEntry() {
    var startLocation = document.getElementById('startLocation').value;
    var startTime = document.getElementById('startTime').value;
    var endLocation = document.getElementById('endLocation').value;
    var endTime = document.getElementById('endTime').value;
    var drivingHours = document.getElementById('drivingHours').value;
    var distance = document.getElementById('distance').value;
    var currentDate = new Date(); // Obtenir la date actuelle

    // Formatage de la date
    var formattedDate = currentDate.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });

    // Enregistrement des données dans le tableau avec la date
    var entry = {
        date: formattedDate,
        startLocation: startLocation,
        startTime: startTime,
        endLocation: endLocation,
        endTime: endTime,
        drivingHours: drivingHours,
        distance: distance
    };

    entries.push(entry);

    // Sauvegarder les données dans le localStorage
    localStorage.setItem('entries', JSON.stringify(entries));

    // Afficher l'historique
    displayHistory();

    // Réinitialiser les champs après l'enregistrement
    document.getElementById('startLocation').value = '';
    document.getElementById('startTime').value = '';
    document.getElementById('endLocation').value = '';
    document.getElementById('endTime').value = '';
    document.getElementById('drivingHours').value = '';
    document.getElementById('distance').value = '';

    alert('Données enregistrées avec succès !');
}

function displayHistory() {
    var historyContainer = document.getElementById('history');
    historyContainer.innerHTML = ''; // Effacer le contenu précédent

    // Parcourir le tableau des entrées et les afficher dans l'interface utilisateur
    entries.forEach(function(entry) {
        var entryElement = document.createElement('div');
        entryElement.textContent = 'Date : ' + entry.date + ', Départ : ' + entry.startLocation + ' à ' + entry.startTime + ', Arrivée : ' + entry.endLocation + ' à ' + entry.endTime + ', Heures : ' + entry.drivingHours + ', Distance : ' + entry.distance;
        historyContainer.appendChild(entryElement);
    });
}

function downloadData() {
    console.log("Tentative de téléchargement du fichier Excel...");

    // Création d'un objet Workbook
    var wb = XLSX.utils.book_new();
    var wsData = [];

    // Ajouter les en-têtes de colonnes
    var headers = ['Date', 'Départ', 'Heure de départ', 'Arrivée', 'Heure de fin', 'Heures', 'Distance'];
    wsData.push(headers);

    // Ajouter les données à partir du tableau d'entrées
    entries.forEach(function(entry) {
        var rowData = [entry.date, entry.startLocation, entry.startTime, entry.endLocation, entry.endTime, entry.drivingHours, entry.distance];
        wsData.push(rowData);
    });

    // Création d'une feuille de calcul
    var ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Ajouter la feuille de calcul au Workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Journal_de_bord');

    // Conversion du Workbook en ArrayBuffer
    var wbArrayBuffer = XLSX.write(wb, { type: 'array' });

    // Convertir l'ArrayBuffer en objet blob
    var wbBlob = new Blob([wbArrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

    // Téléchargement du fichier Excel en utilisant FileSaver.js
    saveAs(wbBlob, 'journal_de_bord.xlsx');
}

function clearHistory() {
    entries = [];
    localStorage.removeItem('entries');
    displayHistory();
    alert("L'historique a été effacé avec succès !");
}

function sendEmail(EmailTo) {
    // Créer un objet Workbook
    var wb = XLSX.utils.book_new();
    var wsData = [];

    // Ajouter les en-têtes de colonnes
    var headers = ['Date', 'Départ', 'Heure de départ', 'Arrivée', 'Heure de fin', 'Heures', 'Distance'];
    wsData.push(headers);

    // Ajouter les données à partir du tableau d'entrées
    entries.forEach(function(entry) {
        var rowData = [entry.date, entry.startLocation, entry.startTime, entry.endLocation, entry.endTime, entry.drivingHours, entry.distance];
        wsData.push(rowData);
    });

    // Création d'une feuille de calcul
    var ws = XLSX.utils.aoa_to_sheet(wsData);
    
    // Ajouter la feuille de calcul au Workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Journal_de_bord');

    // Conversion du Workbook en ArrayBuffer
    var wbArrayBuffer = XLSX.write(wb, { type: 'array' });

    // Créer le lien de messagerie avec la pièce jointe et l'adresse e-mail
    var subject = encodeURIComponent('Journal de bord'); // Sujet du message
    var body = encodeURIComponent('Bonjour,\n\nVeuillez trouver ci-joint le journal de bord.'); // Corps du message
    var wbBlob = new Blob([wbArrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    var wbURL = URL.createObjectURL(wbBlob);
    var mailtoLink = 'mailto:' + EmailTo + '?subject=' + subject + '&body=' + body + '&attachment=' + wbURL;

    // Ouvrir le client de messagerie par défaut avec le lien de messagerie
    window.location.href = mailtoLink;
}