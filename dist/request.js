var n="https://app.apifox.com",l=(p,a)=>{let{projectConfig:r}=p;return a.fetchJSON(`${n}/api/v1/api-tree-list?locale=zh-CN`,{headers:{"X-Project-Id":`${r.id}`,Authorization:r==null?void 0:r.bearerToken,"X-Client-Version":r==null?void 0:r.clientVersion}}).then(s=>{let c=[],o=e=>{var i;let t=((i=r.requestMap)==null?void 0:i[e.path])||e.path;return{id:e.id,name:e.name,method:e.method.toUpperCase(),path:e.path,realPath:t,creator:`${e.responsibleId}`,mockUrl:`${r==null?void 0:r.mockPrefixUrl}/${e.path}`,sourceUrl:`${n}/project/${r==null?void 0:r.id}/apis/api-${e==null?void 0:e.id}`,creatorId:e.responsibleId}},A=e=>{var t;return((t=e.children)==null?void 0:t.length)>0&&e.children[0].type==="apiDetail"},d=(e,t="")=>{e.type!=="apiDetailFolder"||!e.children||e.children.length===0||(A(e)?c.push({id:e.key,name:`${t}__${e.name}`,apis:e.children.map(i=>o(i.api))}):e.children.forEach(i=>{d(i,e.name)}))};return s.data.forEach(e=>{d(e)}),{groups:c}})},u=async(p,a)=>{var e,t;let{projectConfig:r,overviewApiResponse:s}=p,o=(await a.fetchJSON(`${n}/api/v1/api-mocks?locale=zh-CN`)).data.filter(i=>i.apiDetailId===s.id).map(i=>({id:i.id,name:i.name,mockUrl:`${r==null?void 0:r.mockPrefixUrl}/${s.path}`,mockData:JSON.parse(i.response.bodyData)})),A=((e=r.requestMap)==null?void 0:e[s.url])||s.url;return{id:s.id,name:s.name,method:s.method,path:s.url,realPath:A,creator:`${s.creatorId}`,mockUrl:`${r==null?void 0:r.mockPrefixUrl}/${s.path}`,sourceUrl:`${n}/project/${r==null?void 0:r.id}/apis/api-${s==null?void 0:s.id}`,mockData:((t=o[0])==null?void 0:t.mockData)||{},scenes:o,creatorId:s.creatorId}};export{u as getApi,l as getProject};
