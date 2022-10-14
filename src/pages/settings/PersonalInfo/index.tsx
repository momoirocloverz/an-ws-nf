import {  UploadOutlined, } from '@ant-design/icons';
import { Button, Form, message, Input, Card, Row, Col, Upload } from 'antd';
import React, { useState, useEffect } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './index.less';
import { connect, Link } from 'umi';
import { ConnectState } from '@/models/connect';
import { upLoadUserInfo, getAccountInfo } from '@/services/user';
import { IMG_UPLOAD_URL } from '@/services/api';
import { getLocalToken } from '@/utils/utils';
import _ from 'lodash';
const FormItem = Form.Item;

const PasswordInfo: React.FC<{}> = (props: any) => {
  const { accountInfo, dispatch } = props;
  const [accountDetail, setAccountDetail] = useState(accountInfo);
  const [form] = Form.useForm();
  const [uploadBtnShow, setUploadBtnShow] = useState(true);
  const [imgUrl, setImgUrl] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(false);
  const subForm = async () => {
    const fieldsValue: any = await form.validateFields();
    const _params: object = {
      avatar_id: imgUrl.length > 0 ? imgUrl[0].uid : accountInfo.avatar_id,
      real_name: fieldsValue.real_name,
      mobile: fieldsValue.mobile,
      wechat: fieldsValue.wechat
    }
    const _data: any = await upLoadUserInfo(_params);
    if (_data.code === 0) {
      message.success('资料更新成功！');
      dispatch({
        type: 'user/queryAccountInfo'
      });
      const result: any = await getAccountInfo({});
      if (result.code === 0) {
        setAccountDetail(result.data);
      }
      form.resetFields();
    } else {
      message.success('更新失败，请重新提交');
    }
  };

  const imgUploadProps = {
    action: IMG_UPLOAD_URL(),
    listType: 'picture',
    className: 'upload-list-inline',
    headers: { Authorization: getLocalToken() },
    beforeUpload: (file: any) => {
      setLoading(true);
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('只能上传 JPG/PNG 格式图片!');
        setLoading(false);
      }
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isLt2M) {
        message.error('图片体积不能超过 1MB!');
        setLoading(false);
      }
      return isJpgOrPng && isLt2M;
    },
    onSuccess: (res: any) => {
      setLoading(false);
      let _img = res.data;
      let _arr = {
        uid: _img.id,
        name: '图片',
        status: 'done',
        url: _img.url
      }
      setImgUrl([_arr]);
      setUploadBtnShow(false);
    },
    onRemove: (res: any) => {
      setImgUrl([]);
      setUploadBtnShow(true);
    }
  }
  imgUrl.length > 0 && (imgUploadProps['fileList'] = imgUrl)

  return (
    <PageHeaderWrapper title="编辑资料">
      <Card style={{ width: 800 }}>
        {
          !_.isEmpty(accountInfo) ? (
            <Form
              initialValues={accountDetail}
              style={{ paddingBottom: '100px', paddingTop: '100px'}}
              form={form}
            >
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="用户头像"
                name="avatar_url"
                required
              >
                <Upload {...imgUploadProps} defaultFileList={[{
                  uid: accountInfo.avatar_id,
                  name: '用户头像',
                  status: 'done',
                  url: accountInfo.avatar_url,
                }]}>
                  {
                    uploadBtnShow ? (
                      <Button loading={loading}>
                        <UploadOutlined /> Upload
                      </Button>
                    ) : null
                  }
                </Upload>
              </FormItem>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="用户名"
                name="user_name"
                rules={[{ required: true, message: '请输入15字以内的用户名', max: 15 }]}
              >
                <Input placeholder="请输入" disabled />
              </FormItem>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="真实姓名"
                name="real_name"
                rules={[{ required: true, message: '请输入10个字以内的真实姓名', max: 10 }]}
              >
                <Input placeholder="请输入" />
              </FormItem>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                label="手机号"
                name="mobile"
                rules={[{ required: true, message: '请输入格式正确的手机号码', pattern: /^1[3456789]\d{9}$/ }]}
              >
                <Input placeholder="请输入" />
              </FormItem>
              {
                accountInfo.role_type === 3 ? (
                  <FormItem
                    labelCol={{ span: 5 }}
                    wrapperCol={{ span: 15 }}
                    label="微信号"
                    name="wechat"
                    rules={[{ required: true, message: '请输入微信号' }]}
                  >
                    <Input placeholder="请输入微信号" />
                  </FormItem>
                ): null
              }
            </Form>
          ) : null
        }
        <div className={styles.main}>
          <Row gutter={16}>
            <Col className="gutter-row" span={3}>
            <Button type="primary" onClick={ subForm }>
              确定
            </Button>
            </Col>
            <Col className="gutter-row" span={3}>
              <Link to="/index">
                <Button>
                  取消
                </Button>
              </Link>
            </Col>
          </Row>
        </div>
      </Card>
    </PageHeaderWrapper>
  );
};

export default connect(({ user }: ConnectState) => ({
  accountInfo: user.accountInfo,
}))(PasswordInfo);
