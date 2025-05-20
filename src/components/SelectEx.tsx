import { ChangeEvent, memo, useRef } from 'react';
import { Controller, FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form';

import { Item } from '@/types/common.type';

type SelectExProps<T extends FieldValues> = {
  form: UseFormReturn<T, unknown>;
  options: Item[];
  name: Path<T>;
  size?: 'sm' | 'med' | 'lg';
  prefix?: string;
  prefixLocation?: 'left' | 'top';
  disabled?: boolean;
  onChange?: (currValue: string, prevValue: string, name: Path<T>) => void;
};
/**
 * 選択（プルダウン）コンポーネント
 */
const SelectEx = <T extends FieldValues>({
  form,
  options,
  name,
  size = 'med',
  prefix,
  prefixLocation = 'left',
  disabled,
  onChange,
}: SelectExProps<T>) => {
  // フォーカスイン時の値
  const focusInValueRef = useRef<string>('');
  const { control } = form;
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const actualValue = field.value as string;
        /**
         * 変更時の処理
         */
        const onChangeHandle = (e: ChangeEvent<HTMLSelectElement>) => {
          const { value } = e.target;
          if (onChange) {
            onChange(value, focusInValueRef.current, name);
          }
          field.onChange(value as PathValue<T, Path<T>>);
        };
        /**
         * フォーカスインの処理
         */
        const onFocusHandle = () => {
          focusInValueRef.current = actualValue;
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
                <select
                  className={fieldState.error?.message ? 'selectEx error' : 'selectEx'}
                  {...field}
                  onChange={onChangeHandle}
                  onBlur={field.onBlur}
                  onFocus={onFocusHandle}
                  disabled={disabled}
                >
                  <option value="">選択してください</option>
                  {options.map((option) => (
                    <option value={option.itemValue} key={option.itemValue}>
                      {option.itemLabel}
                    </option>
                  ))}
                </select>
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
  SelectEx,
  (prevProps, nextProps) =>
    prevProps.disabled === nextProps.disabled &&
    prevProps.name === nextProps.name &&
    JSON.stringify(prevProps.options) === JSON.stringify(nextProps.options)
) as typeof SelectEx;
