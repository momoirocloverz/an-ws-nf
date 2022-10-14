import { Reducer, Effect } from 'umi';
import { notification } from 'antd';
import { getTypeData } from '@/services/train';

export interface InfoModelState {
  trainTypeList?: Array<any>;
}

export interface PublicModelType {
  namespace: 'train';
  state: InfoModelState;
  effects: {
    queryTrainTypeList: Effect;
  };
  reducers: {
    saveTrainTypeList: Reducer;
  };
}

const TrainModal: PublicModelType = {
  namespace: 'train',

  state: {
    trainTypeList: [],
  },

  effects: {
    *queryTrainTypeList({}, { call, put }) {
      const res = yield call(getTypeData) ;

      if (res.code === 0) {
        yield put({
          type: 'saveTrainTypeList',
          payload: res.data.rows,
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
    saveTrainTypeList(state, action) {
      return {
        ...state,
        trainTypeList: action.payload,
      }
    },
  },
};

export default TrainModal;
