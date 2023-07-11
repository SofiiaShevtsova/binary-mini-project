import { createAsyncThunk } from '@reduxjs/toolkit';

import { ExceptionMessage, StorageKey } from '~/libs/enums/enums.js';
import { HttpCode } from '~/packages/http/libs/enums/enums.js';
import { HttpError } from '~/packages/http/libs/exceptions/exceptions.js';
import { NotificationType } from '~/packages/notification/libs/enums/notification-type.enum.js';
import { notification } from '~/packages/notification/notification.js';

import { ActionType } from './common.js';

const login = createAsyncThunk(
  ActionType.LOG_IN,
  async (request, { rejectWithValue, extra: { services } }) => {
    try {
      const { user, token } = await services.auth.login(request);
      services.storage.setItem(StorageKey.TOKEN, token);
      return user;
    } catch (error) {
      notification[NotificationType.ERROR](error.message);
      return rejectWithValue(error.message);
    }
  }
);

const register = createAsyncThunk(
  ActionType.REGISTER,
  async (request, { rejectWithValue, extra: { services } }) => {
    try {
      const { user, token } = await services.auth.registration(request);
      services.storage.setItem(StorageKey.TOKEN, token);
      return user;
    } catch (error) {
      notification[NotificationType.ERROR](error.message);
      return rejectWithValue(error.message);
    }
  }
);

const update = createAsyncThunk(
  ActionType.UPDATE,
  async (request, { rejectWithValue, extra: { services } }) => {
    try {
      return await services.users.update(request);
    } catch (error) {
      notification[NotificationType.ERROR](error.message);
      return rejectWithValue(error.message);
    }
  }
);

const logout = createAsyncThunk(
  ActionType.LOG_OUT,
  (_request, { extra: { services } }) => {
    services.storage.removeItem(StorageKey.TOKEN);

    return null;
  }
);

const loadCurrentUser = createAsyncThunk(
  ActionType.LOG_IN,
  async (_request, { dispatch, rejectWithValue, extra: { services } }) => {
    try {
      return await services.auth.getCurrentUser();
    } catch (error) {
      const isHttpError = error instanceof HttpError;

      if (isHttpError && error.status === HttpCode.UNAUTHORIZED) {
        dispatch(logout());
      }

      return rejectWithValue(error?.message ?? ExceptionMessage.UNKNOWN_ERROR);
    }
  }
);

export { loadCurrentUser, login, logout, register, update };
