import React, { useState, useEffect, Children } from 'react';
import { ConnectState } from '@/models/connect';
import { connect } from 'umi';
import RenderAuthorize from '@/components/Authorized';
import _ from 'lodash';

interface ButtonAuthProps {
  userAuthButton: Array<any>;
  type: string;
  location: any;
  route: string;
}

const ButtonAuth: React.FC<ButtonAuthProps> = (props) => {
  const { userAuthButton, children, type } = props;
  const [authArr, setAuthArr] = useState([]);
  const Authorized = RenderAuthorize(authArr);

  useEffect(() => {
    getAuthArr()
  }, [props.userAuthButton])

  const getAuthArr = () => {
    for(let i=0; i<userAuthButton.length; i++) {
      if (window.location.pathname === userAuthButton[i].path) {
        setAuthArr(userAuthButton[i].permission);
        break;
      }
    }
  }
  return (
    !_.isEmpty(authArr) ? (
      <Authorized authority={type} noMatch={false}>
        {children}
      </Authorized>
    ) : null
  );
};

export default connect(({ user }: ConnectState) => ({
  userAuthButton: user.userAuthButton,
}))(ButtonAuth);

