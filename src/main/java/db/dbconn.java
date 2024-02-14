package db;
import java.util.ArrayList;
import static com.mongodb.client.model.Filters.eq;
import org.bson.Document;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;

public class dbconn {
    private MongoDatabase db;
    private MongoCollection<Document> raw;
    private MongoCollection<Document> scores;
    private String uri = "mongodb+srv://UDP_SCP:udpscp@db.m2r6zwa.mongodb.net/?retryWrites=true&w=majority";


    public dbconn(){
        try(MongoClient mongoClient = MongoClients.create(uri)){
            db = mongoClient.getDatabase("streets");
            raw = db.getCollection("street-metrics");
            scores = db.getCollection("weighted-metrics");
            System.out.println("\n");
            printDocumentByStreetName("Peel St");
            System.out.println("\n");
        }
        catch(Exception e){
            System.err.println("An error occurred while connecting to MongoDB: " + e.getMessage());
        }
    }

    public void addToRawAndCalculateScore(Document doc) {
        try {
            raw.insertOne(doc); // Add to raw collection

            // Automatically calculate score and add to scores collection
            String street = doc.getString("street_name"); // Assuming your document has a "street_name" field
            double score = calcWeightedScore(street); // Calculate score for this street
            Document scoreDoc = new Document("street_name", street)
                    .append("score", score);
            addToScores(scoreDoc); // Add score to scores collection
        } catch (Exception e) {
            System.err.println("Error adding entry and calculating score: " + e.getMessage());
        }
    }

    // Method to delete an entry from raw or scores collection
    public void deleteEntry(MongoCollection<Document> collection, String streetName) {
        try {
            collection.deleteOne(eq("street_name", streetName));
        } catch (Exception e) {
            System.err.println("Error deleting entry: " + e.getMessage());
        }
    }

    public void addToRaw(Document doc){
        raw.insertOne(doc);
    }

    public void addToScores(Document doc){
        scores.insertOne(doc);
    }

    public Document addEntry(double incline, double lWidth, double rWidth, int state, int safetyProtocol, int vertTrans, int busStop, int subwayStop, int numResStores, int restrooms, int trash, String markets, int length){
        String json = String.format(
                "{ 'Incline': %.2f, 'Width (L)': %.2f, 'Width (R)': %.2f, 'State': %d, 'Safety Protocols': %d, 'Vertical Transportation': %d, 'Bus Stop': %d, 'Subway Stop': %d, 'Restaurants + Stores': %d, 'Restrooms': %d, 'Trash': %d, 'Markets': '%s', 'Length': %d }",
                incline, lWidth, rWidth, state, safetyProtocol, vertTrans, busStop, subwayStop, numResStores, restrooms, trash, markets, length);

        // Replacing single quotes with double quotes for valid JSON format and parsing it to create a Document
        Document doc = Document.parse(json.replace("'", "\""));

        return doc;
    }



    public double calcWeightedScore(String street){
        Document doc = raw.find(eq("street_name", street)).first();
        if(doc == null){
            System.out.println("No matching documents found.");
            return 0.0;
        }

        Document sidewalkData = (Document) doc.get("sidewalk");
        double incline = (10 - sidewalkData.getDouble("Incline")) * 1.5;
        double leftWidth = (2 * sidewalkData.getDouble("Width (L)"));
        double rightWidth = (2 * sidewalkData.getDouble("Width (R)"));
        double state = sidewalkData.getDouble("State") * 1.6;
        double safeProto = sidewalkData.getDouble("Safety Protocols") * 1.1;
        double vertTrans = sidewalkData.getDouble("Vertical Transportation") * 1.6;

        Document distanceData = (Document) doc.get("distance");
        int len = distanceData.getInteger("Length");
        double busStop = distanceData.getInteger("Bus Stop") * 0.6;
        double subwayStop = distanceData.getInteger("Subway Stop") * 0.7;
        double restStore = 4.75 * 3 * (distanceData.getInteger("Restaurants + Stores") / len);
        double restrooms = (distanceData.getInteger("Restrooms") / len) / 0.011111111;
        double trash = (distanceData.getInteger("Trash") / len) / 0.069444444;
        double markets = "yes".equals(distanceData.getString("Markets")) ? 0.25 : 0;
        return incline + leftWidth + rightWidth + state + safeProto + vertTrans + busStop + subwayStop + restStore + restrooms + trash + markets;
    }
    public void printDocumentByStreetName(String streetName) {
        Document doc = raw.find(eq("street_name", streetName)).first();
        if (doc != null) {
            System.out.println(doc.toJson());
        } else {
            System.out.println("No matching documents found for " + streetName);
        }
    }


    public static void main(String[] args) {
        // Replace the placeholder with your MongoDB deployment's connection string

        dbconn conn = new dbconn();


    }

}





