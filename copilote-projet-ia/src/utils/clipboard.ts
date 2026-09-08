import { ClipboardError } from '@/utils/errors';

export async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    throw new ClipboardError(error);
  }
}
