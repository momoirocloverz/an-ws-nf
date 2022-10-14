import React, { useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Select, Input, Button, Upload, DatePicker } from 'antd'
import { UploadOutlined } from '@ant-design/icons';

const { Option } = Select;
const FormItem = Form.Item;
// form layout
const formItemLayout:Object = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
};
const ArticleDetail: React.FC<{}> = () => {
  const [getImgList, setImgList] = useState<Array<any>>([]);
  // img before
  const beforeImg = (file:Object) => {
    const fileArr:Array<any> = []
    fileArr.push(file)
    setImgList(fileArr)
  }
  // img remove
  const removeImg = () => {
    const fileArr:Array<any> = []
    setImgList(fileArr)
  }
  // img change
  const updateChange = (info:any) => {
    // const arr = {
    //   name: '封面图',
    //   uid: '1',
      
    // }
    // if (info && info.file && info.file.status === 'done') {
    //   const fileArr:Array<any> = [info.file] || []
    //   setImgList(fileArr)
    // }
  }
  // upload 属性
  const props:Object = {
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    listType: 'picture',
    beforeUpload: beforeImg,
    onRemove: removeImg,
    onSuccess: updateChange,
    fileList: getImgList
  };
  // 提交
  const onFinish = (val:Object) => {
    console.log(val)
  }
  return (
    <PageHeaderWrapper>
      <Form
        name="article_form"
        {...formItemLayout}
        onFinish={onFinish}
      >
        <FormItem
          name="article_title"
          label="文章标题"
          rules={[
            {
              required: true,
              message: '请输入文章标题',
            }
          ]}
        >
          <Input placeholder="输入文章标题" />
        </FormItem>
        <FormItem
          name="article_type"
          label="文章分类"       
          rules={[
            {
              required: true,
              message: '请选择文章分类'
            }
          ]}
        >
          <Select placeholder="选择文章分类">
            <Option value="1">三务公开</Option>
            <Option value="2">政务公告</Option>
          </Select>
        </FormItem>
        <FormItem
          name="release_time"
          label="定时发布"
        >
          <DatePicker showTime />
        </FormItem>
        <FormItem
          name="upload_image"
          label="上传封面"
          rules={[
            {
              required: true,
              message: '请上传封面图'
            }
          ]}
        >
          <Upload
            {...props}
          >
            <Button>
              <UploadOutlined /> 点击上传
            </Button>
          </Upload>
        </FormItem>
      </Form>
    </PageHeaderWrapper>
  );
};

export default ArticleDetail;
