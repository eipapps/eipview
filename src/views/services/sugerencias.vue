<template>
  <div>
    <!-- ######### dialog ################ -->
    <v-btn
      round
      bottom
      right
      class="sign-up elevation-24"
      dark
      fixed
      
      @click="dialog = !dialog"
    >
      <v-icon class="mx-auto">
        feedback
      </v-icon>
      Sugerencias
    </v-btn>
    <v-dialog
      persistent
      v-model="dialog"
      width="800px"
    >
      <v-card class="round grey lighten-4 elevation-9">
        <v-layout
          row
          wrap
          justify-center
        >
          <v-card-title class="font-weight-light title  text-xs-center main-title mt-2">
            enviar sugerencias
          </v-card-title>
        </v-layout>
        <v-container
          grid-list-sm
          class="pa-4"
        >
          <v-layout
            row
            wrap
          >
            <v-flex
              xs12
              align-center
              justify-space-between
            >
              <v-layout align-center>
                <v-avatar
                  size="40px"
                  class="mr-3"
                >
                  <img
                    :src="this.auth().currentUser.photoURL"
                    alt
                  >
                </v-avatar>
                <v-text-field
                  placeholder="Name"
                  :value="this.auth().currentUser.displayName"
                  disabled
                />
              </v-layout>
            </v-flex>

            <v-flex xs6>
              <v-text-field
                prepend-icon="mail"
                placeholder="Email"
                :value="this.auth().currentUser.email"
                disabled
              />
            </v-flex>
            <v-flex xs6>
              <v-text-field
                prepend-icon="event"
                placeholder="Fecha"
                :value="now"
                disabled
              />
            </v-flex>
            <v-flex xs12>
              <v-text-field
                prepend-icon="notes"
                placeholder="Escriba su sugerencia para este sitio web."
                v-model="sugerenciasBody"
              />
            </v-flex>
            <!-- ================================== -->
            <v-layout
              justify-center
              wrap
              row
            >
              <!-- snackbar to notify completion starts -->
              <v-snackbar
                class="error"
                v-model="snackbar"
                color
                multi-line
                :timeout="6000"
                top="top"
              >
                "Su sugerencia ha sido enviada correctamente. Muchas gracias"
                <v-btn
                  dark
                  text
                  @click="snackbar = false"
                >
                  Close
                </v-btn>
              </v-snackbar>
              <!-- snackbar to notify completion ends -->

              <v-progress-circular
                :rotate="-90"
                :size="100"
                :width="15"
                v-model="progress"
                reactive
                v-if="progress > 0"
                color="#376092"
              >
                <strong>{{ Math.ceil(progress) }}%</strong>
              </v-progress-circular>
            </v-layout>
            <!-- ================================== -->
            <v-flex xs12>
              <v-layout
                row
                wrap
              >
                <v-btn
                  round
                  class="ma-3"
                  color="sign-up"
                  @click="$refs.inputUpload.click()"
                >
                  <v-icon small>
                    photo
                  </v-icon>Screenshot (foto del
                  inconveniente)
                </v-btn>
                <input
                  v-show="false"
                  ref="inputUpload"
                  type="file"
                  @change="showPath"
                  id="file"
                  accept="image/x-png, image/gif, image/jpeg"
                >
                <v-card
                  class="ma-auto"
                  flat
                  v-model="path"
                >
                  {{ path }}
                </v-card>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <v-spacer />
          <v-btn
            flat
            round
            class="sign-up"
            @click="reset"
          >
            cancelar
          </v-btn>
          <v-btn
            round
            flat
            @click="upload"
            class="sign-in"
            :loading="loading"
          >
            Enviar
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

import {format} from "date-fns"
import { directive as onClickaway } from "vue-clickaway";
export default {

  directives: {
    onClickaway: onClickaway
  },
  data: () => {
    return {
      path: "",
      sugerenciasBody: "",
      dialog: false,
      loading: false,
      alert: true,
      announcement: true,
      snackbar: false,
      url: "",
      initials: "",
      progress: 0,
      timeOut: {},
      now: format(new Date(), "LLL")
    };
  },
  methods: {
    reset() {
      this.dialog = false;
      this.loading = false;
      this.progress = 0;
      this.path = "";
      this.sugerenciasBody = "";
    },
    showPath() {
      this.path = document.getElementById("file").value;
    },
    ...mapActions(["postSugerencia"]),
    async upload(e) {
      if (this.path == "") {
        this.collector(this.path);
      } else {
        try {
          this.loading = true;
          // Create a root reference
          const reference = await `${this.auth().currentUser.uid}/sugerencias/${
            this.auth().currentUser.displayName
          }`;
          const ref = await this.storage().ref(reference);
          // upload the photo
          await ref
            .put(document.getElementById("file").files[0])
            .on("state_changed", async snapshot => {
              //  make the progress element increment as data goes up
              this.progress =
                (await (snapshot.bytesTransferred / snapshot.totalBytes)) * 100;
              //  display snackbar when upload is done
              if (Math.ceil(this.progress) > 99) {
                await this.storage()
                  .ref(reference)
                  .getDownloadURL()
                  .then(url => {
                    this.collector(url);
                  })
                  .catch(err => {
                    throw new Error(`there was an Error ${err}`);
                  });
              }
            });
        } catch (error) {
          console.log(error);
        }
      }
    },
    async collector(url) {
      if(url=="") this.loading = true;
      try {
        await this.$store
          .commit("setSugerencia", {
            user: this.auth().currentUser.displayName,
            email: this.auth().currentUser.email,
            date: this.now,
            message: this.sugerenciasBody,
            photo: url
          })
  
            this.postSugerencia()
          .then(() => {
            this.snackbar = true;
            this.loading = false;
          })
        .then(() => {
          this.timeOut = setTimeout(this.reset, 6000);
        }).catch(() => {
          throw new Error(`there was an Error ${err}`);
        });
      } catch (error) {
        console.log(error);
      }
    }
  },
  beforeDestroy() {
    clearInterval(this.timeOut);
  },
  computed: {
    ...mapGetters(["auth", "storage"])
  }
};
</script>
