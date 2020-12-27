export const emailIsValid = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export const getS3ImageLink = (imageId: string): string => {
  return `https://fitme.s3.amazonaws.com/${imageId}.jpg`;
}