import {ref, inject} from 'vue'
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
    const post = ref({})
    const router = useRouter();
    const validationErrors = ref({});
    const isSubmitting = ref(false); // by default the form isn't submitting
    // The keyword inject is used to read the value from a parent
    // component that used the provide keywords to provide this value.
    // In this case, '$swal' is the key for the value that was provided
    // higher in the component tree.
    const swal = inject('$swal')

    const updatePost = async (id, post) => {
        if (isSubmitting.value) return;

        isSubmitting.value = true
        validationErrors.value = {}

        axios.put('/api/posts/' + id, post)
            .then(response => {
                router.push({name: 'posts.index'});

                swal({
                    icon: 'success',
                    title: 'Post updated successfully'
                })
            })
            .catch(error => {
                if (error.response?.data) {
                    validationErrors.value = error.response.data.errors
                }
            })
            .finally(() => isSubmitting.value = false)
    }

    const storePost = async (post) => {
        // if the form is already submitting, don't proceed with request
        if (isSubmitting.value) return;

        // else set it to submitting
        isSubmitting.value = true;

        // reset the validation errors to empty
        validationErrors.value = {};

        // to post the file, we need to make a FormData Object and pass that to
        // an HTTP request instead of passing the post.
        let serializedPost = new FormData()

        for (let item in post) {
            if (post.hasOwnProperty(item)) {
                serializedPost.append(item, post[item])
            }
        }

        axios.post('/api/posts', serializedPost)
            .then(response => {
                // redirect to route posts.index if the request is successful
                router.push({name: 'posts.index'});

                swal({
                    icon: 'success',
                    title: 'Post saved successfully'
                })
            })
            .catch(error => {
                if (error.response?.data) {
                    validationErrors.value = error.response.data.errors
                }
            })
            // since we submitted the form and encountered errors, we need to set
            // isSubmitting to false so the user can resubmit after he faced errors
            .finally(() => isSubmitting.value = false)
    }

    const getPosts = async (page = 1,
                            search_category = '',
                            search_id = '',
                            search_title = '',
                            search_content = '',
                            search_global = '',
                            order_column = 'created_at',
                            order_direction = 'desc'
    ) => {
        axios.get('/api/posts?page=' + page +
            '&search_category=' + search_category +
            '&search_id=' + search_id +
            '&search_title=' + search_title +
            '&search_content=' + search_content +
            '&search_global=' + search_global +
            '&order_column=' + order_column +
            '&order_direction=' + order_direction)
            .then(response => {
                posts.value = response.data;
            })
    };

    const getPost = async (id) => {
        axios.get('/api/posts/' + id)
            .then(response => {
                post.value = response.data.data;
            })
    }

    const deletePost = async (id) => {
        swal({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this action!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            confirmButtonColor: '#ef4444',
            reverseButtons: true
        })
            .then(result => {
                if (result.isConfirmed) {
                    axios.delete('/api/posts/' + id)
                        .then(response => {
                            // since we are deleting on the index page, we need to manually
                            // refresh the list of posts because we don't redirect if we're on the page itself
                            getPosts();
                            router.push({ name: 'posts.index' })
                            swal({
                                icon: 'success',
                                title: 'Post deleted successfully'
                            })
                        })
                        .catch(error => {
                            swal({
                                icon: 'error',
                                title: 'Something went wrong'
                            })
                        })
                }
            })
    }

    return {post, posts, getPost, getPosts, storePost, updatePost, deletePost, validationErrors, isSubmitting}
}
