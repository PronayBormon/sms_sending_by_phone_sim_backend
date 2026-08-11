/* ============================================================
   TypeScript interfaces for the Email Builder design data
   ============================================================ */

export interface EmailSettings {
    name: string;
    subject: string;
    preheader: string;
    bgColor: string;
    contentBg: string;
    contentWidth: number;
    fontFamily: string;
}

export interface EmailBlock {
    id: string;
    order: number;
    type:
        | 'header'
        | 'heading'
        | 'text'
        | 'button'
        | 'image'
        | 'columns'
        | 'divider'
        | 'spacer'
        | 'social'
        | 'footer';
    preview: string;
    // Optional block-specific fields
    src?: string;           // image src
    href?: string;          // button link
    align?: string;         // text align
    bgColor?: string;       // block background
    textColor?: string;     // block text color
    fontSize?: number;
    paddingTop?: number;
    paddingBottom?: number;
    paddingLeft?: number;
    paddingRight?: number;
    leftContent?: string;   // columns left
    rightContent?: string;  // columns right
}

export interface EmailDesign {
    settings: EmailSettings;
    blocks: EmailBlock[];
    metadata: {
        savedAt: string;
        blockCount: number;
        version: string;
    };
}

export const DEFAULT_SETTINGS: EmailSettings = {
    name: 'Untitled Template',
    subject: '',
    preheader: '',
    bgColor: '#F1F5F9',
    contentBg: '#FFFFFF',
    contentWidth: 600,
    fontFamily: 'Inter',
};

export const ELEMENT_TYPES: Array<{
    type: EmailBlock['type'];
    label: string;
    description: string;
    icon: string;
}> = [
    { type: 'header',  label: 'Header',  description: 'Logo & brand bar',     icon: 'view_compact' },
    { type: 'heading', label: 'Heading', description: 'H1/H2 title text',     icon: 'title' },
    { type: 'text',    label: 'Text',    description: 'Paragraph content',     icon: 'text_fields' },
    { type: 'button',  label: 'Button',  description: 'Call-to-action',        icon: 'smart_button' },
    { type: 'image',   label: 'Image',   description: 'Photo or graphic',      icon: 'image' },
    { type: 'columns', label: 'Columns', description: 'Side-by-side layout',   icon: 'view_column' },
    { type: 'divider', label: 'Divider', description: 'Horizontal line',       icon: 'horizontal_rule' },
    { type: 'spacer',  label: 'Spacer',  description: 'Empty space',           icon: 'expand' },
    { type: 'social',  label: 'Social',  description: 'Social links row',      icon: 'share' },
    { type: 'footer',  label: 'Footer',  description: 'Legal & unsubscribe',   icon: 'article' },
];

let blockCounter = 100;

export function createBlock(type: EmailBlock['type']): EmailBlock {
    blockCounter++;
    const id = `blk-${blockCounter}`;

    const defaults: Record<string, Partial<EmailBlock>> = {
        header:  { preview: 'Mailvio' },
        heading: { preview: 'Your Heading Here' },
        text:    { preview: 'Start writing your content here. This is a paragraph of text that you can customize with the properties panel.' },
        button:  { preview: 'Click Here', href: '#' },
        image:   { preview: 'Add image URL in properties', src: '' },
        columns: { preview: '', leftContent: 'Left column content. Edit this text in the properties panel.', rightContent: 'Right column content. Edit this text in the properties panel.' },
        divider: { preview: '[divider]' },
        spacer:  { preview: '[spacer]' },
        social:  { preview: '[social]' },
        footer:  { preview: '© 2025 Company, Inc. All rights reserved.\n123 Market Street, San Francisco, CA 94103\nUnsubscribe · Privacy Policy · View in browser' },
    };

    return {
        id,
        order: 0,
        type,
        preview: '',
        ...defaults[type],
    };
}
