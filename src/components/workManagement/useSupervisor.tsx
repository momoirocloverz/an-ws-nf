import { useEffect, useRef, useState } from 'react';
import { message } from 'antd';
import { getSupervisors } from '@/services/workManagement';

export default function useSupervisor(region: number[], searchedName: string) {
  const [supervisors, setSupervisors] = useState<[Record<string, string>, { label; value }[]]>([{}, []]);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<any>();

  const clearOptions = () => {
    setSupervisors([supervisors[0], []]);
  };
  useEffect(() => {
    let isMounted = true;
    searchRef.current = { region, searchedName };
    if (region?.length && searchedName?.length) {
      setIsLoading(true);
      getSupervisors(region, searchedName)
        .then((result) => {
          if (isMounted && region === searchRef.current.region && searchedName === searchRef.current.searchedName) {
            const supervisorDict = {};
            const options: { label; value }[] = [];
            result.data.data.forEach((e) => {
              supervisorDict[e.user_id.toString()] = e;
              options.push({ value: e.user_id, label: e.farmer_name });
            });
            // @ts-ignore
            setSupervisors([supervisorDict, options]);
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
  }, [region, searchedName]);

  return { supervisors, isLoading, clearOptions };
}
