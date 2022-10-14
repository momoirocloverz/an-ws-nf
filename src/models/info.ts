import { Reducer, Effect } from 'umi';
import { notification } from 'antd';
import { getAccountRoleList, getAreaList, getButtonPermission, getRoleAreaList } from '@/services/system';
import { getFamilyList, getChooseGroupList, chooseMasterTypeList, } from '@/services/customer';
import _ from 'lodash';
export interface MasterTypeState {
  id: number | string;
  title: string;
  value: number | string;
}

export interface MasterLevelState {
  id: number | string;
  title: string;
  value: number | string;
}
export interface InfoModelState {
  accountRoleList?: Array<any>;
  areaList?: Array<any>;
  roleAreaList?: Array<any>;
  buttonPermissionList?: Array<any>;
  familyList?: Array<any>;
  chooseGroupList?: Array<any>;
  masterTypeList?: Array<any>;
  masterLevel?: Array<any>;
}

export interface PublicModelType {
  namespace: 'info';
  state: InfoModelState;
  effects: {
    queryAccountRoleList: Effect;
    queryAreaList: Effect;
    queryRoleAreaList: Effect;
    queryButtonPermissionList: Effect;
    queryFamilyList: Effect;
    queryChooseGroupList: Effect;
    queryChooseMasterTypeList: Effect;
  };
  reducers: {
    saveAccountRoleList: Reducer;
    saveAreaList: Reducer;
    saveRoleAreaList: Reducer;
    saveButtonPermission: Reducer;
    saveFmailyList: Reducer;
    saveChooseGroupList: Reducer;
    saveMasterTypeList: Reducer;
  };
}

const PublicModel: PublicModelType = {
  namespace: 'info',

  state: {
    masterLevel: [
      // {
      //   id: 0,
      //   title: '专家',
      //   value: 0,
      // },
      {
        id: 1,
        title: '认证专家',
        value: 1,
      }
    ],
    accountRoleList: [],
    areaList: [],
    roleAreaList: [],
    familyList: [],
    chooseGroupList: [],
    masterTypeList: [],
  },

  effects: {
    *queryAccountRoleList({ }, { call, put }) {
      const res = yield call(getAccountRoleList);
      if (res.code === 0) {
        yield put({
          type: 'saveAccountRoleList',
          payload: res.data.rows,
        })
      } else {
        notification.warn({
          description: res.msg,
          message: '',
        })
      }
    },

    *queryAreaList({ }, { call, put }) {
      let res = null;
      console.error(window.location.pathname.split('/')[1], 'window.location');
      const userInfo = JSON.parse(<string>localStorage.getItem('userInfo'));
      // 市级账号允许看全部
      if(window.location.pathname.split('/')[1] === 'agriculture-subsidies' || userInfo.role_type === 2) {
          res = yield call(getAreaList, { is_not_all: '1' })
      } else {
        res = yield call(getAreaList);
      }
      if (res?.code === 0) {
        yield put({
          type: 'saveAreaList',
          payload: res?.data,
        })
      } else {
        notification.warn({
          description: res.msg,
          message: '',
        })
      }
    },

    *queryRoleAreaList({ }, { call, put }) {
      const res = yield call(getRoleAreaList);
      console.log(res);
      if (res.code === 0) {
        yield put({
          type: 'saveRoleAreaList',
          payload: res.data,
        })
      } else {
        notification.warn({
          description: res.msg,
          message: '',
        })
      }
    },

    *queryButtonPermissionList({ }, { call, put }) {
      const res = yield call(getButtonPermission);

      if (res.code === 0) {
        yield put({
          type: 'saveButtonPermission',
          payload: res.data.rows,
        })
      } else {
        notification.warn({
          description: res.msg,
          message: '',
        })
      }
    },

    *queryFamilyList({ }, { call, put }) {
      const res = yield call(getFamilyList);

      if (res.code === 0) {
        yield put({
          type: 'saveFmailyList',
          payload: res.data,
        })
      } else {
        console.error({
          description: res.msg,
          message: '',
        })
      }
    },

    *queryChooseGroupList({ }, { call, put }) {
      const res = yield call(getChooseGroupList);

      if (res.code === 0) {
        yield put({
          type: 'saveChooseGroupList',
          payload: _.isEmpty(res.data) ? [] : res.data,
        })
      } else {
        notification.warn({
          description: res.msg,
          message: '',
        })
      }
    },

    *queryChooseMasterTypeList({ }, { call, put }) {
      const res = yield call(chooseMasterTypeList);

      if (res.code === 0) {
        yield put({
          type: 'saveMasterTypeList',
          payload: res.data,
        })
      } else {
        notification.warn({
          description: res.msg,
          message: '',
        })
      }
    }
  },

  reducers: {
    saveAccountRoleList(state, action) {
      return {
        ...state,
        accountRoleList: action.payload,
      }
    },
    saveAreaList(state, action) {
      let userInfo: any = localStorage.getItem('userInfo');
      if (userInfo) {
        let user: any = JSON.parse(userInfo);
        let town_id = user.town_id;
        let role_type = user.role_type;
        if (role_type == 4) {
          action.payload.map(item => {
            item.children.map(items => {
              if (items.town_id !== town_id) {
                items.disabled = true;
              }
            })
          });
        }
      }
      return {
        ...state,
        areaList: action.payload,
      }
    },
    saveRoleAreaList(state, action) {
      return {
        ...state,
        roleAreaList: action.payload,
      }
    },
    saveButtonPermission(state, action) {
      return {
        ...state,
        buttonPermissionList: action.payload,

      }
    },
    saveFmailyList(state, action) {
      return {
        ...state,
        familyList: action.payload,
      }
    },
    saveChooseGroupList(state, action) {
      return {
        ...state,
        chooseGroupList: action.payload,
      }
    },
    saveMasterTypeList(state, action) {
      return {
        ...state,
        masterTypeList: action.payload,
      }
    }
  },
};

export default PublicModel;
