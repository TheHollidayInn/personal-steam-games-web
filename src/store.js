import Vue from 'vue';
import Vuex from 'vuex';
import podcasts from './podcasts.json';

// const slugify = require('slugify');
let savedState = {};

try {
  const parsedState = JSON.parse(localStorage.getItem('steamgames-state'));
  if (parsedState) savedState = parsedState;
} catch (e) {
}

const {
  playing,
  queue,
  archived,
} = savedState;

export function getStore() { // eslint-disable-line
  const store = new Vuex.Store({
    state: {
      playing: playing || {},
      queue: queue || {},
      archived: archived || {},
    },
    mutations: {
      selectItem(state, payload) {
        const { type, game } = payload;

        if (type === 'playing') {
          if (store.state.playing[game.appid]) {
            Vue.delete(store.state.playing, game.appid);
            return;
          }
          Vue.set(store.state.playing, game.appid, game);
        } else if (type === 'queue') {
          if (store.state.playing[game.appid]) {
            Vue.delete(store.state.queue, game.appid);
            return;
          }
          Vue.set(store.state.queue, game.appid, game);
        } else if (type === 'archived') {
          if (store.state.playing[game.appid]) {
            Vue.delete(store.state.archived, game.appid);
            return;
          }
          Vue.set(store.state.archived, game.appid, game);
        }

        localStorage.setItem('steamgames-state', JSON.stringify(store.state));
      },
    },
    getters: {
      filterItems: () => (searchTerm) => {
        if (!searchTerm) return podcasts;

        const result = podcasts.filter((res) => {
          const hasThing = res.title.toLowerCase().indexOf(searchTerm.toLowerCase()) !== -1;
          return hasThing;
        });

        return result;
      },
    },
  });

  return store;
}
