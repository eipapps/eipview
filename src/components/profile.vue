<template>
  <div>
    <v-card
      class="tile round"
      v-if="checkIsLoggedIn"
    >
      <!-- toolbar with close btn -->
      <v-layout
        row
        wrap
        justify-end
        class="ma-0 pa-0"
      >
        <v-layout
          row
          wrap
          class="ma-auto"
          justify-center
        >
          <span class="teach title">Teach</span>
          <span class="acronym title">EIP</span>
        </v-layout>
        <v-btn
          round
          icon
          @click="$emit('closeProfile')"
          class="ma-0 pa-0"
        >
          <v-icon>close</v-icon>
        </v-btn>
      </v-layout>
      <!-- toolbar with close btn ends -->
      <!-- photo display starts -->
      <v-avatar v-if="auth().currentUser.photoURL">
        <img
          :src="auth().currentUser.photoURL"
          :alt="auth().currentUser.displayName"
        >
      </v-avatar>
      <v-avatar
        :color="colorize"
        v-else
      >
        <span class="white--text headline">{{ initialize }}</span>
      </v-avatar>
      <!-- photo display ends -->
      <v-list-tile-title class="title mx-5 px-1">
        {{ auth().currentUser.displayName }}
      </v-list-tile-title>
      <v-list-tile-sub-title class="email">
        {{ auth().currentUser.email }}
      </v-list-tile-sub-title>
      <!-- editor dialog starts -->
     
      
      <editor
        v-if="!showEditProfile"
        :profile-editor="profileEditor"
        @closeProfileEditor="profileEditor = false"
        class="slideDown"
      />
      <!-- editor dialog ends -->
      <v-layout
        column
        class="justify-center px-3"
      >
        <v-btn
          v-if="!showEditProfile"
          round
          class="grey lighten-1"
          @click="profileEditor = true"
        >
          editar perfil
        </v-btn>
        <v-btn
          round
          tag="v-btn"
          class="sign-up"
          @click="logout"
        >
          cerrar sesión
          <v-icon class="mx-1">
            power_settings_new
          </v-icon>
        </v-btn>
      </v-layout>
    </v-card>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from "vuex";
import editor from "../views/session/ProfileEditorView.vue";
import colors from "@/assets/colors/colors.js";

export default {
  components: { editor },
  props:['showEditProfile'],
  data(){
    return{
      profileEditor: false,
    }
  },
  methods: {
    showAlert(message, icon, classy, interact) {
      this.$store.commit("setAlertType", { icon: icon, class: classy });
      this.runAlert(message);
      this.$store.commit("setInteract", interact);
    },
    async logout() {
      await this.showAlert(
        " Estas seguro que quieres salir de la aplicación?",
        "help_outline",
        "warning orange",
        true
      );
    },
    ...mapActions(["runAlert"]),
    toggleEditProfile() {
      this.$store.commit("setEditProfile", !this.editProfile);
    }
  },
  computed: {
    initialize: function() {
      return this.auth().currentUser.displayName
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase();
    },
    colorize: function() {
      return colors[Math.floor(Math.random() * 280)];
    },
    ...mapGetters(["checkIsLoggedIn", "getUsers", "auth", "getYes"]),
    ...mapState(["editProfile"])
  },
  created: function() {}
};
</script>
<style scoped>
.tile {
  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.281),
    0 12px 30px 0 rgba(0, 0, 0, 0.281);
}
</style>
