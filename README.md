# Riccardo Workout v19

- Fixed signup handler bug that prevented account creation.
- Signup now requires a password of at least 8 characters, including lowercase, uppercase, and a number.
- Password confirmation is checked before calling Supabase.
- Added live password-strength and password-match feedback.
- Submit button shows progress while creating the account.
