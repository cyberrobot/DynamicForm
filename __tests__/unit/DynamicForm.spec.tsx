import { screen } from '@testing-library/react';

import { setupRender } from '../../helpers/testing';

describe('DynamicForm', () => {
  beforeEach(() => {
    window['E2E'] = true;
  });

  describe('props', () => {
    it('#testId', () => {
      const testId = 'dynamic-form-test-id';
      setupRender({ testId: testId });
      expect(screen.getByTestId(`${testId}--container`)).toBeInTheDocument();
    });

    it('#label', () => {
      const label = 'Test label';
      setupRender({ label: label });
      expect(screen.getByLabelText(label)).toBeInTheDocument();
    });
  });
});
