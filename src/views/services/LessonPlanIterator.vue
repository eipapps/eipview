<template>
  <div class="grey lighten-5">
    <v-layout
      justify-center
      row
      wrap
      primary-title
      class="display-1 font-weight-light text-xs-center main-title mt-5 pt-5 mx-4 px-1 grey lighten-5"
    >
      Lesson Plans
    </v-layout>
    <!-- LOADING STARTS -->
    <v-layout
      row
      wrap
      justify-center
      v-if="stillLoading"
      class="ma-5 pa-5 grey lighten-5"
    >
      <loading />
    </v-layout>
    <!-- LOADING ENDS -->

    <v-container
      v-else
      fluid
      grid-list-md
      class="py-5"
    >
      <!-- SEARCH STARTS -->
      <v-layout
        wrap
        class="mx-5 px-5 round"
        justify-center
        color=" lighten-5 "
      >
        <v-text-field
          class="mx-4 mt-3"
          label="Buscar Planes de clase"
          single-line
          prepend-icon="search"
          color="#c6192a"
          clearable
          v-model="searchTerms"
        />
      </v-layout>
      <!-- SEARCH ENDS -->

      <!-- SELECTS STARTS -->
      <v-layout
        row
        wrap
        align-center
        justify-center
        class="mx-5 grey lighten-5"
      >
        <v-select
          class="px-auto mx-5 grey lighten-5 round"
          :items="series"
          label="Selecciona serie de libro"
          color="#c6192a"
          prepend-icon="book"
          clearable
          flat
          v-model="dropdownSeries"
        />
        <v-select
          class="px-auto mx-5 grey lighten-5"
          :items="level"
          label="Selecciona el nivel"
          color="#c6192a"
          prepend-icon="trending_up"
          flat
          clearable
          v-model="dropdownLevel"
        />
        <v-text-field
          class="px-auto mx-5 grey lighten-5"
          type="number"
          min="1"
          max="16"
          label="Selecciona la unidad"
          prepend-icon="format_list_numbered_rtl"
          color="#c6192a"
          flat
          clearable
          v-model="dropdownUnit"
        />
      </v-layout>
      <!-- SELECTS ENDS -->
      <!-- NUMBER AND SORT STARTS -->
      <v-layout
        wrap
        class="mx-3 px-4"
        justify-center
        align-center
        v-if="searchTerms || dropdownLevel || dropdownSeries || dropdownUnit"
      >
        <span>{{ displayedLessonPlans.length }} archivos</span>
        <div>
          <v-btn
            class="my-0"
            small
            fab
            flat
            @click="filterDir = 'asc'"
          >
            <v-icon size="30">
              arrow_downward
            </v-icon>
          </v-btn>
          <v-btn
            class="my-0"
            small
            flat
            fab
            @click="filterDir = 'desc'"
          >
            <v-icon size="30">
              arrow_upward
            </v-icon>
          </v-btn>
        </div>
      </v-layout>
      <!-- NUMBER AND SORT ENDS -->
      <!-- LESSON PLANS STARTS -->
      <v-layout
        wrap
        class="mx-3 px-4"
        justify-center
        v-if="displayedLessonPlans.length > 0"
      >
        <v-card
          v-for="item in displayedLessonPlans"
          :key="item.download"
          max-width="350px"
          min-width="350px"
          class="my-2 mx-auto elevation-10 round justify-center mx-1 elevation-24 grids mt-2 grey lighten-3 slide hovered"
          :class="is2020(item.last_update) ? 'turnwhite' : 'grey--text'"
        >
          <v-card-title
            class="py-1"
            :class="
              is2020(item.last_update)
                ? 'subtitle-1 deep font-weight-bold white--text'
                : 'subtitle-1 blue-cards font-weight-bold white--text'
            "
          >
            <v-icon
              color="orange"
              medium
              v-if="is2020(item.last_update)"
            >
              fiber_new
            </v-icon>
            <span class="mx-3">{{ item.file_name.split(".")[0] }}</span>
          </v-card-title>

          <v-card-text>
            <span class="font-weight-bold">Book Series</span>
            {{ item.book_series }}
            <br>
            <span class="font-weight-bold">Level:</span>
            {{ item.level }}
            <br>
            <span class="font-weight-bold">format:</span>
            {{ item.format }}
            <br>
            <span class="font-weight-bold">size:</span>
            {{ item.size }}
            <br>
            <span class="font-weight-bold">Last Updated:</span>
            {{ ago(item.last_update) }}
            <br>
            <span class="font-weight-bold">Posted by:</span>
            {{ item.created_by }}
          </v-card-text>
          <v-card-actions class="mx-4">
            <a
              :href="item.link"
              target="blank"
            >
              <v-icon color="#c6192a">open_in_new</v-icon>
              <span
                :class="
                  is2020(item.last_update) ? 'black--text ' : 'white--text'
                "
              >View online</span>
            </a>
            <v-spacer />
            <a :href="item.download">
              <span
                :class="
                  is2020(item.last_update) ? 'black--text' : 'white--text'
                "
              >download</span>
              <v-icon color="#c6192a">get_app</v-icon>
            </a>
          </v-card-actions>
        </v-card>
      </v-layout>
      <v-layout
        row
        wrap
        class="mx-3 px-4 slide"
        v-else
      >
        <v-layout
          justify-center
          primary-title
          class="title font-weight-light main-title my-5 py-5 mx-4 px-1 grey lighten-5"
        >
          No hay planes de clase con estas caracteristicas
        </v-layout>
      </v-layout>
      <!-- LESSON PLANS ENDS -->
      <!-- PAGINATION STARTS -->
      <v-layout
        align-center
        class="mb-5 pb-5 mx-auto px-auto"
      >
        <v-pagination
          class="mx-auto px-auto"
          v-model="page"
          :length="pages.length"
          color="#c6192a"
          circle
          v-if="
            !searchTerms && !dropdownLevel && !dropdownSeries && !dropdownUnit
          "
        />
      </v-layout>

      <!-- PAGINATION ENDS -->
    </v-container>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import loading from "@/components/loading.vue";
import { dateFromNow } from '../session/utils';

export default {
  components: { loading },
  data: () => ({
    stillLoading: true,
    newPlan: true,
    page: 1,
    perPage: 10,
    pages: [],
    lPs: [],
    searchTerms: "",
    dropdownSeries: "",
    dropdownLevel: "",
    dropdownUnit: "",
    filterDir: "asc",
    search: "",
    series: ["Interchange", "Double Click", "Passages", "World link"],
    level: [
      "Basic 1",
      "Basic 2",
      "Intermediate 1",
      "Intermediate 2",
      "Advanced 1",
      "others"
    ],
    unit: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16"
    ]
  }),
  computed: {
    ...mapGetters(["getLessonPlans"]),

    displayedLessonPlans() {
      return this.paginate(this.lPs);
    }
  },
  methods: {
    ...mapActions(["fetchLessonPlans"]),
    setReady() {
      this.stillLoading = false;
    },
    ago(time) {
      return dateFromNow(time);
    },
    is2020(time) {
      return new Date(time).getFullYear() == 2020;
    },
    // set the number of pages based on the result of the calculation
    setPages() {
      let numberOfPages = Math.ceil(this.lPs.length / this.perPage);
      for (let index = 1; index <= numberOfPages; index++) {
        this.pages.push(index);
      }
    },
    orderByDate() {
      // asc and desc order
      if (this.filterDir == "desc") {
        return this.lPs.sort(
          (a, b) => new Date(a.last_update) - new Date(b.last_update)
        );
      }
      if (this.filterDir == "asc") {
        return this.lPs.sort(
          (a, b) => new Date(b.last_update) - new Date(a.last_update)
        );
      }
    },
    // calculate based on the lesson Plans and return
    // a copy with the narrowed search
    paginate(lPs) {
      //  dropdowns
      try {
        const unit = this.dropdownUnit.toLowerCase()
          ? `unit ${this.dropdownUnit.toLowerCase()}`
          : "";
        if (this.dropdownSeries || this.dropdownLevel || this.dropdownUnit) {
          return this.lPs
            .filter(item => {
              return (
                item.book_series
                  .toLowerCase()
                  .match(this.dropdownSeries.toLowerCase()) &&
                item.level
                  .toLowerCase()
                  .match(this.dropdownLevel.toLowerCase()) &&
                item.unit.toLowerCase().match(unit.toLowerCase())
              );
            })
            .filter(this.orderByDate);
        }
        // //  searching
        if (this.searchTerms) {
          return this.lPs
            .filter(
              function(item) {
                return (
                  item.book_series
                    .toLowerCase()
                    .match(this.searchTerms.toLowerCase()) ||
                  item.level
                    .toLowerCase()
                    .match(this.searchTerms.toLowerCase()) ||
                  item.file_name
                    .toLowerCase()
                    .match(this.searchTerms.toLowerCase())
                );
              }.bind(this)
            )
            .filter(this.orderByDate);
        }

        // pagination
        const page = this.page;
        const perPage = this.perPage;
        let from = page * perPage - perPage;
        let to = page * perPage;
        return lPs.slice(from, to);
      } catch (error) {
        console.log(error);
      }
    }
  },
  watch: {
    // check if the state of lPs changes to trigger function
    lPs() {
      this.setPages();
      this.setReady();
    },
    searchTerms() {
      this.dropdownSeries = "";
      this.dropdownLevel = "";
      this.dropdownUnit = "";
      this.filterDir= "asc";
    },
    dropdownUnit() {
      if (this.dropdownUnit == undefined) this.dropdownUnit = "";
      this.searchTerms = "";
      this.filterDir= "asc";
    },
    dropdownSeries() {
      if (this.dropdownSeries == undefined) this.dropdownSeries = "";
      this.searchTerms = "";
      this.filterDir= "asc";
    },
    dropdownLevel() {
      if (this.dropdownLevel == undefined) this.dropdownLevel = "";
      this.searchTerms = "";
      this.filterDir= "asc";
    }
  },

  async created() {
    await this.fetchLessonPlans();
    // set the value of local lPs
    this.lPs = this.getLessonPlans;
  }
};
</script>
<style>
.deepy {
  background-image: radial-gradient(
    circle 592px at 48.2% 50%,
    rgba(255, 255, 249, 0.6) 0%,
    rgb(140, 144, 151) 74.6%
  );
}
.turnwhite:hover {
  color: rgba(255, 255, 249, 0.6) 0%;
}
.hovered:hover {
  background: #51647c !important;
}
.deep {
  background: #1488cc; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #2b32b2,
    #1488cc
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #2b32b2,
    #1488cc
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}
</style>
