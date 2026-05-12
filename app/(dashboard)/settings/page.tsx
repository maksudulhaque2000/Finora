import { Settings2, ShieldCheck } from 'lucide-react';
import { PageShell } from '@/components/page-shell';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';

export default function SettingsPage() {
  return (
    <PageShell
      title="Settings"
      description="Update profile, organization preferences, currencies, theme settings, and export controls." 
      actions={<Button className="bg-gold text-black hover:bg-gold-light">Save changes</Button>}
    >
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <div className="glass-panel rounded-[28px] p-6">
            <div className="flex items-center gap-3">
              <Settings2 className="h-5 w-5 text-gold-light" />
              <h3 className="text-lg font-semibold text-white">Profile and organization</h3>
            </div>
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="profileName">Name</Label>
                <Input id="profileName" defaultValue="Finora Admin" />
              </div>
              <div>
                <Label htmlFor="profileEmail">Email</Label>
                <Input id="profileEmail" type="email" defaultValue="admin@finora.app" />
              </div>
              <div>
                <Label htmlFor="organizationName">Organization</Label>
                <Input id="organizationName" defaultValue="Finora Group" />
              </div>
              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select id="currency" defaultValue="BDT">
                  <option value="BDT">BDT</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </Select>
              </div>
            </div>
          </div>

          <div className="glass-panel rounded-[28px] p-6">
            <h3 className="text-lg font-semibold text-white">Danger zone</h3>
            <p className="mt-2 text-sm text-white/60">Destructive actions require confirmation and should be used carefully.</p>
            <Button variant="outline" className="mt-5 border-crimson/30 bg-crimson/10 text-crimson hover:bg-crimson/20">
              Delete account
            </Button>
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