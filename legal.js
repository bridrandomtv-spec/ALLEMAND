/* legal.js — ⚖️ Légal : mentions légales + CGU abonnement/sponsoring + confidentialité */
'use strict';
(function(){
  const $ = (s,c) => (c||document).querySelector(s);
  const MAJ = '2026';
  function render(){
    const box = $('#legalBody'); if(!box) return;
    box.innerHTML =
      '<div class="lg-hero"><span class="lg-crest">⚖️</span><div><h2>Cadre légal de la plateforme</h2>'
      + '<p class="lg-sub">mentions légales · conditions générales d’utilisation (abonnement & '
      + 'sponsoring) · politique de confidentialité — version ' + MAJ + '</p></div></div>'

      + '<div class="card lg-c"><b>🏛️ 1. Mentions légales</b>'
      + '<p><b>Éditeur & directeur de publication :</b> KHERIEF Ahmed (Prof. Kharif Ahmed), '
      + 'professeur de langue allemande — enseignement secondaire, Algérie (wilaya de '
      + 'Bordj Bou Arreridj). Contact : messagerie de la plateforme (💬 0555 57 79 31).</p>'
      + '<p><b>Hébergement :</b> Cloudflare Inc. (CDN & Workers), Supabase (base de données, '
      + 'authentification, stockage — région Europe), GitHub Inc. (dépôt de code & miroir).</p>'
      + '<p><b>Propriété intellectuelle :</b> les contenus originaux (résumés, exercices, '
      + 'corrigés, interfaces, enregistrements) sont © KHERIEF Ahmed — toute reproduction '
      + 'ou revente sans autorisation écrite est interdite. Les sujets d’examens et le '
      + 'manuel officiel restent la propriété de leurs auteurs / du Ministère de '
      + 'l’Éducation Nationale ; la plateforme ne diffuse aucun scan de manuel.</p></div>'

      + '<div class="card lg-c"><b>📜 2. Conditions générales d’utilisation</b>'
      + '<p><b>2.1 Objet.</b> Soutien scolaire et entraînement en langue allemande '
      + '(2AS / 3AS) : leçons interactives, devoirs notés, mémoire espacée, suivi. La '
      + 'plateforme est un complément : elle ne remplace ni l’enseignement officiel ni '
      + 'le manuel scolaire.</p>'
      + '<p><b>2.2 Compte.</b> Création gratuite (email + mot de passe). Un compte par '
      + 'personne ; non cessible. Les mineurs s’inscrivent sous la responsabilité d’un '
      + 'parent. Le partage de compte ou l’usage frauduleux entraîne la suspension.</p>'
      + '<p><b>2.3 Abonnement.</b> Tarifs en dinars algériens : 1 mois = 1 800 DA · '
      + '6 mois = 9 000 DA · 1 an = 15 000 DA. Paiement par CCP ou BaridiMob au compte '
      + 'KHERIEF AHMED, en indiquant la référence DZ-… fournie par la plateforme. '
      + 'Activation <b>manuelle sous 24 h</b> après vérification du reçu. Durées : 30 / '
      + '180 / 365 jours à compter de l’activation. <b>Sans reconduction tacite</b> : '
      + 'un rappel est proposé avant échéance. Non remboursable, sauf non-activation ou '
      + 'double paiement prouvé. Les prix peuvent évoluer ; un abonnement en cours garde '
      + 'sa durée et ses avantages.</p>'
      + '<p><b>2.4 Sponsoring.</b> Espaces publicitaires payants (bannière accueil, '
      + 'bandeau unités, encart email). Chaque publicité est validée par l’admin avant '
      + 'diffusion. Sont interdits : contenus contraires à la loi, inadaptés aux '
      + 'mineurs, trompeurs ou politiques. Le sponsor reste seul responsable de son '
      + 'message ; la plateforme peut retirer toute pub à tout moment.</p>'
      + '<p><b>2.5 Comportement.</b> Interdits : triche organisée, aspiration massive de '
      + 'contenus, usurpation d’identité, diffusion de contenus illégaux, atteinte au '
      + 'fonctionnement du service.</p>'
      + '<p><b>2.6 Responsabilité.</b> Service fourni « en l’état » à des fins '
      + 'pédagogiques ; aucune garantie de résultat à un examen. La plateforme ne peut '
      + 'être tenue responsable des coupures de réseau ou de service des hébergeurs.</p>'
      + '<p><b>2.7 Droit applicable.</b> Droit algérien ; compétence des tribunaux de '
      + 'Bordj Bou Arreridj.</p></div>'

      + '<div class="card lg-c"><b>🔐 3. Politique de confidentialité</b>'
      + '<p><b>Données collectées :</b> email, pseudonyme, niveau, filière, wilaya ; '
      + 'données d’apprentissage (cartes mémoire, séances, scores) ; abonnement (statut, '
      + 'dates) ; messages de sponsoring. Rien d’autre.</p>'
      + '<p><b>Finalités :</b> fonctionnement du service, suivi pédagogique, gestion des '
      + 'abonnements et des sponsors. <b>Aucune revente</b> de données, aucun traceur '
      + 'publicitaire comportemental ; les bannières sponsor sont de simple affichage.</p>'
      + '<p><b>Hébergement des données :</b> Supabase (Union européenne) + copies techniques '
      + 'Cloudflare. Le mode hors-ligne (service worker) garde une copie locale sur '
      + 'l’appareil, sous votre seul contrôle.</p>'
      + '<p><b>Durée :</b> vie du compte + 1 an après suppression.</p>'
      + '<p><b>Vos droits :</b> accès, rectification, suppression — via 🛡️ Admin ou par '
      + 'demande à l’éditeur (💬). Les comptes de mineurs sont exercés par le parent.</p></div>'

      + '<p class="lg-note">En créant un compte ou en souscrivant un abonnement, vous '
      + 'déclarez avoir lu et accepté les présentes conditions.</p>';
  }
  window.renderLegal = render;
  document.addEventListener('dz:view', e => { if(e.detail === 'legal') render(); });
})();
