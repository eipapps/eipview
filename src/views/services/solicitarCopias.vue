<template>
  <v-layout
    class="mb-5 pb-5 grey lighten-4"
    justify-center
    wrap
    column
  >
    <header>
      <v-layout
        justify-center
        row
        wrap
        primary-title
        class="display-1 font-weight-light text-xs-center main-title mt-5 pt-5 mx-4 px-1"
      >
        Solicitud de copias de examenes
      </v-layout>
    </header>
    <main>
      <v-container
        grid-list-sm
        class="pa-3"
      >
        <v-card class="round mx-2 pa-2 mb-5 pb-5 grey lighten-4 elevation-9">
          <v-layout
            justify-center
            align-center
            class="grey lighten-4"
          >
            <span class="orange--text lighten-3 upper">En funcionamiento</span>
            <v-icon
              background-color="orange lighten-3"
              color="orange"
            >
              fiber_new
            </v-icon>
          </v-layout>
          <v-layout
            row
            wrap
            class="red--text caption"
          >
            Tomar en cuenta: No se puede editar ni borrar una solicitud despues de dos dias de haber sido creada.
          </v-layout>
          <!-- WAITING STARTS -->
          <v-layout
            row
            wrap
            justify-center
            v-if="loading"
            class="slide"
          >
            <waiting />
          </v-layout>
          <!-- WAITING ENDS -->

          <div
            @click="errors = []"
            v-else
            class="slide"
          >
            <v-layout
              row
              wrap
              justify-start
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
                  v-model="request.name"
                />
              </v-layout>
              <v-text-field
                prepend-icon="mail"
                placeholder="Email"
                :value="request.email"
                disabled
              />

              <v-text-field
                prepend-icon="event"
                placeholder="Fecha"
                :value="dateFormater(request.date)"
                disabled
              />
            </v-layout>
            <!-- NUMBER OF STUDENTS STARTS -->
            <v-layout
              column
              wrap
              justify-start
            >
              NUMERO DE ESTUDIANTES
              <v-text-field
                prepend-icon="local_florist"
                placeholder="Numero de estudiantes en la mañana"
                v-model="request.ss_num_morn"
                type="number"
                min="0"
                class="mx-5"
              />
              <v-text-field
                prepend-icon="wb_sunny"
                placeholder="Numero de estudiantes en la tarde"
                v-model="request.ss_num_aft"
                type="number"
                min="0"
                class="mx-5"
              />
              <v-text-field
                prepend-icon="nights_stay"
                placeholder="Numero de estudiantes en la noche"
                v-model="request.ss_num_eve"
                type="number"
                min="0"
                class="mx-5"
              />
            </v-layout>
            <!-- NUMBER OF STUDENTS ENDS -->

            <!-- LEVEL STARTS -->
            <v-layout
              row
              wrap
            >
              <v-select
                class="py-1"
                :items="level"
                :placeholder="request.level"
                v-model="request.level"
                label="NIVEL"
              />
            </v-layout>
            <!-- LEVEL ENDS -->
            <!-- date picker starts -->
            <v-layout
              row
              wrap
            >
              <v-menu
                v-model="menu2"
                :close-on-content-click="false"
                max-width="290"
              >
                <template v-slot:activator="{ on }">
                  <v-layout
                    column
                    wrap
                  >
                    <v-text-field
                      :value="dateFormater(request.test_date)"
                      label="Fecha del examen"
                      readonly
                      v-on="on"
                      @click:clear="request.test_date = null"
                      class="mx-2"
                    />
                  </v-layout>
                </template>
                <v-date-picker
                  v-model="request.test_date"
                  color="#c6192a"
                  @change="menu2 = false"
                />
              </v-menu>
            </v-layout>
            <!-- date picker ends -->
            <!-- information about the center starts -->
            <v-layout
              row
              wrap
            >
              <v-select
                class="py-1"
                :items="regions"
                :placeholder="request.region"
                v-model="request.region"
                label="Region"
                @change="regionSelect"
              />
              <v-select
                class="py-1"
                :items="provinces"
                :placeholder="request.province"
                v-model="request.province"
                label="Provincia"
                @change="provinceSelect"
              />
              <v-select
                class="py-1"
                :items="recintos"
                :placeholder="request.center"
                v-model="request.center"
                label="Recinto"
                @change="extra=(request.center == 'otro')?true:false"
              />
              <v-text-field
                v-if="extra"
                placeholder="Otro centro"
                v-model="request.center"
              />
            </v-layout>

            <!-- information about the center ends -->
          </div>
          <v-card-actions>
            <v-spacer />
            <v-btn
              small
              flat
              round
              class="sign-up"
              @click="reset"
            >
              cancelar
            </v-btn>
            <v-btn
              small
              round
              flat
              @click="editCopy_req"
              class="green font-weight-bold slide"
              :loading="loading"
              v-if="editingMode"
            >
              Editar solicitud
            </v-btn>
            <v-btn
              v-else
              small
              round
              flat
              @click="localPostCopy_req"
              class="sign-in slide"
              :loading="loading"
            >
              Enviar solicitud
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </main>
    <!-- COPY_REQ HISTORY STARTS -->
    <aside>
      <v-layout
        column
        wrap
        class="my-2 mx-4 mb-5"
        justify-center
        align-center
      >
        <v-card-title
          class="title font-weight-light text-xs-center main-title mx-4 px-1"
        >
          Historial de copias de examenes
        </v-card-title>
        <v-layout wrap>
          <v-card
            v-for="item in copy_reqs"
            :key="item.item_id"
            class="ma-2 pa-4 elevation-24 grey lighten-2 slide"
          >
            <v-layout column>
              <v-layout
                row
                wrap
                justify-end
              >
                <v-btn
                  flat
                  small
                  fab
                  @click="setEditingMode(item)"
                >
                  <v-icon color="green">
                    edit
                  </v-icon>
                </v-btn>
                <v-btn
                  class="slide"
                  flat
                  small
                  fab
                  @click="setDeleteMode(item)"
                  v-if="!deleteMode"
                >
                  <v-icon color="red">
                    delete
                  </v-icon>
                </v-btn>
                <v-layout
                  row
                  wrap
                  v-if="deleteMode && currentCopy_req == item.item_id"
                >
                  Esta seguro que quieres borrar la informacion?
                  <v-btn
                    small
                    fab
                    class="slide sign-in"
                    @click="deleteMode = false;"
                  >
                    no
                  </v-btn>
                  <v-btn
                    small
                    fab
                    class="slide sign-up"
                    @click="deleteData(item)"
                    :loading="item.item_id == currentCopy_req && si"
                  >
                    si
                  </v-btn>
                </v-layout>
              </v-layout>
         
              <span class="my-1">
                Nombre del solicitante:
                <span class="font-weight-bold">{{ item.name }}</span>
              </span>
              <span class="my-1">
                Nivel:
                <span class="font-weight-bold">{{ item.level }}</span>
              </span>
              <span class="my-1">
                Fecha del examen:
                <span class="font-weight-bold">{{ dateFormater(item.test_date) }}</span>
              </span>
        
              <span class="my-1">
                Numero en tanda matutina:
                <span class="font-weight-bold">{{ item.ss_num_morn }}</span>
              </span>
              <span class="my-1">
                Numero en tanda vepertina:
                <span class="font-weight-bold">{{ item.ss_num_aft }}</span>
              </span>
              <span class="my-1">
                Numero en tanda nocturna:
                <span class="font-weight-bold">{{ item.ss_num_eve }}</span>
              </span>
              <span class="my-1">
                Centro:
                <span class="font-weight-bold">{{ item.center }}</span>
              </span>
              <span class="my-1">
                Provincia:
                <span class="font-weight-bold">{{ item.province }}</span>
              </span>
              <span class="my-1">
                Region:
                <span class="font-weight-bold">{{ item.region }}</span>
              </span>
         

              <span class="my-1">
                Dia que fue solicitado:
                <span class="font-weight-bold">{{ dateFormater(item.date) }}</span>
              </span>
            </v-layout>
          </v-card>
        </v-layout>
      </v-layout>
    </aside>
    <!-- COPY_REQ HISTORY ENDS -->
    <figure>
      <!--  ERROR ALERT STARTS -->
      <v-alert
        outline
        rounded
        class="round slideRight stayPut mx-4"
        color="#c6192a"
        type="error"
        v-if="errors.length"
        v-model="alert"
      >
        No fue posible seguir por las siguientes razones:
        <ul>
          <li
            v-for="(error, i) in errors"
            :key="i"
          >
            {{ error }}
          </li>
        </ul>
      </v-alert>
      <!--  ERROR ALERT ENDS -->
    </figure>
    <figure>
      <!-- snackbar to notify completion starts -->
      <v-layout
        justify-center
        wrap
        row
      >
        <v-snackbar
          class="error"
          v-model="snackbar"
          color
          multi-line
          :timeout="6000"
          top="top"
        >
          {{ snackbarMessage }}
          <v-btn
            small
            dark
            text
            @click="snackbar = false"
          >
            Close
          </v-btn>
        </v-snackbar>
      </v-layout>
      <!-- snackbar to notify completion ends -->
    </figure>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import axios from "axios";
import waiting from "@/components/loading.vue";
import { dateFormater } from '../session/utils';
export default {
  name: "SolicitarPermiso",
  components: { waiting },
  data: () => {
    return {
      path: "",
      dialog: false,
      loading: false,
      snackbar: false,
      snackbarMessage: "",
      timeOut: {},
      errors: [],
      request: {},
      alert: true,
      date: null,
      menu2: false,
      menu1: false,
      copy_reqs: [],
      editingMode: false,
      deleteMode: false,
      si: false,
      currentCopy_req: "",
      regions: ["Norte", "Sur", "Este", "Santo Domingo"],
       level: [ "Basic 1", "Basic 2","Intermediate 1","Intermediate 2","Advanced 1"],
      centers: [],
      provinces: [],
      recintos: [],
      extra: false,
    };
  },
  methods: {
    localPostCopy_req() {
      if (this.validate()) {
        try {
          this.createCopy_reqs()
            .then(res => {
              this.snackbarMessage = res.data.message;
              this.snackbar = true;
              this.loading = false;
              return res;
            })
            .then(async res => {
              if (res.data.status == 200) {
               await this.getCopy_reqs();
                window.scrollTo(0, 1000);
                this.timeOut = setTimeout(this.reset, 6000);
              }
            })
            .catch(err => {
              throw new Error(`there was an Error ${err}`);
            });
          
        } catch (error) {
          console.log(error);
        }
      }
    },
    editCopy_req() {
      if (this.validate()) {
        try {
          this.requestEdit()
            .then(async res => {
              this.snackbarMessage = await res.data.message;
              this.snackbar = true;
              this.loading = false;
              return res;
            })
            .then(async res => {
              if (res.data.status == 200) {
                await this.getCopy_reqs();
                window.scrollTo(0, 1000);
                this.timeOut = setTimeout(this.reset, 6000);
              }
            })
            .catch(err => {
              throw new Error(`there was an Error ${err}`);
            });
        } catch (error) {
          console.log(error);
        }
      }
    },
    deleteData(copy_req) {
      this.currentCopy_req = copy_req.item_id;
      this.si = true;
      window.scrollTo(0, 0);
      try {
        this.deleteCopy_req(copy_req)
          .then(res => {
            this.snackbarMessage = res.data.message;
            this.snackbar = true;
            this.si = false;
            return res;
          })
          .then(async res => {
            if (res.data.status == 200) {
               await this.getCopy_reqs();
              // const index = this.copy_reqs.findIndex(s => s == copy_req);
              // this.copy_reqs.splice(index, 1);
              this.timeOut = setTimeout(this.reset, 6000);
            }
          })
          .catch(err => {
            throw new Error(`there was an Error ${err}`);
          });
      } catch (error) {
        console.log(error);
      }
    },
    validate() {
      let valid = true;
      this.errors = [];
      if (!this.request.name) {
        this.errors.push("Tiene que incluir su nombre completo.");
        valid = false;
      }
      if (!this.request.level) {
        this.errors.push("Favor incluir el nivel.");
        valid = false;
      }
      if (!this.request.region) {
        this.errors.push("Indique la region.");
        valid = false;
      }
      if (!this.request.province) {
        this.errors.push("Indique la provincia.");
        valid = false;
      }
      if (!this.request.center) {
        this.errors.push("Indique el centro.");
        valid = false;
      }
      if (this.extra && this.request.center == 'otro') {
        this.errors.push("Ya que escogio otro centro, por favor escriba el nombre de este.");
        valid = false;
      }
      if ((!this.request.ss_num_morn || this.request.ss_num_morn == 0) 
      && (!this.request.ss_num_aft || this.request.ss_num_aft == 0)  
      && (!this.request.ss_num_eve || this.request.ss_num_eve == 0)) {
        this.errors.push("Tiene que especificar el numero de copias en por lo menos una de las tandas.");
        valid = false;
      }
      if(Math.floor(( new Date - Date.parse(this.request.date) ) / 86400000)>2 && (this.deleteMode || this.editingMode)){
        this.errors.push('No se puede editar ni borrar una solicitud despues de dos dias de haber sido creada.')
        valid = false;
      }
      if (!this.request.test_date) {
        this.errors.push("Favor indicar la fecha del examen");
        valid = false;
      }

      return valid;
    },
    reset() {
      this.loading = false;
      this.editingMode = false;
      this.deleteMode = false;
      this.request = {};

      this.request.name = this.auth().currentUser.displayName;
      this.request.email = this.auth().currentUser.email;
      this.request.uid = this.auth().currentUser.uid;
      this.request.date = new Date();
    },

    /**
     * @CREATE
     * @function createCopy_reqs creates new a new copy_req
     * @returns a promise with the confirmation
     */
    createCopy_reqs() {
      return new Promise(async (resolve, reject) => {
        this.loading = true;
        try {
          this.request.res = await axios.post(
            `https://script.google.com/macros/s/AKfycbwF23KlbpkSaZZBn4M97q545WC6JeUZIkft47SdqDbprxURNxsN/exec?uid=${this.request.uid}&name=${this.request.name}&email=${this.request.email}&region=${this.request.region}&province=${this.request.province}&center=${this.request.center}&level=${this.request.level}&ss_num_morn=${this.request.ss_num_morn}&ss_num_aft=${this.request.ss_num_aft}&ss_num_eve=${this.request.ss_num_eve}&test_date=${this.request.test_date}&post=true
              `
          );
          resolve(this.request.res);
        } catch (error) {
          this.loading = false;
          reject(error);
        }
      });
    },
    /**
     * @UPDATE
     * @function requestEdit send a request to edit a copy_req
     * @returns a promise with the confirmation
     */
    requestEdit() {
      return new Promise(async (resolve, reject) => {
        this.loading = true;
        try {
          this.request.res = await axios.post(
           `https://script.google.com/macros/s/AKfycbwF23KlbpkSaZZBn4M97q545WC6JeUZIkft47SdqDbprxURNxsN/exec?uid=${this.auth().currentUser.uid}&item_id=${this.request.item_id}&name=${this.request.name}&email=${this.request.email}&region=${this.request.region}&province=${this.request.province}&center=${this.request.center}&level=${this.request.level}&ss_num_morn=${this.request.ss_num_morn}&ss_num_aft=${this.request.ss_num_aft}&ss_num_eve=${this.request.ss_num_eve}&test_date=${this.request.test_date}&edit=true
              `
          );
          resolve(this.request.res);
        } catch (error) {
          this.loading = false;
          reject(error);
        }
      });
    },
    /**
     * @READ
     * @function getCopy_reqs send a request to get all copy_reqs
     * @returns an array with all the copy_reqs and sets it to local copy_reqs
     */
    async getCopy_reqs() {
      try {
        this.copy_reqs = await axios.get(
          `https://script.google.com/macros/s/AKfycbwF23KlbpkSaZZBn4M97q545WC6JeUZIkft47SdqDbprxURNxsN/exec?uid=${
            this.auth().currentUser.uid
          }`
        );
        this.copy_reqs = this.copy_reqs.data;
      } catch (error) {}
    },
    /**
     * @DELETE send a request to delete a copy_req
     * @param copy_req an object of type copy_req
     * @function deleteCopy_req
     * @returns   a promise with an object the confirmation
     */
    deleteCopy_req(copy_req) {

        return new Promise(async (resolve, reject) => {
          this.loading = true;
          try {
            this.request.res = await axios.post(
              `https://script.google.com/macros/s/AKfycbwF23KlbpkSaZZBn4M97q545WC6JeUZIkft47SdqDbprxURNxsN/exec?delete=true&item_id=${
                copy_req.item_id
              }&uid=${this.auth().currentUser.uid}`
            );
            resolve(this.request.res);
          } catch (error) {
            this.loading = false;
            reject(error);
          }
        });
    },
    dateFormater:dateFormater,

    async setEditingMode(copy_req) {
      if (copy_req.test_date) {
        copy_req.test_date = new Date(copy_req.test_date)
          .toISOString()
          .substr(0, 10);
      }
      this.request = copy_req;
      this.deleteMode = false;
      this.editingMode = true;
      window.scrollTo(0, 0);
    },
    setDeleteMode(copy_req) {
      this.deleteMode = true;
      this.currentCopy_req = copy_req.item_id;
    },
    ...mapActions(["getCentersList"]),
    async fetchCenters() {
      this.centers = await this.getCentersList();
    },
     async  regionSelect() {
      this.provinces = this.centers.map(item => {
        if (item.region.toUpperCase() == this.request.region.toUpperCase()) {
          return item.provincia;
        } else {
          return "";
        }
      });
    },
   async provinceSelect() {
      this.recintos = await this.centers.map(item => {
        if (item.provincia.toUpperCase() == this.request.province.toUpperCase()) {
          return item.recintos;
        } else {
          return "";
        }
      });
      this.recintos.push('otro')
    }
  },

  beforeDestroy() {
    clearInterval(this.timeOut);
  },
  computed: {
    ...mapGetters(["auth"])
  },
  async created() {
    this.request.name = this.auth().currentUser.displayName;
    this.request.email = this.auth().currentUser.email;
    this.request.uid = this.auth().currentUser.uid;
    this.request.date = new Date();
    await this.getCopy_reqs();
    await this.fetchCenters();
  }
};
</script>
