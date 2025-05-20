import { ReactElement, memo } from 'react';

type RowExProps = {
  children: ReactElement;
};
/**
 * 行コンポーネント
 */
const RowEx: React.FC<RowExProps> = memo(({ children }) => <div className="rowEx">{children}</div>);
export default RowEx;
