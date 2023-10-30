import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./routes";

import "./style.css";
import "virtual:uno.css";

createApp(App).use(router).use(createPinia()).mount("#root");
