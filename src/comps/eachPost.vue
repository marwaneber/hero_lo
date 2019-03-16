<template>
  <v-layout row wrap>
    <v-flex xs12>
      <v-card class="mb-4">
        <router-link to="/">
          <v-card-title class="red--text">
            <v-icon class="pr-2"> keyboard_arrow_left </v-icon>
            Retour au accueil
          </v-card-title>
        </router-link>
      </v-card>
    </v-flex>
    <v-flex xs12>
      <v-card :class="'mb-4'">
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
              <div>
                <v-chip
                  dark
                  color="primary"
                  small
                  text-color="white"
                  absolute
                  class="bottom"
                >
                  {{ post.module | readmore_filt(13, "...") }}
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
        <v-divider></v-divider>
        <v-card-text>
          <v-layout row wrap>
            <v-flex xs12>
              :src="{{ post.link | readmore_filt(48, "") }}"
            </v-flex>
          </v-layout>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-text>
          <v-layout row wrap>
            <v-flex>
              <v-card class="mb-3">
                <v-text-field
                  :label="new_comment.nomComp"
                  placeholder="Commenter d'abord"
                  :outline="true"
                  counter="70"
                  v-model="new_comment.text"
                  color="black"
                  append-icon="send"
                  @click:append="partager_comment"
                  messages="Remplire les champs"
                ></v-text-field>
              </v-card>
            </v-flex>
            <v-flex xs12>
              <v-card v-for="(comment, i) in comments" :key="i" class="mb-3">
                <v-card-title>
                  <v-avatar size="28">
                    <v-icon class="blue lighten-2" size="16">person</v-icon>
                  </v-avatar>
                  <div class="ml-3">
                    <span class="caption"> {{ comment.nomComp }} </span>
                    <v-spacer></v-spacer>
                    <span class="caption" style="font-size:8px;">
                      {{ comment.comDate }}
                    </span>
                  </div>
                </v-card-title>
                <v-card-text> {{ comment.text }} </v-card-text>
              </v-card>
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
      post: {},
      new_comment: {
        nomComp: "",
        text: "",
        comDate: "",
        uid: ""
      },
      comments: [
        {
          comDate: "14/03/2019 19:45",
          nomComp: "Houssame LOGDALI",
          text: "jzkzj xkkznnx",
          uid: "Pl00miuxzKfEkLuizH9L1RlunkQ2"
        },
        {
          comDate: "14/03/2019 19:45",
          nomComp: "Houssame LOGDALI",
          text: "jzkzj xkkznnx",
          uid: "Pl00miuxzKfEkLuizH9L1RlunkQ2"
        },
        {
          comDate: "14/03/2019 19:45",
          nomComp: "Houssame LOGDALI",
          text: "jzkzj xkkznnx",
          uid: "Pl00miuxzKfEkLuizH9L1RlunkQ2"
        }
      ]
    };
  },
  methods: {
    partager_comment(e) {
      if (this.new_comment.text.trim().length > 0) {
        var m = new Date();
        var dateString =
          m.getUTCFullYear() +
          "/" +
          ("0" + (m.getUTCMonth() + 1)).slice(-2) +
          "/" +
          ("0" + m.getUTCDate()).slice(-2) +
          " " +
          ("0" + m.getUTCHours()).slice(-2) +
          ":" +
          ("0" + m.getUTCMinutes()).slice(-2) +
          ":" +
          ("0" + m.getUTCSeconds()).slice(-2);

        // date of post
        this.new_comment.comDate = dateString;
        firebase
          .database()
          .ref("posts-comments/" + this.$route.params.post_id)
          .push(this.new_comment);
        this.new_comment.comDate = "";
        this.new_comment.text = "";
      } else {
        alert("Remplire les champs!");
      }
    }
  },
  mounted() {
    firebase
      .database()
      .ref("posts/" + this.$route.params.post_id)
      .once("value")
      .then(snap => {
        this.post = snap.val();
      });
    firebase
      .database()
      .ref("posts-comments/" + this.$route.params.post_id)
      .once("value")
      .then(snap => {
        this.comments = snap.val();
      });
    firebase
      .database()
      .ref("users/" + firebase.auth().currentUser.uid)
      .once("value")
      .then(snap => {
        console.log(snap.val());
        this.user = snap.val();
        this.new_comment.uid = firebase.auth().currentUser.uid;
        this.new_comment.nomComp =
          this.user.firstname + " " + this.user.lastname;
      });
    // import("pdfjs-dist/webpack").then(pdfjs => {
    //   pdfjs
    //     .getDocument("wibble.pdf")
    //     .then(pdf => {
    //       const pagePromises = range(1, pdf.numPages).map(number =>
    //         pdf.getPage(number)
    //       );
    //       return Promise.all(pagePromises);
    //     })
    //     .then(
    //       pages => {
    //         const scale = 2;

    //         const canvases = pages.forEach(page => {
    //           const viewport = page.getViewport(scale);

    //           // Prepare canvas using PDF page dimensions
    //           const canvas = document.createElement("canvas");
    //           canvas.height = viewport.height;
    //           canvas.width = viewport.width;

    //           // Render PDF page into canvas context
    //           const canvasContext = canvas.getContext("2d");
    //           const renderContext = { canvasContext, viewport };
    //           page
    //             .render(renderContext)
    //             .then(() => console.log("Page rendered"));

    //           document.body.appendChild(canvas);
    //         });
    //       },
    //       error => console.log("Error", error)
    //     );
    // });
  },
  watch: {
    comments() {
      firebase
        .database()
        .ref("posts-comments/" + this.$route.params.post_id)
        .once("value")
        .then(snap => {
          this.comments = snap.val();
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
