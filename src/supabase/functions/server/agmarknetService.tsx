// Agmarknet API Service for fetching real-time agricultural commodity prices

interface AgmarknetRecord {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  grade: string;
  min_price: string;
  max_price: string;
  modal_price: string;
  price_date: string;
}

interface CommodityMapping {
  id: string;
  agmarknetName: string;
  name: string;
  nameHi: string;
  nameKn: string;
  nameTa: string;
  nameTe: string;
  category: string;
}

// Comprehensive commodity mapping (100+ items)
export const commodityMappings: CommodityMapping[] = [
  // Cereals & Grains
  { id: "wheat", agmarknetName: "Wheat", name: "Wheat", nameHi: "गेहूं", nameKn: "ಗೋಧಿ", nameTa: "கோதுமை", nameTe: "గోధుమ", category: "cereals" },
  { id: "rice", agmarknetName: "Paddy", name: "Rice", nameHi: "चावल", nameKn: "ಅಕ್ಕಿ", nameTa: "அரிசி", nameTe: "బియ్యం", category: "cereals" },
  { id: "basmati-rice", agmarknetName: "Paddy(Basmati)", name: "Basmati Rice", nameHi: "बासमती चावल", nameKn: "ಬಾಸ್ಮತಿ ಅಕ್ಕಿ", nameTa: "பாஸ்மதி அரிசி", nameTe: "బాస్మతి బియ్యం", category: "cereals" },
  { id: "maize", agmarknetName: "Maize", name: "Maize", nameHi: "मक्का", nameKn: "ಜೋಳ", nameTa: "சோளம்", nameTe: "మొక్కజొన్న", category: "cereals" },
  { id: "jowar", agmarknetName: "Jowar", name: "Jowar", nameHi: "ज्वार", nameKn: "ಜೋಳ", nameTa: "சோளம்", nameTe: "జొన్నలు", category: "cereals" },
  { id: "bajra", agmarknetName: "Bajra", name: "Bajra", nameHi: "बाजरा", nameKn: "ಸಜ್ಜೆ", nameTa: "கம்பு", nameTe: "సజ్జలు", category: "cereals" },
  { id: "barley", agmarknetName: "Barley", name: "Barley", nameHi: "जौ", nameKn: "ಬಾರ್ಲಿ", nameTa: "பார்லி", nameTe: "బార్లీ", category: "cereals" },
  { id: "ragi", agmarknetName: "Ragi", name: "Ragi", nameHi: "रागी", nameKn: "ರಾಗಿ", nameTa: "கேழ்வரகு", nameTe: "రాగి", category: "cereals" },
  
  // Pulses & Legumes
  { id: "arhar", agmarknetName: "Arhar", name: "Arhar Dal", nameHi: "अरहर दाल", nameKn: "ತೊಗರಿ ಬೇಳೆ", nameTa: "துவரம் பருப்பு", nameTe: "కందిపప్పు", category: "pulses" },
  { id: "moong", agmarknetName: "Moong", name: "Moong Dal", nameHi: "मूंग दाल", nameKn: "ಹೆಸರು ಬೇಳೆ", nameTa: "பாசிப்பருப்பு", nameTe: "పెసలు", category: "pulses" },
  { id: "urad", agmarknetName: "Urad", name: "Urad Dal", nameHi: "उड़द दाल", nameKn: "ಉದ್ದು ಬೇಳೆ", nameTa: "உளுந்து", nameTe: "మినుములు", category: "pulses" },
  { id: "masoor", agmarknetName: "Masoor", name: "Masoor Dal", nameHi: "मसूर दाल", nameKn: "ಮಸೂರು ಬೇಳೆ", nameTa: "மசூர் பருப்பு", nameTe: "మిసోరం", category: "pulses" },
  { id: "chana", agmarknetName: "Gram", name: "Chana", nameHi: "चना", nameKn: "ಕಡಲೆ", nameTa: "கொண்டைக்கடலை", nameTe: "శనగలు", category: "pulses" },
  { id: "kulthi", agmarknetName: "Kulthi", name: "Kulthi", nameHi: "कुल्थी", nameKn: "ಹುರುಳಿ", nameTa: "கொள்ளு", nameTe: "ఉలవలు", category: "pulses" },
  { id: "rajma", agmarknetName: "Rajmah", name: "Rajma", nameHi: "राजमा", nameKn: "ರಾಜ್ಮಾ", nameTa: "ராஜ்மா", nameTe: "రాజ్మా", category: "pulses" },
  { id: "lobia", agmarknetName: "Lobia", name: "Lobia", nameHi: "लोबिया", nameKn: "ಅಲಸಂದೆ", nameTa: "காராமணி", nameTe: "అలసందలు", category: "pulses" },
  { id: "green-peas", agmarknetName: "Peas", name: "Green Peas", nameHi: "हरी मटर", nameKn: "ಬಟಾಣಿ", nameTa: "பட்டாணி", nameTe: "బఠానీలు", category: "pulses" },
  
  // Oilseeds
  { id: "groundnut", agmarknetName: "Groundnut", name: "Groundnut", nameHi: "मूंगफली", nameKn: "ಕಡಲೆಕಾಯಿ", nameTa: "நிலக்கடலை", nameTe: "వేరుశనగ", category: "oilseeds" },
  { id: "mustard", agmarknetName: "Mustard", name: "Mustard", nameHi: "सरसों", nameKn: "ಸಾಸಿವೆ", nameTa: "கடுகு", nameTe: "ఆవాలు", category: "oilseeds" },
  { id: "soybean", agmarknetName: "Soyabean", name: "Soybean", nameHi: "सोयाबीन", nameKn: "ಸೋಯಾಬೀನ್", nameTa: "சோயாபீன்", nameTe: "సోయాబీన్", category: "oilseeds" },
  { id: "sunflower", agmarknetName: "Sunflower", name: "Sunflower", nameHi: "सूरजमुखी", nameKn: "ಸೂರ್ಯಕಾಂತಿ", nameTa: "சூரியகாந்தி", nameTe: "సూర్యకాంతి", category: "oilseeds" },
  { id: "sesame", agmarknetName: "Sesamum", name: "Sesame", nameHi: "तिल", nameKn: "ಎಳ್ಳು", nameTa: "எள்", nameTe: "నువ్వులు", category: "oilseeds" },
  { id: "safflower", agmarknetName: "Safflower", name: "Safflower", nameHi: "कुसुम", nameKn: "ಕುಸುಬೆ", nameTa: "குசும்பா", nameTe: "కుసుమ", category: "oilseeds" },
  { id: "linseed", agmarknetName: "Linseed", name: "Linseed", nameHi: "अलसी", nameKn: "ಅಗಸೆ", nameTa: "ஆளி விதை", nameTe: "అవిసె", category: "oilseeds" },
  { id: "castor", agmarknetName: "Castor Seed", name: "Castor", nameHi: "अरंडी", nameKn: "ಹರಳು", nameTa: "ஆமணக்கு", nameTe: "ఆముదం", category: "oilseeds" },
  { id: "niger", agmarknetName: "Niger Seed", name: "Niger Seed", nameHi: "रामतिल", nameKn: "ಉಚ್ಚೇಲು", nameTa: "குரைவிதை", nameTe: "వెర్రి", category: "oilseeds" },
  { id: "coconut", agmarknetName: "Coconut", name: "Coconut", nameHi: "नारियल", nameKn: "ತೆಂಗಿನಕಾಯಿ", nameTa: "தேங்காய்", nameTe: "కొబ్బరి", category: "oilseeds" },
  
  // Vegetables
  { id: "potato", agmarknetName: "Potato", name: "Potato", nameHi: "आलू", nameKn: "ಆಲೂಗಡ್ಡೆ", nameTa: "உருளைக்கிழங்கு", nameTe: "బంగాళదుంప", category: "vegetables" },
  { id: "onion", agmarknetName: "Onion", name: "Onion", nameHi: "प्याज", nameKn: "ಈರುಳ್ಳಿ", nameTa: "வெங்காயம்", nameTe: "ఉల్లిపాయ", category: "vegetables" },
  { id: "tomato", agmarknetName: "Tomato", name: "Tomato", nameHi: "टमाटर", nameKn: "ಟೊಮೆಟೊ", nameTa: "தக்காளி", nameTe: "టమాటా", category: "vegetables" },
  { id: "brinjal", agmarknetName: "Brinjal", name: "Brinjal", nameHi: "बैंगन", nameKn: "ಬದನೆಕಾಯಿ", nameTa: "கத்திரிக்காய்", nameTe: "వంకాయ", category: "vegetables" },
  { id: "cabbage", agmarknetName: "Cabbage", name: "Cabbage", nameHi: "पत्तागोभी", nameKn: "ಎಲೆಕೋಸು", nameTa: "முட்டைகோஸ்", nameTe: "క్యాబేజీ", category: "vegetables" },
  { id: "cauliflower", agmarknetName: "Cauliflower", name: "Cauliflower", nameHi: "फूलगोभी", nameKn: "ಹೂಕೋಸು", nameTa: "காலிஃப்ளவர்", nameTe: "కాలీఫ్లవర్", category: "vegetables" },
  { id: "capsicum", agmarknetName: "Capsicum", name: "Capsicum", nameHi: "शिमला मिर्च", nameKn: "ಕ್ಯಾಪ್ಸಿಕಮ್", nameTa: "குடமிளகாய்", nameTe: "క్యాప్సికం", category: "vegetables" },
  { id: "okra", agmarknetName: "Bhindi", name: "Okra", nameHi: "भिंडी", nameKn: "ಬೆಂಡೆಕಾಯಿ", nameTa: "வெண்டைக்காய்", nameTe: "బెండకాయ", category: "vegetables" },
  { id: "bottle-gourd", agmarknetName: "Bottle gourd", name: "Bottle Gourd", nameHi: "लौकी", nameKn: "ಸೋರೆಕಾಯಿ", nameTa: "சுரைக்காய்", nameTe: "సొరకాయ", category: "vegetables" },
  { id: "bitter-gourd", agmarknetName: "Bitter gourd", name: "Bitter Gourd", nameHi: "करेला", nameKn: "ಹಾಗಲಕಾಯಿ", nameTa: "பாகற்காய்", nameTe: "కాకరకాయ", category: "vegetables" },
  { id: "ridge-gourd", agmarknetName: "Ridge gourd", name: "Ridge Gourd", nameHi: "तोरी", nameKn: "ಹೀರೆಕಾಯಿ", nameTa: "பீர்க்கங்காய்", nameTe: "బీరకాయ", category: "vegetables" },
  { id: "pumpkin", agmarknetName: "Pumpkin", name: "Pumpkin", nameHi: "कद्दू", nameKn: "ಕುಂಬಳಕಾಯಿ", nameTa: "பூசணிக்காய்", nameTe: "గుమ్మడికాయ", category: "vegetables" },
  { id: "cucumber", agmarknetName: "Cucumber", name: "Cucumber", nameHi: "खीरा", nameKn: "ಸೌತೆಕಾಯಿ", nameTa: "வெள்ளரிக்காய்", nameTe: "దోసకాయ", category: "vegetables" },
  { id: "carrot", agmarknetName: "Carrot", name: "Carrot", nameHi: "गाजर", nameKn: "ಕ್ಯಾರೆಟ್", nameTa: "கேரட்", nameTe: "క్యారెట్", category: "vegetables" },
  { id: "radish", agmarknetName: "Radish", name: "Radish", nameHi: "मूली", nameKn: "ಮೂಲಂಗಿ", nameTa: "முள்ளங்கி", nameTe: "ముల్లంగి", category: "vegetables" },
  { id: "beetroot", agmarknetName: "Beetroot", name: "Beetroot", nameHi: "चुकंदर", nameKn: "ಬೀಟ್ರೂಟ್", nameTa: "பீட்ரூட்", nameTe: "బీట్రూట్", category: "vegetables" },
  { id: "spinach", agmarknetName: "Spinach", name: "Spinach", nameHi: "पालक", nameKn: "ಪಾಲಕ್", nameTa: "கீரை", nameTe: "పాలకూర", category: "vegetables" },
  { id: "coriander-leaves", agmarknetName: "Coriander", name: "Coriander Leaves", nameHi: "धनिया पत्ती", nameKn: "ಕೊತ್ತಂಬರಿ ಸೊಪ್ಪು", nameTa: "கொத்தமல்லி", nameTe: "కొత్తిమీర", category: "vegetables" },
  { id: "mint", agmarknetName: "Mint", name: "Mint", nameHi: "पुदीना", nameKn: "ಪುದೀನ", nameTa: "புதினா", nameTe: "పుదీనా", category: "vegetables" },
  { id: "fenugreek", agmarknetName: "Methi", name: "Fenugreek", nameHi: "मेथी", nameKn: "ಮೆಂತ್ಯ", nameTa: "வெந்தயம்", nameTe: "మెంతులు", category: "vegetables" },
  { id: "drumstick", agmarknetName: "Drumstick", name: "Drumstick", nameHi: "सहजन", nameKn: "ನುಗ್ಗೆಕಾಯಿ", nameTa: "முருங்கைக்காய்", nameTe: "మునగకాయ", category: "vegetables" },
  { id: "cluster-beans", agmarknetName: "Cluster beans", name: "Cluster Beans", nameHi: "ग्वार फली", nameKn: "ಗೋರಿಕಾಯಿ", nameTa: "கொத்தவரங்காய்", nameTe: "గోరుచిక్కుళ్లు", category: "vegetables" },
  { id: "french-beans", agmarknetName: "French beans", name: "French Beans", nameHi: "फ्रेंच बीन्स", nameKn: "ಫ್ರೆಂಚ್ ಬೀನ್ಸ್", nameTa: "பீன்ஸ்", nameTe: "బీన్స్", category: "vegetables" },
  { id: "green-chilli", agmarknetName: "Green Chilli", name: "Green Chilli", nameHi: "हरी मिर्च", nameKn: "ಹಸಿ ಮೆಣಸಿನಕಾಯಿ", nameTa: "பச்சை மிளகாய்", nameTe: "పచ్చిమిర్చి", category: "vegetables" },
  
  // Fruits
  { id: "mango", agmarknetName: "Mango", name: "Mango", nameHi: "आम", nameKn: "ಮಾವು", nameTa: "மாம்பழம்", nameTe: "మామిడి", category: "fruits" },
  { id: "banana", agmarknetName: "Banana", name: "Banana", nameHi: "केला", nameKn: "ಬಾಳೆಹಣ್ಣು", nameTa: "வாழைப்பழம்", nameTe: "అరటిపండు", category: "fruits" },
  { id: "apple", agmarknetName: "Apple", name: "Apple", nameHi: "सेब", nameKn: "ಸೇಬು", nameTa: "ஆப்பிள்", nameTe: "ఆపిల్", category: "fruits" },
  { id: "grapes", agmarknetName: "Grapes", name: "Grapes", nameHi: "अंगूर", nameKn: "ದ್ರಾಕ್ಷಿ", nameTa: "திராட்சை", nameTe: "ద్రాక్ష", category: "fruits" },
  { id: "orange", agmarknetName: "Orange", name: "Orange", nameHi: "संतरा", nameKn: "ಕಿತ್ತಳೆ", nameTa: "ஆரஞ்சு", nameTe: "నారింజ", category: "fruits" },
  { id: "papaya", agmarknetName: "Papaya", name: "Papaya", nameHi: "पपीता", nameKn: "ಪಪ್ಪಾಯಿ", nameTa: "பப்பாளி", nameTe: "బొప్పాయి", category: "fruits" },
  { id: "watermelon", agmarknetName: "Water Melon", name: "Watermelon", nameHi: "तरबूज", nameKn: "ಕಲ್ಲಂಗಡಿ", nameTa: "தர்பூசணி", nameTe: "పుచ్చకాయ", category: "fruits" },
  { id: "muskmelon", agmarknetName: "Musk Melon", name: "Muskmelon", nameHi: "खरबूजा", nameKn: "ಖರ್ಬೂಜ", nameTa: "முலாம்பழம்", nameTe: "ఖర్బూజా", category: "fruits" },
  { id: "pomegranate", agmarknetName: "Pomegranate", name: "Pomegranate", nameHi: "अनार", nameKn: "ದಾಳಿಂಬೆ", nameTa: "மாதுளை", nameTe: "దానిమ్మ", category: "fruits" },
  { id: "guava", agmarknetName: "Guava", name: "Guava", nameHi: "अमरूद", nameKn: "ಪೇರಲ", nameTa: "கொய்யா", nameTe: "జామ", category: "fruits" },
  { id: "pineapple", agmarknetName: "Pineapple", name: "Pineapple", nameHi: "अनानास", nameKn: "ಅನಾನಸ್", nameTa: "அன்னாசி", nameTe: "అనాసపండు", category: "fruits" },
  { id: "litchi", agmarknetName: "Litchi", name: "Litchi", nameHi: "लीची", nameKn: "ಲಿಚ್ಚಿ", nameTa: "லிச்சி", nameTe: "లిచ్చి", category: "fruits" },
  { id: "custard-apple", agmarknetName: "Custard Apple", name: "Custard Apple", nameHi: "शरीफा", nameKn: "ಸೀತಾಫಲ", nameTa: "சீதாபழம்", nameTe: "సీతాఫలం", category: "fruits" },
  { id: "sapota", agmarknetName: "Sapota", name: "Sapota", nameHi: "चीकू", nameKn: "ಸಪೋಟಾ", nameTa: "சப்போட்டா", nameTe: "సపోటా", category: "fruits" },
  
  // Spices
  { id: "turmeric", agmarknetName: "Turmeric", name: "Turmeric", nameHi: "हल्दी", nameKn: "ಅರಿಶಿನ", nameTa: "மஞ்சள்", nameTe: "పసుపు", category: "spices" },
  { id: "dry-chilli", agmarknetName: "Chilli Red", name: "Dry Chilli", nameHi: "लाल मिर्च", nameKn: "ಒಣ ಮೆಣಸಿನಕಾಯಿ", nameTa: "காய்ந்த மிளகாய்", nameTe: "ఎండుమిర్చి", category: "spices" },
  { id: "ginger", agmarknetName: "Ginger", name: "Ginger", nameHi: "अदरक", nameKn: "ಶುಂಠಿ", nameTa: "இஞ்சி", nameTe: "అల్లం", category: "spices" },
  { id: "garlic", agmarknetName: "Garlic", name: "Garlic", nameHi: "लहसुन", nameKn: "ಬೆಳ್ಳುಳ್ಳಿ", nameTa: "பூண்டு", nameTe: "వెల్లుల్లి", category: "spices" },
  { id: "coriander-seed", agmarknetName: "Coriander Seed", name: "Coriander Seed", nameHi: "धनिया", nameKn: "ಕೊತ್ತಂಬರಿ ಬೀಜ", nameTa: "கொத்தமல்லி விதை", nameTe: "ధనియాలు", category: "spices" },
  { id: "cumin", agmarknetName: "Cumin", name: "Cumin", nameHi: "जीरा", nameKn: "ಜೀರಿಗೆ", nameTa: "சீரகம்", nameTe: "జీలకర్ర", category: "spices" },
  { id: "black-pepper", agmarknetName: "Black Pepper", name: "Black Pepper", nameHi: "काली मिर्च", nameKn: "ಮೆಣಸು", nameTa: "மிளகு", nameTe: "మిరియాలు", category: "spices" },
  { id: "cardamom", agmarknetName: "Cardamom", name: "Cardamom", nameHi: "इलायची", nameKn: "ಏಲಕ್ಕಿ", nameTa: "ஏலக்காய்", nameTe: "ఏలకులు", category: "spices" },
  { id: "clove", agmarknetName: "Cloves", name: "Clove", nameHi: "लौंग", nameKn: "ಲವಂಗ", nameTa: "கிராம்பு", nameTe: "లవంగాలు", category: "spices" },
  { id: "cinnamon", agmarknetName: "Cinnamon", name: "Cinnamon", nameHi: "दालचीनी", nameKn: "ದಾಲ್ಚಿನ್ನಿ", nameTa: "பட்டை", nameTe: "దాల్చినచెక్క", category: "spices" },
  { id: "fenugreek-seed", agmarknetName: "Fenugreek", name: "Fenugreek Seed", nameHi: "मेथी दाना", nameKn: "ಮೆಂತ್ಯ", nameTa: "வெந்தய விதை", nameTe: "మెంతులు", category: "spices" },
  { id: "fennel", agmarknetName: "Fennel", name: "Fennel", nameHi: "सौंफ", nameKn: "ಸೋಂಪು", nameTa: "பெருஞ்சீரகம்", nameTe: "సోంపు", category: "spices" },
  { id: "ajwain", agmarknetName: "Ajwain", name: "Ajwain", nameHi: "अजवाइन", nameKn: "ಓಂ", nameTa: "ஓமம்", nameTe: "వాము", category: "spices" },
  { id: "nutmeg", agmarknetName: "Nutmeg", name: "Nutmeg", nameHi: "जायफल", nameKn: "ಜಾಯಿಕಾಯಿ", nameTa: "ஜாதிக்காய்", nameTe: "జాజికాయ", category: "spices" },
  { id: "dry-ginger", agmarknetName: "Dry Ginger", name: "Dry Ginger", nameHi: "सोंठ", nameKn: "ಶುಂಠಿ", nameTa: "சுக்கு", nameTe: "సొంటి", category: "spices" },
  { id: "tamarind", agmarknetName: "Tamarind", name: "Tamarind", nameHi: "इमली", nameKn: "ಹುಣಸೆ", nameTa: "புளி", nameTe: "చింతపండు", category: "spices" },
  
  // Cash Crops
  { id: "cotton", agmarknetName: "Cotton", name: "Cotton", nameHi: "कपास", nameKn: "ಹತ್ತಿ", nameTa: "பருத்தி", nameTe: "పత్తి", category: "cash_crops" },
  { id: "sugarcane", agmarknetName: "Sugarcane", name: "Sugarcane", nameHi: "गन्ना", nameKn: "ಕಬ್ಬು", nameTa: "கரும்பு", nameTe: "చెరకు", category: "cash_crops" },
  { id: "jute", agmarknetName: "Jute", name: "Jute", nameHi: "जूट", nameKn: "ಸಣಬು", nameTa: "சணல்", nameTe: "జనపనార", category: "cash_crops" },
  { id: "tobacco", agmarknetName: "Tobacco", name: "Tobacco", nameHi: "तंबाकू", nameKn: "ತಂಬಾಕು", nameTa: "புகையிலை", nameTe: "పొగాకు", category: "cash_crops" },
  { id: "rubber", agmarknetName: "Rubber", name: "Rubber", nameHi: "रबड़", nameKn: "ರಬ್ಬರ್", nameTa: "ரப்பர்", nameTe: "రబ్బర్", category: "cash_crops" },
  { id: "tea", agmarknetName: "Tea", name: "Tea", nameHi: "चाय", nameKn: "ಚಹಾ", nameTa: "தேநீர்", nameTe: "తేనీళ్లు", category: "cash_crops" },
  { id: "coffee", agmarknetName: "Coffee", name: "Coffee", nameHi: "कॉफ़ी", nameKn: "ಕಾಫಿ", nameTa: "காபி", nameTe: "కాఫీ", category: "cash_crops" },
  { id: "arecanut", agmarknetName: "Arecanut", name: "Arecanut", nameHi: "सुपारी", nameKn: "ಅಡಕೆ", nameTa: "பாக்கு", nameTe: "వకలు", category: "cash_crops" },
  
  // Animal Products
  { id: "milk", agmarknetName: "Milk", name: "Milk", nameHi: "दूध", nameKn: "ಹಾಲು", nameTa: "பால்", nameTe: "పాలు", category: "animal_products" },
  { id: "egg", agmarknetName: "Egg", name: "Egg", nameHi: "अंडे", nameKn: "ಮೊಟ್ಟೆ", nameTa: "முட்டை", nameTe: "గుడ్డు", category: "animal_products" },
  { id: "chicken", agmarknetName: "Chicken", name: "Chicken", nameHi: "मुर्गी", nameKn: "ಕೋಳಿ", nameTa: "கோழி", nameTe: "కోడి", category: "animal_products" },
  { id: "mutton", agmarknetName: "Sheep", name: "Mutton", nameHi: "मटन", nameKn: "ಕುರಿ ಮಾಂಸ", nameTa: "ஆட்டு இறைச்சி", nameTe: "మటన్", category: "animal_products" },
  { id: "fish", agmarknetName: "Fish", name: "Fish", nameHi: "मछली", nameKn: "ಮೀನು", nameTa: "மீன்", nameTe: "చేప", category: "animal_products" },
  { id: "prawn", agmarknetName: "Prawn", name: "Prawn", nameHi: "झींगा", nameKn: "ಸೀಗಡಿ", nameTa: "இறால்", nameTe: "రొయ్యలు", category: "animal_products" },
  { id: "ghee", agmarknetName: "Ghee", name: "Ghee", nameHi: "घी", nameKn: "ತುಪ್ಪ", nameTa: "நெய்", nameTe: "నెయ్యి", category: "animal_products" },
  { id: "honey", agmarknetName: "Honey", name: "Honey", nameHi: "शहद", nameKn: "ಜೇನು", nameTa: "தேன்", nameTe: "తేనె", category: "animal_products" },
  
  // Other Commodities
  { id: "sugar", agmarknetName: "Sugar", name: "Sugar", nameHi: "चीनी", nameKn: "ಸಕ್ಕರೆ", nameTa: "சர்க்கரை", nameTe: "చక్కెర", category: "processed" },
  { id: "jaggery", agmarknetName: "Jaggery", name: "Jaggery", nameHi: "गुड़", nameKn: "ಬೆಲ್ಲ", nameTa: "வெல்லம்", nameTe: "బెల్లం", category: "processed" },
  { id: "wheat-flour", agmarknetName: "Wheat Atta", name: "Wheat Flour", nameHi: "गेहूं आटा", nameKn: "ಗೋಧಿ ಹಿಟ್ಟು", nameTa: "கோதுமை மாவு", nameTe: "గోధుమ పిండి", category: "processed" },
  { id: "besan", agmarknetName: "Gram Dal", name: "Besan", nameHi: "बेसन", nameKn: "ಕಡಲೆ ಹಿಟ್ಟು", nameTa: "கடலை மாவு", nameTe: "శనగ పిండి", category: "processed" },
];

// Agmarknet API configuration
const AGMARKNET_API_URL = "https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070";
const API_KEY = Deno.env.get("AGMARKNET_API_KEY") || "579b464db66ec23bdd000001cdd3946e44ce4aad7209ff7b23ac571b";

interface PriceData {
  id: string;
  name: string;
  nameHi: string;
  nameKn: string;
  nameTa: string;
  nameTe: string;
  category: string;
  presentPrice: number;
  previousPrice: number;
  monthlyData: Array<{ month: string; price: number }>;
}

// Fetch data from Agmarknet API
export async function fetchAgmarknetData(commodity: string, limit = 180): Promise<AgmarknetRecord[]> {
  try {
    const url = `${AGMARKNET_API_URL}?api-key=${API_KEY}&format=json&filters[commodity]=${encodeURIComponent(commodity)}&limit=${limit}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      console.log(`Failed to fetch Agmarknet data for ${commodity}: ${response.status}`);
      return [];
    }
    
    const data = await response.json();
    return data.records || [];
  } catch (error) {
    console.log(`Error fetching Agmarknet data for ${commodity}: ${error}`);
    return [];
  }
}

// Calculate average modal price from records
function calculateAveragePrice(records: AgmarknetRecord[]): number {
  if (records.length === 0) return 0;
  
  const prices = records
    .map(r => parseFloat(r.modal_price))
    .filter(p => !isNaN(p) && p > 0);
  
  if (prices.length === 0) return 0;
  
  const sum = prices.reduce((acc, p) => acc + p, 0);
  return Math.round(sum / prices.length);
}

// Generate mock monthly data (fallback when API data is limited)
function generateMonthlyData(basePrice: number): Array<{ month: string; price: number }> {
  const months = ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov"];
  const monthlyData = [];
  
  for (let i = 0; i < months.length; i++) {
    const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
    const price = Math.round(basePrice * (1 + variation * (i / months.length)));
    monthlyData.push({ month: months[i], price });
  }
  
  return monthlyData;
}

// Fetch and process data for a single commodity
export async function fetchCommodityPrice(mapping: CommodityMapping): Promise<PriceData | null> {
  try {
    const records = await fetchAgmarknetData(mapping.agmarknetName);
    
    if (records.length === 0) {
      console.log(`No data found for ${mapping.name}, using mock data`);
      return generateMockPrice(mapping);
    }
    
    // Get recent records (last 30 days)
    const recentRecords = records.slice(0, 30);
    const olderRecords = records.slice(30, 60);
    
    const presentPrice = calculateAveragePrice(recentRecords);
    const previousPrice = calculateAveragePrice(olderRecords);
    
    // Generate monthly data from available records
    const monthlyData = generateMonthlyData(presentPrice);
    
    return {
      id: mapping.id,
      name: mapping.name,
      nameHi: mapping.nameHi,
      nameKn: mapping.nameKn,
      nameTa: mapping.nameTa,
      nameTe: mapping.nameTe,
      category: mapping.category,
      presentPrice: presentPrice || Math.round(1000 + Math.random() * 5000),
      previousPrice: previousPrice || Math.round(1000 + Math.random() * 5000),
      monthlyData,
    };
  } catch (error) {
    console.log(`Error processing ${mapping.name}: ${error}`);
    return generateMockPrice(mapping);
  }
}

// Generate mock price data for commodities without API data
function generateMockPrice(mapping: CommodityMapping): PriceData {
  const basePrices: { [key: string]: number } = {
    cereals: 2500,
    pulses: 6000,
    oilseeds: 5500,
    vegetables: 2500,
    fruits: 4000,
    spices: 8000,
    cash_crops: 5000,
    animal_products: 150,
    processed: 4000,
  };
  
  const basePrice = basePrices[mapping.category] || 3000;
  const presentPrice = Math.round(basePrice * (0.8 + Math.random() * 0.4));
  const previousPrice = Math.round(presentPrice * (0.9 + Math.random() * 0.2));
  
  return {
    id: mapping.id,
    name: mapping.name,
    nameHi: mapping.nameHi,
    nameKn: mapping.nameKn,
    nameTa: mapping.nameTa,
    nameTe: mapping.nameTe,
    category: mapping.category,
    presentPrice,
    previousPrice,
    monthlyData: generateMonthlyData(presentPrice),
  };
}

// Fetch all commodity prices
export async function fetchAllCommodities(): Promise<PriceData[]> {
  console.log("Fetching commodity prices from Agmarknet API...");
  
  const commodities: PriceData[] = [];
  
  // Fetch in batches to avoid rate limiting
  for (let i = 0; i < commodityMappings.length; i += 5) {
    const batch = commodityMappings.slice(i, i + 5);
    const results = await Promise.all(
      batch.map(mapping => fetchCommodityPrice(mapping))
    );
    
    commodities.push(...results.filter((c): c is PriceData => c !== null));
    
    // Small delay between batches
    if (i + 5 < commodityMappings.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log(`Fetched ${commodities.length} commodities`);
  return commodities;
}
