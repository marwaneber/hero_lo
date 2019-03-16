<template>
  <v-layout row wrap>
    <v-flex xs12 md12 sm12>
      <v-list>
        <v-list-tile flat class="blue pt-2 pb-2">
          <v-list-tile-avatar>
            <v-icon class="white">person</v-icon>
          </v-list-tile-avatar>
          <v-list-tile-content>
            <v-list-tile-title
              >{{ user.firstname }} {{ user.lastname }}</v-list-tile-title
            >
            <v-list-tile-sub-title>{{ user.filiere }}</v-list-tile-sub-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile
          v-for="link in links"
          :key="link.title"
          router
          :to="link.route"
        >
          <v-list-tile-action>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>{{ link.title }}</v-list-tile-title>
        </v-list-tile>
        <v-list-tile v-on:click="signout">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-title>Déconnexion</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-flex>
  </v-layout>
</template>
<script>
/*
user structure
	abrv_filier: "DSI"
	banned: 0
	centre: "Ly. My. Ismail"
	cne: "J987654321"
	email: "marwane@beriich.com"
	filiere: "Développement des Systèmes d'Information"
	firstname: "marwane"
	gendre: "M"
	lastname: "beriich"
	prof: false
	ville: "Meknès"

*/

import firebase from "@/fb.js";
export default {
  name: "App",
  data() {
    return {
      links: [
        { title: "Profile", icon: "person", route: "/Profile" },
        { title: "Mes Posts", icon: "bookmarks", route: "/MesPreferes" },
        { title: "Mes Cours", icon: "chrome_reader_mode", route: "/MesCours" },
        {
          title: "Mes Exams",
          icon: "assignment_turned_in",
          route: "/MesExams"
        },
        { title: "Mes Exercices", icon: "assignment", route: "/MesExercices" }
        // {"title": "Déconnexion", "icon": "exit_to_app", "route": "/SignOut"},
        // {"title": "Connecter", "icon": "account_circle", "route": "/SignIn"},
        // {"title": "Creer compte", "icon": "person_add", "route": "/SignUp"}
      ],
      isLogged: false,
      user_email: "",
      user: ""
    };
  },
  created() {
    if (firebase.auth().currentUser) {
      this.isLogged = true;
      this.user_email = firebase.auth().currentUser.email;
    }
  },
  methods: {
    signout: function() {
      alert("Good bye " + firebase.auth().currentUser.uid);
      firebase
        .auth()
        .signOut()
        .then(() => {
          this.$router.go({ path: this.$router.path });
        });
    }
  },
  mounted() {
    firebase
      .database()
      .ref("users/" + firebase.auth().currentUser.uid)
      .once("value")
      .then(snap => {
        this.user = snap.val();
      });
  },
  watch: {
    user() {
      firebase
        .database()
        .ref("users/" + firebase.auth().currentUser.uid)
        .once("value")
        .then(snap => {
          this.user = snap.val();
        });
    }
  }
};
</script>
