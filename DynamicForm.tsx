import { Flex, Box, HStack } from '@chakra-ui/react';
import { setDataTestId } from '@satago/utils';
import { Formik, FormikHelpers, FormikValues } from 'formik';
import _some from 'lodash/some';

import { Button } from '../Button';
import { Feedback } from '../Feedback';
import { FormControl } from './internal/FormControl';
import { useStyles } from './styles';
import { DynamicFormProps } from './types';

// TODO: Add field type - password | search. Tests.

export function DynamicForm<T>({
  testId = 'dynamic-form',
  label = 'Dynamic Form',
  style,
  initialValues,
  onSubmit,
  fields,
  actions,
  feedback,
}: DynamicFormProps<T>) {
  const styles = useStyles();
  const onSubmitHandler = async (
    values: T,
    actions: FormikHelpers<FormikValues>
  ) => {
    if (typeof onSubmit === 'function') {
      onSubmit(values, actions);
    }
  };
  const isFeedbackVisible =
    feedback &&
    _some(Object.values(feedback), (obj) => obj['isVisible'] === true);
  return (
    <>
      {!isFeedbackVisible && (
        <Box
          sx={style}
          {...setDataTestId(`${testId}--container`)}
          aria-label={`${label}`}
        >
          <Formik initialValues={initialValues} onSubmit={onSubmitHandler}>
            {({ handleSubmit, isSubmitting, ...formProps }) => (
              <form onSubmit={handleSubmit} noValidate>
                {fields.map((field) => {
                  if (Array.isArray(field)) {
                    return (
                      <Flex
                        sx={styles.formLine}
                        key={field.map(({ id, name }) => id || name).join('-')}
                      >
                        {field.map((subField) => {
                          return (
                            <Box key={subField.id} sx={styles.formLineBox}>
                              <FormControl
                                fieldProps={subField}
                                formProps={formProps}
                                testId={testId}
                              />
                            </Box>
                          );
                        })}
                      </Flex>
                    );
                  }
                  return (
                    <FormControl
                      fieldProps={field}
                      formProps={formProps}
                      key={field.id}
                      testId={testId}
                    />
                  );
                })}
                {actions && (
                  <HStack sx={styles.actionsContainer}>
                    {actions.map(
                      (
                        {
                          title,
                          type,
                          onClick,
                          loadingText,
                          label,
                          disabled,
                          testId: actionTestId,
                        },
                        index
                      ) => (
                        <Button
                          key={index}
                          isLoading={isSubmitting}
                          type={type || 'button'}
                          variant={type === 'submit' ? 'primary' : 'default'}
                          {...(label && { label: label })}
                          {...(type !== 'submit' && { onClick: onClick })}
                          loadingText={loadingText || title}
                          isDisabled={disabled}
                          {...setDataTestId(
                            actionTestId
                              ? actionTestId
                              : `${testId}--action-button`
                          )}
                        >
                          {title}
                        </Button>
                      )
                    )}
                  </HStack>
                )}
              </form>
            )}
          </Formik>
        </Box>
      )}
      {isFeedbackVisible && (
        <>
          {Object.keys(feedback).map((key) => {
            const { isVisible } = feedback[key];
            if (!isVisible) return null;
            return <Feedback type={key} {...feedback[key]} key={key} />;
          })}
        </>
      )}
    </>
  );
}
