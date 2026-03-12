import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';
import '@testing-library/jest-dom'; // Imports the jest-dom matchers

// Extends Vitest's expect with jest-dom matchers (e.g., toBeInTheDocument)
expect.extend(matchers);

// Automatically clean up the DOM after each test to prevent test interference
afterEach(() => {
  cleanup();
});