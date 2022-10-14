import { Badge, Tabs } from 'antd';
import { ReactNode } from 'react';

const tabStyle = {
  padding: '0 1ch',
}

const { TabPane } = Tabs;
type BadgedTabValue = {
  title: string;
  badgeContent: ReactNode;
  disabled?: boolean;
};
type BadgedTabsProps = {
  value: BadgedTabValue[];
  onChange: (key: string) => unknown;
};

export default function BadgedTabs({ value, onChange }: BadgedTabsProps) {
  return (
    <Tabs onChange={onChange}>
      {value.map((tab) => (
        <TabPane
          key={tab.title}
          tab={<Badge size="small" offset={[0,-2]} count={tab.badgeContent}><span style={tabStyle}>{tab.title}</span></Badge>}
          disabled={tab.disabled}
        />
      ))}
    </Tabs>
  );
}
