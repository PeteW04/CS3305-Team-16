import mongodb from 'mongodb';

const MongoClient = mongodb.MongoClient;
const uri = "mongodb+srv://pete:CS3305-Team16%23%23@team-16.eny86.mongodb.net/?retryWrites=true&w=majority&appName=Team-16";
const client = new MongoClient(uri);

const connectDB = async () => {
    try {
        await client.connect(); // Connect to the database
        console.log('MongoDB connected...');
    } catch (err) {
        console.error('Error connecting to MongoDB:', err.message);
        process.exit(1); // Exit with failure
    }
};

export default connectDB;
