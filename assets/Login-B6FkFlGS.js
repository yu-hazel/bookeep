import{f as _,u as k,z as y,g as e,a as h,h as B,i as t,j as o,k as c,A as S,v as U}from"./index-DfSrBLHd.js";const C={__name:"Login",setup(j){const n=_(""),l=_(""),d=k(),m=y(),i=async()=>{const{user:r,error:a}=await U.auth.signIn({email:n.value,password:l.value});a?alert("로그인 실패: "+a.message):(d.setUser(r),m.push("/"))};return(r,a)=>{const p=e("v-card-title"),u=e("v-text-field"),v=e("v-btn"),f=e("v-form"),w=e("v-card-text"),b=e("v-card"),x=e("v-col"),V=e("v-row"),g=e("v-container");return h(),B(g,null,{default:t(()=>[o(V,{justify:"center"},{default:t(()=>[o(x,{cols:"12",md:"6"},{default:t(()=>[o(b,null,{default:t(()=>[o(p,{class:"headline"},{default:t(()=>[c("로그인")]),_:1}),o(w,null,{default:t(()=>[o(f,{onSubmit:S(i,["prevent"])},{default:t(()=>[o(u,{modelValue:n.value,"onUpdate:modelValue":a[0]||(a[0]=s=>n.value=s),label:"Email",required:""},null,8,["modelValue"]),o(u,{modelValue:l.value,"onUpdate:modelValue":a[1]||(a[1]=s=>l.value=s),label:"Password",type:"password",required:""},null,8,["modelValue"]),o(v,{type:"submit",color:"primary"},{default:t(()=>[c("로그인")]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1})}}};export{C as default};
