import { useEffect, useState } from 'react';
import { getCategoryList, getSubsidyScalePlantNew } from '@/services/agricultureSubsidies';
import { message } from 'antd';
import { transformCategoryTree, resetEnum } from '@/pages/agricultureSubsidies/utils';
import { CascaderOptionType } from 'antd/lib/cascader';

export default function useCategories() {
  const [catTree, setCatTree] = useState<CascaderOptionType[]>([]);

  useEffect(() => {
    let isMounted = true;
    getCategoryList()
      .then((result) => {
        if (isMounted) {
          if (result.code !== 0) {
            throw new Error(result.msg);
          }
          setCatTree(transformCategoryTree(result.data));
        }
      })
      .catch((e) => message.error(`补贴项目列表读取失败: ${e.message}`));
    return () => {
      isMounted = false;
    };
  }, []);
  return catTree;
}


// export default function useCategories() {
//   const [catTree, setCatTree] = useState({});

//   useEffect(() => {
//     let isMounted = true;
//     getSubsidyScalePlantNew()
//       .then((result) => {
//         if (isMounted) {
//           if (result.code !== 0) {
//             throw new Error(result.msg);
//           }
//           setCatTree(resetEnum(result.data));
//         }
//       })
//       .catch((e) => message.error(`补贴项目列表读取失败: ${e.message}`));
//     return () => {
//       isMounted = false;
//     };
//   }, []);

//   return catTree;
// }