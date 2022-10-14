import { Reducer, Effect } from 'umi';
import { notification } from 'antd';
import { getNavList, allMenuList,  } from '@/services/system';

export interface roleType  {
  id: number;
  code: string;
  role_name: string,
  desc: string,
  authority: number;
}

export interface NavigationType{
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

export interface SystemType {
  navigationList: Array<NavigationType>;
  navList?: Array<roleType>;
  allMemuList: Array<NavigationType>;
}

export interface SystemModelType {
  namespace: string;
  state: SystemType;
  effects: {
    queryAllMenuList: Effect;
    queryNavList: Effect;    
  };
  reducers: {
    saveNavList: Reducer;
    saveAllMenu: Reducer;
  };
}

const Model: SystemModelType = {
  namespace: 'system',

  state: {
    navList: [],
    allMemuList: [],
    navigationList: [],
  },

  effects: {
    
    *queryNavList({}, { call, put}) {
      const res = yield call(getNavList);

      if (res.code === 0) {
        yield put({
          type: 'saveNavList',
          payload: res.data.rows,
        })
      } else {
        notification.warn({
          description: res.msg,
          message: '',
        })
      }
    },

    *queryAllMenuList({}, { call, put }) {
      const res = yield call(allMenuList) ;

      if (res.code === 0) {
        yield put({
          type: 'saveAllMenu',
          payload: res.data
        })
      } else {
        notification.warn({
          description: res.msg,
          message: '',
        })
      }
    },
  },

  reducers: {
    saveNavList(state, action) {
      return {
        ...state,
        navList: action.payload,
      }
    },
    saveAllMenu(state, action) {
      return {
        ...state,
        allMemuList: action.payload,
      }
    }
  },
};

export default Model;
