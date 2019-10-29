
  
<p align="center">  
  <img src="https://www.filterforge.com/filters/11635.jpg" alt="Logo" width=128 height=128>
	<h3 align="center">AirVyus</h3>  
	<p align="center">  
		AirVyus est un projet web réalisé par 3 étudiants de l'ESIEA  
		<br>  
		Morgan JULLY | Victor GUEGAN | Georges Amewe KASSI  
		<br>  
		Il permet de connecter des comptes Minecraft à un serveur donné.  
		<br>  
		<a href="https://github.com/carage34/AccountMC-Vue/issues/new">Signaler un bug</a>  
	</p>  
</p>  
  
  
# Sommaire  
  
- [Installation et lancement](#quick-start)  
- [Les fonctionnalités](#les-fonctionnalités)  
- [Ce que nous avons appris](#ce-que-nous-avons-appris)  
- [Technologies utilisées](#technologies-utilisées)  
- [License de copyright](#copyright)  
  
  
  
# Installation et lancement  
  
Installation du projet  
```  
npm install  
```  
Lancement du serveur de dev
```  
npm run serve  
```  

# Les fonctionnalités

### Le projet 
Air Vyus est un petit site web de gestion sur lequel on peut ajouter des comptes Minecraft et les connecter à un serveur donné. Il part d'un cas d'utilisation. En effet des joueurs Minecraft souhaitaient avoir un moyen de se connecter à un serveur du jeu sans avoir à être sur leur ordinateur ou même sans avoir à lancer le jeu.

### Comment ça marche 

Une fois que vous êtes connecté vous arrivez sur la page d'accueil, vous pouvez y retrouvez la liste de tout les joueurs qui ont été ajouté à l'application. D'ici, vous pouvez les connecter au serveur ou bien les supprimer de la liste.

Ensuite, vous avez le moyen d'ajouter un compte Minecraft à l'application, une fois que les champs d'email, nom de compte, mot de passe et position remplis, vous validez et vous pouvez retrouver le compte sur l'accueil.

La dernière page de l'application est la liste des utilisateurs : il s'agit des différentes personnes comme vous qui ont accès à l'application. Si vous n'êtes qu'un simple utilisateur vous n'allez pas pouvoir faire grand chose. En effet, celle-ci sert principalement aux administrateurs pour qu'il puisse gérer les utilisateurs : nommer un nouvel admin, retirer les privilèges d'admin, supprimer l'utilisateur, etc.

Enfin, le dernier bouton de la barre de navigation permet de se connecter/se déconnecter dépendant de si vous êtes déjà connecté ou non.
  
# Déroulement du projet 
  
### Niveau front end

Nous avions déjà travailler avec VueJS et Vuetify lors de notre précédent [PST de 3 année](https://a7capitalticker.firebaseapp.com), il ne s'agissait donc pas d'une découverte pour nous. Mais cela nous a permis d'en apprendre encore plus sur Vue et Vuetify et de customiser un peu plus l'apparence afin de réellement s'approprier le projet. 

### Niveau back end

Avant le projet, nous avions déjà une partie du backend qui avait déjà été réalisée. Mais il nous restait encore du travail sur de nombreux points.

### Remarques générales

Il y a malheureusement certaines choses que nous n'avons pas pu mettre en place et que nous aurions souhaité avoir dans le projet.
Notamment, la possibilité de créer des groupes d'utilisateurs afin de pouvoir connecter tout un groupe de personne à la fois sur le serveur. Ou à l'inverse de pouvoir déconnecter tout un groupe en même temps.

# Technologies utilisées

Le projet a été entièrement réalisé à l'air de Javascript. 
|  |     Frontend    | Backend |  |
|--|-----------------|---------|--|
|  | VueJS + Vuetify | Node JS |  |




# Copyright  
  
Code and documentation copyright 2011-2018 the authors. Code released under the [MIT License](https://fr.wikipedia.org/wiki/Licence_MIT).  
  
Enjoy :handshake:
