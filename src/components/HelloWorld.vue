<template lang="pug">
.hello
  .container-fluid
    .row.text-center
      .col-12
        h2 {{ type.toUpperCase() }} {{ filterResources.length }}
  div
    .row.filters
      .col-6
        input.search.form-control(type='text', placeholder='Search', v-model='searchTerm')
      .col-6
        select.form-control(v-model='type')
          option(v-for='option in ["", "playing", "queue", "archived"]', :value='option') {{ option.toUpperCase() }}
  .container
    .row.text-left
      .col-12.col-md-4(v-for='resource in filterResources', :key='resource.appid')
        .card
          img(v-lazy='`http://media.steampowered.com/steamcommunity/public/images/apps/${resource.appid}/${resource.img_logo_url}.jpg`')
          strong {{resource.name}}
          button.btn.btn-primary(@click='mark("playing", resource)') Playing
          button.btn.btn-primary(@click='mark("queue", resource)') Queue
          button.btn.btn-primary(@click='mark("archived", resource)') Archive
</template>

<script>
import { ModelSelect } from 'vue-search-select';
import axios from 'axios';
import sortBy from 'lodash/sortBy';

export default {
  name: 'HelloWorld',
  components: {
    ModelSelect,
  },
  metaInfo() {
    const title = 'Ologies Podcast';

    return {
      title,
      meta: [
        { vmid: 'description', name: 'description', content: title },
      ],
    };
  },
  async mounted() {
    const url = 'https://personal-steam-games-api.herokuapp.com';
    const response = await axios.get(url);

    this.resources = response.data;
    this.resources = sortBy(this.resources, [o => o.name]);
    console.log(this.resources.length);
  },
  data() {
    return {
      msg: 'Machine Learning Tutorials',
      type: '',
      resources: [],
      searchTerm: '',
      catOptions: [
        { value: 'Linear Algebra', text: 'Linear Algebra' },
      ],
      selectedCat: {
        value: '',
        text: '',
      },
    };
  },
  methods: {
    mark(type, game) {
      this.$store.commit('selectItem', {
        type,
        game,
      });
    },
    shouldShow(game) {
      const playing = this.playing[game.appid];
      const queue = this.queue[game.appid];
      const archived = this.archived[game.appid];

      const typeCorrect = this.type ? this[this.type][game.appid] : true;

      if (this.type) {
        return Boolean(typeCorrect);
      }

      return !playing && !queue && !archived;
    },
  },
  computed: {
    filterResources() {
      return this.resources.filter(item => this.shouldShow(item));
    },
    playing() {
      return this.$store.state.playing;
    },
    queue() {
      return this.$store.state.queue;
    },
    archived() {
      return this.$store.state.archived;
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  h1, h2 {
    font-weight: normal;
  }
  ul {
    list-style-type: none;
    padding: 0;
  }
  li {
    display: inline-block;
    margin: 0 10px;
  }
  a {
    color: #42b983;
  }

  h2 {
    margin-top: 2em;
    margin-bottom: 2em;
  }

  .logo {
    width: 125px;
    height: 125px;
    margin-bottom: 1em;
  }

  .header {
    background-image: url('https://cdn.shopify.com/s/files/1/2384/1915/files/OLOGIESTITLESLIDEwithmushroom_2048x.png?v=1517064763');
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    height: 300px;
    background-color: #FAF4DC;
    margin-bottom: 1em;
  }

  .search {
    border: none;
    box-shadow: 0 4px 30px 0 rgba(223,225,230,0.5);
    padding: 1em;
    font-size: 22px;
  }

  .filter-container {
    /* background: linear-gradient(to right, #E100FF, #0066ff); */
    background-color: #f9f7e3;
  }

  .filters {
    margin-bottom: 2em;
    max-width: 1140px;
    margin: 0 auto;
    padding-top: 1em;
    padding-bottom: 1em;
    margin-bottom: 1em;
  }

  .card {
    padding: 1em;
    min-height: 380px;
    background-color: #fff;
    box-shadow: 0 4px 30px 0 rgba(223,225,230,0.5);
    border-radius: 10px;
    margin-bottom: 1em;
    border: none;
  }

  .card .img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    background-position: center;
    background-size: contain;
  }

  .badge-primary {
    /* background: #FF6D4A; */
  }

  .badge {
    font-size: 14px;
    margin-bottom: 10px;
    cursor: pointer;
    display: inline-block;
    background-color: #fafafa;
    padding: 5px 10px;
    border-radius: 40px;
    color: #ccc;
    text-transform: lowercase;
  }

  .btn-primary {
    color: #999 !important;
    margin-right: 10px;
    border: 1px solid #f3f3f3;
    text-transform: uppercase;
    border-radius: 40px;
    padding: 5px 10px;
    font-weight: 600;
    font-size: 11px;
    background-color: #f9f7e3;
  }

  strong {
    /* color: #FF6D4A; */
    font-family: 'Poppins', sans-serif;
    margin-top: .5em;
    margin-bottom: .5em;
    font-size: 20px;
    font-weight: bold;
    color: #000;
  }

  a {
    color: #fff !important;
    width: 80px;
    position: absolute;
    bottom: 10px;
  }

  .share {
    width: 100%;
    margin-top: 1em;
  }

  .share a svg {
    height: 15px;
  }

  .share a {
    color: #ccc !important;
    width: 15px;
    height: 15px;
    display: inline-block;
    position: relative;
    margin-right: .5em;
  }
</style>
