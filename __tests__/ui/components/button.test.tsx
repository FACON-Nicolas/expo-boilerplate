import { render, fireEvent } from '@testing-library/react-native';
import React from 'react';

import { Button } from '@/ui/components/button';

describe('Button', () => {
  it('renders children text', () => {
    const { getByText } = render(<Button>Click me</Button>);

    expect(getByText('Click me')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <Button onPress={onPressMock}>Press me</Button>
    );

    fireEvent.press(getByTestId('heroui-button'));

    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('does not call onPress when disabled', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <Button onPress={onPressMock} disabled>
        Disabled
      </Button>
    );

    fireEvent.press(getByTestId('heroui-button'));

    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('shows spinner when isLoading is true', () => {
    const { getByTestId, queryByText } = render(
      <Button isLoading>Loading</Button>
    );

    expect(getByTestId('spinner')).toBeTruthy();
    expect(queryByText('Loading')).toBeNull();
  });

  it('is disabled when isLoading is true', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <Button onPress={onPressMock} isLoading>
        Loading
      </Button>
    );

    fireEvent.press(getByTestId('heroui-button'));

    expect(onPressMock).not.toHaveBeenCalled();
  });

  it('renders with different variants', () => {
    const variants = ['primary', 'secondary', 'danger', 'ghost'] as const;

    variants.forEach((variant) => {
      const { getByText } = render(
        <Button variant={variant}>{variant} button</Button>
      );
      expect(getByText(`${variant} button`)).toBeTruthy();
    });
  });

  it('renders with different sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;

    sizes.forEach((size) => {
      const { getByText } = render(
        <Button size={size}>{size} button</Button>
      );
      expect(getByText(`${size} button`)).toBeTruthy();
    });
  });
});
