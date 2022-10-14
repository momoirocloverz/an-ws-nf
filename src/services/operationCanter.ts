import request from '@/utils/request';
import { getApiParams } from '@/utils/utils';
import { ALL_API, IMG_UPLOAD_URL } from './api';
import { PUBLIC_KEY } from '@/services/api';
import CryptoJS from 'crypto-js'

// banner管理
export async function bannerList(params: any): Promise<any> {
  const addApiName = { ...params, api_name: "get_banner_info_list" };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function addBanner(params: any): Promise<any> {
  const addApiName = {
    api_name: "create_banner_info",
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function editBanner(params: any): Promise<any> {
  const addApiName = {
    api_name: "edit_banner_info",
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function deletBanner(params: any): Promise<any> {
  const addApiName = {
    api_name: "delete_banner_info",
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function jumpType(): Promise<any> {
  const addApiName = {
    api_name: "get_jump_type"
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 消息中心
export async function messageList(params: any): Promise<any> {
  const addApiName = {
    api_name: "message_list",
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function readMessage(params: any): Promise<any> {
  const addApiName = {
    api_name: "message_read",
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 12316
export async function questionList(params: any): Promise<any> {
  const addApiName = { ...params, api_name: "question_lists" };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function questionDetailList(params: any): Promise<any> {
  const addApiName = { ...params, api_name: "question_detail" };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function delQuestion(delId: any): Promise<any> {
  const addApiName = {
    question_id: delId,
    api_name: "question_delete"
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 删除图片
export async function delImage(imgId: number): Promise<any> {
  const addApiName = {
    image_id: imgId,
    api_name: "delete_image_info"
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function supplyList(params: any): Promise<any> {
  return request("/api/supply/list", {
    method: "POST",
    data: params
  });
}

// 文章配置
export async function articleList(params: any): Promise<any> {
  const addApiName = {
    api_name: "get_article_list",
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function articleType(): Promise<any> {
  const addApiName = {
    api_name: "get_article_type"
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function addArticle(params: any): Promise<any> {
  const addApiName = {
    api_name: "add_article_info",
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function editArticle(params: any): Promise<any> {
  const addApiName = {
    api_name: "edit_article_info",
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function uploadEditorImg(params: any): Promise<any> {
  const URL: string = await IMG_UPLOAD_URL();
  const data = new FormData();
  data.append("file", params.file);
  return request(URL, {
    method: "POST",
    requestType: "form",
    data
  });
}

export async function deletArticle(params: any): Promise<any> {
  const addApiName = {
    api_name: "delete_article_info",
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function editArticleStatus(params: any): Promise<any> {
  const addApiName = {
    api_name: "edit_article_status",
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 活动管理
export async function activityList(params: any): Promise<any> {
  const addApiName = {
    api_name: "get_activity_info_list",
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function deleteActivity(params: any): Promise<any> {
  const addApiName = {
    api_name: "delete_activity_info",
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function addActivity(params: any): Promise<any> {
  const addApiName = {
    api_name: "add_activity_info",
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

export async function editActivity(params: any): Promise<any> {
  const addApiName = {
    api_name: "edit_activity_info",
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 图片上传获取id
export async function getImgId(params: any): Promise<any> {
  const addApiName = {
    api_name: "save_image",
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 文件上传获取id
export async function getPdfId(params: any): Promise<any> {
  const addApiName = {
    api_name: "save_file",
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}


export async function getOSS(params: any = {}): Promise<any> {
  const addApiName = {
    api_name: "get_oss_config",  //  get_oss_config_info
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);

  const res = await request(ALL_API, {
    method: 'POST',
    data
  });
  if (res.code === 0) {
    const code = CryptoJS.MD5(res.data.key).toString();
    const iv = CryptoJS.enc.Utf8.parse(code.substring(0, 16));
    const key = CryptoJS.enc.Utf8.parse(code.substring(16));
    const newData = JSON.parse(CryptoJS.AES.decrypt(res.data.content, key, {
      iv,
      padding: CryptoJS.pad.Pkcs7
    }).toString(CryptoJS.enc.Utf8));

    newData.path = newData.path_class ?? '';
    newData.accessKeyId = newData.access_key;
    newData.accessKeySecret = newData.secret_key;
    console.log(newData)
    return new Promise((resolve, reject) => {
      if (res.code === 0) {
        resolve({
          code: res.code,
          data: newData
        });
      } else {
        reject(res);
      }

    });
  }

}

export async function getFamilyList(params: any = {}): Promise<any> {
  const addApiName = {
    api_name: "get_activity_info",
    ...params
  };
  const data = getApiParams(addApiName, PUBLIC_KEY);
  return request(ALL_API, {
    method: "POST",
    data
  });
}

// 推送消息列表
export async function noticeList(params: any): Promise<any> {
  const _params = {
    api_name: "notice_lists",
    ...params
  };
  return request(ALL_API, {
    method: "POST",
    data: _params
  });
}

// 新建或编辑消息
export async function makeNotice(params: any): Promise<any> {
  const _params = {
    api_name: "make_notice",
    ...params
  };
  return request(ALL_API, {
    method: "POST",
    data: _params
  });
}

// 推送消息
export async function sendNotice(params: any): Promise<any> {
  const _params = {
    api_name: "send_notice",
    ...params
  };
  return request(ALL_API, {
    method: "POST",
    data: _params
  });
}

// 删除消息
export async function deleteNotice(params: any): Promise<any> {
  const _params = {
    api_name: "delete_notice",
    ...params
  };
  return request(ALL_API, {
    method: "POST",
    data: _params
  });
}
