import{d as _,A as m,s as u,_ as p,r as l,o as e,c as a,a as s,F as n,b as r,t as i,e as h,f as g,w as v,n as b,g as y,h as S}from"./index.6ae513c9.js";const f=_({components:{ArticleContainer:m},data(){return{globalState:u()}},computed:{sortedArticle(){}}});const j={class:"v-media"},C={class:"v-media__header"},k={key:0},P={class:"v-media__intro"},L=["innerHTML"],$={class:"v-media__item"},w={class:"v-media__item__grid"};function B(t,M,N,V,A,T){const c=l("router-link"),d=l("article-container");return e(),a("div",j,[s("header",C,[(e(!0),a(n,null,r(t.globalState.apiProjects,o=>(e(),g(c,{class:b([{"is-active":o.title.toLowerCase()===t.$route.params.projectSection},"jd-button"]),to:o.title.toLowerCase()},{default:v(()=>[S(i(o.title),1)]),_:2},1032,["class","to"]))),256))]),t.globalState.apiProjects.symposium?(e(),a("main",k,[s("div",P,[s("h3",null,i(t.globalState.apiProjects.symposium.description_title),1),s("h5",null,i(t.globalState.apiProjects.symposium.description_author),1),(e(!0),a(n,null,r(t.globalState.apiProjects.symposium.text,o=>(e(),a("div",null,[s("div",{innerHTML:o},null,8,L)]))),256))]),s("section",$,[(e(!0),a(n,null,r(t.globalState.apiProjects.symposium.children,o=>(e(),a("div",w,[y(d,{style:{"border-bottom":"none"},"article-data":o},null,8,["article-data"])]))),256))])])):h("",!0)])}const H=p(f,[["render",B]]);export{H as default};
