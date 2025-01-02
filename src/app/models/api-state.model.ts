export interface ApiState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface ApiResponse<T> {
  data: T;
  status: ApiState;
} 