import { ChangeEvent, memo, useRef } from 'react';
import { Controller, FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form';

import { Item } from '@/types/common.type';

type RadioExProps<T extends FieldValues> = {
  form: UseFormReturn<T, unknown>;
  options: Item[];
  name: Path<T>;
  prefix?: string;
  prefixLocation?: 'left' | 'top';
  disabled?: boolean;
  onChange?: (currValue: string, prevValue: string, name: Path<T>) => void;
};
/**
 * ラジオコンポーネント
 */
const RadioEx = <T extends FieldValues>({
  form,
  options,
  name,
  prefix,
  prefixLocation = 'left',
  disabled,
  onChange,
}: RadioExProps<T>) => {
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
        const onChangeHandle = (e: ChangeEvent<HTMLInputElement>) => {
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
            <div className="exBody">
              <div className="radioExGroup">
                {options.map((option, i) => (
                  <div className="radioEx" key={`${field.name}-${option.itemValue}`}>
                    <input
                      className={fieldState.error?.message ? 'error' : ''}
                      type="radio"
                      {...field}
                      onChange={onChangeHandle}
                      onBlur={field.onBlur}
                      onFocus={onFocusHandle}
                      disabled={disabled}
                      value={option.itemValue}
                      id={`${field.name}-${i}`}
                      checked={field.value === option.itemValue}
                    />
                    <label htmlFor={`${field.name}-${i}`}>{option.itemLabel}</label>
                  </div>
                ))}
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
  RadioEx,
  (prevProps, nextProps) =>
    prevProps.disabled === nextProps.disabled &&
    prevProps.name === nextProps.name &&
    JSON.stringify(prevProps.options) === JSON.stringify(nextProps.options)
) as typeof RadioEx;
