const state = {
  navigation: {
    // public routes that guest are able to access
    publicNav: [
      {
        icon: "home",
        title: "HOME",
        link: "/",
        class: "home"
      },
      {
        icon: "people_outline",
        title: "ABOUT",
        link: "/about",
        class: "about"
      }
    ],
    // administrative access routes
    administrative: [
      {
        icon: "healing",
        title: "CENTERS STATUS",
        link: `/centers status/`,
        class: "sign-in",
        // sub-folders inside center status
        subfolders: [
          {
            title: "PAYROLL AND OCURRENCIES",
            link: `/payroll/`
          },
          
          {
            title: "LOGISTICS REPORT",
            link: `/logistics report/`
          },
          {
            title: "ADMISIONS REPORT",
            link: `/admisions report/`
          },

        ]
      },
      {
        icon: "person",
        title: "EMPLOYEES",
        link: "/employees",
        class: "employees",
      },

      {
        icon: "collections_bookmark",
        title: "DOSSIER",
        link: `/dossier/`,
        class: "sign-in"
      },
      {
        icon: "assignment",
        title: "INVENTORY",
        link: `/inventory/`,
        class: "sign-in"
      },

    ],
    // academic access routes
    academic: [
      {
        icon: "folder",
        title: "LESSON PLANS",
        link: "/lesson plans",
        class: "sign-in",

      },

      // mockups start
      {
        icon: "feedback",
        title: "FRESH IDEAS",
        link: `/fresh ideas/`,
        class: "sign-in",

      },
      {
        icon: "security",
        title: "STANDARDS",
        link: `/standards/`,
        class: "sign-in",

      },
      {
        icon: "calendar_today",
        title: "CALENDARS",
        link: `/calendars/`,
        class: "sign-in",

      },
      {
        icon: "work",
        title: "PROJECTS",
        link: `/projects/`,
        class: "sign-in",

      },
      {
        icon: "grade",
        title: "GRADES AND ATTENDANCE",
        link: `/grades and attendance/`,
        class: "sign-in",

      },
      {
        icon: "fitness_center",
        title: "TRAINING MATERIALS",
        link: `/grades and attendance/`,
        class: "sign-in",
      },
      {
        icon: "show_chart",
        title: "ASSESSMENTS",
        link: `/assessments/`,
        class: "sign-in",
      }
    ]
  },
  solicitudes: [
    { title: "solicitar copias de examenes", link: "/solicitarCopias", icon: 'fiber_new' },
    { title: "solicitar permisos extensos", link: "solicitarPermiso", icon: 'fiber_new' },
    { title: "Crear formulario de asistencia", link: "/attendanceForm", icon: 'fiber_new' },
    { title: "solicitar materiales y mobiliarios" },
    { title: "solicitar libros" },
    { title: "solicitar carta para estudiante" },
    { title: "solicitar carta para empleado" }
  ],
  servicios: [
    { title: "Guia de Evaluacion por Nivel", link: "/assessmentGuide", class:'t' },
    { title: "Planes de clase", link: "/lesson plans", class:'t'},
    { title: "Encargados", link: "/encargados"},
    { title: "Manuales", link: "/manuales", class:'t' },
    { title: "Dossier",link:"/dossier", icon: "collections_bookmark", color: "#c6192a", class:'t'},
    { title: "Empleados en Centros", link: "/employees" },
    { title: "Calendario Academico", link: "/calendario", class:'t'},
    { title: "Evaluaciones Formativas", link: "/formative", class:'t'},
    { title: "Resultados de Examen diagnostico",link:'' },
    { title: "Curriculum", class:'t', link:'' },
    { title: "Exam blueprints", link:''},
    { title: "Estadandares de Competencias", class:'t', link:''},
    { title: "Mapas de Procedimientos", link:'' }
  ],
};
const getters = {
  getNavigation: state => state.navigation,
  servicios: state => state.servicios,
  solicitudes: state => state.solicitudes,
};
const actions = {};
const mutations = {
  setNavigation: (state, value) => (state.navigation = value)
};

export default {
  state,
  getters,
  actions,
  mutations
};
