import axios, { AxiosInstance, AxiosRequestConfig } from "axios";

const config: AxiosRequestConfig = {
  baseURL: 'https://candidate.hubteam.com/candidateTest/v3/problem',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
};

const realData = "/dataset?userKey=ef59feb6c8ab06070f509aa43d73";

const testData = "/test-dataset?userKey=ef59feb6c8ab06070f509aa43d73";
const testAnswer = "test-dataset-answer?userKey=ef59feb6c8ab06070f509aa43d73";
const axiosClient: AxiosInstance = axios.create(config);

async function main() {
  try {
    // const { data: { callRecords } } = await axiosClient.get(testAnswer)
    const callRecords = await axiosClient.get(testData)
    console.log(callRecords.data);
  } catch(e) {
    console.error(e);
  }
}

main();