var he=Object.create;var z=Object.defineProperty;var ve=Object.getOwnPropertyDescriptor;var ce=Object.getOwnPropertyNames;var ye=Object.getPrototypeOf,xe=Object.prototype.hasOwnProperty;var C=(e,r)=>()=>(r||e((r={exports:{}}).exports,r),r.exports);var Ae=(e,r,t,n)=>{if(r&&typeof r=="object"||typeof r=="function")for(let u of ce(r))!xe.call(e,u)&&u!==t&&z(e,u,{get:()=>r[u],enumerable:!(n=ve(r,u))||n.enumerable});return e};var Re=(e,r,t)=>(t=e!=null?he(ye(e)):{},Ae(r||!e||!e.__esModule?z(t,"default",{value:e,enumerable:!0}):t,e));var W=C((Ge,$)=>{typeof $=="object"&&typeof $.exports=="object"&&($.exports=M);M.defunct=function(e){throw new Error("Unexpected character at index "+(this.index-1)+": "+e)};function M(e){typeof e!="function"&&(e=M.defunct);var r=[],t=[],n=0;this.state=0,this.index=0,this.input="",this.addRule=function(i,d,c){var y=i.global;if(!y){var l="g";i.multiline&&(l+="m"),i.ignoreCase&&(l+="i"),i=new RegExp(i.source,l)}return Object.prototype.toString.call(c)!=="[object Array]"&&(c=[0]),t.push({pattern:i,global:y,action:d,start:c}),this},this.setInput=function(i){return n=0,this.state=0,this.index=0,r.length=0,this.input=i,this},this.lex=function(){if(r.length)return r.shift();for(this.reject=!0;this.index<=this.input.length;){for(var i=u.call(this).splice(n),d=this.index;i.length&&this.reject;){var c=i.shift(),y=c.result,l=c.length;this.index+=l,this.reject=!1,n++;var s=c.action.apply(this,y);if(this.reject)this.index=y.index;else if(typeof s!="undefined")switch(Object.prototype.toString.call(s)){case"[object Array]":r=s.slice(1),s=s[0];default:return l&&(n=0),s}}var A=this.input;if(d<A.length)if(this.reject){n=0;var s=e.call(this,A.charAt(this.index++));if(typeof s!="undefined")return Object.prototype.toString.call(s)==="[object Array]"?(r=s.slice(1),s[0]):s}else this.index!==d&&(n=0),this.reject=!0;else if(i.length)this.reject=!0;else break}};function u(){for(var i=[],d=0,c=this.state,y=this.index,l=this.input,s=0,A=t.length;s<A;s++){var f=t[s],R=f.start,o=R.length;if(!o||R.indexOf(c)>=0||c%2&&o===1&&!R[0]){var a=f.pattern;a.lastIndex=y;var h=a.exec(l);if(h&&h.index===y){var x=i.push({result:h,action:f.action,length:h[0].length});for(f.global&&(d=x);--x>d;){var v=x-1;if(i[x].length>i[v].length){var O=i[x];i[x]=i[v],i[v]=O}}}}}return i}}});var Z=C(()=>{String.fromCodePoint||function(){var e=function(){try{var u={},i=Object.defineProperty,d=i(u,u,u)&&i}catch(c){}return d}(),r=String.fromCharCode,t=Math.floor,n=function(u){var i=16384,d=[],c,y,l=-1,s=arguments.length;if(!s)return"";for(var A="";++l<s;){var f=Number(arguments[l]);if(!isFinite(f)||f<0||f>1114111||t(f)!=f)throw RangeError("Invalid code point: "+f);f<=65535?d.push(f):(f-=65536,c=(f>>10)+55296,y=f%1024+56320,d.push(c,y)),(l+1==s||d.length>i)&&(A+=r.apply(null,d),d.length=0)}return A};e?e(String,"fromCodePoint",{value:n,configurable:!0,writable:!0}):String.fromCodePoint=n}()});var k=C((P,H)=>{"use strict";Object.defineProperty(P,"__esModule",{value:!0});P.default=void 0;Z();var ge=/\\(u\{([0-9A-Fa-f]+)\}|u([0-9A-Fa-f]{4})|x([0-9A-Fa-f]{2})|([1-7][0-7]{0,2}|[0-7]{2,3})|(['"tbrnfv0\\]))|\\U([0-9A-Fa-f]{8})/g,Ee={0:"\0",b:"\b",f:"\f",n:`
`,r:"\r",t:"	",v:"\v","'":"'",'"':'"',"\\":"\\"},q=function(r){return String.fromCodePoint(parseInt(r,16))},me=function(r){return String.fromCodePoint(parseInt(r,8))},Se=function(r){return r.replace(ge,function(t,n,u,i,d,c,y,l){return u!==void 0?q(u):i!==void 0?q(i):d!==void 0?q(d):c!==void 0?me(c):l!==void 0?q(l):Ee[y]})};P.default=Se;H.exports=P.default});var ee=C(N=>{(function(e){var r=String.fromCharCode;function t(o){for(var a=[],h=0,x=o.length,v,O;h<x;)v=o.charCodeAt(h++),v>=55296&&v<=56319&&h<x?(O=o.charCodeAt(h++),(O&64512)==56320?a.push(((v&1023)<<10)+(O&1023)+65536):(a.push(v),h--)):a.push(v);return a}function n(o){for(var a=o.length,h=-1,x,v="";++h<a;)x=o[h],x>65535&&(x-=65536,v+=r(x>>>10&1023|55296),x=56320|x&1023),v+=r(x);return v}function u(o){if(o>=55296&&o<=57343)throw Error("Lone surrogate U+"+o.toString(16).toUpperCase()+" is not a scalar value")}function i(o,a){return r(o>>a&63|128)}function d(o){if((o&4294967168)==0)return r(o);var a="";return(o&4294965248)==0?a=r(o>>6&31|192):(o&4294901760)==0?(u(o),a=r(o>>12&15|224),a+=i(o,6)):(o&4292870144)==0&&(a=r(o>>18&7|240),a+=i(o,12),a+=i(o,6)),a+=r(o&63|128),a}function c(o){for(var a=t(o),h=a.length,x=-1,v,O="";++x<h;)v=a[x],O+=d(v);return O}function y(){if(f>=A)throw Error("Invalid byte index");var o=s[f]&255;if(f++,(o&192)==128)return o&63;throw Error("Invalid continuation byte")}function l(){var o,a,h,x,v;if(f>A)throw Error("Invalid byte index");if(f==A)return!1;if(o=s[f]&255,f++,(o&128)==0)return o;if((o&224)==192){if(a=y(),v=(o&31)<<6|a,v>=128)return v;throw Error("Invalid continuation byte")}if((o&240)==224){if(a=y(),h=y(),v=(o&15)<<12|a<<6|h,v>=2048)return u(v),v;throw Error("Invalid continuation byte")}if((o&248)==240&&(a=y(),h=y(),x=y(),v=(o&7)<<18|a<<12|h<<6|x,v>=65536&&v<=1114111))return v;throw Error("Invalid UTF-8 detected")}var s,A,f;function R(o){s=t(o),A=s.length,f=0;for(var a=[],h;(h=l())!==!1;)a.push(h);return n(a)}e.version="3.0.0",e.encode=c,e.decode=R})(typeof N=="undefined"?N.utf8={}:N)});var ie=C((He,B)=>{"use strict";var be=W(),Fe=k(),Ze=ee(),re=6,Oe=7,te=11,we=12,Le=13,Ce=14,_e=-1,Xe=-2,Te=-3,Ie=-4,Ue=-5,De=[[/\s*:\s*/,_e],[/\s*,\s*/,Xe],[/\s*{\s*/,Te],[/\s*}\s*/,Le],[/\s*\[\s*/,Ie],[/\s*\]\s*/,we],[/\s*\.\s*/,Ue]];function ne(e){return e=e.replace(/\\\//,"/"),Fe(e)}function Pe(e){let r=new be,t=0,n=0;return r.addRule(/"((?:\\.|[^"])*?)($|")/,(u,i)=>(t+=u.length,{type:te,value:ne(i),row:n,col:t,single:!1})),r.addRule(/'((?:\\.|[^'])*?)($|'|(",?[ \t]*\n))/,(u,i)=>(t+=u.length,{type:te,value:ne(i),row:n,col:t,single:!0})),r.addRule(/[\-0-9]*\.[0-9]*([eE][\+\-]?)?[0-9]*(?:\s*)/,u=>(t+=u.length,{type:re,value:parseFloat(u),row:n,col:t})),r.addRule(/\-?[0-9]+([eE][\+\-]?)[0-9]*(?:\s*)/,u=>(t+=u.length,{type:re,value:parseFloat(u),row:n,col:t})),r.addRule(/\-?[0-9]+(?:\s*)/,u=>(t+=u.length,{type:Oe,value:parseInt(u),row:n,col:t})),De.forEach(u=>{r.addRule(u[0],i=>(t+=i.length,{type:u[1],value:i,row:n,col:t}))}),r.addRule(/\s/,u=>{u==`
`?(t=0,n++):t+=u.length}),r.addRule(/\S[ \t]*/,u=>(t+=u.length,{type:Ce,value:u,row:n,col:t})),r.setInput(e),r}B.exports.lexString=ue;function ue(e,r){let t=Pe(e),n="";for(;n=t.lex();)r(n)}B.exports.getAllTokens=$e;function $e(e){let r=[];return ue(e,function(n){r.push(n)}),r}});var ae=C((ke,le)=>{"use strict";var qe=ie(),K=0,_=1,w=2,Q=3,V=4,j=5,Ne=6,pe=7,E=8,S=9,L=10,Ve=11,U=12,D=13,je=14,g=15,I=-1,m=-2,G=-3,X=-4;function oe(e){e.peek==null&&Object.defineProperty(e,"peek",{enumerable:!1,value:function(){return this[this.length-1]}}),e.last==null&&Object.defineProperty(e,"last",{enumerable:!1,value:function(r){return this[this.length-(1+r)]}})}function p(e,r){return e&&e.hasOwnProperty("type")&&e.type==r}le.exports.parse=Je;function Je(e,r){let t=[],n=[];oe(t),oe(n);let u=function(i){n.push(i)};qe.lexString(e,u),n[0].type==X&&n.last(0).type!=U&&n.push({type:U,value:"]",row:-1,col:-1}),n[0].type==G&&n.last(0).type!=D&&n.push({type:D,value:"}",row:-1,col:-1});for(let i=0;i<n.length;i++)for(""+n[i].type,t.push(n[i]);b(t););return t.length==1&&t[0].type==_&&(t=[{type:L,value:t[0].value}]),J(t[0],r)}function b(e){let r=e.pop();switch(r.type){case E:if(r.value.trim()=="true")return e.push({type:Q,value:"true"}),!0;if(r.value.trim()=="false")return e.push({type:Q,value:"false"}),!0;if(r.value.trim()=="null")return e.push({type:g,value:null}),!0;break;case je:return p(e.peek(),E)?(e.peek().value+=r.value,!0):(e.push({type:E,value:r.value}),!0);case pe:return p(r,pe)&&p(e.peek(),E)?(e.peek().value+=r.value,!0):(r.type=g,e.push(r),!0);case Ve:return r.type=g,r.value=r.value,e.push(r),!0;case Q:return r.type=g,r.value=="true"?r.value=!0:r.value=!1,e.push(r),!0;case Ne:return r.type=g,e.push(r),!0;case g:if(p(e.peek(),m))return r.type=j,e.pop(),e.push(r),!0;if(p(e.peek(),I))return r.type=V,e.pop(),e.push(r),!0;if(p(e.peek(),E)&&p(e.last(1),g)){let t=e.pop();return e.peek().value+='"'+t.value+'"',e.peek().value+=r.value,!0}if(p(e.peek(),E)&&p(e.last(1),w)){let t=e.pop(),n=e.peek().value.pop();return n+='"'+t.value+'"',n+=r.value,e.peek().value.push(n),!0}if(p(e.peek(),E)&&p(e.last(1),_)){let t=e.pop(),n=e.peek().value.pop(),u=r.single?"'":'"';return n.value+=u+t.value+u,n.value+=r.value,e.peek().value.push(n),!0}if(p(e.peek(),E)){let t=e.pop().value;return r.value=t+r.value,e.push(r),!0}break;case S:if(p(r,S)&&p(e.peek(),m))return r.type=j,e.pop(),e.push(r),!0;if(p(e.peek(),I))return r.type=V,e.pop(),e.push(r),!0;break;case L:if(p(e.peek(),m)){let t={type:j,value:r};return e.pop(),e.push(t),!0}if(p(e.peek(),I)){let t={type:V,value:r};return e.pop(),e.push(t),!0}if(p(e.peek(),E)){let t=e.pop();return e.push({type:K,key:t.value.trim(),value:r}),!0}break;case j:return p(e.peek(),w)?(e.peek().value.push(r.value),!0):(e.push({type:w,value:[r.value]}),!0);case w:if(p(e.peek(),g))return r.value.unshift(e.peek().value),e.pop(),e.push(r),!0;if(p(e.peek(),S))return r.value.unshift(e.peek().value),e.pop(),e.push(r),!0;if(p(e.peek(),L))return r.value.unshift(e.peek()),e.pop(),e.push(r),!0;if(p(e.peek(),E)&&(e.last(1),m)){let t=e.pop();for(e.push({type:g,value:t.value}),""+t.value;b(e););return e.push(r),!0}if(p(e.peek(),w))return e.peek().value.push(r.value[0]),!0;break;case V:if(p(e.peek(),E)||p(e.peek(),g)||p(e.peek(),w)){let t=e.pop();return e.push({type:K,key:t.value,value:r.value}),!0}throw new Error("Got a :value that can't be handled at line "+r.row+":"+r.col);case K:return p(e.last(0),m)&&p(e.last(1),_)?(e.last(1).value.push(r),e.pop(),!0):(e.push({type:_,value:[r]}),!0);case _:if(p(e.peek(),_))return r.value.forEach(function(t){e.peek().value.push(t)}),!0;break;case U:if(p(e.peek(),w)&&p(e.last(1),X)){let t=e.pop();return e.pop(),e.push({type:S,value:t.value}),!0}if(p(e.peek(),S)&&p(e.last(1),X)){let t=e.pop();return e.pop(),e.push({type:S,value:[t.value]}),!0}if(p(e.peek(),X))return e.pop(),e.push({type:S,value:[]}),!0;if(p(e.peek(),g)&&p(e.last(1),X)){let t=e.pop().value;return e.pop(),e.push({type:S,value:[t]}),!0}if(p(e.peek(),L)&&p(e.last(1),X)){let t=e.pop();return e.pop(),e.push({type:S,value:[t]}),!0}if(p(e.peek(),E)&&p(e.last(1),m)){let t=e.pop();for(e.push({type:g,value:t.value}),""+t.value;b(e););return e.push({type:U}),!0}if(p(e.peek(),m)&&(p(e.last(1),E)||p(e.last(1),L)||p(e.last(1),g))){for(e.pop(),e.push({type:U,value:"]"}),""+JSON.stringify(e);b(e););return!0}if(p(e.peek(),E)&&p(e.last(1),X)){let t=e.pop();return e.pop(),e.push({type:S,value:[t.value]}),!0}if(p(e.peek(),m)&&p(e.last(1),w)){for(e.pop(),e.push({type:U}),""+JSON.stringify(e);b(e););return!0}break;case D:if(p(e.peek(),_)&&p(e.last(1),G)){let t=e.pop();return e.pop(),e.push({type:L,value:t.value}),!0}if(p(e.peek(),G))return e.pop(),e.push({type:L,value:null}),!0;if(p(e.peek(),E)&&p(e.last(1),I)){let t=e.pop();for(e.push({type:g,value:t.value}),""+t.value;b(e););return e.push({type:D}),!0}if(p(e.peek(),I)){for(e.push({type:g,value:null});b(e););return e.push({type:D}),!0}if(p(e.peek(),m))return e.pop(),e.push({type:D}),!0;throw new Error("Found } that I can't handle at line "+r.row+":"+r.col);case m:if(p(e.peek(),m))return!0;if(p(e.peek(),E)){let t=e.pop();for(e.push({type:g,value:t.value});b(e););return e.push(r),!0}if(p(e.peek(),I)){for(e.push({type:g,value:null});b(e););return e.push(r),!0}}return e.push(r),!1}function J(e,r){if(["boolean","number","string"].indexOf(typeof e)!=-1)return e;if(e===null)return null;if(Array.isArray(e)){let n=[];for(;e.length>0;)n.unshift(J(e.pop()));return n}if(p(e,L)){let n={};return e.value===null?{}:(e.value.forEach(function(u){let i=u.key,d=J(u.value);r&&i in n?n[i]={value:n[i],next:d}:n[i]=d}),n)}return p(e,S)?J(e.value):e.value}});var fe=C((er,se)=>{"use strict";var Me=ae();se.exports.parse=Be;function Be(e,r){let t=!0,n=!1;r&&("fallback"in r&&r[t]===!1&&(t=!1),n="duplicateKeys"in r&&r.duplicateKeys===!0);try{return Me.parse(e,n)}catch(u){if(t===!1)throw u;try{let i=JSON.parse(e);return console.warn("dirty-json got valid JSON that failed with the custom parser. We're returning the valid JSON, but please file a bug report here: https://github.com/RyanMarcus/dirty-json/issues  -- the JSON that caused the failure was: "+e),i}catch(i){throw u}}}});var Y=Re(fe());function Ke(e,r){if(!Array.isArray(e)||typeof r!="function")throw new Error("Invalid arguments. Expected an array and a function.");let t=[],n=[];for(let u of e)r(u)?t.push(u):n.push(u);return[t,n]}function de(e){return Object.keys(e).map(r=>typeof e[r]=="object"&&e[r]!==null?encodeURIComponent(r)+"="+encodeURIComponent(JSON.stringify(e[r])):encodeURIComponent(r)+"="+encodeURIComponent(e[r])).join("&")}function T(e){return{"X-Project-Id":`${e.id}`,Authorization:e==null?void 0:e.bearerToken,"X-Client-Version":e==null?void 0:e.clientVersion}}var F="https://app.apifox.com",rr=async(e,r)=>{let{projectConfig:t}=e,{data:n}=await r.fetchJSON(`${F}/api/v1/project-members`,{headers:T(t)}),u=await r.fetchJSON(`${F}/api/v1/api-tree-list`,{headers:T(t)}),i=[],d=[],c=l=>{var f;let s=((f=t.requestMap)==null?void 0:f[l.path])||l.path,A=(n||[]).find(R=>R.user.id===l.responsibleId);return{id:l.id,name:l.name,method:l.method.toUpperCase(),path:l.path,realPath:s,creator:`${(A==null?void 0:A.nickname)||"-"}`,mockUrl:`${t==null?void 0:t.mockPrefixUrl}${l.path}`,sourceUrl:`${F}/project/${t==null?void 0:t.id}/apis/api-${l==null?void 0:l.id}`}},y=(l,s="")=>{if(l.type!=="apiDetailFolder"||!l.children||l.children.length===0)return;let[A,f]=Ke(l.children||[],R=>R.type==="apiDetail");if(A.length>0){let R=A.map(o=>c(o.api));d.push(...R),i.push({id:l.key,name:s?`${s}__${l.name}`:l.name,apis:R})}f.forEach(R=>{y(R,l.name)})};return u.data.forEach(l=>{y(l)}),{groups:[{id:"all",name:"\u5168\u90E8\u63A5\u53E3",apis:d},...i]}},tr=async(e,r)=>{var s,A,f,R,o,a;let{projectConfig:t,overviewApiResponse:n}=e,u=await r.fetchJSON(`${F}/api/v1/api-details/${n.id}`,{headers:T(t)}),d=(await r.fetchJSON(`${F}/api/v1/api-mocks`,{headers:T(t)})).data.filter(h=>h.apiDetailId===n.id).map(h=>({id:h.id,name:h.name,mockUrl:`${t==null?void 0:t.mockPrefixUrl}${n.path}`,mockData:Y.default.parse(h.response.bodyData),realSceneId:h.id})),c=(f=(A=(s=u==null?void 0:u.data)==null?void 0:s.responseExamples)==null?void 0:A[0])==null?void 0:f.data;c=c?Y.default.parse(c):"";let y=((R=t.requestMap)==null?void 0:R[n.path])||n.path;return{id:n.id,name:n.name,method:n.method,path:n.path,realPath:y,desc:(o=u==null?void 0:u.data)==null?void 0:o.description,creator:`${n.creator}`,mockUrl:`${t==null?void 0:t.mockPrefixUrl}${n.path}`,sourceUrl:`${F}/project/${t==null?void 0:t.id}/apis/api-${n==null?void 0:n.id}`,mockData:c||((a=d[0])==null?void 0:a.mockData)||{},scenes:d}},nr=(e,r)=>{let{projectConfig:t,apiResponse:n,addScenePayload:u}=e,i={response:{code:200,delay:0,headers:[],bodyType:"json",bodyData:JSON.stringify(u.mockData)},name:u.name,apiDetailId:n.id,conditions:[],ipCondition:{}};return r.fetchJSON(`${F}/api/v1/api-mocks`,{method:"POST",body:de(i),headers:{...T(t),"Content-Type":"application/x-www-form-urlencoded"}}).then(d=>({id:d.data.id}))},ur=(e,r)=>{let{projectConfig:t,apiResponse:n,sceneResponse:u}=e,i={response:{code:200,delay:0,headers:[],bodyType:"json",bodyData:JSON.stringify(u.mockData)},name:u.name,apiDetailId:n.id,id:u.id,conditions:[],ipCondition:{}};return r.fetchJSON(`${F}/api/v1/api-mocks/${u.realSceneId}`,{method:"PUT",body:de(i),headers:{...T(t),"Content-Type":"application/x-www-form-urlencoded"}})},ir=(e,r)=>{let{projectConfig:t,sceneResponse:n}=e;return r.fetchJSON(`${F}/api/v1/api-mocks/${n.realSceneId}`,{method:"DELETE",headers:T(t)})};export{nr as addApiScene,ir as deleteApiScene,tr as getApi,rr as getProject,ur as updateApiScene};
/*! http://mths.be/fromcodepoint v0.2.1 by @mathias */
/*! https://mths.be/utf8js v3.0.0 by @mathias */
