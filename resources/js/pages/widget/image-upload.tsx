import { useMemo } from 'react';

interface Props {
    label?: string;
    file: File | null;
    onChange: (file: File | null) => void;
    imageUrl?: string;

    previewBackground?: string;

    height?: string;

    previewClassName?: string;

    accept?: string;
}

export default function ImageUpload({
    label = 'Upload Image',
    file,
    imageUrl,
    onChange,
    previewBackground = '#ffffff',
    height = '180px',
    previewClassName = '',
    accept = 'image/*',
}: Props) {
    const preview = useMemo(() => {
        if (file) {
            return URL.createObjectURL(file);
        }

        if (imageUrl) {
            return imageUrl;
        }

        return null;
    }, [file, imageUrl]);

    return (
        <div className="mb-20">

            <div className="form-group mb-4 only-file-upload" id="file-upload">
                <label className="label fs-16">
                     {label}
                </label>
                <div className="form-control h-100 text-center position-relative p-4 p-lg-5" style={{
                        background:
                            previewBackground,
                        minHeight: height,
                    }}>
                    <div className="product-upload">
                        {preview ? (
                            <img
                                src={preview}
                                alt="Preview"
                                style={{
                                    maxWidth: '220px',
                                    maxHeight: '100px',
                                    objectFit: 'contain',
                                }}
                            />
                        ) : (
                            <label className="file-upload mb-0">
                                <i className="ri-folder-image-line bg-primary bg-opacity-10 p-2 rounded-1 text-primary">
                                </i>
                                <span className="d-block text-body fs-14">
                                    Drag and drop an image or
                                    <span className="text-primary text-decoration-underline">
                                        Browse
                                    </span>
                                </span>
                            </label>
                        )}

                        <label className="position-absolute top-0 bottom-0 start-0 end-0 cursor active" id="upload-container">
                            <input className="form__file bottom-0" id="upload-files" type="file" accept={accept}
                                onChange={(e) =>
                                    onChange(
                                        e.target.files?.[0] || null
                                    )
                                } />
                        </label>
                    </div>
                </div>
                <div id="files-list-container">
                </div>
            </div>

            {/* <input
                type="file"
                className="form-control mb-3"
                accept={accept}
                onChange={(e) =>
                    onChange(
                        e.target.files?.[0] || null
                    )
                }
            />

            <div
                className={`d-flex align-items-center justify-content-center rounded-3 border ${previewClassName}`}
                style={{
                    background:
                        previewBackground,
                    minHeight: height,
                    border:
                        '1px dashed #0d1014',
                }}
            >
                {preview ? (
                    <img
                        src={preview}
                        alt="Preview"
                        style={{
                            maxWidth: '220px',
                            maxHeight: '100px',
                            objectFit: 'contain',
                        }}
                    />
                ) : (
                    <span className="text-muted">
                        No Image Selected
                    </span>
                )}
            </div> */}
        </div>
    );
}