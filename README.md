
Habit Tracker App

 📱 Build Good Habits, Break Bad Ones!

A mobile application built with React Native that helps users track and maintain their daily and weekly habits. The app allows users to register, create habits, mark them as completed, and track their progress over time.


 ✨ Features

 1. User Authentication
- Local registration and login system
- Auto-login functionality for returning users
- Secure storage of user credentials using AsyncStorage

 2. Habit Management
- Create new habits with customizable names
- Set frequency (daily or weekly)
- View all habits in an organized list
- Mark habits as completed

 3. Filtering Options
- Filter by "All Habits"
- Filter by "Today's Habits"
- Filter by "Completed Habits"

 4. Progress Tracking
- View percentage of habits completed today
- Track weekly progress
- Visual representation of habit completion

 5. Data Persistence
- All data stored locally using AsyncStorage
- Offline-first approach - no internet connection required

 🛠️ Tech Stack

- **React Native CLI**: Core development framework
- **TypeScript**: For type-safe code
- **React Navigation**: For stack and tab navigation
- **AsyncStorage**: For local data storage
- **Context API**: For state management

 📋 Prerequisites

- Node.js (>= 14.x)
- npm or yarn
- React Native development environment set up
- Android Studio (for Android development)
- Xcode (for iOS development, macOS only)

 🚀 Installation

1. Clone the repository:

   git clone https://github.com/Thagya/my-habits.git
   cd my-habits
 

2. Install dependencies:
   npm install
    or
   yarn install


3. Install iOS dependencies (macOS only):
   cd ios && pod install && cd ..


 🏃‍♂️ Running the App

For Android:


npm run android
 or
yarn android


For iOS (macOS only):

npm run ios
or
yarn ios


 📁 Project Structure


habit-tracker/
├── src/
│   ├── components/        Reusable UI components
│   ├── screens/           App screens
│   ├── navigation/        Navigation configuration
│   ├── services/          API and AsyncStorage services
│   ├── context/           Context providers
│   ├── types/             TypeScript type definitions
│   └── utils/             Utility functions
├── App.tsx                Entry point
├── index.js               Register application
└── ...                    Other configuration files




 🎥 Demo Video

https://github.com/user-attachments/assets/343251a2-5269-4373-9500-fba683643fe7


                                                                   
A demonstration video of the app's functionality is available 

 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.


