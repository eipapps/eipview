import Vue from "vue";
import Router from "vue-router";
import Home from "./views/Home.vue";
import { auth } from "firebase/app";
import session from "./store/modules/session";

Vue.use(Router);

let router = new Router({
  mode: "history",
  base: "",
  routes: [
    {

      path: "/",
      name: "home",
      component: Home,
      meta: {
        title: 'Pagina Principal - DLE MESCyT',
      }
    },
    {
      path: "/about",
      name: "about",
      meta: {
        title: 'Acerca de TEACHEIP.com - DLE MESCyT',
      },
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/About.vue")
    },
    {
      path: "/testimonials",
      name: "testimonials",
      meta: {
        title: 'Acerca de TEACHEIP.com - DLE MESCyT',
      },
      // which is lazy-loaded when the route is visited.
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/data/testimonials.vue")
    },
    {
      path: "/lesson plans",
      name: "lesson plans",
      component: () =>
        import(
          /* webpackChunkName: "about" */ "./views/services/LessonPlanIterator.vue"
        ),
      meta: {
        title: 'Planes de clase - DLE MESCyT',
        // requiresAuth: true,
        // resquiresValidation: true
      }
    },
    {
      path: "/dossier",
      name: "dossier",
      component: () =>
        import(
          /* webpackChunkName: "about" */ "./views/services/dossier.vue"
        ),
      meta: {
        title: 'Dossier - DLE MESCyT',
        requiresAuth: true,
        resquiresValidation: true
      }
    },
    {
      path: "/manuales",
      name: "manuales",
      component: () =>
        import(
          /* webpackChunkName: "about" */ "./views/services/manuales.vue"
        ),
      meta: {
        title: 'Manuales para colaboradores y estudiantes - DLE MESCyT',
        requiresAuth: true,
        resquiresValidation: true
      }
    },
    {
      path: "/employees",
      name: "employees",
      component: () =>
        import(
          /* webpackChunkName: "about" */ "./views/services/EmployeeChart.vue"
        ),
      meta: {
        title: 'Contactos de los colaboradores - DLE MESCyT',
        requiresAuth: true,
        resquiresValidation: true
      }
    },
    {
      path: "/encargados",
      name: "encargados",
      component: () =>
        import(
          /* webpackChunkName: "about" */ "./views/services/encargados.vue"
        ),
      meta: {
        title: 'Lista de encargados de departamentos - DLE MESCyT',
        requiresAuth: true,
        resquiresValidation: true
      }
    },
    {
      path: "/formative",
      name: "formative",
      component: () =>
        import(
          /* webpackChunkName: "about" */ "./views/services/formative.vue"
        ),
      meta: {
        title: 'Evaluaciones formativas - DLE MESCyT',
        requiresAuth: true,
        resquiresValidation: true
      }
    },
    {
      path: "/attendanceForm",
      name: "attendanceForm",
      component: () =>
        import(
          /* webpackChunkName: "about" */ "./views/services/attendanceForm.vue"
        ),
      meta: {
        title: 'Solicitud de formulario de Asistencia - DLE MESCyT',
        requiresAuth: true,
        resquiresValidation: true
      }
    },
    {
      path: "/solicitarCopias",
      name: "solicitarCopias",
      component: () =>
        import(
          /* webpackChunkName: "about" */ "./views/services/solicitarCopias.vue"
        ),
      meta: {
        title: 'Solicitud de copias - DLE MESCyT',
        requiresAuth: true,
        resquiresValidation: true
      }
    },
    {
      path: "/solicitarPermiso",
      name: "solicitarPermiso",
      component: () =>
        import(
          /* webpackChunkName: "about" */ "./views/services/solicitarPermiso.vue"
        ),
      meta: {
        title: 'Solicitud de permisos - DLE MESCyT',
        requiresAuth: true,
        resquiresValidation: true
      }
    },
    {
      path: "/calendario",
      name: "calendario",
      component: () =>
        import(
          /* webpackChunkName: "about" */ "./views/services/calendario.vue"
        ),
      meta: {
        title: 'Calendario Academico - DLE MESCyT',
        requiresAuth: true,
        resquiresValidation: true
      }
    },
    {
      path: "/assessmentGuide",
      name: "assessmentGuide",
      component: () =>
        import(
          /* webpackChunkName: "about" */ "./views/services/assessmentGuide.vue"
        ),
      meta: {
        title: 'Guia para evaluaciones por nivel - DLE MESCyT',
        requiresAuth: true,
        resquiresValidation: true
      }
    },
    {
      path: "/landing/",
      name: "landing",
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/session/Landing.vue"),
      meta: {
        title: 'Seleccionar roles - DLE MESCyT',
        requiresAuth: true
      }
    },
    {
      path: "/UnauthorizedDashboard",
      name: "/UnauthorizedDashboard/",
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/session/205.vue"),
      meta: {
        title: 'No esta autorizado- DLE MESCyT',
        requiresAuth: true
      }
    },
    {
      path: "/éeDashboard",
      name: "/éeDashboard/",
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/session/205.vue"),
      meta: {
        title: 'No esta autorizado - DLE MESCyT',
        requiresAuth: true
      }
    },
    {
      path: "/signup",
      name: "signup",
      component: () =>
        import(
          /* webpackChunkName: "about" */ "./views/session/RegisterView.vue"
        ),
      meta: {
        requiresGuest: true
      }
    },
    {
      path: "/updateProfile",
      name: "updateProfile",
      title: 'editar perfil - DLE MESCyT',
      component: () =>
        import(
          /* webpackChunkName: "about" */ "./views/session/ProfileEditorView.vue"
        ),
      meta: {

        requiresAuth: true,
        resquiresValidation: true
      }
    },
    {
      path: "/completeUserInfo",
      name: "completeUserInfo",
      component: () =>
        import(
          /* webpackChunkName: "about" */ "./views/session/completeUserInfo.vue"
        ),
      meta: {
        title: 'Completa informacion - DLE MESCyT',
        requiresAuth: true,
        resquiresValidation: true
      }
    },
    {
      path: "/supervisorDashboard/",
      name: "supervisorDashboard",
      component: () =>
        import(
          /* webpackChunkName: "about" */ "./views/dashboards/SupervisorDashboard.vue"
        ),
      meta: {
        title: 'Supervisor Dashboard - DLE MESCyT',
        requiresAuth: true,
        resquiresValidation: true,
        isSupervisor: true,
      }
    },
    {
      path: "/coordinatorDashboard",
      name: "coordinatorDashboard",
      component: () =>
        import(
          /* webpackChunkName: "about" */ "./views/dashboards/CoordinatorDashboard.vue"
        ),
      meta: {
        title: 'Coordinator Dashboard - DLE MESCyT',
        requiresAuth: true,
        resquiresValidation: true,
        isCoordinator: true,
      }
    },
    {
      path: "/teacherDashboard",
      name: "teacherDashboard",
      component: () =>
        import(
          /* webpackChunkName: "about" */ "./views/dashboards/TeacherDashboard.vue"
        ),
      meta: {
        title: 'Teacher Dashboard - DLE MESCyT',
        requiresAuth: true,
        resquiresValidation: true,
        isTeacher: true,
      }
    },
    {
      path: "/student/:id",
      name: "student",
      component: () =>
        import(
          /* webpackChunkName: "about" */ "./views/data/student.vue"
        ),
      meta: {
        title: 'Perfil de estudiante - DLE MESCyT',
        requiresAuth: true,
        resquiresValidation: true,
        isTeacher: true,
        // make seeable by coordinators and supervisors
      }
    },
    {
      path: "/center/:id",
      name: "center",
      component: () =>
        import(
          /* webpackChunkName: "about" */ "./views/data/center.vue"
        ),
      meta: {
        title: 'Perfil de centro - DLE MESCyT',
        requiresAuth: true,
        resquiresValidation: true,
        isSupervisor: true,
        // make seeable by coordinators and supervisors
      }
    },
    {
      path: "/member/:id",
      name: "member",
      component: () =>
        import(
          /* webpackChunkName: "about" */ "./views/data/member.vue"
        ),
      meta: {
        title: 'Perfil de colaborador - DLE MESCyT',
        requiresAuth: true,
        resquiresValidation: true,
        // make seeable by coordinators and supervisors
      }
    },
    {
      path: "/useterms",
      name: "useterms",
      component: () =>
        import(/* webpackChunkName: "about" */ "@/components/Useterms.vue")
    },
    {
      path: "/403",
      name: "403",
      meta: {
        title: 'No tiene autorizacion para este espacio - DLE MESCyT',
      },
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/session/403.vue")
    },
    {
      path: "*",
      name: "404",
      meta: {
        title: 'No encontramos lo que busca - DLE MESCyT',
      },
      component: () =>
        import(/* webpackChunkName: "about" */ "./views/session/404.vue")
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!auth().currentUser) {
      next({
        path: "/403",
        params: { nextUrl: to.fullPath }
      });
    } else {
      // validate if session is valid starts
      let user = session.getToken("sessionRole");
      if (to.matched.some(record => record.meta.resquiresValidation)) {
        if (user) {
          next();
        } else {
          next({ name: "landing" });
        }
      } else {
        next();
      }
      // validate if session is valid ends

      // validate if is a Supervisor starts
      if (to.matched.some(record => record.meta.isSupervisor)) {
        if (atob(user) == 'supervisor') {
          next();
        } else {
          next({ name: "403" });
        }
      } else {
        next();
      }
      // validate if is a Supervisor ends

      // validate if is a Coordinator starts
      if (to.matched.some(record => record.meta.isCoordinator)) {
        if (atob(user) == 'coordinator') {
          next();
        } else {
          next({ name: "403" });
        }
      } else {
        next();
      }
      // validate if is a Coordinator ends

      // validate if is a teacher starts
      if (to.matched.some(record => record.meta.isTeacher)) {
        if (atob(user) == 'teacher') {
          next();
        } else {
          next({ name: "403" });
        }
      } else {
        next();
      }
      // validate if is a teacher ends

    }
  } else if (to.matched.some(record => record.meta.requiresGuest)) {
    if (session.getToken("sessionRole") == "") {
      next();
    } else {
      next({ name: "dashboard" });
    }
  } else {
    next();
  }
});

export default router;
