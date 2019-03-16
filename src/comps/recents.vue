<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card class="mb-4">
        <router-link to="/partager">
          <v-card-title>
            Partager vos cours!
            <v-spacer></v-spacer>
            <v-icon> cloud_upload </v-icon>
          </v-card-title>
        </router-link>
      </v-card>
    </v-flex>
    <v-flex xs12>
      <v-card
        v-for="(post, key) in all_posts"
        :class="'mb-4 post-' + key"
        :key="key"
      >
        <v-card-title>
          <v-avatar>
            <v-icon class="blue lighten-2" size="32">person</v-icon>
          </v-avatar>
          <div class="ml-3">
            <span class="title"> {{ post.nomComplet }} </span>
            <v-spacer></v-spacer>
            <span class="caption"> {{ post.date }} à {{ post.ville }} </span>
          </div>
          <v-spacer></v-spacer>
          <div>
            <v-btn icon>
              <v-icon class="blue--text lighten-2"> bookmark_border </v-icon>
            </v-btn>
            <v-btn icon>
              <v-icon class="blue--text lighten-2"> more_vert </v-icon>
            </v-btn>
          </div>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12>
              <v-layout row wrap>
                <v-flex xs3>
                  <v-avatar size="112" class="blue lighten-2">
                    <v-icon> local_pizza </v-icon>
                  </v-avatar>
                </v-flex>
                <v-flex xs9 class="">
                  <span class="headline"> {{ post.nom }} </span>
                  <v-spacer></v-spacer>
                  <span class="subheadline"> {{ post.module }} </span>
                  <v-spacer></v-spacer>
                  <v-btn
                    flat
                    class="red--text right"
                    outline
                    :to="'Post/' + key"
                  >
                    Voir
                    <v-icon class="lighten-2"> visibility </v-icon>
                  </v-btn>
                </v-flex>
              </v-layout>
            </v-flex>
            <v-flex xs12>
              <div class="mt-2">
                <v-chip
                  dark
                  color="primary"
                  small
                  text-color="white"
                  absolute
                  class="bottom"
                >
                  {{ post.module | readmore_filt(11, "...") }}
                </v-chip>
                <v-chip
                  dark
                  color="primary"
                  small
                  text-color="white"
                  absolute
                  class="bottom"
                >
                  {{ post.type }}
                </v-chip>
                <v-chip
                  dark
                  color="primary"
                  small
                  text-color="white"
                  absolute
                  class="bottom"
                >
                  {{ post.annee }} Année
                </v-chip>
              </div>
            </v-flex>
          </v-layout>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import MainMenu from "@/comps/mainmenu";
import firebase from "@/fb.js";

/* eslint-disable */
export default {
  components: {
    MainMenu: MainMenu
  },
  name: "App",
  data() {
    return {
      user: {},
      all_posts: {}
    };
  },
  methods: {
    send: function() {
      firebase
        .database()
        .ref("users/" + this.test)
        .set(this.value, function(err) {
          if (err) {
            console.log("Failed to store " + this.value);
          } else {
            console.log("Mr " + this.test + " write " + this.value);
          }
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
        firebase
          .database()
          .ref("posts/")
          .once("value")
          .then(snap => {
            this.all_posts = snap.val();
            console.log(firebase.auth().currentUser.uid);
            console.log(this.user);
          });
        console.log(firebase.auth().currentUser.uid);
        console.log(this.user);
      });
  },
  watch: {
    all_posts() {
      firebase
        .database()
        .ref("posts/")
        .once("value")
        .then(snap => {
          this.all_posts = snap.val();
        });
    }
  },
  filters: {
    readmore_filt: function(text, length, suffix) {
      return text.substring(0, length) + suffix;
    }
  }
};
</script>

<style scoped></style>
