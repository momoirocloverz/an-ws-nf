import {
  Button, message, notification
} from 'antd';
import React, { useRef, useState } from 'react';
import { getApiParams, getLocalToken } from '@/utils/utils';
import { PUBLIC_KEY } from '@/services/api';

type PropType = {
  btnText?: string;
  api: string;
  params?: Record<string, any>;
  onSuccess?: () => unknown;
  method?: string;
}

export default function ImportBtn({
  btnText, api, params, onSuccess, method,
} : PropType) {
  const [isImporting, setIsImporting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const upload = async (file : File | undefined | null) => {
    if (!file) { return; }
    setIsImporting(true);
    const formData = new FormData();
    const headers = new Headers();
    console.log(getLocalToken(), 'token-token-token');
    headers.append('Authorization', getLocalToken() ?? '');
    formData.append('file', file);
    const data = getApiParams({ api_name: api, ...params }, PUBLIC_KEY);
    Object.entries(data).forEach(([k, v]) => formData.append(k, v));

    fetch('/farmapi/gateway', {
      headers,
      method,
      cache: 'no-cache',
      body: formData,
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.code === 0) {
          message.success('导入成功');
          if (typeof onSuccess === 'function') {
            onSuccess();
          }
        } else {
          throw new Error(result.msg);
        }
      })
      .catch((error) => {
        // message.error(`导入失败: ${error.message}`);
        notification['error']({
          message: '导入失败',
          duration: null,
          description: error.message
        });
      })
      .finally(() => {
        setIsImporting(false);
        // 解决同文件不会触发上传
        inputRef.current.value = '';
      });
  };

  return (
    <Button type="primary" loading={isImporting} onClick={() => inputRef.current?.click()}>
      {isImporting ? '正在导入...' : btnText}
      <input
        ref={inputRef}
        type="file"
        style={{ display: 'none' }}
        onChange={(e) => {
          upload(e.target?.files?.[0]);
        }}
      />
    </Button>
  );
}
ImportBtn.defaultProps = {
  btnText: '导入',
  params: {},
  onSuccess: () => {},
  method: 'POST',
};
