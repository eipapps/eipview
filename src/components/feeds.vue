<template>
  <v-layout
    row
    v-if="notiFeeds"
    v-on-clickaway="closeNotification"
  >
    <v-flex
      xs12
      sm6
      offset-sm3
    >
      <v-card
        class="feeds mt-4 round scrollbar"
        lazy
      >
        <v-list
          tw0-line
          class="pt-1 "
        >
          <v-layout
            v-for="(item, index) in items"
            :key="index"
            column
          >
            <v-list-tile
              avatar
              @click="markIt();"
              class="py-1 ma-1"
              :class="(item.haveNotRead)? 'white': doneReading "
            >
              <v-list-tile-avatar v-if="item.avatar">
                <img :src="item.avatar">
              </v-list-tile-avatar>
              <v-list-tile-avatar v-else>
                <v-btn
                  small
                  fab
                  class="sign-up"
                >
                  {{ initialize(item.name) }}
                </v-btn> 
              </v-list-tile-avatar>
              <a
                :href="item.link"
                target="_blank"
                :class="(item.haveNotRead)? 'greyForce': ''"
              >
                <v-list-tile-content>
                  <v-list-tile-title>  {{ item.title }}</v-list-tile-title>
                  <v-list-tile-sub-title
                    v-html="item.body"
                  />
                  <span class="body-2"><span class="black--text">{{ item.name }}</span>  | {{ dateFromNow(item.date) }}</span>
                </v-list-tile-content>
              </a>
            </v-list-tile>
            <v-divider />
          </v-layout>
        </v-list>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { directive as onClickaway } from "vue-clickaway";
import {formatDistanceToNow} from 'date-fns'
import { dateFromNow } from '../views/session/utils';

export default {
  directives: {
    onClickaway: onClickaway
  },
  data() {
    return {
      items: [],
      doneReading: 'blue-grey lighten-3',
      greyForce: ''
    };
  },
  methods: {
        initialize(name) {
      return name.split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase();
    },
    closeNotification() {
      if (this.notiFeeds) this.$store.commit("setNotiFeeds", false);
    },
    markIt(){
      this.doneReading = 'white '
      this.greyForce = 'greyForce'
      this.markAsRead();
      this.$store.commit('setFeeds', []);
      this.$root.$emit('removeBadget');
    },
    dateFromNow: dateFromNow,
    ...mapActions([ "markAsRead", 'fetchFeeds'])
  },
  computed: {
    ...mapGetters(["feeds", "auth", "notiFeeds","haveNotRead" ])
  },
  async created() {

//  this.$root.$on('loggedIn', async ()=>{
   await this.fetchFeeds();
   this.$store.commit("setCUEmail", this.auth().currentUser.email);
    this.items = this.feeds.sort((a, b) =>new Date(b.date) - new Date(a.date));
     this.closeNotification();

    //  })
 
 }
};
</script>
}
<style>
.greyForce{
  color: rgb(204, 197, 197) !important;

  text-decoration: none !important;

}
.feeds {
  width: 400px;
  height: 400px;
  z-index: 2;
  position: fixed;
   overflow-y:scroll;
   overflow-x:hidden;
  text-overflow: clip;
  top: 26px;
  right: 2px;
  text-align: center;
  animation-duration: 0.1s;
  animation-name: slideInDown;
  animation-timing-function: ease-in-out;
  display: block;
}
/* change the scrollbar */
body::-webkit-scrollbar {
  width: 0.8em;
}
 
body::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
 
body::-webkit-scrollbar-thumb {
  background-color: #376092;
  border-radius: 25px;
}
.scrollbar::-webkit-scrollbar {
  width: 0.7em;
}
 
.scrollbar::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
.scrollbar::-webkit-scrollbar-thumb {
  background-color: #376092;
border-radius: 25px;
}
</style>
