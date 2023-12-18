import axios, { AxiosResponse } from "axios";
import { useQuery, UseQueryResult } from "react-query";

interface ApiResponse {
  [key: string]: any;
}

function fetchNaverData(apiEndpoint: string): Promise<AxiosResponse<ApiResponse>> {
  const apiUrl = `http://52.78.43.199:4000/API/${apiEndpoint}`;
  return axios.get(apiUrl);
}

async function fetchExchangeData(apiEndpoint: number): Promise<AxiosResponse<ApiResponse>> {
  const fetchResponse = await axios.get(`http://52.78.43.199:4000/EXCHANGE/1`);
  return fetchResponse.data[apiEndpoint];
}

function useNaverDataQuery(apiEndpoint: string): UseQueryResult<ApiResponse> {
  return useQuery(["naverData", apiEndpoint], () => fetchNaverData(apiEndpoint));
}

function useExchangeDataQuery(apiEndpoint: number): UseQueryResult<ApiResponse> {
  return useQuery(["exchangeData", apiEndpoint], () => fetchExchangeData(apiEndpoint));
}

export { useNaverDataQuery, useExchangeDataQuery };
