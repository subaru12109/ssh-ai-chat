import db from './index'
import { users } from './schema'

export async function getUser(username: string) {
  return db.query.users.findFirst({
    where: (user, { eq }) => eq(user.username, username),
    orderBy: (user, { desc }) => desc(user.createdAt),
  })
}

export async function createOrUpdateUser(username: string, publicKey: string) {
  return db.insert(users).values({
    username,
    publicKey,
  }).onConflictDoUpdate({
    target: users.username,
    set: {
      publicKey,
    },
  })
}
