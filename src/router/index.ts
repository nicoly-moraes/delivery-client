import { createRouter, createWebHistory } from "vue-router"
import AdminLayout from "@/layouts/AdminLayout.vue"
import AppLayout from "@/layouts/AppLayout.vue"
import AppHomePage from "@/pages/AppHomePage.vue"
import AppRestaurantPage from "@/pages/AppRestaurantPage.vue"
import AppLoginPage from "@/pages/AppLoginPage.vue"
import AppAuthLayout from "@/layouts/AppAuthLayout.vue"
import AppRegisterPage from "@/pages/AppRegisterPage.vue"

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      name: "app",
      path: "/",
      component: AppLayout,
      children: [
        {
          name: "home",
          path: "",
          component: AppHomePage,
        },
        {
          name: "restaurants",
          path: "/restaurant/:id",
          component: AppRestaurantPage,
        },
      ]
    },
    {
      name: "auth",
      path: "/",
      component: AppAuthLayout,
      children: [
        {
          name: "login",
          path: "/login",
          component: AppLoginPage,
        },
        {
          name: "register",
          path: "/register",
          component: AppRegisterPage,
        },
      ]
    },
  ],
})

export default router
