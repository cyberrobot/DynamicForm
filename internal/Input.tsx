import { ChangeEvent, ElementType, Fragment, KeyboardEvent } from 'react';

import { Checkbox, Heading } from '@chakra-ui/react';
import { setDataTestId } from '@satago/utils';
import { Field } from 'formik';

import { Datepicker } from '../../Datepicker';
import { Input, NumberInput } from '../../Input';
import { Label } from '../../Label';
import Menu from '../../Menu';
import { MenuOptionProps } from '../../Menu/types';
import { Switch } from '../../Switch';
import { Textarea } from '../../Textarea';
import { useStyles } from '../styles';
import { DatepickerOptions, NumberInputOptions, FieldProps } from '../types';

export type InputProps = {
  testId?: string;
  type?: FieldProps['type'];
  validate?: (value: string) => string | undefined;
  helperMessage?: string;
  id?: string;
  name: string;
  label?: string;
  heading?: string;
  value?: string | number | boolean;
  onChange?: (
    val: string | number | boolean | Date | MenuOptionProps[]
  ) => void;
  onKeyDown?: (e: KeyboardEvent) => void;
  numberInputOptions?: NumberInputOptions;
  datepickerOptions?: DatepickerOptions;
  Container?: ElementType;
  placeholder?: string;
  isDisabled?: boolean;
  selectOptions?: {
    isMulti?: boolean;
    showSelectedItems?: boolean;
    items: { label: string; value: string }[];
  };
};

export const typeEnum = {
  TEXT: 'text',
  EMAIL: 'email',
  TEL: 'tel',
  NUMBER: 'number',
  CHECKBOX: 'checkbox',
  SWITCH: 'switch',
  DATEPICKER: 'datepicker',
  // PASSWORD: 'password',
  // SEARCH: 'search',
  TEXTAREA: 'textarea',
  SELECT: 'select',
  HEADER: 'header',
};

export function InputField({
  type,
  validate,
  id,
  name,
  testId,
  label,
  heading,
  value,
  onChange,
  onKeyDown,
  Container = Fragment,
  placeholder,
  helperMessage,
  isDisabled,
  ...rest
}: InputProps) {
  const styles = useStyles();
  const isFreeTextSingleLine =
    type === typeEnum.TEXT || type === typeEnum.EMAIL || type === typeEnum.TEL;
  // type === typeEnum.PASSWORD ||
  // type === typeEnum.SEARCH;
  const isNumber = type === typeEnum.NUMBER;
  const isFreeTextMultiLine = type === typeEnum.TEXTAREA;
  const isCheckbox = type === typeEnum.CHECKBOX;
  const isSwitch = type === typeEnum.SWITCH;
  const isSelect = type === typeEnum.SELECT;
  const isDatepicker = type === typeEnum.DATEPICKER;
  const isHeader = type === typeEnum.HEADER;
  const getInputElement = () => {
    if (isFreeTextSingleLine) {
      return Input;
    }
    if (isFreeTextMultiLine) {
      return Textarea;
    }
    if (isCheckbox) {
      return Checkbox;
    }
    if (isSwitch) {
      return Switch;
    }
    if (isNumber) {
      return NumberInput;
    }
    if (isDatepicker) {
      return Datepicker;
    }
    if (isSelect) {
      return Menu;
    }
    return null;
  };
  const hasHelperMessage = () => {
    return isFreeTextMultiLine || isFreeTextSingleLine || isNumber;
  };

  const onChangeEvent = (e: ChangeEvent<HTMLInputElement>, number) => {
    if (typeof onChange === 'function') {
      if (isSwitch) {
        onChange(e.target.checked);
      } else {
        // InputNumber returns a number value as a second argument
        onChange(number || e.target?.value || '');
      }
    }
  };
  const onValueChange = (value: Date | MenuOptionProps[]) => {
    if (typeof onChange === 'function' && value) {
      onChange(value);
    }
  };

  return (
    <Container>
      {heading && (
        <Heading as="h4" sx={styles.heading} size="md">
          {heading}
        </Heading>
      )}
      {label && !isCheckbox && !isSwitch && (
        <Label
          htmlFor={isDatepicker ? `popover-trigger-${name}` : name}
          sx={styles.label}
        >
          {label}
        </Label>
      )}
      {!isCheckbox && !isHeader && (
        <Field
          as={getInputElement()}
          name={name}
          validate={validate}
          id={name}
          {...(hasHelperMessage() && {
            helperMessage: helperMessage,
          })}
          type={type}
          testId={testId}
          {...(!isSwitch && { placeholder })}
          {...(isSwitch && {
            isChecked: value,
          })}
          onChange={isDatepicker ? onValueChange : onChangeEvent}
          {...(isNumber && {
            ...rest.numberInputOptions,
            // Avoid an accidental override of the value prop
            allowMouseWheel: false,
          })}
          onKeyDown={onKeyDown}
          {...(isDatepicker && {
            ...rest.datepickerOptions,
          })}
          {...(isSelect && {
            ...rest.selectOptions,
            onOptionSelect: onValueChange,
            buttonWidth: '100%',
          })}
          isDisabled={isDisabled}
          value={value}
        />
      )}
      {isCheckbox && (
        <Field
          as={Checkbox}
          name={name}
          validate={validate}
          id={id}
          isChecked={value}
          {...setDataTestId(testId)}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            if (typeof onChange === 'function') {
              onChange(e.target.checked);
            }
          }}
        />
      )}
      {label && (isSwitch || isCheckbox) && (
        <Label htmlFor={id} style={styles.rightLabel}>
          {label}
        </Label>
      )}
    </Container>
  );
}
