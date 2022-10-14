import { MenuDataItem, getMenuData, getPageTitle } from "@ant-design/pro-layout";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { useIntl, ConnectProps, connect } from "umi";
import React from "react";
import SelectLang from "@/components/SelectLang";
import { ConnectState } from "@/models/connect";
import ProgressiveImg from "../components/ProgressiveImg";
import styles from "./UserLayout.less";

export interface UserLayoutProps extends Partial<ConnectProps> {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
}

const UserLayout: React.FC<UserLayoutProps> = (props) => {
  const {
    route = {
      routes: []
    }
  } = props;
  const { routes = [] } = route;
  const {
    children,
    location = {
      pathname: ""
    }
  } = props;
  const {} = useIntl();
  const { breadcrumb } = getMenuData(routes);
  const title = getPageTitle({
    pathname: location.pathname,
    breadcrumb,
    ...props
  });
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container}>
        <ProgressiveImg
          className={styles.imageBox}
          src="https://img.hzanchu.com/acimg/f06114e082502b789981b62b07fee7de.png"
          placeholderSrc={require("@/assets/pre_bg.png")}
          style={{
            width: "100vw",
            height: "100vh"
          }}
        />
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </HelmetProvider>
  );
};

export default connect(({ settings }: ConnectState) => ({ ...settings }))(UserLayout);
