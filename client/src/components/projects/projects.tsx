import { useState, ChangeEvent, FC } from 'react';
import './projects.css';
import { Project } from '../../hooks/useProjects';

interface ProjectViewProps {
  projects: Project[],
  createProject: (project: Project) => Promise<Response>
}

const ProjectView: FC<ProjectViewProps> = ({
  projects,
  createProject,
}) => {
  const [formProject, setFormProject] = useState<Project>({
    name: '',
    activity: '',
    active: true,
    description: '',
  });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormProject({
      ...formProject,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    const promise = createProject(formProject);
    promise.then(() => {
      setFormProject({
        name: '',
        activity: '',
        active: true,
        description: '',
      });
    });
  };

  return (
    <div className='App'>
      <header className='App-header'>
        {projects.map((project, key) => <div key={key}>
          <p>{project.id}</p>
          <p>{project.name}</p>
          <p>{project.activity}</p>
          <p>{project.active ? 'active' : 'inactive'}</p>
          <p>{project.description}</p>
        </div>)}
      </header>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          id='project-name'
          name='name'
          placeholder='project name'
          value={formProject.name}
          onChange={handleChange} />
        <input
          type='text'
          id='project-activity'
          name='activity'
          placeholder='project activity'
          value={formProject.activity}
          onChange={handleChange} />
        <input
          type='text'
          id='project-description'
          name='description'
          placeholder='project description'
          value={formProject.description}
          onChange={handleChange} />
        <input
          type='submit'
          id='submit'
          value="submit" />
      </form>
    </div>
  );
};

export default ProjectView;