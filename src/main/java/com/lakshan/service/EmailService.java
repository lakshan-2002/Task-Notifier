package com.lakshan.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class EmailService {

    private final JavaMailSender javaMailSender;
    private final Logger logger = Logger.getLogger(EmailService.class.getName());

    @Value("${spring.mail.username}")
    private String senderEmail;

    @Autowired
    public EmailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    @Async
    public void sendEmail(String recipientEmail, String subject, String body) {
        logger.log(Level.FINE, "Preparing to send email to {0} with subject " +
                        "\"{1}\" (body length: {2} chars)",
                new Object[]{recipientEmail, subject, body == null ? 0 : body.length()});

        try {
            SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
            simpleMailMessage.setFrom(senderEmail);
            simpleMailMessage.setTo(recipientEmail);
            simpleMailMessage.setSubject(subject);
            simpleMailMessage.setText(body);

            javaMailSender.send(simpleMailMessage);
            logger.log(Level.INFO, "Email sent to {0} with subject \"{1}\"",
                    new Object[]{recipientEmail, subject});

        } catch (Exception e) {
            logger.log(Level.SEVERE, "Failed to send email to {0} with subject \"{1}\"",
                    new Object[]{recipientEmail, subject});
            logger.log(Level.SEVERE, "Exception while sending email", e);
        }

    }

}
