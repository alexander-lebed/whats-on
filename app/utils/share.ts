/**
 * Checks if the Web Share API is available
 */
export const canUseNativeShare = (): boolean => {
  return typeof navigator !== 'undefined' && 'share' in navigator;
};

type ShareData = {
  title: string;
  text: string;
  url: string;
};

/**
 * Uses the native Web Share API if available
 */
export const shareNative = async (data: ShareData): Promise<boolean> => {
  if (!canUseNativeShare()) {
    return false;
  }

  try {
    await navigator.share(data);
    return true;
  } catch (error) {
    // User cancelled or error occurred
    if (error instanceof Error && error.name !== 'AbortError') {
      console.error('Error sharing:', error);
    }
    return false;
  }
};

/**
 * Copies text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  } catch (error) {
    console.error('Error copying to clipboard:', error);
    return false;
  }
};

/**
 * Generates share URL for Facebook
 */
export const getFacebookShareUrl = (url: string): string => {
  const params = new URLSearchParams({ u: url });
  return `https://www.facebook.com/sharer/sharer.php?${params.toString()}`;
};

/**
 * Generates share URL for WhatsApp
 */
export const getWhatsAppShareUrl = (url: string, text?: string): string => {
  const message = text ? `${text} ${url}` : url;
  const params = new URLSearchParams({ text: message });
  return `https://wa.me/?${params.toString()}`;
};

/**
 * Generates share URL for Telegram
 */
export const getTelegramShareUrl = (url: string, text?: string): string => {
  const params = new URLSearchParams({ url });
  if (text) {
    params.append('text', text);
  }
  return `https://t.me/share/url?${params.toString()}`;
};
