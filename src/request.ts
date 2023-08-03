import {
  ProjectConfig,
  GroupResponse,
  OverviewApiResponse,
  ApiResponse,
  SceneResponse,
  userScript,
  AddSceneResponse,
  GetApiRequestParams,
  MoveApiRequestParams,
  AddApiSceneRequestParams,
  UpdateApiSceneRequestParams,
  ApiMethod,
} from "mock-proxy-kit";
import {
  ApifoxApiDetail,
  ApifoxApiOverview,
  ApifoxFolder,
  ApifoxOriginalQueryApiScenesResponse,
  ApifoxOriginalQueryProjectResponse,
} from "./types";

function removePrefixSlash(str: string) {
  return str.replace(/^\/+/, "");
}

interface RequestMap {
  /**
   * key为api path；value为realPath
   */
  [path: string]: string;
}

interface ApifoxProjectConfig extends ProjectConfig {
  requestMap?: RequestMap;
  mockPrefixUrl?: string;
}

interface ApifoxOverviewApiResponse extends OverviewApiResponse {
  creatorId: number;
}

interface ApifoxApiResponse extends ApiResponse {
  creatorId: number;
}

interface ApifoxAddSceneResponse extends AddSceneResponse {}

interface ApifoxSceneResponse extends SceneResponse {}

const ApifoxBaseUrl = "https://app.apifox.com";

export const getProject: userScript.GetProjectRequest<{
  projectConfig: ApifoxProjectConfig;
}> = (params, context) => {
  const { projectConfig } = params;

  return context
    .fetchJSON<ApifoxOriginalQueryProjectResponse>(
      `api/v1/api-tree-list?locale=zh-CN`,
      {
        headers: {
          "X-Project-Id": `${projectConfig.id}`,
        },
      }
    )
    .then((res) => {
      const groups: GroupResponse[] = [];
      const processApiData = (api: ApifoxApiDetail): OverviewApiResponse => {
        const realPath = projectConfig.requestMap?.[api.path] || api.path;
        return {
          id: api.id,
          name: api.name,
          method: api.method.toUpperCase() as ApiMethod,
          path: api.path,
          realPath,
          creator: `${api.responsibleId}`,
          mockUrl: `${projectConfig?.mockPrefixUrl}/${api.path}`,
          sourceUrl: `${ApifoxBaseUrl}/project/${projectConfig?.id}/apis/api-${api?.id}`,
          creatorId: api.responsibleId,
        };
      };

      const isChildrenApis = (folder: ApifoxFolder) => {
        if (
          folder.children?.length > 0 &&
          folder.children[0].type === "apiDetail"
        ) {
          return true;
        }

        return false;
      };

      const processFolderData = (
        folder: ApifoxFolder | ApifoxApiOverview,
        prefix: string = ""
      ) => {
        if (
          folder.type !== "apiDetailFolder" ||
          !folder.children ||
          folder.children.length === 0
        )
          return;

        if (isChildrenApis(folder as ApifoxFolder)) {
          groups.push({
            id: (folder as ApifoxFolder).key,
            name: `${prefix}__${folder.name}`,
            apis: folder.children.map((c) =>
              processApiData((c as ApifoxApiOverview).api)
            ),
          });
        } else {
          folder.children.forEach((childFolder) => {
            processFolderData(childFolder, folder.name);
          });
        }
      };

      res.data.forEach((folder) => {
        processFolderData(folder);
      });

      return {
        groups,
      };
    });
};

export const getApi: userScript.GetApiRequest<
  GetApiRequestParams & {
    projectConfig: ApifoxProjectConfig;
    overviewApiResponse: ApifoxOverviewApiResponse;
  },
  ApifoxApiResponse
> = async (params, context) => {
  const { projectConfig, overviewApiResponse } = params;

  const mocks = await context
  .fetchJSON<ApifoxOriginalQueryApiScenesResponse>(
    `${ApifoxBaseUrl}/api/v1/api-mocks?locale=zh-CN`
  );

  const scenes: SceneResponse[] = mocks.data.filter((mock) => {
   return mock.apiDetailId === overviewApiResponse.id;
  }).map((mock) => {
    return {
      id: mock.id,
      name: mock.name,
      mockUrl: `${projectConfig?.mockPrefixUrl}/${overviewApiResponse.path}`,
      mockData: JSON.parse(mock.response.bodyData),
    }
  });

  const realPath =
        projectConfig.requestMap?.[overviewApiResponse.url] ||
        overviewApiResponse.url;

      const ret: ApifoxApiResponse = {
        id: overviewApiResponse.id,
        name: overviewApiResponse.name,
        // desc: res.content.description,
        method: overviewApiResponse.method,
        path: overviewApiResponse.url,
        realPath,
        // TODO: 待补充
        creator: `${overviewApiResponse.creatorId}`,
        mockUrl: `${projectConfig?.mockPrefixUrl}/${overviewApiResponse.path}`,
        sourceUrl: `${ApifoxBaseUrl}/project/${projectConfig?.id}/apis/api-${overviewApiResponse?.id}`,
        mockData: scenes[0]?.mockData || {},
        scenes,
        creatorId: overviewApiResponse.creatorId,
      };
      return ret;
};

// export const moveApi: userScript.MoveApiRequest<
//   MoveApiRequestParams & {
//     projectConfig: ApifoxProjectConfig;
//     overviewApiResponse: ApifoxOverviewApiResponse;
//   },
//   any
// > = (params, context) => {
//   const { projectConfig, overviewApiResponse, groupPayload } = params;

//   const payload: any = {
//     itfId: overviewApiResponse.id,
//     modId: groupPayload.id,
//     repositoryId: projectConfig.id,
//     op: 1,
//   };

//   return context.fetchJSON<any>(`${ApifoxApiBaseUrl}/interface/move`, {
//     method: "POST",
//     body: JSON.stringify(payload),
//     headers: {
//       "Content-Type": "application/json",
//     },
//   });
// };

// export const addApiScene: userScript.AddApiSceneRequest<
//   AddApiSceneRequestParams & {
//     projectConfig: ApifoxProjectConfig;
//     apiResponse: ApifoxApiResponse;
//   },
//   ApifoxAddSceneResponse
// > = (params, context) => {
//   const { projectConfig, apiResponse, addScenePayload } = params;

//   const payload = {
//     body: JSON.stringify(addScenePayload.mockData),
//     creatorId: apiResponse.creatorId,
//     interfaceId: apiResponse.id,
//     moduleId: apiResponse.moduleId,
//     name: addScenePayload.name,
//     repositoryId: projectConfig.id,
//     scope: "response",
//   };

//   return context
//     .fetchJSON<ApifoxOriginalEditSceneResponse>(
//       `${ApifoxApiBaseUrl}/scene/create`,
//       {
//         method: "POST",
//         body: JSON.stringify(payload),
//         headers: {
//           "Content-Type": "application/json",
//         },
//       }
//     )
//     .then((res) => {
//       return {
//         id: res.data.id,
//       };
//     });
// };

// export const updateApiScene: userScript.UpdateApiSceneRequest<
//   UpdateApiSceneRequestParams & {
//     projectConfig: ApifoxProjectConfig;
//     apiResponse: ApifoxApiResponse;
//     sceneResponse: ApifoxSceneResponse;
//   },
//   ApifoxOriginalEditSceneResponse
// > = (params, context) => {
//   const { projectConfig, apiResponse, sceneResponse } = params;

//   const payload = {
//     id: sceneResponse.id,
//     body: JSON.stringify(sceneResponse.mockData),
//     creatorId: apiResponse.creatorId,
//     interfaceId: apiResponse.id,
//     moduleId: apiResponse.moduleId,
//     name: sceneResponse.name,
//     repositoryId: projectConfig.id,
//     scope: "response",
//   };

//   return context.fetchJSON<ApifoxOriginalEditSceneResponse>(
//     `${ApifoxApiBaseUrl}/scene/update`,
//     {
//       method: "POST",
//       body: JSON.stringify(payload),
//       headers: {
//         "Content-Type": "application/json",
//       },
//     }
//   );
// };

// export const deleteApiScene: userScript.DeleteApiSceneRequest<
//   UpdateApiSceneRequestParams & {
//     projectConfig: ApifoxProjectConfig;
//     apiResponse: ApifoxApiResponse;
//     sceneResponse: ApifoxSceneResponse;
//   },
//   any
// > = (params, context) => {
//   const { sceneResponse } = params;

//   return context.fetchJSON<any>(
//     `${ApifoxApiBaseUrl}/scene/remove?id=${sceneResponse.id}`,
//     {
//       method: "GET",
//     }
//   );
// };
