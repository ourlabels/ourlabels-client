import { isNull } from "util";
import {
  GOT_PROJECTS,
  CHANGED_PROJECT,
  GOT_PROJECT_FOR_UPDATE,
  GOT_FILE
} from "../redux-actions/project";

const currentProjectState = {
  projects: {
    owned: [],
    requested: [],
    allowed: [],
    refused: [],
    other: []
  },
  currentProject: null,
  projectForUpdate: null
};

const project = (state = currentProjectState, action) => {
  if (action.type === GOT_PROJECTS) {
    if (isNull(action.projects)) {
      return state;
    }
    const { projects } = action.projects;
    const owned = [];
    const requested = [];
    const allowed = [];
    const refused = [];
    const other = [];
    let currentProject;
    projects.forEach(aProject => {
      if (aProject.current_project) {
        currentProject = aProject.id;
      }
      if (aProject.owner) {
        owned.push(aProject);
      } else if (aProject.requested) {
        requested.push(aProject);
      } else if (aProject.allowed) {
        allowed.push(aProject);
      } else if (aProject.refused) {
        refused.push(aProject);
      } else {
        other.push(aProject);
      }
    });
    return Object.assign({}, state, {
      currentProject,
      projects: {
        owned,
        allowed,
        requested,
        refused,
        other
      }
    });
  } else if (action.type === GOT_FILE) {
    return state;
  } else if (action.type === CHANGED_PROJECT) {
    if (action.current_project == null) {
      return state;
    }
    return Object.assign({}, state, {
      current_project: action.current_project.current_project
    });
  } else if (action.type === GOT_PROJECT_FOR_UPDATE) {
    return Object.assign({}, state, {
      projectForUpdate: action.project
    });
  }
  return state;
};

export default project;
