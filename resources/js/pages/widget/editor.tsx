import ReactQuill from 'react-quill-new';

interface Props {
    value?: string;
    onChange?: (value: string) => void;
    minHeight?: string;
}

export default function EditorComponent({
    value = '',
    onChange,
    minHeight = '250px',
}: Props) {
    return (
        <div
            style={{
                minHeight,
            }}
        >
            <ReactQuill
                theme="snow"
                value={value}
                onChange={(content) => {
                    onChange?.(content);
                }}
            />

            <style>
                {`
                    .ql-container {
                        min-height: ${minHeight};
                    }

                    .ql-editor {
                        min-height: ${minHeight};
                    }
                `}
            </style>
        </div>
    );
}