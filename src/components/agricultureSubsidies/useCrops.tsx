import { useEffect, useState } from 'react';
import { getCropList } from '@/services/agricultureSubsidies';
import { message } from 'antd';

export default function useCrops() {
  const [cropData, setCropData] = useState<[Record<string, string>, { label, value }[]]>([{}, []]);

  useEffect(() => {
    let isMounted = true;
    getCropList()
      .then((result) => {
        if (isMounted) {
          const crops = {};
          const options: { label, value }[] = [];
          result.data.forEach((e) => {
            crops[e.id.toString()] = e.crops_name;
            options.push({ value: e.id, label: e.crops_name });
          });
          // @ts-ignore
          setCropData([crops, options]);
        }
      })
      .catch((e) => message.error(`农作物列表读取失败: ${e.message}`));
    return () => {
      isMounted = false;
    };
  }, []);
  return cropData;

}
