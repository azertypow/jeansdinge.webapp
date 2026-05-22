<template>
  <div
      v-show="isVisible"
      class="v-list-item"
      :class="{
        'is-open': isOpen,
      }"
  >
    <template
        v-if="imagePreviousIsOpen"
    >
      <img
          v-for="img of dataTag.img"
          alt="item image previous"
          :src="img.resize.xs"
          class="v-list-item__img-previous"
      >
    </template>
    <div
        class="v-list-item__header"
        @click="toggleOpenStatus()"
        @mouseenter="showImagePrevious()"
        @mouseleave="hiddeImagePrevious()"
    >
      <div
          class="v-list-item__icon-box"
      >
        <img
            v-if="dataTag.vimeoLink && $route.path === '/'"
            src="../assets/icons/play.svg"
            alt="icon info: this item contain a video"
        />

        <img
            v-if="hasBookArticleLinked && $route.path === '/'"
            src="../assets/icons/book.svg"
            alt="icon info: this item contain a book link"
        />
      </div>

      <div
          class="v-list-item--id v-list-item__coll jd-with-gutter"
      >
        {{ dataTag.id }}
      </div>
      <div
          class="v-list-item--title v-list-item__coll jd-with-gutter"
      >
        {{ dataTag.title }}
      </div>

<!--      <transition name="slide-fade">-->
        <div
            class="v-list-item__coll v-list-item__coll--tags jd-with-gutter"
            v-show="$route.path === '/'"
        >
          <tag
              v-for="tagName of dataTag.category"
              :name="tagName"
          ></tag>
        </div>
<!--      </transition>-->
    </div>

    <transition name="item__body">
      <div
          class="v-list-item__body"
          v-show="isOpen"
      >
        <div
            class="v-list-item__body__left"
        >
          <image-lazy-load
              v-for="(img, index) of dataTag.img"
              :key="index"
              :image-data="img"
              alt=""
              size="reg"
          />
        </div>
        <div
            class="v-list-item__body__right"
        >
          <div
              class="v-list-item__body__right__text-content"
              v-html="dataTag.text"
          ></div>

          <ul>
            <li><strong>Date:</strong     > {{new Date(dataTag.infoDate).getFullYear()}}</li>
            <li><strong>Object:</strong   > {{dataTag.infoObject}}</li>
            <li><strong>Dimension:</strong> {{dataTag.infoDimensions}}</li>
            <li><strong>Loan:</strong     > {{dataTag.infoLoan}}</li>
            <li><strong>Location:</strong > {{dataTag.infoLocation}}</li>
            <li><strong>Made:</strong     > {{dataTag.infoMade_in}}</li>
            <li><strong>Material:</strong > {{dataTag.infoMaterial}}</li>
            <li><strong>Price:</strong    > {{dataTag.infoPrice}}</li>
          </ul>

        </div>

      </div>
    </transition>

  </div>
</template>

<script lang="ts">
import {defineComponent} from "vue"
import type {PropType} from "vue"
import type {Api} from "@/Utils/api"
import Tag from "@/components/tag.vue"
import {stateStore} from "@/stores/stateStore"
import type {IVimeoOembed} from "@/Utils/vimeo";
import ImageLazyLoad from "@/components/ImageLazyLoad.vue";

export default defineComponent({
  components: {ImageLazyLoad, Tag},

  data() {
    return {
      globalState: stateStore(),
      imagePreviousIsOpen: false,
    }
  },

  methods: {
    toggleOpenStatus() {

      if(this.$route.name !== 'inventory') {
        this.globalState.itemToScrollOnInventoryIsOpen = this
        this.$router.push('/')
        return
      }

      this.globalState.currentOpenObject = this.isOpen ? null : this.dataTag;

      this.globalState.abstractActivatedFilterTagForArticle = this.isOpen ? this.dataTag.category : []

      this.globalState.updateFilteredArticles_bySection()

      this.setVimeoPlayerHTML()

      window.setTimeout(() => {
        document.querySelector('.v-list-container__scroll-box')?.scrollTo({
          behavior: 'smooth',
          top: this.$el.offsetTop - 101,
        })
      }, 150)
    },

    showImagePrevious() {
      this.imagePreviousIsOpen = true;
    },

    hiddeImagePrevious() {
      this.imagePreviousIsOpen = false;
    },

    async setVimeoPlayerHTML() {
      if( ! this.dataTag.vimeoLink || ! this.isOpen) {

        this.globalState.vimeoPlayerForRightPanelInInventoryPage = null

      } else {

        const vimeoUrl = 'https://vimeo.com/api/oembed.json?autopip=1&title=0&byline=0&portrait=0&color=025BFA&responsive=1&url=' + encodeURI(this.dataTag.vimeoLink)
        this.globalState.vimeoPlayerForRightPanelInInventoryPage = (await (await window.fetch(vimeoUrl)).json() as IVimeoOembed).html

      }


    }

  },

  props: {
    dataTag:   {
      required: true,
      type: Object as PropType<Api.IItem>,
    },

    isAlwaysOpen: {
      required: false,
      type: Boolean,
      default: false,
    },

    disableTagFilterAction: {
      required: false,
      type: Boolean,
      default: false,
    },
  },

  computed: {
    isOpen(): boolean {
      if(this.globalState.itemImageMode) return true
      if (this.isAlwaysOpen) return true
      return this.dataTag.slug === this.globalState.currentOpenObject?.slug
    },

    isVisible(): boolean {
      if(this.disableTagFilterAction) return true
      if(this.globalState.activatedFilterTag.length < 1) return true

      if( this.$route.name === ':projectSection' || this.$route.name === ':projectSection/:articleUid')
        return this.globalState.activatedFilterTag.some(category=> this.dataTag.category?.includes(category))

      return this.globalState.activatedFilterTag.every(category=> this.dataTag.category?.includes(category))
    },

    hasBookArticleLinked(): boolean {
      if(! this.globalState.apiProjects['denimpop']) return false


      return  Object.values(this.globalState.apiProjects['denimpop'].children).find(value => {

        if( ! value.Linkwith ) return false

        return value.Linkwith?.split(',').find(slugOfLinkedWidth => {
          return slugOfLinkedWidth.trim() === this.dataTag.slug
        }) !== undefined
      }) !== undefined
    }
  },

})</script>

<style lang="scss">
@import "../assets/scss-var";

.v-list-item {
  width: 100%;
  user-select: none;
  position: relative;
}

.v-list-item__header {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  border-bottom: solid 1px;
  align-items: center;
  cursor: pointer;
  background: white;
  z-index: 1;
  position: relative;
  height: 1.9rem;

  .v-list-item__icon-box {
    position: absolute;
    width: auto;
    right: 0;
    display: flex;
    height: 100%;
    background: white;
    align-items: center;
      z-index: 1;

    > * {
      display: block;
      height: 1rem;
      width: auto;
      margin-left: .5rem;
    }
  }

  .is-open & {
    border-bottom: none;
  }

  > .v-list-item__coll {
    box-sizing: border-box;
    width: calc(100% / 3);
    white-space: nowrap;

    @media (max-width: $break-width-xxs - 1) {
      padding: 0;

      &.v-list-item__coll--tags {
        overflow: auto;
        width: calc(100% / 3 * 2);
        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */
        padding-right: 2rem;

          &:after {
              position: absolute;
              content: '';
              background: linear-gradient(to right, rgba(255, 255, 255, 0), white 50%);
              right: 0;
              top: 0;
              width: 1rem;
              height: 100%;
          }

        &::-webkit-scrollbar {
          display: none;
        }
      }
    }

  }

  .v-list-item--id {
    transition: padding-left .25s 1s linear;
  }

  .is-projects & > .v-list-item__coll {
    width: calc(100%);

    &.v-list-item--id {
      width: 3em;
      padding: 0;
      flex-shrink: 0;
    }
  }
}

.v-list-item__img-previous {
  display: block;
  position: absolute;
  top: 0;
  left: 4rem;
  width: calc( 100% / 3 - 3rem);
  height: auto;
  z-index: 10;
  pointer-events: none;

  .is-projects & {
    width: calc( 100% - 4rem);
  }

  .is-open & {
    display: none !important;
  }
}

.v-list-item__body {
  display: flex;
  flex-wrap: nowrap;
  border-bottom: solid 1px;
  padding-bottom: 1rem;

  .is-projects & {
    flex-direction: column;

    > * {
      width: 100%;
    }
  }

  .device-mobile & {
    flex-direction: column;

    > * {
      width: 100%;
    }
  }
}

.v-list-item__body__left {
  width: calc(100% / 3 * 2);
  box-sizing: border-box;
  padding-right: .5rem;

  img {
    display: block;
    width: 100%;
    height: auto;
  }

  .is-projects & {
    margin-bottom: 1rem;
    padding-right: 0;
  }
}

.v-list-item__body__right {
  width: calc(100% / 3);
  box-sizing: border-box;
  padding-left: .5rem;

  > ul {
    padding: 0;

    li {
      display: block;
      padding: 0;
    }

    .is-projects & {
      display: none;
    }
  }

  .is-projects & {
    padding-left: 0;
  }
}

.v-list-item__body__right__text-content {
  > *:first-child {
    margin-top: 0;
  }

  > *:last-child {
    margin-bottom: 0;
  }
}

.v-list-item--id,
.v-list-item--title {
  font-weight: 500;
}

.v-list-item--title {
  overflow: hidden;
    position: relative;

    &:after {
        position: absolute;
        content: '';
        background: linear-gradient(to right, rgba(255, 255, 255, 0), white 50%);
        right: 0;
        top: 0;
        width: 1rem;
        height: 100%;
    }
}

.v-list-item--id {
  display: none;
  transition: width .5s 1s ease-in-out;

  @media (min-width: $break-width-xxs) {
    display: block;
  }

  @media (max-width: $break-width-reg) {
    width: 3rem !important;
  }
}

.v-list-item__vimeo {
  width: 100%;
  position: relative;

  > iframe {
    width: 100%;
    height: auto;
  }

  .is-projects & {
    display: none;
  }
}

</style>
