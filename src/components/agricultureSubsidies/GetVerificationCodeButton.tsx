import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { getVerificationCode } from '@/services/agricultureSubsidies';

function GetVerificationCodeButton({ phoneNumber }: { phoneNumber: string }) {
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown > 0) {
      setTimeout(() => setCooldown(cooldown - 1), 1000);
    }
  }, [cooldown]);

  const handleClick = () => {
    setCooldown(60);
    getVerificationCode(phoneNumber);
  };

  return (
    <Button onClick={handleClick} disabled={cooldown > 0 || !(phoneNumber?.length > 0)}>
      {cooldown > 0 ? `可在${cooldown}秒后重新获取` : '获取验证码'}
    </Button>
  );
}

export default GetVerificationCodeButton;
