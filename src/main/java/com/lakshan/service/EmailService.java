package com.lakshan.service;

import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.IOException;
import org.slf4j.Logger;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Async
    public void sendEmail(String recipientEmail, String subject, String body) throws IOException {
        Email fromEmail = new Email("dailytasks.reminder@gmail.com");
        Email toEmail = new Email(recipientEmail);
        Content emailContent = new Content("text/plain", body);
        Mail mail = new Mail(fromEmail, subject, toEmail, emailContent);

        // Configure SendGrid client
        SendGrid sendGrid = new SendGrid(System.getenv("SENDGRID_API_KEY"));
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sendGrid.api(request);

            if (response.getStatusCode() >= 200 && response.getStatusCode() < 300) {
                log.info("Email sent successfully to {}", recipientEmail);
            } else {
                log.error("Failed to send email to {}. Status Code: {}, Body: {}",
                        recipientEmail, response.getStatusCode(), response.getBody());
            }
        } catch (Exception e) {
            throw new IOException(e);
        }

    }

}
