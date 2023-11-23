import { useCallback, useEffect, useState } from "react";
import isNil from "lodash/isNil";
import { response } from "express";

export interface WorkDay {
  date: string,
  startTime: string,
  endTime: string,
}

const useWorkDay = (date: Date | null) => {
  const [workDay, setWorkDay] = useState<WorkDay | null>(null);

  const parseDateForAPI = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if(!isNil(date)) {
      fetch(`/api/work_days/${parseDateForAPI(date)}`)
        .then((res) => {
          if(res.status === 204) {
            return null;
          }
          if(res.status !== 200) {
            throw Error(JSON.stringify(res.json()));
          }
          return res;
        })
        .then((res) => {
          if(isNil(res)) return res;
          return res.json();
        })
        .then((data) => {
          setWorkDay(isNil(data) ? null : {
            date: data.date as string,
            endTime: data.end_time as string,
            startTime: data.start_time as string,
          });
        })
        .catch((error) => console.error(error));
    } else {
      setWorkDay(null);
    }
  }, [date]);

  const createWorkDay = useCallback((startTime: string | null = null, endTime: string | null = null) => {
    if(isNil(date)) return;

    const promise = fetch(`/api/work_days`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date: parseDateForAPI(date),
        startTime,
        endTime: null,
      }),
    });

    promise.catch((error) => {
      console.error(error);
    });

    promise.then((response) => {
      if(response.status !== 200) console.error('Error: ', response.json());
      else return response;
    })
      .then((response) => response?.json())
      .then((data) => data && setWorkDay({
        date: data.date,
        startTime: data.start_time,
        endTime: data.end_time,
      }));

    return promise;
  }, [date]);

  const setStart = useCallback((startTime: string) => {
    if(isNil(date)) return;
    if(isNil(workDay)) { // work day is not created yet
      return createWorkDay(startTime);
    } else {
      const wd = {
        ...workDay,
        startTime,
      };
      setWorkDay(wd);

      const promise = fetch(`/api/work_days/${parseDateForAPI(date)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wd),
      });

      promise.catch((error) => {
        console.error(error);
      });

      return promise;
    }

  }, [date, workDay, createWorkDay]);

  const setEnd = async (endTime: string) => {
    if(isNil(date) || isNil(workDay)) return;
    const wd = {
      ...workDay,
      endTime,
    };
    setWorkDay(wd);

    const promise = fetch(`/api/work_days/${parseDateForAPI(date)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(wd),
    });

    promise.catch((error) => {
      console.error(error);
    });

    return promise;
  };

  return {
    workDay,
    setStart,
    setEnd,
  };
};

export default useWorkDay;