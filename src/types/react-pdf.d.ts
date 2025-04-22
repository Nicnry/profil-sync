declare module '@react-pdf/renderer' {
  import React from 'react';

  interface DocumentProps {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string;
    creator?: string;
    producer?: string;
    children?: React.ReactNode;
    style?: React.CSSProperties | object;
  }

  interface PageProps {
    size?: string | [number, number];
    orientation?: 'portrait' | 'landscape';
    children?: React.ReactNode;
    style?: React.CSSProperties | object;
  }

  interface TextProps {
    children?: React.ReactNode;
    style?: React.CSSProperties | object;
    render?: (props: unknown) => React.ReactNode;
  }

  interface ViewProps {
    children?: React.ReactNode;
    style?: React.CSSProperties | object;
    render?: (props: unknown) => React.ReactNode;
    wrap?: boolean;
  }

  interface ImageProps {
    src?: string;
    style?: React.CSSProperties | object;
    cache?: boolean;
  }

  export class Document extends React.Component<DocumentProps> {}
  export class Page extends React.Component<PageProps> {}
  export class Text extends React.Component<TextProps> {}
  export class View extends React.Component<ViewProps> {}
  export class Image extends React.Component<ImageProps> {}
  
  export const StyleSheet: {
    create: <T extends Record<string, React.CSSProperties | object>>(styles: T) => T;
  };
  
  export const Font: {
    register: (descriptor: { family: string; src: string }) => void;
  };
  
  export const pdf: (element: React.ReactElement) => {
    toBlob: () => Promise<Blob>;
    toBuffer: () => Promise<Buffer>;
    toString: () => Promise<string>;
  };
}