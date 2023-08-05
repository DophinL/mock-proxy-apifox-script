import {
  ProjectConfig,
  GroupResponse,
  OverviewApiResponse,
  ApiResponse,
  SceneResponse,
  userScript,
  AddSceneResponse,
  GetApiRequestParams,
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
  ApifoxQueryApiDetailOriginalResponse,
  ApifoxQueryApiScenesOriginalResponse,
  ApifoxOriginalQueryProjectResponse,
  ApifoxQueryMembersOriginalResponse,
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

function jsonToUrlEncoded(jsonObj: Record<string, any>, prefix = ''): string {
  return Object.entries(jsonObj)
    .map(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        // If the value is an object or array, recurse.
        return jsonToUrlEncoded(value, `${prefix}${encodeURIComponent(key)}_`);
      } else {
        // Otherwise, encode the key and value normally.
        return `${prefix}${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
      }
    })
    .join('&');
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

interface ApifoxOverviewApiResponse extends OverviewApiResponse {}

interface ApifoxApiResponse extends ApiResponse {}

interface ApifoxAddSceneResponse extends AddSceneResponse {}

interface ApifoxSceneResponse extends SceneResponse {}

const ApifoxBaseUrl = "https://app.apifox.com";

export const getProject: userScript.GetProjectRequest<{
  projectConfig: ApifoxProjectConfig;
}> = async (params, context) => {
  const { projectConfig } = params;
  const { data: members } =
    await context.fetchJSON<ApifoxQueryMembersOriginalResponse>(
      `${ApifoxBaseUrl}/api/v1/project-members`,
      {
        headers: makeRequestHeaders(projectConfig),
      }
    );

  const res = await context.fetchJSON<ApifoxOriginalQueryProjectResponse>(
    `${ApifoxBaseUrl}/api/v1/api-tree-list`,
    {
      headers: makeRequestHeaders(projectConfig),
    }
  );

  const groups: GroupResponse[] = [];
  const allApis: OverviewApiResponse[] = [];
  const processApiData = (api: ApifoxApiDetail): OverviewApiResponse => {
    const realPath = projectConfig.requestMap?.[api.path] || api.path;
    const targetMember = (members || []).find(
      (m) => m.user.id === api.responsibleId
    );
    return {
      id: api.id,
      name: api.name,
      method: api.method.toUpperCase() as ApiMethod,
      path: api.path,
      realPath,
      creator: `${targetMember?.nickname || "-"}`,
      mockUrl: `${projectConfig?.mockPrefixUrl}${api.path}`,
      sourceUrl: `${ApifoxBaseUrl}/project/${projectConfig?.id}/apis/api-${api?.id}`,
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
};

export const getApi: userScript.GetApiRequest<
  GetApiRequestParams & {
    projectConfig: ApifoxProjectConfig;
    overviewApiResponse: ApifoxOverviewApiResponse;
  },
  ApifoxApiResponse
> = async (params, context) => {
  const { projectConfig, overviewApiResponse } = params;

  const apiDetail =
    await context.fetchJSON<ApifoxQueryApiDetailOriginalResponse>(
      `${ApifoxBaseUrl}/api/v1/api-details/${overviewApiResponse.id}`,
      {
        headers: makeRequestHeaders(projectConfig),
      }
    );

  const mocks = await context.fetchJSON<ApifoxQueryApiScenesOriginalResponse>(
    `${ApifoxBaseUrl}/api/v1/api-mocks`,
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
    desc: apiDetail?.data?.description,
    creator: `${overviewApiResponse.creator}`,
    mockUrl: `${projectConfig?.mockPrefixUrl}${overviewApiResponse.path}`,
    sourceUrl: `${ApifoxBaseUrl}/project/${projectConfig?.id}/apis/api-${overviewApiResponse?.id}`,
    mockData: scenes[0]?.mockData || {},
    scenes,
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
    conditions: [],
    ipCondition: {},
  };

  return context
    .fetchJSON<ApifoxAddSceneOriginalResponse>(
      `${ApifoxBaseUrl}/api/v1/api-mocks`,
      {
        method: "POST",
        body: jsonToUrlEncoded(payload),
        headers: {
          ...makeRequestHeaders(projectConfig),
          "Content-Type": "application/x-www-form-urlencoded",
        },
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
    conditions: [],
    ipCondition: {},
  };

  return context.fetchJSON<ApifoxEditSceneOriginalResponse>(
    `${ApifoxBaseUrl}/api/v1/api-mocks/${sceneResponse.realSceneId}`,
    {
      method: "PUT",
      body: jsonToUrlEncoded(payload),
      headers: {
        ...makeRequestHeaders(projectConfig),
        "Content-Type": "application/x-www-form-urlencoded",
      },
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
  const { projectConfig, sceneResponse } = params;

  return context.fetchJSON<any>(
    `${ApifoxBaseUrl}/api/v1/api-mocks/${sceneResponse.realSceneId}`,
    {
      method: "DELETE",
      headers: makeRequestHeaders(projectConfig),
    }
  );
};
