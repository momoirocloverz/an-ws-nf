import React, { useEffect, useMemo, useState } from 'react';
import {
  Form, Input, message, Modal, Radio, Select, Tag,
} from 'antd';
import {
  createTempWorker, modifyTempWorker,
} from '@/services/workManagement';
import useOccupations from '@/components/workManagement/useOccupations';
import { debounce } from 'lodash';
import { LoadingOutlined, SearchOutlined } from '@ant-design/icons';

type Context = {
  action: 'create' | 'modify';
  id: number;
  name: string;
  phoneNumber: string;
  idNumber: string;
  gender: number;
  // dob: string,
  jobType: string;
  address: string;
  notes: string;
}

type PropType = {
  context: Context | {};
  visible: boolean;
  onCancel: () => unknown;
  onSuccess: () => unknown;
}

function extractIds(array) {
  return array.map((item) => item.value);
}

function tagRender({
  label, value, onClose, initials,
}) {
  const onPreventMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      onMouseDown={onPreventMouseDown}
      closable={!((initials ?? []).includes(value))}
      onClose={onClose}
      style={{ margin: '3px' }}
    >
      {label}
    </Tag>
  );
}
function TempWorkerModal({
  context, visible, onCancel, onSuccess,
}: PropType) {
  const [form] = Form.useForm();
  const [occupationGender, setOccupationGender] = useState();
  const [searchedOccupation, setSearchedOccupation] = useState('');
  const { occupations: [occupationDict, occupationOptions], clearOccupationOptions: clearOccupations, isLoading } = useOccupations(searchedOccupation, occupationGender);
  const [hasModifiedJobType, setHasModifiedJobType] = useState(false);
  const [selectedJobTypes, setSelectedJobTypes] = useState<number[]>([]);
  const [occupationDictCache, setOccupationDictCache] = useState([]);
  const [validationStatus, setValidationStatus] = useState({});

  const debouncedSetName = useMemo(() => debounce((v) => {
    setSearchedOccupation(v);
  }, 500, {
    leading: false,
    trailing: true,
  }), []);
  const initialSelectedJobTypes = useMemo(() => (context.jobTypeIds?.map((id, idx) => ({ key: id, value: id, label: context.jobTypeNames[idx] })) ?? []), [context]);

  useEffect(() => setHasModifiedJobType(true), [selectedJobTypes]);
  useEffect(() => {
    const newCache = [...occupationDictCache];
    Object.assign(newCache, occupationDict);
    setOccupationDictCache(newCache);
  }, [occupationDict]);

  useEffect(() => {
    if (visible) {
      form.resetFields();
      setOccupationGender(context.gender + 1);
      setSelectedJobTypes(initialSelectedJobTypes);
    }
    return () => {
      if (visible) {
        setSelectedJobTypes([]);
        setHasModifiedJobType(false);
        setSearchedOccupation('');
        setOccupationDictCache([]);
        setValidationStatus({ status: 'success' });
        clearOccupations();
      }
    };
  }, [visible]);
  const validateJobType = () => {
    if (context.action === 'create') {
      if (selectedJobTypes.length > 0) {
        setValidationStatus({ status: 'success' });
      } else {
        setValidationStatus({ status: 'error', text: '???????????????' });
        throw new Error('???????????????');
      }
    } else if (context.action === 'modify') {
      // if (selectedJobTypes.length > context.jobTypeIds.length) {
      //   setValidationStatus({ status: 'success' });
      // } else {
      //   setValidationStatus({ status: 'error', text: '?????????????????????' });
      //   throw new Error('?????????????????????');
      // }
      setValidationStatus({ status: 'success' });
    } else {
      setValidationStatus({ status: 'error', text: '??????????????????' });
      throw new Error('??????????????????');
    }
  };

  const submit = async () => {
    let params;
    try {
      [params] = await Promise.all([form.validateFields(), validateJobType()]);
    } catch (e) {
      return;
    }
    // No change
    if (context.action === 'modify' && selectedJobTypes.length === context.jobTypeIds.length) {
      onSuccess();
      return;
    }
    const newJobTypes = selectedJobTypes.filter((job) => !(context.jobTypeIds ?? []).includes(job.value));
    const jobTypeIds = hasModifiedJobType ? extractIds(newJobTypes) : [];
    params.id = context.id;
    params.jobType = jobTypeIds;
    // return;
    try {
      if (hasModifiedJobType && jobTypeIds.some((jobTypeId) => jobTypeId?.toString() in occupationDictCache && occupationDictCache[jobTypeId?.toString()]?.sex !== (params.gender + 1))) {
        throw new Error('?????????????????????????????????');
      }
      if (context.action === 'create') {
        const result = await createTempWorker(params);
        if (result.code === 0) {
          message.success('????????????!');
          onSuccess();
        } else {
          throw new Error(result.msg);
        }
      }
      if (context.action === 'modify') {
        const result = await createTempWorker(params);
        if (result.code === 0) {
          message.success('????????????!');
          onSuccess();
        } else {
          throw new Error(result.msg);
        }
      }
    } catch (e) {
      message.error(`????????????: ${e.message}`);
    }
  };

  return (
    <Modal
      title={context.action === 'create' ? '??????' : '??????'}
      visible={visible}
      width={800}
      onCancel={onCancel}
      onOk={submit}
    >
      <Form
        form={form}
        initialValues={{
          name: context.name,
          phoneNumber: context.phoneNumber,
          idNumber: context.idNumber,
          gender: context.gender,
          // dob: context.dob && (!context.dob.startsWith('0000-') || undefined) && moment(context.dob),
          // jobType: context.jobType,
          address: context.address,
          notes: context.notes,
          // jobDesc: context.jobDesc,
          bankName: context.bankName,
          bankAccount: context.bankAccount,
        }}
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 14 }}
        onValuesChange={(v) => {
          if ('gender' in v) {
            setOccupationGender(v.gender + 1);
            clearOccupations();
            if (context.action === 'modify') {
              setSelectedJobTypes([]);
              // form.setFields([{ name: 'jobType', value: undefined }]);
            }
          }
        }}
      >
        <Form.Item
          label="??????"
          name="name"
          rules={[{ required: true, message: '???????????????' }]}
        >
          <Input disabled={context.action === 'modify'} />
        </Form.Item>
        <Form.Item
          label="?????????"
          name="phoneNumber"
          // rules={[{ required: true, message: '??????????????????' }]}
        >
          <Input disabled={context.action === 'modify'} />
        </Form.Item>
        <Form.Item
          label="?????????"
          name="idNumber"
          rules={[{ required: true, message: '??????????????????' }]}
        >
          <Input disabled={context.action === 'modify'} />
        </Form.Item>
        <Form.Item
          label="??????"
          name="gender"
          rules={[{ required: true, message: '???????????????' }]}
        >
          <Radio.Group disabled={context.action === 'modify'}>
            <Radio value={0}>???</Radio>
            <Radio value={1}>???</Radio>
          </Radio.Group>
        </Form.Item>
        {/* <Form.Item
          label="????????????"
          name="dob"
          rules={[{ required: true, message: '?????????????????????' }]}
        >
          <DatePicker picker="date" />
        </Form.Item> */}
        <Form.Item
          label="??????"
          // name="jobType"
          // rules={[{ required: true, message: '???????????????' }]}
          validateStatus={validationStatus.status}
          help={validationStatus.text}
          required
        >
          <Select
            options={occupationOptions}
            value={selectedJobTypes}
            onChange={(valueArray) => {
              // ??????????????? ???????????? -?????????
              if (context.action === 'modify') {
                const initial = new Set<number>(context.jobTypeIds);
                const additions = valueArray.filter((value) => !initial.has(value.value));
                setSelectedJobTypes([...initialSelectedJobTypes, ...additions]);
              } else {
                setSelectedJobTypes(valueArray);
              }
            }}
            labelInValue
            // disabled={context.action === 'modify'}
            filterOption={false}
            suffixIcon={<SearchOutlined />}
            defaultActiveFirstOption={false}
            tagRender={(props) => tagRender({ ...props, initials: context.jobTypeIds })}
            notFoundContent={isLoading ? <div style={{ display: 'flex', justifyContent: 'center' }}><LoadingOutlined style={{ color: '#1890ff' }} /></div> : null}
            placeholder="????????????"
            mode="multiple"
            onSearch={(v) => {
              debouncedSetName(v);
            }}
            showSearch
          />
        </Form.Item>
        {/* <Form.Item */}
        {/*  label="????????????" */}
        {/*  name="jobDesc" */}
        {/* > */}
        {/*  <Input disabled /> */}
        {/* </Form.Item> */}
        <Form.Item
          label="????????????"
          name="bankName"
          // rules={[{ required: true, message: '?????????????????????' }]}
        >
          <Input disabled={context.action === 'modify'} />
        </Form.Item>
        <Form.Item
          label="????????????"
          name="bankAccount"
          // rules={[{ required: true, message: '?????????????????????' }]}
        >
          <Input disabled={context.action === 'modify'} />
        </Form.Item>
        <Form.Item
          label="??????"
          name="address"
          // rules={[{ required: true, message: '???????????????' }]}
        >
          <Input disabled={context.action === 'modify'} />
        </Form.Item>
        {/* <Form.Item */}
        {/*  label="??????" */}
        {/*  name="notes" */}
        {/*  // rules={[{ required: true, message: '???????????????' }]} */}
        {/* > */}
        {/*  <Input /> */}
        {/* </Form.Item> */}
      </Form>
    </Modal>
  );
}

export default TempWorkerModal;
