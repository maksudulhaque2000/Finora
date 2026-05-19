'use client';

import { useEffect, useState, useTransition } from 'react';
import { createPortal } from 'react-dom';
import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export function DeleteAccountButton() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmationText, setConfirmationText] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isPending) {
        setIsModalOpen(false);
        setConfirmationText('');
      }
    };

    window.addEventListener('keydown', onEscape);
    return () => window.removeEventListener('keydown', onEscape);
  }, [isModalOpen, isPending]);

  function closeModal() {
    if (isPending) {
      return;
    }

    setIsModalOpen(false);
    setConfirmationText('');
  }

  function handleDeleteConfirm() {
    if (confirmationText.trim() !== 'DELETE') {
      setError('Please type DELETE exactly to confirm account deletion.');
      return;
    }

    startTransition(async () => {
      setError(null);

      try {
        const response = await fetch('/api/settings', { method: 'DELETE' });
        const payload = (await response.json().catch(() => null)) as { error?: string } | null;

        if (!response.ok) {
          throw new Error(payload?.error ?? 'Failed to delete account.');
        }

        setIsModalOpen(false);
        setConfirmationText('');
        await signOut({ callbackUrl: '/login' });
      } catch (deleteError) {
        const message = deleteError instanceof Error ? deleteError.message : 'Failed to delete account.';
        setError(message);
        // eslint-disable-next-line no-console
        console.error('Account deletion failed', deleteError);
      }
    });
  }

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        disabled={isPending}
        onClick={() => {
          setError(null);
          setIsModalOpen(true);
        }}
        className="mt-5 border-crimson/30 bg-crimson/10 text-crimson hover:bg-crimson/20"
      >
        {isPending ? 'Deleting account...' : 'Delete account'}
      </Button>
      {error ? <p className="mt-3 text-sm text-crimson">{error}</p> : null}

      {isClient && isModalOpen
        ? createPortal(
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-3xl border border-crimson/25 bg-[#0f1727]/95 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
                <h4 className="text-xl font-semibold text-white">Delete account permanently?</h4>
                <p className="mt-2 text-sm leading-6 text-white/70">
                  This action will permanently remove your account and related workspace access. Type
                  <span className="mx-1 rounded-md border border-crimson/25 bg-crimson/10 px-2 py-0.5 font-semibold text-crimson">DELETE</span>
                  to confirm.
                </p>

                <div className="mt-5">
                  <Input
                    autoFocus
                    value={confirmationText}
                    onChange={(event) => setConfirmationText(event.target.value)}
                    placeholder="Type DELETE"
                    className="border-white/12 bg-white/5 text-white placeholder:text-white/40"
                  />
                </div>

                {error ? <p className="mt-3 text-sm text-crimson">{error}</p> : null}

                <div className="mt-6 flex items-center justify-end gap-3">
                  <Button type="button" variant="outline" onClick={closeModal} className="border-white/15 bg-white/5 text-white hover:bg-white/10">
                    Cancel
                  </Button>
                  <Button
                    type="button"
                    onClick={handleDeleteConfirm}
                    disabled={isPending || confirmationText.trim() !== 'DELETE'}
                    className="bg-crimson text-white hover:bg-crimson/90 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isPending ? 'Deleting...' : 'Confirm delete'}
                  </Button>
                </div>
              </div>
            </div>,
            document.body
          )
        : null}
    </div>
  );
}
