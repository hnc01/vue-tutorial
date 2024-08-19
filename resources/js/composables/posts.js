import {ref} from 'vue'
import {useRouter} from "vue-router";

/*
* In other words, composable is an equivalent of Service class in PHP/Laravel,
* and Vue component is using the Service method, like a Laravel Controller.
* */
export default function usePosts() {
    // Ref means reference which will make posts variable reactive.
    // In Vue.js, the term "reactive" means that a variable or object is
    // made to be responsive to changes. When a reactive variable changes,
    // the Vue.js reactivity system will track these changes and automatically
    // update the parts of the application that rely on those data.
    const posts = ref({});
    const router = useRouter();
    const validationErrors = ref({});
    const isSubmitting = ref(false); // by default the form isn't submitting

    const storePost = async (post) => {
        // if the form is already submitting, don't proceed with request
        if(isSubmitting.value) return;

        // else set it to submitting
        isSubmitting.value = true;

        // reset the validation errors to empty
        validationErrors.value = {};

        axios.post('/api/posts', post)
            .then(response => {
                // redirect to route posts.index if the request is successful
                router.push({ name: 'posts.index' })

                // since we are redirecting, we don't need to set isSubmitting to false
            })
            .catch(error => {
                if (error.response?.data) {
                    validationErrors.value = error.response.data.errors

                    // since we submitted the form and encountered errors, we need to set
                    // isSubmitting to false so the user can resubmit after he faced errors
                    isSubmitting.value = false;
                }
            })
    }

    const getPosts = async (page = 1,
                            category = '',
                            order_column = 'created_at',
                            order_direction = 'desc'
    ) => {
        axios.get('/api/posts?page=' + page +
            '&category=' + category +
            '&order_column=' + order_column +
            '&order_direction=' + order_direction)
            .then(response => {
                posts.value = response.data;
            })
    };

    return {posts, getPosts, storePost, validationErrors, isSubmitting}
}
