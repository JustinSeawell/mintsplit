import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { Project } from "../types/Project";

interface ProjectContextValue {
  project: Project;
  setProject: Dispatch<SetStateAction<Project>>;
}

const ProjectContext = createContext<ProjectContextValue>(null);

export const ProjectProvider = ({ children }) => {
  const [project, setProject] = useState<Project>(null);

  return (
    <ProjectContext.Provider value={{ project, setProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProject = () => useContext(ProjectContext);
