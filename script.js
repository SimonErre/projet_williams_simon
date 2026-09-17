// script.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const errorContainer = document.getElementById("errorMessages");
  const summarySection = document.getElementById("summarySection");
  const summaryList = document.getElementById("summaryList");

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Empêche le rechargement de la page
    errorContainer.style.display = "none";
    errorContainer.innerHTML = "";

    let errors = [];

    // Récupération des valeurs
    const login = document.getElementById("login").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const nom = document.getElementById("nom").value.trim();
    const prenom = document.getElementById("prenom").value.trim();
    const adresse = document.getElementById("adresse").value.trim();
    const email = document.getElementById("email").value.trim();
    const telephone = document.getElementById("telephone").value.trim();
    const naissance = document.getElementById("naissance").value;

    // Validation 1 : Vérification que les champs ne sont pas vides (sécurité supplémentaire au 'required' HTML)
    if (
      !login ||
      !password ||
      !confirmPassword ||
      !nom ||
      !prenom ||
      !adresse ||
      !email ||
      !telephone ||
      !naissance
    ) {
      errors.push("Tous les champs sont requis.");
    }

    // Validation 2 : Format de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push("L'adresse email n'est pas valide.");
    }

    // Validation 3 : Correspondance des mots de passe
    if (password !== confirmPassword) {
      errors.push("Les mots de passe ne correspondent pas.");
    }

    // Affichage des erreurs ou succès
    if (errors.length > 0) {
      errorContainer.innerHTML = errors.join("<br>");
      errorContainer.style.display = "block";
    } else {
      // Création de l'objet de données (sans le mot de passe)
      const userData = {
        Login: login,
        Nom: nom,
        Prénom: prenom,
        Adresse: adresse,
        Email: email,
        Téléphone: telephone,
        "Date de naissance": naissance,
      };

      // Masquer le formulaire
      form.classList.add("hidden");

      // Remplir le récapitulatif
      summaryList.innerHTML = "";
      for (const [key, value] of Object.entries(userData)) {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${key} :</strong> ${value}`;
        summaryList.appendChild(li);
      }

      // Afficher le récapitulatif
      summarySection.classList.remove("hidden");
    }
  });
});
