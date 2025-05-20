import { memo } from 'react';

type ButtonExProps = {
  displayName: string;
  width?: string;
  height?: string;
  color?: 'black' | 'blue' | 'yellow';
  disabled?: boolean;
  onClick?: () => void;
};
/**
 * ボタンコンポーネント
 */
const ButtonEx: React.FC<ButtonExProps> = memo(
  ({ displayName, width, height = '48px', disabled = false, onClick, color = 'yellow' }) => (
    <button
      onClick={onClick}
      type="button"
      disabled={disabled}
      className={
        // eslint-disable-next-line no-nested-ternary
        color === 'black'
          ? 'buttonEx buttonExBlack'
          : color === 'blue'
          ? 'buttonEx buttonExBlue'
          : 'buttonEx buttonExYellow'
      }
      style={disabled ? { opacity: 0.38, cursor: 'not-allowed', width, height } : { width, height }}
    >
      {displayName}
    </button>
  ),
  (prevProps, nextProps) => prevProps.disabled === nextProps.disabled
);
export default ButtonEx;
