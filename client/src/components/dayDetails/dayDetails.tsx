import { Dispatch, FC, SetStateAction, MouseEvent, ChangeEvent } from "react";
import AppCalendar, { CalendarValue } from "../calendar/calendar";
import { WorkDay } from "../../hooks/useWorkDay";
import './dayDetails.css';
import isNil from "lodash/isNil";
import { toNumber } from "lodash";

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

  const toDoubleDigit = (n: number) => {
    return n.toLocaleString('en-US', {
      minimumIntegerDigits: 2,
      maximumFractionDigits: 0,
      useGrouping: false,
    });
  };

  const getAccruedTime = (workDay: WorkDay) => {
    const minutesPerHour = 60;

    const splitStart = workDay.startTime.split('.');
    const startHours = splitStart[0];
    const startMinutes = splitStart[1];
    const totalStartMinutes = (toNumber(startHours) * minutesPerHour) + toNumber(startMinutes);

    const splitEnd = workDay.endTime.split('.');
    const endHours = splitEnd[0];
    const endMinutes = splitEnd[1];
    const totalEndMinutes = (toNumber(endHours) * minutesPerHour) + toNumber(endMinutes);

    const deltaMinutes = totalEndMinutes - totalStartMinutes;
    const hours = Math.floor(deltaMinutes) / minutesPerHour;
    const minutes = deltaMinutes % minutesPerHour;

    return `${toDoubleDigit(hours)}.${toDoubleDigit(minutes)}`;
  };

  const handleStart = (event: MouseEvent) => {
    const d = new Date();
    workDayProps.setStart(`${toDoubleDigit(d.getHours())}.${toDoubleDigit(d.getMinutes())}`);
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
            <div>{getAccruedTime(workDayProps.workDay)}</div>
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