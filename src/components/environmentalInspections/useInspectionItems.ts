import { useEffect, useState } from 'react';
import { message } from 'antd';
import { getInspectionItems } from '@/services/environmentalInspections';

type Options = {
  enableEmptyCategory: boolean;
  enforcePrimaryCategoryStyle: boolean;
}

export default function useInspectionItems(options: Options =
{ enableEmptyCategory: false, enforcePrimaryCategoryStyle: true }) {
  const [data, setData] = useState<[Record<string, string>, { label; value }[]]>([{}, []]);

  useEffect(() => {
    let isMounted = true;
    getInspectionItems({ pageNum: 1, pageSize: Number.MAX_SAFE_INTEGER })
      .then((result) => {
        if (isMounted) {
          const dict = {};
          const options: { label; value }[] = [];
          if (result?.code !== 0) {
            throw new Error(result?.msg ?? '请求失败');
          }
          result.data.data.forEach((e) => {
            const obj = { value: e.id, label: e.main_item, children: [] };
            if (options.enforcePrimaryCategoryStyle) {
              obj.isLeaf = false;
            }
            if (Array.isArray(e.list) && e.list.length > 0) {
              obj.children = e.list?.map((child) => {
                const childObj = { value: child.id, label: `${child.problem_cate}(${child.just_negative})` };
                dict[e.id.toString()] = childObj;
                return childObj;
              });
            } else {
              obj.disabled = !options.enableEmptyCategory;
            }
            dict[e.id.toString()] = obj;
            options.push(obj);
          });
          // @ts-ignore
          setData([dict, options]);
        }
      })
      .catch((e) => message.error(`全域秀美检查列表读取失败: ${e.message}`));
    return () => {
      isMounted = false;
    };
  }, []);

  return data;
}
