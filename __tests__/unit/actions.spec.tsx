import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { act } from 'react-dom/test-utils';

import { setupRender } from '../../helpers/testing';
import { ActionProps } from '../../types';

describe('actions', () => {
  beforeEach(() => {
    window['E2E'] = true;
  });

  it('should render a button type button', () => {
    const actions: ActionProps[] = [
      {
        title: 'Cancel',
        type: 'button',
      },
    ];
    setupRender({ actions: actions });
    expect(screen.getByText(actions[0].title)).toHaveAttribute(
      'type',
      'button'
    );
  });

  it('should render a button type submit', () => {
    const actions: ActionProps[] = [
      {
        title: 'Submit',
        type: 'submit',
      },
    ];
    setupRender({ actions: actions });
    expect(screen.getByText(actions[0].title)).toHaveAttribute(
      'type',
      'submit'
    );
  });

  it('should fire a callback on button click', () => {
    const actions: ActionProps[] = [
      {
        title: 'Cancel',
        type: 'button',
        onClick: jest.fn(),
      },
    ];
    setupRender({ actions: actions });
    fireEvent.click(screen.getByText(actions[0].title));
    expect(actions[0].onClick).toHaveBeenCalled();
  });

  it('should fire a callback on submit', async () => {
    const onSubmit = jest.fn();
    const actions: ActionProps[] = [
      {
        title: 'Submit',
        type: 'submit',
        label: 'Submit',
      },
    ];
    const initialValues = {
      textField: '',
      emailField: '',
    };
    setupRender({
      onSubmit: onSubmit,
      actions: actions,
      initialValues: initialValues,
    });
    const user = userEvent.setup();
    await act(async () => {
      await user.click(screen.getByRole('button', { name: 'Submit' }));
      await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    });
  });

  it('should disable a button if disabled prop is passed', () => {
    const actions: ActionProps[] = [
      {
        title: 'Cancel',
        type: 'button',
        disabled: true,
      },
    ];
    setupRender({ actions: actions });
    expect(screen.getByText(actions[0].title)).toBeDisabled();
  });
});
