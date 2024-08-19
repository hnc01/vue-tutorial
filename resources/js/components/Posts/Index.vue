<template>
    <div class="overflow-hidden overflow-x-auto p-6 bg-white border-gray-200">
        <div class="min-w-full align-middle">
            <div class="mb-4">
                <select v-model="selectedCategory" class="block mt-1 w-full sm:w-1/4 rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                    <option value="" selected>-- Filter by category --</option>
                    <option v-for="category in categories" :value="category.id" :key="category.id">
                        {{ category.name }}
                    </option>
                </select>
            </div>

            <table class="min-w-full divide-y divide-gray-200 border">
                <thead>
                <tr>
                    <th class="px-6 py-3 bg-gray-50 text-left">
                        <div class="flex flex-row items-center justify-between cursor-pointer" @click="updateOrdering('id')">
                            <div class="leading-4 font-medium text-gray-500 uppercase tracking-wider" :class="{ 'font-bold text-blue-600': orderColumn === 'id' }">
                                ID
                            </div>
                            <div class="select-none">
                                <span :class="{
                                        'text-blue-600': orderDirection === 'asc' && orderColumn === 'id',
                                        'hidden': orderDirection !== '' && orderDirection !== 'asc' && orderColumn === 'id',
                                    }">&uarr;</span>
                                <span :class="{
                                        'text-blue-600': orderDirection === 'desc' && orderColumn === 'id',
                                        'hidden': orderDirection !== '' && orderDirection !== 'desc' && orderColumn === 'id',
                                    }">&darr;</span>
                            </div>
                        </div>
                    </th>
                    <th class="px-6 py-3 bg-gray-50 text-left">
                        <div class="flex flex-row items-center justify-between cursor-pointer" @click="updateOrdering('title')">
                            <div class="leading-4 font-medium text-gray-500 uppercase tracking-wider" :class="{ 'font-bold text-blue-600': orderColumn === 'title' }">
                                Title
                            </div>
                            <div class="select-none">
                                    <span :class="{
                                        'text-blue-600': orderDirection === 'asc' && orderColumn === 'title',
                                        'hidden': orderDirection !== '' && orderDirection !== 'asc' && orderColumn === 'title',
                                    }">&uarr;</span>
                                <span :class="{
                                        'text-blue-600': orderDirection === 'desc' && orderColumn === 'title',
                                        'hidden': orderDirection !== '' && orderDirection !== 'desc' && orderColumn === 'title',
                                    }">&darr;</span>
                            </div>
                        </div>
                    </th>
                    <th class="px-6 py-3 bg-gray-50 text-left">
                        <span class="text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Category</span>
                    </th>
                    <th class="px-6 py-3 bg-gray-50 text-left">
                        <span class="text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Content</span>
                    </th>
                    <th class="px-6 py-3 bg-gray-50 text-left">
                        <div class="flex flex-row items-center justify-between cursor-pointer" @click="updateOrdering('created_at')">
                            <div class="leading-4 font-medium text-gray-500 uppercase tracking-wider" :class="{ 'font-bold text-blue-600': orderColumn === 'created_at' }">
                                Created at
                            </div>
                            <div class="select-none">
                                <span :class="{
                                    'text-blue-600': orderDirection === 'asc' && orderColumn === 'created_at',
                                    'hidden': orderDirection !== '' && orderDirection !== 'asc' && orderColumn === 'created_at',
                                }">&uarr;</span>
                                <span :class="{
                                    'text-blue-600': orderDirection === 'desc' && orderColumn === 'created_at',
                                    'hidden': orderDirection !== '' && orderDirection !== 'desc' && orderColumn === 'created_at',
                                }">&darr;</span>
                            </div>
                        </div>
                    </th>
                    <th class="px-6 py-3 bg-gray-50 text-left">
                        <span class="text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">Actions</span>
                    </th>
                </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200 divide-solid">

                <tr v-for="post in posts.data">
                    <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                        {{ post.id }}
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                        {{ post.title }}
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                        {{ post.category.name }}
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                        {{ truncate(post.content) }}
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                        {{ post.created_at }}
                    </td>
                    <td class="px-6 py-4 whitespace-no-wrap text-sm leading-5 text-gray-900">
                        <router-link :to="{ name: 'posts.edit', params: { id: post.id } }">Edit</router-link>
                    </td>
                </tr>
                </tbody>
            </table>

            <!-- We need to pass the selectCategory to the pagination function so that we paginate correctly-->
            <TailwindPagination :data="posts" @pagination-change-page="page => getPosts(page, selectedCategory)" class="mt-4"/>
        </div>
    </div>
</template>

<script setup>
// we need `watch` to monitor all changes happening to the selectCategory variable
import {onMounted, ref, watch} from "vue";
import {TailwindPagination} from 'laravel-vue-pagination';
import usePosts from "@/composables/posts";
import useCategories from "@/composables/categories";

// creating a variable that is reactive => actions can be taken when it changes
// the default value for it is ''
const selectedCategory = ref('')
// default values for these 2 variables are `created_at` and `desc`
const orderColumn = ref('created_at')
const orderDirection = ref('desc')
const {posts, getPosts} = usePosts();
const {categories, getCategories} = useCategories();

const truncate = (value, length = 50) => {
    if (value.length > length) {
        return value.substring(0, length) + "...";
    } else {
        return value;
    }
}

const updateOrdering = (column) => {
    orderColumn.value = column
    // we flip the order direction when we click on a column because if the user liked
    // the existing direction, he wouldn't have clicked
    orderDirection.value = (orderDirection.value === 'asc') ? 'desc' : 'asc'
    getPosts(1, selectedCategory.value, orderColumn.value, orderDirection.value)
}

onMounted(() => {
    getPosts()
    getCategories();
})

watch(selectedCategory, (current, previous) => {
    getPosts(1, current)
})
</script>
