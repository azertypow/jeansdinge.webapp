import { defineStore } from 'pinia'
import type {Api} from "@/Utils/api"
import {getDeviceWidthSizeName} from "@/Utils/getDeviceWidthSizeName";

export const stateStore = defineStore('stateStore', {

  state: () => ({
    device: getDeviceWidthSizeName(),

    itemToScrollOnInventoryIsOpen: null as any,

    currentOpenObject: null as Api.IItem | null,
    apiData: {} as Api.ItemList,
    apiProjects: {} as Api.IProjects,
    apiContributors: {} as Api.IContributors,

    activatedFilterTag: [] as string[],
    abstractActivatedFilterTagForArticle: [] as string[],
    activatedFilterBySlug: [] as string[],
    objectByActivatedFilterBySlug: [] as Api.IItem[],

    itemImageMode: false,

    listItemPresentationMode: 'list' as 'list' | 'grid',

    footNotes: [] as {index: number, html: string}[],
    footNoteElements: [] as HTMLSpanElement[],

    menuIsOpen: false,
    creditIsOpen: false,

    filteredArticleBySections: {
      symposium: [],
      denimpop: [],
      exhibitions: [],
    } as {
      symposium:    Api.IArticle[],
      denimpop:     Api.IArticle[],
      exhibitions:  Api.IArticle[],
    },

    vimeoPlayerForRightPanelInInventoryPage: null as string | null
  }),

  getters: {
    filteredArticle(): Api.IArticle[] {

      let allProjectsArticle: Api.IArticle[] = []

      allProjectsArticle = allProjectsArticle.concat(Object.values( this.apiProjects['symposium']?.children || {} ))
      allProjectsArticle = allProjectsArticle.concat(Object.values( this.apiProjects['artist-videos']?.children || {} ))
      allProjectsArticle = allProjectsArticle.concat(Object.values( this.apiProjects['denimpop']?.children || {} ))
      allProjectsArticle = allProjectsArticle.concat(Object.values( this.apiProjects['exhibitions']?.children || {} ))

      if(this.activatedFilterTag.length === 0) return allProjectsArticle

      return allProjectsArticle.filter(article => {
        return this.activatedFilterTag.every(category=> article.category?.includes(category))
      })
    }
  },


  actions: {
    pushFooterNoteElement(articleDocument: Document, articleFootNote: Element) {
      if( ! (articleFootNote.parentElement instanceof HTMLElement) ) return

      const indexFoot = this.footNoteElements.length + 1

      const noteReferenceInText = articleFootNote.parentElement.insertBefore(articleDocument.createElement('span'), articleFootNote)
      noteReferenceInText.innerHTML = `&nbsp;[${indexFoot}]`
      noteReferenceInText.dataset.html = articleFootNote.innerHTML
      noteReferenceInText.dataset.index = indexFoot.toString()
      noteReferenceInText.className = "v-article-block-note-reference"
      this.footNoteElements.push( noteReferenceInText )

      document.querySelector('.v-app__body__right')!.addEventListener('scroll', this.onScrollAction)
    },

    clearFootNoteListAndRemoveScrollListener() {
      this.footNotes = []
      this.footNoteElements = []
      document.querySelector('.v-app__body__right')!.removeEventListener('scroll', this.onScrollAction)
    },

    onScrollAction() {
      for (const footNoteElement of this.footNoteElements) {
        const footNoteIsVisibleOnScreen =
            footNoteElement.getBoundingClientRect().top > 50
            && footNoteElement.getBoundingClientRect().top < window.innerHeight

        const footNoteIsNotVisibleOnScreen = !footNoteIsVisibleOnScreen

        const keyOfNoteInGlobalArrayOfNoteToShow = this.footNotes.findIndex(value => {
          return value.index === parseInt(footNoteElement.dataset.index as string)
        })

        const footNoteIsNotInGlobalArrayOfNotesToShow = keyOfNoteInGlobalArrayOfNoteToShow < 0
        const footNoteIsInTheArrayOfNotesToShow = ! footNoteIsNotInGlobalArrayOfNotesToShow

        if ( footNoteIsVisibleOnScreen && footNoteIsNotInGlobalArrayOfNotesToShow ) {
          this.footNotes.push({
            index: parseInt(footNoteElement.dataset.index as string),
            html: footNoteElement.dataset.html as string
          })

          this.footNotes = this.footNotes.sort( (footNoteItemA, footNoteItemB) => {
            return footNoteItemA.index < footNoteItemB.index ? -1 : 1
          })
        }

        if(footNoteIsNotVisibleOnScreen && footNoteIsInTheArrayOfNotesToShow) {
          this.footNotes.splice(keyOfNoteInGlobalArrayOfNoteToShow, 1)
        }


      }
    },

    async updateFilteredArticles_bySection() {
      this.filteredArticleBySections.denimpop = await this.getFilteredArticle_bySection('denimpop')
      this.filteredArticleBySections.exhibitions = await this.getFilteredArticle_bySection('exhibitions')
      this.filteredArticleBySections.symposium = await this.getFilteredArticle_bySection('symposium')
    },

    pushTag(value: string) {
      if( this.activatedFilterTag.includes( value ) ) return
      this.activatedFilterTag.push(value)
      this.abstractActivatedFilterTagForArticle = this.activatedFilterTag

      this.updateFilteredArticles_bySection()
    },
    removeTag(value: string) {
      const indexOfMatchedTag = this.activatedFilterTag.findIndex((arrayValue) => {
        return arrayValue === value
      })

      this.activatedFilterTag.splice(indexOfMatchedTag, indexOfMatchedTag + 1)

      this.abstractActivatedFilterTagForArticle = this.activatedFilterTag

      this.updateFilteredArticles_bySection()
    },

    clearAllTag() {
      this.activatedFilterTag = []
      this.abstractActivatedFilterTagForArticle = this.activatedFilterTag
    },

    setActivatedFilterBySlug(listOfSlug: string[]) {
      this.activatedFilterBySlug = listOfSlug
      this.setObjectByActivatedFilterBySlug()
    },

    async setObjectByActivatedFilterBySlug() {

      if (this.activatedFilterBySlug.length < 1) this.objectByActivatedFilterBySlug = []

      else this.objectByActivatedFilterBySlug = Object.values( this.apiData ).filter((item) => {

        if(item.slug === null) return

        return this.activatedFilterBySlug.includes( item.slug )
      })
    },

    async getFilteredArticle_bySection(sectionName: 'symposium' | 'denimpop' | 'exhibitions'): Promise<Api.IArticle[]> {

      let allProjectsArticle: Api.IArticle[] = []

      allProjectsArticle = allProjectsArticle.concat(Object.values( this.apiProjects[sectionName]?.children || {} ))

      // return all articles if any object is open on the left screen, on inventory view
      if(this.abstractActivatedFilterTagForArticle.length === 0) return []

      // filter article if they are linked with current open item
      return allProjectsArticle.filter(article => {
        return article.Linkwith?.includes(this.currentOpenObject?.slug || '')
      })
    },
  },
})
