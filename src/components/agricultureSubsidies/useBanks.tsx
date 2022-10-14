import { useEffect, useState } from 'react';
import { getBankList } from '@/services/agricultureSubsidies';
import { message } from 'antd';

export default function useBanks() {
  const [banks, setBanks] = useState<[Record<string, string>, { label, value }[]]>([{}, []]);

  useEffect(() => {
    let isMounted = true;
    getBankList()
      .then((result) => {
        if (isMounted) {
          const bankDict = {};
          const options: { label, value }[] = [];
          result.data.forEach((e) => {
            bankDict[e.id.toString()] = e.bank_name;
            options.push({ value: e.bank_name, label: e.bank_name });
          });
          // @ts-ignore
          setBanks([bankDict, options]);
        }
      })
      .catch((e) => message.error(`银行列表读取失败: ${e.message}`));
    return () => {
      isMounted = false;
    };
  }, []);

  return banks;
}
