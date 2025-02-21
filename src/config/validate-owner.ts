export const protectAccountOwner = (
  ownerUserId: string,
  sessionUserId: string
) => {
  if (ownerUserId !== sessionUserId) {
    return false;
  }
  return true;
};
