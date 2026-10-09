<p align="center">
  <img src="https://raw.githubusercontent.com/Devputta/Drafts-might-be-needed-/main/LOGO/Gemini_Generated_Image_1ppnm1ppnm1ppnm1%20(1).jfif" width="112" height="112" alt="CipherLink Logo" style="border-radius: 22px; box-shadow: 0 4px 14px rgba(0,0,0,0.12);" />
</p>

<h1 align="center">CipherLink</h1>

<p align="center">
  <strong>Private, Accountless, Client-Side Encrypted Messaging</strong>
</p>

<p align="center">
  <em>Zero-Knowledge Relay • AES-256-GCM In-Browser Cryptography • Encrypted Media & Self-Destruct</em>
</p>

<p align="center">
  <a href="https://github.com/Devputta/CipherLink-.git"><img src="https://img.shields.io/badge/repository-GitHub-181717?logo=github" alt="GitHub Repository" /></a>
  <a href="LICENSE.md"><img src="https://img.shields.io/badge/license-MIT-059669" alt="License: MIT" /></a>
  <a href="SECURITY.md"><img src="https://img.shields.io/badge/security-audited-0f766e" alt="Security Policy" /></a>
  <img src="https://img.shields.io/badge/encryption-AES--256--GCM-047857" alt="AES-256-GCM" />
  <img src="https://img.shields.io/badge/telemetry-zero-065f46" alt="Zero Telemetry" />
</p>

---

## 🌐 Project & Live Deployment

CipherLink is deployed and actively accessible through the following endpoints:

| Resource | Link | Description |
|---|---|---|
| **Production Application** | [ais-pre-xgapdwv2v4x4vtfeir6rax-708468648854.asia-east1.run.app](https://ais-pre-xgapdwv2v4x4vtfeir6rax-708468648854.asia-east1.run.app) | Live production deployment |
| **Development Preview** | [ais-dev-xgapdwv2v4x4vtfeir6rax-708468648854.asia-east1.run.app](https://ais-dev-xgapdwv2v4x4vtfeir6rax-708468648854.asia-east1.run.app) | Active staging / dev environment |
| **Source Repository** | [github.com/Devputta/CipherLink-](https://github.com/Devputta/CipherLink-.git) | Official project code & revisions |
| **Deployment Guide** | [DEPLOYMENT.md](DEPLOYMENT.md) | Render & Vercel deployment walkthrough |
| **Render Blueprint** | [render.yaml](render.yaml) | 1-Click Infrastructure-as-code for Render |
| **Security Policy** | [SECURITY.md](SECURITY.md) | Cryptographic model & threat boundaries |
| **License** | [LICENSE.md](LICENSE.md) | Permissive open-source terms |

---

## 🧭 Executive Overview

CipherLink is an ephemeral, peer-to-peer rendezvous messaging system designed around a foundational principle: **the relay server must never be capable of reading, storing, or indexing user communications.**

Instead of requiring sign-ups, email confirmations, phone numbers, or persisting central user graphs, CipherLink allows two individuals to agree upon a shared numeric channel code (e.g., `234`). Each client's browser independently derives a cryptographic key via the W3C Web Cryptography API, then exchanges end-to-end encrypted text messages, images, video clips, and PDF documents.

When both participants disconnect, the volatile memory allocated on the relay server is instantly cleared. No databases, logs, or backups of message content ever exist.

---

## 🛡️ Privacy & Zero-Data-Theft Guarantee

CipherLink strictly rejects data-harvesting practices:

1. **Zero Third-Party Telemetry & Tracking**: There are no analytics packages, marketing tags, advertising identifiers, fingerprinting scripts, or third-party cookies.
2. **Accountless & Identity-Free**: Users do not create profiles or submit personal credentials. Screen aliases are ephemeral and kept strictly inside the local session.
3. **No Persistent Data Storage**: The relay does not connect to any database or file system for message persistence. Plaintext resides only within volatile browser memory.
4. **Browser-Native Cryptography**: Key derivation (`PBKDF2`) and authenticated symmetric encryption (`AES-GCM-256`) execute directly within the user's browser sandbox using `window.crypto.subtle`.
5. **Two-Party Strict Enclosure**: Channels enforce a strict hard-cap of two active participants, rejecting any third party that attempts to eavesdrop or join.

---

## 📐 System Architecture & Flow Diagrams

### 1. Connection & End-to-End Cryptographic Flow

```
┌──────────────────────────────────────┐                ┌──────────────────────────────────────┐
│           Alice's Device             │                │            Bob's Device              │
│    (Web Cryptography API Sandbox)    │                │    (Web Cryptography API Sandbox)    │
└──────────────────┬───────────────────┘                └──────────────────┬───────────────────┘
                   │                                                       │
                   │ 1. Chooses Channel PIN: "234"                         │ 1. Enters Channel PIN: "234"
                   │ 2. PBKDF2 Key Derivation                              │ 2. PBKDF2 Key Derivation
                   │    • Salt: Domain Separated                           │    • Salt: Domain Separated
                   │    • Iterations: 120,000                              │    • Iterations: 120,000
                   │    • Hash: SHA-256                                    │    • Hash: SHA-256
                   │    • Output: 256-bit AES Key                          │    • Output: 256-bit AES Key
                   │                                                       │
                   ▼                                                       ▼
        ┌─────────────────────┐                                 ┌─────────────────────┐
        │  Connects to /ws    │                                 │  Connects to /ws    │
        │  Join Room: "234"   │                                 │  Join Room: "234"   │
        └──────────┬──────────┘                                 └──────────┬──────────┘
                   │                                                       │
                   │                ┌────────────────────┐                 │
                   └───────────────►│  CipherLink Relay  │◄────────────────┘
                                    │  (WebSocket /ws)   │
                                    │  • Zero Plaintext  │
                                    │  • In-Memory Only  │
                                    │  • Max 2 Clients   │
                                    └─────────┬──────────┘
                                              │
```

---

### 2. Message & Media Transmission Flow

CipherLink supports text, high-resolution photos, videos, and PDF documents. All media are serialized and encrypted client-side before touching the network:

```
[Sender: Alice]
       │
       ├─► 1. Selects Media (Photo / Video / PDF) + Text Caption
       │
       ├─► 2. Serializes Payload to Structured JSON Buffer
       │
       ├─► 3. Web Crypto API: `crypto.subtle.encrypt`
       │      • Algorithm: AES-256-GCM
       │      • Initialization Vector (IV): Fresh 96-bit CSPRNG (`crypto.getRandomValues`)
       │      • Authentication Tag: 128-bit integrity tag appended to ciphertext
       │
       ▼
 [Ciphertext Envelope]
 {
   "iv": "3a8f9c1b...",
   "data": "b78d910f...[ENCRYPTED MEDIA BUFFER]..."
 }
       │
       ▼
 [WebSocket Relay Server]
       │
       ├─► Inspects: Room PIN only ("234")
       ├─► Transports: Opaque ciphertext envelope
       ├─► Plaintext visibility: 0% (Impossible to read without AES key)
       │
       ▼
 [Recipient: Bob]
       │
       ├─► 1. Receives Opaque Envelope
       │
       ├─► 2. Web Crypto API: `crypto.subtle.decrypt`
       │      • Verifies 128-bit GMAC Authentication Tag
       │      • Decrypts with local 256-bit AES key
       │
       ├─► 3. Parse JSON buffer & render:
       │      • Inline Photo preview with lightbox & download
       │      • Inline HTML5 Video player
       │      • Dedicated PDF document badge & viewer
       │      • Accompanying text message
       │
       └─► 4. Ephemeral Timer Triggered (if auto-delete active)
```

---

### 3. Real-Time Message Deletion Flow

CipherLink enables senders to delete their messages at any time. When deleted, an event propagates across the channel to eliminate the message from both devices:

```
[Alice Taps "Delete Message"]
       │
       ├─► Removes message from Alice's local memory state
       │
       ├─► Emits WebSocket message: { type: "delete-message", id: "msg-9821" }
       │
       ▼
[CipherLink Relay Server]
       │
       └─► Forwards `message-deleted` event to peer in Room 234
       │
       ▼
[Bob's Device]
       │
       └─► Locates matching ID and purges message from memory & DOM
```

---

## ⚡ Core Technical Capabilities

- **Zero-Knowledge Architecture**: The server routes packets by channel code without keys or plaintext access.
- **Encrypted Media Transmission**: Send photos, videos, and PDF documents with client-side base64 encoding and AES-GCM wrapping.
- **Message Deletion**: Users can delete their own messages anytime, purging them instantly on both client views.
- **Configurable Ephemeral Timers**: Messages can automatically self-destruct after 30 seconds or 5 minutes.
- **Strict Two-Party Capacity**: Room limit is strictly capped at two peers. Any third user attempting to join is immediately blocked with `room-full`.
- **Typing & Presence Indicators**: Real-time peer connection state, typing notifications, and peer left/joined alerts.
- **Light & Dark Theme Engine**: Carefully calibrated contrast modes with persistent user preferences.
- **Web Audio Sound Cues**: Pure synthesized chimes via the Web Audio API with zero external audio assets.
- **Responsive Mobile Layout**: Engineered for desktop monitors, tablets, and smartphones.

---

## 🔐 Cryptographic Specifications

| Property | Implementation | Standard |
|---|---|---|
| **Symmetric Cipher** | AES-256-GCM (Galois/Counter Mode) | NIST SP 800-38D |
| **Key Length** | 256 bits | FIPS 197 |
| **Authentication Tag** | 128-bit Galois Message Authentication Code | Built-in to AES-GCM |
| **IV Generation** | 96-bit (12-byte) per-message CSPRNG | `crypto.getRandomValues()` |
| **Key Derivation** | PBKDF2-HMAC-SHA-256 | RFC 8018 / PKCS #5 v2.1 |
| **PBKDF2 Iterations** | 120,000 iterations | OWASP Recommended Baseline |
| **Salt Specification** | `cipherlink:v1:channel:<PIN>` (Domain separated) | Domain separation pattern |
| **Crypto Provider** | W3C Web Cryptography API | Native browser sandbox |

---

## 📄 License & Attribution

CipherLink is released under the **MIT License**. See the full legal text in [LICENSE.md](LICENSE.md).

```text
Copyright (c) 2026 Devputta / CipherLink Contributors
Licensed under the MIT License.
```
