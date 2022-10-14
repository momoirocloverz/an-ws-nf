import React, { useState, useEffect } from 'react';
import {
  Form,
  Modal,
  InputNumber,
  Input,
  message,
  DatePicker,
  Cascader,
  Select,
  Switch,
  Button,
} from 'antd';
import _ from 'lodash';
import Moment from 'moment';
import { connect } from 'umi';
import ImgUpload from '@/components/imgUpload';
import ImgMoreUpload from '@/components/imgMoreUpload';
import { ConnectState } from '@/models/connect';
import { getHaveFamilyUsersInfo, getVoteInfo, votePartakeList } from '@/services/home';
import styles from './index.less';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const dateFormat = 'YYYY/MM/DD HH:mm:ss';
const { Option } = Select;

interface CreateFormProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
  isEdit: boolean;
  values: any;
  accountInfo: any;
  areaList: any;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const [form] = Form.useForm();
  const {
    modalVisible,
    onSubmit: handleAdd,
    onCancel,
    isEdit,
    values,
    accountInfo,
    readOnly,
  } = props;
  const [formValue, setFormValue] = useState({
    id: values.id,
    title: values.title,
    details: values.details,
    end_time: Moment(values.end_time),
    is_check: Number(values.is_check) === 2,
    is_open: Number(values.is_open) === 2,
    params1: '',
    params2: '',
    params3: '',
    params4: '',
    params5: '',
    params6: '',
    params7: '',
    params8: '',
    params9: '',
    params10: '',
  });
  const [oldFormValue, setOldFormValue] = useState({});
  const [imgUrlValue, setImgUrl] = useState<Array<any>>([]);
  // const [documents, setDocuments] = useState<SimpleUploadedFileType[]>([]);
  const [userList, setUserList] = useState<Array<any>>([]);
  const [groupList, setGroupList] = useState<Array<any>>([]);
  const [peopleList, setPeopleList] = useState<Array<any>>([]);
  const [idList, setIdList] = useState<Array<any>>([]);
  const [phoneList, setPhoneList] = useState<Array<any>>([]);
  // 应参与人的列表
  const [partakePeople, setPartakePeople] = useState<Array<any>>([]);
  // 用户添加的选项列表
  const [addParamsArr, setAddParamsArr] = useState<Array<any>>([]);
  const okHandle = async () => {
    const fieldsValue: any = await form.validateFields();

    // if (imgUrlValue.length === 0) {
    //   message.error('请上传图片');
    // } else {
    fieldsValue.end_time = Moment(fieldsValue.end_time).format('YYYY-MM-DD HH:mm:ss');

    fieldsValue.imgs_id = '';
    for (const item of imgUrlValue) {
      // console.log([item.uid].join(','));
      fieldsValue.imgs_id += `${[item.uid].join(',')},`;
    }
    fieldsValue.imgs_id = fieldsValue.imgs_id.substring(0, fieldsValue.imgs_id.length - 1);

    // fieldsValue.imgs_id = [imgUrlValue[0].uid].join(',');
    // console.log(fieldsValue);
    // return;
    if (isEdit) {
      fieldsValue.id = values.id;
    }
    fieldsValue.city_id = accountInfo.city_id;
    fieldsValue.town_id = accountInfo.town_id;
    fieldsValue.village_id = accountInfo.village_id;
    // 应参与人 partake_people 应参与人-用户id,拼接字符串  partake_mobile 要发送短信的手机号,拼接字符串
    fieldsValue.partake_people = '';
    fieldsValue.partake_mobile = '';
    fieldsValue.params_arr = [];
    const arr1 = [];
    const arr2 = [];
    partakePeople.length > 0 &&
      partakePeople.map((item) => {
        let flag = false;
        oldFormValue?.partakePeople?.length &&
          oldFormValue.partakePeople.map((val) => {
            if (val === item) {
              flag = true;
            }
          });
        const d = item.split('-');
        if (!flag) {
          arr2.push(d[1]); // mobile
        }
        arr1.push(d[2]); // user_id
      });

    // fieldsValue.partake_people = arr1.join(',');
    // fieldsValue.partake_mobile = arr2.join(','); // 要发送短信的手机号
    // fieldsValue.partake_num = partakePeople.length || '0'; // 应参与人数
    // 选项内容 params_arr
    const paramsArr = [];
    addParamsArr.map((item) => {
      paramsArr.push(fieldsValue[`params${item}`]);
    });
    fieldsValue.params_arr = paramsArr;
    // 是否 投票结果公开 1 默认不开放 2开放
    fieldsValue.is_open = fieldsValue.is_open ? '2' : '1';
    fieldsValue.is_check = fieldsValue.is_check ? '2' : '1';

    // 按照组选择，下面进行组选择数据处理
    // console.log(peopleList);
    // console.log(idList);
    // console.log(phoneList);

    fieldsValue.partake_people = idList.join(',');
    fieldsValue.partake_mobile = phoneList.join(','); // 要发送短信的手机号
    fieldsValue.partake_num = idList.length || '0'; // 应参与人数
    fieldsValue.partake_info = groupList.join(',');
    // console.log(newIdList);
    // console.log(newPhoneList);
    // console.log(fieldsValue);
    // return;
    form.resetFields();
    handleAdd({
      ...fieldsValue,
      admin_id: accountInfo.admin_id,
    });
    // }
  };
  // 点击选择组回调
  const changeAddPeople = (e) => {
    // console.log(e);
    const idList = [];
    const phoneList = [];
    const groupList = [];
    for (const item of e) {
      if (item[1]) {
        // 如果是2个数组，代表存在[2,"4"]这种形式的
        idList.push(item[1]);
        groupList.push(`${item[0]}-${item[1]}`);
        for (const item1 of peopleList) {
          if (item1.value == item[0]) {
            const innerList = item1.children;
            for (const item2 of innerList) {
              if (item2.value == item[1]) {
                phoneList.push(item2.label.replace(/[^0-9]/gi, ''));
              }
            }
          }
        }
      } else {
        // 如果是单个数组
        for (const item1 of peopleList) {
          if (item1.value == item[0]) {
            const innerList = item1.children;
            for (const item2 of innerList) {
              groupList.push(`${item[0]}-${item2.value}`);
              idList.push(item2.value);
              phoneList.push(item2.label.replace(/[^0-9]/gi, ''));
            }
          }
        }
      }
    }
    // 去重
    const newIdList = [...new Set(idList)];
    const newPhoneList = [...new Set(phoneList)];
    // console.log(groupList);
    setIdList(newIdList);
    setPhoneList(newPhoneList);
    setGroupList(groupList);
  };

  const getImgData = (arr = []) => {
    setImgUrl(arr);
  };
  const getHaveFamilyUsersInfoDun = () => {
    getHaveFamilyUsersInfo({
      city_id: accountInfo.city_id || '',
      town_id: accountInfo.town_id || '',
      village_id: accountInfo.village_id || '',
    })
      .then((res) => {
        // console.log(res.data);
        if (res.code === 0) {
          setUserList(res.data);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const getPeopleList = () => {
    votePartakeList({
      city_id: accountInfo.city_id || '',
      town_id: accountInfo.town_id || '',
      village_id: accountInfo.village_id || '',
    })
      .then((res) => {
        // console.log(res.data);
        // console.log(values);
        if (res.code === 0) {
          const list = res.data.data;
          const List = [];
          let idList = [];
          const addPeople = [];
          let group = [];
          const groupList = [];
          if (isEdit) {
            // 如果处于编辑状态，那么需要初始化当前组选中状态
            idList = values.partake_people.split(',');
            group = values.partake_info.split(',');
            setGroupList(group);
            for (const item of group) {
              addPeople.push(item.split('-'));
            }
          }
          console.log(groupList);
          // 这里循环类别
          for (const item of list) {
            const type = { label: item.type_name, value: item.id, children: [] };
            // 处理多选款label、id
            const labelList = item.str.split(',');
            const userList = item.users_str.split(',');
            const children = [];

            for (const index in labelList) {
              children.push({
                label: labelList[index],
                value: userList[index],
              });
            }
            type.children = children;
            List.push(type);
          }

          if (addPeople.length > 0) {
            form.setFieldsValue({
              addPeople,
            });
            changeAddPeople(addPeople);
          }
          // console.log(List);
          // console.log(addPeople);
          setPeopleList(List);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    getHaveFamilyUsersInfoDun();
    getPeopleList();
    if (isEdit) {
      const arr = [];
      for (const item of values.imgs_id) {
        arr.push({
          uid: item.id,
          name: '图片',
          status: 'done',
          url: item.url,
        });
      }
      setImgUrl(arr);
      // setImgUrl([
      //   {
      //     uid: values.imgs_id[0].id,
      //     name: '图片',
      //     status: 'done',
      //     url: values.imgs_id[0].url,
      //   },
      // ]);
    } else {
      setAddParamsArr([1, 2]);
    }
  }, []);
  useEffect(() => {
    if (isEdit) {
      getVoteInfo({ id: formValue.id }).then((res) => {
        if (res.code === 0) {
          const d = res.data;
          const arr = [];
          // 选项数据
          d.list.map((item, index) => {
            arr.push(index + 1);
            const o = {};
            o[`params${index + 1}`] = item.vote_info;
            form.setFieldsValue({ ...o });
            formValue[`params${index + 1}`] = item.vote_info;
            formValue[`realName${index + 1}`] = item.real_name;
          });
          if (d.list.length > 0) {
            setAddParamsArr([]);
          }
          // console.log('formValue');
          // console.log(formValue);
          setAddParamsArr(arr);
          // 应参与人数
          const partake_people = d?.info?.partake_people?.split(',');
          const real_names = d?.info?.real_names?.split(',');
          const mobiles = d?.info?.mobiles?.split(',') || [];
          const newArr = [];
          // `${item.real_name}-${item.mobile}-${item.user_id}`
          partake_people?.length > 0 &&
            partake_people.map((item, index) => {
              newArr.push(`${real_names[index]}-${mobiles[index]}-${item}`);
            });
          setOldFormValue({
            ...formValue,
            partakePeople: newArr,
          }); // 原始数据
          setPartakePeople(newArr);
          form.setFieldsValue({
            partakePeople: newArr,
          });
        }
      });
    }
  }, [values]);
  const selectChange = (value) => {
    setPartakePeople(value);
  };
  const addParamsHandle = () => {
    const d = _.cloneDeep(addParamsArr);
    if (d.length > 0) {
      d.push(d[d.length - 1] + 1);
    } else {
      d.push(d.length + 3);
    }
    setAddParamsArr(d);
  };
  const delItem = (item) => {
    const d = _.cloneDeep(addParamsArr);
    d.splice(d.indexOf(item), 1);
    formValue[`params${item}`] = '';
    form.setFieldsValue({
      [`params${item}`]: '',
    });
    setAddParamsArr(d);
  };
  // 自定义校验规则
  const handleConfirmSkuId = (rule, value, callback) => {
    if (partakePeople.length === 0) {
      callback('请选择应参与人');
    } else {
      callback();
    }
  };
  const disabledDate = (current) => {
    return current && Moment().startOf('day') >= current;
  };
  return (
    <Modal
      destroyOnClose
      width={900}
      maskClosable={false}
      title={isEdit ? '编辑' : '新建'}
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => {
        onCancel();
      }}
    >
      <Form className={styles.formBox} form={form} initialValues={formValue}>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 30 }}
          label="标题"
          name="title"
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input placeholder="请输入活动名称" maxLength={30} disabled={readOnly} />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 30 }}
          label="详情"
          name="details"
          rules={[{ required: true, message: '请输入详情' }]}
        >
          <TextArea
            rows={4}
            maxLength={300}
            disabled={readOnly}
            placeholder="如副标题一&#13;输入详情一的内容&#13;&#13;如副标题二&#13;输入详情二的内容"
            style={{ minHeight: '150px' }}
          />
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} name="imgs_id" label="图片1">
          {/* <ImgUpload values={imgUrlValue} getImgData={getImgData} /> */}
          <ImgMoreUpload max={3} values={imgUrlValue} getImgData={getImgData} />
        </FormItem>

        {/* <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="应参与人"
          name="partakePeople"
          rules={[
            { validator: (rule, value, callback) => handleConfirmSkuId(rule, value, callback) },
          ]}
        >
          <div>
            <Select
              placeholder="按名字搜索"
              mode="multiple"
              allowClear
              key={partakePeople}
              defaultValue={partakePeople}
              onChange={selectChange}
              optionLabelProp="label"
              disabled={readOnly}
            >
              {userList.map((item, index) => {
                return (
                  <Option
                    key={item.user_id}
                    value={`${item.real_name}-${item.mobile}-${item.user_id}`}
                    label={item.real_name}
                  >
                    <span>{item.real_name}</span>
                    <span>{item.mobile}</span>
                  </Option>
                );
              })}
            </Select>
            <span>{partakePeople.length || 0}人</span>
          </div>
        </FormItem> */}

        <Form.Item
          label="应参与人"
          name="addPeople"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          rules={[{ required: true, message: '请选择应参与人' }]}
        >
          <Cascader options={peopleList} multiple changeOnSelect onChange={changeAddPeople} />
        </Form.Item>
        <Form.Item label="已选人数" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
          <span>{idList.length > 0 ? `${idList.length}人（已去重）` : '0人'} </span>
        </Form.Item>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="截止时间"
          name="end_time"
          rules={[{ required: true, message: '请选择截止时间' }]}
        >
          <DatePicker
            showTime
            format="YYYY-MM-DD HH:mm:ss"
            disabled={readOnly}
            disabledDate={disabledDate}
          />
        </FormItem>

        {addParamsArr.map((item) => {
          return (
            <FormItem
              key={item}
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 15 }}
              label={`选项${item}`}
              name={`params${item}`}
              rules={[{ required: true, message: '请输入选项内容' }]}
            >
              <Input
                placeholder="请输入选项,如“是”"
                onChange={(e) => {
                  form.setFieldsValue({
                    [`params${item}`]: e.target.value,
                  });
                }}
                defaultValue={formValue[`params${item}`]}
                disabled={readOnly}
              />
              {formValue[`realName${item}`] && (
                <span className={styles.realName}>
                  已参与：{formValue[`realName${item}`]} (
                  {formValue[`realName${item}`].split(',').length}人)
                </span>
              )}
              {item > 2 && (
                <span onClick={() => delItem(item)} className={styles.delBtn}>
                  删除
                </span>
              )}
            </FormItem>
          );
        })}

        <Button
          type="primary"
          className={styles.addBtn}
          onClick={addParamsHandle}
          disabled={addParamsArr.length > 7 || readOnly}
        >
          添加
        </Button>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="投票结果公开"
          name="is_open"
        >
          <Switch
            defaultChecked={formValue.is_open}
            onChange={async (checked) => {
              // console.log(checked);
            }}
            disabled={readOnly}
          />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="是否支持复选"
          name="is_check"
        >
          <Switch
            defaultChecked={formValue.is_check}
            onChange={async (checked) => {
              // console.log(checked);
            }}
            disabled={readOnly}
          />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default connect(({ info, user }: ConnectState) => ({
  areaList: info.areaList,
  accountInfo: user.accountInfo,
}))(CreateForm);
