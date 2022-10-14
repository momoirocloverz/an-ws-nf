import { Effect, Reducer } from 'umi';
import { query as queryUsers, queryMenuList, getAccountInfo, getUserButtonAuth, } from '@/services/user';
import {getPageQuery} from "@/utils/utils";
import {history} from "@@/core/history";
import {stringify} from "querystring";
import { logout } from '@/services/login';

export interface MenuList{
  menu_id: number;
  name: string;
  router?: string;
  icon: string;
  index: string;
  pid: number;
  created_at: string;
  is_deleted: number;
  is_group?: null;
  children: Array<any>,
}

export interface CurrentUser {
  avatar?: string;
  name?: string;
  title?: string;
  group?: string;
  signature?: string;
  tags?: {
    key: string;
    label: string;
  }[];
  userid?: string;
  unreadCount?: number;
}

export interface UserModelState {
  currentUser?: CurrentUser;
  menuList?: Array<MenuList>;
  accountInfo?: any;
  userAuthButton?: Array<any>;
}

export interface UserModelType {
  namespace: 'user';
  state: UserModelState;
  effects: {
    fetch: Effect;
    fetchMenuList: Effect;
    queryAccountInfo: Effect;
    queryUserAuthButton: Effect;
    logout: Effect;
  };
  reducers: {
    saveCurrentUser: Reducer<UserModelState>;
    changeNotifyCount: Reducer<UserModelState>;
    saveMenuList: Reducer<UserModelState>;
    saveAccountInfo: Reducer;
    saveUserAuthButton: Reducer;
    clearUser: Reducer;
  };
}

const UserModel: UserModelType = {
  namespace: 'user',

  state: {
    currentUser: {},
    accountInfo: {},
    userAuthButton: [],
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *queryAccountInfo(_, { call, put }) {
      const response = yield call(getAccountInfo);
      yield put({
        type: 'saveAccountInfo',
        payload: response.data,
      });
    },

    *fetchMenuList(_, { call, put}) {
      const response = yield call(queryMenuList);
      yield put({
        type: 'saveMenuList',
        payload: response.data.auth_menu_list,
      });
    },

    *queryUserAuthButton(_, { call, put }) {
      const response = yield call(getUserButtonAuth);
      yield put({
        type: 'saveUserAuthButton',
        payload: response.data.auth_info,
      });
    },

    *logout({}, { call, put }) {
      const result = yield call(logout);
      if(result?.code === 0) {
        localStorage.clear();
        localStorage.removeItem('antd-pro-authority');
        const { redirect } = getPageQuery();
        yield put({
          type: 'clearUser',
        });
        if (window.location.pathname !== '/user/login' && !redirect) {
          history.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: window.location.href,
            }),
          });
        }
      }
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
    saveMenuList(state, action)  {
      return {
        ...state,
        menuList: action.payload,
      }
    },
    saveAccountInfo(state, action) {
      return {
        ...state,
        accountInfo: action.payload,
      }
    },
    clearUser(state, action) {
      return {
        ...state,
        accountInfo: {},
      }
    },
    saveUserAuthButton(state, action) {
      return {
        ...state,
        userAuthButton: action.payload,
      }
    }
  },
};

export default UserModel;
