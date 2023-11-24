import { ChangeEvent, FC, useState } from "react";
import { Project } from "../../../hooks/useProjects";
import AddProject from "../addProject/addProject";
import isNil from "lodash/isNil";
import './projectsList.css';
import { cloneDeep, isEqual } from "lodash";

interface ProjectsListsProps {
  projects: Project[]
  createProject: (project: Project) => Promise<Response>
  updateProject: (project: Project) => Promise<Project | undefined>
}

const ProjectsLists: FC<ProjectsListsProps> = ({
  projects,
  createProject,
  updateProject,
}) => {
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  const toggleEdit = (project: Project | null | undefined) => () => {
    setEditingProject(editingProject === project || isNil(project) ? null : project);
  };

  const saveChanges = (project: Project, editingProject: Project | null) => () => {
    if(!isNil(editingProject) && !isEqual(project, editingProject)) {
      updateProject(editingProject);
    }
    setEditingProject(null);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if(isNil(editingProject)) return;
    setEditingProject({
      ...editingProject,
      [event.target.name]: event.target.value,
    });
  };

  const handleToggle = (event: ChangeEvent<HTMLInputElement>) => {
    if(isNil(editingProject)) return;
    setEditingProject({
      ...editingProject,
      [event.target.name]: event.target.checked,
    });
  };

  const isEditing = (project: Project | undefined) => {
    if(isNil(editingProject) || isNil(project)) return false;
    return editingProject.id === project.id;
  };

  const projectEditor = (project: Project, key: number) => {
    return (
      <div key={key} className="project">
        <h2>
          <span>{project.name}</span>
          <span>{project.activity}</span>
          <button onClick={saveChanges(project, editingProject)}>Close</button>
        </h2>
        <div>
          <form className="project-editor">
            <div>
              <label htmlFor="project-active">Active: </label>
              <input
                type="checkbox"
                name="active"
                id="project-active"
                checked={editingProject?.active}
                onChange={handleToggle} />
            </div>
            <label htmlFor="project-description">Description: </label>
            <input
              type="text"
              name="description"
              id="project-description"
              value={editingProject?.description}
              onChange={handleChange} />
          </form>
        </div>
      </div>
    );
  };

  const projectViewer = (project: Project, key: number) => {
    return (
      <div key={key} className="project">
        <h2>
          <span>{project.name}</span>
          <span>{project.activity}</span>
          <button onClick={toggleEdit(project)}>Edit</button>
        </h2>
        <div>
          <span>{project.description}</span>
          <span>{project.active ? 'active' : 'not active'}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="projects-list">
      <h1>Projects</h1>
      <div className="projects-container">
        {projects.map((project, key) => {
          return isEditing(project) ?
            projectEditor(project, key) :
            projectViewer(project, key);
        })}
      </div>
      <AddProject createProject={createProject} />
    </div>
  );
};

export default ProjectsLists;