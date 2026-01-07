# Smart Price Analysis in Agriculture

A comprehensive web application for agricultural crop price analysis and comparison, designed to empower farmers with real-time market intelligence.

## Features

### 1. **Authentication System**
- User registration and login with secure Supabase authentication
- Stores user credentials, email, and mobile numbers in database
- Session management with persistent login

### 2. **Multi-Language Support**
- Available in 5 languages:
  - English
  - हिंदी (Hindi)
  - ಕನ್ನಡ (Kannada)
  - தமிழ் (Tamil)
  - తెలుగు (Telugu)

### 3. **Dashboard View**
- Overview of all crops with color-coded price indicators:
  - **Green** for crops with price increases
  - **Red** for crops with price decreases
- Summary cards showing count of crops with rising/falling prices
- Clickable crop cards to view detailed information

### 4. **Price List View**
- Comprehensive grid and table views of all crop prices
- Shows present price, previous price, and percentage change
- Visual indicators with trending icons
- Filterable and sortable interface

### 5. **Month-to-Month Comparison**
- Detailed comparison between current and previous month prices
- Statistical summary of market trends
- Visual comparison bars for easy understanding
- Comprehensive table view with all price changes

### 6. **Crop Detail Pages**
- Individual crop analysis with:
  - Present price vs previous price comparison
  - Price change indicators with percentages
  - **Monthly price trend graph** (using Recharts)
  - Historical price data table
  - Price alert notification options

### 7. **Notification System**
- Mobile number registration for SMS alerts
- Select specific crops for regular price updates
- Automatic notifications for significant price changes (5%+)
- Daily price summaries
- Market trend alerts

### 8. **Real-Time Data**
- Currently uses mock data simulating Indian crop prices
- Easy integration point for real Indian agriculture API
- All prices displayed in Indian Rupees (₹)
- Per quintal pricing standard

## Tracked Crops

1. Wheat (गेहूं / ಗೋಧಿ / கோதுமை / గోధుమ)
2. Rice (चावल / ಅಕ್ಕಿ / அரிசி / బియ్యం)
3. Corn (मक्का / ಜೋಳ / சோளம் / మొక్కజొన్న)
4. Cotton (कपास / ಹತ್ತಿ / பருத்தி / పత్తి)
5. Sugarcane (गन्ना / ಕಬ್ಬು / கரும்பு / చెరకు)
6. Tomato (टमाटर / ಟೊಮೆಟೊ / தக்காளி / టమాటా)
7. Potato (आलू / ಆಲೂಗಡ್ಡೆ / உருளைக்கிழங்கு / బంగాళదుంప)
8. Onion (प��याज / ಈರುಳ್ಳಿ / வெங்காயம் / ఉల్లిపాయ)
9. Soybean (सोयाबीन / ಸೋಯಾಬೀನ್ / சோயாபீன் / సోయాబీన్)
10. Groundnut (मूंगफली / ಕಡलೆಕಾಯಿ / நிலக்கடலை / వేరుశనగ)
11. Chickpea/Chana (चना / ಕಡलೆ / கொண்டைக்கடலை / శనగలు)
12. Lentils/Dal (दाल / ಬೇಳೆ / பருப்பு / పప్పు)
13. Bajra/Pearl Millet (बाजरा / ಸಜ್ಜೆ / கம்பு / సజ్జలు)
14. Jowar/Sorghum (ज्वार / ಜೋಳ / சோளம் / జొన్నలు)
15. Barley (जौ / ಬಾರ್ಲಿ / பார்லி / బార్లీ)
16. Mustard (सरसों / ಸಾಸಿವೆ / கடுகு / ఆవాలు)
17. Sunflower (सूरजमुखी / ಸೂರ್ಯಕಾಂತಿ / சூரியகாந்தி / సూర్యకాంతి)
18. Tea (चाय / ಚಹಾ / தேநீர் / తేనీళ్లు)
19. Coffee (कॉफ़ी / ಕಾಫಿ / காபி / కాఫీ)
20. Turmeric (हल्दी / ಅರಿಶಿನ / மஞ்சள் / పసుపు)
21. Chili (मिर्च / ಮೆಣಸಿನಕಾಯಿ / மிளகாய் / మిర్చి)
22. Ginger (अदरक / ಶುಂಠಿ / இஞ்சி / అల్లం)
23. Garlic (लहसुन / ಬೆಳ್ಳುಳ್ಳಿ / பூண்டு / వెల్లుల్లి)
24. Cumin (जीरा / ಜೀರಿಗೆ / சீரகம் / జీలకర్ర)
25. Coriander (धनिया / ಕೊತ್ತಂಬರಿ / கொத்தமல்லி / కొత్తిమీర)

## Technology Stack

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Backend**: Supabase (Authentication + Database)
- **Server**: Hono (Edge Functions)
- **Icons**: Lucide React
- **Notifications**: Sonner (Toast notifications)

## Database Structure

The application uses Supabase's KV store for data persistence:
- User registration data (email, password, name, mobile)
- User preferences and notification settings
- Selected crops for notifications

## API Integration Point

To integrate with a real Indian agriculture price API:

1. Replace the mock data in `/supabase/functions/server/index.tsx`
2. Update the crop fetching endpoints to call your API
3. Ensure the API returns data in the expected format:
```typescript
{
  id: string;
  name: string;
  presentPrice: number;
  previousPrice: number;
  monthlyData: Array<{month: string, price: number}>;
}
```

## Getting Started

1. **Register an account** using your email and password
2. **Select your preferred language** from the dropdown
3. **Browse the dashboard** to see all crop prices
4. **Click on any crop** to view detailed price trends and graphs
5. **Set up notifications** by clicking the bell icon and entering your mobile number
6. **Select crops** you want to track for regular updates

## Navigation

- **Dashboard**: Overview of all crops with price trends
- **Price List**: Detailed list and table view of all prices
- **Comparison**: Month-to-month price comparison analysis

## Security Note

This application is designed for prototyping and development purposes. For production deployment with real user data:
- Implement additional security measures
- Use proper SSL/TLS encryption
- Add rate limiting
- Implement proper API key management
- Use environment-specific configurations

## Future Enhancements

- Integration with real-time Indian agriculture APIs
- SMS gateway integration for actual mobile notifications
- Historical data analysis (6 months, 1 year trends)
- Price prediction using ML models
- Weather integration for harvest predictions
- Market insights and recommendations
- Export data to PDF/Excel
- Mobile app version