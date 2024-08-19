import {ref, reactive, inject} from 'vue'
import { useRouter } from "vue-router";
import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { ABILITY_TOKEN } from '@casl/vue';

// By defining user outside of useAuth(), you ensure that each time useAuth() is used it's working
// with a shared state. That way, if user is updated somewhere in your app, it is updated everywhere
// in your app, making the data reactive.
const user = reactive({
    name: '',
    email: '',
})

export default function useAuth() {
    const isSubmitting = ref(false)
    const validationErrors = ref({})
    const router = useRouter()
    const swal = inject('$swal')
    const ability = inject(ABILITY_TOKEN)

    const loginForm = reactive({
        email: '',
        password: '',
        remember: false
    })

    const submitLogin = async () => {
        if (isSubmitting.value) return

        isSubmitting.value = true
        validationErrors.value = {}

        axios.post('/login', loginForm)
            .then(async response => {
                loginUser(response)
            })
            .catch(error => {
                if (error.response?.data) {
                    validationErrors.value = error.response.data.errors
                }
            })
            .finally(() => isSubmitting.value = false)
    }

    const loginUser = async (response) => {
        user.name = response.data.name
        user.email = response.data.email

        localStorage.setItem('loggedIn', JSON.stringify(true))

        // wait for abilities to get loaded for the logged in user
        await getAbilities()
        // after we load the abilities, we can redirect to the index page
        await router.push({ name: 'posts.index' })
    }

    const getUser = () => {
        axios.get('/api/user')
            .then(response => {
                loginUser(response)
            })
    }

    const logout = async () => {
        if (isSubmitting.value) return

        isSubmitting.value = true

        axios.post('/logout')
            .then(response => router.push({ name: 'login' }))
            .catch(error => {
                swal({
                    icon: 'error',
                    title: error.response.status,
                    text: error.response.statusText
                })
            })
            .finally(() => {
                isSubmitting.value = false
            })
    }

    const getAbilities = async() => {
        axios.get('/api/abilities')
            .then(response => {
                const permissions = response.data
                const { can, rules } = new AbilityBuilder(createMongoAbility)

                can(permissions)

                ability.update(rules)
            })
    }

    return { loginForm, validationErrors, isSubmitting, submitLogin, user, getUser, logout, getAbilities }
}
