# 🎨 Wallx - Your Ultimate Wallpaper App

<div align="center">
  <img src="assets/images/adaptive-icon.png" alt="Wallx Logo" width="200"/>
  
  [![Expo](https://img.shields.io/badge/Expo-000000?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
  [![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev)
  [![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
</div>

## 🌟 Features

- 🖼️ **Beautiful Wallpapers**: Access a vast collection of high-quality wallpapers
- 🔍 **Smart Search**: Find wallpapers by category, color, or theme
- 🤖 **AI-Powered**: Generate custom wallpapers using AI
- 💾 **Offline Support**: Save your favorite wallpapers for offline use
- 🔒 **Secure Authentication**: Firebase-powered user authentication
- 🌙 **Dark Mode**: Beautiful dark theme for comfortable viewing
- 📱 **Cross-Platform**: Works on both iOS and Android

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Expo CLI
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/wallx.git
   cd wallx
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up Firebase**
   - Create a Firebase project
   - Add your Firebase configuration to `lib/firebaseConfig.ts`
   - Enable Authentication and Firestore

4. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

## 📱 Running the App

### Development Build
```bash
# For Android
npm run android

# For iOS
npm run ios
```

### Production Build
```bash
# For Android
expo build:android

# For iOS
expo build:ios
```

## 🛠️ Tech Stack

- **Frontend**: React Native, Expo
- **Backend**: Firebase (Authentication, Firestore)
- **State Management**: React Context
- **Routing**: Expo Router
- **UI Components**: 
  - Expo Linear Gradient
  - React Native Vector Icons
  - Expo Blur
  - React Native Reanimated

## 📁 Project Structure

```
wallx/
├── app/                 # Main application screens
├── assets/             # Images, fonts, and other static assets
├── components/         # Reusable UI components
├── context/            # React Context providers
├── lib/                # Utility functions and configurations
├── services/           # API and service integrations
└── types/              # TypeScript type definitions
```

## 🔐 Authentication Flow

1. User registration/login
2. Email verification
3. Profile management
4. Secure session handling

## 🎨 UI/UX Features

- Smooth animations and transitions
- Responsive design for all screen sizes
- Intuitive navigation
- Beautiful gradients and blur effects
- Custom loading states

## 📦 Dependencies

- [Expo](https://expo.dev) - Development platform
- [Firebase](https://firebase.google.com) - Backend services
- [React Native](https://reactnative.dev) - UI framework
- [TypeScript](https://www.typescriptlang.org) - Type safety

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Expo Team](https://expo.dev) for the amazing development platform
- [Firebase Team](https://firebase.google.com) for the robust backend services
- [React Native Community](https://reactnative.dev) for the incredible framework

## 📞 Support

For support, email support@wallx.app or join our [Discord community](https://discord.gg/wallx).

---

<div align="center">
  Made with ❤️ by the Wallx Team
</div>
