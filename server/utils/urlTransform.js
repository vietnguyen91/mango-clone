export function convertS3UrlToPath(s3Url) {
  if (!s3Url) return null;
  
  // If it's already a path (starts with /), return as-is
  if (s3Url.startsWith('/')) {
    return s3Url;
  }
  
  // Legacy: convert full URL to path for backward compatibility
  try {
    const url = new URL(s3Url);
    if (url.hostname === 'usc1.contabostorage.com') {
      return url.pathname;
    }
    return s3Url;
  } catch (error) {
    return s3Url;
  }
}

export function convertS3UrlsInObject(obj) {
  if (!obj) return obj;
  
  const converted = { ...obj };
  
  // Convert s3CoverUrl if exists
  if (converted.s3CoverUrl) {
    converted.s3CoverUrl = convertS3UrlToPath(converted.s3CoverUrl);
  }
  
  // Convert images s3Url if exists
  if (converted.images && Array.isArray(converted.images)) {
    converted.images = converted.images.map(image => ({
      ...image,
      s3Url: convertS3UrlToPath(image.s3Url)
    }));
  }
  
  return converted;
}