# Firebase Firestore Security Specification

## Data Invariants
1. A user profile document at `/users/{userId}` can only be created and accessed by the authenticated user whose `request.auth.uid == userId`.
2. A user cannot assign themselves the `admin` role or elevate their privileges.
3. Every project at `/users/{userId}/projects/{projectId}` must have `userId == request.auth.uid == userId`.
4. Projects, chat sessions, and messages can only be read, created, updated, or deleted by their respective owning user.
5. All document IDs must be validated with `isValidId(id)` matching alphanumeric and hyphen/underscore characters up to 128 chars.
6. Updates must maintain immutable identity fields (`uid`, `userId`, `id`, `createdAt`).
7. Content string fields must be strictly length-bounded to prevent denial of wallet attacks.

## The "Dirty Dozen" Threat Payloads
1. **Ghost Field / Shadow Field Injection**: `{ id: 'proj1', userId: 'uid1', title: 'Ad', hackedField: true }` -> REJECTED (strict schema).
2. **Identity Spoofing on Project**: Authenticated as `userA` attempting to write `/users/userB/projects/p1` -> REJECTED (path and owner mismatch).
3. **Privilege Escalation on User Profile**: Non-admin user attempts to set `role: "admin"` -> REJECTED.
4. **ID Poisoning Attack**: Passing a 2KB junk character string as `{projectId}` -> REJECTED (isValidId check).
5. **Denial of Wallet - Message Overflow**: Sending a 5MB message string in `chatMessage.content` -> REJECTED (max 20,000 chars).
6. **Unauthenticated Read**: Attempting to list `/users` without authentication -> REJECTED (default deny).
7. **Cross-Tenant Project Snoop**: User A queries `/users/{userB}/projects` -> REJECTED.
8. **Immutability Bypass**: Attempting to change `createdAt` or `userId` in an existing project -> REJECTED.
9. **Chat Session Hijack**: User A writes to User B's `/users/{userB}/chats/{chatId}/messages` -> REJECTED.
10. **State Shortcutting / Invalid Status**: Setting `status: "invalid_status"` -> REJECTED (enum validation).
11. **Blanket Query Scraping**: Attempting an unrestricted collectionGroup query on all messages -> REJECTED.
12. **Missing Required Fields**: Creating a project without `title` or `userId` -> REJECTED.
