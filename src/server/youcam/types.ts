// YouCam API v2.0 response shapes (docs.makeupar.com, API docs v1.17).

export interface YouCamErrorBody {
  status?: number;
  error?: string;
  error_code?: string;
}

export interface YouCamFileResponse {
  status: number;
  data: {
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

export interface YouCamRunResponse {
  status: number;
  data: { task_id: string };
}

export interface YouCamPollResponse {
  status: number;
  data: {
    task_status: 'running' | 'success' | 'error';
    results?: unknown;
    error?: string | null;
    error_message?: string;
  };
}

export type GarmentCategory = 'auto' | 'upper_body' | 'lower_body' | 'full_body' | 'outer' | 'shoes';
