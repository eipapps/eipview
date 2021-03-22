<template>
  <div>
    <figure>
      <!-- error show starts  -->
      <v-alert
        outline
        rounded
        class="round slideRight stayPut"
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
      <!-- error show ends  -->
    </figure>
    <figure>
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
          dark
          text
          @click="snackbar = false"
        >
          Close
        </v-btn>
      </v-snackbar>
      <!-- snackbar to notify completion ends -->
    </figure>
    <v-card
      flat
      class="grey lighten-4"
    >
      <div
        id="notificationForm"
        v-if="!historyMode"
        class="slideRight"
      >
        <v-layout
          row
          align-center
          class="my-0"
        >
          <v-avatar
            size="40px"
            class="mr-2 my-0"
          >
            <img
              :src="this.auth().currentUser.photoURL"
              alt
            >
          </v-avatar>
          <v-text-field
            v-model="request.name"
            class="my-0"
            :placeholder="request.name"
            :value="request.name"
            disabled
          />
          <v-text-field
            class="my-0"
            prepend-icon="mail"
            placeholder="Email"
            :value="request.email"
            disabled
          />
        </v-layout>

        <!-- ================================== -->
        <v-layout
          justify-center
          wrap
          column
          class="my-0"
          @click="errors = []"
        >
          <v-layout
            justify-center
            row
            class="my-0"
          >
            <v-text-field
              class="my-0 mx-1"
              prepend-icon="notifications"
              placeholder="titulo de notificación."
              v-model="request.title"
            />
            <v-text-field
              class="my-0"
              prepend-icon="link"
              solo
              placeholder="enlance al recurso compartido."
              v-model="request.link"
            />
          </v-layout>
          <v-text-field
            class="my-0"
            prepend-icon="notes"
            placeholder="contenido de notificación."
            v-model="request.body"
          />
        </v-layout>
        <v-layout
          row
          justify-end
        >
          <v-btn
            small
            flat
            round
            class="limpiar white--text"
            @click="reset"
          >
            limpiar
          </v-btn>
          <v-btn
            small
            round
            flat
            dark
            @click="callCreate"
            class="orangish elevation-24"
            :loading="loading"
            v-if="deleteMode == false && editingMode == false && historyMode == false"
          >
            Enviar
          </v-btn>
          <v-btn
            small
            round
            flat
            dark
            @click="callUpdate"
            class="green elevation-24"
            :loading="loading"
            v-else
          >
            editar
          </v-btn>
        </v-layout>
        <v-layout
          row
          justify-start
        >
          <v-btn
            small
            flat
            round
            class="elevation-24 deep-purple darken-3 accent-5 white--text"
            @click="historyMode = true"
          >
            ver historial de mis notificaciones
          </v-btn>
        </v-layout>
      </div>
      <div
        id="notificationHistory"
        v-else
        class="slide"
      >
        <v-btn
          small
          round
          flat
          dark
          @click="historyMode = false"
          class="orangish elevation-24 my-0"
        >
          <v-icon>arrow_back</v-icon>atrás
        </v-btn>

        <aside>
          <v-card-title class="font-weight-light main-title px-1">
            Historial de mis notificaciones
          </v-card-title>
          <v-card
            max-height="200px"
            style="overflow:auto;"
          >
            <v-card
              v-for="(item, index) in notifications"
              :key="index"
              class="pa-2 elevation-20"
            >
              <v-layout
                row
                align-center
              >
                <v-avatar
                  v-if="item.avatar && item.avatar != 'undefined' && !isFromFire(item)"
                  size="30"
                >
                  <img :src="item.avatar">
                </v-avatar>
                <v-avatar
                  v-if="!item.avatar || item.avatar== 'undefined' || isFromFire(item)"
                  size="30"
                  class="sign-up"
                >
                  {{ initialize(item.name) }}
                </v-avatar>
                <span class="mx-2 font-weight-bold black--text">{{ item.title }}</span>
                <!-- ACTIONS START -->
                <v-layout
                  row
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
                    v-if="deleteMode && currentNotification == item.item_id"
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
                      @click="callDelete(item)"
                      :loading="item.item_id == currentNotification && si"
                    >
                      si
                    </v-btn>
                  </v-layout>
                </v-layout>
                <!-- ACTIONS ENDS -->
              </v-layout>
              <a
                :href="item.link"
                target="_blank"
                :class="item.haveNotRead ? 'greyForce' : ''"
              >
                <span class="black--text caption">
                  <span>{{ item.name }}</span>
                  |
                  {{ dateFromNow(item.date) }}
                </span>
                <br>
                <span class="pt-2 black--text">{{ item.body }}</span>
              </a>
            </v-card>
          </v-card>
        </aside>
      </div>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import axios from "axios";
import { directive as onClickaway } from "vue-clickaway";
import { dateFromNow } from '../../views/session/utils';
export default {
  directives: {
    onClickaway: onClickaway
  },
  data: () => {
    return {
      request: {},
      loading: false,
      alert: true,
      snackbar: false,
      snackbarMessage: "",
      timeOut: {},
      errors: [],
      historyMode: false,
      editingMode: false,
      deleteMode: false,
      notifications: [],
      currentNotification: {},
      si: false
    };
  },
  methods: {
    isFromFire(item) {
      return item.avatar.split(".")[0].includes("https://firebasestorage");
    },
    reset() {
      this.loading = false;
      this.request.body = "";
      this.request.title = "";
      this.request.link = "";
    },
    async setEditingMode(notification) {
      this.request = notification;
      this.deleteMode = false;
      this.editingMode = true;
      this.historyMode = false;
    },
    setDeleteMode(notification) {
      this.deleteMode = true;
      this.currentNotification = notification.item_id;
    },
    validate() {
      let valid = true;

      this.errors = [];
      if (!this.request.title) {
        this.errors.push("Le falta el título a la notificación.");
        valid = false;
      }
      if (!this.request.body) {
        this.errors.push("Tiene que escribir el contenido de la notificación.");
        valid = false;
      }
      if (!this.request.link) {
        this.errors.push("Incluya un link con el recurso compartido.");
        valid = false;
      }
      return valid;
    },
   dateFromNow: dateFromNow,
    initialize(name) {
      return name
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase();
    },
    /**
     * @CREATE
     * @function createNotifications creates new a new notification
     * @returns a promise with the confirmation
     */
    createNotifications() {
      return new Promise(async (resolve, reject) => {
        this.loading = true;
        try {
          this.request.res = await axios.post(
            `https://script.google.com/macros/s/AKfycbzCblYu-G9TRRlOOVZUGI9DUIdzHQcvM3ZND2qLNYCQI5lAofNs/exec?uid=${
              this.auth().currentUser.uid
            }&name=${this.request.name}&email=${this.request.email}&avatar=${
              this.request.avatar
            }&title=${this.request.title}&body=${this.request.body}&link=${
              this.request.link
            }&date=${this.request.date}&post=true
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
     * @function readNotifications send a request to get all notifications
     * @returns an array with all the notifications and sets it to local notifications
     */
    async readNotifications() {
      try {
        this.notifications = await axios.get(
          `https://script.google.com/macros/s/AKfycbzCblYu-G9TRRlOOVZUGI9DUIdzHQcvM3ZND2qLNYCQI5lAofNs/exec?uid=${
            this.auth().currentUser.uid
          }`
        );
        this.notifications = this.notifications.data;
      } catch (error) {}
    },
    /**
     * @UPDATE
     * @function updateNotifications send a request to edit a notification
     * @returns a promise with the confirmation
     */
    updateNotifications() {
      return new Promise(async (resolve, reject) => {
        this.loading = true;
        try {
          this.request.res = await axios.post(
            `https://script.google.com/macros/s/AKfycbzCblYu-G9TRRlOOVZUGI9DUIdzHQcvM3ZND2qLNYCQI5lAofNs/exec?uid=${
              this.auth().currentUser.uid
            }&item_id=${this.request.item_id}&name=${this.request.name}&email=${
              this.request.email
            }&avatar=${this.request.avatar}&title=${this.request.title}&body=${
              this.request.body
            }&link=${this.request.link}&date=${this.request.date}&edit=true
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
     * @DELETE send a request to delete a notification
     * @param notification an object of type notification
     * @function deleteNotification
     * @returns   a promise with an object the confirmation
     */
    deleteNotification(notification) {
      return new Promise(async (resolve, reject) => {
        this.loading = true;
        try {
          this.request.res = await axios.post(
            `https://script.google.com/macros/s/AKfycbzCblYu-G9TRRlOOVZUGI9DUIdzHQcvM3ZND2qLNYCQI5lAofNs/exec?delete=true&item_id=${
              notification.item_id
            }&uid=${this.auth().currentUser.uid}`
          );
          resolve(this.request.res);
        } catch (error) {
          this.loading = false;
          reject(error);
        }
      });
    },
    callCreate() {
      if (this.validate()) {
        try {
          this.createNotifications()
            .then(res => {
              this.snackbarMessage = res.data.message;
              this.snackbar = true;
              this.loading = false;
              return res;
            })
            .then(async res => {
              if (res.data.status == 200) {
                await this.readNotifications();
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
    callUpdate() {
      if (this.validate()) {
        try {
          this.updateNotifications()
            .then(async res => {
              this.snackbarMessage = await res.data.message;
              this.snackbar = true;
              this.loading = false;
              return res;
            })
            .then(async res => {
              if (res.data.status == 200) {
                await this.readNotifications();
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
    callDelete(notification) {
      this.currentNotification = notification.item_id;
      this.si = true;
      try {
        this.deleteNotification(notification)
          .then(res => {
            this.snackbarMessage = res.data.message;
            this.snackbar = true;
            this.si = false;
            return res;
          })
          .then(async res => {
            if (res.data.status == 200) {
              await this.readNotifications();
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
    this.request.avatar = this.auth().currentUser.photoURL;
    this.request.date = new Date();
    await this.readNotifications();
  }
};
</script>
<style>
.stayPut {
  z-index: 1 !important;
  position: fixed !important;
  top: 50px;
  left: 10px;
  background-color: ghostwhite;
  justify-self: center !important;
}
.limpiar {
  box-shadow:
 5px 1px 8px #CF77F3,
   0px 3px 8px #009BFF,
  5px 3px 8px #2AC9DB;
  background-image: linear-gradient(-90deg, rgb(151, 64, 185) 0%, rgb(3, 102, 168) 47%, rgb(32, 152, 165) 100%);}
</style>
