import { RefinementCtx, z } from 'zod';

const CustomIssueCode = {
  length: 'length', // 長さのチェック
  notEmpty: 'notEmpty', // 必須チェック
  eqLength: 'eqLength', // 長さの範囲チェック
  forbiddenString: 'forbiddenString', // 禁止文字チェック
} as const;
export const ZodUtil = (() => {
  // 禁止文字
  let forbiddenStringList: string[] = [];
  // マッピングオブジェクト
  let zodErrMsgs: Record<string, string> = {};
  /**
   * デフォルトエラー設定
   */
  const defaultErrorMap = (issue: z.ZodIssueOptionalMessage, ctx: z.ErrorMapCtx) => {
    const labelName = zodErrMsgs[issue.path.filter((x) => typeof x === 'string').join('.')];
    if (labelName) {
      if (issue.code === z.ZodIssueCode.custom) {
        // 必須チェック
        if (issue.params?.customCode === CustomIssueCode.notEmpty) {
          return {
            message: `${labelName}は必須項目です`,
          };
        }
        // 長さのチェック
        if (issue.params?.customCode === CustomIssueCode.length) {
          return {
            message: `${labelName}は${issue.params?.length}文字で入力してください`,
          };
        }
        // 長さの範囲チェック
        if (issue.params?.customCode === CustomIssueCode.eqLength) {
          return {
            message: `${labelName}は${issue.params?.min}桁か${issue.params?.max}桁で入力してください。`,
          };
        }
        // 禁止文字チェック
        if (issue.params?.customCode === CustomIssueCode.forbiddenString) {
          return {
            message: `${labelName}に不正な文字（禁則文字）が含まれています。不正文字を削除してください。（不正な文字：${issue.params?.forbiddenString}）`,
          };
        }
      } else if (issue.code === z.ZodIssueCode.too_small) {
        if (issue.type === 'string') {
          return {
            message: `${labelName}は必須項目です`,
          };
        }
      } else if (issue.code === z.ZodIssueCode.too_big) {
        if (issue.type === 'string') {
          return {
            message: `${labelName}は${issue.maximum}文字以上で入力してください`,
          };
        }
      }
    }
    return {
      message: ctx.defaultError,
    };
  };
  return {
    /**
     * ZodErrorMapの設定
     * @param forbiddenString 禁止文字
     */
    init: (forbiddenString?: string[]) => {
      z.setErrorMap(defaultErrorMap);
      if (forbiddenString) {
        forbiddenStringList = forbiddenString;
      }
    },
    /**
     * フォームのラベル名とプロパティ名のマッピングオブジェクトの追加
     * @param resources ラベル名とプロパティ名のマッピング
     */
    add: (resources: Record<string, string>) => {
      zodErrMsgs = { ...zodErrMsgs, ...resources };
    },
    /**
     * 長さのチェック
     * @param len 長さ
     * @param message エラーメッセージ
     * @returns refinement: (arg: Output, ctx: RefinementCtx) => void
     */
    length: (len: number, message?: string) => (val: string, ctx: RefinementCtx) => {
      if (val && val.length !== len) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: { customCode: CustomIssueCode.length, length: len },
          message,
        });
      }
    },
    /**
     * 必須チェック
     * @param message エラーメッセージ
     * @returns refinement: (arg: Output, ctx: RefinementCtx) => void
     */
    notEmpty: (message?: string) => (val: string, ctx: RefinementCtx) => {
      if (!val) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: { customCode: CustomIssueCode.notEmpty },
          message,
        });
      }
    },
    /**
     * 長さの範囲チェック
     * @param min 最小長さ
     * @param max 最大長さ
     * @param message エラーメッセージ
     * @returns refinement: (arg: Output, ctx: RefinementCtx) => void
     */
    eqLength: (min: number, max: number, message?: string) => (val: string, ctx: RefinementCtx) => {
      if (val && (val.length < min || val.length > max)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          params: { customCode: CustomIssueCode.eqLength, min, max },
          message,
        });
      }
    },
    /**
     * 禁止文字チェック
     * @param message エラーメッセージ
     * @returns refinement: (arg: Output, ctx: RefinementCtx) => void
     */
    forbiddenString: (message?: string) => (val: string, ctx: RefinementCtx) => {
      if (val) {
        const forbiddenStringListTemp = forbiddenStringList.filter((forbiddenString) =>
          val.includes(forbiddenString)
        );
        if (forbiddenStringListTemp && forbiddenStringListTemp.length > 0) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            params: {
              customCode: CustomIssueCode.forbiddenString,
              forbiddenString: forbiddenStringListTemp.join('、'),
            },
            message,
          });
        }
      }
    },
  };
})();
