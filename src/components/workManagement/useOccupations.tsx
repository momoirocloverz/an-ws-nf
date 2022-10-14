import {
  useCallback, useEffect, useRef, useState,
} from 'react';
import { message } from 'antd';
import { getJobTypes, getSupervisors } from '@/services/workManagement';

export default function useOccupations(searchedName: string, gender: number | undefined = undefined, showAll = false) {
  const [occupations, setOccupations] = useState<[Record<string, string>, { label; value }[]]>([{}, []]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<any>();

  const clearOccupationOptions = () => {
    setOccupations([occupations[0], []]);
  };
  useEffect(() => {
    let isMounted = true;
    searchRef.current = searchedName;
    if (searchedName?.length || showAll) {
      setIsLoading(true);
      getJobTypes({
        name: searchedName, gender, pageNum: 1, pageSize: Number.MAX_SAFE_INTEGER,
      })
        .then((result) => {
          if (isMounted && searchedName === searchRef.current) {
            const occupationDict = {};
            const options: { label; value }[] = [];
            result.data.data.forEach((e) => {
              occupationDict[e.id.toString()] = e;
              options.push({ value: e.id, label: e.profession_name });
            });
            // @ts-ignore
            setOccupations([occupationDict, options]);
          }
        })
        .catch((e) => message.error(`劳务负责人列表读取失败: ${e.message}`))
        .finally(() => {
          setIsLoading(false);
        });
    }
    // TODO: search = '' 的行为
    return () => {
      isMounted = false;
    };
  }, [searchedName]);

  return { occupations, clearOccupationOptions, isLoading };
}
