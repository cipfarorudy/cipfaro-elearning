import { jest } from "@jest/globals";

// Type pour le mock global
declare global {
  var mockScormAPI: any;
}

// Mock pour SCORM API
const mockScormAPI = {
  LMSInitialize: jest.fn(() => "true"),
  LMSFinish: jest.fn(() => "true"),
  LMSGetValue: jest.fn(() => ""),
  LMSSetValue: jest.fn(() => "true"),
  LMSCommit: jest.fn(() => "true"),
  LMSGetLastError: jest.fn(() => "0"),
  LMSGetErrorString: jest.fn(() => ""),
  LMSGetDiagnostic: jest.fn(() => ""),
};

// Mock window pour SCORM
Object.defineProperty(window, "API", {
  value: mockScormAPI,
  writable: true,
});

Object.defineProperty(window, "API_1484_11", {
  value: {
    Initialize: jest.fn(() => "true"),
    Terminate: jest.fn(() => "true"),
    GetValue: jest.fn(() => ""),
    SetValue: jest.fn(() => "true"),
    Commit: jest.fn(() => "true"),
    GetLastError: jest.fn(() => "0"),
    GetErrorString: jest.fn(() => ""),
    GetDiagnostic: jest.fn(() => ""),
  },
  writable: true,
});

// Export du mock pour utilisation dans les tests
global.mockScormAPI = mockScormAPI;

// Nettoyage après chaque test
afterEach(() => {
  jest.clearAllMocks();
});
