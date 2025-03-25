// This file sets up global mocks or imports for use in Storybook

// Safely provide emotion modules if we're in a browser environment
if (typeof window !== 'undefined') {
  try {
    window.emotion = {
      react: require('@emotion/react'),
      styled: require('@emotion/styled')
    };
  } catch (error) {
    console.warn('Could not load emotion packages:', error);
  }
}

// You can add other global setup code here if needed
