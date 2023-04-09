import { createRouter, createWebHistory } from "vue-router"
import { getCurrentUser } from "./services/firebase"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/playlist/new",
      component: () => import("./pages/NewPlaylist.vue"),
    },
    {
      path: "/playlist/:playlistId",
      component: () => import("./pages/Playlist.vue"),
    },
    {
      path: "/uploads/new",
      component: () => import("./pages/NewUpload.vue"),
    },
    {
      path: "/uploads",
      component: () => import("./pages/Uploads.vue"),
    },
    {
      path: "/login",
      component: () => import("./pages/Login.vue"),
    },
    {
      path: "/register",
      component: () => import("./pages/Register.vue"),
    },
    {
      path: "/",
      component: () => import("./pages/Index.vue"),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    try {
      await getCurrentUser()
      return next()
    } catch(err) {
      console.error(err)
      return next('/login')
    }
  }
  next()
})

export default router