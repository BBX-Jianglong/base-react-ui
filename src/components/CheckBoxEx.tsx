import { ChangeEvent, memo, useRef } from 'react';
import { Controller, FieldValues, Path, PathValue, UseFormReturn } from 'react-hook-form';

import { Item } from '@/types/common.type';

type CheckBoxExProps<T extends FieldValues> = {
  form: UseFormReturn<T, unknown>;
  option: Item;
  name: Path<T>;
  disabled?: boolean;
  onChange?: (currValue: string, prevValue: string, name: Path<T>) => void;
};
/**
 * チェックボックスコンポーネント
 */
const CheckBoxEx = <T extends FieldValues>({
  form,
  option,
  name,
  disabled,
  onChange,
}: CheckBoxExProps<T>) => {
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
          const { checked, value } = e.target;
          if (onChange) {
            if (checked) {
              onChange(value, focusInValueRef.current, name);
            } else {
              onChange('', focusInValueRef.current, name);
            }
          }
          if (checked) {
            field.onChange(value as PathValue<T, Path<T>>);
          } else {
            field.onChange('' as PathValue<T, Path<T>>);
          }
        };
        /**
         * フォーカスインの処理
         */
        const onFocusHandle = () => {
          focusInValueRef.current = actualValue;
        };
        return (
          <div className="exMain">
            <div className="checkboxEx">
              <input
                className={fieldState.error?.message ? 'error' : ''}
                type="checkbox"
                {...field}
                onChange={onChangeHandle}
                checked={field.value === option.itemValue}
                onBlur={field.onBlur}
                onFocus={onFocusHandle}
                disabled={disabled}
                value={option.itemValue}
                id={field.name}
              />
              <label htmlFor={field.name}>{option.itemLabel}</label>
            </div>
            {fieldState.error?.message && (
              <div className="error_msg">{fieldState.error?.message}</div>
            )}
          </div>
        );
      }}
    />
  );
};
export default memo(
  CheckBoxEx,
  (prevProps, nextProps) =>
    prevProps.disabled === nextProps.disabled && prevProps.name === nextProps.name
) as typeof CheckBoxEx;
