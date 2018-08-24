import request from "superagent";
const binaryParser = require("superagent-binary-parser");
const fileDownload = require("js-file-download");
import { getLabels } from "./labels";
let HOSTNAME = "https://ourlabels.org";
if (process.env.NODE_ENV === "development") {
  HOSTNAME = "http://localhost:59003";
}

export const CHANGED_PROJECT = "CHANGED_PROJECT";
export const GOT_PROJECTS = "GOT_PROJECTS";
export const GOT_PROJECT_FOR_UPDATE = "GOT_PROJECT_FOR_UPDATE";
export const REQUESTED_ACCESS = "REQUESTED_ACCESS";
export const GOT_FILE = "GOT_FILE";

export const addProject = new_project => dispatch => {
  return request
    .agent()
    .post(HOSTNAME + "/v1/add/project")
    .send({ title: new_project.title, description: new_project.description })
    .end((err, res) => {
      if (err || res.body == null) {
        dispatch(changedProject(null));
        return;
      } else if (res.body.success) {
        dispatch(changedProject(res.body));
        return;
      }
    });
};
export const getProjectAnnotations = (id, type = "json") => dispatch => {
  return request
    .agent()
    .withCredentials()
    .get(`${HOSTNAME}/v1/get/annotations/as/${type}`)
    .query({ projectId: id }) // will check if project is available
    .responseType("blob")
    .then(res => {
      console.log(res);
      fileDownload(res.body, "annotations.tar.bz2");
    })
    .catch(err => {});
};
export const changeProject = project_id => dispatch => {
  return request
    .agent()
    .withCredentials()
    .post(HOSTNAME + "/v1/change/project")
    .send({ project_id }) // will check if project is available
    .end((err, res) => {
      console.log("CHANGE PROJECT:", res);
      if (err || res.body == null) {
        dispatch(changedProject(null));
        return;
      } else if (res.body.success) {
        // emit the action with payload
        dispatch(getProjects());
        dispatch(getLabels());
        return;
      }
    });
};
export const joinProject = project_id => (dispatch, getState) => {
  return request
    .agent()
    .withCredentials()
    .post(`${HOSTNAME}/v1/join/project`)
    .send({ project_id })
    .end((err, res) => {
      if (err || res.body == null || !res.body.success) {
        dispatch(changedProject(null));
        return;
      } else {
        dispatch(getProjects());
        return;
      }
    });
};

export const leaveProject = project_id => (dispatch, getState) => {
  return request
    .agent()
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
};

export const getProjectForUpdate = project_id => (dispatch, getState) => {
  return request
    .agent()
    .withCredentials()
    .get(`${HOSTNAME}/v1/get/projects/update`)
    .query({ project_id })
    .end((err, res) => {
      if (err || res.body == null || !res.body.success) {
        dispatch(gotProjectForUpdate(null));
      } else {
        dispatch(gotProjectForUpdate(res.body));
      }
    });
};
export const requestAccessToProject = project_name => (dispatch, getState) => {
  // this would only happen if not specifically allowed (or would be join) or project not public
  // Therefore the user would be pressing the request button
  if (getState().auth.logged_in) {
    return request
      .agent()
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
  project_id,
  allowed,
  refused,
  requested,
  now_public = null,
  owner = null,
  description = null,
  full_description = null,
  type = null,
  sequences = null
) => (dispatch, getState) => {
  if (getState().auth.logged_in) {
    let req = request
      .agent()
      .withCredentials()
      .post(`${HOSTNAME}/v1/update/project`)
      .field("project_id", project_id)
      .field("allowed[]", allowed)
      .field("refused[]", refused)
      .field("requested[]", requested)
      .field("public", now_public)
      .field("owner", owner)
      .field("description", description)
      .field("full_description", full_description)
      .field("type", type);
    let newSequences = Object.keys(sequences).filter(key => {
      return !sequences[key].deleted && sequences[key].new;
    });
    let updatedSequences = Object.keys(sequences).filter(key => {
      return !sequences[key].deleted && sequences[key].updated;
    });
    let deleteSequences = Object.keys(sequences).filter(key => {
      return !sequences[key].new && sequences[key].deleted;
    });

    let newSequencesObject = filterObject(sequences, newSequences, [
      "name",
      "video"
    ]);
    let updateSequenceObject = filterObject(sequences, updatedSequences, [
      "name",
      "video"
    ]);

    let i = 0;
    for (let seqkey of newSequences) {
      let seq = sequences[seqkey];
      let begin = i;
      i = i + seq.files.length;
      let end = i - 1;
      newSequencesObject[seqkey].begin = begin;
      newSequencesObject[seqkey].end = end;
      for (let file of seq.files) {
        req.attach("files", file);
      }
    }

    for (let seqkey of updatedSequences) {
      let seq = sequences[seqkey];
      let begin = i;
      i = i + seq.files.length;
      let end = i - 1;
      updateSequenceObject[seqkey].begin = begin;
      updateSequenceObject[seqkey].end = end;
      for (let file of seq.files) {
        req.attach("files", file);
      }
    }
    req.field("new", JSON.stringify(newSequencesObject));
    req.field("update", JSON.stringify(updateSequenceObject));
    req.field("delete", JSON.stringify(deleteSequences));
    req.end((err, res) => {
      for (let seqkey of Object.keys(sequences)) {
        let seq = sequences[seqkey];
        for (let file of seq.files) {
          window.URL.revokeObjectURL(file.preview);
        }
      }
      dispatch(getProjects());
    });
  }
};

const filterObject = (object, keys, keepAttributes) => {
  let returnObject = {};
  for (let key of keys) {
    let subObject = {};
    if (keepAttributes.length == 0) {
      subObject = object[key];
    } else {
      for (let keepAttribute of keepAttributes) {
        subObject[keepAttribute] = object[key][keepAttribute];
      }
    }
    returnObject[key] = subObject;
  }
  return returnObject;
};
export const getProjects = () => (dispatch, getState) => {
  if (getState().auth.logged_in) {
    return request
      .agent()
      .withCredentials()
      .get(HOSTNAME + "/v1/get/projects")
      .end((err, res) => {
        if (err || res.body == null || !res.body.success) {
          dispatch(gotProjects(null));
        } else {
          // emit the action with payload
          dispatch(gotProjects(res.body));
        }
      });
  } else {
    return request
      .agent()
      .get(HOSTNAME + "/v1/get/projects/guest")
      .end((err, res) => {
        if (err || res.body == null || !res.body.success) {
          dispatch(gotProjects(null));
        } else {
          // emit the action with payload
          dispatch(gotProjects(res.body));
        }
      });
  }
};
const gotFile = payload => {
  return { type: GOT_FILE, fileBuffer: payload };
};
const changedProject = payload => {
  return { type: CHANGED_PROJECT, current_project: payload };
};

const gotProjects = payload => {
  return { type: GOT_PROJECTS, projects: payload };
};

const gotProjectForUpdate = payload => {
  return { type: GOT_PROJECT_FOR_UPDATE, project: payload };
};

const requestedAccess = payload => {
  return { type: REQUESTED_ACCESS, access_requested: payload };
};
