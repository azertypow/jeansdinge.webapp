import{d,A as _,s as m,_ as u,r as p,o as e,c as t,a,F as n,b as i,t as r,e as v,n as h,f as b}from"./index.6215b0dc.js";const g=d({components:{ArticleContainer:_},data(){return{globalState:m()}},computed:{sortedArticle(){}}});const y={class:"v-media"},S={class:"v-media__header"},f={key:0},j={class:"v-media__intro"},P=["innerHTML"],C={class:"v-media__item"},M={class:"v-media__item__grid"};function $(s,A,B,L,N,V){const c=p("article-container");return e(),t("div",y,[a("header",S,[(e(!0),t(n,null,i(s.globalState.apiProjects,(o,l)=>(e(),t("button",{class:h({"is-active":l==="symposium"})},r(l),3))),256))]),s.globalState.apiProjects.symposium?(e(),t("main",f,[a("div",j,[a("h3",null,r(s.globalState.apiProjects.symposium.description_title),1),a("h5",null,r(s.globalState.apiProjects.symposium.description_author),1),(e(!0),t(n,null,i(s.globalState.apiProjects.symposium.text,o=>(e(),t("div",null,[a("div",{innerHTML:o},null,8,P)]))),256))]),a("section",C,[(e(!0),t(n,null,i(s.globalState.apiProjects.symposium.children,o=>(e(),t("div",M,[b(c,{style:{"border-bottom":"none"},"article-data":o},null,8,["article-data"])]))),256))])])):v("",!0)])}const F=u(g,[["render",$]]);export{F as default};
