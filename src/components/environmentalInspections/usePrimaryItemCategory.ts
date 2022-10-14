import { useEffect, useState } from 'react';
import { message } from 'antd';
import { getPrimaryInspectionCategories } from '@/services/environmentalInspections';

export default function usePrimaryItemCategory() {
  const [data, setData] = useState<[Record<string, string>, { label; value }[]]>([{}, []]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    getPrimaryInspectionCategories({ pageNum: 1, pageSize: Number.MAX_SAFE_INTEGER })
      .then((result) => {
        if (isMounted) {
          const dict = {};
          const options: { label; value }[] = [];
          if (result?.code !== 0) {
            throw new Error(result?.msg ?? '请求失败');
          }
          result.data.data.forEach((e) => {
            dict[e.id.toString()] = `${e.problem_cate}-${e.main_item}`;
            options.push({ value: e.id, label: e.main_item });
          });
          // @ts-ignore
          setData([dict, options]);
        }
      })
      .catch((e) => message.error(`全域秀美检查主项列表读取失败: ${e.message}`))
      .finally(() => {
        setIsLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return { data, isLoading };
}
