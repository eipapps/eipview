<template>
  <v-card
    class="justify-center mx-1 elevation-24 grids grey lighten-4 tasks"
    raised
  >
    <!--  SNACKBAR STARTS -->
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
    <!--  SNACKBAR ENDS -->
    <v-card-title
      primary-title
      class="instructions justify-center elevation-12 py-1 white--text"
    >
      <v-icon
        color="white"
        class="mx-2"
      >
        sms
      </v-icon>Administrador de Tareas
    </v-card-title>

    <!-- date picker starts -->
    <v-layout row>
      <v-text-field
        class="mx-3 my-0"
        v-model="date"
        label="Hoy"
        prepend-icon="event"
        readonly
        disabled
      />

      <!-- date picker ends -->
      <!-- textfield with name starts -->
      <v-text-field
        :label="auth().currentUser.displayName"
        class="mx-3 my-0"
        prepend-icon="person"
        disabled
      />
    </v-layout>
    <!-- textfield with name ends -->
    <!-- textarea starts -->

    <v-layout
      row
      wrap
      align-center
    >
      <v-text-field
        class="mx-2 my-0"
        hint="Escribe tu itinerario"
        label="En que estas trabajando hoy?"
        v-model="taskInput"
        @keydown.enter="addTask"
      />
      <v-btn
        @click="addTask"
        prepend-icon="add"
        flat
        fab
      >
        <v-icon>add</v-icon>
      </v-btn>
    </v-layout>
    <!-- TASKS DISPLAY STARTS -->
    <v-layout
      row
      wrap
      v-if="tasks.length > 0"
    >
      <v-card
      
        flat
        style="overflow:auto;"
        class="scrollbar bigger"
      >
        <v-layout
          column
          v-for="(task, i) in tasks"
          :key="i"
        >
          <v-layout
            row
            wrap
            justify-start
            align-center
            :class="(i%2==0)? 'my-0 py-0 px-3': 'grey lighten-3  my-0 py-0 px-3'"
          >
            <span>{{ i+1 }}-</span>
            <!-- <div @click="$emit('checkbox', task)"> -->
            <v-checkbox
              v-model="task.done"
              color="green"
              hide-details
              class="shrink mr-0 mt-0 mb-0"
              @change="editTask"
            />
            <!-- </div> -->
            <v-tooltip top>
              <template v-slot:activator="{ on }">
                <span
                  v-on="on"
                  :class="(task.done)? 'strike': ''"
                >{{ task.message }}</span>
              </template>
              <span class="caption">creado el {{ moment(task.date) }}</span>
            </v-tooltip>
            <v-btn
              @click="removeTask(task)"
              flat
              small
              fab
              class="ma-0 pa-0"
            >
              <v-icon
                small
                color="red"
              >
                delete
              </v-icon>
            </v-btn>
          </v-layout>
        </v-layout>
      </v-card>
    </v-layout>
    <!-- TASKS DISPLAY ENDS -->
    <!-- Submit button starts -->
    <v-layout
      column
      justify-center
    >
      <v-switch
        class="my-0 py-0 mx-2"
        :value="true"
        color="green"
        label="Publico"
      />
      <v-btn
        round
        @click="postTasks"
        small
        :loading="loading"
        class="mx-auto instructions white--text elevation-24"
      >
        Guardar
      </v-btn>
      <!-- Submit button ends -->
    </v-layout>
    <!-- textarea ends -->
  </v-card>
</template>
<script>

import { mapGetters } from "vuex";
import format from 'date-fns/format/index';
export default {
  name: "Tasks",
  data() {
    return {
      date: new Date().toISOString().substr(0, 10),
      centers: [],
      tasks: [],
      taskInput: "",
      private: true,
      targetTask: {},
      snackbar: false,
      snackbarMessage: "",
      loading: false,
    };
  },
  methods: {
    addTask() {
      if (this.taskInput)
        this.tasks.push({
          message: this.taskInput,
          done: false,
          date: new Date()
        });
    this.tasks =  this.tasks.sort((a, b) => a.done - b.done);
      this.taskInput = "";
      this.saveTasks();
    },
    postTasks() {
      this.snackbarMessage = "Su tarea ha sido guardada correctamente";
      this.snackbar = true;
      this.loading = false;
    },
    removeTask(task) {
      const index = this.tasks.findIndex(s => s == task);
      this.tasks.splice(index, 1);
      this.saveTasks();
    },
   async saveTasks() {
     return new Promise((resolve, reject)=>{
       try {
         localStorage.setItem("tasks", JSON.stringify(this.tasks));
         resolve()
       } catch (error) {
         reject(error);
       }

     })
    },
    editTask(e) {
      this.saveTasks()
      .then(()=>{
         this.tasks =  this.tasks.sort((a, b) => a.done - b.done);
      });
    },
    moment(date) {
      return format(new Date(date), " dd MMMM yyyy, hh:mma");
    }
  },
  computed: {
    ...mapGetters(["auth"])
  },
  created() {
    if (localStorage.getItem("tasks")) {
      this.tasks = JSON.parse(localStorage.getItem("tasks"));
    }
  }
};
</script>
<style scoped>
.strike{
    text-decoration: line-through;
}
.bigger:hover{

 max-height: 480px !important;
}
.bigger{
min-width: 95%;
 max-height: 360px !important;
}

.instructions {
  background: rgb(79, 177, 83) !important;
  background: linear-gradient(
    0deg,
    rgb(27, 117, 30) 42%,
    rgba(59, 200, 4, 0.904) 100%,
    rgb(28, 28, 218) 100%
  ) !important;
}
  .tasks{
    max-width: 850px;
  }
  .bigger{

 max-width: 845px;
}
@media screen and (max-width:650px) {
  .tasks{
    max-width: 350px;
  }
  .bigger{

 max-width: 345px;
}
}
@media screen and (min-width:650px) and (max-width:900px) {
  .tasks{
    max-width: 640px;
  }
  .bigger{

 max-width: 635px;
}
}
</style>