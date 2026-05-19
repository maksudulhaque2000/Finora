import { Settings2, ShieldCheck } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { SettingsForm } from '@/components/settings-form';
import { DeleteAccountButton } from '@/components/delete-account-button';
import { getWorkspace } from '@/lib/workspace';

export default async function SettingsPage() {
  const { session, organization } = await getWorkspace();

  return (
    <PageShell
      title="Settings"
      description="Update profile, organization preferences, currencies, theme settings, and export controls."
      actions={
        <Button type="submit" form="settings-form" className="bg-gold text-black hover:bg-gold-light">
          Save changes
        </Button>
      }
    >
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="glass-panel rounded-[28px] p-6">
            <div className="flex items-center gap-3">
              <Settings2 className="h-5 w-5 text-gold-light" />
              <h3 className="text-lg font-semibold text-white">Profile and organization</h3>
            </div>
            <div className="mt-5">
              <SettingsForm
                formId="settings-form"
                initialValues={{
                  name: session.user.name ?? 'Finora Admin',
                  email: session.user.email ?? 'admin@finora.app',
                  organizationName: organization.name,
                  currency: organization.currency,
                  description: organization.description ?? ''
                }}
              />
            </div>
          </div>

          <div className="glass-panel rounded-[28px] p-6">
            <h3 className="text-lg font-semibold text-white">Danger zone</h3>
            <p className="mt-2 text-sm text-white/60">This action permanently deletes your account and signs you out.</p>
            <DeleteAccountButton />
          </div>
        </div>

        <div className="glass-panel rounded-[28px] p-6">
          <ShieldCheck className="h-6 w-6 text-emerald" />
          <h3 className="mt-4 text-xl font-semibold text-white">Security posture</h3>
          <p className="mt-3 text-sm leading-6 text-white/60">
            Finora keeps the application protected behind route guards, hashes passwords securely, and sanitizes all form payloads before they reach the database.
          </p>
        </div>
      </div>
    </PageShell>
  );
}
