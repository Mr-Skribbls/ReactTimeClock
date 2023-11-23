import { Dispatch, FC, SetStateAction, MouseEvent, ChangeEvent, useState, useEffect, useCallback } from 'react';
import AppCalendar, { CalendarValue } from '../calendar/calendar';
import { WorkDay } from '../../hooks/useWorkDay';
import './dayDetails.css';
import isNil from 'lodash/isNil';
import isEmpty from 'lodash/isEmpty';
import toNumber from 'lodash/toNumber';

interface DayDetailsCalendarProps {
  date: CalendarValue
  setDate: Dispatch<SetStateAction<CalendarValue>>
}

interface DayDetailsWorkDayProps {
  workDay: WorkDay | null
  setStart: Dispatch<string>
  setEnd: Dispatch<string>
}

interface DayDetailsProps {
  calendar: DayDetailsCalendarProps
  workDayProps: DayDetailsWorkDayProps
}

const DayDetails: FC<DayDetailsProps> = ({
  calendar,
  workDayProps,
}) => {
  const [accruedTime, setAccruedTime] = useState('');

  const getCurrentTime = useCallback(() =>  {
    const d = new Date();
    return `${toDoubleDigit(d.getHours())}.${toDoubleDigit(d.getMinutes())}`;
  }, []);

  useEffect(() => {
    const getAccruedTime = (workDay: WorkDay) => {
      if(isNil(workDay.startTime)) return '00.00';

      const startTime = workDay.startTime;
      const endTime = isNil(workDay.endTime) || isEmpty(workDay.endTime) ? getCurrentTime() : workDay.endTime;

      const minutesPerHour = 60;

      const splitStart = startTime.split('.');
      const startHours = splitStart[0];
      const startMinutes = splitStart[1];
      const totalStartMinutes = (toNumber(startHours) * minutesPerHour) + toNumber(startMinutes);

      const splitEnd = endTime.split('.');
      const endHours = splitEnd[0];
      const endMinutes = splitEnd[1];
      const totalEndMinutes = (toNumber(endHours) * minutesPerHour) + toNumber(endMinutes);

      const deltaMinutes = totalEndMinutes - totalStartMinutes;
      const hours = Math.floor(deltaMinutes) / minutesPerHour;
      const minutes = deltaMinutes % minutesPerHour;

      return `${toDoubleDigit(hours)}.${toDoubleDigit(minutes)}`;
    };

    const interval = setInterval(() => {
      if (!isNil(workDayProps.workDay)) {
        setAccruedTime(getAccruedTime(workDayProps.workDay));
      }
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [workDayProps.workDay, getCurrentTime]);

  const toDoubleDigit = (n: number) => {
    return n.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      maximumFractionDigits: 0,
      useGrouping: false,
    });
  };

  const handleStart = (event: MouseEvent) => {
    workDayProps.setStart(getCurrentTime());
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const actions: {
      [key: string]: Dispatch<string>
    } = {
      'start-time': workDayProps.setStart,
      'end-time': workDayProps.setEnd,
    };

    const fn = actions[event.target.name];

    if(!isNil(fn)) {
      fn(event.target.value);
    } else {
      throw Error(`${event.target.name} is not a registered input for this handler`);
    }
  };

  return (
    <div className="day-details">
      <AppCalendar date={calendar.date} setDate={calendar.setDate} />
      <div>
        {
          workDayProps.workDay ?
          <div>
            <input
              type="text"
              name="start-time"
              value={workDayProps.workDay.startTime}
              onChange={handleChange} />
            <input
              type="text"
              name="end-time"
              value={workDayProps.workDay.endTime}
              onChange={handleChange} />
            <div>{accruedTime}</div>
          </div> :
          <div>
            <button onClick={handleStart}>Start</button>
          </div>
        }
      </div>
    </div>
  );
};

export default DayDetails;