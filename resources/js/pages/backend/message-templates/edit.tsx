import { Head } from '@inertiajs/react';
import MessageTemplateForm from './form';
export default function Edit({ messageTemplate, teams = [], users = [] }: any) { return <><Head title="Edit Message Template" /><h3 className="mb-20">Edit Message Template</h3><MessageTemplateForm template={messageTemplate} teams={teams} users={users} /></>; }
