<template>
  <div>
    <v-list
      class="minimized elevation-24 round"
      v-if="sandwich"
      v-on-clickaway="hideMenu"
    >
      <v-list-tile
        @click="$emit('toggleProfile'); hideMenu()"
        v-if="checkIsLoggedIn"
        class="pb-1 white"
      >
        <v-btn
          flat
          fab
          class="avatar-button mx-auto my-0 pt-0"
        >
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
        </v-btn>
      </v-list-tile>

      <!-- notification starts -->
      <v-list-tile
        tag="v-btn"
        flat
        style="background-color:white"
        @click="
          $store.commit('setNotiFeeds', true);
          hideMenu();
        "
        v-if="checkIsLoggedIn"
      >
        <v-badge
          color="#c6192a"
          width="100%"
          overlap
          v-model="tem"
        >
          <template v-slot:badge>
            <span style="font-size: 70%; font-weight: bold">{{ feedNum }}</span>
          </template>
          <v-icon size="28">
            notifications
          </v-icon>
        </v-badge>
      </v-list-tile>
      <!-- notification ends -->

      <v-list-tile
        class="black-blue"
        dark
        v-if="checkIsLoggedIn"
        @click="$emit('rolePath')"
        @mouseenter="tip = true"
        @mouseleave="tip = false"
      >
        <v-layout
          row
          wrap
          justify-center
          class="white--text"
        >
          <v-icon
            color="white"
            class="mr-0"
          >
            dashboard
          </v-icon>
          <span v-if="tip">
            DASHBOARD
          </span>
        </v-layout>
      </v-list-tile>
      <v-list-tile
        tag="v-btn"
        style="background-color:white"
        v-for="item in getNavigation.publicNav"
        :key="item.icon"
        :to="item.link"
      >
        <span class="mx-auto">{{ item.title }}</span>
      </v-list-tile>

      <v-list-tile
        @click="toggleSU"
        class="sign-up "
        v-if="!checkIsLoggedIn"
      >
        <span class="mx-auto">SIGN IN</span>
      </v-list-tile>
    </v-list>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import { directive as onClickaway } from "vue-clickaway";
import colors from "@/assets/colors/colors.js";
export default {
    directives: {
    onClickaway: onClickaway
  },
  props: ["sandwich"],
  data() {
    return {
        tip: false,
        feedNum: 0,
        tem: false,
    };
  },
  methods: {
    ...mapActions(["toggleSU"]),
    hideMenu(){this.$emit('hideMenu')},
  },
  computed: {
       colorize() {
      return colors[Math.floor(Math.random() * 280)];
    },
    ...mapGetters(["checkIsLoggedIn", "getNavigation", "auth", "feeds","haveNotRead"]),
    initialize() {
      return this.auth()
        .currentUser.displayName.split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase();
    }
  },
  async mounted(){
    if(this.checkIsLoggedIn){
      this.$store.commit("setCUEmail", this.auth().currentUser.email);
       await this.$store.dispatch('fetchFeeds');
     this.feedNum = await this.haveNotRead.num.length;
      this.tem = await this.haveNotRead.read.haveNotRead;
      if(this.feedNum== 0){
        this.tem = false
      }

    }
   
  },
 async created(){
      this.$root.$on('removeBadget', ()=>{
       this.tem = false;
     })
  }
};
</script>
