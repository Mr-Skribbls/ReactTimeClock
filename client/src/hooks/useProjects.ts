import isNil from 'lodash/isNil';
import { useState, useEffect, useCallback } from 'react';

export interface Project {
  id?: number,
  name: string,
  activity: string,
  active: boolean,
  description: string,
}

const useProjects = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        setProjects(data);
      })
      .catch((error) => console.error(error));
  }, []);

  const createProject = useCallback((project: Project) => {
    const promise = fetch('api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(project),
    });

    promise.catch((error) => {
      console.error(error);
    });

    promise.then((response) => {
      if (response.status !== 200) console.error('Error: ', response.json());
      else return response;
    })
      .then((response) => response?.json())
      .then((data) => data && setProjects((prev) => [
        ...prev,
        data,
      ]));

    return promise;
  }, []);

  const readProject = useCallback((projectId: number) => {
    const emptyProject = {
      name: '',
      activity: '',
      active: true,
      description: '',
    };
    return projects.find((project) => project.id === projectId) || emptyProject;
  }, [projects]);

  const updateProject = useCallback(async (project: Project): Promise<Project | undefined> => {
    try {
      console.log(project);
      let response = await fetch(`api/projects/${project.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(project),
      });

      if (response.status !== 200) {
        throw Error(`Error: ${await response.json()}`);
      }

      let data = await response.json() as Project;

      if (isNil(data)) {
        throw Error('Update request did not respond with project');
      }

      setProjects((prev) => [
        ...prev.filter((project) => project.id !== data?.id),
        data,
      ].sort(sortProjects));

      if (data.id) {
        return projects.find((project) => project.id === data.id);
      }

    } catch (error) {
      console.error(error);
    }
  }, [projects]);

  const sortProjects = (a: Project, b: Project) => {
    if (isNil(a.id)) {
      return -1;
    }
    if (isNil(b.id)) {
      return 1;
    }
    return a.id > b.id ? 1 : a.id < b.id ? -1 : 0;
  };

  return {
    projects,
    createProject,
    readProject,
    updateProject,
  };
};

export default useProjects;