<template>
  <div>
    <v-layout
      justify-center
      row
      wrap
      primary-title
      class="display-1 font-weight-light  text-xs-center main-title mt-5 pt-5 mx-4 px-1 "
    >
      Calendario {{ getYear() }}
    </v-layout> 
    <!-- alternative circular loading starts -->
    <v-layout
      row
      wrap
      justify-center
      v-if="stillLoading"
      class="ma-5 pa-5"
    >
      <loading />
    </v-layout>
    <!-- alternative circular loading endsd -->
    <v-container
      v-else
      fluid
      grid-list-md
      class="py-5"
    >
      <v-layout
        wrap
        class="mx-3 px-4"
        justify-center
      >
        <v-card
          v-for="item in displayedDossier"
          :key="item.name"
       
          class="ma-2  elevation-20 round justify-center  elevation-24 grids  hovering"
        >
          <v-card-title
            primary-title
            class="title  font-weight-bold py-2 my-0"
          >
            {{ item.name.split('.')[0] }}
          </v-card-title>
          <v-card-text class="my-0 py-0">
            <br>
            <span class="font-weight-bold">Type:</span>
            {{ item.name.split('.')[1] }}
            <br>
            <span class="font-weight-bold">Size:</span>
            {{ item.size }}
            <br>
            <span class="font-weight-bold">Last Updated:</span>
            {{ ago(item["date"]) }}
            <br>
            <span class="font-weight-bold">Posted by:</span>
            {{ item.Owner }}
            <v-layout
              row
              wrap
              justify-center
            >
              <img
                :src="frame(item.id)"
                :lazy-src="frame(item.id)"
                :alt="item.name"
                
                class="round"
              >
            </v-layout>
          </v-card-text>
          <v-card-actions class="mx-5">
            <a
              :href="item.Link"
              target="blank"
            >
              <v-icon color="#c6192a">open_in_new</v-icon>
              <span class="white--text">View online</span>
            </a>
            <v-spacer />
            <a :href="item.download">
              
              <span class="white--text">download</span>
              <v-icon color="#c6192a">get_app</v-icon>
            </a>
          </v-card-actions>
        </v-card>
      </v-layout>
      <v-layout
        align-center
        class="mb-5 pb-5 mx-auto px-auto"
      />
    </v-container>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import loading from "@/components/loading.vue";
import { dateFromNow } from '../session/utils';

export default {
  components: { loading },
  data: () => ({
    stillLoading: true,
    page: 1,
    perPage: 9,
    pages: [],
    lPs: [],

    searchTerms: "",
    filterDir: "asc",
    search: ""
  }),
  computed: {


    displayedDossier() {
      return this.paginate(this.lPs);
    }
  },
  methods: {
    frame(url) {
      return `https://drive.google.com/thumbnail?authuser=0&sz=w280&id=${url}`;
    },
    ...mapActions(["fetchCalendars"]),
    setReady() {
      this.stillLoading = false;
    },
    getYear(){
      return new Date().getFullYear();
    },
    ago(time) {
      return dateFromNow(time);
    },
    // set the number of pages based on the result of the calculation
    setPages() {
      let numberOfPages = Math.ceil(this.lPs.length / this.perPage);
      for (let index = 1; index <= numberOfPages; index++) {
        this.pages.push(index);
      }
    },
    // calculate based on the lesson Plans and return
    // a copy with the narrowed search
    paginate(lPs) {
      //  searching
      if (this.searchTerms) {
        return this.lPs.filter(
          function(item) {
            return (
              item.name.toLowerCase().match(this.searchTerms.toLowerCase()) 
            );
          }.bind(this)
        );
      }
      // pagination
      const page = this.page;
      const perPage = this.perPage;
      let from = page * perPage - perPage;
      let to = page * perPage;
      return lPs.slice(from, to);
    }
  },
  watch: {
    // check if the state of lPs changes to trigger function
    lPs() {
      this.setPages();
      this.setReady();
    }
  },

  async created() {
   this.lPs =   await this.fetchCalendars();
    // set the value of local lPs
   
    
  }
};
</script>
<style  scoped>
.gradient {
  background: linear-gradient(to right, #ad5389, #3c1053);
}
</style>