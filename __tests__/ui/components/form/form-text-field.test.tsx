import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { useForm } from 'react-hook-form';
import { TextInput, View } from 'react-native';

import { FormTextField } from '@/ui/components/form/form-text-field';

import type { ReactNode } from 'react';

let mockIsPasswordVisible = false;

jest.mock('@/ui/hooks/use-toggle', () => ({
  useToggle: () => [mockIsPasswordVisible, jest.fn()],
}));

type FormValues = {
  email: string;
  password: string;
};

function TestWrapper({ children }: { children: (form: ReturnType<typeof useForm<FormValues>>) => ReactNode }) {
  const form = useForm<FormValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  return <View>{children(form)}</View>;
}

describe('FormTextField', () => {
  beforeEach(() => {
    mockIsPasswordVisible = false;
  });

  it('renders with label', () => {
    const { getByText } = render(
      <TestWrapper>
        {(form) => (
          <FormTextField
            control={form.control}
            name="email"
            label="Email"
          />
        )}
      </TestWrapper>
    );

    expect(getByText('Email')).toBeTruthy();
  });

  it('updates form value on text change', async () => {
    let formInstance: ReturnType<typeof useForm<FormValues>> | null = null;

    const { getByTestId } = render(
      <TestWrapper>
        {(form) => {
          formInstance = form;
          return (
            <FormTextField
              control={form.control}
              name="email"
              label="Email"
            />
          );
        }}
      </TestWrapper>
    );

    const textField = getByTestId('text-field');
    const textInputs = textField.findAllByType(TextInput);

    if (textInputs.length > 0) {
      fireEvent.changeText(textInputs[0], 'test@example.com');

      await waitFor(() => {
        expect(formInstance?.getValues('email')).toBe('test@example.com');
      });
    }
  });

  it('renders with secure text entry for password', () => {
    const { getByTestId } = render(
      <TestWrapper>
        {(form) => (
          <FormTextField
            control={form.control}
            name="password"
            label="Password"
            secureTextEntry
          />
        )}
      </TestWrapper>
    );

    expect(getByTestId('icon-eye')).toBeTruthy();
  });

  it('passes placeholder to input', () => {
    const { getByTestId } = render(
      <TestWrapper>
        {(form) => (
          <FormTextField
            control={form.control}
            name="email"
            placeholder="Enter your email"
          />
        )}
      </TestWrapper>
    );

    const textField = getByTestId('text-field');
    const textInputs = textField.findAllByType(TextInput);

    if (textInputs.length > 0) {
      expect(textInputs[0].props.placeholder).toBe('Enter your email');
    }
  });
});
