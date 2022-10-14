import React, { useEffect, useState } from 'react';
import {Modal, Form, Input, Radio, Upload, message, InputNumber} from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { IMG_UPLOAD_URL } from '@/services/api';
import { getLocalToken } from '@/utils/utils';
import {applyUse} from '@/services/ItemManage'
import './index.less';
import styles from "@/pages/integral/scoring/components/createEdit/index.less";
import _ from "lodash";

const ApplyUse: React.FC<any> = (props) => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const [imgUrl, setImgUrl] = useState([]);
    const [valueType, setValueType] = useState(1);
    const [minimum, setMinimum] = useState();
    const [maximum, setMaximum] = useState();
    const applyModal = props.applyModal;
    const layout = {
        labelCol: {
            span: 6
        },
        wrapperCol: {
            span: 18
        }
    };
    const uploadButton = (
        <div>
            {loading ? <LoadingOutlined /> : <PlusOutlined />}
            <div style={{ marginTop: 8 }}>上传</div>
        </div>
    );

  useEffect(() => {
    form.validateFields(['variableValue']);
  }, [minimum, maximum]);
    const finishedModal = () => {
        form.validateFields().then(res => {
            if(imgUrl.length==0){
                return message.error('请上传代表大会文件');
            }
            // 参考分值
            if(applyModal.record.p_type==2){
                let arr=res.referenceScore.split('~')
                if(res.realScore<parseInt(arr[0])||res.realScore>parseInt(arr[1])){
                    return message.error('当前实际分数不在参考分数范围');
                }
            }
            let data={
                image_id:imgUrl[0].uid,
                item_id:applyModal.record.item_id,
                use_p_type: valueType,
                use_point: valueType === 1 ? res.fixedValue : valueType === 2 ? `${minimum}~${maximum}` : undefined,
                use_comment:res.useIntro
            };
            applyUse(data).then(response=>{
                if(response.code===0){
                    message.success('申请成功');
                    props.handleApplySuccess();
                } else {
                  throw new Error(response.msg)
                }
            }).catch((e) => {
              message.error(`申请失败: ${e.message}`);
            });
        })
    }
    useEffect(() => {
        if (applyModal.record != '') {
            let record = applyModal.record;
            const [min, max] = record.point?.split('~') ?? [undefined, undefined];
            setValueType(record.p_type);
            setMinimum(!Number.isNaN(parseFloat(min)) ? parseFloat(min) : undefined);
            setMaximum(!Number.isNaN(parseFloat(max)) ? parseFloat(max) : undefined);
            form.setFields([
                {
                    name: 'mainCode',
                    value: record.p_code
                },
                {
                    name: 'childCode',
                    value: record.s_code
                },
                {
                    name: 'scoreName',
                    value: record.s_name
                },
                {
                    name: 'scoreType',
                    value: record.direction == "INCREASE" ? '1' : '2'
                },
                {
                    name: 'referenceScore',
                    value: record.point
                },
                {
                    name: 'realScore',
                    value: record.p_type==1?record.point:''
                },
                {
                  name: 'valueType',
                  value: record.p_type
                },
                {
                  name: 'fixedValue',
                  value: parseFloat(record.point),
                },
                {
                    name: 'useIntro',
                    value: record.comment
                }
            ]);
        }
    }, []);
    // 上传图片
    const imgUploadProps = {
        action: IMG_UPLOAD_URL(),
        listType: 'picture',
        fileList: imgUrl,
        headers: { Authorization: getLocalToken() },
        beforeUpload: (file) => {
            setLoading(true);
            const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
            if (!isJpgOrPng) {
                message.error('只能上传 JPG/PNG/GIF 格式图片!');
                setLoading(false);
            }
            const isLt2M = file.size / 1024 / 1024 < 10;
            if (!isLt2M) {
                message.error('图片体积不能超过 10MB!');
                setLoading(false);
            }
            return isJpgOrPng && isLt2M;
        },
        onSuccess: (res) => {
            setLoading(false);
            let _img = res.data || {};
            let _arr = {
                uid: _img.id,
                name: '图片',
                status: 'done',
                url: _img.url
            }
            setImgUrl([_arr]);
        },
        onRemove: () => {
            setImgUrl([]);
        }

    };
    return (
        <Modal getContainer={window.document.body} visible={applyModal.visible} title={applyModal.title} onOk={finishedModal} onCancel={props.handleModalCancel}>
            <Form
                {...layout}
                form={form}
                onFinish={finishedModal}
            >
                <Form.Item label="主编码：" name="mainCode" rules={[{ required: true, message: '请输入主编码' }]}>
                    <Input type="text" placeholder="请输入主编码" disabled={true} />
                </Form.Item>
                <Form.Item label="子编码：" name="childCode" rules={[{ required: true, message: '请输入子编码' }]}>
                    <Input type="text" placeholder="请输入子编码" disabled={true} />
                </Form.Item>
                <Form.Item label="打分项名称：" name="scoreName" rules={[{ required: true, message: '请输入打分项名称' }]}>
                    <Input type="text" placeholder="请输入打分项名称" disabled={true} />
                </Form.Item>
                <Form.Item label="打分类型：" name="scoreType" rules={[{ required: true, message: '请选择打分类型' }]}>
                    <Radio.Group disabled={true}>
                        <Radio value="1">加分</Radio>
                        <Radio value="2">扣分</Radio>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="参考分值：" name="referenceScore" rules={[{ required: true, message: '请输入参考分值' }]}>
                    <Input type="text" placeholder="请输入参考分值" disabled={true} />
                </Form.Item>

              <Form.Item
                label="分值类型"
                name="valueType"
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
                  value={valueType}
                  disabled={props.applyModal.record.p_type === 1}
                  onChange={(e) => setValueType(e.target.value)}
                >
                  <Radio value={1}>固定分值</Radio>
                  <Radio value={2}>范围分值</Radio>
                </Radio.Group>
              </Form.Item>

              {valueType === 1 ? (
                <Form.Item
                  label="固定分值"
                  name="fixedValue"
                  rules={[{
                    validator: (r, v) => {
                      if (v === undefined) {
                        return Promise.reject(new Error('请输入固定分值'));
                      }
                      const [lowerBound, upperBound] = props.applyModal.record.point?.split('~').map((e) => parseFloat(e));
                      if (v < lowerBound || v > upperBound) {
                        return Promise.reject(new Error('请输入参考范围内的分值'));
                      }
                      return Promise.resolve();
                    },
                  }]}
                  required
                >
                  <InputNumber
                    type="text"
                    placeholder="请输入固定分值"
                    className={styles.scoreInfo}
                    disabled={props.applyModal.record.p_type === 1}
                  />
                </Form.Item>
              ) : null}
              {valueType === 2 ? (
                <Form.Item
                  label="范围分值"
                  name="variableValue"
                  rules={[{
                    validator: () => {
                      if (minimum !== undefined && !Number.isNaN(minimum) && maximum !== undefined && !Number.isNaN(maximum)) {
                        const min = minimum;
                        const max = maximum;
                        const [lowerBound, upperBound] = props.applyModal.record.point?.split('~').map((e) => parseFloat(e));
                        if (min >= max) {
                          return Promise.reject(new Error('起始值必须小于结束值'));
                        }
                        if (min < lowerBound || min > upperBound) {
                          return Promise.reject(new Error('起始值必须大于等于参考的起始值,并小于参考的结束值'));
                        }
                        if (max < lowerBound || max > upperBound) {
                          return Promise.reject(new Error('结束值必须大于等于参考的起始值,并小于参考的结束值'));
                        }
                        return Promise.resolve();
                      }
                      return Promise.reject(new Error('请输入起始值和结束值'));
                    },
                  }]}
                >
                  <div className={styles.inputContainer}>
                    <div className={styles.scoreInput}>
                      <InputNumber
                        placeholder="起始值"
                        width="80px"
                        value={minimum}
                        onChange={(v) => setMinimum(v)}
                      />
                    </div>
                    &nbsp;~&nbsp;
                    <div className={styles.scoreInput}>
                      <InputNumber
                        placeholder="结束值"
                        width="80px"
                        value={maximum}
                        onChange={(v) => setMaximum(v)}
                      />
                    </div>
                  </div>
                </Form.Item>
              ) : null }
                <Form.Item label="使用说明：" name="useIntro" rules={[{ required: true, message: '请输入使用说明' }]}>
                    <Input type="text" placeholder="请输入使用说明" />
                </Form.Item>
                <Form.Item label="代表大会文件：" name="representFile" rules={[{ required: true, message: '请选择代表大会文件' }]}>
                    <Upload {...imgUploadProps} className="avatar-uploader">
                        {imgUrl.length>0 ? '' : uploadButton}
                    </Upload>
                </Form.Item>
            </Form>
        </Modal>
    )
}

export default ApplyUse;
