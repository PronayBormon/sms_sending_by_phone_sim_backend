import React, { useState, useCallback } from 'react';
import './email-builder.css';
import {
    EmailSettings,
    EmailBlock,
    EmailDesign,
    DEFAULT_SETTINGS,
    ELEMENT_TYPES,
    createBlock,
} from './types';

/* ============================================================
   Props
   ============================================================ */
interface EmailBuilderProps {
    initialDesign?: EmailDesign | null;
    templateTitle?: string;
    onSave: (design: EmailDesign) => void;
    saving?: boolean;
    backUrl?: string;
}

/* ============================================================
   Main Component
   ============================================================ */
export default function EmailBuilder({
    initialDesign,
    templateTitle = 'Untitled Template',
    onSave,
    saving = false,
    backUrl = '/admin/email-templates',
}: EmailBuilderProps) {
    /* ---------- State ---------- */
    const [settings, setSettings] = useState<EmailSettings>(
        initialDesign?.settings ?? { ...DEFAULT_SETTINGS, name: templateTitle },
    );
    const [blocks, setBlocks] = useState<EmailBlock[]>(
        initialDesign?.blocks ?? [],
    );
    const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
    const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
    const [leftTab, setLeftTab] = useState<'elements' | 'layers'>('elements');

    const selectedBlock = blocks.find((b) => b.id === selectedBlockId) ?? null;

    const [draggedItemId, setDraggedItemId] = useState<string | null>(null);
    const [draggedElementType, setDraggedElementType] = useState<EmailBlock['type'] | null>(null);

    /* ---------- Helpers ---------- */
    const reorder = (arr: EmailBlock[]): EmailBlock[] =>
        arr.map((b, i) => ({ ...b, order: i }));

    const updateBlock = useCallback(
        (id: string, patch: Partial<EmailBlock>) => {
            setBlocks((prev) =>
                prev.map((b) => (b.id === id ? { ...b, ...patch } : b)),
            );
        },
        [],
    );

    const addBlock = useCallback(
        (type: EmailBlock['type']) => {
            const newBlock = createBlock(type);
            setBlocks((prev) => {
                const idx = prev.findIndex((b) => b.id === selectedBlockId);
                if (idx === -1) {
                    return reorder([...prev, newBlock]);
                }
                const newArr = [...prev];
                newArr.splice(idx + 1, 0, newBlock);
                return reorder(newArr);
            });
            setSelectedBlockId(newBlock.id);
        },
        [selectedBlockId],
    );

    const deleteBlock = useCallback(
        (id: string) => {
            setBlocks((prev) => reorder(prev.filter((b) => b.id !== id)));
            if (selectedBlockId === id) setSelectedBlockId(null);
        },
        [selectedBlockId],
    );

    const moveBlock = useCallback(
        (id: string, direction: 'up' | 'down') => {
            setBlocks((prev) => {
                const idx = prev.findIndex((b) => b.id === id);
                if (idx < 0) return prev;
                const newArr = [...prev];
                const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
                if (swapIdx < 0 || swapIdx >= newArr.length) return prev;
                [newArr[idx], newArr[swapIdx]] = [newArr[swapIdx], newArr[idx]];

                return reorder(newArr);
            });
        },
        [],
    );

    const duplicateBlock = useCallback(
        (id: string) => {
            setBlocks((prev) => {
                const idx = prev.findIndex((b) => b.id === id);
                if (idx < 0) return prev;
                const clone = { ...prev[idx], id: `blk-dup-${Date.now()}` };
                const newArr = [...prev];
                newArr.splice(idx + 1, 0, clone);

                return reorder(newArr);
            });
        },
        [],
    );

    // Drag & Drop Handlers
    const handleDragStartElement = (type: EmailBlock['type']) => {
        setDraggedElementType(type);
        setDraggedItemId(null);
    };

    const handleDragStartBlock = (id: string) => {
        setDraggedItemId(id);
        setDraggedElementType(null);
    };

    const handleDragOverBlock = (e: React.DragEvent, id: string) => {
        e.preventDefault();
        const rect = e.currentTarget.getBoundingClientRect();
        const relativeY = e.clientY - rect.top;
        const middleY = rect.height / 2;

        if (relativeY < middleY) {
            e.currentTarget.classList.add('eb-drag-before');
            e.currentTarget.classList.remove('eb-drag-after');
        } else {
            e.currentTarget.classList.add('eb-drag-after');
            e.currentTarget.classList.remove('eb-drag-before');
        }
    };

    const handleDragLeaveBlock = (e: React.DragEvent) => {
        e.currentTarget.classList.remove('eb-drag-before', 'eb-drag-after');
    };

    const handleDropOnBlock = (targetId: string, position: 'before' | 'after') => {
        if (draggedElementType) {
            const newBlock = createBlock(draggedElementType);
            setBlocks((prev) => {
                const targetIdx = prev.findIndex((b) => b.id === targetId);
                if (targetIdx === -1) return prev;
                const newArr = [...prev];
                const insertIdx = position === 'before' ? targetIdx : targetIdx + 1;
                newArr.splice(insertIdx, 0, newBlock);
                return reorder(newArr);
            });
            setSelectedBlockId(newBlock.id);
        } else if (draggedItemId && draggedItemId !== targetId) {
            setBlocks((prev) => {
                const dragIdx = prev.findIndex((b) => b.id === draggedItemId);
                if (dragIdx === -1) return prev;
                const newArr = [...prev];
                const [draggedBlock] = newArr.splice(dragIdx, 1);

                let insertIdx = newArr.findIndex((b) => b.id === targetId);
                if (position === 'after') {
                    insertIdx += 1;
                }
                newArr.splice(insertIdx, 0, draggedBlock);
                return reorder(newArr);
            });
        }
        setDraggedElementType(null);
        setDraggedItemId(null);
    };

    const handleDropBlock = (e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        e.currentTarget.classList.remove('eb-drag-before', 'eb-drag-after');
        const rect = e.currentTarget.getBoundingClientRect();
        const relativeY = e.clientY - rect.top;
        const middleY = rect.height / 2;
        const position = relativeY < middleY ? 'before' : 'after';
        handleDropOnBlock(targetId, position);
    };

    const handleDropOnCanvas = (e: React.DragEvent) => {
        e.preventDefault();
        if (draggedElementType) {
            addBlock(draggedElementType);
        }
        setDraggedElementType(null);
        setDraggedItemId(null);
    };

    const handleDropLayer = (e: React.DragEvent, targetId: string) => {
        e.preventDefault();
        e.currentTarget.classList.remove('eb-drag-before', 'eb-drag-after');
        if (draggedItemId && draggedItemId !== targetId) {
            setBlocks((prev) => {
                const dragIdx = prev.findIndex((b) => b.id === draggedItemId);
                if (dragIdx === -1) return prev;
                const newArr = [...prev];
                const [draggedBlock] = newArr.splice(dragIdx, 1);
                const insertIdx = newArr.findIndex((b) => b.id === targetId);
                newArr.splice(insertIdx, 0, draggedBlock);
                return reorder(newArr);
            });
        }
        setDraggedItemId(null);
    };

    const handleSave = () => {
        const design: EmailDesign = {
            settings,
            blocks,
            metadata: {
                savedAt: new Date().toISOString(),
                blockCount: blocks.length,
                version: '1.0.0',
            },
        };
        onSave(design);
    };

    /* ============================================================
       RENDER: Top Bar
       ============================================================ */
    const renderTopBar = () => (
        <div className="eb-topbar">
            <div className="eb-topbar-left">
                <div className="eb-logo">M</div>
                <div>
                    <div className="eb-breadcrumb">
                        <a href={backUrl}>Templates</a> &gt;{' '}
                        <a href={backUrl}>Builder</a>
                    </div>
                    <div className="eb-template-name">{settings.name || 'Untitled Template'}</div>
                </div>
            </div>

            <div className="eb-topbar-center">
                <div className="eb-view-toggle">
                    <button
                        className={viewMode === 'desktop' ? 'active' : ''}
                        onClick={() => setViewMode('desktop')}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>desktop_windows</span>
                        Desktop
                    </button>
                    <button
                        className={viewMode === 'mobile' ? 'active' : ''}
                        onClick={() => setViewMode('mobile')}
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>smartphone</span>
                        Mobile
                    </button>
                </div>
            </div>

            <div className="eb-topbar-right">
                <span className="eb-block-count">{blocks.length} blocks</span>
                <button className="eb-btn-outline" onClick={() => window.open(backUrl)}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>visibility</span>
                    Preview
                </button>
                <button className="eb-btn-primary" onClick={handleSave} disabled={saving}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span>
                    {saving ? 'Saving…' : 'Save'}
                </button>
            </div>
        </div>
    );

    /* ============================================================
       RENDER: Left Sidebar
       ============================================================ */
    const renderLeftSidebar = () => (
        <div className="eb-left">
            <div className="eb-left-tabs">
                <button
                    className={leftTab === 'elements' ? 'active' : ''}
                    onClick={() => setLeftTab('elements')}
                >
                    Elements
                </button>
                <button
                    className={leftTab === 'layers' ? 'active' : ''}
                    onClick={() => setLeftTab('layers')}
                >
                    Layers
                </button>
            </div>

            {leftTab === 'elements' ? (
                <>
                    <div className="eb-left-heading">Click to add</div>
                    <div className="eb-elements-list">
                        {ELEMENT_TYPES.map((el) => (
                            <div
                                key={el.type}
                                className="eb-element-item"
                                draggable
                                onClick={() => addBlock(el.type)}
                                onDragStart={() => handleDragStartElement(el.type)}
                            >
                                <div className="eb-el-icon">
                                    <span className="material-symbols-outlined">{el.icon}</span>
                                </div>
                                <div className="eb-el-info">
                                    <h4>{el.label}</h4>
                                    <p>{el.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="eb-layers-list">
                    {blocks.length === 0 && (
                        <div style={{ padding: 20, color: '#94a3b8', fontSize: 13, textAlign: 'center' }}>
                            No blocks yet. Add elements from the Elements tab.
                        </div>
                    )}
                    {blocks.map((block) => (
                        <div
                            key={block.id}
                            draggable
                            className={`eb-layer-item ${selectedBlockId === block.id ? 'selected' : ''}`}
                            onClick={() => setSelectedBlockId(block.id)}
                            onDragStart={() => handleDragStartBlock(block.id)}
                            onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('eb-drag-after'); }}
                            onDragLeave={(e) => e.currentTarget.classList.remove('eb-drag-before', 'eb-drag-after')}
                            onDrop={(e) => handleDropLayer(e, block.id)}
                        >
                            <span className="eb-layer-drag material-symbols-outlined" style={{ fontSize: 16, color: '#94a3b8', cursor: 'grab', marginRight: 4 }}>drag_indicator</span>
                            <span className="eb-layer-icon material-symbols-outlined">
                                {ELEMENT_TYPES.find((e) => e.type === block.type)?.icon ?? 'widgets'}
                            </span>
                            <span className="eb-layer-name">
                                {block.preview?.substring(0, 30) || ELEMENT_TYPES.find((e) => e.type === block.type)?.label || block.type}
                            </span>
                            <span className="eb-layer-type">{block.type}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    /* ============================================================
       RENDER: Block in Canvas
       ============================================================ */
    const renderBlockContent = (block: EmailBlock) => {
        switch (block.type) {
            case 'header':
                return (
                    <div className="eb-render-header" style={{ background: block.bgColor }}>
                        <span style={{ fontSize: 20 }}>✉️</span> {block.preview}
                    </div>
                );
            case 'heading':
                return (
                    <div className="eb-render-heading" style={{ textAlign: (block.align as any) || 'left', color: block.textColor, fontSize: block.fontSize }}>
                        {block.preview}
                    </div>
                );
            case 'text':
                return (
                    <div className="eb-render-text" style={{ textAlign: (block.align as any) || 'left', color: block.textColor, fontSize: block.fontSize }}>
                        {block.preview}
                    </div>
                );
            case 'button':
                return (
                    <div className="eb-render-button">
                        <a href="#" onClick={(e) => e.preventDefault()} style={{ background: block.bgColor || '#4f46e5', color: block.textColor || '#fff' }}>
                            {block.preview}
                        </a>
                    </div>
                );
            case 'image':
                return block.src ? (
                    <div className="eb-render-image">
                        <img src={block.src} alt={block.preview || 'Image'} />
                    </div>
                ) : (
                    <div className="eb-render-image-placeholder">
                        <span className="material-symbols-outlined">image</span>
                        Add image URL in properties
                    </div>
                );
            case 'columns':
                return (
                    <div className="eb-render-columns">
                        <div>{block.leftContent || 'Left column content.'}</div>
                        <div>{block.rightContent || 'Right column content.'}</div>
                    </div>
                );
            case 'divider':
                return (
                    <div className="eb-render-divider"><hr /></div>
                );
            case 'spacer':
                return <div className="eb-render-spacer" />;
            case 'social':
                return (
                    <div className="eb-render-social">
                        <a href="#" className="eb-social-icon" onClick={(e) => e.preventDefault()}>𝕏</a>
                        <a href="#" className="eb-social-icon" onClick={(e) => e.preventDefault()}>f</a>
                        <a href="#" className="eb-social-icon" onClick={(e) => e.preventDefault()}>in</a>
                        <a href="#" className="eb-social-icon" onClick={(e) => e.preventDefault()}>ig</a>
                    </div>
                );
            case 'footer':
                return (
                    <div className="eb-render-footer">
                        {block.preview.split('\n').map((line, i) => (
                            <React.Fragment key={i}>
                                {line.includes('Unsubscribe') ? (
                                    <>
                                        {line.split('·').map((part, j) => (
                                            <React.Fragment key={j}>
                                                {j > 0 && ' · '}
                                                <a href="#" onClick={(e) => e.preventDefault()}>{part.trim()}</a>
                                            </React.Fragment>
                                        ))}
                                    </>
                                ) : (
                                    line
                                )}
                                {i < block.preview.split('\n').length - 1 && <br />}
                            </React.Fragment>
                        ))}
                    </div>
                );
            default:
                return <div className="eb-render-text">{block.preview}</div>;
        }
    };

    /* ============================================================
       RENDER: Center Canvas
       ============================================================ */
    const renderCanvas = () => (
        <div className="eb-canvas-wrapper">
            {/* Scrollable coloured area — uses the template's email background color */}
            <div
                className="eb-canvas-scroll-area"
                style={{ backgroundColor: settings.bgColor }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDropOnCanvas}
            >


                {/* Inner white email card */}
                <div
                    className={`eb-email-canvas ${viewMode === 'mobile' ? 'mobile' : ''}`}
                    style={{
                        background: settings.contentBg,
                        width: viewMode === 'mobile' ? '375px' : `${settings.contentWidth}px`,
                        borderRadius: "30px",
                        overflow: 'hidden',
                        padding: "30px 20px",
                    }}
                >
                    {blocks.length === 0 && (
                        <div
                            style={{ padding: 60, textAlign: 'center', color: '#94a3b8' }}
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDropOnCanvas}
                        >
                            <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#cbd5e1' }}>email</span>
                            <p style={{ marginTop: 12 }}>Drag an element or click on the left to start building</p>
                        </div>
                    )}

                    {blocks.map((block) => (
                        <div
                            key={block.id}
                            draggable
                            className={`eb-block ${selectedBlockId === block.id ? 'selected' : ''}`}
                            onClick={() => setSelectedBlockId(block.id)}
                            onDragStart={(e) => { e.stopPropagation(); handleDragStartBlock(block.id); }}
                            onDragOver={(e) => { e.stopPropagation(); handleDragOverBlock(e, block.id); }}
                            onDragLeave={(e) => { e.stopPropagation(); handleDragLeaveBlock(e); }}
                            onDrop={(e) => { e.stopPropagation(); handleDropBlock(e, block.id); }}
                        >
                            <div className="eb-block-actions">
                                <button title="Move up" onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'up'); }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_upward</span>
                                </button>
                                <button title="Move down" onClick={(e) => { e.stopPropagation(); moveBlock(block.id, 'down'); }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>arrow_downward</span>
                                </button>
                                <button title="Duplicate" onClick={(e) => { e.stopPropagation(); duplicateBlock(block.id); }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>content_copy</span>
                                </button>
                                <button className="delete" title="Delete" onClick={(e) => { e.stopPropagation(); deleteBlock(block.id); }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 14 }}>delete</span>
                                </button>
                            </div>
                            {renderBlockContent(block)}
                        </div>
                    ))}

                    {/* Add Text Block — inside the card at the bottom */}
                    <button className="eb-add-block-btn" onClick={() => addBlock('text')}>
                        <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span>
                        Add Text Block
                    </button>
                </div>

                {/* Canvas footer label */}
                <div className="eb-canvas-footer">
                    {viewMode === 'desktop' ? 'Desktop' : 'Mobile'} preview — {settings.contentWidth}px
                </div>
            </div>
        </div>
    );

    /* ============================================================
       RENDER: Right Sidebar — Email Settings (no block selected)
       ============================================================ */
    const renderEmailSettings = () => (
        <div className="eb-right-body">
            <div className="eb-prop-section">
                <h4>Email Settings</h4>

                <div className="eb-prop-field">
                    <label>Template Name</label>
                    <input
                        type="text"
                        value={settings.name}
                        onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                    />
                </div>
                <div className="eb-prop-field">
                    <label>Subject Line</label>
                    <input
                        type="text"
                        value={settings.subject}
                        onChange={(e) => setSettings({ ...settings, subject: e.target.value })}
                    />
                </div>
                <div className="eb-prop-field">
                    <label>Preheader Text</label>
                    <input
                        type="text"
                        value={settings.preheader}
                        onChange={(e) => setSettings({ ...settings, preheader: e.target.value })}
                    />
                </div>
            </div>

            <div className="eb-prop-section">
                <h4>Canvas</h4>

                <div className="eb-prop-field">
                    <label>Email Background</label>
                    <div className="eb-color-input-group">
                        <input
                            type="color"
                            value={settings.bgColor}
                            onChange={(e) => setSettings({ ...settings, bgColor: e.target.value })}
                        />
                        <input
                            type="text"
                            value={settings.bgColor}
                            onChange={(e) => setSettings({ ...settings, bgColor: e.target.value })}
                        />
                    </div>
                </div>

                <div className="eb-prop-field">
                    <label>Content Background</label>
                    <div className="eb-color-input-group">
                        <input
                            type="color"
                            value={settings.contentBg}
                            onChange={(e) => setSettings({ ...settings, contentBg: e.target.value })}
                        />
                        <input
                            type="text"
                            value={settings.contentBg}
                            onChange={(e) => setSettings({ ...settings, contentBg: e.target.value })}
                        />
                    </div>
                </div>

                <div className="eb-prop-field">
                    <label>Content Width (px)</label>
                    <div className="eb-width-input-group">
                        <input
                            type="number"
                            value={settings.contentWidth}
                            onChange={(e) => setSettings({ ...settings, contentWidth: Number(e.target.value) })}
                            min={320}
                            max={900}
                        />
                        <span>px</span>
                    </div>
                </div>
            </div>

            <div className="eb-prop-section">
                <h4>Typography</h4>
                <div className="eb-prop-field">
                    <label>Font Family</label>
                    <select
                        value={settings.fontFamily}
                        onChange={(e) => setSettings({ ...settings, fontFamily: e.target.value })}
                    >
                        <option value="Inter">Inter</option>
                        <option value="Arial">Arial</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Verdana">Verdana</option>
                        <option value="Roboto">Roboto</option>
                    </select>
                </div>
            </div>

            <div className="eb-right-empty">
                <span className="material-symbols-outlined">touch_app</span>
                <p>Click any block to edit its properties</p>
            </div>
        </div>
    );

    /* ============================================================
       RENDER: Right Sidebar — Block Properties (block selected)
       ============================================================ */
    const renderBlockProperties = (block: EmailBlock) => (
        <div className="eb-right-body">
            <div className="eb-prop-section">
                <h4>Block Properties</h4>

                <div className="eb-prop-field">
                    <label>Content</label>
                    {block.type === 'text' || block.type === 'footer' ? (
                        <textarea
                            rows={4}
                            value={block.preview}
                            onChange={(e) => updateBlock(block.id, { preview: e.target.value })}
                        />
                    ) : (
                        <input
                            type="text"
                            value={block.preview}
                            onChange={(e) => updateBlock(block.id, { preview: e.target.value })}
                        />
                    )}
                </div>

                {block.type === 'image' && (
                    <div className="eb-prop-field">
                        <label>Image URL</label>
                        <input
                            type="url"
                            placeholder="https://example.com/image.jpg"
                            value={block.src || ''}
                            onChange={(e) => updateBlock(block.id, { src: e.target.value })}
                        />
                    </div>
                )}

                {block.type === 'button' && (
                    <div className="eb-prop-field">
                        <label>Link URL</label>
                        <input
                            type="url"
                            placeholder="https://example.com"
                            value={block.href || ''}
                            onChange={(e) => updateBlock(block.id, { href: e.target.value })}
                        />
                    </div>
                )}

                {block.type === 'columns' && (
                    <>
                        <div className="eb-prop-field">
                            <label>Left Column</label>
                            <textarea
                                rows={3}
                                value={block.leftContent || ''}
                                onChange={(e) => updateBlock(block.id, { leftContent: e.target.value })}
                            />
                        </div>
                        <div className="eb-prop-field">
                            <label>Right Column</label>
                            <textarea
                                rows={3}
                                value={block.rightContent || ''}
                                onChange={(e) => updateBlock(block.id, { rightContent: e.target.value })}
                            />
                        </div>
                    </>
                )}
            </div>

            {/* Style section for applicable blocks */}
            {(block.type === 'header' || block.type === 'heading' || block.type === 'text' || block.type === 'button') && (
                <div className="eb-prop-section">
                    <h4>Style</h4>

                    {(block.type === 'header' || block.type === 'button') && (
                        <div className="eb-prop-field">
                            <label>Background</label>
                            <div className="eb-color-input-group">
                                <input
                                    type="color"
                                    value={block.bgColor || '#4f46e5'}
                                    onChange={(e) => updateBlock(block.id, { bgColor: e.target.value })}
                                />
                                <input
                                    type="text"
                                    value={block.bgColor || '#4f46e5'}
                                    onChange={(e) => updateBlock(block.id, { bgColor: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    <div className="eb-prop-field">
                        <label>Text Color</label>
                        <div className="eb-color-input-group">
                            <input
                                type="color"
                                value={block.textColor || (block.type === 'header' || block.type === 'button' ? '#ffffff' : '#1e293b')}
                                onChange={(e) => updateBlock(block.id, { textColor: e.target.value })}
                            />
                            <input
                                type="text"
                                value={block.textColor || (block.type === 'header' || block.type === 'button' ? '#ffffff' : '#1e293b')}
                                onChange={(e) => updateBlock(block.id, { textColor: e.target.value })}
                            />
                        </div>
                    </div>

                    {(block.type === 'heading' || block.type === 'text') && (
                        <>
                            <div className="eb-prop-field">
                                <label>Font Size</label>
                                <div className="eb-width-input-group">
                                    <input
                                        type="number"
                                        value={block.fontSize || (block.type === 'heading' ? 26 : 15)}
                                        onChange={(e) => updateBlock(block.id, { fontSize: Number(e.target.value) })}
                                        min={8}
                                        max={72}
                                    />
                                    <span>px</span>
                                </div>
                            </div>

                            <div className="eb-prop-field">
                                <label>Alignment</label>
                                <div className="eb-align-group">
                                    {['left', 'center', 'right'].map((a) => (
                                        <button
                                            key={a}
                                            className={(block.align || 'left') === a ? 'active' : ''}
                                            onClick={() => updateBlock(block.id, { align: a })}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
                                                {a === 'left' ? 'format_align_left' : a === 'center' ? 'format_align_center' : 'format_align_right'}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Padding section */}
            <div className="eb-prop-section">
                <h4>Padding</h4>
                <div className="eb-padding-grid">
                    <div className="eb-prop-field">
                        <label>Top</label>
                        <input
                            type="number"
                            value={block.paddingTop ?? 24}
                            onChange={(e) => updateBlock(block.id, { paddingTop: Number(e.target.value) })}
                            min={0}
                        />
                    </div>
                    <div className="eb-prop-field">
                        <label>Right</label>
                        <input
                            type="number"
                            value={block.paddingRight ?? 40}
                            onChange={(e) => updateBlock(block.id, { paddingRight: Number(e.target.value) })}
                            min={0}
                        />
                    </div>
                    <div className="eb-prop-field">
                        <label>Bottom</label>
                        <input
                            type="number"
                            value={block.paddingBottom ?? 24}
                            onChange={(e) => updateBlock(block.id, { paddingBottom: Number(e.target.value) })}
                            min={0}
                        />
                    </div>
                    <div className="eb-prop-field">
                        <label>Left</label>
                        <input
                            type="number"
                            value={block.paddingLeft ?? 40}
                            onChange={(e) => updateBlock(block.id, { paddingLeft: Number(e.target.value) })}
                            min={0}
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    /* ============================================================
       RENDER: Right Sidebar
       ============================================================ */
    const renderRightSidebar = () => (
        <div className="eb-right">
            <div className="eb-right-header">
                <h3>
                    {selectedBlock
                        ? `${ELEMENT_TYPES.find((e) => e.type === selectedBlock.type)?.label ?? selectedBlock.type} Properties`
                        : 'Email Settings'}
                </h3>
                {selectedBlock && (
                    <button
                        className="eb-btn-outline"
                        style={{ padding: '4px 10px', fontSize: 12 }}
                        onClick={() => setSelectedBlockId(null)}
                    >
                        ← Back
                    </button>
                )}
            </div>
            {selectedBlock ? renderBlockProperties(selectedBlock) : renderEmailSettings()}
        </div>
    );

    /* ============================================================
       RENDER: Root
       ============================================================ */
    return (
        <div className="eb-root">
            {/* Full-width Top Bar */}
            <div className="eb-topbar">
                <div className="eb-topbar-left">
                    <div className="eb-logo" style={{ background: 'transparent', color: '#4f46e5' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: 24 }}>auto_awesome_mosaic</span>
                    </div>
                    <div className="eb-breadcrumb">
                        <span>{settings.name || 'Untitled Email'}</span>
                    </div>
                    <div className="eb-topbar-actions" style={{ marginLeft: 16, display: 'flex', gap: 4 }}>
                        <button title="Undo (Coming soon)" style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>undo</span>
                        </button>
                        <button title="Redo (Coming soon)" style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: 4 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>redo</span>
                        </button>
                    </div>
                </div>

                <div className="eb-view-toggle">
                    <button
                        className={viewMode === 'desktop' ? 'active' : ''}
                        onClick={() => setViewMode('desktop')}
                        type="button"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>desktop_windows</span>
                        Desktop
                    </button>
                    <button
                        className={viewMode === 'mobile' ? 'active' : ''}
                        onClick={() => setViewMode('mobile')}
                        type="button"
                    >
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>smartphone</span>
                        Mobile
                    </button>
                </div>

                <div className="eb-topbar-right" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className="eb-block-count">{blocks.length} blocks</span>
                    <button className="eb-btn-outline" onClick={() => window.open(backUrl)} type="button">
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>visibility</span>
                        Preview
                    </button>
                    <button className="eb-btn-primary" onClick={handleSave} disabled={saving} type="button">
                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>save</span>
                        {saving ? 'Saving…' : 'Save'}
                    </button>
                </div>
            </div>

            <div className="eb-body">
                {renderLeftSidebar()}
                {renderCanvas()}
                {renderRightSidebar()}
            </div>
        </div>
    );
}
