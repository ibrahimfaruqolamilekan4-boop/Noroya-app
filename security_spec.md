# Nooraya Security Specification

## Data Invariants
1. A **User** profile can only be created by the authenticated user themselves. The `role` cannot be set to 'admin' by the user.
2. A **Video** can only be created by a verified **Cleric**.
3. A **Question** must have a valid `userId` (the asker) and `clericId` (the responder).
4. Only the **Cleric** assigned to a question can update the `answer` and `status`.
5. Users can only see their own private questions or questions they are specifically part of (unless they are public - but let's stick to private counseling for now).
6. **Follows** and **Likes** must reflect the current user's identity.

## The Dirty Dozen Payloads

1. **Identity Spoofing**: User A tries to create a profile for User B.
2. **Privilege Escalation**: Normal user tries to set their role to 'admin'.
3. **Ghost Video**: Normal user tries to upload a video (restricted to Clerics).
4. **Unauthorized Answer**: User A tries to answer a question meant for Cleric B.
5. **Answer Tamper**: User tries to change a Cleric's answer.
6. **Self-Rating**: User tries to rate themselves (if rating system is separate).
7. **Orphaned Like**: Like created for a video that doesn't exist.
8. **Spam Follow**: Creating thousands of follows in one batch (needs size/rate limits if possible, but rules focus on identity).
9. **PII Leak**: Non-admin/non-owner tries to read user emails.
10. **Role Stealing**: User tries to change their role from 'user' to 'cleric' after creation.
11. **Outcome Injection**: User tries to set question status to 'answered' without an answer.
12. **ID Poisoning**: Using a 2KB string as a document ID.
