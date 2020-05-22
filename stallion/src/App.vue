<template>
    <v-app>
        <v-container class="grey lighten-5">
            <v-row no-gutters>
                <v-col
                        v-for="n in posts"
                        :key="n.cardId"
                        cols="3"
                        sm="4"
                >
                    <v-card
                            class="pa-2"
                            outlined
                            tile
                    >
                        <v-list-item three-line>
                            <v-list-item-content>
                                <div class="overline mb-4">{{ n.meetDate }}</div>
                                <v-list-item-title class="headline mb-1">{{ n. trackName}}</v-list-item-title>
                                <v-list-item-subtitle>Greyhound divisely hello coldly fonwderfully
                                </v-list-item-subtitle>
                            </v-list-item-content>
                        </v-list-item>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script>
    import axios from 'axios';

    export default {
        name: 'App',

        components: {},

        data: () => ({

        }),
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
                            'meetDate': response.data[item].meetDate,
                            'trackAbbreviation': response.data[item]['trackAbbreviation']
                        }
                    }
                    this.posts = cards;
                });
        }
    }
</script>