import axios, { AxiosResponse } from "axios";
import { useQuery, UseQueryResult } from "react-query";

interface ApiResponse {
  [key: string]: any;
}

function fetchNaverData(apiEndpoint: string): Promise<AxiosResponse<ApiResponse>> {
  const apiUrl = `http://localhost:4000/API/${apiEndpoint}`;
  return axios.get(apiUrl);
}

function fetchExchangeData(): Promise<AxiosResponse<ApiResponse>> {
  const apiUrl = `http://localhost:4000/EXCHANGE`;
  return axios.get(apiUrl);
}

function useNaverDataQuery(apiEndpoint: string): UseQueryResult<ApiResponse> {
  return useQuery(["naverData", apiEndpoint], () => fetchNaverData(apiEndpoint));
}

function useExchangeDataQuery(apiEndpoint: string): UseQueryResult<ApiResponse> {
  return useQuery("exchangeData", fetchExchangeData);
}

export { useNaverDataQuery, useExchangeDataQuery };
