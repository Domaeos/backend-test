export const testData: ICallData[] = [
  {
    customerId: 123,
    callId: 'Jan1st_11:30pm_to_Jan1st_11:40pm_Call',
    startTimestamp: 1704151800000,
    endTimestamp: 1704152400000
  },
  {
    customerId: 123,
    callId: 'Jan2nd_11:50pm_to_Jan3rd_12:20am_Call',
    startTimestamp: 1704239400000,
    endTimestamp: 1704241200000
  },
  {
    customerId: 123,
    callId: 'Jan3rd_12:10am_to_Jan3rd_1:00am_Call',
    startTimestamp: 1704240600000,
    endTimestamp: 1704243600000
  },
  {
    customerId: 123,
    callId: 'Jan4th_11:00pm_to_Jan5th_12:00am_Call',
    startTimestamp: 1704409200000,
    endTimestamp: 1704412800000
  }
]

const testAnswer = [
  {
    customerId: 123,
    date: '2024-01-01',
    maxConcurrentCalls: 1,
    callIds: [Array],
    timestamp: 1704151800000
  },
  {
    customerId: 123,
    date: '2024-01-02',
    maxConcurrentCalls: 1,
    callIds: [Array],
    timestamp: 1704239400000
  },
  {
    customerId: 123,
    date: '2024-01-03',
    maxConcurrentCalls: 2,
    callIds: [Array],
    timestamp: 1704240600000
  },
  {
    customerId: 123,
    date: '2024-01-04',
    maxConcurrentCalls: 1,
    callIds: [Array],
    timestamp: 1704409200000
  }
];


interface ICallData {
  customerId: number;
  callId: string;
  startTimestamp: number;
  endTimestamp: number;
}

interface IResultData {
  customerId: number;
  date: string;
  maxConcurrentCalls: number;
  callIds: string[];
  timestamp: number | null;
}
interface IDateInfo {
  customerId: number,
  date: string,
  calls: ICallData[],
  maxConcurrentCalls: number,
}

export function getConcurrentCalls(calls: ICallData[]) {
  const customerMap = createCustomerMap(calls);
  const customerAndDates = groupByDate(customerMap);

  const concurrentCallData = customerAndDates.map(day => {
    const concurrentCalls = calculateConcurrentTimestamps(day);
    return concurrentCalls;
  });

  return concurrentCallData;
}

function calculateConcurrentTimestamps(dayData: IDateInfo) {
  const callEvents: { timestamp: number; type: 'start' | 'end' }[] = [];

  dayData.calls.forEach(call => {
    callEvents.push({ timestamp: call.startTimestamp, type: 'start' });
    callEvents.push({ timestamp: call.endTimestamp, type: 'end' });
  });

  callEvents.sort((a, b) => a.timestamp - b.timestamp);

  let currentConcurrentCalls = 0;
  let maxConcurrentCalls = 0;
  let peakTimestamp: number | null = null;

  callEvents.forEach(event => {
    if (event.type === 'start') {
      if (peakTimestamp === null) peakTimestamp = event.timestamp;
      currentConcurrentCalls++;
      if (currentConcurrentCalls > maxConcurrentCalls) {
        maxConcurrentCalls = currentConcurrentCalls;
        peakTimestamp = event.timestamp;
      }
    } else {
      currentConcurrentCalls--;
    }
  });

  const callIds = dayData.calls.map(call => call.callId);
  const {calls, ...newObject} = {...dayData};

  newObject.maxConcurrentCalls = maxConcurrentCalls;
  (newObject as IResultData).timestamp = peakTimestamp;
  (newObject as IResultData).callIds = callIds;


  return newObject;
}

function groupByDate(customerMap: Map<number, ICallData[]>) {
  const dateArray: IDateInfo[] = [];

  customerMap.forEach((calls, customerId) => {
    const dateMap = new Map();
    calls.forEach(call => {
      const startDate = getDate(call.startTimestamp);
      const endDate = getDate(call.endTimestamp);

      if (dateMap.has(startDate)) {
        dateMap.get(startDate).push(call);
      } else {
        dateMap.set(startDate, [call]);
      }

      if (startDate !== endDate) {
        if (dateMap.has(endDate)) {
          dateMap.get(endDate).push(call);
        } else {
          dateMap.set(endDate, [call]);
        }
      }
    });

    dateMap.forEach((calls, date) => {
      dateArray.push({
        customerId,
        date,
        maxConcurrentCalls: 0,
        calls: [...calls],
      });
    });
  });

  return dateArray;
}

function getDate(timestamp: number) {
  const date = new Date(timestamp);
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const year = `${date.getFullYear()}`.padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function createCustomerMap(callData: ICallData[]) {
  const customerMap = new Map();
  callData.forEach(call => {
    const { customerId, ...newCall } = { ...call };
    if (customerMap.has(call.customerId)) {
      customerMap.get(call.customerId).push({ ...newCall });
    } else {
      customerMap.set(call.customerId, [{ ...newCall }]);
    }
  });
  return customerMap;
}
