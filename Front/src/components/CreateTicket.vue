<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="ui form">

<!--    titre-->
    <div class="field">
      <div class="field error">
        <label>Titre</label>
        <input placeholder="Titre" type="text">
      </div>
    </div>


    <div class="field">
<!--      ajouter la phrase "Je souhaite" -->
      <div class="ui selection dropdown">
        <div class="default text">Choisir</div>
        <i class="dropdown icon"></i>
        <input type="hidden" name="Proposer">
        <div class="menu">
          <div class="item" data-value="Proposer">Proposer</div>
          <div class="item" data-value="Demander">Demander</div>
        </div>
      </div>
      <!--      ajouter la phrase "un service" -->
<!--      tout sur la même ligne-->
    </div>

    <div class="ui selection dropdown">
      <div class="default text">Choisir</div>
      <i class="dropdown icon"></i>
      <input type="hidden" name="Categorie">
      <div class="menu">
<!--        si Proposer = Proposer récupérer les compétences de l'utilisateur en bdd-->
<!--        format de la requête :-->

        <!--        si Proposer = Demander récuperer toutes les compétences en bdd-->
        <!--        format de la requête :-->

<!--        format d'affichage <div class="item" data-value="Demander">Demander</div>-->

      </div>
    </div>


    <div class="three fields">
      <div class="field">
        <label>Start date</label>
        <div class="ui calendar" id="rangestart">
          <div class="ui input left icon">
            <i class="calendar icon"></i>
            <input type="text" placeholder="Start">
          </div>
        </div>
      </div>
      <div class="field">
          <label>Durée du service</label>
          <input type="text" name="Duree" maxlength="3" placeholder="nombres d'heuresdurée">
      </div>
      <div class="ui selection dropdown">
        <div class="default text">Format</div>
        <i class="dropdown icon"></i>
        <input type="hidden" name="Format">
        <div class="menu">
            <div class="item" data-value="Jours">Jours</div>
            <div class="item" data-value="Heures">Heures
            <div class="item" data-value="Minutes">Minutes</div>
        </div>
      </div>
    </div>
<!--      si jours faire *60*24 pour stocker en minutes-->
<!--  si heures faire *60 pour stocker en minutes-->


<!--      si Propose = Propose alors afficher la div suivante-->

      <div class="field">
        <label>Combien de Personnes peuvent participer </label>
        <input type="text" name="Place" maxlength="3" placeholder="nombres de places">
      </div>


<!--      Pour Outil et OutilAutre (les deux div si dessous) les incorporer dans une boucle si outil est diférent de Aucun ajouter une fois les deux div en respectant les comentaires-->

      <!--      si Propose = Propose alors afficher la div suivante-->
      <div class="ui selection dropdown">
        <div class="default text">Aucun</div>
        <i class="dropdown icon"></i>
        <input type="hidden" name="Outil">
        <div class="menu">
          <div class="item" data-value="Aucun">Aucun</div>
<!--          récupérer les outils de la personne (voiture AA-111-BB,...) et afficher-->
        <div class="item" data-value="Autre">Autre</div>
        </div>
      </div>


<!--      si Outil = Autre alors afficher la div suivante-->

      <div class="field">
        <label>Péciser</label>
        <input type="text" name="OutilAutre" placeholder="Préciser">
      </div>

      <div class="inline field">
        <div class="ui toggle checkbox">
          <input type="checkbox" tabindex="0" class="hidden">
          <label>Faut'il des outils suplémentaires</label>
        </div>
      </div>

<!--si la checkboxe et coché alors afficher la div qui suit-->
      <!--      Pour OutilClient et OutilClientAutre (les deux div si dessous) les incorporer dans une boucle si OutilClient est diférent de Aucun ajouter une fois les deux div avec pour name OutilClient1 OutilClient2... limité à 5 en respectant les comentaires-->

      <!--      si Propose = Propose alors afficher la div suivante-->
      <div class="ui selection dropdown">
        <div class="default text">Aucun</div>
        <i class="dropdown icon"></i>
        <input type="hidden" name="OutilClient">
        <div class="menu">
          <div class="item" data-value="Aucun">Aucun</div>
          <!--          récupérer les outils de la personne (voiture AA-111-BB,...) et afficher-->
          <div class="item" data-value="Autre">Autre</div>
        </div>
      </div>


      <!--      si Outil = Autre alors afficher la div suivante-->

      <div class="field">
        <label>Péciser</label>
        <input type="text" name="OutilClientAutre" placeholder="Préciser">
      </div>

      <div class="ui segment">
        <div class="field">
          <div class="ui toggle checkbox">
            <input type="checkbox" name="BesoinAdresseService" tabindex="0" class="hidden">
            <label>Quel est l'adresse du service?</label>
          </div>
        </div>
      </div>



<!--si Proposer = Proposer alors afficher la div qui suit-->

      <div class="ui segment">
        <div class="field">
          <div class="ui toggle checkbox">
            <input type="checkbox" name="BesoinAdresseClient" tabindex="0" class="hidden">
            <label>Vous avez besoin de l'adresse des participant/membres</label>
          </div>
        </div>
      </div>


      <div class="field">
        <label>Description</label>
        <textarea></textarea>
      </div>

<!--      ajouter upload images taille max a définir type autorisé à définir nombre max 5-->

      <div class="ui buttons">
        <button class="negative ui button">Anuler</button>
        <button class="ui button">Prévisualiser</button>
        <button class="positive ui button">Sauvegarder</button>

      </div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
