import React, { useState, useEffect, useMemo } from 'react';
import {
  Form, Input, Modal, Cascader, Select, Upload, Button, message,
} from 'antd';
import { UploadOutlined, PhoneFilled } from '@ant-design/icons';
import { TableListItem } from '../data.d';
import { IMG_UPLOAD_URL } from '@/services/api';
import { formatArea, getLocalToken, validatePassword } from "@/utils/utils";
import './index.css';
import { connect } from 'umi';
import { ConnectState } from '@/models/connect';
import _ from 'lodash';
import { ROLE_IDS } from "@/pages/agricultureSubsidies/consts";

const FormItem = Form.Item;
const { Option } = Select;

interface CreateFormProps {
  modalVisible: boolean;
  isEdit: boolean;
  values: TableListItem;
  areaList: Array<any>;
  accountRoleList: Array<any>;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
}

const UpdateForm: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const [imgUrl, setImgUrl] = useState<Array<any>>([]);
  const [uploadBtnShow, setUploadBtnShow] = useState(true);
  const {
    modalVisible, onSubmit: handleAdd, onCancel, isEdit, values, accountRoleList, areaList,
  } = props;
  const [roleType, setRoleType] = useState(values.role_id);
  const [townList, setTownList] = useState(areaList);
  const [loading, setLoading] = useState(false);
  const [formValue, setFormValue] = useState({
    admin_id: values.admin_id,
    avatar_id: values.avatar_id,
    user_name: values.user_name,
    real_name: values.real_name,
    mobile: values.mobile,
    role_id: values.role_id,
    role_type: values.role_id,
    avatar_url: values.avatar_url,
    role_name: values.role_name,
    wechat: values.wechat,
    area: values.city_id ? formatArea([values.city_id, values.town_id, values.village_id] ): [],
  });

  const okHandle = async () => {
    const fieldsValue: any = await form.validateFields();
    if(fieldsValue.role_id === 2) {
      fieldsValue.area = [1];
    }
    const _formValue = {
      ...fieldsValue,
      isEdit,
      imgUrl,
      admin_id: formValue.admin_id,
    };

    if (!imgUrl.length) {
      message.error('?????????????????????');
      return false;
    }

    handleAdd(_formValue);
    form.resetFields();
  };
  const imgUploadProps = {
    action: IMG_UPLOAD_URL(),
    listType: 'picture',
    className: 'upload-list-inline',
    fileList: imgUrl,
    headers: { Authorization: getLocalToken() },
    beforeUpload: (file: any) => {
      setLoading(true);
      const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
      if (!isJpgOrPng) {
        message.error('???????????? JPG/PNG ????????????!');
        setLoading(false);
      }
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isLt2M) {
        message.error('???????????????????????? 1MB!');
        setLoading(false);
      }
      return isJpgOrPng && isLt2M;
    },
    onSuccess: (res: any) => {
      setLoading(false);
      const _img = res.data;
      const _arr = {
        uid: _img.id,
        name: '??????',
        status: 'done',
        url: _img.url,
      };
      setImgUrl([_arr]);
      setUploadBtnShow(false);
    },
    onRemove: () => {
      setImgUrl([]);
      setUploadBtnShow(true);
    },
  };

  const onSelectChange = (val: any) => {
    setRoleType(val);
  };

  // ????????????
  const getTown = () => {
    const _arr: any = _.cloneDeep(areaList);
    _arr.forEach((item: any) => {
      const children = item.children || [];
      if (children && children.length > 0) {
        children.forEach((el: any) => {
          delete el.children;
        });
      }
    });
    setTownList(_arr);
  };

  const cities = useMemo(() => [...areaList].map((e) => {
    const { children, ...node } = e;
    return node;
  }), [areaList]);

  useEffect(() => {
    if (isEdit) {
      setImgUrl([{
        uid: formValue.avatar_id,
        name: '??????',
        status: 'done',
        url: values.avatar_url,
      }]);
      setUploadBtnShow(false);
    } else {
      setUploadBtnShow(true);
    }
    getTown();
  }, []);

  return (
    <Modal
      width={800}
      maskClosable={false}
      destroyOnClose
      title={isEdit ? '????????????' : '????????????'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => onCancel()}
    >
      <Form
        initialValues={formValue}
        autoComplete="off"
        form={form}
      >
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="?????????"
          name="user_name"
          rules={[
            {
              required: true,
              message: '?????????15?????????????????????',
              max: 15,
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                console.log(value, 'value');
                const reg = /^[\u4e00-\u9fa5a-zA-Z0-9_-]{0,}$/;
                if (!reg.exec(value)) {
                  return Promise.reject('?????????????????????????????????????????????????????????');
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input disabled={isEdit} placeholder="??????????????????" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="????????????"
          name="real_name"
          rules={[
            {
              required: true,
              message: '???????????????????????????, ???????????????10???',
              max: 10,
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                console.log(value, 'value');
                const reg = /^[\u4e00-\u9fa5a-z0-9_-]{0,}$/;
                if (!reg.exec(value)) {
                  return Promise.reject('?????????????????????????????????????????????????????????');
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Input placeholder="???????????????????????????" />
        </FormItem>
        {
          !isEdit ? (
            <>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                name="password"
                label="??????"
                required
                rules={[{ validator: (r, v) => {
                  return validatePassword(v);
                }}]}
              >
                <Input.Password placeholder="???????????????" />
              </FormItem>
              <FormItem
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 15 }}
                name="confirm"
                label="??????????????????"
                dependencies={['password']}
                rules={[
                  {
                    required: true,
                    message: '?????????????????????',
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject('?????????????????????????????????');
                    },
                  }),
                ]}
              >
                <Input.Password placeholder="?????????????????????" autoComplete="new-password" />
              </FormItem>
            </>
          ) : null
        }
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="?????????"
          name="mobile"
          rules={[{ required: true, message: '????????????????????????????????????', pattern: /^1[3456789]\d{9}$/ }]}
        >
          <Input placeholder="??????????????????" />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="????????????"
          name="role_id"
          rules={[{ required: true, message: '?????????????????????' }]}
        >
          <Select onChange={onSelectChange}>
            {
              accountRoleList.map((item:any) => (<Option key={item.role_id} value={item.role_id}>{item.role_name}</Option>))
            }
          </Select>
        </FormItem>
        {
          [3, ...ROLE_IDS.VILLAGE_OFFICIAL].indexOf(roleType) > -1 ? (
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="????????????"
              name="area"
              rules={[{ required: true, message: '?????????????????????' }]}
            >
              <Cascader options={areaList} />
            </FormItem>
          ) : null
        }
        {
          [4, ...ROLE_IDS.TOWN_OFFICIAL].indexOf(roleType) > -1 ? (
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="????????????"
              name="area"
              rules={[{ required: true, message: '?????????????????????' }]}
            >
              <Cascader options={townList} />
            </FormItem>
          ) : null
        }
        {
          [...ROLE_IDS.CITY_OFFICIAL].indexOf(roleType) > -1 ? (
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="?????????"
              name="area"
              rules={[{ required: true, message: '??????????????????' }]}
            >
              <Cascader options={cities} />
            </FormItem>
          ) : null
        }
        {
          roleType === 3 ? (
            <FormItem
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label="??????????????????"
              name="wechat"
              rules={[{ required: true, message: '???????????????????????????' }]}
            >
              <Input placeholder="???????????????????????????" />
            </FormItem>
          ) : null
        }
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="????????????"
          name="avatar_url"
          required
        >
          <Upload {...imgUploadProps}>
            {
              uploadBtnShow ? (
                <Button loading={loading}>
                  <UploadOutlined />
                  {' '}
                  Upload
                </Button>
              ) : null
            }
          </Upload>
        </FormItem>
      </Form>
    </Modal>
  );
};

export default connect(({ info }: ConnectState) => ({
  accountRoleList: info.accountRoleList,
  areaList: info.areaList,
}))(UpdateForm);
