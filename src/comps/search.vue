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
            v-model="search.nom"
            counter="70"
          ></v-text-field>

          <v-select
            v-model="search.module"
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
              :color="c.toLowerCase() === search.type ? 'blue' : 'light'"
              @click="
                search.type.length == 0
                  ? (search.type = c.toLowerCase())
                  : (search.type = '');
              "
              >{{ c }}</v-chip
            >
          </v-flex>
          <v-flex xs12>
            <span class="caption gray--text">Pour les :</span> <br />
            <v-chip
              flat
              v-for="(c, i) in all_annee"
              :key="i"
              :disabled="loaded"
              :color="c.split(' ')[0] === search.annee ? 'blue' : 'light'"
              @click="
                search.annee.length == 0
                  ? (search.annee = c.split(' ')[0])
                  : (search.annee = '');
              "
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
export default {
  data() {
    return {
      all_chips: ["Exercice", "Cours", "Examen", "Rapport"],
      all_annee: ["1er Année", "2eme Année"],
      fileName: "",
      file: "",
      modules: [],
      user: {},
      state_btn: "Voir # les résults",
      error_loged: {
        state: false
      },
      search: {
        nom: "",
        annee: "1er Année",
        type: "Exercice"
      },
      loaded: false,
      finish_progress: 0
    };
  },

  methods: {
    search_fy(e) {}
  },
  created() {},
  mounted() {},
  computed: {},
  watch: {},
  filters: {
    readmore_filt: function(text, length, suffix) {
      return text.toString().substring(0, length) + suffix;
    }
  }
};
</script>

<style scoped></style>
