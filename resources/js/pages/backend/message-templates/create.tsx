import { Head } from '@inertiajs/react';
import MessageTemplateForm from './form';
export default function Create({ teams = [], users = [] }: any) { return <><Head title="Create Message Template" /><h3 className="mb-20">Create Message Template</h3><MessageTemplateForm teams={teams} users={users} /></>; }
