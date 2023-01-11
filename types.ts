import { ElementType } from 'react';

import { FormikHelpers, FormikValues } from 'formik';

import { CSSProps } from '../../types';
import { CalendarOptions } from '../Datepicker';
import { FeedbackProps as FeedbackComponentProps } from '../Feedback';
import { NumberInputProps } from '../Input/types';
import { MenuOptionProps } from '../Menu/types';

export type NumberInputOptions = Pick<
  NumberInputProps,
  | 'precision'
  | 'step'
  | 'min'
  | 'max'
  | 'pattern'
  | 'prefix'
  | 'suffix'
  | 'isStepperVisible'
>;

export type DatepickerOptions = CalendarOptions;

export type FieldProps = {
  id?: string; // Must be unique
  label?: string;
  name: string;
  heading?: string;
  type?:
    | 'text'
    | 'email'
    | 'tel'
    | 'number'
    | 'checkbox'
    | 'switch'
    | 'textarea'
    | 'select'
    | 'datepicker'
    | 'header';
  disabled?: boolean;
  required?: boolean;
  helperMessage?: string;
  validate?: (
    value: string | boolean | number | MenuOptionProps[]
  ) => string | undefined;
  numberInputOptions?: NumberInputOptions;
  datepickerOptions?: DatepickerOptions;
  Container?: ElementType;
  testId?: string;
  placeholder?: string;
  onChange?: (
    value: string | number | boolean | Date | MenuOptionProps[]
  ) => void;
  selectOptions?: {
    items: MenuOptionProps[];
    initialValue?: MenuOptionProps[];
    showSelectedItems?: boolean;
  };
  sx?: CSSProps;
  value?: string | number | boolean | Date | MenuOptionProps[];
};

export type ActionProps = {
  title: string;
  type?: 'button' | 'submit';
  onClick?: () => void;
  loadingText?: string;
  label?: string;
  disabled?: boolean;
  testId?: string;
};

export type FeedbackProps = Partial<
  Record<
    FeedbackComponentProps['type'],
    Omit<FeedbackComponentProps, 'type'> & {
      isVisible?: boolean;
    }
  >
>;

export type DynamicFormProps<T> = {
  testId?: string;
  label?: string;
  style?: CSSProps;
  initialValues: T;
  onSubmit?: (values: T, actions: FormikHelpers<FormikValues>) => void;
  fields?: Array<FieldProps | FieldProps[]>;
  actions?: ActionProps[];
  feedback?: FeedbackProps;
};
