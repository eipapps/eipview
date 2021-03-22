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
        Formulario de Asistencia
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
          <v-btn
            small
            outline
            color="green"
            @click="detalles = !detalles"
          >
            Ver detalles
          </v-btn>
          <transition name="fadeInDown">
            <v-layout
              row
              wrap
              class=" ma-3 px-2 "
              v-if="detalles"
            >
              “Formulario de Asistencia”: como coordinador o profesor encargado, esta aplicación le permite crear un formulario de asistencia para cada nivel. El “Formulario de Asistencia” este hecho en una Hoja de cálculo de Google (googlesheet).
              <br> Al completar la información siguiente podrás iniciar la creación de “Formulario de Asistencia” que se adapte a el numero de grupos que se manejan en tu centro.
              <br> Al llenar la información se te preguntará:
              <ul>
                <li>Si hay grupos en una determinada tanda.</li>
                <li>El color que deseas que tengan las pestañas de las tandas; esto ayuda a diferenciarlas en la hoja de calculo.</li>
                <li>La cantidad de grupos en una determinada tanda.</li>
                <li>El nivel para el que estas creando la hoja de asistencia. *nota al momento de publicar esta función, todavía hay una persona encargada de editar el blueprint de la hoja de asistencia; esta es actualizada dos semanas antes de entrar el nuevo nivel. Para evitar obtener una versión desactualizada (del nivel anterior), por favor crea la hoja de asistencia una semana antes de comenzar el nuevo nivel.</li>
                <li>Quien supervisa su centró</li>
                <li>La región, provincia y nombre del centro(recinto). *nota: si no escoge la región primero no podrá visualizar la provincia o el recinto.</li>
                <li>Al insertar los correos electrónicos de los miembros de tu equipo en la opción “+ MIEMBROS DE TU EQUIPO”, puedes definir quienes tendrán acceso a editar el formulario. *nota: los correos que no sean de Gmail solo tendrán acceso a ver el “Formulario de Asistencia”.</li>
              </ul>
              Después de pulsar "ENVIAR SOLICITUD", dada a la cantidad de fórmulas y cálculos para esta operación, esta puede durar entre 30 y 50 segundos antes de recibir confirmación de su creación.
              <br>Para evitar la posible pérdida de información, una vez el formulario es creado, se bloqueará la opción de editar la estructura del formulario dos días después.
              <br>Tan pronto el formulario es creado, el supervisor, los miembros de tu equipo, y tu recibirán un correo electrónico con el enlace para comenzar a trabajar con este.
              <br>En la parte posterior de esta página podrá ver de forma automática el nuevo formulario.
              <br> Si por alguna razón, desea editarlo, puede hacer click en el icono del lápiz verde, llenar los cambios y enviarlos.
            </v-layout>
          </transition>
          <!-- WAITING STARTS -->
          <v-layout
            row
            wrap
            justify-center
            v-if="loading"
            class="slide"
          >
            <v-layout
              row
              wrap
              class="mx-5 px-5 title"
            >
              Después de pulsar "ENVIAR SOLICITUD", dada a la cantidad de fórmulas y cálculos para esta operación, esta puede durar entre 30 y 50 segundos antes de recibir confirmación de su creación.
            </v-layout>
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
                  :maxlength="40"
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

            <!-- MORNING STARTS -->
            <v-layout
              column
              wrap
              justify-start
              class="mx-4 green lighten-4 px-2"
            >
              <span class="font-weight-bold grey--text caption mt-1">
                <v-icon
                  color="green"
                  small
                >local_florist</v-icon>TANDA MATUTINA
              </span>
              <v-layout
                row
                wrap
                justify-center
                align-center
              >
                <v-layout
                  column
                  class="ma-0 pa-0"
                  justify-center
                  align-center
                  wrap
                >
                  <v-checkbox
                    v-model="request.isThereMorning"
                    color="green"
                    hide-details
                    class="shrink mr-0 mt-0 mb-0"
                    @change="
                      if (!request.isThereMorning) request.morningGroups = null;
                    "
                  />
                  <label for="head">Hay grupo matutino?</label>
                </v-layout>
                <v-layout
                  column
                  class="ma-0 pa-0"
                  justify-center
                  align-center
                  wrap
                >
                  <input
                    v-model="request.mornColor"
                    type="color"
                  >
                  <label for="head">tab color</label>
                </v-layout>
                <v-text-field
                  placeholder="cantidad de grupos en la mañana"
                  v-model="request.morningGroups"
                  type="number"
                  min="1"
                  max="20"
                  class="mx-5"
                  @input="
                    request.isThereMorning =
                      request.morningGroups > 0 ? true : false
                  "
                />
              </v-layout>
            </v-layout>
            <!-- MORNING ENDS -->
            <!-- AFTERNOON STARTS -->
            <v-layout
              column
              wrap
              justify-start
              class="mx-4 red lighten-4 px-2"
            >
              <span class="font-weight-bold grey--text caption mt-1">
                <v-icon
                  small
                  color="red"
                >wb_sunny</v-icon>TANDA VESPERTINA
              </span>
              <v-layout
                row
                wrap
                justify-center
                align-center
              >
                <v-layout
                  column
                  class="ma-0 pa-0"
                  justify-center
                  align-center
                  wrap
                >
                  <v-checkbox
                    v-model="request.isThereAfternoon"
                    color="red"
                    hide-details
                    class="shrink mr-0 mt-0 mb-0"
                    @change="
                      if (!request.isThereAfternoon)
                        request.afternoonGroups = null;
                    "
                  />
                  <label for="head">Hay grupo vespertino?</label>
                </v-layout>
                <v-layout
                  column
                  class="ma-0 pa-0"
                  justify-center
                  align-center
                  wrap
                >
                  <input
                    v-model="request.aftColor"
                    type="color"
                  >
                  <label for="head">tab color</label>
                </v-layout>
                <v-text-field
                  placeholder="cantidad de grupos en la tarde"
                  v-model="request.afternoonGroups"
                  @input="
                    request.isThereAfternoon =
                      request.afternoonGroups > 0 ? true : false
                  "
                  type="number"
                  min="1"
                  max="20"
                  class="mx-5"
                />
              </v-layout>
            </v-layout>
            <!-- AFTERNOON ENDS -->
            <!-- EVENING STARTS -->
            <v-layout
              column
              wrap
              justify-start
              class="mx-4 blue lighten-4 px-2"
            >
              <span class="font-weight-bold grey--text caption mt-1">
                <v-icon
                  small
                  color="blue"
                >nights_stay</v-icon>TANDA NOCTURNA
              </span>
              <v-layout
                row
                wrap
                justify-center
                align-center
              >
                <v-layout
                  column
                  class="ma-0 pa-0"
                  justify-center
                  align-center
                  wrap
                >
                  <v-checkbox
                    v-model="request.isThereEvening"
                    color="blue"
                    hide-details
                    class="shrink mr-0 mt-0 mb-0"
                    @change="
                      if (!request.isThereEvening) request.eveningGroups = null;
                    "
                  />
                  <label for="head">Hay grupo nocturno?</label>
                </v-layout>
                <v-layout
                  column
                  class="ma-0 pa-0"
                  justify-center
                  align-center
                  wrap
                >
                  <input
                    v-model="request.eveColor"
                    type="color"
                  >
                  <label for="head">tab color</label>
                </v-layout>
                <v-text-field
                  placeholder="cantidad de grupos en la noche"
                  v-model="request.eveningGroups"
                  @input="
                    request.isThereEvening =
                      request.eveningGroups > 0 ? true : false
                  "
                  type="number"
                  min="1"
                  max="20"
                  class="mx-5"
                />
              </v-layout>
            </v-layout>
            <!-- EVENING ENDS -->

            <!-- LEVEL STARTS -->
            <v-layout
              row
              wrap
              justify-center
              align-center
            >
              <v-select
                class="py-1 mx-2"
                :items="level"
                :placeholder="request.level"
                v-model="request.level"
                :disabled="editingMode"
                label="Nivel"
              />
              <v-select
                class="py-1 mx-2"
                label="Supervisor"
                :items="supervisors"
                :placeholder="request.supervisor"
                v-model="request.supervisor"
                @change="fillSupervisorInfo"
              />
            </v-layout>
            <!-- LEVEL ENDS -->

            <!-- information about the center starts -->
            <v-layout
              row
              wrap
              align-center
            >
              <v-select
                class="py-1"
                :items="regions"
                :placeholder="request.region"
                v-model="request.region"
                :disabled="editingMode"
                label="Region"
                @change="regionSelect"
              />
              <v-select
                class="py-1"
                :items="provinces"
                :placeholder="request.province"
                v-model="request.province"
                :disabled="editingMode"
                label="Provincia"
                @change="provinceSelect"
              />
              <v-select
                class="py-1"
                :items="recintos"
                :placeholder="request.center"
                v-model="request.center"
                :disabled="editingMode"
                label="Recinto"
                @change="extra = request.center == 'otro' ? true : false"
              />
            </v-layout>
            <v-layout column>
              <v-text-field
                class="my-0 py-0"
                v-if="extra"
                placeholder="Escriba el nombre del centro que no aparece en la lista."
                v-model="request.center"
              />
            </v-layout>
            <!-- information about the center ends -->
            <!-- ADD TEAM MEMBERS  STARTS-->
            <v-layout
              column
              v-if="!editingMode"
            >
              <v-btn
                outline
                round
                small
                class="grey"
                @click="request.thereIsEmailList = !request.thereIsEmailList; request.emailList=[]"
              >
                <v-icon color="grey">
                  add
                </v-icon>miembros de tu equipo
              </v-btn>
              <transition name="fadeInDown">
                <v-layout
                  column
                  v-if="request.thereIsEmailList"
                >
                  <v-layout
                    row
                    class="mx-4 mb-5"
                  >
                    <v-icon
                      class="mx-3"
                      color="red"
                      @click="emailList.pop(emailIn)"
                    >
                      remove
                    </v-icon>
                    <v-text-field
                      clearable
                      prepend-icon="email"
                      v-model="emailIn"
                      label="email"
                      size="30"
                      :maxlength="40"
                      @keydown.enter="addEmail"
                    />
                    <v-icon
                      class="mx-3"
                      color="green"
                      @click.stop="addEmail"
                    >
                      add
                    </v-icon>
                  </v-layout>
                  <v-layout
                    column
                    class="mx-4"
                  >
                    <ul
                      v-for="(email, i) in emailList"
                      :key="i"
                    >
                      <li>
                        <span>{{ i+1 }}-</span>
                        <span>{{ email }}</span>
                      </li>
                    </ul>
                  </v-layout>
                </v-layout>
              </transition>
            </v-layout>
            <!-- ADD TEAM MEMBERS  ENDS-->
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
              @click="editAttendance_form"
              class="green font-weight-bold caption slide"
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
              @click="localPostAttendance_form"
              class="sign-in slide"
              :loading="loading"
            >
              Enviar solicitud
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-container>
    </main>
    <!-- ATTENDANCE_FORM HISTORY STARTS -->
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
          Historial de formularios de Asistencia
        </v-card-title>
        <v-layout wrap>
          <v-card
            v-for="item in attendance_forms"
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
              </v-layout>

              <span class="my-1">
                Nombre del solicitante:
                <span class="font-weight-bold grey--text caption">
                  {{
                    item.name
                  }}
                </span>
              </span>
              <span class="my-1">
                Nivel:
                <span class="font-weight-bold grey--text caption">
                  {{
                    item.level
                  }}
                </span>
              </span>

              <span class="my-1">
                Grupos en tanda matutina:
                <span class="font-weight-bold grey--text caption">
                  {{
                    item.morningGroups
                  }}
                </span>
                <v-icon
                  small
                  :color="item.mornColor"
                >color_lens</v-icon>
              </span>
              <span class="my-1">
                Grupos en tanda vepertina:
                <span class="font-weight-bold grey--text caption">
                  {{
                    item.afternoonGroups
                  }}
                </span>
                <v-icon
                  small
                  :color="item.aftColor"
                >color_lens</v-icon>
              </span>
              <span class="my-1">
                Grupos en tanda nocturna:
                <span class="font-weight-bold grey--text caption">
                  {{
                    item.eveningGroups
                  }}
                </span>
                <v-icon
                  small
                  :color="item.eveColor"
                >color_lens</v-icon>
              </span>
              <span class="my-1">
                Centro:
                <span class="font-weight-bold grey--text caption">
                  {{
                    item.center
                  }}
                </span>
              </span>
              <span class="my-1">
                Provincia:
                <span class="font-weight-bold grey--text caption">
                  {{
                    item.province
                  }}
                </span>
              </span>
              <span class="my-1">
                Region:
                <span class="font-weight-bold grey--text caption">
                  {{
                    item.region
                  }}
                </span>
              </span>
              <span class="my-1">
                Supervisor:
                <span class="font-weight-bold grey--text caption">
                  {{
                    item.supervisorName
                  }}
                </span>
              </span>
              <span class="my-1">
                ir al formulario
                <a
                  :href="item.att_form_URL"
                  target="_blank"
                >
                  <span class="font-weight-bold caption">aqui</span>
                </a>
              </span>

              <span class="my-1">
                Dia que fue solicitado:
                <span class="font-weight-bold grey--text caption">
                  {{
                    dateFormater(item.date)
                  }}
                </span>
              </span>
            </v-layout>
          </v-card>
        </v-layout>
      </v-layout>
    </aside>
    <!-- ATTENDANCE_FORM HISTORY ENDS -->
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
      attendance_forms: [],
      editingMode: false,
      si: false,
      currentAttendance_form: "",
      regions: ["Norte", "Sur", "Este", "Santo Domingo"],
      level: [
        "Basic 1",
        "Basic 2",
        "Intermediate 1",
        "Intermediate 2",
        "Advanced 1"
      ],
      centers: [],
      provinces: [],
      recintos: [],
      extra: false,
      supervisors: [],
      emailIn: "",
      emailList: [],
      detalles: false
    };
  },
  methods: {
    fillSupervisorInfo() {
      this.getSupervisors().then(async res => {
        const supervisorInfo = await res.data.filter(
          s => s.name == this.request.supervisor
        )[0];
        this.request.supervisorUid = supervisorInfo.uid;
        this.request.supervisorName = supervisorInfo.name;
        this.request.supervisorEmail = supervisorInfo.email;
      });
    },
    localPostAttendance_form() {
      if (this.validate()) {
        try {
          this.createAttendance_forms()
            .then(res => {
              this.snackbarMessage = res.data.message;
              this.snackbar = true;
              this.loading = false;
              return res;
            })
            .then(async res => {
              if (res.data.status == 200) {
                await this.getAttendance_forms();
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
    editAttendance_form() {
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
                await this.getAttendance_forms();
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
      if (!this.request.supervisor) {
        this.errors.push("Indique el supervisor.");
        valid = false;
      }
      if (
        !this.request.isThereMorning &&
        !this.request.isThereAfternoon &&
        !this.request.isThereEvening
      ) {
        this.errors.push(
          "Tiene que llenar la inoformacion de por lo menos una de las tandas."
        );
        valid = false;
      }
      if (this.extra && this.request.center == "otro") {
        this.errors.push(
          "Ya que escogio otro centro, por favor escriba el nombre de este."
        );
        valid = false;
      }
      if (
        this.request.morningGroups > 20 ||
        this.request.afternoonGroups > 20 ||
        this.request.eveningGroups > 20
      ) {
        this.errors.push(
          "Solo se permiten 20 grupos por tanda. Has escogido un numero mayor en una de ellas."
        );
        valid = false;
      }
      if (
        Math.floor((new Date() - Date.parse(this.request.date)) / 86400000) >
          2 &&
        this.editingMode
      ) {
        this.errors.push(
          "No se puede editar  una solicitud despues de dos dias de haber sido creada."
        );
        valid = false;
      }

      return valid;
    },
    reset() {
      this.loading = false;
      this.editingMode = false;
      this.request = {};
      this.request.name = this.auth().currentUser.displayName;
      this.request.email = this.auth().currentUser.email;
      this.request.uid = this.auth().currentUser.uid;
      this.request.mornColor = "#04a461";
      this.request.aftColor = "#d13c34";
      this.request.eveColor = "#4197a8";
      this.request.date = new Date();
      this.fetchSupervisors();
    },
    /**
     * @function getSupervisors gets the information from supervisors
     * @returns a promise with the confirmation
     */
    getSupervisors() {
      return new Promise(async (resolve, reject) => {
        try {
          this.request.res = await axios.get(
            `https://script.google.com/macros/s/AKfycbyNLUiUUjM3M69pAtwSen1p2Zey2iFEPkHGWH4XLOzEHZYu0Qk/exec?uid=${this.request.uid} `
          );
          resolve(this.request.res);
        } catch (error) {
          reject(error);
        }
      });
    },
    /**
     * @CREATE
     * @function createAttendance_forms creates new a new attendance_form
     * @returns a promise with the confirmation
     */
    createAttendance_forms() {
      return new Promise(async (resolve, reject) => {
        this.loading = true;
        this.request.res = null;
        this.request.supervisor = null;
        this.request.emailList = this.emailList;
        this.request.post = true;
       
        try {
          this.request.res = await axios.post(
            `https://script.google.com/macros/s/AKfycbyNjIq0XeHJKNnF6OL9mngBX4cTiQGvCG2yVQcuP_drFhy0wRc/exec`,
            JSON.stringify(this.request)
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
     * @function requestEdit send a request to edit a attendance_form
     * @returns a promise with the confirmation
     */
    requestEdit() {
      return new Promise(async (resolve, reject) => {
        this.loading = true;
        this.request.res = null;
        this.request.supervisor = null;
        this.request.emailList = this.emailList;
        this.request.edit = true;

        try {
          this.request.res = await axios.post(
            `https://script.google.com/macros/s/AKfycbyNjIq0XeHJKNnF6OL9mngBX4cTiQGvCG2yVQcuP_drFhy0wRc/exec`,
            JSON.stringify(this.request)
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
     * @function getAttendance_forms send a request to get all attendance_forms
     * @returns an array with all the attendance_forms and sets it to local attendance_forms
     */
    async getAttendance_forms() {
      try {
        this.attendance_forms = await axios.get(
          `https://script.google.com/macros/s/AKfycbyNjIq0XeHJKNnF6OL9mngBX4cTiQGvCG2yVQcuP_drFhy0wRc/exec?uid=${
            this.auth().currentUser.uid
          }`
        );
        this.attendance_forms = this.attendance_forms.data;
      } catch (error) {}
    },

    dateFormater: dateFormater,

    async setEditingMode(attendance_form) {
      this.request = attendance_form;
      this.request.supervisor = attendance_form.supervisorName;
      this.request.uid = this.auth().currentUser.uid;
      this.editingMode = true;
      window.scrollTo(0, 0);
    },

    ...mapActions(["getCentersList"]),
    async fetchCenters() {
      this.centers = await this.getCentersList();
    },
    async regionSelect() {
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
        if (
          item.provincia.toUpperCase() == this.request.province.toUpperCase()
        ) {
          return item.recintos;
        } else {
          return "";
        }
      });
      this.recintos.push("otro");
    },
    addEmail() {
      if (this.ValidateEmail() && this.emailList.length < 20)
        this.emailList.push(this.emailIn.trim());
    },
    ValidateEmail() {
      var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      if (this.emailIn.match(mailformat)) {
        return true;
      } else {
        if (this.errors.length < 1)
          this.errors.push("Has insertado un correo electronico no valido");
        return false;
      }
    },
    fetchSupervisors() {
      this.getSupervisors().then(s => {
        this.supervisors = s.data.map(s => s.name);
      });
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
    this.request.mornColor = "#04a461";
    this.request.aftColor = "#d13c34";
    this.request.eveColor = "#4197a8";
    await this.getAttendance_forms();
    await this.fetchCenters();
    await this.fetchSupervisors();
  }
};
</script>
<style>
.fadeInDown-enter-active{
animation: fadeInDown;
animation-duration: 0.3s
}
.fadeInDown-leave-active{
animation: fadeOutUp;
animation-duration: 0.2s
}
</style>