<template>
  <div class="app">
    <ul v-if="posts && posts.length">
      <li v-for="post of posts">
        <p><strong>{{post.country}}</strong></p>
        <p>{{post.body}}</p>
      </li>
    </ul>

    <ul v-if="errors && errors.length">
      <li v-for="error of errors">
        {{error.message}}
      </li>
    </ul>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    data() {
      return {
        posts: [],
        errors: []
      }
    },

    // Fetches posts when the component is created.
    created() {
      //axios.get(`http://jsonplaceholder.typicode.com/posts`)
      axios.get(`http://localhost:3000/cards`)
        .then(response => {
          // JSON responses are automatically parsed.
          this.posts = response.data
        })
        .catch(e => {
          this.errors.push(e)
        })

      // async / await version (created() becomes async created())
      //
      // try {
      //   const response = await axios.get(`http://jsonplaceholder.typicode.com/posts`)
      //   this.posts = response.data
      // } catch (e) {
      //   this.errors.push(e)
      // }
    }
  }
</script>
