import { Head, Link } from "@inertiajs/react";
import { useState } from "react";

interface EmailTemplateData {
    id: number;
    title: string | null;
    sub_title: string | null;
    template_type: "private" | "public";
    template: string | null;
    design: string | null;
    team?: {
        id: number;
        team_name: string;
    } | null;
    creator?: {
        id: number;
        first_name: string;
        last_name: string;
        email: string;
    } | null;
    created_at: string;
}

interface Props {
    emailTemplate: EmailTemplateData;
}

function generatePreviewHtml(design: any): string {
    if (!design || !design.settings || !design.blocks) {
        return "<div style='font-family:sans-serif; text-align:center; padding: 40px; color: #666;'><em>No template content available</em></div>";
    }

    const { settings, blocks } = design;

    const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>${settings.subject || settings.name || "Email Preview"}</title>
            <style>
                body {
                    margin: 0;
                    padding: 40px 0;
                    background-color: ${settings.bgColor || "#F1F5F9"};
                    font-family: ${settings.fontFamily || "Arial, sans-serif"};
                }
                .email-container {
                    max-width: ${settings.contentWidth || 600}px;
                    margin: 0 auto;
                    background-color: ${settings.contentBg || "#FFFFFF"};
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
                }
                .preheader {
                    display: none;
                    max-height: 0px;
                    overflow: hidden;
                }
                .block {
                    padding: 20px 40px;
                }
                .block-header {
                    background-color: #4f46e5;
                    color: white;
                    text-align: center;
                    padding: 30px 40px;
                    font-size: 24px;
                    font-weight: bold;
                }
                .block-heading {
                    font-size: 28px;
                    font-weight: bold;
                    color: #1f2937;
                    text-align: center;
                }
                .block-text {
                    font-size: 16px;
                    line-height: 1.6;
                    color: #4b5563;
                    text-align: center;
                }
                .block-button {
                    text-align: center;
                    margin: 20px 0;
                }
                .block-button a {
                    display: inline-block;
                    background-color: #4f46e5;
                    color: white;
                    text-decoration: none;
                    padding: 14px 32px;
                    border-radius: 6px;
                    font-weight: bold;
                }
                .block-image {
                    text-align: center;
                    background-color: #f3f4f6;
                    padding: 60px;
                    color: #9ca3af;
                    border: 2px dashed #d1d5db;
                    margin: 20px 40px;
                    border-radius: 8px;
                }
                .block-divider {
                    border-top: 1px solid #e5e7eb;
                    margin: 10px 40px;
                }
                .block-social {
                    text-align: center;
                    margin: 20px 0;
                }
                .social-icon {
                    display: inline-block;
                    width: 36px;
                    height: 36px;
                    background-color: #4f46e5;
                    color: white;
                    border-radius: 50%;
                    line-height: 36px;
                    margin: 0 5px;
                    font-size: 14px;
                    text-decoration: none;
                    font-weight: bold;
                }
                .block-footer {
                    background-color: #f9fafb;
                    color: #6b7280;
                    text-align: center;
                    font-size: 12px;
                    padding: 30px 40px;
                    border-top: 1px solid #e5e7eb;
                }
            </style>
        </head>
        <body>
            ${settings.preheader ? `<div class="preheader">${settings.preheader}</div>` : ""}
            <div class="email-container">
                ${blocks.map((b: any) => {
        switch (b.type) {
            case 'header':
                return `<div class="block-header">✉️ ${b.preview}</div>`;
            case 'heading':
                return `<div class="block block-heading">${b.preview}</div>`;
            case 'text':
                return `<div class="block block-text">${b.preview}</div>`;
            case 'button':
                return `<div class="block-button"><a href="#">${b.preview}</a></div>`;
            case 'image':
                return `
        <div class="block-image">
            <img
                src="${b.src}"
                alt="${b.preview ?? 'Image'}"
                style="max-width:100%;height:auto;border-radius:8px;"
            />
        </div>
    `;
            case 'divider':
                return `<div class="block-divider"></div>`;
            case 'spacer':
                return `<div class="" style="height:30px;"></div>`;
            case 'social':
                return `
                                <div class="block-social">
                                    <a href="#" class="social-icon">f</a>
                                    <a href="#" class="social-icon">t</a>
                                    <a href="#" class="social-icon">in</a>
                                </div>`;
            case 'footer':
                return `<div class="block-footer">${(b.preview || "").replace(/\\n/g, '<br/>')}</div>`;
            default:
                return `<div class="block">${b.preview || JSON.stringify(b)}</div>`;
        }
    }).join('')}
            </div>
        </body>
        </html>
    `;

    return html;
}

export default function Show({ emailTemplate }: Props) {
    const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");

    const parsedDesign = typeof emailTemplate.design === 'string'
        ? (function () {
            try {
                return JSON.parse(emailTemplate.design);
            } catch (_) {
                return null;
            }
        })()
        : emailTemplate.design;

    const previewHtml = emailTemplate.template || generatePreviewHtml(parsedDesign);

    return (
        <>
            <Head title={`Template: ${emailTemplate.title}`} />

            <div className="row">
                <div className="col-lg-4">
                    <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                        <div className="text-center d-flex flex-column align-items-center mb-4">
                            <div
                                className="rounded-circle mb-3 d-flex align-items-center justify-content-center text-white"
                                style={{ width: "90px", height: "90px", backgroundColor: "#4f46e5", boxShadow: "0 4px 15px rgba(79, 70, 229, 0.3)" }}
                            >
                                <i className="material-symbols-outlined" style={{ fontSize: "40px" }}>mark_email_read</i>
                            </div>
                            <h3 className="mb-1 fw-bold">{emailTemplate.title}</h3>
                            {emailTemplate.sub_title && (
                                <p className="text-muted mb-3 fs-14">{emailTemplate.sub_title}</p>
                            )}
                            <span
                                className={`badge px-3 py-2 fs-13 ${emailTemplate.template_type === "public" ? "bg-success" : "bg-secondary"}`}
                            >
                                {emailTemplate.template_type.toUpperCase()}
                            </span>
                        </div>

                        <hr className="text-muted opacity-25 my-4" />

                        <div>
                            <div className="mb-4">
                                <label className="label fs-13 text-muted mb-1 d-block text-uppercase fw-semibold">Team Ownership</label>
                                <div className="d-flex align-items-center gap-2">
                                    <i className="material-symbols-outlined text-muted fs-18">group</i>
                                    <span className="fw-medium text-dark">{emailTemplate.team?.team_name || "—"}</span>
                                </div>
                            </div>
                            <div className="mb-4">
                                <label className="label fs-13 text-muted mb-1 d-block text-uppercase fw-semibold">Created By</label>
                                <div className="d-flex align-items-center gap-2">
                                    <i className="material-symbols-outlined text-muted fs-18">person</i>
                                    <span className="fw-medium text-dark">
                                        {emailTemplate.creator
                                            ? `${emailTemplate.creator.first_name} ${emailTemplate.creator.last_name}`
                                            : "—"}
                                    </span>
                                </div>
                            </div>
                            <div>
                                <label className="label fs-13 text-muted mb-1 d-block text-uppercase fw-semibold">Creation Date</label>
                                <div className="d-flex align-items-center gap-2">
                                    <i className="material-symbols-outlined text-muted fs-18">calendar_today</i>
                                    <span className="fw-medium text-dark">
                                        {new Date(emailTemplate.created_at).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-lg-8">
                    <div className="card bg-white p-20 rounded-10 border border-white mb-4">
                        <div className="d-flex justify-content-between align-items-center mb-4 pb-3 border-bottom">
                            <h3 className="mb-0 fw-bold">Template Preview</h3>
                            <div className="d-flex gap-2">
                                <Link href="/admin/email-templates" className="btn btn-light-primary text-primary">
                                    <i className="material-symbols-outlined fs-18 align-middle me-1">arrow_back</i>
                                    Back
                                </Link>
                                <Link href={`/admin/email-templates/${emailTemplate.id}/edit`} className="btn btn-primary text-white">
                                    <i className="material-symbols-outlined fs-18 align-middle me-1">edit</i>
                                    Edit Template
                                </Link>
                            </div>
                        </div>

                        <div className="mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-3">
                                <label className="label fs-14 fw-semibold text-dark mb-0">HTML Preview</label>
                                <div className="btn-group btn-group-sm shadow-sm" role="group">
                                    <button
                                        type="button"
                                        className={`btn ${viewMode === 'desktop' ? 'btn-primary' : 'btn-outline-secondary bg-white'}`}
                                        onClick={() => setViewMode('desktop')}
                                    >
                                        <i className="material-symbols-outlined fs-16 align-middle me-1">desktop_windows</i>
                                        Desktop
                                    </button>
                                    <button
                                        type="button"
                                        className={`btn ${viewMode === 'mobile' ? 'btn-primary' : 'btn-outline-secondary bg-white'}`}
                                        onClick={() => setViewMode('mobile')}
                                    >
                                        <i className="material-symbols-outlined fs-16 align-middle me-1">smartphone</i>
                                        Mobile
                                    </button>
                                </div>
                            </div>

                            <div className="bg-light rounded p-4 d-flex justify-content-center border" style={{ minHeight: "500px" }}>
                                <iframe
                                    srcDoc={previewHtml}
                                    title="Email Preview"
                                    className="border border-secondary-subtle rounded bg-white shadow"
                                    style={{
                                        width: viewMode === "desktop" ? "100%" : "375px",
                                        height: "600px",
                                        transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                                    }}
                                />
                            </div>
                        </div>

                        {emailTemplate.design && (
                            <div className="mb-2">
                                <label className="label fs-14 fw-semibold text-dark mb-2">Design Data (JSON)</label>
                                <div className="bg-dark rounded p-3 shadow-sm" style={{ maxHeight: "300px", overflowY: "auto" }}>
                                    <pre className="mb-0 font-monospace text-light" style={{ fontSize: "13px" }}>
                                        {(() => {
                                            try {
                                                if (typeof emailTemplate.design === 'string') {
                                                    return JSON.stringify(JSON.parse(emailTemplate.design), null, 2);
                                                }

                                                return JSON.stringify(emailTemplate.design, null, 2);
                                            } catch (_) {
                                                return String(emailTemplate.design);
                                            }
                                        })()}
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
