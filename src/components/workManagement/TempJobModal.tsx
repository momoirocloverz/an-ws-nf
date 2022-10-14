import React, { useEffect, useState, useMemo } from 'react';
import {
  DatePicker,
  Form, Input, message, Modal, Select,
} from 'antd';
import moment from 'moment';
import { createTempJob, modifyTempJob } from '@/services/workManagement';
import useSupervisor from '@/components/workManagement/useSupervisor';
import { SimpleUploadedFileType } from '@/pages/agricultureSubsidies/types';
import { transformUploadedImageData } from '@/pages/agricultureSubsidies/utils';
import { debounce } from 'lodash';
import { SearchOutlined, LoadingOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
const breakLength = Array(12).fill(0).map((e, i) => ({
  value: (i * 0.5).toFixed(1),
  label: `${i * 0.5}小时`,
}));
const checkInTypes = [
  {
    value: '2',
    label: '2次卡',
  },
  {
    value: '4',
    label: '4次卡',
  },
];

type Context = {
  action: 'create' | 'modify';
  id: number;
  workStart: string;
  workEnd: string;
  address: string;
  rate: string;
  notes: string;
  title: string;
  region: number[];
}

type PropType = {
  context: Context | {};
  visible: boolean;
  onCancel: () => unknown;
  onSuccess: () => unknown;
}

function TempJobModal({
  context, visible, onCancel, onSuccess,
}: PropType) {
  const [form] = Form.useForm();
  const [searchedSupervisorName, setSearchedSupervisorName] = useState('');
  const { supervisors: [supervisorDict, supervisorOptions], isLoading, clearOptions } = useSupervisor(context.region, searchedSupervisorName);
  const [poster, setPoster] = useState<SimpleUploadedFileType[]>([]);
  const canModify = useMemo(() => (Date.now() < new Date(context.workStart).getTime() && context.action === 'modify') || context.action === 'create', [context]);
  const [checkInType, setCheckInType] = useState();

  const debouncedSetName = useMemo(() => debounce(setSearchedSupervisorName, 500), []);
  const customSupervisorOptions = useMemo(() => supervisorOptions.map((e) => (
    // 有就取，没有就空着; 不管; 没有让他们自己去绑 - 肖泽青 (2021/7/11)
    { value: e.value, label: `${supervisorDict[e.value.toString()]?.farmer_name} (${supervisorDict[e.value.toString()]?.family?.doorplate || '无门牌信息'})` })),
  [supervisorOptions]);

  useEffect(() => {
    if (visible) {
      setPoster(transformUploadedImageData([context.poster]));
      setCheckInType(context.checkInType?.toString());
      form.resetFields();
    }
    return () => {
      if (visible) {
        clearOptions();
      }
    };
  }, [visible]);

  useEffect(() => {
    form.validateFields(['poster']);
  }, [poster]);

  const submit = async () => {
    let params;
    try {
      params = await form.validateFields();
    } catch (e) {
      return;
    }
    params.id = context.id;
    params.poster = poster?.[0]?.uid.toString();
    try {
      if (context.action === 'create') {
        const result = await createTempJob(params);
        if (result.code === 0) {
          message.success('创建成功!');
          onSuccess();
        } else {
          throw new Error(result.msg);
        }
      }
      if (context.action === 'modify') {
        const result = await modifyTempJob({ ...params, supervisor: context.supervisorId });
        if (result.code === 0) {
          message.success('修改成功!');
          onSuccess();
        } else {
          throw new Error(result.msg);
        }
      }
    } catch (e) {
      message.error(`提交失败: ${e.message}`);
    }
  };

  return (
    <Modal
      title={context.action === 'create' ? '新建' : '编辑'}
      visible={visible}
      width={800}
      onCancel={onCancel}
      onOk={submit}
    >
      <Form
        form={form}
        initialValues={{
          title: context.title,
          timeRange: [context.workStart && moment(context.workStart), context.workEnd && moment(context.workEnd)],
          address: context.address,
          rate: context.rate,
          supervisor: context.supervisor,
          notes: context.notes,
          requirements: context.requirements,
          checkInType: context.checkInType?.toString(),
          breakLength: context.breakLength,
        }}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        onValuesChange={(v) => {
          if ('checkInType' in v) {
            setCheckInType(v.checkInType);
          }
        }}
      >
        <Form.Item
          label="标题"
          name="title"
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input disabled={!canModify} />
        </Form.Item>
        <Form.Item
          label="起止时间"
          name="timeRange"
          rules={[{
            validator: (rule, value, callback) => {
              if (value?.[0] && value?.[1]) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('起止时间为必选项'));
            },
          }]}
          required
        >
          <RangePicker disabled={!canModify} showTime={{ format: 'HH:mm:ss' }} format="YYYY-MM-DD HH:mm:ss" />
        </Form.Item>
        <Form.Item
          label="地点"
          name="address"
          rules={[{ required: true, message: '请输入劳务地点' }]}
        >
          <Input disabled={!canModify} />
        </Form.Item>
        {/* <Form.Item */}
        {/*  label="单价(元/小时)" */}
        {/*  name="rate" */}
        {/*  rules={[{ required: true, message: '请输入劳务单价' }]} */}
        {/* > */}
        {/*  <InputNumber min={0} precision={2} /> */}
        {/* </Form.Item> */}
        <Form.Item
          label="劳务负责人"
          name="supervisor"
          rules={[{ required: true, message: '请选择劳务负责人' }]}
        >
          <Select
            options={customSupervisorOptions}
            showSearch
            autoClearSearchValue={false}
            filterOption={false}
            suffixIcon={<SearchOutlined />}
            disabled={!canModify}
            onSearch={(v) => {
              debouncedSetName(v);
            }}
            defaultActiveFirstOption={false}
            notFoundContent={isLoading ? <div style={{ display: 'flex', justifyContent: 'center' }}><LoadingOutlined style={{ color: '#1890ff' }} /></div> : null}
            placeholder="查询劳务负责人"
            // filterOption={(input, option) => {
            //   return option?.label.includes(input)
            // }}
          />
        </Form.Item>
        <Form.Item
          label="要求"
          name="requirements"
          rules={[{ required: true, message: '请输入要求' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="打卡类型"
          name="checkInType"
          rules={[{ required: true, message: '请选择打卡类型' }]}
        >
          <Select options={checkInTypes} disabled={!canModify} />
        </Form.Item>
        {checkInType && checkInType !== '4' && (
        <Form.Item
          label="午休时间"
          name="breakLength"
          rules={[{ required: true, message: '请选择午休时间' }]}
        >
          <Select options={breakLength} disabled={!canModify} />
        </Form.Item>
        )}
        <Form.Item
          label="备注"
          name="notes"
        >
          <Input />
        </Form.Item>
        {/* <Form.Item */}
        {/*  label="封面" */}
        {/*  name="poster" */}
        {/*  rules={[{ */}
        {/*    validator: () => { */}
        {/*      if (poster.length) { */}
        {/*        return Promise.resolve(); */}
        {/*      } */}
        {/*      return Promise.reject(new Error('封面为必传项')); */}
        {/*    }, */}
        {/*  }]} */}
        {/*  required */}
        {/* > */}
        {/*  <ImgUpload getImgData={(v) => setPoster(v)} values={poster} /> */}
        {/* </Form.Item> */}
      </Form>
    </Modal>
  );
}

export default TempJobModal;
