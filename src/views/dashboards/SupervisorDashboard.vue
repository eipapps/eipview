<template>
  <v-layout
    class="my-5 px-2 py-4 grey lighten-2"
    wrap
  >
    <v-layout
      class="mx-2 px-1 justify-center"
      flat
      wrap
    >
      <!-- send notification starts -->
      <v-card
        class="justify-center mx-1 elevation-24 grids grey lighten-4 dashboard-component"
        raised
        max-height="350px"
        max-width="400px"
      >
        <v-card-title
          primary-title
          class="justify-center orangish py-1 white--text"
        >
          <v-icon
            color="white"
            class="mr-2"
          >
            alarm
          </v-icon>Publicar notificación para coordinadores y maestros
        </v-card-title>
        <v-card-text>
          <SendNotification />
        </v-card-text>
      </v-card>
      <!-- send notification ends -->

      <!--******** solicitudes starts ********-->
      <solicitudesScreen :all-solicitudes="allSolicitudes" />
      <!--******** solicitudes ends ********-->

      <!-- intructions end -->

      <!--******** services starts ********-->
      <servicesScreen :services-for-supervisor="servicesForSupervisor" />
      <!--******** services ends ********-->

      <v-layout
        row
        wrap
        justify-space-around
        align-end
        class="mx-2"
      >
        <!--  TASKS STARTS -->
        <Tasks />
      <!--  TASKS ENDS -->
      </v-layout><v-layout
        row
        wrap
        justify-space-around
        class="mx-5 px-2 mb-5 pb-5"
        align-center
      >
        <!-- centers starts -->
        <v-card
          class="justify-center mx-1 elevation-24 grids mt-4 "
          raised
          max-height="345px"
          max-width="240px"
          min-width="240px"
        >
          <v-card-title
            primary-title
            class="justify-center centers darken-4 elevation-12 py-1 white--text"
          >
            <v-icon
              color="white"
              class="mr-2 white--text"
            >
              location_city
            </v-icon>Mis centros
          </v-card-title>

          <v-card
            flat
            max-height="340px"
            class="mb-2 grey lighten-4 scrollbar"
            style="overflow:auto;"
          >
            <v-layout
              column
              v-for="(item, index) in centers"
              :key="item.uuid"
            >
              <v-card
                flat
                class="text-truncate grey lighten-4"
                style="max-width:190px"
              >
                <router-link
                  tag="v-btn"
                  class="px-2 py-0 ma-0 caption"
                  flat
                  :to="'/center/'+ item.uuid"
                >
                  {{ index+1 }} - {{ item.centro }}
                </router-link>
              </v-card>
            </v-layout>
          </v-card>
        </v-card>
        <!-- centers ends -->
        <v-card
          flat
          width="700px "
          class="grey lighten-2 dashboard-component"
        >
          <memberCarousel class="mb-5" />
        </v-card>
        <aside>
          <v-layout
            row
            justify-start
          />
        </aside>
      </v-layout>
    </v-layout>
  </v-layout>
  <!-- </div> -->
</template>

<script>

import { mapGetters, mapActions } from "vuex";
import { directive as onClickaway } from "vue-clickaway";
import SendNotification from "@/components/utilities/SendNotification.vue";
import memberCarousel from "@/components/utilities/memberCarousel.vue";
import servicesScreen from "@/components/utilities/servicesScreen.vue";
import solicitudesScreen from "@/components/utilities/solicitudesScreen.vue";
import Tasks from "@/components/utilities/tasks.vue";
import _ from "lodash";
export default {
  name: "SupervisorDashboard",
  components: {
    SendNotification,
    servicesScreen,
    solicitudesScreen,
    memberCarousel,
    Tasks
  },
  directives: {
    onClickaway: onClickaway
  },
  data() {
    return {
      date: new Date().toISOString().substr(0, 10),
      servicesForSupervisor: true,
      centers: [],
      allSolicitudes: true
    };
  },
  methods: {
    ...mapActions(["fetchCenters"])
  },
  computed: {
    ...mapGetters([
      "auth",
      "checkIsLoggedIn",
      "getSupervisorSideMenu",
      "superCenters"
    ])
  },
  async created() {
    await this.fetchCenters();
    this.centers = await _.uniqBy(this.superCenters, "centro");
  }
};
</script>
<style>
.scrollbar::-webkit-scrollbar {
  width: 0.7em;
}

.scrollbar::-webkit-scrollbar-track {
  box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
}
.scrollbar::-webkit-scrollbar-thumb {
  background-color: #717981;
  border-radius: 25px;
}
.centers {
  background: linear-gradient(
    0deg,
    rgba(2, 2, 32, 1) 33%,
    rgba(88, 17, 254, 1) 100%
  );
}

.orangish {
  background: linear-gradient(
    0deg,
    rgba(5, 69, 70, 1) 34%,
    rgba(13, 218, 57, 0.815) 100%
  ) !important;
}
.grids {
  border-radius: 5px !important;
}
.wrapper-div {
  border-radius: 5px !important;
}
.main-card {
  border-radius: 5px !important;
}
@media screen and (max-width: 960px) {
  .grids {
    margin-top: 5% !important;
  }
  .wrapper {
    margin: 0% !important;
    min-width: 520px !important;
    margin-top: 5% !important;
  }
  .wrapper-div {
    padding: 0% !important;
    margin-top: 5% !important;
  }
}
@import url("https://fonts.googleapis.com/css?family=Lexend+Exa|Oswald&display=swap");
.title {
  font-family: "Oswald", sans-serif !important;
  font-weight: lighter !important;
}
</style>
