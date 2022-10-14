/**
 * request 网络请求工具
 * 更详细的 api 文档: https://github.com/umijs/umi-request
 */
import { extend } from 'umi-request';
import { notification } from 'antd';
import { history } from 'umi';
import { stringify } from 'querystring';
import { getApiParams, getPageQuery, getLocalToken } from '@/utils/utils';
import { PUBLIC_KEY } from '@/services/api';

const NOT_LOGIN = 25; // 未登录
const TOKEN_ERROR = 28; // token 无效

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

/**
 * 异常处理程序
 */
const errorHandler = (error: { response: Response }): Response => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  } else if (!response) {
    notification.error({
      description: '您的网络发生异常，无法连接服务器',
      message: '网络异常',
    });
  }
  return response;
};

/**
 * 配置request请求时的默认参数
 */
const request = extend({
  errorHandler, // 默认错误处理
  credentials: 'include', // 默认请求是否带上cookie
});

function asFile(options) {
  return (
    [
      'export_word',
      'export_farm_machinery',
      'export_reported_record',
      'export_statistics',
      'export_agricultural',
      'export_subsidy_formula_fertilizer',
      'export_city_subsidy_formula_fertilizer_declare',
      'export_city_subsidy_formula_fertilizer_declare_payment_record_list',
      'export_town_subsidy_formula_fertilizer_declare',
      'export_town_subsidy_formula_fertilizer_declare_payment_record_list',
      'export_subsidy_formula_declare_village',
      'export_subsidy_formula_fertilizer_declare',
      'export_town_subsidy_formula_fertilizer_declare_reject_record_list',
    ].includes(options.data.api_name) ||
    ([
      'declare_village_list',
      'declare_reject_list',
      'declare_town_list',
      'declare_city_list',
      'import_declares_spring_info',
      'import_declares_info',
      'declares_payment_record_list',
      'warm_problem_list',
      'get_labor_user',
      'labor_user_list',
      'subsidy_disposable_list',
      'export_subsidy_disposable',
      'declare_town_village_list',
      'declares_data_statistics_list',
      'declares_statistics_info',
      'declare_city_town_list',
      'declare_town_list_new',
      'universe_inspection_list',
      'profession_list',
      'team_leader_grid_overview_list',
      'village_other_list',
      'land_circulation_info_list',
      'citizen_list',
      'vote_list',
      'declares_object_data_statistics_list',
    ].includes(options.data.api_name) &&
      options.data.is_export)
  );
}

request.interceptors.request.use((url: string, options: any) => {
  if (asFile(options)) {
    options.responseType = 'blob';
  }
  if (options.data.api_name !== 'login' && url.indexOf('/farmapi/gateway') > -1) {
    const token = getLocalToken();
    if (!token) {
      localStorage.clear();
      localStorage.clear();
      const { redirect } = getPageQuery();
      if (window.location.pathname !== '/user/login' && !redirect) {
        history.replace({
          pathname: '/user/login',
          search: stringify({
            redirect: window.location.href,
          }),
        });
      }
    }

    // 上传图片时跳过添加默认参数
    if (url.indexOf('upload_image_info') === -1) {
      const reqParams = {
        ...options.data,
      };
      const _params = getApiParams(reqParams, PUBLIC_KEY);
      options.data = _params;
    }

    const headers = {
      Authorization: token,
    };
    return {
      url,
      options: { ...options, headers },
    };
  }

  return {
    url,
    options: { ...options },
  };
});

request.interceptors.response.use(async (response) => {
  try {
    const data = await response.clone().json();
    if (response.status === 200) {
      if (data.error === 0 || data.code === 0) {
        return response;
      }
      if (data.code === NOT_LOGIN || data.code === TOKEN_ERROR) {
        window.location.href = '/user/login';
        notification.error({
          description: '登录状态失效，请重新登录',
          message: '提示',
        });
      }
    }
  } catch (err) {
  } finally {
    return response;
  }
});

export default request;
