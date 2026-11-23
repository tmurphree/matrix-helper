import { describe, expect, it } from 'vitest';

import { useConfirmModal } from './use-confirm-modal';

describe('useConfirmModal', () => {
    describe('askConfirmation', () => {
        it('opens the modal with the content', () => {
            const { askConfirmation, confirmModal } = useConfirmModal();

            void askConfirmation({ content: 'Sure?' });

            expect(confirmModal.open).toBe(true);
            expect(confirmModal.content).toBe('Sure?');
        });

        it('stays pending until the user answers', async () => {
            const { answerConfirmation, askConfirmation } = useConfirmModal();
            let settled = false;

            const confirmation = askConfirmation({ content: 'Sure?' }).then((userAgreed) => {
                settled = true;
                return userAgreed;
            });
            await Promise.resolve();

            expect(settled).toBe(false);

            answerConfirmation(true);

            await expect(confirmation).resolves.toBe(true);
        });

        it('resolves an unanswered earlier question with false when a new one is asked', async () => {
            const { answerConfirmation, askConfirmation } = useConfirmModal();

            const firstConfirmation = askConfirmation({ content: 'First?' });
            const secondConfirmation = askConfirmation({ content: 'Second?' });
            answerConfirmation(true);

            await expect(firstConfirmation).resolves.toBe(false);
            await expect(secondConfirmation).resolves.toBe(true);
        });
    });

    describe('answerConfirmation', () => {
        it.each([true, false])('closes the modal and resolves with %s', async (userAgreed) => {
            const { answerConfirmation, askConfirmation, confirmModal } = useConfirmModal();

            const confirmation = askConfirmation({ content: 'Sure?' });
            answerConfirmation(userAgreed);

            expect(confirmModal.open).toBe(false);
            await expect(confirmation).resolves.toBe(userAgreed);
        });

        it('does nothing when no question is pending', () => {
            const { answerConfirmation, confirmModal } = useConfirmModal();

            answerConfirmation(true);

            expect(confirmModal.open).toBe(false);
        });
    });
});
