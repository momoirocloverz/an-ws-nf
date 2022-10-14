import Cookies from "js-cookie";
import { history, Reducer, Effect } from "umi";
import { stringify } from "querystring";
import { userLogin } from "@/services/login";
import { setAuthority } from "@/utils/authority";
import { getPageQuery } from "@/utils/utils";
import { message } from "antd";
import { getPublicKey } from "@/services/secretLogin";

export interface StateType {
  status?: "ok" | "error";
  type?: string;
  currentAuthority?: "user" | "guest" | "admin";
  userInfo?: object;
  pubKey?: string;
}

export interface LoginModelType {
  namespace: string;
  state: StateType;
  effects: {
    login: Effect;
    pubKey: Effect;
  };
  reducers: {
    changeLoginStatus: Reducer<StateType>;
    saveAccountInfo: Reducer<any>;
    savePubKey: Reducer<any>;
  };
}

const Model: LoginModelType = {
  namespace: "login",

  state: {
    status: undefined,
    userInfo: {},
    pubKey: ""
  },

  effects: {
    * login({ payload }, { call, put }) {
      const response = yield call(userLogin, payload);
      if (response && response.code === 0) {
        // 登录成功
        const resData = response.data || {};
        localStorage.setItem("userInfo", JSON.stringify(resData.adminInfo));
        yield put({
          type: "saveAccountInfo",
          payload: resData
        });

        if (!!resData.tokeInfo.token) {
          localStorage.setItem("WSNF_TOKEN", resData.tokeInfo.token);
        }

        if (resData.adminInfo) {
          Cookies.set("openPasswordSafe", 1);
          // 新增跳转逻辑 如果是浙农补账号不显示
          /**
           * 配方肥默认路由
           * 18 agriculture-subsidies/formula-fertilizer-management-town
           * 17 agriculture-subsidies/formula-fertilizer-management
           * 19 agriculture-subsidies/formula-fertilizer-management-village
           * 浙农补默认路由
           * 10 agriculture-subsidies/claim-management
           * 11 agriculture-subsidies/claim-management
           * 12 agriculture-subsidies/claim-management
           * **/
          const urlArr = {
            '10': '/agriculture-subsidies/claim-management',
            '11': '/agriculture-subsidies/claim-management',
            '12': '/agriculture-subsidies/claim-management',
            '17': '/agriculture-subsidies/formula-fertilizer-management',
            '18': '/agriculture-subsidies/formula-fertilizer-management-town',
            '19': '/agriculture-subsidies/formula-fertilizer-management-village',
            '20': '/agriculture-subsidies/agricultural-machinery', // 21 农机市
            '21': '/agriculture-subsidies/agricultural-machinery', // 21 农机镇
          };
          if (urlArr[resData.adminInfo?.role_id?.toString()]) {
            history.replace(urlArr[resData.adminInfo?.role_id]);
          } else {
            history.replace('/index');
          }

          // 这段逻辑先注释，涉及到权限问题，如果更换一个账号不允许跳到上一个账号退出时得默认页面
          // const urlParams = new URL(window.location.href);
          // const params = getPageQuery();
          // let { redirect } = params as { redirect: string };
          // if (redirect) {
          //   const redirectUrlParams = new URL(redirect);
          //   if (redirectUrlParams.origin === urlParams.origin) {
          //     redirect = redirect.substr(urlParams.origin.length);
          //     if (redirect.match(/^\/.*#/)) {
          //       redirect = redirect.substr(redirect.indexOf('#') + 1);
          //     }
          //   } else {
          //     window.location.href = '/';
          //     return;
          //   }
          // }
          //   history.replace(redirect || '/');

        }
      } else {
        message.error(response.msg);
        yield put({
          type: "saveAccountInfo",
          payload: response
        });
      }
    },


    * pubKey({}, { call, put }) {
      const result = yield call(getPublicKey);
      if (result?.code === 0) {
        const resData = result.data || {};
        yield put({
          type: "savePubKey",
          payload: resData.content
        });
      }
    }
  },

  reducers: {
    saveAccountInfo(state: any, action: any) {
      return {
        ...state,
        userInfo: action.payload
      };
    },

    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: payload.status,
        type: payload.type
      };
    },

    savePubKey(state: any, action: any) {
      return {
        ...state,
        pubKey: action.payload
      };
    }
  }
};

export default Model;
