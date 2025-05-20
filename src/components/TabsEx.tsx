import React, { ReactElement, memo, useState } from 'react';

type TabsExProps = {
  defaultActiveKey: string;
  children: ReactElement;
};
/**
 * 行コンポーネント
 */
const TabsEx: React.FC<TabsExProps> = memo(
  ({ defaultActiveKey, children }) => {
    const [activeKey, setActiveKey] = useState<string>(defaultActiveKey);
    const childrenCreate = React.Children.map(children, (item: ReactElement) => {
      if (activeKey === item.props.id) {
        return React.cloneElement(item);
      }
      return null;
    });
    return (
      <>
        <div
          aria-hidden="true"
          onClick={() => {
            setActiveKey('1');
          }}
        >
          1
        </div>
        <div
          aria-hidden="true"
          onClick={() => {
            setActiveKey('2');
          }}
        >
          2
        </div>
        <div>{childrenCreate}</div>
      </>
    );
  },
  (prevProps, nextProps) => prevProps.defaultActiveKey === nextProps.defaultActiveKey
);
export default TabsEx;
