import {
  FormControl as ChackraFormControl,
  FormErrorMessage,
} from '@chakra-ui/react';
import { setDataTestId } from '@satago/utils';
import { FormikValues } from 'formik';

import { useStyles } from '../styles';
import { FieldProps } from '../types';
import { InputField, typeEnum } from './Input';

export const FormControl = ({
  testId = 'dynamic-form',
  fieldProps: {
    name,
    id,
    type,
    label,
    heading,
    disabled,
    required,
    helperMessage,
    validate,
    numberInputOptions,
    datepickerOptions,
    selectOptions,
    Container,
    testId: fieldTestId,
    onChange: onFieldChange,
    placeholder,
    sx,
    value,
  },
  formProps: { errors, touched, setFieldValue, values, submitForm },
}: {
  testId: string;
  fieldProps: FieldProps;
  formProps: FormikValues;
}) => {
  const styles = useStyles();
  return (
    <ChackraFormControl
      key={id}
      isInvalid={!!errors[name] && !!touched[name]}
      isRequired={required}
      isDisabled={disabled}
      {...setDataTestId(`${testId}--form-control`)}
      sx={{
        ...(sx || styles.formControl),
        ...((type === typeEnum.CHECKBOX || type === typeEnum.SWITCH) &&
          styles.formControlRightLabel),
        ...(type === typeEnum.HEADER && styles.formHeader),
      }}
    >
      <InputField
        name={name}
        validate={validate}
        id={id}
        type={type}
        testId={fieldTestId ? fieldTestId : `${testId}--${name}-field`}
        helperMessage={helperMessage}
        label={label}
        heading={heading}
        value={value || values[name]}
        Container={Container}
        onChange={(val) => {
          setFieldValue(name, val);
          onFieldChange && onFieldChange(val);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            submitForm();
          }
        }}
        placeholder={placeholder}
        {...(type === typeEnum.NUMBER && {
          numberInputOptions,
        })}
        {...(type === typeEnum.DATEPICKER && {
          datepickerOptions,
        })}
        isDisabled={disabled}
        {...(type === typeEnum.SELECT && {
          selectOptions,
        })}
      />
      <FormErrorMessage {...setDataTestId(`${testId}--error-message`)}>
        {errors[name]}
      </FormErrorMessage>
    </ChackraFormControl>
  );
};
