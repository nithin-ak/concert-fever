package com.concertfever.concertfever_backend.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    private final JavaMailSender mailSender;

    public EmailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendHtmlMessage(String toEmailId, String subject, String htmlBody) throws MessagingException {
        MimeMessage message = mailSender.createMimeMessage();

        message.setFrom(new InternetAddress("info@concertfever.com"));
        message.setRecipients(MimeMessage.RecipientType.TO, toEmailId);
        message.setSubject(subject);
        message.setContent(htmlBody, "text/html; charset=utf-8");

        mailSender.send(message);
    }
}
