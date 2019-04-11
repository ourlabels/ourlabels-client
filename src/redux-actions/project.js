import { getLabels } from "./labels";
import { agent, HOSTNAME } from "../constants";

const binaryParser = require("superagent-binary-parser");
const fileDownload = require("js-file-download");

export const CHANGED_PROJECT = "CHANGED_PROJECT";
export const GOT_PROJECTS = "GOT_PROJECTS";
export const GOT_PROJECT_FOR_UPDATE = "GOT_PROJECT_FOR_UPDATE";
export const REQUESTED_ACCESS = "REQUESTED_ACCESS";
export const GOT_FILE = "GOT_FILE";

export const addProject = new_project => dispatch =>
  agent
    .post(`${HOSTNAME}/v1/add/project`)
    .send({ title: new_project.title, description: new_project.description })
    .end((err, res) => {
      if (err || res.body == null) {
        dispatch(changedProject(null));
      } else if (res.body.success) {
        dispatch(changedProject(res.body));
      }
    });
export const getProjectAnnotations = (id, type = "json") => dispatch =>
  agent
    .withCredentials()
    .get(`${HOSTNAME}/v1/get/annotations/as/${type}`)
    .query({ projectId: id }) // will check if project is available
    .responseType("blob")
    .then(res => {
      fileDownload(res.body, "annotations.tar.bz2");
    })
    .catch(err => {});
export const changeProject = project_id => dispatch =>
  agent
    .withCredentials()
    .post(`${HOSTNAME}/v1/change/project`)
    .send({ project_id }) // will check if project is available
    .end((err, res) => {
      if (err || res.body == null) {
        dispatch(changedProject(null));
      } else if (res.body.success) {
        // emit the action with payload
        dispatch(getProjects());
        dispatch(getLabels());
      }
    });
export const joinProject = project_id => (dispatch, getState) =>
  agent
    .withCredentials()
    .post(`${HOSTNAME}/v1/join/project`)
    .send({ project_id })
    .end((err, res) => {
      if (err || res.body == null || !res.body.success) {
        dispatch(changedProject(null));
      } else {
        dispatch(getProjects());
      }
    });

export const leaveProject = project_id => (dispatch, getState) =>
  agent
    .withCredentials()
    .post(`${HOSTNAME}/v1/leave/project`)
    .send({ project_id })
    .end((err, res) => {
      if (err || res.body == null || !res.body.success) {
        dispatch(changedProject(null));
      } else {
        dispatch(getProjects());
      }
    });

export const getProjectForUpdate = () => (dispatch, getState) => {
  return agent
    .withCredentials()
    .get(`${HOSTNAME}/v1/get/projects/update`)
    .end((err, res) => {
      if (err || res.body == null || !res.body.success) {
        dispatch(gotProjectForUpdate(null));
      } else {
        dispatch(getLabels());
        dispatch(gotProjectForUpdate(res.body));
      }
    });
};
export const requestAccessToProject = project_name => (dispatch, getState) => {
  // this would only happen if not specifically allowed (or would be join) or project not public
  // Therefore the user would be pressing the request button
  if (getState().auth.loggedIn) {
    return agent
      .withCredentials()
      .post(`${HOSTNAME}/v1/request/project`)
      .send({ project_name })
      .end((err, res) => {
        if (err || res.body == null || !res.body.success) {
          dispatch(requestedAccess(null));
        } else {
          dispatch(requestedAccess(res.body));
        }
      });
  }
};

export const updateProject = (
  allowed,
  refused,
  requested,
  publicType,
  owner,
  description,
  fullDescription,
  type,
  sequences
) => (dispatch, getState) => {
  if (getState().auth.loggedIn) {
    const req = agent
      .withCredentials()
      .post(`${HOSTNAME}/v1/update/project`)
      .field("allowed[]", allowed)
      .field("refused[]", refused)
      .field("requested[]", requested)
      .field("publicType", publicType)
      .field("owner", owner)
      .field("description", description)
      .field("fullDescription", fullDescription)
      .field("type", type);
    const newSequences = sequences.filter(seq => !seq.deleted && seq.new);
    const deleteSequences = sequences.filter(seq => !seq.new && seq.deleted);

    let i = 0;
    for (let j = 0; j < newSequences.length; j += 1) {
      const begin = i;
      i += newSequences[j].newFile.length;
      const end = i - 1;
      newSequences[j].begin = begin;
      newSequences[j].end = end;
      for (const file of newSequences[j].newFile) {
        req.attach("files", file);
      }
    }

    const newSequencesFiltered = newSequences.map(seq => {
      return filterObject(seq, [
        "newName",
        "newVideo",
        "newHSplit",
        "newVSplit",
        "newBeginS",
        "newLengthS",
        "newEveryNFrames",
        "begin",
        "end"
      ]);
    });
    const deleteSequencesFiltered = deleteSequences.map(seq => {
      return seq.originalName;
    });
    req.field("new", JSON.stringify(newSequencesFiltered));
    req.field("delete", JSON.stringify(deleteSequencesFiltered));
    req.end((err, res) => {
      for (const seq of sequences) {
        if (seq.newFile && typeof seq.newFile == "object") {
          for (const file of seq.newFile) {
            window.URL.revokeObjectURL(file.preview);
          }
        }
      }
      dispatch(getProjects());
    });
  }
};

const filterObject = (object, keepAttributes) => {
  const returnObject = {};
  if (keepAttributes.length === 0) {
    return object;
  }
  for (const attribute of keepAttributes) {
    returnObject[attribute] = object[attribute];
  }
  return returnObject;
};

export const getProjects = () => (dispatch, getState) => {
  if (getState().auth.loggedIn) {
    return agent
      .withCredentials()
      .get(`${HOSTNAME}/v1/get/projects`)
      .end((err, res) => {
        if (err || res.body == null || !res.body.success) {
          dispatch(gotProjects(null));
        } else {
          // emit the action with payload
          dispatch(gotProjects(res.body));
        }
      });
  }
  return agent.get(`${HOSTNAME}/v1/get/projects/guest`).end((err, res) => {
    if (err || res.body == null || !res.body.success) {
      dispatch(gotProjects(null));
    } else {
      // emit the action with payload
      dispatch(gotProjects(res.body));
    }
  });
};

const gotFile = payload => ({ type: GOT_FILE, fileBuffer: payload });

const changedProject = payload => ({
  type: CHANGED_PROJECT,
  current_project: payload
});

const gotProjects = payload => ({ type: GOT_PROJECTS, projects: payload });

export const gotProjectForUpdate = payload => ({
  type: GOT_PROJECT_FOR_UPDATE,
  project: payload
});

const requestedAccess = payload => ({
  type: REQUESTED_ACCESS,
  access_requested: payload
});
