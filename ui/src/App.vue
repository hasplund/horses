<template>
  <div class="app">
    <b-container>
      <div>
        <b-table striped hover :items="posts"></b-table>
      </div>
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
        items: [
          {age: 40, first_name: 'Dickerson', last_name: 'Macdonald'},
          {age: 21, first_name: 'Larsen', last_name: 'Shaw'},
          {age: 89, first_name: 'Geneva', last_name: 'Wilson'},
          {age: 38, first_name: 'Jami', last_name: 'Carney'}
        ],
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
            // cards[item]=response.data[item];
            // cards[item] = response.data[item];
            cards[item] = {
              'cardId': response.data[item]['cardId'],
              'active': response.data[item]['active'],
              'trackName': response.data[item].trackName,
              'meetDate': response.data[item].meetDate
            }
            console.log(cards[item])
          }
          this.posts = cards;
        })
    }
  }
</script>
