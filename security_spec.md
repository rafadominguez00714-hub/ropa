# Security Specification for Atelier Minimal Clothing Catalog

## 1. Data Invariants
1. **Public Catalog Visibility**: Anyone (including unauthenticated visitors) can read (`get`, `list`) items in `/clothes` and `/settings` to browse the static boutique lookbook and prices.
2. **Catalog Integrity & Length Bound**: Only authorized administrators can create, update, or delete clothing items. All text fields have strict length guards (`name` <= 150, `description` <= 2000, `category` <= 64, `materials` <= 256).
3. **Price Bounds**: `price` must be a positive number (`price >= 0` and `price <= 1000000`). If `originalPrice` is provided, it must also be non-negative.
4. **Stock Integrity**: `stockStatus` can only be one of `['in_stock', 'low_stock', 'out_of_stock']`.
5. **Array Guards**: `images` must be a list with `<= 10` URLs. `sizes` must be a list with `<= 10` items. `colors` must be a list with `<= 10` items.
6. **Setting Integrity**: Store settings can only be altered with valid schema and length constraints.
7. **Document ID Hardening**: Document IDs must satisfy `isValidId(id)` (alphanumeric, hyphen, underscore, length <= 128) on individual document writes.

## 2. The Dirty Dozen Payloads (Designed to Break Identity, Integrity, and State)
1. **Payload 1 (Massive Name Injection)**: `{ name: "A".repeat(1000), price: 90, category: "Tops" }` -> Rejection: Exceeds name maxLength.
2. **Payload 2 (Negative Price Hack)**: `{ name: "Linen Shirt", price: -50, category: "Camisas" }` -> Rejection: Price must be non-negative.
3. **Payload 3 (Arbitrary Script Field)**: `{ name: "Dress", price: 120, ghostAdminField: true }` -> Rejection: Strict schema key constraint violation.
4. **Payload 4 (Array Flooding Attack)**: `{ name: "Pants", price: 80, images: new Array(500).fill("url") }` -> Rejection: Array size exceeds 10 items.
5. **Payload 5 (Invalid Stock Status State)**: `{ name: "Coat", price: 250, stockStatus: "free_giveaway" }` -> Rejection: stockStatus not in allowlist.
6. **Payload 6 (String Price Coercion)**: `{ name: "Scarf", price: "free", category: "Accesorios" }` -> Rejection: price is not number.
7. **Payload 7 (Path Traversal / Malicious ID)**: Write to `/clothes/../../secrets/admin` -> Rejection: Path regex guard blocks non-alphanumeric ID.
8. **Payload 8 (Unauthorized Deletion)**: Delete from anonymous client when admin privileges are required -> Rejection: PERMISSION_DENIED.
9. **Payload 9 (Oversized Description Attack)**: `{ description: "X".repeat(50000) }` -> Rejection: description exceeds 2000 characters.
10. **Payload 10 (Non-array Sizes injection)**: `{ sizes: "XS,S,M,L" }` -> Rejection: sizes is not a list.
11. **Payload 11 (Settings Manipulation Ghost Keys)**: Update `/settings/global` with unauthorized server-side configuration -> Rejection: Keys not in whitelist.
12. **Payload 12 (Negative originalPrice)**: `{ originalPrice: -100 }` -> Rejection: originalPrice cannot be negative.

## 3. Test Verification
All 12 payloads must be rejected by the Firestore security validation functions and return PERMISSION_DENIED on unauthorized or malformed operations.
