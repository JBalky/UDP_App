package org.example;
import java.awt.Desktop;
import java.io.File;
import java.net.URI;

public class Main {
    public static void main(String[] args) {
        try {
            // If you're using a web server:
            // URI uri = new URI("http://localhost:8080/index.html");

            // If you're opening the file directly (make sure the path is correct):
            File htmlFile = new File("/Users/wpiadmin/IdeaProjects/UDP_App/src/main/resources/Title.html");
            URI uri = htmlFile.toURI();

            if (Desktop.isDesktopSupported()) {
                Desktop desktop = Desktop.getDesktop();
                desktop.browse(uri);
            } else {
                System.out.println("Desktop is not supported. Cannot open the browser.");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}