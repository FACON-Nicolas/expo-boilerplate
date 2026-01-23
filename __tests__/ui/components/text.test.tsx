import { render } from "@testing-library/react-native";
import React from "react";

import { Text } from "@/ui/components/text";

describe("Text", () => {
  it("renders children text", () => {
    const { getByText } = render(<Text>Hello World</Text>);

    expect(getByText("Hello World")).toBeTruthy();
  });

  it("renders with default variant", () => {
    const { getByText } = render(<Text>Default text</Text>);

    const textElement = getByText("Default text");
    expect(textElement).toBeTruthy();
  });

  it("renders with title variant", () => {
    const { getByText } = render(<Text variant='title'>Title text</Text>);

    expect(getByText("Title text")).toBeTruthy();
  });

  it("renders with subtitle variant", () => {
    const { getByText } = render(<Text variant='subtitle'>Subtitle text</Text>);

    expect(getByText("Subtitle text")).toBeTruthy();
  });

  it("renders with semibold variant", () => {
    const { getByText } = render(<Text variant='semibold'>Semibold text</Text>);

    expect(getByText("Semibold text")).toBeTruthy();
  });

  it("renders with link variant", () => {
    const { getByText } = render(<Text variant='link'>Link text</Text>);

    expect(getByText("Link text")).toBeTruthy();
  });

  it("renders with error variant", () => {
    const { getByText } = render(<Text variant='error'>Error text</Text>);

    expect(getByText("Error text")).toBeTruthy();
  });

  it("applies custom className", () => {
    const { getByText } = render(
      <Text className='custom-class'>Custom styled text</Text>,
    );

    expect(getByText("Custom styled text")).toBeTruthy();
  });

  it("passes through additional props", () => {
    const { getByTestId } = render(
      <Text testID='custom-text' accessibilityLabel='Accessible text'>
        Accessible
      </Text>,
    );

    expect(getByTestId("custom-text")).toBeTruthy();
  });
});
