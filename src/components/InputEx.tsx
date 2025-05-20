/* eslint-disable react-hooks/exhaustive-deps */
import { ChangeEvent, SyntheticEvent, memo, useEffect, useRef } from 'react';
import { UseFormReturn, Controller, FieldValues, Path, PathValue, useWatch } from 'react-hook-form';

import { CHARACTER_TYPE, getRegularExpressionNotMatched } from '@/utils/RegularExpressionUtil';
import { FORMATTER_TYPE, formatterHandler } from '@/utils/FormatterUtil';

type InputExProps<T extends FieldValues> = {
  form: UseFormReturn<T, unknown>;
  name: Path<T>;
  size?: 'sm' | 'med' | 'lg';
  prefix?: string;
  prefixLocation?: 'left' | 'top';
  placeholder?: string;
  maxLength?: number;
  disabled?: boolean;
  formatterType?: (typeof FORMATTER_TYPE)[keyof typeof FORMATTER_TYPE];
  characterTypes?: (typeof CHARACTER_TYPE)[keyof typeof CHARACTER_TYPE][];
  halfToFull?: boolean;
  onChange?: (currValue: string, prevValue: string, name: Path<T>) => void;
  onBlur?: (currValue: string, prevValue: string, name: Path<T>) => void;
};
/**
 * 入力コンポーネント
 */
const InputEx = <T extends FieldValues>({
  form,
  name,
  size = 'med',
  prefix,
  prefixLocation = 'left',
  placeholder,
  maxLength,
  disabled,
  formatterType,
  characterTypes,
  halfToFull,
  onChange,
  onBlur,
}: InputExProps<T>) => {
  const {
    control, // フォーム要素を管理するためのオブジェクト
    getFieldState,
    trigger,
  } = form;
  // フォーカスイン時の値
  const focusInValueRef = useRef<string>('');
  // 文字種
  const characterType = useRef<number>(
    // eslint-disable-next-line no-bitwise
    characterTypes ? characterTypes.reduce((acc, curr) => acc | curr, 0) : CHARACTER_TYPE.ALL
  );
  // 合成イベント変数
  const compositionRef = useRef<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const watchValue = useWatch({ control, name });
  useEffect(() => {
    if (getFieldState(name).isTouched && inputRef.current !== document.activeElement) {
      void trigger(name);
    }
  }, [watchValue]);
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const actualValue = field.value as string;
        /**
         * 文字種チェック処理（指定された文字種以外を取り除く）
         */
        const characterCheck = (value: string): string => {
          let valueTemp = value;
          if (halfToFull) {
            valueTemp = value
              // 全角数字(０～９)
              .replace(/[\uFF10-\uFF19]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
              // 全角英字(ａ～ｚ、Ａ～Ｚ)
              .replace(/[\uFF21-\uFF3A\uFF41-\uFF5A]/g, (c) =>
                String.fromCharCode(c.charCodeAt(0) - 0xfee0)
              )
              // 全角スペース
              .replace(/[\u3000]/g, ' ');
          }
          const regexNotInCharacterSet = new RegExp(
            getRegularExpressionNotMatched(characterType.current),
            'g'
          );
          return valueTemp.replace(regexNotInCharacterSet, '');
        };
        /**
         * 変更時の処理
         */
        const onChangeHandle = (e: ChangeEvent<HTMLInputElement>) => {
          let { value } = e.target;
          if (!compositionRef.current) {
            value = characterCheck(value);
            if (onChange) {
              onChange(value, focusInValueRef.current, name);
            }
          }
          field.onChange(value as PathValue<T, Path<T>>);
        };
        /**
         * フォーカスアウトの処理
         */
        const onBlurHandle = (e: ChangeEvent<HTMLInputElement>) => {
          let { value } = e.target;
          value = characterCheck(value);
          if (onBlur) {
            onBlur(value, focusInValueRef.current, name);
          }
          field.onBlur();
          if (inputRef.current) {
            inputRef.current.value = formatterHandler(value, formatterType);
          }
        };
        /**
         * フォーカスインの処理
         */
        const onFocusHandle = () => {
          focusInValueRef.current = actualValue;
          if (inputRef.current) {
            inputRef.current.value = actualValue;
          }
        };
        /**
         * 合成イベント
         */
        const handleComposition = (e: SyntheticEvent) => {
          if (e.type === 'compositionend') {
            compositionRef.current = false;
          } else {
            compositionRef.current = true;
          }
        };
        /**
         * 表示値の取得
         */
        const getDisplayValue = (): string => {
          if (inputRef.current !== document.activeElement) {
            if (actualValue) {
              return formatterHandler(actualValue, formatterType);
            }
          }
          return actualValue;
        };
        return (
          <div className={prefixLocation === 'left' ? 'exMainLeft' : 'exMainTop'}>
            {prefix && (
              <div className={prefixLocation === 'left' ? 'prefixLeft' : 'prefixTop'}>{prefix}</div>
            )}
            <div
              className={
                // eslint-disable-next-line no-nested-ternary
                size === 'sm'
                  ? 'exBody exBodySm'
                  : size === 'med'
                  ? 'exBody exBodyMed'
                  : 'exBody exBodyLg'
              }
            >
              <div className="exContainer">
                <input
                  className={fieldState.error?.message ? 'inputEx error' : 'inputEx'}
                  {...field}
                  type="text"
                  autoComplete="off"
                  onChange={onChangeHandle}
                  onBlur={onBlurHandle}
                  onCompositionStart={handleComposition}
                  onCompositionEnd={handleComposition}
                  onFocus={onFocusHandle}
                  disabled={disabled}
                  maxLength={maxLength}
                  value={getDisplayValue()}
                  ref={inputRef}
                  placeholder={placeholder}
                />
                {field.value && (
                  <div
                    className="clear"
                    aria-hidden="true"
                    onMouseDown={(e) => {
                      e.preventDefault();
                    }}
                    onClick={() => {
                      if (onChange) {
                        onChange('', focusInValueRef.current, name);
                      }
                      field.onChange('' as PathValue<T, Path<T>>);
                      inputRef.current?.focus();
                    }}
                  />
                )}
              </div>
              {fieldState.error?.message && (
                <div className="error_msg">{fieldState.error?.message}</div>
              )}
            </div>
          </div>
        );
      }}
    />
  );
};

export default memo(
  InputEx,
  (prevProps, nextProps) =>
    prevProps.form === nextProps.form &&
    prevProps.name === nextProps.name &&
    prevProps.disabled === nextProps.disabled &&
    JSON.stringify(prevProps.characterTypes) === JSON.stringify(nextProps.characterTypes)
) as typeof InputEx;
