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
    private MongoCollection<Document> streetMetric;
    private MongoCollection<Document> weightedMetric;
    private String uri = "mongodb+srv://UDP_SCP:udpscp@db.m2r6zwa.mongodb.net/?retryWrites=true&w=majority";
    private ArrayList<String> order;

    public dbconn(){
        try(MongoClient mongoClient = MongoClients.create(uri)){
            db = mongoClient.getDatabase("streets");
            streetMetric = db.getCollection("street-metrics");
            weightedMetric = db.getCollection("weighted-metrics");
            order = new ArrayList<String>();
        }
        catch(Exception e){
            System.err.println("An error occurred while connecting to MongoDB: " + e.getMessage());
        }
    }

    public void addToRaw(Document doc){
        streetMetric.insertOne(doc);
    }

    public void addToWeighted(Document doc){
        weightedMetric.insertOne(doc);
    }

    public Document stringToDoc(double incline, double lWidth, double rWidth, int state, int safetyProtocol, int vertTrans, int busStop, int subwayStop, int numResStores, int restrooms, int trash, boolean markets){
        String json = String.format(
                "{ 'Incline': %.2f, 'Width (L)': %.2f, 'Width (R)': %.2f, 'State': %d, 'Safety Protocols': %d, 'Vertical Transportation': %d, 'Bus Stop': %d, 'Subway Stop': %d, 'Restaurants + Stores': %d, 'Restrooms': %d, 'Trash': %d, 'Markets': %b }",
                incline, lWidth, rWidth, state, safetyProtocol, vertTrans, busStop, subwayStop, numResStores, restrooms, trash, markets);

        // Replacing single quotes with double quotes for valid JSON format and parsing it to create a Document
        Document doc = Document.parse(json.replace("'", "\""));

        return doc;
    }



    public Document calcWeightedToDoc(String street){
        Document doc = streetMetric.find(eq("street_name", street)).first();
        if(doc == null){
            System.out.println("No matching documents found.");
        }

        Document sidewalkData = (Document) (weightedMetric.find());


        return doc;
    }


    public static void main(String[] args) {
        // Replace the placeholder with your MongoDB deployment's connection string
        String uri = "mongodb+srv://UDP_SCP:udpscp@db.m2r6zwa.mongodb.net/?retryWrites=true&w=majority";
        try (MongoClient mongoClient = MongoClients.create(uri)) {
            // Attempt to get the database and collection
            MongoDatabase database = mongoClient.getDatabase("streets");
            MongoCollection<Document> collection = database.getCollection("street-metrics");

            // Attempt to find a document
            Document doc = collection.find(eq("street_name", "Queens Road")).first();
            if (doc != null) {
                System.out.println(doc.toJson());
            } else {
                System.out.println("No matching documents found.");
            }
        } catch (Exception e) {
            // This will catch any exception, including those related to MongoDB connection issues
            System.err.println("An error occurred: " + e.getMessage());
        }
    }



}





