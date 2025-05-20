// 可能のフォーマッター
export const FORMATTER_TYPE = {
  AMOUNT: 'AMOUNT', // 金額
} as const;
/**
 * フォーマッター
 * @param {value}  フォーマッター前
 * @param {formatterType}  フォーマッター種類
 * @return {string} フォーマッター後
 */
export const formatterHandler = (
  value: string,
  formatterType?: (typeof FORMATTER_TYPE)[keyof typeof FORMATTER_TYPE]
): string => {
  if (formatterType && value) {
    if (formatterType === FORMATTER_TYPE.AMOUNT) {
      const formatterTemp = parseFloat(value).toLocaleString();
      if (formatterTemp === 'NaN') {
        return '0';
      }
      return formatterTemp;
    }
  }
  return value;
};
