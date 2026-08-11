import { Head, router } from "@inertiajs/react";
import EmailBuilder from "@/components/EmailBuilder/EmailBuilder";
import type { EmailDesign } from "@/components/EmailBuilder/types";
import { useState } from "react";
import MainLayout from "@/layouts/main-layout";

interface TeamOption {
    id: number;
    team_name: string;
}

interface UserOption {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
}

interface EmailTemplateData {
    id: number;
    team_id: number | null;
    creator_id: number | null;
    template_type: string;
    title: string | null;
    sub_title: string | null;
    template: string | null;
    design: any;
}

interface Props {
    emailTemplate: EmailTemplateData;
    teams?: TeamOption[];
    users?: UserOption[];
}

export default function Edit({ emailTemplate }: Props) {
    const [saving, setSaving] = useState(false);

    // Parse the design if it's a string
    const parsedDesign: EmailDesign | null = (() => {
        if (!emailTemplate.design) return null;
        if (typeof emailTemplate.design === 'string') {
            try {
                return JSON.parse(emailTemplate.design);
            } catch (_) {
                return null;
            }
        }

        return emailTemplate.design as EmailDesign;
    })();

    const handleSave = (design: EmailDesign) => {
        setSaving(true);
        router.put(
            `/admin/email-templates/${emailTemplate.id}`,
            {
                team_id: emailTemplate.team_id ?? '',
                creator_id: emailTemplate.creator_id ?? '',
                template_type: emailTemplate.template_type || 'private',
                title: design.settings.name || emailTemplate.title || '',
                sub_title: design.settings.subject || emailTemplate.sub_title || '',
                template: emailTemplate.template || '',
                design: JSON.stringify(design),
            },
            {
                preserveScroll: true,
                onFinish: () => setSaving(false),
            },
        );
    };

    return (
        <>
            <Head title="Email Builder" />
            <EmailBuilder
                initialDesign={parsedDesign}
                templateTitle={emailTemplate.title || 'Untitled Template'}
                onSave={handleSave}
                saving={saving}
                backUrl="/admin/email-templates"
            />
        </>
    );
}
