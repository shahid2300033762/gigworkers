import { getCurrentUser } from "./worker";

export async function getCurrentSession() {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }

  return { user };
}
