<template>
  <v-content class="my-2">
    <v-container class="mb-5 pb-5">
      <v-layout
        row
        wrap
        class="mx-1 px-3"
        justify-center
      >
        <v-card-title
          primary-title
          class="display-1 font-weight-light main-title"
        >
          Uno de los nuestros
        </v-card-title>
      </v-layout>
      <v-layout
        column
        wrap
        justify-center
      >
        <v-btn
          outline
          block
          @click="goBack"
          round
          color="black"
          class="mt-2"
        >
          Volver atrás
        </v-btn>

        <v-card
          class=" pr-4 py-4 pl-2 mb-5 grey darken-4 round font-95"
          dark
        >
          <v-layout
            row
            wrap
            align-center
            justify-start
            class="mx-4"
          >
            <v-avatar
              v-if="member.photoURL"
              size="70"
            >
              <v-img
                :src="member.photoURL"
                :lazy-src="member.photoURL"
              />
            </v-avatar>
            <v-avatar
              v-else
              class="display-1 white--text"
              color="blue"
              size="70"
            >
              <div v-if="member.firstName">
                {{
                  member.firstName
                    .split(" ")
                    .map(n => n[0])
                    .join("")
                    .toUpperCase()
                }}
              </div>
            </v-avatar>
            <v-btn
              color="green"
              small
              @click="$root.$emit('openIM', member); 
              "
            >
              Enviar mensaje
            </v-btn>
          </v-layout>
          <v-layout
            column
            wrap
            justify-space-around
          >
            <div class="py-1">
              <span
                class="ml-4 title text-uppercase main-title font-95"
              >Nombre:</span>
              <span
                class="mx-2 text-uppercase"
              >{{ member.firstName }} {{ member.lastName }}</span>
            </div>
            <div class="py-1">
              <span
                class="ml-4 title text-uppercase main-title font-95"
              >Centro:</span>
              <span class="mx-2 text-uppercase">{{ member.center }}</span>
            </div>
            <div class="py-1">
              <span
                class="ml-4 title text-uppercase main-title font-95"
              >Provincia:</span>
              <span class="mx-2 text-uppercase">{{ member.province }}</span>
            </div>
            <div class="py-1">
              <span
                class="ml-4 title text-uppercase main-title font-95"
              >Region:</span>
              <span class="mx-2 text-uppercase">{{ member.region }}</span>
            </div>
            <div class="py-1">
              <span
                class="ml-4 title text-uppercase main-title font-95"
              >Edad:</span>
              <span class="mx-2 text-uppercase">{{ calculateAge() }}</span>
            </div>
            <div class="py-1">
              <span
                class="ml-4 title text-uppercase main-title font-95"
              >Desde:</span>
              <span class="mx-2 text-uppercase">{{ fromNow() }}</span>
            </div>
          </v-layout>
        </v-card>
      </v-layout>
    </v-container>
  </v-content>
</template>
<script>
import { mapActions } from "vuex";

import socket from "socket.io-client";
import { dateFromNow } from '../session/utils';

export default {
  data() { 
    return {
      member: {},
      io: socket.connect("https://eip-server.herokuapp.com/")
    };
  },
  methods: {
    ...mapActions(["getMember"]),
    fromNow() {
      return dateFromNow(this.member.created_date)
    },
    calculateAge() {
      let ageDifMs = Date.now() - Date.parse(this.member.birthday);
      let ageDate = new Date(ageDifMs);
      return Math.abs(ageDate.getUTCFullYear() - 1970);
    },
    goBack() {
      this.$router.go(-1);
    },
  },
  async created() {
    this.member = await this.getMember(this.$route.params.id);
  }
};
</script>
