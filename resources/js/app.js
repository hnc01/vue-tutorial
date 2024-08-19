import './bootstrap';

import {createApp} from 'vue'
import App from './layouts/App.vue'
import router from './routes/index'
import VueSweetalert2 from 'vue-sweetalert2';

// we don't need to define the components in `createApp` because
// they are defined in router
createApp(App)
    .use(router)
    .use(VueSweetalert2)
    .mount('#app')
