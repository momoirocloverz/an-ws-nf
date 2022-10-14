import React, { useState, useEffect } from 'react';
import { Modal, Tree, } from 'antd';
import { paginationHandle } from '@/utils/utils';
import { getAuthorityList } from '@/services/system';

interface CreateFormProps {
  modalVisible: boolean;
  onSubmit: (fieldsValue: { desc: string }) => void;
  onCancel: () => void;
  selected: Array<any>;
}

const AuthModal: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onSubmit: handleAdd, onCancel, selected,} = props;
  const [treeData, setTreeData] = useState<any[]>();
  const [checkedKeys, setCheckedKeys] = useState<Array<any>>(selected);

  // 获取权限列表数据
  const getAuthListData = async () => {
    const _params = paginationHandle({
      current: 1,
      pageSize: 9999
    });
    const _data = await getAuthorityList(_params);
    const _treeData: Array<any> = [];
    if (_data.code === 0) {
      const _arr = _data && _data.data && _data.data.data || [];
      _arr.forEach((el: any) => {
        _treeData.push({
          title: el.label,
          key: el.value
        })
      });
    }
    setTreeData(_treeData);
  }

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

  useEffect(() => {
    getAuthListData();
  }, [])

  return (
    <Modal
      width={800}
      destroyOnClose
      title="绑定权限"
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
