import { FC, Dispatch, SetStateAction} from 'react';
import Calendar from 'react-calendar';
import './calendar.css';

interface AppCalendarProps {
  date: CalendarValue,
  setDate: Dispatch<SetStateAction<CalendarValue>>,
}

type CalendarValuePiece = Date | null;
export type CalendarValue = CalendarValuePiece | [CalendarValuePiece, CalendarValuePiece]

const AppCalendar: FC<AppCalendarProps> = ({
  date,
  setDate,
}) => {
  return <Calendar onChange={setDate} value={date} />;
};

export default AppCalendar;