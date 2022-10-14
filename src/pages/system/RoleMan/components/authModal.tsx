import React, { useState, useEffect } from 'react';
import { Modal, Tree, } from 'antd';
import { paginationHandle } from '@/utils/utils';
import { getAuthorityList } from '@/services/system';

interface CreateFormProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
  selected: Array<any>;
  selectList: Array<any>;
}

const AuthModal: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onSubmit: handleAdd, onCancel, selected, selectList} = props;
  const [treeData, setTreeData] = useState<any[]>(selectList);
  const [checkedKeys, setCheckedKeys] = useState(selected);

  const okHandle = async () => {
    console.log(checkedKeys, '选择');
    handleAdd(checkedKeys);
  };

  const onCheck = (checkedKeys:any, val:any) => {
    let arr: any = [...checkedKeys];
    if (val.node && val.node.level > 1) {
      if (val.halfCheckedKeys && val.halfCheckedKeys.length > 0) {
        arr = [...checkedKeys, ...val.halfCheckedKeys]
      }
    }
    setCheckedKeys(checkedKeys);
  };

  return (
    <Modal
      width={800}
      destroyOnClose
      title="设置页面权限"
      visible={modalVisible}
      maskClosable= {false}
      onOk={okHandle}
      onCancel={onCancel}
    >
      <Tree
        checkable
        onCheck={onCheck}
        checkedKeys={checkedKeys}
        treeData={treeData}
      />
    </Modal>
  );
};

export default AuthModal;
