import axios, { AxiosInstance, AxiosRequestConfig } from "axios";
import { getConcurrentCalls, testData } from "./workings";

const config: AxiosRequestConfig = {
  baseURL: 'https://candidate.hubteam.com/candidateTest/v3/problem',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};


async function main() {
  const realDataUrl = "/dataset?userKey=ef59feb6c8ab06070f509aa43d73";
  const testDataUrl = "/test-dataset?userKey=ef59feb6c8ab06070f509aa43d73";
  const testAnswerUrl = "test-dataset-answer?userKey=ef59feb6c8ab06070f509aa43d73";

  const axiosClient: AxiosInstance = axios.create(config);
  try {

    const { data: { callRecords } } = await axiosClient.get(testDataUrl);
    const resultArray = getConcurrentCalls(callRecords);

  } catch(e) {
    console.error(e);
  }
}

main();