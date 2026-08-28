package com.foodbridge.backend.service;

import com.foodbridge.backend.entity.Order;
import com.foodbridge.backend.entity.Payment;
import com.foodbridge.backend.repository.OrderRepository;
import com.foodbridge.backend.repository.PaymentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderRepository orderRepository;


    // =========================
    // CREATE PAYMENT
    // =========================

    public Payment createPayment(Payment payment) {

        if (payment.getOrder() == null ||
                payment.getOrder().getId() == null) {

            throw new RuntimeException("Order ID is required");
        }

        // Get the actual order from database
        Order order = orderRepository
                .findById(payment.getOrder().getId())
                .orElseThrow(() ->
                        new RuntimeException(
                                "Order not found with ID: "
                                        + payment.getOrder().getId()
                        )
                );

        // Set actual order
        payment.setOrder(order);

        // Automatically use order amount
        payment.setAmount(order.getTotalAmount());

        // Set default payment status
        if (payment.getPaymentStatus() == null ||
                payment.getPaymentStatus().isEmpty()) {

            payment.setPaymentStatus("PENDING");
        }

        return paymentRepository.save(payment);
    }


    // =========================
    // GET ALL PAYMENTS
    // =========================

    public List<Payment> getAllPayments() {

        return paymentRepository.findAll();
    }


    // =========================
    // GET PAYMENT BY ID
    // =========================

    public Payment getPaymentById(Long id) {

        return paymentRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Payment not found with ID: " + id
                        )
                );
    }


    // =========================
    // GET PAYMENT BY ORDER
    // =========================

    public Payment getPaymentByOrder(Long orderId) {

        return paymentRepository
                .findByOrderId(orderId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Payment not found for Order ID: "
                                        + orderId
                        )
                );
    }


    // =========================
    // UPDATE PAYMENT
    // =========================

    public Payment updatePayment(
            Long id,
            Payment updatedPayment) {

        Payment existingPayment =
                paymentRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Payment not found with ID: "
                                                + id
                                )
                        );

        existingPayment.setPaymentMethod(
                updatedPayment.getPaymentMethod()
        );

        existingPayment.setPaymentStatus(
                updatedPayment.getPaymentStatus()
        );

        return paymentRepository.save(existingPayment);
    }


    // =========================
    // DELETE PAYMENT
    // =========================

    public void deletePayment(Long id) {

        Payment payment =
                paymentRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Payment not found with ID: "
                                                + id
                                )
                        );

        paymentRepository.delete(payment);
    }
}