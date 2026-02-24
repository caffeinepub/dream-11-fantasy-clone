import { useState } from 'react';
import { useIsStripeConfigured, useIsCallerAdmin } from '../hooks/useQueries';
import { useActor } from '../hooks/useActor';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import type { StripeConfiguration } from '../backend';

export default function StripePaymentSetup() {
  const { data: isConfigured, isLoading: configLoading } = useIsStripeConfigured();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();
  const { actor } = useActor();
  const [open, setOpen] = useState(false);
  const [secretKey, setSecretKey] = useState('');
  const [countries, setCountries] = useState('US,CA,GB');
  const [saving, setSaving] = useState(false);

  if (configLoading || adminLoading) return null;
  if (isConfigured || !isAdmin) return null;

  const handleSave = async () => {
    if (!secretKey.trim()) {
      toast.error('Please enter Stripe secret key');
      return;
    }

    setSaving(true);
    try {
      const config: StripeConfiguration = {
        secretKey: secretKey.trim(),
        allowedCountries: countries.split(',').map(c => c.trim()).filter(Boolean),
      };
      await actor?.setStripeConfiguration(config);
      toast.success('Stripe configured successfully!');
      setOpen(false);
      window.location.reload();
    } catch (error) {
      toast.error('Failed to configure Stripe');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Alert className="mb-4">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Stripe payment is not configured. Please set up Stripe to enable payments.
          <Button variant="link" className="ml-2 p-0 h-auto" onClick={() => setOpen(true)}>
            Configure Now
          </Button>
        </AlertDescription>
      </Alert>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Configure Stripe Payment</DialogTitle>
            <DialogDescription>
              Enter your Stripe secret key and allowed countries to enable payment processing.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="secretKey">Stripe Secret Key</Label>
              <Input
                id="secretKey"
                type="password"
                placeholder="sk_test_..."
                value={secretKey}
                onChange={(e) => setSecretKey(e.target.value)}
                disabled={saving}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="countries">Allowed Countries (comma-separated)</Label>
              <Input
                id="countries"
                placeholder="US,CA,GB"
                value={countries}
                onChange={(e) => setCountries(e.target.value)}
                disabled={saving}
              />
            </div>
            <Button onClick={handleSave} disabled={saving} className="w-full">
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Configuration'
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
