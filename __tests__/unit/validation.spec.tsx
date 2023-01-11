import { fireEvent, screen, waitFor } from '@testing-library/react';
import lodashIsArray from 'lodash/isArray';

import {
  getSelectOptions,
  getInitialValuesDefault,
  getInitialValuesFilled,
  getInputType,
  setupRender,
} from '../../helpers/testing';
import { FieldProps } from '../../types';

describe('validation', () => {
  beforeEach(() => {
    window['E2E'] = true;
  });

  const initialValues = getInitialValuesDefault();
  const freetypeType = Object.values(getInputType().freetype);
  const toggleType = Object.values(getInputType().toggle);
  const datepickerType = Object.values(getInputType().datepicker);
  const selectType = Object.values(getInputType().select);

  it.each([...freetypeType, ...datepickerType])(
    'should show error message on %s field blur',
    async (type: FieldProps['type']) => {
      const errorMessage = `${type} is required`;
      const fields: FieldProps[] = [
        {
          id: `${type}Field`,
          label: 'Field',
          name: `${type}`,
          type: type,
          validate: (value) => {
            if (value === '') {
              return errorMessage;
            }
          },
        },
      ];

      setupRender({
        initialValues: { [type]: initialValues[type] },
        fields: fields,
      });
      const label = screen.getByLabelText(fields[0].label);
      fireEvent.focus(label);
      fireEvent.blur(label);
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    }
  );

  it.each([...freetypeType, ...datepickerType])(
    'should show error message for %s field on submit',
    async (type: FieldProps['type']) => {
      const errorMessage = `${type} is required`;
      const fields: FieldProps[] = [
        {
          id: `${type}Field`,
          label: 'Field',
          name: `${type}`,
          type: type,
          validate: (value) => {
            if (value === '') {
              return errorMessage;
            }
          },
        },
      ];
      setupRender({
        initialValues: { [type]: initialValues[type] },
        fields: fields,
      });
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    }
  );

  it.each(toggleType)(
    'should show error message %s field on submit',
    async (type: FieldProps['type']) => {
      const errorMessage = `${type} is required`;
      const fields: FieldProps[] = [
        {
          id: type,
          label: 'Field',
          name: type,
          type: type,
          validate: (value) => {
            if (!value) {
              return errorMessage;
            }
          },
        },
      ];
      setupRender({
        initialValues: { [type]: initialValues[type] },
        fields: fields,
      });
      // fireEvent.click(screen.getByLabelText(fields[0].label));
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    }
  );

  it.each(selectType)(
    'should show error message %s field on submit',
    async (type: FieldProps['type']) => {
      const errorMessage = `Select at least one item`;
      const fields: FieldProps[] = [
        {
          id: type,
          label: 'Field',
          name: type,
          type: type,
          validate: (value) => {
            if (lodashIsArray(value) && !value.length) {
              return errorMessage;
            }
          },
          ...getSelectOptions(type),
        },
      ];
      setupRender({
        initialValues: { [type]: initialValues[type] },
        fields: fields,
      });
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    }
  );

  it.each([...freetypeType, ...datepickerType])(
    'should not show error message %s field on submit',
    async (type: FieldProps['type']) => {
      const errorMessage = `${type} is required`;
      const fields: FieldProps[] = [
        {
          id: `${type}Field`,
          label: 'Field',
          name: `${type}`,
          type: type,
          validate: (value) => {
            if (value === '') {
              return errorMessage;
            }
          },
        },
      ];
      setupRender({
        initialValues: { [type]: initialValues[type] },
        fields: fields,
      });
      if (type === 'datepicker') {
        fireEvent.click(screen.getByLabelText(fields[0].label));
        fireEvent.click(screen.getByText('11'));
      } else {
        fireEvent.change(screen.getByLabelText(fields[0].label), {
          target: { value: getInitialValuesFilled()[type] },
        });
      }
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
      await waitFor(() => {
        expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
      });
    }
  );

  it.each(toggleType)(
    'should not show error message %s field on submit',
    async (type: FieldProps['type']) => {
      const errorMessage = `${type} is required`;
      const fields: FieldProps[] = [
        {
          id: type,
          label: type + 'Field',
          name: type,
          type: type,
          validate: (value) => {
            if (!value) {
              return errorMessage;
            }
          },
        },
      ];
      setupRender({
        initialValues: { [type]: initialValues[type] },
        fields: fields,
      });
      fireEvent.click(screen.getByLabelText(fields[0].label));
      fireEvent.click(screen.getByRole('button', { name: 'Submit' }));
      await waitFor(() => {
        expect(screen.queryByText(errorMessage)).not.toBeInTheDocument();
      });
    }
  );
});
