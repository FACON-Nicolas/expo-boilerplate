import { render, fireEvent, waitFor } from '@testing-library/react-native';
import React from 'react';
import { useForm } from 'react-hook-form';
import { View } from 'react-native';

import { FormRadioGroup } from '@/ui/components/form/form-radio-group';

type FormValues = {
  ageRange: string;
};

function TestWrapper({ children }: { children: (form: ReturnType<typeof useForm<FormValues>>) => React.ReactNode }) {
  const form = useForm<FormValues>({
    defaultValues: {
      ageRange: '',
    },
  });
  return <View>{children(form)}</View>;
}

const options = [
  { value: '18-24', label: '18-24 years' },
  { value: '25-34', label: '25-34 years' },
  { value: '35+', label: '35+ years' },
];

describe('FormRadioGroup', () => {
  it('renders all options', () => {
    const { getByText } = render(
      <TestWrapper>
        {(form) => (
          <FormRadioGroup
            control={form.control}
            name="ageRange"
            options={options}
          />
        )}
      </TestWrapper>
    );

    expect(getByText('18-24 years')).toBeTruthy();
    expect(getByText('25-34 years')).toBeTruthy();
    expect(getByText('35+ years')).toBeTruthy();
  });

  it('renders radio group container', () => {
    const { getByTestId } = render(
      <TestWrapper>
        {(form) => (
          <FormRadioGroup
            control={form.control}
            name="ageRange"
            options={options}
          />
        )}
      </TestWrapper>
    );

    expect(getByTestId('radio-group')).toBeTruthy();
  });

  it('renders individual radio items', () => {
    const { getByTestId } = render(
      <TestWrapper>
        {(form) => (
          <FormRadioGroup
            control={form.control}
            name="ageRange"
            options={options}
          />
        )}
      </TestWrapper>
    );

    expect(getByTestId('radio-item-18-24')).toBeTruthy();
    expect(getByTestId('radio-item-25-34')).toBeTruthy();
    expect(getByTestId('radio-item-35+')).toBeTruthy();
  });

  it('updates form value when option is selected', async () => {
    let formInstance: ReturnType<typeof useForm<FormValues>> | null = null;

    const { getByTestId } = render(
      <TestWrapper>
        {(form) => {
          formInstance = form;
          return (
            <FormRadioGroup
              control={form.control}
              name="ageRange"
              options={options}
            />
          );
        }}
      </TestWrapper>
    );

    fireEvent.press(getByTestId('radio-item-25-34'));

    await waitFor(() => {
      expect(formInstance?.getValues('ageRange')).toBe('25-34');
    });
  });

  it('can change selection', async () => {
    let formInstance: ReturnType<typeof useForm<FormValues>> | null = null;

    const { getByTestId } = render(
      <TestWrapper>
        {(form) => {
          formInstance = form;
          return (
            <FormRadioGroup
              control={form.control}
              name="ageRange"
              options={options}
            />
          );
        }}
      </TestWrapper>
    );

    fireEvent.press(getByTestId('radio-item-18-24'));

    await waitFor(() => {
      expect(formInstance?.getValues('ageRange')).toBe('18-24');
    });

    fireEvent.press(getByTestId('radio-item-35+'));

    await waitFor(() => {
      expect(formInstance?.getValues('ageRange')).toBe('35+');
    });
  });
});
