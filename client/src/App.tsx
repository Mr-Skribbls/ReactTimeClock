import { useState } from 'react';
// import Project from './components/projects/projects';
// import UpdateProject from './components/projects/updateProject';
// import useProjects from './hooks/useProjects';
import './App.css';
import AppCalendar, { CalendarValue } from './components/calendar/calendar';

function App() {
  // const {projects, createProject, updateProject} = useProjects();
  const [date, setDate] = useState<CalendarValue>(new Date());

  return (
    <div className='app-container'>
      <AppCalendar date={date} setDate={setDate} />
      {/* <Calendar onChange={setDate} value={date} /> */}
      {/* <Project projects={projects} createProject={createProject}></Project>
      {projects[0] && <UpdateProject project={projects[0]} updateProject={updateProject}></UpdateProject>} */}
    </div>
  );
}

export default App;
