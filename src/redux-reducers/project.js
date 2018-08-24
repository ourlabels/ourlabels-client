import {
  GOT_PROJECTS,
  CHANGED_PROJECT,
  GOT_TYPES,
  GOT_PROJECT_FOR_UPDATE,
  GOT_FILE
} from "../redux-actions/project.js";
import { isNull } from "util";

const currentProjectState = {
  projects: { owned: [], requested: [], allowed: [], refused: [], other: [] },
  current_project: null,
  project_for_update: null
};

export const project = (state = currentProjectState, action) => {
  switch (action.type) {
    case GOT_PROJECTS:
      if (isNull(action.projects)) {
        return state;
      }
      const { projects } = action.projects;
      let owned = [];
      let requested = [];
      let allowed = [];
      let refused = [];
      let other = [];
      let current_project;
      projects.forEach(project => {
        if (project.current_project) {
          current_project = project.id;
        }
        if (project.owner) {
          owned.push(project);
        } else if (project.requested) {
          requested.push(project);
        } else if (project.allowed) {
          allowed.push(project);
        } else if (project.refused) {
          refused.push(project);
        } else {
          other.push(project);
        }
      });
      return Object.assign({}, state, {
        current_project,
        projects: {
          owned,
          allowed,
          requested,
          refused,
          other
        }
      });
    case GOT_FILE:
      console.log(action.fileBuffer);
      break;
    case CHANGED_PROJECT:
      if (action.current_project == null) {
        return state;
      }
      return Object.assign({}, state, {
        current_project: action.current_project.current_project
      });
    case GOT_PROJECT_FOR_UPDATE:
      return Object.assign({}, state, {
        project_for_update: action.project
      });
    default:
      return state;
  }
};
