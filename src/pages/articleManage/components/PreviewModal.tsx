import React, { useState, useEffect } from 'react';
import { Form, Modal } from 'antd';
import './edit.css';
import styles from '../style.less'
import { values } from 'lodash';

const FormItem = Form.Item;

interface CreateFormProps {
  modalVisible: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  values: any;
}


const PreviewModal: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onSubmit, onCancel, values } = props;
  const [contentText, resetContentText] = useState('');
  
  useEffect(() => {
    console.log(values, 'values')
    let text = values.content.replace(/pt/g, 'px');
    text = text.replace(/<img/g, '<img style="width:100%;"');
    console.log(text, 'textttt')
    resetContentText(text)
  }, []);



  return (
    <Modal
      width='50%'
      destroyOnClose
      title='文章预览'
      visible={modalVisible}
      onOk={() => onSubmit()}
      onCancel={() => onCancel()}
    >
      <div className={styles.articleBox}>
        <h1>{values.title}</h1>
        <div className={styles.time}><span>{values.category_title}</span><span>{values.created_at}</span></div>
        <div dangerouslySetInnerHTML={{__html: contentText}}></div>
        <div>{values.file_url.split('/')[values.file_url.split('/').length - 1]}</div>
      </div>
    </Modal>
  );
};

export default PreviewModal