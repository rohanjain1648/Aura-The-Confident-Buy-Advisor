export interface YouCamAuthResponse {
  result: {
    id_token: string;
    expires_in?: number;
  };
}

export interface YouCamFileUploadResponse {
  result: {
    files: {
      file_id: string;
      requests: {
        url: string;
        method: string;
        headers?: Record<string, string>;
      }[];
    }[];
  };
}

export interface YouCamTaskResponse {
  result: {
    task_id: string;
    status?: string;
  };
}

export interface YouCamPollResponse {
  result: {
    status: string;
    polling_interval?: number;
    result?: unknown;
    error?: string;
  };
}
