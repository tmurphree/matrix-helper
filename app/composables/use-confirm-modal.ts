export const useConfirmModal = () => {
    const confirmModal = reactive({ open: false, content: '' });

    let resolvePendingConfirmation: ((userAgreed: boolean) => void) | undefined;

    const askConfirmation = ({ content }: { content: string }): Promise<boolean> => {
        // A new question supersedes an unanswered one, so the earlier caller does not wait forever.
        resolvePendingConfirmation?.(false);

        confirmModal.content = content;
        confirmModal.open = true;

        return new Promise<boolean>((resolve) => {
            resolvePendingConfirmation = resolve;
        });
    };

    const answerConfirmation = (userAgreed: boolean): void => {
        confirmModal.open = false;
        resolvePendingConfirmation?.(userAgreed);
        resolvePendingConfirmation = undefined;
    };

    return { answerConfirmation, askConfirmation, confirmModal };
};
