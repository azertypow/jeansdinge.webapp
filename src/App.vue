<template>
  <div
      class="v-app"
  >
    <header>
      <app-header></app-header>
    </header>

    <div class="v-app__body">
      <div
          class="v-app__body__left"
      >
        <list-container></list-container>
      </div>

      <div
          class="v-app__body__right"
      >
        <RouterView />
      </div>
    </div>

    <footer>
      <app-footer></app-footer>
    </footer>
  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue"
import AppHeader from "@/components/AppHeader.vue"
import AppFooter from "@/components/AppFooter.vue"
import ListContainer from "@/components/ListContainer.vue"

export default defineComponent({
  components: {ListContainer, AppFooter, AppHeader, },

  computed: {},

})</script>

<style lang="scss">
.v-app {
  padding-top: 4rem;
  > header {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 10;
  }

  > footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 10;
  }
}

.v-app__body {
  display: flex;
  flex-wrap: nowrap;
}

.v-app__body__left {
  padding-right: .5rem;
  width: 75%;
  transition: width 500ms ease-in-out;

  .is-media & {
    width: 25%;
  }
}

.v-app__body__right {
  color: var(--jd-color--secondary);
  width: 25%;
  padding-left: .5rem;
  padding-right: .5rem;

  .is-media & {
    width: 75%;
  }
}
</style>