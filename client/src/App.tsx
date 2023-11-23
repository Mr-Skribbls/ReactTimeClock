import { useState } from 'react';
import useWorkDay from './hooks/useWorkDay';
import useProjects from './hooks/useProjects';
import { CalendarValue } from './components/calendar/calendar';
import DayDetails from './components/dayDetails/dayDetails';
import './App.css';

function App() {
  const [date, setDate] = useState<CalendarValue>(new Date());
  const {workDay, setStart, setEnd} = useWorkDay(date as Date | null);
  const {projects, createProject, updateProject} = useProjects();

  return (
    <div className='app-container'>
      <DayDetails calendar={{date, setDate}} workDayProps={{workDay, setStart, setEnd}} />
    </div>
  );
}

export default App;
