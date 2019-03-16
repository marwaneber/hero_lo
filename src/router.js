import Vue from "vue";
import Router from "vue-router";
import partager from "@/comps/partager";
import search from "@/comps/search";
import recents from "@/comps/recents";
import eachPost from "@/comps/eachPost";
import page_404 from "@/comps/page_404";
import signin from "@/comps/auth";
import firebase from "@/fb.js";
Vue.use(Router);
var route = new Router({
  routes: [
    {
      path: "/",
      name: "Home",
      component: recents,
      meta: {
        auth: true
      }
    },
    {
      path: "/Post/:post_id",
      name: "EachPost",
      component: eachPost,
      meta: {
        auth: true
      }
    },
    {
      path: "/partager",
      name: "Partager",
      component: partager,
      meta: {
        auth: true
      }
    },
    {
      path: "/search",
      name: "Search",
      component: search,
      meta: {
        auth: true
      }
    },
    {
      path: "/auth",
      name: "Signing",
      component: signin
    },
    {
      path: "*",
      name: "404",
      component: page_404
    }
  ]
});
route.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.auth)) {
    if (firebase.auth().currentUser) {
      next();
    } else {
      next({ path: "/auth" });
    }
  } else {
    next();
  }
});

export default route;
