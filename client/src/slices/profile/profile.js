import { loadCurrentUser, login, logout, register, update } from './actions.js';
import { actions } from './profile.slice.js';

const allActions = {
  ...actions,
  login,
  register,
  logout,
  loadCurrentUser,
  update
};

export { allActions as actions };
export { reducer } from './profile.slice.js';
