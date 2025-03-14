// Mock Datadog implementation
export function initDatadog() {
  console.log('Mock Datadog initialization');
  
  // Create a mock llmobs object
  window.llmobs = {
    startTrace: (data) => {
      console.log('Starting trace:', data);
      return `mock-trace-${Date.now()}`;
    },
    
    finishTrace: (data) => {
      console.log('Finishing trace:', data);
      return data.traceId;
    },
    
    trace: (metadata, callback) => {
      console.log('Tracing operation:', metadata);
      try {
        const result = callback();
        console.log('Trace completed successfully');
        return result;
      } catch (error) {
        console.error('Trace failed:', error);
        throw error;
      }
    },
    
    annotate: (data) => {
      console.log('Annotation:', data);
    }
  };
} 