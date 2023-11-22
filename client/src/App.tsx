import { useState } from 'react';
import './App.css';
import AppCalendar, { CalendarValue } from './components/calendar/calendar';

function App() {
  // const {projects, createProject, updateProject} = useProjects();
  const [date, setDate] = useState<CalendarValue>(new Date());

  return (
    <div className='app-container'>
      <AppCalendar date={date} setDate={setDate} />
    </div>
  );
}

export default App;
