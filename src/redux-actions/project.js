import { getLabels } from "./labels";
import { agent, HOSTNAME } from "../constants";

const binaryParser = require("superagent-binary-parser");
const fileDownload = require("js-file-download");

export const CHANGED_PROJECT = "CHANGED_PROJECT";
export const GOT_PROJECTS = "GOT_PROJECTS";
export const GOT_PROJECT_FOR_UPDATE = "GOT_PROJECT_FOR_UPDATE";
export const REQUESTED_ACCESS = "REQUESTED_ACCESS";
export const GOT_FILE = "GOT_FILE";

export const addProject = new_project => dispatch => {
  const {
    title,
    description,
    full_description,
    projectType,
    privateType
  } = new_project;
  agent
    .post(`${HOSTNAME}/v1/add/project`)
    .send({
      title,
      description,
      full_description,
      projectType: parseInt(projectType),
      privateType
    })
    .end((err, res) => {
      if (err || res.body == null) {
        dispatch(changedProject(null));
      } else if (res.body.success) {
        dispatch(changedProject(res.body));
      }
    });
};
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
  sequences,
  deletedSequences,
  newSequences
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
      .field("full_description", fullDescription)
      .field("projectType", type);
    const updatedNewSequences = newSequences.slice();
    const toDeleteIndices = deletedSequences.map((v, i) => {
      return v.index;
    });
    let i = 0;
    for (let j = 0; j < newSequences.length; j += 1) {
        req.attach("files", newSequences[j].file);
    }

    const newSequencesFiltered = newSequences.map(seq => {
      const {
        name,
        video,
        hSplit,
        vSplit,
        start,
        length,
        everyNFramces,
        begin,
        end
      } = seq;
      return {
        name,
        video,
        hSplit,
        vSplit,
        start,
        length,
        everyNFramces,
        begin,
        end
      };
    });
    req.field("new", JSON.stringify(newSequencesFiltered));
    req.field("delete[]", toDeleteIndices);
    req.end((err, res) => {
      for (const seq of sequences) {
        if (seq.file && typeof seq.file == "object") {
          window.URL.revokeObjectURL(seq.file.preview);
        }
      }
      dispatch(getProjects());
    });
  }
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
