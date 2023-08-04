export interface ApifoxQueryApiDetailOriginalResponse {
  success: boolean;
  data: Data;
}

interface Data {
  id: number;
  name: string;
  type: string;
  serverId: string;
  preProcessors: any[];
  postProcessors: any[];
  inheritPreProcessors: Record<string, unknown>;
  inheritPostProcessors: Record<string, unknown>;
  description: string;
  operationId: string;
  sourceUrl: string;
  method: string;
  path: string;
  tags: any[];
  status: string;
  requestBody: RequestBody;
  parameters: {
    query: Query[];
    path: Path[];
  };
  commonParameters: CommonParameters;
  auth: Record<string, unknown>;
  responses: Response[];
  responseExamples: ResponseExample[];
  codeSamples: any[];
  projectId: number;
  folderId: number;
  ordering: number;
  responsibleId: number;
  commonResponseStatus: Record<string, unknown>;
  advancedSettings: Record<string, unknown>;
  customApiFields: Record<string, unknown>;
  mockScript: MockScript;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  creatorId: number;
  editorId: number;
  responseChildren: string[];
}

interface RequestBody {
  type: string;
  parameters: any[];
}

interface Query {
  required: boolean;
  description: string;
  type: string;
  name: string;
  id: string;
  enable: boolean;
}

interface Path {
  name: string;
  required: boolean;
  description: string;
  type: string;
  id: string;
  example?: string;
  enable: boolean;
}

interface CommonParameters {
  query: any[];
  body: any[];
  cookie: any[];
  header: Header[];
}

interface Header {
  name: string;
  enable?: boolean;
}

interface Response {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  apiDetailId: number;
  name: string;
  code: number;
  contentType: string;
  jsonSchema: JsonSchema;
  defaultEnable: boolean;
  projectId: number;
  ordering: number;
}

interface JsonSchema {
  type: string;
  properties: Properties;
  required: string[];
  "x-apifox-orders": string[];
}

interface Properties {
  code: Code;
  data: Data2;
  message: Code;
}

interface Code {
  type: string;
}

interface Data2 {
  type: string;
  properties: Properties2;
  required: string[];
  "x-apifox-orders": string[];
}

interface Properties2 {
  department_ids: DepartmentIds;
}

interface DepartmentIds {
  type: string;
  items: Items;
  title: string;
  description: string;
}

interface Items {
  type: string;
  properties: Properties3;
  required: string[];
  "x-apifox-orders": string[];
}

interface Properties3 {
  id: Code;
  parentid: Code;
  order: Code;
  name: Code;
}

interface ResponseExample {
  id: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  apiDetailId: number;
  name: string;
  responseId: number;
  data: string;
  ordering: number;
}

interface MockScript {
  enable: boolean;
}
