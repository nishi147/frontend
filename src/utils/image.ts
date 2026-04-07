/**
 * Smart Image URL Helper
 * Handles both relative local paths (API storage) and absolute URLs (Cloudinary/S3).
 */
export const getThumbnailUrl = (thumbnail: string | undefined): string => {
  if (!thumbnail || thumbnail === 'no-image.jpg') return "";
  
  if (thumbnail.startsWith('http')) {
    return thumbnail;
  }

  const apiUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '');
  const cleanThumb = thumbnail.startsWith('/') ? thumbnail : `/${thumbnail}`;
  
  return `${apiUrl}${cleanThumb}`;
};
