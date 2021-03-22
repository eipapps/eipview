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
        Solicitud de permisos
      </v-layout>
    </header>
    <main>
      <v-container
        grid-list-sm
        class="pa-3"
      >
        <v-card class="round mx-2 pa-2 mb-5 pb-5 grey lighten-4 elevation-9">
          <v-layout
            row
            justify-center
            class="grey lighten-4 title text-uppercase"
          >
            Solicitar Permisos
          </v-layout>
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
            Tomar en cuenta: No se puede editar ni borrar una solicitud despues
            de dos dias de haber sido creada.
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
                :value="request.date"
                disabled
              />
            </v-layout>

            <!-- ================================== -->
            <v-layout
              row
              wrap
              justify-start
              class="mx-0"
              v-if="!editingMode"
            >
              <v-btn
                small
                round
                color="sign-up"
                @click="$refs.inputUpload.click()"
              >
                <v-icon small>
                  description
                </v-icon>Subir constancia para el permiso
              </v-btn>
              <input
                v-show="false"
                ref="inputUpload"
                type="file"
                @change="showPath"
                id="file1"
                accept="application/msword, application/pdf, image/*"
              >
              <v-card
                class="ma-3"
                flat
                v-model="path"
              >
                {{ path }}
              </v-card>
            </v-layout>

            <v-flex xs12>
              <v-text-field
                prepend-icon="notes"
                placeholder="Justificación para el permiso"
                v-model="request.body"
                maxlength="400"
                type="text"
              />
            </v-flex>
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
                      :value="dateFormater(request.starts)"
                      label="Cuando empiezar este permiso"
                      readonly
                      v-on="on"
                      @click:clear="request.starts = null"
                      class="mx-2"
                    />
                  </v-layout>
                </template>
                <v-date-picker
                  v-model="request.starts"
                  color="#c6192a"
                  @change="menu2 = false"
                />
              </v-menu>

              <v-menu
                v-model="menu1"
                :close-on-content-click="false"
                max-width="290"
              >
                <template v-slot:activator="{ on }">
                  <v-layout
                    column
                    wrap
                  >
                    <v-text-field
                      :value="dateFormater(request.ends)"
                      label="Cuando termina este permiso"
                      readonly
                      v-on="on"
                      @click:clear="request.ends = null"
                      class="mx-2"
                    />
                  </v-layout>
                </template>
                <v-date-picker
                  v-model="request.ends"
                  color="#c6192a"
                  @change="menu1 = false"
                />
              </v-menu>
            </v-layout>
            <!-- date picker ends -->

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
              <!-- snackbar to notify completion ends -->
            </v-layout>
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
              @click="editPermission"
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
              @click="localPostPermission"
              class="sign-in slide"
              :loading="loading"
            >
              Enviar solicitud
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </main>
    <!-- PERMISSION HISTORY STARTS -->
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
          Historial de permisos
        </v-card-title>
        <v-layout wrap>
          <v-card
            v-for="item in permissions"
            :key="item.permission_id"
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
                  v-if="deleteMode && currentPermission == item.permission_id"
                >
                  Esta seguro que quieres borrar la informacion?
                  <v-btn
                    small
                    fab
                    class="slide sign-in"
                    @click="deleteMode = false"
                  >
                    no
                  </v-btn>
                  <v-btn
                    small
                    fab
                    class="slide sign-up"
                    @click="deleteData(item)"
                    :loading="item.permission_id == currentPermission && si"
                  >
                    si
                  </v-btn>
                </v-layout>
              </v-layout>
              <span class="my-1">
                Justificación:
                <span
                  class="font-weight-bold"
                  contenteditable
                >{{
                  item.body
                }}</span>
              </span>
              <span class="my-1">
                Nombre del solicitante:
                <span class="font-weight-bold">{{ item.name }}</span>
              </span>
              <span class="my-1">
                Desde:
                <span class="font-weight-bold">{{
                  dateFormater(item.starts)
                }}</span>
              </span>
              <span class="my-1">
                Hasta:
                <span class="font-weight-bold">{{
                  dateFormater(item.ends)
                }}</span>
              </span>
              <v-card>
                <span class="my-1">
                  Enlace para descargar documento:
                  <span class="font-weight-bold">
                    <a
                      :href="item.location"
                      target="_blank"
                    >aqui</a>
                  </span>
                </span>
              </v-card>

              <span class="my-1">
                Dia que fue solicitado:
                <span class="font-weight-bold">{{
                  dateFormater(item.date)
                }}</span>
              </span>
            </v-layout>
          </v-card>
        </v-layout>
      </v-layout>
    </aside>
    <!-- PERMISSION HISTORY ENDS -->
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
  </v-layout>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
import waiting from "@/components/loading.vue";
import { dateFormater } from "../session/utils";
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
      file: null,
      permissions: [],
      editingMode: false,
      deleteMode: false,
      si: false,
      currentPermission: "",
    };
  },
  methods: {
    localPostPermission() {
      if (this.validate()) {
        try {
          this.createPermissions()
            .then((res) => {
              this.snackbarMessage = res.data.message;
              this.snackbar = true;
              this.loading = false;
              return res;
            })
            .then(async (res) => {
              if (res.data.status == 200) {
                await this.getPermissions();
                this.timeOut = await setTimeout(this.reset, 6000);
                window.scrollTo(0, 1000);
              }
            })
            .catch((err) => {
              throw new Error(`there was an Error ${err}`);
            });
          this.getPermissions();
        } catch (error) {
          console.log(error);
        }
      }
    },
    editPermission() {
      if (this.validate()) {
        try {
          this.requestEdit()
            .then(async (res) => {
              this.snackbarMessage = await res.data.message;
              this.snackbar = true;
              this.loading = false;
              return res;
            })
            .then(async (res) => {
              if (res.data.status == 200) {
                await this.getPermissions();
                this.timeOut = await setTimeout(this.reset, 6000);
                window.scrollTo(0, 1000);
              }
            })
            .catch((err) => {
              throw new Error(`there was an Error ${err}`);
            });
        } catch (error) {
          console.log(error);
        }
      }
    },
    deleteData(permission) {
      this.currentPermission = permission.permission_id;
      this.si = true;
      window.scrollTo(0, 0);
      try {
        this.deletePermission(permission)
          .then((res) => {
            this.snackbarMessage = res.data.message;
            this.snackbar = true;
            this.si = false;
            return res;
          })
          .then(async (res) => {
            if (res.data.status == 200) {
              await this.getPermissions();
              this.timeOut = await setTimeout(this.reset, 6000);
            }
          })
          .catch((err) => {
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
      if (!this.path && !this.editingMode) {
        this.errors.push("Tiene que escoger un archivo para solicitar permiso");
        valid = false;
      }
      if (!this.request.starts || !this.request.ends) {
        this.errors.push(
          "Favor indicar la fecha que comienza y termina el permiso"
        );
        valid = false;
      } else {
        if (this.compareDates()) {
          this.errors.push(
            `La fecha de inicio ${
              this.request.starts
            } es mayor a la fecha que termina el permiso ${this.request.starts}`
          );
          valid = false;
        }
      }
      if (!this.request.body) {
        this.errors.push(
          "explique de forma breve las razones porque necesita el permiso."
        );
        valid = false;
      }
      if (this.file) {
        if (this.file.size >= 15728640) {
          this.errors.push(
            "El archivo para la constancia excede los 15MB. Por favor guardelo en otro formato o reduzcalo."
          );
          valid = false;
        }
      }

      return valid;
    },
    reset() {
      this.loading = false;
      this.editingMode = false;
      this.deleteMode = false;
      this.path = "";
      this.request = {};
      this.request.name = this.auth().currentUser.displayName;
      this.request.email = this.auth().currentUser.email;
      this.request.uid = this.auth().currentUser.uid;
      this.request.date = new Date();
    },
    showPath() {
      this.file = document.getElementById("file1").files[0];
      this.path = document.getElementById("file1").value;
    },
    getFileName() {
      if (this.path) {
        const startIndex =
          this.path.indexOf("\\") >= 0
            ? this.path.lastIndexOf("\\")
            : this.path.lastIndexOf("/");
        let filename = this.path.substring(startIndex);
        if (filename.indexOf("\\") === 0 || filename.indexOf("/") === 0) {
          filename = filename.substring(1);
        }
        return filename;
      }
    },
    /**
     * @CREATE
     * @function createPermissions creates new a new permission
     * @returns a promise with the confirmation
     */
    createPermissions() {
      return new Promise((resolve, reject) => {
        this.loading = true;
        var reader = new FileReader();
        reader.onloadend = async () => {
          try {
            this.request.file = await reader.result;
            this.request.file = this.request.file.split("base64,")[1];
            this.request.filename = `Solicitud_de_permiso_${
              this.request.name
            }_${this.dateFormater(this.request.date)}`;
            this.request.fileSize = this.file.size;
            this.request.format = this.getFileName()
              .split(".")
              .pop();
            this.request.res = await axios.post(
              "https://script.google.com/macros/s/AKfycbxXk9Y8hRkF7sgyT3UAmpyZkaeQK9yONtsEc40nRFYKRduZWss/exec",
              JSON.stringify(this.request)
            );
            resolve(this.request.res);
          } catch (error) {
            this.loading = false;
            reject(error);
          }
        };
        reader.readAsDataURL(this.file);
      });
    },
    /**
     * @UPDATE
     * @function requestEdit send a request to edit a permission
     * @returns a promise with the confirmation
     */
    requestEdit() {
      return new Promise(async (resolve, reject) => {
        this.loading = true;
        try {
          this.request.res = await axios.post(
            `https://script.google.com/macros/s/AKfycbxXk9Y8hRkF7sgyT3UAmpyZkaeQK9yONtsEc40nRFYKRduZWss/exec?edit=true&permission_id=${
              this.request.permission_id
            }&uid=${this.auth().currentUser.uid}&name=${
              this.request.name
            }&body=${this.request.body}&starts=${this.request.starts}&ends=${
              this.request.ends
            }`
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
     * @function getPermissions send a request to get all permissions
     * @returns an array with all the permissions and sets it to local permissions
     */
    async getPermissions() {
      try {
        this.permissions = await axios.get(
          `https://script.google.com/macros/s/AKfycbxXk9Y8hRkF7sgyT3UAmpyZkaeQK9yONtsEc40nRFYKRduZWss/exec?uid=${
            this.auth().currentUser.uid
          }`
        );
        this.permissions = this.permissions.data;
      } catch (error) {}
    },
    /**
     * @DELETE send a request to delete a permission
     * @param permission an object of type permission
     * @function deletePermission
     * @returns   a promise with an object the confirmation
     */
    deletePermission(permission) {
      return new Promise(async (resolve, reject) => {
        this.loading = true;
        try {
          this.request.res = await axios.post(
            `https://script.google.com/macros/s/AKfycbxXk9Y8hRkF7sgyT3UAmpyZkaeQK9yONtsEc40nRFYKRduZWss/exec?delete=true&permission_id=${
              permission.permission_id
            }&uid=${this.auth().currentUser.uid}`
          );
          resolve(this.request.res);
        } catch (error) {
          this.loading = false;
          reject(error);
        }
      });
    },
    dateFormater: dateFormater,
    compareDates() {
      return this.request.starts >= this.request.ends;
    },

    async setEditingMode(permission) {
      if (permission.starts && permission.ends) {
        permission.starts = new Date(permission.starts)
          .toISOString()
          .substr(0, 10);
        permission.ends = new Date(permission.ends).toISOString().substr(0, 10);
      }
      this.request = permission;
      this.deleteMode = false;
      this.editingMode = true;
      window.scrollTo(0, 0);
    },
    setDeleteMode(permission) {
      this.deleteMode = true;
      this.currentPermission = permission.permission_id;
    },
  },
  beforeDestroy() {
    clearInterval(this.timeOut);
  },
  computed: {
    ...mapGetters(["auth", "storage"]),
  },
  async created() {
    this.request.name = this.auth().currentUser.displayName;
    this.request.email = this.auth().currentUser.email;
    this.request.uid = this.auth().currentUser.uid;
    this.request.date = dateFormater(new Date());
    await this.getPermissions();
  },
};
</script>
