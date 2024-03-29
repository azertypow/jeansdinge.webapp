export namespace Api {
  export type ItemList = {[key: string]: IItem}

  export interface IItem {
    slug:           string
    title:          string
    id:             string
    text:           string
    category:     string[]
    infoObject:     string
    infoMaterial:   string[]
    infoDate:       string
    infoLocation:   string
    infoMade_in:    string
    infoPrice:      string
    infoDimensions: string
    infoLoan:       string
    img:            {[key: string]: IImage}
    vimeoLink:      string | null
  }

  export interface IContributors {
    activityList: string[],
    contributors: {
      name?:       string,
      first_name?: string,
      description?: string,
      activity?: string[]
    }[]
  }

  export interface IProjects {
    "symposium":      IProjectsSubpage
    "artist-videos":  IProjectsSubpage
    "articles":       IProjectsSubpage
    "projects":       IProjectsSubpage
    [key: string]:    IProjectsSubpage
  }

  export interface IProjectsSubpage {
    "title":                string
    "description_title":    string
    "description_subtitle": string
    "description_author":   string
    "text":                 {[key: string]: string}
    "children":             {[key: string]: IArticle}
  }

  export interface IImage {
    "url":      string
    "mediaUrl": string
    "width":    number
    "height":   number
    "resize": IImageResizes
  }

  export interface IImageResizes {
    "tiny":   string
    "xs":     string
    "small":  string
    "reg":    string
    "large":  string
  }

  export interface IArticle {
    parentUid: string,
    uid: string
    title: string,
    subtitle: string,
    "vimeoLink": string | null,
    "author": string,
    "category": string | null,
    "Linkwith": string | null,
    "description": string,
    "article_content": {[key: string]: string}
  }
}
