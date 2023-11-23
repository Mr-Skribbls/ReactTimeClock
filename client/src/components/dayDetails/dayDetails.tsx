import { Dispatch, FC, SetStateAction, MouseEvent, ChangeEvent } from "react";
import AppCalendar, { CalendarValue } from "../calendar/calendar";
import { WorkDay } from "../../hooks/useWorkDay";
import './dayDetails.css';
import isNil from "lodash/isNil";

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

  const handleStart = (event: MouseEvent) => {
    const d = new Date();
    const h = d.getHours();
    const m = d.getMinutes();
    workDayProps.setStart(`${h}.${m}`);
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