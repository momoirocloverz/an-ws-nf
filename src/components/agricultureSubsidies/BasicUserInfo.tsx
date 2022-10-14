/* eslint-disable no-nested-ternary */
import { Input, Select } from 'antd';
import { ownershipTypes } from '@/pages/agricultureSubsidies/consts';
import React, { useEffect, useState } from 'react';
import {BasicSubsidyUser} from "@/pages/agricultureSubsidies/types";

type PropType = {
  user?: BasicSubsidyUser;
  disabled?: boolean;
  onChange?: (user: BasicSubsidyUser)=>unknown
}

function BasicUserInfo({ user, disabled, onChange } : PropType) {
  const [ownershipType, setOwnershipType] = useState(user?.ownershipType);
  const [name, setName] = useState(user?.name);
  const [idNumber, setIdNumber] = useState(user?.idNumber);

  useEffect(() => {
    if (typeof onChange === 'function') {
      onChange({ ownershipType, name, idNumber });
    }
  }, [ownershipType, name, idNumber]);

  return (
    <div>
      <Input.Group>
        <span className="ant-input-wrapper ant-input-group">
          <span className="ant-input-group-addon">承包对象性质:</span>
          <Select
            style={{ width: '100%' }}
            value={ownershipType}
            onChange={(value) => setOwnershipType(value)}
            options={(Object.entries(ownershipTypes).map(([k, v]) => ({ value: parseInt(k, 10), label: v })))}
            disabled={disabled}
          />
        </span>
      </Input.Group>
      <Input.Group>
        <Input
          addonBefore={`${ownershipType === 1 ? '承包人' : ownershipType === 2 ? '法人' : ''}姓名:`}
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={disabled}
        />
      </Input.Group>
      <Input.Group>
        <Input
          addonBefore="身份证号码:"
          value={idNumber}
          onChange={(e) => setIdNumber(e.target.value)}
          disabled={disabled}
        />
      </Input.Group>
    </div>
  );
}

BasicUserInfo.defaultProps = {
  user: undefined,
  disabled: false,
  onChange: () => {},
};

export default BasicUserInfo;
