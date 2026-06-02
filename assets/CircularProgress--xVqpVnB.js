import{r as e}from"./chunk-DECur_0Z.js";import{n as t,t as n}from"./jsx-runtime-CP2iHdEU.js";import{A as r,C as i,L as a,R as o,b as s,i as c,nt as l,rt as u,x as d,y as f,z as p}from"./Box-BZ1r5v8P.js";import{t as m}from"./useId-DD2doQGK.js";var h=m;function g(e){return o(`MuiCircularProgress`,e)}a(`MuiCircularProgress`,[`root`,`determinate`,`indeterminate`,`colorPrimary`,`colorSecondary`,`svg`,`track`,`circle`,`circleDeterminate`,`circleIndeterminate`,`circleDisableShrink`]);var _=e(t()),v=n(),y=44,b=u`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`,x=u`
  0% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -15px;
  }

  100% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: -126px;
  }
`,S=typeof b==`string`?null:l`
        animation: ${b} 1.4s linear infinite;
      `,C=typeof x==`string`?null:l`
        animation: ${x} 1.4s ease-in-out infinite;
      `,w=e=>{let{classes:t,variant:n,color:i,disableShrink:a}=e;return r({root:[`root`,n,`color${s(i)}`],svg:[`svg`],track:[`track`],circle:[`circle`,`circle${s(n)}`,a&&`circleDisableShrink`]},g,t)},T=i(`span`,{name:`MuiCircularProgress`,slot:`Root`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.root,t[n.variant],t[`color${s(n.color)}`]]}})(f(({theme:e})=>({display:`inline-block`,variants:[{props:{variant:`determinate`},style:{transition:e.transitions.create(`transform`)}},{props:{variant:`indeterminate`},style:S||{animation:`${b} 1.4s linear infinite`}},...Object.entries(e.palette).filter(c()).map(([t])=>({props:{color:t},style:{color:(e.vars||e).palette[t].main}}))]}))),E=i(`svg`,{name:`MuiCircularProgress`,slot:`Svg`})({display:`block`}),D=i(`circle`,{name:`MuiCircularProgress`,slot:`Circle`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.circle,t[`circle${s(n.variant)}`],n.disableShrink&&t.circleDisableShrink]}})(f(({theme:e})=>({stroke:`currentColor`,variants:[{props:{variant:`determinate`},style:{transition:e.transitions.create(`stroke-dashoffset`)}},{props:{variant:`indeterminate`},style:{strokeDasharray:`80px, 200px`,strokeDashoffset:0}},{props:({ownerState:e})=>e.variant===`indeterminate`&&!e.disableShrink,style:C||{animation:`${x} 1.4s ease-in-out infinite`}}]}))),O=i(`circle`,{name:`MuiCircularProgress`,slot:`Track`})(f(({theme:e})=>({stroke:`currentColor`,opacity:(e.vars||e).palette.action.activatedOpacity}))),k=_.forwardRef(function(e,t){let n=d({props:e,name:`MuiCircularProgress`}),{className:r,color:i=`primary`,disableShrink:a=!1,enableTrackSlot:o=!1,size:s=40,style:c,thickness:l=3.6,value:u=0,variant:f=`indeterminate`,...m}=n,h={...n,color:i,disableShrink:a,size:s,thickness:l,value:u,variant:f,enableTrackSlot:o},g=w(h),_={},b={},x={};if(f===`determinate`){let e=2*Math.PI*((y-l)/2);_.strokeDasharray=e.toFixed(3),x[`aria-valuenow`]=Math.round(u),_.strokeDashoffset=`${((100-u)/100*e).toFixed(3)}px`,b.transform=`rotate(-90deg)`}return(0,v.jsx)(T,{className:p(g.root,r),style:{width:s,height:s,...b,...c},ownerState:h,ref:t,role:`progressbar`,...x,...m,children:(0,v.jsxs)(E,{className:g.svg,ownerState:h,viewBox:`${y/2} ${y/2} ${y} ${y}`,children:[o?(0,v.jsx)(O,{className:g.track,ownerState:h,cx:y,cy:y,r:(y-l)/2,fill:`none`,strokeWidth:l,"aria-hidden":`true`}):null,(0,v.jsx)(D,{className:g.circle,style:_,ownerState:h,cx:y,cy:y,r:(y-l)/2,fill:`none`,strokeWidth:l})]})})});export{h as n,k as t};