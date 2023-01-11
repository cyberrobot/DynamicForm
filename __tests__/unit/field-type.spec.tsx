import { within } from '@storybook/testing-library';
import { screen } from '@testing-library/react';
import { format, parse } from 'date-fns';

import {
  getInitialValuesDefault,
  getInitialValuesFilled,
  getInputType,
  setupRender,
} from '../../helpers/testing';
import { typeEnum } from '../../internal/Input';
import { FieldProps } from '../../types';

describe('Field type', () => {
  beforeEach(() => {
    window['E2E'] = true;
  });

  const testId = 'dynamic-form-test-id';
  const freetypeType = Object.values(getInputType().freetype);
  const toggleType = Object.values(getInputType().toggle);
  const datepickerType = Object.values(getInputType().datepicker);

  it.each([...freetypeType, ...toggleType, ...datepickerType])(
    'should render a %s type field',
    (type: FieldProps['type']) => {
      const fields: FieldProps[] = [
        {
          id: `${type}Field`,
          label: 'Field',
          name: type,
          type: type,
        },
      ];
      const initialValues = getInitialValuesDefault();
      setupRender({
        initialValues: { [type]: initialValues[type] },
        fields: fields,
        testId: testId,
      });

      if (type === typeEnum.DATEPICKER) {
        expect(
          screen.getByTestId(`${testId}--${type}-field--input`)
        ).toBeInTheDocument();
      } else {
        expect(
          screen.getByTestId(`${testId}--${type}-field`)
        ).toBeInTheDocument();
      }

      if (
        type !== typeEnum.NUMBER &&
        type !== typeEnum.CHECKBOX &&
        type !== typeEnum.SWITCH &&
        type !== typeEnum.DATEPICKER
      ) {
        expect(screen.getByTestId(`${testId}--${type}-field`)).toHaveAttribute(
          'type',
          type
        );
      }
    }
  );

  it.each([...freetypeType, ...toggleType, ...datepickerType])(
    'should render a %s type field default value',
    (type: FieldProps['type']) => {
      const fields: FieldProps[] = [
        {
          id: type,
          label: 'Field',
          name: type,
          type: type,
        },
      ];
      const initialValues = getInitialValuesFilled();
      setupRender({
        initialValues: { [type]: initialValues[type] },
        fields: fields,
        testId: testId,
      });

      if (type !== typeEnum.CHECKBOX && type !== typeEnum.SWITCH) {
        if (type === typeEnum.DATEPICKER) {
          expect(
            screen.getByTestId(`${testId}--${type}-field--input`)
          ).toHaveValue(format(initialValues[type] as Date, 'dd/MM/yyyy'));
        } else {
          expect(screen.getByTestId(`${testId}--${type}-field`)).toHaveValue(
            initialValues[type] as string
          );
        }
      } else {
        // data-testid is added to the parent element instead of the input element
        expect(screen.getByLabelText(fields[0].label)).toBeChecked();
      }
    }
  );

  it.each([...freetypeType, ...toggleType, ...datepickerType])(
    'should render a %s type field in a container',
    (type: FieldProps['type']) => {
      const fields: FieldProps[] = [
        {
          id: type,
          label: 'Field',
          name: type,
          type: type,
          Container: ({ children }) => (
            <div data-testid={`${type}--container`}>{children}</div>
          ),
        },
      ];
      const initialValues = getInitialValuesDefault();
      setupRender({
        initialValues: { [type]: initialValues[type] },
        fields: fields,
        testId: testId,
      });

      expect(screen.getByTestId(`${type}--container`)).toBeInTheDocument();
      if (type === typeEnum.DATEPICKER) {
        expect(
          screen.getByTestId(`${testId}--${type}-field--input`)
        ).toBeInTheDocument();
      } else {
        expect(
          within(screen.getByTestId(`${type}--container`)).getByTestId(
            `${testId}--${type}-field`
          )
        ).toBeInTheDocument();
      }
    }
  );
});
