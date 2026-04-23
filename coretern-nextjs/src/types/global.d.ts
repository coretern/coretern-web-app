/* eslint-disable @typescript-eslint/no-explicit-any */

// Global mongoose cache for serverless
declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: any;
    promise: any;
  };
}

// CSS Modules
declare module '*.module.css' {
  const classes: { [key: string]: string };
  export default classes;
}

// Image imports
declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  const value: string;
  export default value;
}

// React Quill
declare module 'react-quill-new' {
  import { ComponentType } from 'react';
  const ReactQuill: ComponentType<any>;
  export default ReactQuill;
}

// xlsx
declare module 'xlsx' {
  const XLSX: any;
  export default XLSX;
}

export {};
