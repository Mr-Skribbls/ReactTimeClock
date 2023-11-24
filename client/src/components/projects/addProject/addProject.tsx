import { ChangeEvent, FC, useState } from "react";
import { Project } from "../../../hooks/useProjects";
import './addProject.css';

interface AddProjectProps {
  createProject: (project: Project) => Promise<Response>
}

const AddProject: FC<AddProjectProps> = ({
  createProject,
}) => {
  const [formProject, setFormProject] = useState<Project>({
    name: '',
    activity: '',
    active: true,
    description: '',
  });

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

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormProject({
      ...formProject,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <form className="add-project" onSubmit={handleSubmit}>
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
        value="Add" />
    </form>
  );
};

export default AddProject;