<template>
  <div class="app">
    <b-container>
      <table v-if="posts && posts.length">
        <th>Track name</th>
        <th>Country</th>
        <th>Race Type</th>
        <th>Card ID</th>
        <tr v-for="post of posts">
          <td>{{ post.trackName }}</td>
          <td>{{ post.country }}</td>
          <td>{{ post.raceType }}</td>
          <td>{{ post.cardId}}</td>
        </tr>
      </table>
    </b-container>
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
    // Fetches cards when the component is created.
    created() {
      axios.get('http://localhost:3000/cards')
        .then(response => {
          let cards = []
          for (let item in response.data) {
            cards[item]=response.data[item];
          }
          this.posts = cards;
        })
    }
  }
</script>
