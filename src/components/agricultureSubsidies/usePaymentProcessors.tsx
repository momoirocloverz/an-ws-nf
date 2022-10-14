import React, { useEffect, useState } from 'react';
import { getPaymentProcessors } from '@/services/agricultureSubsidies';
import { paymentStatus } from '@/pages/agricultureSubsidies/consts';

type FuncType = {
  setOwnershipType: React.Dispatch<React.SetStateAction<any>>
  setCategoryName: React.Dispatch<React.SetStateAction<any>>
  setContext: (type: string, name: string) => unknown
}

export default function usePaymentProcessors(): [any[], FuncType, any[]] {
  const [nameList, setNameList] = useState<any[]>([]);
  const [selectOptions, setSelectOptions] = useState<any[]>([]);
  const [ownershipType, setOwnershipType] = useState();
  const [categoryName, setCategoryName] = useState();
  useEffect(() => {
    let isMounted = true;
    if (ownershipType && categoryName) {
      getPaymentProcessors(ownershipType, categoryName).then((result) => {
        if (isMounted) {
          if (result.data?.people) {
            const options = result.data.people.map((p) => ({ label: p.user_name, value: p.id, obj: p }));
            setSelectOptions(options);
            setNameList(result.data?.people);
          } else {
            setSelectOptions([]);
            setNameList([]);
          }
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [ownershipType, categoryName]);
  const setContext = (type, name) => {
    setOwnershipType(type);
    setCategoryName(name);
  };
  return [selectOptions, { setOwnershipType, setCategoryName, setContext }, nameList];
}
