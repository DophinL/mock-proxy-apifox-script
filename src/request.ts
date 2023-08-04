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
  ApifoxAddSceneOriginalPayload,
  ApifoxAddSceneOriginalResponse,
  ApifoxApiDetail,
  ApifoxApiOverview,
  ApifoxEditSceneOriginalPayload,
  ApifoxEditSceneOriginalResponse,
  ApifoxFolder,
  ApifoxOriginalQueryApiScenesResponse,
  ApifoxOriginalQueryProjectResponse,
} from "./types";

function partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
  if (!Array.isArray(array) || typeof predicate !== "function") {
    throw new Error("Invalid arguments. Expected an array and a function.");
  }

  const satisfied: T[] = [];
  const unsatisfied: T[] = [];

  for (const item of array) {
    if (predicate(item)) {
      satisfied.push(item);
    } else {
      unsatisfied.push(item);
    }
  }

  return [satisfied, unsatisfied];
}

function makeRequestHeaders(projectConfig: ApifoxProjectConfig) {
  return {
    "X-Project-Id": `${projectConfig.id}`,
    Authorization: projectConfig?.bearerToken!,
    "X-Client-Version": projectConfig?.clientVersion!,
  };
}

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
  bearerToken?: string;
  clientVersion?: string;
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
      `${ApifoxBaseUrl}/api/v1/api-tree-list?locale=zh-CN`,
      {
        headers: makeRequestHeaders(projectConfig),
      }
    )
    .then((res) => {
      const groups: GroupResponse[] = [];
      const allApis: OverviewApiResponse[] = [];
      const processApiData = (api: ApifoxApiDetail): OverviewApiResponse => {
        const realPath = projectConfig.requestMap?.[api.path] || api.path;
        return {
          id: api.id,
          name: api.name,
          method: api.method.toUpperCase() as ApiMethod,
          path: api.path,
          realPath,
          creator: `${api.responsibleId}`,
          mockUrl: `${projectConfig?.mockPrefixUrl}${api.path}`,
          sourceUrl: `${ApifoxBaseUrl}/project/${projectConfig?.id}/apis/api-${api?.id}`,
          creatorId: api.responsibleId,
        };
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

        const [apis, folders] = partition(
          folder.children || [],
          (c) => c.type === "apiDetail"
        );

        if (apis.length > 0) {
          const processedApis = apis.map((c) =>
            processApiData((c as ApifoxApiOverview).api)
          );
          allApis.push(...processedApis);
          groups.push({
            id: folder.key,
            name: prefix ? `${prefix}__${folder.name}` : folder.name,
            apis: processedApis,
          });
        }

        folders.forEach((childFolder) => {
          processFolderData(childFolder, folder.name);
        });
      };

      res.data.forEach((folder) => {
        processFolderData(folder);
      });

      return {
        groups: [
          {
            id: "all",
            name: "全部接口",
            apis: allApis,
          },
          ...groups,
        ],
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

  const mocks = await context.fetchJSON<ApifoxOriginalQueryApiScenesResponse>(
    `${ApifoxBaseUrl}/api/v1/api-mocks?locale=zh-CN`,
    {
      headers: makeRequestHeaders(projectConfig),
    }
  );

  const scenes: SceneResponse[] = mocks.data
    .filter((mock) => {
      return mock.apiDetailId === overviewApiResponse.id;
    })
    .map((mock, index) => {
      return {
        id: index === 0 ? "default" : mock.id,
        name: mock.name,
        mockUrl: `${projectConfig?.mockPrefixUrl}${overviewApiResponse.path}`,
        mockData: JSON.parse(mock.response.bodyData),
        realSceneId: mock.id,
      };
    });

  const realPath =
    projectConfig.requestMap?.[overviewApiResponse.path] ||
    overviewApiResponse.path;

  const ret: ApifoxApiResponse = {
    id: overviewApiResponse.id,
    name: overviewApiResponse.name,
    method: overviewApiResponse.method,
    path: overviewApiResponse.path,
    realPath,
    // TODO: 待补充
    creator: `${overviewApiResponse.creatorId}`,
    mockUrl: `${projectConfig?.mockPrefixUrl}${overviewApiResponse.path}`,
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

export const addApiScene: userScript.AddApiSceneRequest<
  AddApiSceneRequestParams & {
    projectConfig: ApifoxProjectConfig;
    apiResponse: ApifoxApiResponse;
  },
  ApifoxAddSceneResponse
> = (params, context) => {
  const { projectConfig, apiResponse, addScenePayload } = params;

  const payload: ApifoxAddSceneOriginalPayload = {
    response: {
      code: 200,
      delay: 0,
      headers: [],
      bodyType: "json",
      bodyData: JSON.stringify(addScenePayload.mockData),
    },
    name: addScenePayload.name,
    apiDetailId: apiResponse.id as number,
  };

  return context
    .fetchJSON<ApifoxAddSceneOriginalResponse>(
      `${ApifoxBaseUrl}/api/v1/api-mocks?locale=zh-CN`,
      {
        method: "POST",
        body: JSON.stringify(payload),
        headers: makeRequestHeaders(projectConfig),
      }
    )
    .then((res) => {
      return {
        id: res.data.id,
      };
    });
};

export const updateApiScene: userScript.UpdateApiSceneRequest<
  UpdateApiSceneRequestParams & {
    projectConfig: ApifoxProjectConfig;
    apiResponse: ApifoxApiResponse;
    sceneResponse: ApifoxSceneResponse;
  },
  any
> = (params, context) => {
  const { projectConfig, apiResponse, sceneResponse } = params;

  const payload: ApifoxEditSceneOriginalPayload = {
    response: {
      code: 200,
      delay: 0,
      headers: [],
      bodyType: "json",
      bodyData: JSON.stringify(sceneResponse.mockData),
    },
    name: sceneResponse.name,
    apiDetailId: apiResponse.id as number,
    id: sceneResponse.id as number,
  };

  return context.fetchJSON<ApifoxEditSceneOriginalResponse>(
    `${ApifoxBaseUrl}/api/v1/api-mocks/${sceneResponse.realSceneId}?locale=zh-CN`,
    {
      method: "POST",
      body: JSON.stringify(payload),
      headers: makeRequestHeaders(projectConfig),
    }
  );
};

export const deleteApiScene: userScript.DeleteApiSceneRequest<
  UpdateApiSceneRequestParams & {
    projectConfig: ApifoxProjectConfig;
    apiResponse: ApifoxApiResponse;
    sceneResponse: ApifoxSceneResponse;
  },
  any
> = (params, context) => {
  const { sceneResponse } = params;

  return context.fetchJSON<any>(
    `${ApifoxBaseUrl}/api/v1/api-mocks/${sceneResponse.realSceneId}?locale=zh-CN`,
    {
      method: "DELETE",
    }
  );
};
