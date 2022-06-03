import { createSelector } from "reselect";

const mainState = (state) => state.main;

export const getIsDesktop = createSelector(
  mainState,
  (state) => state.isDesktop
);

export const getPlatform = createSelector(mainState, (state) => state.platform);

export const getTeachers = createSelector(mainState, (state) => state.teachers);

export const getGroups = createSelector(mainState, (state) => state.groups);

export const getSelected = createSelector(mainState, (state) => state.selected);
