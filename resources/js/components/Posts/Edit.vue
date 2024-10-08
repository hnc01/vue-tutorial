<template>
    <form @submit.prevent="updatePost(post.id, form)">
        <!-- Title -->
        <div>
            <label for="post-title" class="block text-sm font-medium text-gray-700">
                Title
            </label>
            <input v-model="form.title" id="post-title" type="text" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
            <div class="text-red-600 mt-1">
                <div v-for="message in validationErrors?.title">
                    {{ message }}
                </div>
            </div>
        </div>

        <!-- Content -->
        <div class="mt-4">
            <label for="post-content" class="block text-sm font-medium text-gray-700">
                Content
            </label>
            <textarea v-model="form.content" id="post-content" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"></textarea>
            <div class="text-red-600 mt-1">
                <div v-for="message in validationErrors?.content">
                    {{ message }}
                </div>
            </div>
        </div>

        <!-- Category -->
        <div class="mt-4">
            <label for="post-category" class="block text-sm font-medium text-gray-700">
                Category
            </label>
            <select v-model="form.category_id" id="post-category" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50">
                <option value="" selected>-- Choose category --</option>
                <option v-for="category in categories" :value="category.id">
                    {{ category.name }}
                </option>
            </select>
            <div class="text-red-600 mt-1">
                <div v-for="message in validationErrors?.category_id">
                    {{ message }}
                </div>
            </div>
        </div>

        <!-- Thumbnail -->
        <div class="mt-4">
            <label for="thumbnail" class="block font-medium text-sm text-gray-700">
                Thumbnail
            </label>
            <img v-if="form.thumbnail" src="{{form.thumbnail}}" alt="post image">
            <!--  The problem with the file input is that we cannot use v-model="thumbnail". As you can see instead of v-model
            we used @change="post.thumbnail = $event.target.files[0]"-->
            <input @change="form.thumbnail = $event.target.files[0]" type="file" id="thumbnail"/>
            <div class="text-red-600 mt-1">
                <div v-for="message in validationErrors?.thumbnail">
                    {{ message }}
                </div>
            </div>
        </div>

        <!-- Buttons -->
        <div class="mt-4">
            <button :disabled="isSubmitting" class="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm uppercase text-white disabled:opacity-75 disabled:cursor-not-allowed">
                <span v-show="isSubmitting" class="inline-block animate-spin w-4 h-4 mr-2 border-t-2 border-t-white border-r-2 border-r-white border-b-2 border-b-white border-l-2 border-l-blue-600 rounded-full"></span>

                <span v-if="isSubmitting">Processing...</span>
                <span v-else>Save</span>
            </button>
        </div>
    </form>
</template>

<script setup>
import {onMounted, reactive, watch} from "vue";
import {useRoute} from "vue-router";
import useCategories from "@/composables/categories";
import usePosts from "@/composables/posts";

const {categories, getCategories} = useCategories()
// in the Edit, instead of creating our own post object, we fetch it from
// the composable because it's already filled by `getPost`
const {post, getPost, updatePost, validationErrors, isSubmitting} = usePosts()
// we need to get the ID of the post we want to edit from the URL
const route = useRoute()

const form = reactive({
    title: '',
    content: '',
    category_id: '',
    thumbnail: ''
})

watch(post, async (newPost) => {
    form.title = newPost.title;
    form.content = newPost.content;
    form.category_id = newPost.category.id;
    form.thumbnail = newPost.thumbnail;
});

onMounted(() => {
    getPost(route.params.id)
    getCategories()
})
</script>
