import { waitFor } from '@storybook/testing-library';
import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

import {
  getSelectOptions,
  getInitialValuesDefault,
  getInitialValuesFilled,
  getInputType,
  setupRender,
} from '../../helpers/testing';
import { typeEnum } from '../../internal/Input';
import { FieldProps } from '../../types';

describe('fields', () => {
  beforeEach(() => {
    window['E2E'] = true;
  });
  const testId = 'dynamic-form-test-id';
  const freetypeType = Object.values(getInputType().freetype);
  const toggleType = Object.values(getInputType().toggle);
  const datepickerType = Object.values(getInputType().datepicker);
  const selectType = Object.values(getInputType().select);

  it.each([...freetypeType, ...toggleType, ...datepickerType])(
    'should render a %s field label',
    (type: FieldProps['type']) => {
      const fields: FieldProps[] = [
        {
          id: type,
          name: type,
          type: type,
          label: type + ' Field',
        },
      ];
      const initialValues = getInitialValuesDefault();
      setupRender({
        initialValues: { [type]: initialValues[type] },
        fields: fields,
        testId: testId,
      });
      expect(screen.getByLabelText(fields[0].label)).toBeInTheDocument();
    }
  );

  it.each([...freetypeType, ...toggleType, ...datepickerType, ...selectType])(
    'should render a %s field heading',
    (type: FieldProps['type']) => {
      const fields: FieldProps[] = [
        {
          id: type,
          name: type,
          type: type,
          heading: type + ' Field Heading',
          ...getSelectOptions(type),
        },
      ];
      const initialValues = getInitialValuesDefault();
      setupRender({
        initialValues: { [type]: initialValues[type] },
        fields: fields,
        testId: testId,
      });
      expect(screen.getByText(fields[0].heading)).toBeInTheDocument();
    }
  );

  it.each([...freetypeType, ...toggleType])(
    'should not render a %s field label',
    (type: FieldProps['type']) => {
      // label prop is not passed to the field
      const fields: FieldProps[] = [
        {
          id: type,
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
      expect(document.getElementsByTagName('label')).toHaveLength(
        // Checkbox and switch components are wrapped in a label so the label is rendered anyway
        type === 'checkbox' || type === 'switch' ? 1 : 0
      );
    }
  );

  it.each(freetypeType)(
    'should render helper message if helperMessage prop is passed',
    (type: FieldProps['type']) => {
      const fields: FieldProps[] = [
        {
          id: type,
          name: type,
          type: type,
          label: type + ' Field',
          helperMessage: `${type} required`,
        },
      ];
      const initialValues = getInitialValuesDefault();
      setupRender({
        initialValues: { [type]: initialValues[type] },
        fields: fields,
        testId: testId,
      });
      const helperMessage = screen.getByTestId(
        `${testId}--${fields[0].type}-field-helper-message`
      );
      expect(helperMessage).toBeInTheDocument();
      expect(helperMessage).toHaveTextContent(fields[0].helperMessage);
    }
  );

  it.each(freetypeType)(
    'should not render helper message if helperMessage prop is not passed',
    (type: FieldProps['type']) => {
      const fields: FieldProps[] = [
        {
          id: type,
          name: type,
          type: type,
          label: type + ' Field',
        },
      ];
      const initialValues = getInitialValuesDefault();
      setupRender({
        initialValues: { [type]: initialValues[type] },
        fields: fields,
        testId: testId,
      });
      expect(
        screen.queryByTestId(
          `${testId}--${fields[0].type}-field-helper-message`
        )
      ).toBeNull();
    }
  );

  it.each([...freetypeType, ...toggleType, ...datepickerType])(
    'should disable a %s field if disabled prop is passed',
    (type: FieldProps['type']) => {
      const fields: FieldProps[] = [
        {
          id: type,
          label: 'Disabled Field',
          name: type,
          type: type,
          disabled: true,
        },
      ];
      const initialValues = getInitialValuesDefault();
      setupRender({
        initialValues: { [type]: initialValues[type] },
        fields: fields,
        testId: testId,
      });
      expect(screen.getByLabelText(fields[0].label)).toBeDisabled();
    }
  );

  it.each([...freetypeType, ...toggleType, ...datepickerType])(
    'should not disable a %s field if disabled prop is not passed',
    (type: FieldProps['type']) => {
      const fields: FieldProps[] = [
        {
          id: type,
          label: 'Disabled Field',
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
      expect(screen.getByLabelText(fields[0].label)).not.toBeDisabled();
    }
  );

  // Required field tests
  it.each([...freetypeType, ...toggleType, ...datepickerType])(
    'should render a %s required field',
    (type: FieldProps['type']) => {
      const fields: FieldProps[] = [
        {
          id: type,
          label: 'Required Field',
          name: type,
          type: type,
          required: true,
        },
      ];
      const initialValues = getInitialValuesDefault();
      setupRender({
        initialValues: { [type]: initialValues[type] },
        fields: fields,
        testId: testId,
      });
      const regex = new RegExp(fields[0].label + ' *', 'i');
      expect(screen.getByLabelText(regex)).toBeRequired();
    }
  );

  it.each([...freetypeType, ...toggleType, ...datepickerType])(
    'should not render a %s required field',
    (type: FieldProps['type']) => {
      const fields: FieldProps[] = [
        {
          id: type,
          label: 'Required Field',
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
      expect(screen.getByLabelText(fields[0].label)).not.toBeRequired();
    }
  );

  it.each(freetypeType)(
    'should render a %s field with a placeholder',
    (type: FieldProps['type']) => {
      const fields: FieldProps[] = [
        {
          id: type,
          label: 'Placeholder Field',
          name: type,
          type: type,
          placeholder: 'Placeholder',
        },
      ];
      const initialValues = getInitialValuesDefault();
      setupRender({
        initialValues: { [type]: initialValues[type] },
        fields: fields,
        testId: testId,
      });
      expect(screen.getByPlaceholderText('Placeholder')).toBeInTheDocument();
    }
  );

  it.each([...freetypeType, ...toggleType, ...datepickerType])(
    'should fire onChange event for a %s field',
    async (type: FieldProps['type']) => {
      const onChange = jest.fn();
      const fields: FieldProps[] = [
        {
          id: type,
          label: 'Required Field',
          name: type,
          type: type,
          onChange,
        },
      ];
      const initialValues = getInitialValuesDefault();
      setupRender({
        initialValues: { [type]: initialValues[type] },
        fields: fields,
        testId: testId,
      });
      if (type !== typeEnum.CHECKBOX && type !== typeEnum.SWITCH) {
        if (type === typeEnum.DATEPICKER) {
          const input = screen.getByLabelText(fields[0].label);
          fireEvent.click(input);
          const day = await screen.findByText('11');
          fireEvent.click(day);
        } else {
          fireEvent.change(screen.getByLabelText(fields[0].label), {
            target: { value: getInitialValuesFilled()[type] },
          });
        }
      } else {
        fireEvent.click(screen.getByLabelText(fields[0].label));
      }

      await waitFor(() => {
        expect(onChange).toHaveBeenCalled();
      });
    }
  );

  it('should render multiple fields in one line', () => {
    const fields: FieldProps[][] = [
      [1, 2].map((value) => ({
        id: `input${value}`,
        name: `input${value}`,
        label: `input${value}`,
        type: 'text',
      })),
    ];
    setupRender({
      fields,
      testId,
    });
    expect(screen.getByLabelText(fields[0][0].label)).toBeInTheDocument();
    expect(screen.getByLabelText(fields[0][1].label)).toBeInTheDocument();
  });

  describe('field type: select', () => {
    it('should render options and fire onchange', async () => {
      const type = 'select';
      const onChange = jest.fn();
      const fields: FieldProps[] = [
        {
          id: type,
          label: 'Required Field',
          name: type,
          type,
          onChange,
          ...getSelectOptions(type),
        },
      ];
      const initialValues = getInitialValuesDefault();
      setupRender({
        initialValues: { [type]: initialValues[type] },
        fields: fields,
        testId: testId,
      });
      const user = userEvent.setup();
      await act(async () => {
        await user.click(screen.getByText('Select an option').parentElement);
        expect(screen.getByText('option1-label')).toBeInTheDocument();
        expect(screen.getByText('option2-label')).toBeInTheDocument();
        await user.click(screen.getByText('option2-label'));
      });
      expect(onChange).toHaveBeenCalledWith([fields[0].selectOptions.items[1]]);
    });
  });
});
