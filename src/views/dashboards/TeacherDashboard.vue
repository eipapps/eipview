<template>
  <v-content class="mb-5 pb-5">
    <v-card
      fluid
      dark
      flat
      color="grey lighten-2"
    >
      <v-layout
        wrap
        justify-center
        class="pt-5"
      >
        <div
          class="display-1 font-weight-light text-xs-center main-title my-1 py-1 mx-4 px-1"
        >
          Teacher's dashboard
        </div>
      </v-layout>
      <!-- FIRST ROW STARTS -->
      <v-layout
        row
        wrap
        justify-center
        class="mb-2"
      >
        <v-btn
          color
          :class="(gradesReport)? 'blur' : 'sign-in'"
          block
          large
          @click="gradesReport =!gradesReport"
        >
          PUBLICAR CALIFICACIONES
        </v-btn>
        <v-btn
          color
          :class="(dataTable)? 'blur' : 'sign-up'"
          block
          large
          @click="dataTable =!dataTable"
        >
          PASAR LISTA
        </v-btn>
      </v-layout>
      <!-- FIRST ROW ENDS -->
      <!-- SECOND ROW STARTS -->
      <v-layout
        row
        wrap
        class="mb-0 pb-0"
        v-if="!dataTable && !gradesReport"
      >
        <v-layout
          row
          wrap
          justify-center
          class="mx-3"
        >
          <!-- CALENDAR STARTS -->
          <v-card
            min-width="300px"
            max-width="400px"
            class="mx-2 mt-2 mb-5 grey darken-4 elevation-24"
            height="300px"
          >
            <v-card-title primary-title>
              <v-layout
                row
                wrap
                justify-center
              >
                Calendario Academico
              </v-layout>
            </v-card-title>
            <v-sheet
              tile
              height="54"
              color="grey "
              class="d-flex"
              light
            >
              <v-btn
                icon
                class="ma-2"
                @click="$refs.calendar.prev()"
              >
                <v-icon>arrow_back_ios</v-icon>
              </v-btn>
              <v-select
                v-model="type"
                :items="types"
                dense
                outlined
                hide-details
                class="ma-2"
                label="type"
              />
              <v-select
                v-model="mode"
                :items="modes"
                dense
                outlined
                hide-details
                label="event-overlap-mode"
                class="ma-2"
              />
              <v-select
                v-model="weekday"
                :items="weekdays"
                dense
                outlined
                hide-details
                label="weekdays"
                class="ma-2"
              />
              <v-spacer />
              <v-btn
                icon
                class="ma-2"
                @click="$refs.calendar.next()"
              >
                <v-icon>arrow_forward_ios</v-icon>
              </v-btn>
            </v-sheet>
            <v-sheet light>
              <v-calendar
                ref="calendar"
                color="red"
                v-model="value1"
                :weekdays="weekday"
                :type="type"
                :events="events"
                :event-overlap-mode="mode"
                :event-overlap-threshold="30"
                :event-color="getEventColor"
                @change="getEvents"
              />
            </v-sheet>
          </v-card>
          <!-- CALENDAR ENDS -->
          <!-- SERVICES AND RESOURCES STARTS  -->
          <servicesScreen :services-for-teacher="servicesForTeacher" />
          <!-- SERVICES AND RESOURCES ENDS  -->

          <!-- attendance report start -->
          <v-card
            class="mt-4 mb-4 mx-2 grey darken-4"
            min-width="360px"
            max-height="330px"
            v-for="(item, i) in reports"
            :key="i"
          >
            <v-sheet
              class="v-sheet--offset mx-auto"
              :color="item.background"
              elevation="12"
              max-width="calc(100% - 25px)"
            >
              <v-sparkline
                :labels="labels"
                :value="value"
                :color="item.color"
                line-width="2"
                padding="12"
              />
            </v-sheet>

            <v-card-text class="pt-0">
              <div class="title font-weight-light mb-2">
                {{ item.tittle }}
              </div>
              <div class="subheading font-weight-light grey--text">
                {{ item.body }}
              </div>
              <v-divider class="my-2" />
              <v-icon
                class="mr-2"
                small
              >
                {{ item.icon }}
              </v-icon>
              <span class="caption grey--text font-weight-light">last registration 26 minutes ago</span>
            </v-card-text>
          </v-card>
        </v-layout>
      </v-layout>
      <!-- attendance  report ends -->
      <!-- SECOND ROW ENDS -->
      <!-- publish  scores -->
      <transition name="slideDown">
        <v-layout
          row
          wrap
          justify-center
          v-if="gradesReport"
        >
          <v-card
            width="95%"
            class="pa-2 round"
            light
            flat
          >
            <v-card-title
              primary-title
              class="bigWords title"
            >
              <v-layout
                row
                wrap
                justify-center
              >
                Formulario de reporte de calificaciones
              </v-layout>
            </v-card-title>
            <v-layout
              row
              wrap
              justify-center
            >
              <!-- grades report starts-->
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Search"
                single-line
                hide-details
              />
              <v-data-table
                style="width: 98%"
                :headers="gradesheaders"
                :pagination.sync="pagination"
                :items="students"
                :must-sort="true"
                light
                :search="search"
              >
                <template v-slot:items="props">
                  <td class="text-center mx-0 pl-2 text-uppercase sheet">
                    <router-link
                      :to="'/student/'+props.item.id"
                    >
                      {{ props.index+1 }}- {{ props.item.name }}
                    </router-link>
                  </td>
                  <td
                    class="text-center mx-1 px-0 text-uppercase font-weight-bold sheet"
                    contenteditable="contenteditable"
                  >
                    <span class="py-2 px-4">{{ props.item.homework }}</span>
                  </td>
                  <td
                    class="text-center mx-1 px-0 text-uppercase font-weight-bold sheet"
                    contenteditable="contenteditable"
                  >
                    <span class="py-2 px-4">{{ props.item.classwork }}</span>
                  </td>
                  <td
                    class="text-center mx-1 px-0 text-uppercase font-weight-bold sheet"
                    contenteditable="contenteditable"
                  >
                    <span class="py-2 px-4">{{ props.item.pba }}</span>
                  </td>
                  <td
                    class="text-center mx-1 px-0 text-uppercase font-weight-bold sheet"
                    contenteditable="contenteditable"
                  >
                    <span class="py-2 px-4">{{ props.item.midterm }}</span>
                  </td>
                  <td
                    class="text-center mx-1 px-0 text-uppercase font-weight-bold sheet"
                    contenteditable="contenteditable"
                  >
                    <span class="py-2 px-4">{{ props.item.final }}</span>
                  </td>
                  <td class="text-center mx-1 px-0 text-uppercase font-weight-bold sheet">
                    <span class="py-2 px-4">
                      {{
                        (props.item.homework * 0.10)+
                          (props.item.classwork * 0.10) +
                          (props.item.pba * 0.30) +
                          (props.item.midterm * 0.25) +
                          (props.item.final * 0.25)
                      }}%
                    </span>
                  </td>
                </template>
              </v-data-table>
              <v-btn
                class="sign-up mb-5"
                large
                block
                round
              >
                Guardar calificaciones
              </v-btn>

              <!-- grades report ends-->
            </v-layout>
          </v-card>
        </v-layout>
      </transition>
      <!-- publish  scores -->
      <!-- call attendance starts -->

      <transition name="slideDown">
        <v-layout
          row
          wrap
          justify-center
          v-if="dataTable"
        >
          <v-card
            width="95%"
            class="pa-2 round"
            light
            flat
          >
            <v-card-title
              primary-title
              class="bigWords title"
            >
              <v-layout
                row
                wrap
                justify-center
              >
                Formulario de pase de Lista
              </v-layout>
            </v-card-title>
            <v-layout
              row
              wrap
              justify-center
            >
              <v-data-table
                style="width: 98%"
                :headers="headers"
                :pagination.sync="pagination"
                :items="students"
                :must-sort="true"
                dense
              >
                <template v-slot:items="props">
                  <td
                    class="text-center mx-0 pl-2 text-uppercase sheet"
                    id="name"
                    min-width="150px"
                  >
                    <router-link
                      :to="'/student/'+props.item.id"
                    >
                      {{ props.index+1 }}-{{ props.item.name }}
                    </router-link>
                  </td>

                  <td
                    class="text-center mx-0 pl-2 text-uppercase sheet"
                    id="apellido"
                    min-width="150px"
                  >
                    <router-link :to="'/student/'+props.item.id">
                      {{ props.item.lastname }}
                    </router-link>
                  </td>

                  <td class="text-center mx-1 px-0 text-uppercase font-weight-bold sheet">
                    <v-radio-group row>
                      <v-radio
                        label="P"
                        color="green"
                        value="radio-1"
                      />
                      <v-radio
                        label="A"
                        color="red"
                        value="radio-2"
                      />
                      <v-radio
                        label="E"
                        color="yellow"
                        value="radio-3"
                      />
                      <v-radio
                        label="T"
                        color="blue"
                        value="radio-4"
                      />
                    </v-radio-group>
                  </td>
                  <td
                    class="text-center mx-0 text-uppercase sheet"
                    contenteditable="contenteditable"
                  />
                </template>
              </v-data-table>
              <v-btn
                class="sign-up mb-5"
                large
                block
                round
              >
                Guardar
              </v-btn>
            </v-layout>
          </v-card>
        </v-layout>
      </transition>
      <!-- call attendance ends -->
      <memberCarousel class=" dashboard-component" />
    </v-card>
    <v-layout
      row
      wrap
      justify-space-around
      align-end
      class="px-2 pb-5 grey lighten-2"
    >
      <!--  TASKS STARTS -->
      <Tasks />
      <!--  TASKS ENDS -->
    </v-layout>
  </v-content>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import servicesScreen from "@/components/utilities/servicesScreen.vue";
import memberCarousel from "@/components/utilities/memberCarousel.vue";
import Tasks from "@/components/utilities/tasks.vue";
import {format, subDays} from "date-fns";
export default {
  components: {
    servicesScreen,
    memberCarousel,
    Tasks
  },
  data: () => ({
    dataTable: false,
    gradesReport: false,
    servicesForTeacher: true,
    primaryDrawer: {
      model: false
    },
    attendanceCode: ["PRESENTE", "AUSENTE", "TARDE", "EXCUSA"],
    reports: [
      {
        title: "Reporte de promedio",
        background: "yellow",
        color: "black",
        body: "Asistencia ultimos 5 dias de clase",
        icon: "calendar_today"
      }
    ],
    labels: [
      
        format(subDays(new Date(), 5), "mmm d"),
    format(subDays(new Date(), 4), "mmm d"),
        format(subDays(new Date(), 3), "mmm d"),
       format(subDays(new Date(), 2), "mmm d"),
      format(subDays(new Date(), 1), "mmm d"),
    ],
    value: [10, 10, 8, 9, 5],
    type: "month",
    types: ["month", "week", "day", "4day"],
    mode: "stack",
    modes: ["stack", "column"],
    weekday: [1, 2, 3, 4, 5],
    weekdays: [{ text: "Mon - Fri", value: [1, 2, 3, 4, 5] }],
    value1: "",
    events: [],
    colors: [
      "blue",
      "indigo",
      "deep-purple",
      "cyan",
      "green",
      "orange",
      "grey darken-1"
    ],
    names: [
      "Meeting",
      "Holiday",
      "PTO",
      "Travel",
      "Event",
      "Birthday",
      "Conference",
      "Party"
    ],

    headers: [
      {
        text: "NOMBRE",
        align: "left",
        value: "name"
      },
      {
        text: "APELLIDO",
        align: "left",
        value: "apellido"
      },
      {
        text: format(new Date(),"mmm do"),
        align: "left",
        value: "today"
      },
      {
        text: "Comentario",
        align: "left",
        value: "today"
      }
    ],
    gradesheaders: [
      {
        text: "NOMBRE",
        align: "left",
        value: "name"
      },
      {
        text: "Homework",
        align: "left",
        value: "Homework"
      },
      {
        text: "Classwork",
        align: "left",
        value: "Classwork"
      },
      {
        text: "PBA",
        align: "left",
        value: "PBA"
      },
      {
        text: "Midterm",
        align: "left",
        value: "Midterm"
      },
      {
        text: "Final",
        align: "left",
        value: "Final"
      },
      {
        text: "TOTAL",
        align: "left",
        value: "TOTAL"
      }
    ],
    pagination: {
      hideDefaultFooter: true,
      rowsPerPage: 35,
      hideActions: true
    },
    search: ""
  }),
  methods: {
    momenize() {
      return format(new Date(),"mmm do");
    },
    getEvents({ start, end }) {
      const events = [];

      const min = new Date(`${start.date}T00:00:00`);
      const max = new Date(`${end.date}T23:59:59`);
      const days = (max.getTime() - min.getTime()) / 86400000;
      const eventCount = this.rnd(days, days + 20);

      for (let i = 0; i < eventCount; i++) {
        const allDay = this.rnd(0, 3) === 0;
        const firstTimestamp = this.rnd(min.getTime(), max.getTime());
        const first = new Date(firstTimestamp - (firstTimestamp % 900000));
        const secondTimestamp = this.rnd(2, allDay ? 288 : 8) * 900000;
        const second = new Date(first.getTime() + secondTimestamp);

        events.push({
          name: this.names[this.rnd(0, this.names.length - 1)],
          start: this.formatDate(first, !allDay),
          end: this.formatDate(second, !allDay),
          color: this.colors[this.rnd(0, this.colors.length - 1)]
        });
      }

      this.events = events;
    },
    getEventColor(event) {
      return event.color;
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
    formatDate(a, withTime) {
      return withTime
        ? `${a.getFullYear()}-${a.getMonth() +
            1}-${a.getDate()} ${a.getHours()}:${a.getMinutes()}`
        : `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()}`;
    },
    ...mapActions(["fetchStudents"])
  },
  async created() {
    await this.fetchStudents();
  },
  computed: {
    ...mapGetters(["servicios", "students"])
  }
};
</script>
<style>
.card-offset {
  top: -20px;
  position: relative;
}
.v-sheet--offset {
  top: -24px;
  position: relative;
}
.sheet {
  border: 0.5px solid gray !important;
}
.overflow {
  overflow-y: scroll;
  overflow-x: hidden;
  text-overflow: clip;
}
.bigWords {
  font-family: "Bebas Neue", serif !important;
}
.slideDown-enter-active {
  animation-duration: 1.5s;
  animation-name: bounceInDown;
  animation-timing-function: ease-in-out;
}
.slideDown-leave-active {
  animation-duration: 0.3s;
  animation-name: bounceOutUp;
  animation-timing-function: ease-in-out;
}
.blur {
  box-shadow: 0 3px 5px rgba(0, 0, 0, 0.438) !important;
  background-color: gray !important;
  padding: 30px !important;
}
</style>
