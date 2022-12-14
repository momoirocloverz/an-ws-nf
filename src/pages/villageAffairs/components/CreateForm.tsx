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
  // ?????????????????????
  const [partakePeople, setPartakePeople] = useState<Array<any>>([]);
  // ???????????????????????????
  const [addParamsArr, setAddParamsArr] = useState<Array<any>>([]);
  const okHandle = async () => {
    const fieldsValue: any = await form.validateFields();

    // if (imgUrlValue.length === 0) {
    //   message.error('???????????????');
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
    // ???????????? partake_people ????????????-??????id,???????????????  partake_mobile ???????????????????????????,???????????????
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
    // fieldsValue.partake_mobile = arr2.join(','); // ???????????????????????????
    // fieldsValue.partake_num = partakePeople.length || '0'; // ???????????????
    // ???????????? params_arr
    const paramsArr = [];
    addParamsArr.map((item) => {
      paramsArr.push(fieldsValue[`params${item}`]);
    });
    fieldsValue.params_arr = paramsArr;
    // ?????? ?????????????????? 1 ??????????????? 2??????
    fieldsValue.is_open = fieldsValue.is_open ? '2' : '1';
    fieldsValue.is_check = fieldsValue.is_check ? '2' : '1';

    // ???????????????????????????????????????????????????
    // console.log(peopleList);
    // console.log(idList);
    // console.log(phoneList);

    fieldsValue.partake_people = idList.join(',');
    fieldsValue.partake_mobile = phoneList.join(','); // ???????????????????????????
    fieldsValue.partake_num = idList.length || '0'; // ???????????????
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
  // ?????????????????????
  const changeAddPeople = (e) => {
    // console.log(e);
    const idList = [];
    const phoneList = [];
    const groupList = [];
    for (const item of e) {
      if (item[1]) {
        // ?????????2????????????????????????[2,"4"]???????????????
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
        // ?????????????????????
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
    // ??????
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
            // ?????????????????????????????????????????????????????????????????????
            idList = values.partake_people.split(',');
            group = values.partake_info.split(',');
            setGroupList(group);
            for (const item of group) {
              addPeople.push(item.split('-'));
            }
          }
          console.log(groupList);
          // ??????????????????
          for (const item of list) {
            const type = { label: item.type_name, value: item.id, children: [] };
            // ???????????????label???id
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
          name: '??????',
          status: 'done',
          url: item.url,
        });
      }
      setImgUrl(arr);
      // setImgUrl([
      //   {
      //     uid: values.imgs_id[0].id,
      //     name: '??????',
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
          // ????????????
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
          // ???????????????
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
          }); // ????????????
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
  // ?????????????????????
  const handleConfirmSkuId = (rule, value, callback) => {
    if (partakePeople.length === 0) {
      callback('?????????????????????');
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
      title={isEdit ? '??????' : '??????'}
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
          label="??????"
          name="title"
          rules={[{ required: true, message: '???????????????' }]}
        >
          <Input placeholder="?????????????????????" maxLength={30} disabled={readOnly} />
        </FormItem>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 30 }}
          label="??????"
          name="details"
          rules={[{ required: true, message: '???????????????' }]}
        >
          <TextArea
            rows={4}
            maxLength={300}
            disabled={readOnly}
            placeholder="???????????????&#13;????????????????????????&#13;&#13;???????????????&#13;????????????????????????"
            style={{ minHeight: '150px' }}
          />
        </FormItem>
        <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} name="imgs_id" label="??????1">
          {/* <ImgUpload values={imgUrlValue} getImgData={getImgData} /> */}
          <ImgMoreUpload max={3} values={imgUrlValue} getImgData={getImgData} />
        </FormItem>

        {/* <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="????????????"
          name="partakePeople"
          rules={[
            { validator: (rule, value, callback) => handleConfirmSkuId(rule, value, callback) },
          ]}
        >
          <div>
            <Select
              placeholder="???????????????"
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
            <span>{partakePeople.length || 0}???</span>
          </div>
        </FormItem> */}

        <Form.Item
          label="????????????"
          name="addPeople"
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          rules={[{ required: true, message: '?????????????????????' }]}
        >
          <Cascader options={peopleList} multiple changeOnSelect onChange={changeAddPeople} />
        </Form.Item>
        <Form.Item label="????????????" labelCol={{ span: 5 }} wrapperCol={{ span: 15 }}>
          <span>{idList.length > 0 ? `${idList.length}??????????????????` : '0???'} </span>
        </Form.Item>

        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="????????????"
          name="end_time"
          rules={[{ required: true, message: '?????????????????????' }]}
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
              label={`??????${item}`}
              name={`params${item}`}
              rules={[{ required: true, message: '?????????????????????' }]}
            >
              <Input
                placeholder="???????????????,????????????"
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
                  ????????????{formValue[`realName${item}`]} (
                  {formValue[`realName${item}`].split(',').length}???)
                </span>
              )}
              {item > 2 && (
                <span onClick={() => delItem(item)} className={styles.delBtn}>
                  ??????
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
          ??????
        </Button>
        <FormItem
          labelCol={{ span: 5 }}
          wrapperCol={{ span: 15 }}
          label="??????????????????"
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
          label="??????????????????"
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
