export type ApifoxMethod =
  | "options"
  | "get"
  | "post"
  | "put"
  | "patch"
  | "delete";


interface ApifoxApiCase {
  case: {
    id: number;
    name: string;
    apiId: number;
    type: string;
  };
  children: [];
  key: string;
  name: string;
  type: string;
}


export interface ApifoxApiDetail {
  customApiFields: Record<string, unknown>; // Replace 'unknown' with the actual type of customApiFields if you have more information about its structure
  folderId: number;
  id: number;
  method: ApifoxMethod;
  name: string;
  path: string;
  responsibleId: number;
  status: string;
  tags: string[];
  type: string;
}

export interface ApifoxApiOverview {
  api: ApifoxApiDetail;
  key: string;
  name: string;
  type: 'apiDetail';
  children: ApifoxApiCase[];
}

interface FolderDetail {
  id: number;
  name: string;
  docId: number;
  parentId: number;
  type: string;
}

export interface ApifoxFolder {
  folder: FolderDetail;
  key: string;
  name: string;
  type: 'apiDetailFolder';
  children: (ApifoxFolder | ApifoxApiOverview)[];
}

export interface ApifoxOriginalQueryProjectResponse {
  data: ApifoxFolder[];
  success: boolean;
}

export interface ApifoxMockScene {
  id: number;
  name: string;
  apiDetailId: number;
  projectId: number;
  conditions: any[]; // Replace 'any' with the appropriate type if you have more information about the structure of conditions
  ipCondition: any; // Replace 'any' with the appropriate type if you have more information about the structure of ipCondition
  response: {
    code: number;
    delay: number;
    headers: any[]; // Replace 'any' with the appropriate type if you have more information about the structure of headers
    bodyType: "json";
    bodyData: string;
  };
  ordering: number;
  createdAt: string;
  updatedAt: string;
  creatorId: number;
  editorId: number;
}

export interface ApifoxAddSceneOriginalResponse {
  success: boolean;
  data: {
    id: number;
    name: string;
    apiDetailId: number;
    projectId: number;
    conditions: any[]; // Replace 'any' with the specific type if possible
    ipCondition: Record<string, unknown>; // Replace 'unknown' with the specific type if possible
    response: {
      code: number;
      delay: number;
      headers: any[]; // Replace 'any' with the specific type if possible
      bodyType: string;
      bodyData: string;
    };
    ordering: number;
    createdAt: string;
    updatedAt: string;
    creatorId: number;
    editorId: number;
  };
}

export interface ApifoxAddSceneOriginalPayload {
  name: string;
  apiDetailId: number;
  response: {
    code: number;
    delay: number;
    headers: any[]; // Replace 'any' with the specific type if possible
    bodyType: string;
    bodyData: string;
  };
  // conditions: [];
  // ipCondition: {};
}

export interface ApifoxEditSceneOriginalPayload extends ApifoxAddSceneOriginalPayload {
  id: number;
}

export interface ApifoxEditSceneOriginalResponse {
  success: boolean;
}

export interface ApifoxOriginalQueryApiScenesResponse {
  success: boolean;
  data: ApifoxMockScene[];
}

