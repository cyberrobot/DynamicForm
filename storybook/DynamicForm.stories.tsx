import { useState } from 'react';

import { Heading, HStack, Spacer, Text } from '@chakra-ui/react';
import { Meta, Story } from '@storybook/react';

import { spacing, color, border } from '../../../helpers/theme';
import { Button } from '../../Button';
import { DynamicForm } from '../DynamicForm';

export default {
  title: 'Satago/DynamicForm',
  component: DynamicForm,
} as Meta<typeof DynamicForm>;

const DemoForm = (props) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isFailed, setIsFailed] = useState(false);
  const [isPending, setIsPending] = useState(false);

  return (
    <>
      <Text mb={spacing.SPACE_4}>
        Toggle a form feedback by clicking a button below:
      </Text>
      <HStack mb={spacing.SPACE_6}>
        <Button
          variant="default"
          onClick={() => {
            setIsSubmitted(true);
            setIsFailed(false);
            setIsPending(false);
          }}
        >
          Submit
        </Button>
        <Button
          variant="default"
          onClick={() => {
            setIsFailed(true);
            setIsSubmitted(false);
            setIsPending(false);
          }}
        >
          Fail
        </Button>
        <Button
          variant="default"
          onClick={() => {
            setIsPending(true);
            setIsSubmitted(false);
            setIsFailed(false);
          }}
        >
          Pending
        </Button>
        <Spacer />
        <Button
          variant="default"
          onClick={() => {
            setIsSubmitted(false);
            setIsFailed(false);
            setIsPending(false);
          }}
        >
          Reset
        </Button>
      </HStack>
      <DynamicForm
        initialValues={{
          name: '',
          email: 'test.email@satago.com',
          textarea: '',
          number: '',
          terms: false,
          option1: false,
          dateFrom: '',
          select: '',
        }}
        feedback={{
          success: {
            title: 'Success',
            description: 'Form submitted successfully',
            isVisible: isSubmitted,
          },
          pending: {
            title: 'Pending',
            description: 'Form is being submitted',
            isVisible: isPending,
          },
          error: {
            title: 'Error',
            description: 'Form submission failed',
            isVisible: isFailed,
          },
        }}
        {...props}
      />
    </>
  );
};

const element: Story<typeof DynamicForm> = (args) => <DemoForm {...args} />;

export const Default: Story<typeof DynamicForm> = element.bind({});
Default.args = {
  fields: [
    {
      id: 'dateFrom',
      label: 'Date From',
      name: 'dateFrom',
      type: 'datepicker',
      required: true,
      datepickerOptions: {
        minDate: new Date(2022, 10, 5),
        maxDate: new Date(2022, 10, 15),
        dateFormat: 'yyyy/MM/dd',
        firstDayOfWeek: 2,
      },
      validate: (value) => {
        if (!value) {
          return 'Field is required';
        }
      },
    },
    {
      id: 'select',
      label: 'Select',
      name: 'select',
      type: 'select',
      required: true,
      validate: (value) => {
        if (!value.length) {
          return 'Select at least one option';
        }
      },
      selectOptions: {
        items: [
          { value: 'option1', label: 'Select option 1' },
          { value: 'option2', label: 'Select option 2' },
        ],
        isMulti: true,
        showSelectedItems: true,
      },
    },
    {
      id: 'name',
      label: 'Name',
      name: 'name',
      type: 'text',
      required: true,
      validate: (value) => {
        if (!value) {
          return 'Field is required';
        }
        if (value.length < 3) {
          return 'Field must be at least 3 characters long';
        }
      },
    },
    [
      {
        id: 'header1',
        name: 'header1',
        heading: 'Multi Column Heading',
        type: 'header',
      },
    ],
    [
      {
        id: 'text1',
        name: 'text1',
        label: 'First name',
        type: 'text',
      },
      {
        id: 'text2',
        name: 'text2',
        label: 'Last name',
        type: 'text',
      },
    ],
    {
      id: 'number',
      label: 'Number',
      heading: 'Inline / Single Column Heading',
      name: 'number',
      type: 'number',
      required: true,
      validate: (value) => {
        if (!value) {
          return 'Field is required';
        }
      },
      numberInputOptions: {
        precision: 2,
        max: 300,
        isStepperVisible: true,
        step: 5,
      },
    },
    {
      id: 'email',
      label: 'Email',
      name: 'email',
      type: 'email',
      disabled: true,
    },
    {
      id: 'textarea',
      label: 'Text Area',
      name: 'textarea',
      type: 'textarea',
      required: true,
      validate: (value) => {
        if (!value) {
          return 'Field is required';
        }
      },
    },
    {
      id: 'terms',
      label: 'Checkbox',
      name: 'terms',
      type: 'checkbox',
      disabled: true,
      Container: ({ children }) => (
        <div
          style={{
            padding: spacing.SPACE_6,
            border: `2px solid ${color.TOP_BLUE8}`,
            display: 'flex',
            alignItems: 'center',
            borderRadius: border.RADIUS_MD,
          }}
        >
          <div
            style={{
              marginRight: spacing.SPACE_4,
            }}
          >
            <Heading size="sm">Refer</Heading>
            <span>
              Clients on refer will require manual authorisation prior to
              payments being sent to them.
            </span>
          </div>
          {children}
        </div>
      ),
    },
    {
      id: 'switch',
      label: 'Switch',
      name: 'option1',
      type: 'switch',
      required: true,
      validate: (value) => {
        if (!value) {
          return 'Field is required';
        }
      },
    },
  ],
  actions: [
    {
      title: 'Submit',
      type: 'submit',
    },
  ],
};
