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

    @Bean
    public FirebaseApp initializeFirebase() throws IOException {
        String firebaseConfig = "{\r\n"
                + "  \"type\": \"service_account\",\r\n"
                + "  \"project_id\": \"rango-f7631\",\r\n"
                + "  \"private_key_id\": \"5307e5ba351f5961ef09f7ed1241e07a7b4bcbc1\",\r\n"
                + "  \"private_key\": \"-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC81iy6tWn5Ytnk\\nkY8HGGv6BQvXuweJHXwHDdxihlqgUGirAFpD8ST/5mIcgiTBlVMZRO3GWKwcqUyD\\niXAx/E/BUyOfyNm3Gd7bvoXHQHlfkGO6rzWKJmRzFGdCzA8UfRssCcHvDa5N6ma4\\ntHkKSOz0eI/9T8z8I6dDETtn8SXqFnDoXs7gtRSTixFq4ZJ4uKkzRLI/bk2n62Zv\\n6XtzJU43skUcbNJRealNoFvrhdT7yg91N/iXllPHM9g3/SYaCD4RvUQMKVJcetEE\\noJuv25zoBvZUvTfR1XBzU7llTTS5568ZrdqxU2JqP/rayNTBW1ZhN9EZmc51YNQH\\ng9Q744bJAgMBAAECggEABjZVil7leZrS6D4Ron4fLz5zQUmZ2dzqc6D1GxioapW6\\nm8WLMqkAOprtp1pwsx2iejZWTCwmnVrEdZ9T3ZEbXpTJmzwUTX3AYyJFbGSmmYo6\\nfa296SmSLGcDbqMf6+ChwDUh+CdPEKkhb/of8UKs6O3+bqrtZ24U1pP+jFDWmnjM\\nDhMhs7BEgKba5wxkJun5nDoSjhXRrKIX8D+xyzm7g61eG8YxQ5wF0mDAB5bsQkt8\\n24dk312EFyn05ea8znAx5Knr/XrLUX83/+hjpWwWAVHZFWdBMT5jwvYQoi1peFj5\\nHgNBOvWPb2hTbuznZ7JN7zuqB+jdj8vwfQTnyTWCcQKBgQDf5vDaxM5GIjsl4wq9\\nCPWrWwhBCi9wukBjrSyofbOgjhnj7vDPM0IBOs/gucCsvyOdRC4DKFPjfnm2ZMD+\\nEMvJVfQb1J3E8F0Q5V4zlkIHTnQ8A1kAuLFDzHBd7dCbvgJ7BlXHrFImI5PQq42m\\nYKSQ51Ohsu7cvWYvpESPJu9bvwKBgQDX6FqByQabCdk8C/XM+Eu3SkM8eCtrH5DS\\nCYycd6M5Iaddt6kCbdtYeJ/ABblNI4H5q4wMYTPHmEa2BwxW6rhhKJJ1tJouZaP8\\nEeoeRGCobl6sKIFaqRoUvms9/afcN+yg9dpNLQtmbpjUTom/KtdZeqbEHLS+WFXM\\npRmnJWxfdwKBgQDQkbeBgt1H1bFVfKbPKt52jiklNRC2KLm8YF/+YIIIqPaTLkyi\\nJvRwYtGsXDyQbskFQbK+/D0Q6QsGDdr9kLXUyj3IAwoon2OCTreuxGSjm8CI+vFY\\ny7NNHc76oIK34Ys8AM29X9dycafLNVORTetelC6CrUT22XOsI5A97Z4AzwKBgAIe\\nSn0JfuIYh6QaLfAz43JJ7TzzpOFpLt+Qrmt+lQBjfyPhQGxAra1Bibe1lqrWFVlg\\nwIACmCJ2MQNqMEnOBb8WSdGT0wtvfdtkRZrEavpcEtu3jgVYsWPQtnamPXZgqhau\\nMtUdAwafQSqcFqfkgLZlCKvV6EQR082tNQI50MVjAoGAT4KTyBC/aoi8jh1IRgxz\\nabm2FPBpMJQhfiHY4G7agUY6YgWyC3R/E6zpZv/pZIQD/N5Pfa48nNAYCS6ZWRAB\\nNeYnZKqkP1eQAAfBBsaESN1OcTFb5fD0BFMQDw0i+7Llt0oglM0R/TJ9UnUg8D9D\\n7mQxeuGUAoJT0pRL542P6g4=\\n-----END PRIVATE KEY-----\\n\",\r\n"
                + "  \"client_email\": \"firebase-adminsdk-k5jv5@rango-f7631.iam.gserviceaccount.com\",\r\n"
                + "  \"client_id\": \"109881520424238563684\",\r\n"
                + "  \"auth_uri\": \"https://accounts.google.com/o/oauth2/auth\",\r\n"
                + "  \"token_uri\": \"https://oauth2.googleapis.com/token\",\r\n"
                + "  \"auth_provider_x509_cert_url\": \"https://www.googleapis.com/oauth2/v1/certs\",\r\n"
                + "  \"client_x509_cert_url\": \"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-k5jv5%40rango-f7631.iam.gserviceaccount.com\",\r\n"
                + "  \"universe_domain\": \"googleapis.com\"\r\n"
                + "}";
        Gson gson = new Gson();
        JsonObject jsonObject = gson.fromJson(firebaseConfig, JsonObject.class);

        InputStream is = new ByteArrayInputStream(jsonObject.toString().getBytes());

        FirebaseOptions options = new FirebaseOptions.Builder()
                .setCredentials(GoogleCredentials.fromStream((is)))
                .build();

        return FirebaseApp.initializeApp(options);
    }
}