import{g as s,a,b as n,j as r,i,e as c,v as u,k as _}from"./index-DfSrBLHd.js";const h=c("h1",null,"로그인해주세요",-1),b={__name:"BeforeLogin",setup(l){const t=async()=>{const{error:e}=await u.auth.signInWithOAuth({provider:"github",options:{redirectTo:"https://yu-hazel.github.io/bookeep/"}});e&&console.error("Error: ",e.message)};return(e,p)=>{const o=s("v-btn");return a(),n("div",null,[h,r(o,{onClick:t},{default:i(()=>[_("깃허브로 로그인")]),_:1})])}}};export{b as default};
