import { screen } from '@testing-library/react';

import { FeedbackProps } from '../../../Feedback';
import { getInitialValuesDefault, setupRender } from '../../helpers/testing';
import { FieldProps } from '../../types';

describe('Feedback', () => {
  it.each(['success', 'error', 'pending'])(
    'should render a %s feedback type',
    (type: FeedbackProps['type']) => {
      const fields: FieldProps[] = [
        {
          id: 'textField',
          label: 'Text field',
          name: 'textField',
          type: 'text',
        },
      ];
      const initialValues = getInitialValuesDefault();
      const title = `${type} feedback`;
      setupRender({
        initialValues: { text: initialValues['text'] },
        fields: fields,
        feedback: {
          [type]: {
            title,
            isVisible: true,
          },
        },
      });
      expect(screen.getByText(title)).toBeInTheDocument();
    }
  );
});
