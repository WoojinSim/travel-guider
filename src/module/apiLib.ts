import axios, { AxiosResponse } from "axios";
import { useQuery, UseQueryResult } from "react-query";

interface ApiResponse {
  [key: string]: any;
}

function fetchData(apiEndpoint: string): Promise<AxiosResponse<ApiResponse>> {
  const apiUrl = `http://localhost:4000/API/${apiEndpoint}`;
  return axios.get(apiUrl);
}

function useDataQuery(apiEndpoint: string): UseQueryResult<ApiResponse> {
  return useQuery(["data", apiEndpoint], () => fetchData(apiEndpoint));
}

export { useDataQuery };
