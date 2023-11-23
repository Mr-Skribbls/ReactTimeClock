import { ChangeEvent, FC, useEffect, useState } from "react";
import { Project } from "../../hooks/useProjects";

interface UpdateProjectProps {
  project: Project,
  updateProject: (project: Project) => Promise<Project | undefined>
}

const UpdateProject: FC<UpdateProjectProps> = ({
  project,
  updateProject,
}) => {
  const [formProject, setFormProject] = useState<Project>(project);

  useEffect(() => {
    setFormProject(project);
  }, [project]);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setFormProject({
      ...formProject,
      [event.target.name]: event.target.value,
    });
  };

  const handleToggle = (event: ChangeEvent<HTMLInputElement>) => {
    setFormProject({
      ...formProject,
      [event.target.name]: event.target.checked,
    });
  };

  const handleSubmit = (event: ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateProject(formProject);
  };

  return (
    <div className="App">
      <header className="App-header">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            id="project-name"
            name="name"
            placeholder="project name"
            value={formProject.name}
            disabled />
          <input
            type="text"
            id="project-activity"
            name="activity"
            placeholder="project activity"
            value={formProject.activity}
            disabled />
          <input
            type="checkbox"
            id="project-active"
            name="active"
            placeholder="project active"
            checked={formProject.active}
            onChange={handleToggle} />
          <label htmlFor="active">Active</label>
          <input
            type="text"
            id="project-description"
            name="description"
            placeholder="project description"
            value={formProject.description}
            onChange={handleChange} />
          <input
            type="submit"
            id="submit"
            value="submit" />
        </form>
      </header>
    </div>
  );
};

export default UpdateProject;