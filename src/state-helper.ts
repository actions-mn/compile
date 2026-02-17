import { getState, saveState } from "@actions/core";

export const IsPost = !!getState("isPost");

// Publish a variable so that when the POST action runs, it can determine it should run the cleanup logic.
if (!IsPost) {
  saveState("isPost", "true");
}
