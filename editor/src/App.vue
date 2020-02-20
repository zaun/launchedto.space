<template lang="pug">
v-app
  v-app-bar(app, clipped-left, dark, dense, src="@/assets/banner1.jpg")
    v-btn.mr-3(fab, small, text, to="/")
      v-img(width="40", src="@/assets/logo.png")
    v-toolbar-title Editor
    v-spacer
    v-btn(text, :to="getRocketLink()", :disbled="isLoading") Rockets
    v-btn(text, to="/launches", :disbled="isLoading") Launches
    v-btn(text, to="/astronauts", :disbled="isLoading") Astronauts
  v-navigation-drawer(
    app, clipped, permanent, v-if="showNavDrawer && !isLoading"
  )
    v-progress-circular(indeterminate, v-if="isUpdating")
    .d-flex.flex-column.fill-height
      .flex-grow-1.scroll-box
        .scrolled(sticky-container)
          v-list.px-0(v-if="!isUpdating", nav, dense)
            v-list-item.pl-1(
              link,
              v-if="!isGroup",
              v-for="item in items",
              :input-value="itemIsSelected(item)",
              @click="itemOnClick(item)"
              :to="itemLink(item)"
              :two-line="itemSubTitle(item) !== ''"
            )
              v-list-item-avatar
                v-avatar(:color="itemAvatarColor(item)") {{ itemAbbreviation(item) }}
              v-list-item-content
                v-list-item-title {{ itemTitle(item) }}
                v-list-item-subtitle {{ itemSubTitle(item) }}
            template.px-0(
              v-if="isGroup",
              v-for="item in items",
              :input-value="itemIsSelected(item)",
            )
              div(v-sticky, style="background-color: white;")
                v-divider
                v-list-item.ma-0(dense)
                  v-list-item-title.text-center {{ itemTitle(item) }}
                  v-list-item-action.ma-0
                    v-btn(text, fab, small, @click="addItem(item)")
                      v-icon mdi-plus
                v-divider
              v-list-item.pl-1(
                link,
                v-for="rocket in item.rockets",
                :input-value="itemIsSelected(rocket)",
                @click="itemOnClick(rocket)",
                :to="itemLink(rocket, item)"
              )
                v-list-item-avatar
                  v-avatar(:color="itemAvatarColor(rocket)") {{ itemAbbreviation(rocket) }}
                v-list-item-title {{ rocket.name }}
      .flex-grow-0
        v-toolbar(dense)
          v-spacer
          v-btn(outlined, v-if="isGroup", @click="addGroup") Add Group
          v-btn(outlined, v-if="!isGroup", @click="addItem") Add Item
          v-spacer
  v-content(v-if="!isUpdating && !isLoading")
    router-view
</template>

<script>
import {
  computed,
  createComponent,
  provide,
  reactive,
  ref,
  watch,
} from '@vue/composition-api';
import EventBus from './plugins/bus';
import store from './store';
import { provideRouter, useRouter } from './router';

export default createComponent({
  setup(props) {
    provideRouter();

    const router = useRouter();
    const routerName = ref('');
    const showNavDrawer = ref(false);
    const isLoading = ref(true);
    const isUpdating = ref(false);
    const isGroup = ref(false);

    const getRocketLink = () => {
      if (store.getters.rockets.length > 0) {
        const fam = store.getters.rockets[0];
        return `/rockets/${fam.id}`;
      }
      return '/rockets';
    };

    /**
     * Item list
     */
    const items = ref([]);
    const selectedItem = ref(null);
    const itemIsSelected = item => selectedItem.value !== null && selectedItem.value.id === item.id;
    const itemAvatarColor = item => (itemIsSelected(item) ? 'gray' : 'gray lighten-1');
    const itemOnClick = (item) => {
      selectedItem.value = item;
    };
    const itemAbbreviation = (item) => {
      const route = router.currentRoute;
      let abbr = '';
      if (route.name === 'astronauts') {
        abbr = '';
        if (item.firstName) {
          abbr += item.firstName.charAt(0).toUpperCase();
        }
        if (item.lastName) {
          abbr += item.lastName.charAt(0).toUpperCase();
        }
      } else if (route.name === 'launches') {
        abbr = item.date;
      } else if (route.name === 'rockets') {
        abbr = (item.name || '').substring(0, 2).toUpperCase();
      }
      return abbr;
    };

    const itemTitle = (item) => {
      const route = router.currentRoute;
      let title = '';
      if (route.name === 'astronauts') {
        title = `${item.firstName} ${item.lastName}`;
      } else if (route.name === 'launches') {
        if (item.serial) {
          title = item.serial;
        }
      } else if (route.name === 'rockets') {
        title = item.name;
      }
      return title;
    };

    const itemSubTitle = (item) => {
      const route = router.currentRoute;
      let title = '';
      if (route.name === 'launches') {
        if (item.launchPad) {
          title = `${item.launchSite} (${item.launchPad})`;
        } else {
          title = item.launchSite;
        }
      }
      return title;
    };

    const itemLink = (item, group) => {
      const route = router.currentRoute;
      let link = '';
      if (route.name === 'astronauts') {
        link = '/astronauts/';
        if (item != null) {
          link += item.id;
        }
      } else if (route.name === 'launches') {
        link = '/launches/';
        if (item != null) {
          link += item.id;
        }
      } else if (route.name === 'rockets' && group) {
        link = `/rockets/${group.id}/`;
        if (item != null) {
          link += item.id;
        }
      }
      return link;
    };

    // Route related items
    let lastRoute = '';
    const updateList = (autoSelectId) => {
      const route = router.currentRoute;
      if ((lastRoute === route.name && !autoSelectId)
          || (lastRoute === route.name && router.currentRoute.params.id === autoSelectId)) {
        return;
      }
      routerName.value = route.name;

      isUpdating.value = true;
      isGroup.value = false;
      items.value.length = 0;
      lastRoute = route.name || '';
      selectedItem.value = null;

      if (route.name === 'home') {
        showNavDrawer.value = false;
        isUpdating.value = false;
        items.value.length = 0;
      } else if (route.name === 'astronauts') {
        showNavDrawer.value = true;
        const promises = store.getters.astronauts().map(i => new Promise((resolve, reject) => {
          setTimeout(() => {
            items.value.push(i);
            resolve();
          });
        }));

        Promise.all(promises).then(() => {
          items.value.sort((a, b) => {
            const afn = a.firstName || '';
            const aln = a.lastName || '';
            const bfn = b.firstName || '';
            const bln = b.lastName || '';
            if ((aln + afn).toUpperCase() < (bln + bfn).toUpperCase()) {
              return -1;
            }
            return 1;
          });
          isUpdating.value = false;
        }).then(() => {
          if (autoSelectId) {
            selectedItem.value = _.find(items.value, { id: autoSelectId });
            if (router.currentRoute.params.id !== autoSelectId) {
              router.push({
                name: 'astronauts',
                params: {
                  id: autoSelectId,
                },
              });
            }
          }
        });
      } else if (route.name === 'launches') {
        showNavDrawer.value = true;
        const promises = store.getters.launches().map(i => new Promise((resolve, reject) => {
          setTimeout(() => {
            items.value.push(i);
            resolve();
          });
        }));

        Promise.all(promises).then(() => {
          items.value.sort((a, b) => {
            if (a.date < b.date) {
              return -1;
            }
            return 1;
          });
          isUpdating.value = false;
        }).then(() => {
          if (autoSelectId) {
            selectedItem.value = _.find(items.value, { id: autoSelectId });
            if (router.currentRoute.params.id !== autoSelectId) {
              router.push({
                name: 'launches',
                params: {
                  id: autoSelectId,
                },
              });
            }
          }
        });
      } else if (route.name === 'rockets') {
        showNavDrawer.value = true;
        isGroup.value = true;
        const promises = store.getters.rockets().map(i => new Promise((resolve, reject) => {
          setTimeout(() => {
            items.value.push(i);
            resolve();
          });
        }));

        Promise.all(promises).then(() => {
          items.value.sort((a, b) => {
            if (a.name < b.name) {
              return -1;
            }
            return 1;
          });
          isUpdating.value = false;
        });
      }
    };

    // Load data
    store.mutations.loadAll().then(() => {
      isLoading.value = false;
      lastRoute = '';
      updateList();
    });

    const addItem = (group) => {
      router.push(itemLink(null, group));
    };

    const addGroup = () => {
      selectedItem.value = null;
      EventBus.$emit('AddGroup');
    };

    EventBus.$on('refreshList', updateList);

    watch(
      () => router.currentRoute,
      () => updateList(),
    );

    return {
      routerName,
      getRocketLink,
      addItem,
      addGroup,
      isLoading,
      isUpdating,
      isGroup,
      showNavDrawer,
      items,
      selectedItem,
      itemAbbreviation,
      itemAvatarColor,
      itemIsSelected,
      itemOnClick,
      itemTitle,
      itemSubTitle,
      itemLink,
    };
  },
});
</script>

<style lang="sass">
.scroll-box
  position: relative
  padding-bottom: 20px

  .scrolled
    position: absolute
    top: 0
    bottom: 0
    left: 0
    right: 0
    overflow-y: auto
</style>
