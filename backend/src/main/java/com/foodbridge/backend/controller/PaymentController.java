package com.foodbridge.backend.controller;

import com.foodbridge.backend.entity.Payment;
import com.foodbridge.backend.service.PaymentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "http://localhost:5173")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;


    // =========================
    // GET ALL PAYMENTS
    // =========================

    @GetMapping
    public List<Payment> getAllPayments() {

        return paymentService.getAllPayments();
    }


    // =========================
    // GET PAYMENT BY ID
    // =========================

    @GetMapping("/{id}")
    public Payment getPaymentById(@PathVariable Long id) {

        return paymentService.getPaymentById(id);
    }


    // =========================
    // GET PAYMENT BY ORDER
    // =========================

    @GetMapping("/order/{orderId}")
    public Payment getPaymentByOrder(
            @PathVariable Long orderId) {

        return paymentService.getPaymentByOrder(orderId);
    }


    // =========================
    // CREATE PAYMENT
    // =========================

    @PostMapping
    public Payment createPayment(
            @RequestBody Payment payment) {

        return paymentService.createPayment(payment);
    }


    // =========================
    // UPDATE PAYMENT
    // =========================

    @PutMapping("/{id}")
    public Payment updatePayment(
            @PathVariable Long id,
            @RequestBody Payment payment) {

        return paymentService.updatePayment(
                id,
                payment
        );
    }


    // =========================
    // DELETE PAYMENT
    // =========================

    @DeleteMapping("/{id}")
    public String deletePayment(
            @PathVariable Long id) {

        paymentService.deletePayment(id);

        return "Payment deleted successfully";
    }
}