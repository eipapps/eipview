<template>
  <div
    id="app"
    data-app
  >
    <NavBar />
    <router-view />
    <Footer />

    <!-- GLOBAL COMPONENTS START -->
    <feeds />
    <IM />
    <connectionStatusAlert />
    <Sugerencias v-if="checkIsLoggedIn" />
    <!-- GLOBAL COMPONENTS END -->
  </div>
</template>

<script>
import "vuetify/dist/vuetify.min.css";
import { mapGetters } from "vuex";
import NavBar from "@/components/navigationBar/navBar.vue";
import Footer from "@/components/footer.vue";
import connectionStatusAlert from "@/components/connectionStatusAlert.vue";
import Sugerencias from "@/views/services/sugerencias.vue";
import IM from "@/components/utilities/IM.vue";
import feeds from "@/components/feeds.vue";
export default {
  name: "MainApp",
  components: {
    NavBar,
    Footer,
    connectionStatusAlert,
    Sugerencias,
    IM,
    feeds,
  },
  computed: mapGetters(["checkIsLoggedIn"]),

};
</script>

<style>
[v-cloak] {
  display: none !important;
}

@import "https://cdn.jsdelivr.net/npm/animate.css@3.5.1";
@import url("https://fonts.googleapis.com/css?family=Karla&display=swap");
@import url("https://fonts.googleapis.com/css?family=Oswald&display=swap");

html,
body {
  font-family: "Karla", sans-serif;
}
#app {
  font-family: "Karla", sans-serif;
}
.v-card-title {
  font-family: "Oswald", sans-serif;
}

@media screen and (max-width: 960px) {
  .font-95 {
    font-size: 95% !important;
  }
}
@media screen and (max-width: 700px) {
  .font-95 {
    font-size: 95% !important;
  }
  .dashboard-component {
    max-width: 360px !important;
  }
}

a {
  text-decoration: none;
}
</style>
