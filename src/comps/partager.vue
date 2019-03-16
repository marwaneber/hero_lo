<template>
  <v-layout row>
    <v-flex xs12>
      <v-card>
        <v-card-text>
          <v-flex xs12 class="text-xs-right">
            <router-link to="/">
              <v-btn small flat class="red--text" :disabled="loaded">
                Annuler
              </v-btn>
            </router-link>
          </v-flex>
          <v-text-field
            label="Nom de cours"
            placeholder="Tapez quelque mots.."
            :disabled="loaded"
            :outline="true"
            v-model="post.nom"
            counter="70"
          ></v-text-field>
          <v-flex
            xs12
            class="text-xs-center text-sm-center text-md-center text-lg-center"
          >
            <v-text-field
              label="Votre document"
              placeholder="Selectionner un fichier"
              @click="pickFile"
              v-model="fileName"
              value="fileName"
              :outline="true"
              append-icon="attach_file"
              :rules="[formRules.fileName]"
              :disabled="loaded"
              clearable
              @click:clear="file = '';"
              readonly
            ></v-text-field>
            <input
              type="file"
              style="display: none"
              ref="image"
              accept="application/pdf"
              @change="onFilePicked"
            />
          </v-flex>

          <v-select
            v-model="post.module"
            :items="modules"
            item-text=""
            :outline="true"
            label="Module"
            :disabled="loaded"
            placeholder="Choisi un module"
          >
          </v-select>
          <v-flex xs12>
            <span class="caption gray--text">Ce document est:</span> <br />
            <v-chip
              v-for="(c, i) in all_chips"
              :key="i"
              :disabled="loaded"
              :color="c.toLowerCase() === post.type ? 'blue' : 'light'"
              @click="post.type = c.toLowerCase();"
              >{{ c }}</v-chip
            >
          </v-flex>
          <v-flex xs12>
            <span class="caption gray--text">Pour les :</span> <br />
            <v-chip
              v-for="(c, i) in all_annee"
              :key="i"
              :disabled="loaded"
              :color="c.split(' ')[0] === post.annee ? 'blue' : 'light'"
              @click="post.annee = c.split(' ')[0];"
              >{{ c }}</v-chip
            >
          </v-flex>
          <v-flex xs12>
            <v-alert v-if="error_loged.state" :value="true" type="error">
              {{ error_loged.message }}
            </v-alert>
          </v-flex>
          <v-flex xs12 class="text-xs-center">
            <span class="caption" v-if="finish_progress"
              >Le chargement {{ Math.round(finish_progress) }}%</span
            >
            <v-progress-linear
              v-model="finish_progress"
              v-if="finish_progress"
            ></v-progress-linear>
            <v-btn
              color="success"
              :disabled="loaded"
              :loading="loaded"
              @click="partager"
              >{{ state_btn }}</v-btn
            >
          </v-flex>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import firebase from "@/fb";
// eslint-disabled-next-line
var my_file = "";
export default {
  data() {
    return {
      all_chips: ["Exercice", "Cours", "Examen", "Rapport"],
      all_annee: ["1er Année", "2eme Année"],
      fileName: "",
      file: "",
      modules: [],
      hhh: my_file,
      user: {},
      state_btn: "Partager",
      error_loged: {
        state: false
      },
      loaded: false,
      finish_progress: 0,
      post: {
        nom: "", // by Component
        annee: "2eme", // by Component
        type: "exercice", // by Component
        link: "", // by Component
        module: "", // by Component
        date: "", // by Component
        valide: false, // by default
        nomComplet: "", // by user
        filiere: "", // by user
        ville: "", // by user
        uid: "", // by user
        saved_by: [] // by default
      },
      formRules: {
        fileName: function(v) {
          return v.lastIndexOf(".pdf") <= 0
            ? "Choisi une fichier valide"
            : false;
        }
      }
    };
  },

  methods: {
    pickFile() {
      this.$refs.image.click();
    },
    onFilePicked(e) {
      const files = e.target.files;
      if (files[0] !== undefined) {
        this.fileName = files[0].name;
        this.file = files[0];
        /* eslint-disable */
        console.log(this.file);
        my_file = this.file;
      }
    },
    partager(e) {
      /* eslint-disable */

      // validate form
      if (!!this.fileName && !!this.post.nom && !!this.post.module) {
        // trigger the loading stating
        this.loaded = true;
        const myself = this;
        try {
          // new file name create
          const post_fileName = this.post.type + "/" + this.fileName;

          // create reference of file
          var storageRef = firebase.storage().ref(post_fileName);

          // trigger an upload task
          var uploadTask = storageRef.put(this.file);
          uploadTask.on(
            "state_changed",
            function progress(snapshot) {
              // tracking progress of uploading
              var progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
              myself.finish_progress = progress;
            },

            function error(err) {
              // handling errors
              myself.error_loged = err;
              myself.loaded = false;
            },

            async function complete() {
              // getting file url
              myself.post.link = await uploadTask.snapshot.ref.getDownloadURL();

              // adding date to post
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
              myself.post.date = dateString;

              // adding search helper by Filiere
              myself.post.mainsearch = myself.user.abrv_filiere + "_true";

              // adding search helper by Name
              myself.post.namesearch =
                myself.user.abrv_filiere + "_true" + myself.post.nom;

              // adding search helper by Module
              myself.post.modulesearch =
                myself.user.abrv_filiere +
                "_true" +
                myself.post.nom +
                "_" +
                myself.post.module;

              // adding search helper by Year
              myself.post.anneesearch =
                myself.user.abrv_filiere +
                "_true" +
                myself.post.nom +
                "_" +
                myself.post.annee;

              // adding fileName to post
              myself.post.fileName = myself.post.type + "/" + myself.fileName;

              // get ref to put info of post
              var ref_root = firebase.database().ref("/");
              var new_key = ref_root.child("posts").push().key;
              var new_reg = {};
              new_reg["posts/" + new_key] = myself.post;
              new_reg[
                "posts_by_user/" +
                  firebase.auth().currentUser.uid +
                  "/" +
                  new_key
              ] = myself.post;

              // apply them all
              ref_root.update(new_reg);
              myself.loaded = false;
              myself.state_btn = "Bien fait!";
              setTimeout(() => {
                myself.state_btn = "Partager";
              }, 2000);
              myself.post.nom = "";
              myself.post.module = "";
              myself.fileName = "";
              myself.finish_progress = 0;
              console.log("File available at", myself.post.link);
            }
          );
        } catch (error) {
          myself.error_loged = error;
          this.loaded = false;
        }
      } else {
        this.error_loged.state = true;
        this.error_loged.message = "Remplire les champs";
      }
      e.preventDefault();
    }
  },
  created() {},
  mounted() {
    // abrv_filier: "DSI"
    // banned: 0
    // centre: "Ly. My. Ismail"
    // cne: "J987654321"
    // email: "marwane@beriich.com"
    // filiere: "Développement des Systèmes d'Information"
    // firstname: "marwane"
    // gendre: "M"
    // lastname: "beriich"
    // prof: false
    // ville: "Meknès"
    /* eslint-disable */
    firebase
      .database()
      .ref("users/" + firebase.auth().currentUser.uid)
      .once("value", ds => {
        this.user = ds.val();
        this.post.ville = this.user.ville;
        this.post.filiere = this.user.filiere;
        this.post.uid = firebase.auth().currentUser.uid;
        this.post.nomComplet = this.user.firstname + " " + this.user.lastname;
        firebase
          .database()
          .ref("modules/" + this.user.abrv_filiere)
          .once("value", dsnap => {
            this.modules = Object.values(dsnap.val());
          });
      });
  },
  computed: {},
  watch: {
    finished() {
      let post = this.post;
      this.finished =
        post.nom.length > 0 && post.module.length > 0 && post.link.length > 0;
    }
  },
  filters: {
    readmore_filt: function(text, length, suffix) {
      return text.toString().substring(0, length) + suffix;
    }
  }
};
</script>

<style scoped></style>
