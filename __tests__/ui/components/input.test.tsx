import { fireEvent, render } from '@testing-library/react-native';

import { Input } from '@/ui/components/input';

let mockIsPasswordVisible = false;
const mockTogglePasswordVisibility = jest.fn();

jest.mock('@/ui/hooks/use-toggle', () => ({
  useToggle: () => [mockIsPasswordVisible, mockTogglePasswordVisibility],
}));

describe('Input', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockIsPasswordVisible = false;
  });

  it('renders without label', () => {
    const { queryByText } = render(<Input placeholder="Enter text" />);

    expect(queryByText('Label')).toBeNull();
  });

  it('renders with label', () => {
    const { getByText } = render(<Input label="Email" placeholder="Enter email" />);

    expect(getByText('Email')).toBeTruthy();
  });

  it('renders error message when provided', () => {
    const { getByText } = render(
      <Input errorMessage="This field is required" />
    );

    expect(getByText('This field is required')).toBeTruthy();
  });

  it('calls onChangeText when text changes', () => {
    const onChangeTextMock = jest.fn();
    const { getByTestId } = render(
      <Input onChangeText={onChangeTextMock} />
    );

    fireEvent.changeText(getByTestId('text-field'), 'new value');
    expect(onChangeTextMock).toHaveBeenCalledWith('new value');
  });

  it('renders password visibility toggle for secure text entry', () => {
    const { getByLabelText } = render(<Input secureTextEntry />);

    expect(getByLabelText('accessibility.input.showPassword')).toBeTruthy();
  });

  it('shows hide password button when password is visible', () => {
    mockIsPasswordVisible = true;

    const { getByLabelText } = render(<Input secureTextEntry />);

    expect(getByLabelText('accessibility.input.hidePassword')).toBeTruthy();
  });

  it('does not show toggle when secureTextEntry is false', () => {
    const { queryByLabelText } = render(<Input />);

    expect(queryByLabelText('accessibility.input.showPassword')).toBeNull();
  });
});
