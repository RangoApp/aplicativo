package br.com.impacta.rango.config;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class FirebaseConfig {
	
	@Value("${FIREBASE_CONFIG}")
	private String firebaseConfig;

    @Bean
    public FirebaseApp initializeFirebase() throws IOException {
		Gson gson = new Gson();
	    JsonObject jsonObject = gson.fromJson(firebaseConfig, JsonObject.class);

    	InputStream is = new ByteArrayInputStream(jsonObject.toString().getBytes());

    	FirebaseOptions options = new FirebaseOptions.Builder()
    	        .setCredentials(GoogleCredentials.fromStream((is)))
    	        .build();

        return FirebaseApp.initializeApp(options);
    }
}
