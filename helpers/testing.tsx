import { render, queries } from '@testing-library/react';

import { DynamicForm } from '../DynamicForm';
import { typeEnum } from '../internal/Input';
import { ActionProps, DynamicFormProps, FieldProps } from '../types';

export const _fields: FieldProps[] = [
  {
    id: 'textField',
    label: 'Text Field',
    name: 'textField',
    type: 'text',
  },
  {
    id: 'emailField',
    label: 'Email Field',
    name: 'emailField',
    type: 'email',
  },
];
export const _actions: ActionProps[] = [
  {
    title: 'Cancel',
    type: 'button',
  },
  {
    title: 'Submit',
    type: 'submit',
    label: 'Submit',
  },
];
const setupRender = <T,>({
  fields = _fields,
  testId = 'dynamic-form-test-id',
  label = 'Test label',
  actions = _actions,
  onSubmit,
  initialValues = fields
    .map((field: FieldProps) => field.name)
    .reduce((acc, curr) => ((acc[curr] = ''), acc), {}) as T,
  feedback,
}: Partial<DynamicFormProps<T>> & {
  testId?: string;
  label?: string;
}) => {
  return render(
    <DynamicForm<T>
      fields={fields}
      actions={actions}
      testId={testId}
      label={label}
      onSubmit={onSubmit}
      initialValues={initialValues}
      feedback={feedback}
    />,
    { queries }
  );
};

export const getInitialValuesDefault = () => ({
  text: '',
  email: '',
  tel: '',
  number: '',
  checkbox: false,
  switch: false,
  textarea: '',
  datepicker: '',
  select: [],
});

export const getInitialValuesFilled = () => ({
  text: 'Some text',
  email: 'testemail@satago.com',
  tel: '07745678965',
  number: '456.00',
  checkbox: true,
  switch: true,
  textarea: 'This is a long string. Could be multiline.',
  datepicker: new Date(2022, 0, 1),
  select: [{ value: 'a-value', label: 'a-label' }],
});

export const getInputType = () => {
  const { CHECKBOX, SWITCH, DATEPICKER, SELECT, HEADER, ...rest } = typeEnum;
  return {
    freetype: rest,
    toggle: { CHECKBOX, SWITCH },
    datepicker: { DATEPICKER },
    select: { SELECT },
  };
};
export const getSelectOptions = (type) => {
  if (type === 'select') {
    return {
      selectOptions: {
        items: [
          {
            label: 'option1-label',
            value: 'option1',
          },
          {
            label: 'option2-label',
            value: 'option2',
          },
        ],
      },
    };
  }
  return {};
};

export * from '@testing-library/react';
export { setupRender };
