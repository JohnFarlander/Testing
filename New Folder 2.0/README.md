# This is the FInal Review Project for coursera JavaScript Course

# TravelWise - Travel Recommendation Platform

A modern, responsive travel recommendation platform that helps users discover and explore destinations worldwide. The platform provides real-time information about locations, including local time, weather, and beautiful destination images.

## Features

- 🔍 Smart destination search with detailed information
- 🕒 Real-time local time display for destinations
- 📍 Precise location data with coordinates
- 🖼️ Beautiful destination images from Unsplash
- 📱 Fully responsive design for all devices
- 🎨 Modern and intuitive user interface

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/travelwise.git
   cd travelwise
   ```

2. Configure API Keys:
   - Copy `config.js` and rename it to `config.local.js`
   - Sign up for the required APIs:
     - [OpenCage](https://opencagedata.com/) - For geocoding
     - [TimeZoneDB](https://timezonedb.com/) - For timezone data
     - [Unsplash](https://unsplash.com/developers) - For destination images
   - Add your API keys to `config.local.js`

3. Open `index.html` in your web browser to run the application.

## API Configuration

The application requires three API keys to function properly:

1. **OpenCage API**
   - Used for geocoding and location data
   - Get your API key at [https://opencagedata.com/](https://opencagedata.com/)

2. **TimeZoneDB API**
   - Used for accurate timezone information
   - Get your API key at [https://timezonedb.com/](https://timezonedb.com/)

3. **Unsplash API**
   - Used for high-quality destination images
   - Get your API key at [https://unsplash.com/developers](https://unsplash.com/developers)

## Project Structure

```
travelwise/
├── index.html          # Main application page
├── styles.css          # Stylesheet
├── script.js           # Application logic
├── config.js           # API configuration template
├── about.html          # About page
├── contact.html        # Contact page
└── README.md          # Project documentation
```

## Development

- The project uses vanilla JavaScript for simplicity and performance
- Styling is done with modern CSS features including CSS Grid and Flexbox
- FontAwesome is used for icons
- All API calls include error handling and loading states

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [OpenCage](https://opencagedata.com/) for geocoding services
- [TimeZoneDB](https://timezonedb.com/) for timezone data
- [Unsplash](https://unsplash.com/) for beautiful destination images
- [FontAwesome](https://fontawesome.com/) for icons 