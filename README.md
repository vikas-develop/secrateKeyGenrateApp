# 🔐 Secret Key Generator

A modern, secure, and feature-rich web application for generating cryptographically secure secrets, passwords, and API keys using various algorithms.

![Next.js](https://img.shields.io/badge/Next.js-15.1-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=flat-square&logo=tailwind-css)
![React](https://img.shields.io/badge/React-18.3-61dafb?style=flat-square&logo=react)

## ✨ Features

### 🔑 Secret Generation
- **10 Different Algorithms**: Alphanumeric, With Symbols, Hexadecimal, Base64, UUID v4, Secure Random, API Key, Numeric PIN, Password, Binary Key
- **Custom Character Sets**: Define your own character sets for generation
- **Exclude Similar Characters**: Automatically exclude confusing characters (0/O, 1/l/I, etc.)
- **Batch Generation**: Generate multiple secrets at once (1-100)

### 💪 Password Strength
- **Real-time Strength Meter**: Visual feedback with score (0-100)
- **Entropy Calculation**: Shows bits of entropy for security assessment
- **Detailed Feedback**: Provides suggestions for improving password strength
- **Works for All Secrets**: Strength indicator available for all generated secrets

### 📚 History Management
- **Auto-save**: Automatically saves all generated secrets
- **Local Storage**: All data stored locally in your browser
- **View & Manage**: Easy-to-use history dialog with search
- **Bulk Operations**: Select multiple secrets for copy/export
- **Strength Tracking**: View strength information for each saved secret

### 📥 Export & Download
- **Multiple Formats**: Export as TXT or JSON
- **Single Secret Export**: Download individual secrets
- **Bulk Export**: Export entire history or selected secrets
- **Metadata Included**: Exports include algorithm, timestamp, and strength info
- **Bulk Copy**: Copy multiple secrets to clipboard at once

### 📱 QR Code Generation
- **Mobile-Friendly**: Generate QR codes for easy mobile transfers
- **Download Support**: Download QR codes as PNG images
- **High Error Correction**: Level H error correction for reliability
- **Available Everywhere**: QR codes for single secrets, batch secrets, and history

### 🎨 Modern UI/UX
- **Dark Mode**: Full dark mode support with system preference detection
- **Smooth Animations**: Beautiful animations powered by Framer Motion
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Accessible**: Built with accessibility in mind
- **Modern Design**: Clean, professional interface with shadcn/ui components

### ⚙️ Advanced Features
- **Zustand State Management**: Efficient state management with persistence
- **Custom Character Sets**: Define and use custom character sets
- **Preset Character Sets**: Quick access to common character sets
- **Real-time Validation**: Instant feedback on character set validity
- **Theme Persistence**: Your theme preference is saved

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd secretKeyGenratorApp
```

2. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🛠️ Build for Production

```bash
npm run build
npm start
```

## 📦 Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Theme**: [next-themes](https://github.com/pacocoursey/next-themes)
- **Icons**: [Lucide React](https://lucide.dev/)
- **QR Codes**: [qrcode.react](https://github.com/zpao/qrcode.react)
- **Date Formatting**: [date-fns](https://date-fns.org/)

## 🔒 Security

- All secrets are generated using cryptographically secure random number generators (Web Crypto API)
- No data is sent to external servers
- All data is stored locally in your browser
- Open source - you can audit the code yourself

## 📖 Usage

### Generating a Single Secret

1. Select an algorithm from the dropdown
2. Configure settings (length, options, etc.)
3. Click "Generate Single Secret"
4. Copy, download, or view QR code

### Batch Generation

1. Enter the number of secrets to generate (1-100)
2. Click "Generate Batch"
3. Select secrets to copy/export
4. Use bulk operations for efficiency

### Custom Character Sets

1. Enable "Use Custom Set" toggle
2. Enter your character set
3. Optionally enable "Exclude Similar Characters"
4. Use presets for quick setup
5. Generate secrets with your custom set

### Exporting Secrets

1. Generate or select secrets from history
2. Click export button (TXT/JSON)
3. Choose format and download
4. Files include metadata and timestamps

## 🎯 Algorithms

1. **Alphanumeric**: Letters (A-Z, a-z) and numbers (0-9)
2. **With Symbols**: Includes special characters
3. **Hexadecimal**: 0-9 and a-f
4. **Base64**: Base64 character set
5. **UUID v4**: Standard UUID format
6. **Secure Random**: Cryptographically secure random bytes
7. **API Key**: Formatted as xxxx-xxxx-xxxx-xxxx
8. **Numeric PIN**: Numbers only (0-9)
9. **Password**: Customizable with character requirements
10. **Binary Key**: Binary data as hexadecimal

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)

---

Made with ❤️ using Next.js and TypeScript
