import React, { useEffect, useState } from 'react';
import {
  Modal, Form, Radio, Select, Input, message,
} from 'antd';
import { getMainCodeList, addItemList, editItemList } from '@/services/ItemManage';
import styles from './index.less';

const { Option } = Select;
const CreateAndEdit: React.FC<any> = (props) => {
  const [form] = Form.useForm();
  const { modalItem } = props;
  const [mainCodeList, setMainCodeList] = useState([]);
  const [codeRadio, setCodeRadio] = useState(1);
  const [radioScore, setRadioScore] = useState('');
  const [regularVal, setRegularVal] = useState('');
  const [startVal, setStartVal] = useState('');
  const [endVal, setEndVal] = useState('');
  const [controlMainCode, setControlMainCode] = useState({
    visible: false,
    message: '请选择主编码',
  });
  const [controlScore, setControlScore] = useState({
    visible: false,
    message: '请输入固定分值',
  });
  const [mainCode, setMainCode] = useState(undefined);

  const layout = {
    labelCol: {
      span: 5,
    },
    wrapperCol: {
      span: 19,
    },
  };
  const handleFinished = (e) => {
    if (radioScore == '1' && regularVal == '') {
      setControlScore({ visible: true, message: '请输入固定分值' });
    }
    if (radioScore == '2') {
      if (startVal == '' && endVal == '') {
        setControlScore({ visible: true, message: '请输入起始值和结束值' });
      } else if (startVal == '') {
        setControlScore({ visible: true, message: '请输入起始值' });
      } else if (endVal == '') {
        setControlScore({ visible: true, message: '请输入结束值' });
      }
    }
    form.validateFields().then((res) => {
      if (controlScore.visible || controlMainCode.visible) {
        return;
      }
      const data = {
        p_code: codeRadio === 1 ? mainCode : res.newPrimaryGroupId,
        p_name: codeRadio === 1 ? res.primaryGroupName : res.newPrimaryGroupName,
        s_code: res.childCode,
        name: res.scoreName,
        direction: res.scoreType == '1' ? 'INCREASE' : 'DECREASE',
        p_type: radioScore,
        point: radioScore == '1' ? regularVal : `${startVal}~${endVal}`,
        comment: res.useIntro,
        is_all: res.isRequired,
      };
      if (modalItem.isAdd) {
        addItemList(data).then((response) => {
          if (response.code == 0) {
            message.success('添加成功');
            props.handleSuccess();
          }
        });
      } else {
        editItemList({ ...data, item_id: modalItem.record.item_id }).then((response) => {
          if (response.code == 0) {
            message.success('编辑成功');
            props.handleSuccess();
          }
        });
      }
    }).catch((e) => {});
  };
  const getCodeList = async () => {
    const res = await getMainCodeList();
    if (res.code === 0) {
      setMainCodeList(res.data);
      const isExit = res.data.some((item) => item.code == modalItem.record.p_code);
      if (props.modalItem.record != '') {
        const { record } = props.modalItem;
        form.setFields([
          {
            name: 'mainCode',
            value: isExit ? 1 : 2,
          },
          {
            name: 'primaryGroupId',
            value: record.p_code,
          },
          {
            name: 'newPrimaryGroupId',
            value: record.p_code,
          },
          {
            name: 'primaryGroupName',
            value: res.data[res.data.map((e) => e.code).indexOf(record.p_code)].name,
          },
          {
            name: 'newPrimaryGroupName',
            value: res.data[res.data.map((e) => e.code).indexOf(record.p_code)].name,
          },
          {
            name: 'childCode',
            value: record.s_code,
          },
          {
            name: 'scoreName',
            value: record.s_name,
          },
          {
            name: 'scoreType',
            value: record.direction == 'INCREASE' ? '1' : '2',
          },
          {
            name: 'useIntro',
            value: record.comment,
          },
          {
            name: 'scoreInfo',
            value: record.p_type.toString(),
          },
        ]);
        if (isExit) {
          setCodeRadio(1);
        } else {
          setCodeRadio(2);
        }
        setMainCode(modalItem.record.p_code);
      }
    }
  };
  useEffect(() => {
    if (props.modalItem.record != '') {
      const { record } = props.modalItem;
      setRadioScore(record.p_type.toString());
      if (record.p_type == 1) {
        setRegularVal(record.point);
        form.setFields([{ name: 'fixedScore', value: record.point }]);
      } else {
        const startEndVal = record.point.split('~');
        setStartVal(startEndVal[0]);
        setEndVal(startEndVal[1]);
      }
    }
    getCodeList();
  }, []);
  const handleChangeRegular = (e) => {
    setRegularVal(e.target.value);
    if (regularVal) {
      setControlScore({ ...controlScore, visible: false });
    }
  };
  const handleChangeStart = (e) => {
    setStartVal(e.target.value);
    if (startVal && endVal == '') {
      setControlScore({ visible: true, message: '请输入结束值' });
    } else if (startVal && endVal) {
      setControlScore({ ...controlScore, visible: false });
    }
  };
  const handleChangeEnd = (e) => {
    setEndVal(e.target.value);
    if (endVal && startVal == '') {
      setControlScore({ visible: true, message: '请输入起始值' });
    } else if (startVal && endVal) {
      setControlScore({ ...controlScore, visible: false });
    }
  };
  useEffect(()=>{
    form.validateFields(['variableScore'])
  },[startVal, endVal])

  return (
    <Modal
      getContainer={window.document.body}
      visible={modalItem.visible}
      title={modalItem.title}
      cancelText="取消"
      okText="确定"
      onCancel={props.handleCreateCancel}
      onOk={handleFinished}
    >
      <Form
        {...layout}
        form={form}
        colon
        onFinish={handleFinished}
      >
        <Form.Item
          label="主编码形式"
          name="mainCode"
          initialValue={1}
          rules={[{ required: true, message: '请选择主编码形式' }]}
        >
          <Radio.Group
            value={codeRadio}
            onChange={(e) => {
              setCodeRadio(e.target.value);
              setMainCode(undefined);
            }}
            disabled={!modalItem.isAdd}
          >
            <Radio value={1}>已有</Radio>
            <Radio value={2}>新建</Radio>
          </Radio.Group>
        </Form.Item>
        {codeRadio === 1 ? (
          <>
            <Form.Item
              label="主编码"
              name="primaryGroupId"
              rules={[{ required: true, message: '请选择主编码' }]}
            >
              <Select
                disabled={!modalItem.isAdd}
                getPopupContainer={() => window.document.body}
                placeholder="请选择主编码"
                value={mainCode}
                onChange={(e) => {
                  setMainCode(e);
                  const idx = mainCodeList.map((e) => e.code).indexOf(e);
                  form.setFields([{ name: 'primaryGroupName', value: mainCodeList[idx].name }]);
                }}
                className={styles.selectInfo}
              >
                {mainCodeList.map((item: any) => (
                  <Option value={item.code} key={item.id}>
                    {item.code}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="主项名称"
              name="primaryGroupName"
              rules={[{ required: true, message: '请选择主项名称' }]}
            >
              <Input
                type="text"
                placeholder="请输入主项名称"
                disabled
                className={styles.selectInfo}
              />
            </Form.Item>
          </>
        ) : codeRadio === 2 ? (
          <>
            <Form.Item
              label="主编码"
              name="newPrimaryGroupId"
              rules={[{ required: true, message: '请选择主编码' }]}
            >
              <Input
                type="text"
                placeholder="请输入主编码"
                className={styles.selectInfo}
              />
            </Form.Item>
            <Form.Item
              label="主项名称"
              name="newPrimaryGroupName"
              rules={[{ required: true, message: '请选择主项名称' }]}
            >
              <Input
                type="text"
                placeholder="请输入主项名称"
                className={styles.selectInfo}
              />
            </Form.Item>
          </>
        ) : null}

        <Form.Item
          label="子编号"
          className={codeRadio != '' ? styles.childCode : ''}
          name="childCode"
          rules={[{ required: true, message: '请输入子编号' }]}
        >
          <Input type="text" placeholder="请输入子编号" />
        </Form.Item>
        <Form.Item
          label="子项名称"
          name="scoreName"
          rules={[{ required: true, message: '请输入子项名称' }]}
        >
          <Input type="text" placeholder="请输入子项名称" />
        </Form.Item>
        <Form.Item
          label="打分类型"
          name="scoreType"
          rules={[{ required: true, message: '请选择打分类型' }]}
        >
          <Radio.Group>
            <Radio value="1">加分</Radio>
            <Radio value="2">扣分</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="参考分值"
          name="scoreInfo"
          rules={[
            {
              validator: (r, v) => {
                if (!v) {
                  return Promise.reject(new Error('请选择参考分值'));
                }
                // if (form.getFieldValue('isRequired') === 1 && v === '2') {
                //   return Promise.reject(new Error('必选情况下只能选择固定分值'));
                // }
                return Promise.resolve();
              },
            }]}
          required
        >
          <Radio.Group
            className={styles.radioGroup}
            value={radioScore}
            onChange={(e) => {
              setRadioScore(e.target.value);
            }}
          >
            <Radio value="1">固定分值</Radio>
            <Radio value="2">范围分值</Radio>
          </Radio.Group>
        </Form.Item>

        {radioScore == '1' ? (
          <Form.Item
            label="固定分值"
            name="fixedScore"
            rules={[{ required: true, message: '请选择固定分值' }]}
            required
          >
            <Input
              type="text"
              placeholder="请输入固定分值"
              className={styles.scoreInfo}
              value={regularVal}
              onChange={(e) => handleChangeRegular(e)}
            />
          </Form.Item>
        ) : radioScore == '2' ? (
          <Form.Item
            label="范围分值"
            name="variableScore"
            rules={[
              {
                validator: () => {
                  if (!(startVal && endVal)) {
                    return Promise.reject(new Error('请输入起始值和结束值'));
                  }
                  if (parseFloat(startVal) >= parseFloat(endVal)) {
                    return Promise.reject(new Error('起始值必须小于结束值'));
                  }
                  return Promise.resolve();
                },
              }]}
            required
          >
            <div className={styles.inputContainer}>
              <div className={styles.scoreInput}>
                <Input
                  type="text"
                  placeholder="起始值"
                  width="80px"
                  value={startVal}
                  onChange={(e) => handleChangeStart(e)}
                />
              </div>
              &nbsp;~&nbsp;
              <div className={styles.scoreInput}>
                <Input
                  type="text"
                  placeholder="结束值"
                  width="80px"
                  value={endVal}
                  onChange={(e) => handleChangeEnd(e)}
                />
              </div>
            </div>
          </Form.Item>
        ) : null }

        <Form.Item
          label="是否必选"
          name="isRequired"
          initialValue={modalItem.isAdd ? 0 : modalItem.record?.is_all}
          rules={[{ required: true, message: '请选择是否必选' }]}
        >
          <Radio.Group
            className={styles.radioGroup}
          >
            <Radio value={0}>否</Radio>
            <Radio value={1}>是</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="使用说明"
          name="useIntro"
          className={radioScore != '' ? styles.useIntro : ''}
          rules={[{ required: true, message: '请输入使用说明' }]}
        >
          <Input type="text" placeholder="请输入使用说明" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CreateAndEdit;
