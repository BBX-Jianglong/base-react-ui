import { ReactElement, memo } from 'react';

type ColExProps = {
  children: ReactElement;
};
/**
 * 列コンポーネント
 */
const ColEx: React.FC<ColExProps> = memo(({ children }) => <div className="colEx">{children}</div>);
export default ColEx;
